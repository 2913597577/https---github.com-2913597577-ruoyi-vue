<!-- src/components/AddressSelector.vue -->
<template>
  <div class="address-selector">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-select 
          v-model="selectedProvince" 
          placeholder="请选择省份" 
          filterable
          clearable
          @change="handleProvinceChange"
          style="width: 100%"
        >
          <el-option
            v-for="province in provinces"
            :key="province.code"
            :label="province.name"
            :value="province.code"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select 
          v-model="selectedCity" 
          filterable
          placeholder="请选择城市" 
          clearable
          :disabled="!selectedProvince"
          @change="handleCityChange"
          style="width: 100%"
        >
          <el-option
            v-for="city in cities"
            :key="city.code"
            :label="city.name"
            :value="city.code"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select 
          v-model="selectedDistrict" 
          placeholder="请选择区县" 
          clearable
          filterable
          :disabled="!selectedCity"
          style="width: 100%"
        >
          <el-option
            v-for="district in districts"
            :key="district.code"
            :label="district.name"
            :value="district.code"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import provinceCityAreaData from '@/assets/address.json'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      province: '',
      city: '',
      district: ''
    })
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 省市区数据
const provinces = ref<any[]>([])
const cities = ref<any[]>([])
const districts = ref<any[]>([])

// 选中的值
const selectedProvince = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')

// 初始化省份数据
const initProvinces = () => {
  provinces.value = provinceCityAreaData
  
 /*  let shandongCode = ''
  
  // 精确匹配"山东省"
  const shandong = provinces.value.find(p => p.name === '山东省')
  if (shandong) {
    shandongCode = shandong.code
  }

   // 设置默认省份为山东省
  // 注意: 只有在外部没有传入省份值的情况下才设置默认值
  if (shandongCode && !props.modelValue.province) {
    // 使用nextTick确保DOM已渲染
    nextTick(() => {
      selectedProvince.value = shandongCode
      cities.value = getCitiesByProvince(shandongCode)
      
      // 发出更新事件
      emit('update:modelValue', {
        province: shandongCode,
        city: '',
        district: ''
      })
    })
  } */

}

// 根据省份代码获取城市列表
const getCitiesByProvince = (provinceCode: string) => {
  if (!provinceCode) return []
  const province = provinceCityAreaData.find(p => p.code === provinceCode)
  return province?.city || []
}

// 根据城市代码获取区县列表
const getDistrictsByCity = (provinceCode: string, cityCode: string) => {
  if (!provinceCode || !cityCode) return []
  
  // 先找省份
  const province = provinceCityAreaData.find(p => p.code === provinceCode)
  if (!province) return []
  
  // 再找城市
  const city = province.city?.find(c => c.code === cityCode)
  if (city && city.area) {
    return city.area
  }
  
  // 如果城市下没有area，则在省份的area中查找
  if (province.area) {
    return province.area.filter(a => a.code.startsWith(cityCode))
  }
  
  return []
}

// 处理省份变化
const handleProvinceChange = (provinceCode: string) => {
  selectedCity.value = ''
  selectedDistrict.value = ''
  cities.value = getCitiesByProvince(provinceCode)
  districts.value = []
  
  // 发出更新事件
  emit('update:modelValue', {
    province: provinceCode,
    city: '',
    district: ''
  })
}

// 处理城市变化
const handleCityChange = (cityCode: string) => {
  selectedDistrict.value = ''
  districts.value = getDistrictsByCity(selectedProvince.value, cityCode)
  
  // 发出更新事件
  emit('update:modelValue', {
    province: selectedProvince.value,
    city: cityCode,
    district: ''
  })
}

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedProvince.value = newVal.province || ''
    selectedCity.value = newVal.city || ''
    selectedDistrict.value = newVal.district || ''
    
    // 更新城市和区县列表
    if (selectedProvince.value) {
      cities.value = getCitiesByProvince(selectedProvince.value)
    }
    
    if (selectedProvince.value && selectedCity.value) {
      districts.value = getDistrictsByCity(selectedProvince.value, selectedCity.value)
    }
  }
}, { immediate: true, deep: true })

// 监听选中值变化并发出事件
watch([selectedProvince, selectedCity, selectedDistrict], () => {
  emit('update:modelValue', {
    province: selectedProvince.value,
    city: selectedCity.value,
    district: selectedDistrict.value
  })
})

// 根据code查找name
const getNameByCode = (code: string) => {
  // 先在省份中查找
  let province = provinces.value.find(p => p.code === code);
  if (province) return province.name;
  
  // 在所有城市中查找
  for (let province of provinces.value) {
    if (province.city) {
      let city = province.city.find(c => c.code === code);
      if (city) return city.name;
    }
  }
  
  // 在所有区县中查找
  for (let province of provinces.value) {
    if (province.city) {
      for (let city of province.city) {
        if (city.area) {
          let district = city.area.find(a => a.code === code);
          if (district) return district.name;
        }
      }
    }
    // 检查省份直接下的area
    if (province.area) {
      let district = province.area.find(a => a.code === code);
      if (district) return district.name;
    }
  }
  
  return '';
}

// 根据name查找code
const getCodeByName = (name: string) => {
  // 先在省份中查找
  let province = provinces.value.find(p => p.name === name);
  if (province) return province.code;
  
  // 在所有城市中查找
  for (let province of provinces.value) {
    if (province.city) {
      let city = province.city.find(c => c.name === name);
      if (city) return city.code;
    }
  }
  
  // 在所有区县中查找
  for (let province of provinces.value) {
    if (province.city) {
      for (let city of province.city) {
        if (city.area) {
          let district = city.area.find(a => a.name === name);
          if (district) return district.code;
        }
      }
    }
    // 检查省份直接下的area
    if (province.area) {
      let district = province.area.find(a => a.name === name);
      if (district) return district.code;
    }
  }
  
  return '';
}

onMounted(() => {
  initProvinces()
})

defineExpose({
  getNameByCode,
  getCodeByName
});
</script>

<style scoped>
.address-selector {
  width: 100%;
}
</style>
