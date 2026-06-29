<template>
  <div class="legal-leader-performance">
    <!-- 客户统计卡片 -->
    <!-- <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>区域客户信息统计</h3>
          </div>
          <div class="statistic-content">
      <div 
       v-for="cityCode in sortedCityCodes" 
       :key="cityCode" 
       class="city-stat-item"
      >
  
      <div class="city-header">
      <span class="city-name">{{ getCityName(cityCode) }}</span>
      </div>
      <div class="stat-item">
                <span class="label">客户数量：</span>
                <span class="value">{{ staticCityPerformanceData[cityCode].customerTotal }}</span>
                <span class="label">近15天未跟进客户：</span>
                <span class="value">{{ staticCityPerformanceData[cityCode].outStandingTotal }}</span>
      </div>
              
              <div class="stat-item">
                <span class="label">意向客户数量：</span>
                <span class="value">{{ staticCityPerformanceData[cityCode].intentionTotal }}</span>
                <span class="label">前7后7临期客户数量：</span>
                <span class="value">{{ staticCityPerformanceData[cityCode].expiringTotal }}</span>
                <span class="label">尾款客户数量：</span>
                <span class="value">{{ staticCityPerformanceData[cityCode].balanceTotal }}</span>
              </div>
              
              <div class="progress-item">
                <h4>月度业绩完成率</h4>
                <el-progress
                  :percentage="calculateMonthPerformanceRate(staticCityPerformanceData[cityCode].teamPerformance)"
                  :format="(percent) => `${percent}%`"
                  color="#67c23a"
                  :stroke-width="3"
                />
                <div class="progress-info">
                  <span>已完成：{{ formatCurrency(staticCityPerformanceData[cityCode].teamPerformance?.teamMonthAchievedBalance || 0) }}</span>
                  <span>目标：{{ formatCurrency(staticCityPerformanceData[cityCode].teamPerformance?.teamMonthPerformanceGoal || 0) }}</span>
                </div>
                
                <h4>年度业绩完成率</h4>
                <el-progress
                  :percentage="calculateYearPerformanceRate(staticCityPerformanceData[cityCode].teamPerformance)"
                  :format="(percent) => `${percent}%`"
                  color="#67c23a"
                  :stroke-width="3"
                />
                <div class="progress-info">
                  <span>已完成：{{ formatCurrency(staticCityPerformanceData[cityCode].teamPerformance?.teamYearAchievedBalance || 0) }}</span>
                  <span>目标：{{ formatCurrency(staticCityPerformanceData[cityCode].teamPerformance?.teamYearPerformanceGoal || 0) }}</span>
                </div>
              </div>
            </div>
  
          </div>
        </el-card>
      </el-col>
    </el-row>
 -->
  
    <!-- 业绩展示框 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="performance-card">
          <div class="performance-header">
            <h3>区域业绩展示</h3>
          </div>
          <div class="performance-content">
            <!-- 各城市业绩情况 -->
            <div class="city-performance-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4>
                区域月度业绩情况 （{{ currentDisplayMonth }}）
              </h4>
              <el-button type="primary" icon="Search" size="small" @click="showMonthFilterDialog = true">
                  筛选
                </el-button>
              </div>
              <el-table :data="monthCityPerformanceList" stripe style="width: 100%">
                <el-table-column prop="cityName" label="城市" width="120" />
                <el-table-column prop="monthAchievedBalance" label="本月完成业绩" width="150">
                  <template #default="scope">
                    <span style="color: #ff6b35; font-weight: bold;">
                    {{ formatCurrency(scope.row.monthAchievedBalance) }}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRate" label="本月完成率" width="120">
                  <template #default="scope">
                    {{ scope.row.monthPerformanceRate }}%
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRank" label="本月排名" width="120">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getMonthRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
                  </el-table-column>
                  <el-table-column label="月份" width="120">
                    <template #default="scope">
                      {{ currentDisplayMonth }}
                  </template>
                  </el-table-column> 
              </el-table>
            </div>

            <!-- 个人业绩排名 -->
            <div class="personal-ranking-section">
              <h4>
                个人月度业绩排名（{{ currentDisplayMonth }}）
              </h4>
              <el-table :data="monthPersonalRankings" stripe style="width: 100%" height="425">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="monthAchievedBalance" label="本月业绩" width="150">
                  <template #default="scope">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <span style="color: #ff6b35; font-weight: bold;">
                      {{ formatCurrency(getMonthAchieved(scope.row)) }} 
                    </span> 
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRank" label="本月排名" width="120">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getMonthRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
                  </el-table-column>
                  <el-table-column prop="city" label="归属城市" width="120">
                    <template #default="scope">
                    {{ scope.row.monthPerformanceAchieved?.[0]?.city || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="月份" width="120">
                    <template #default="scope">
                      {{ currentDisplayMonth }}
                  </template>
                  </el-table-column> 
              </el-table>
            </div>

            <div class="city-performance-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4>
                区域年度业绩情况（{{ currentDisplayYear }}）
              </h4>
              <el-button type="primary" icon="Search" size="small" @click="showYearFilterDialog = true">
                  筛选
              </el-button>
              </div>
              <el-table :data="yearCityPerformanceList" stripe style="width: 100%">
                <el-table-column prop="cityName" label="城市" width="120" />
                <el-table-column prop="yearAchievedBalance" label="年度完成业绩" width="150">
                  <template #default="scope">
                    <span style="color: #ff6b35; font-weight: bold;">
                    {{ formatCurrency(scope.row.yearAchievedBalance) }}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRate" label="年度完成率" width="120">
                  <template #default="scope">
                    {{ scope.row.yearPerformanceRate }}%
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRank" label="年度排名" width="120">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getYearRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
              </el-table-column>
              <el-table-column label="年份" width="120">
                    <template #default="scope">
                      {{ currentDisplayYear }}
                  </template>
                  </el-table-column> 
              </el-table>
            </div>

            <div class="personal-ranking-section">
              <h4>
                个人年度业绩排名（{{ currentDisplayYear }}）
              </h4>
              <el-table :data="yearPersonalRankings" stripe style="width: 100%" height="425">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="yearAchievedBalance" label="年度业绩" width="150">
                  <template #default="scope">
                    <!-- {{ formatCurrency(scope.row.yearAchievedBalance) }} -->
                    <span style="color: #ff6b35; font-weight: bold;">
                      {{ formatCurrency(getYearAchieved(scope.row)) }}
                    </span>  
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRank" label="年度排名" width="120">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getYearRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
              </el-table-column>
              <el-table-column prop="city" label="归属城市" width="120">
                    <template #default="scope">
                    {{ scope.row.yearPerformanceAchieved?.[0]?.city || '-' }}
                    </template>
              </el-table-column>
              <el-table-column label="年份" width="120">
                    <template #default="scope">
                      {{ currentDisplayYear }}
                  </template>
                  </el-table-column> 
              </el-table>
            </div>
          </div>
        </el-card>

<!-- 新增：月份业绩数据筛选弹窗 -->
<el-dialog v-model="showMonthFilterDialog" title="月份业绩数据筛选" width="500px" append-to-body draggable @open="clearMonthFilter">
            <el-form :model="filterMonthForm" label-width="80px" size="small">
             
               <!-- 修改此处：使用 el-date-picker -->
     <el-form-item label="请选择月份">
       <el-date-picker 
         v-model="filterMonthForm.month" 
         type="month" 
         value-format="YYYY-MM"
         placeholder="请选择月份" 
         style="width: 100%" 
       />
     </el-form-item>
            </el-form>

            <template #footer>
              <div class="dialog-footer">
                <!-- <el-button @click="showMonthFilterDialog = false">取消</el-button> -->
                <el-button @click="resetMonthFilter">重置</el-button>
                <el-button type="primary" @click="handleMonthFilterConfirm">确定</el-button>
              </div>
            </template>
          </el-dialog>

<!-- 新增：年份业绩数据筛选弹窗 -->
<el-dialog v-model="showYearFilterDialog" title="年份业绩数据筛选" width="500px" append-to-body draggable  @open="clearYearFilter">
            <el-form :model="filterYearForm" label-width="80px" size="small">
                <el-form-item label="请选择年份">
       <el-date-picker 
         v-model="filterYearForm.year" 
         type="year" 
         value-format="YYYY"
         placeholder="请选择年份" 
         style="width: 100%" 
       />
     </el-form-item>
            </el-form>

            <template #footer>
              <div class="dialog-footer">
                <!-- <el-button @click="showYearFilterDialog = false">取消</el-button> -->
                <el-button @click="resetYearFilter">重置</el-button>
                <el-button type="primary" @click="handleYearFilterConfirm">确定</el-button>
              </div>
            </template>
          </el-dialog>


      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalLeaderPerformance" lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getSalescenterLeaderPerformance } from '@/api/common'
import { listMonthSalescenterLeaderPerformance } from '@/api/common'
import { listYearSalescenterLeaderPerformance } from '@/api/common'

// 【新增】用于顶部卡片的静态数据（不随筛选改变，除非重置或刷新页面）
const staticCityPerformanceData = ref<any>({})

// 数据响应式变量
const cityPerformanceData = ref<any>({})
const cityPerformanceList = ref<any[]>([])
// 【新增】独立存储月度成员列表 个人月度业绩排名
const monthPerformanceList = ref<any[]>([])
// 【新增】独立存储年度成员列表 个人年度业绩排名
const yearPerformanceList = ref<any[]>([])

const monthCityPerformanceList = ref<any[]>([]) // 专用于“区域月度业绩情况”表格
const yearCityPerformanceList = ref<any[]>([])  // 专用于“区域年度业绩情况”表格

// 1. 定义弹窗显示状态
const showMonthFilterDialog = ref(false)
const showYearFilterDialog = ref(false)

// 2. 定义筛选表单
const filterMonthForm = reactive({
  month: undefined as string | undefined
})

const filterYearForm = reactive({
  year: undefined as string | undefined,
})



// 【新增】计算属性：获取按客户数量降序排列的城市代码列表
// 【修改】顶部卡片排序基于 staticCityPerformanceData
const sortedCityCodes = computed(() => {
  if (!staticCityPerformanceData.value) return []
  
  // 1. 将对象转换为数组: [{ code: 'BZ', data: {...} }, ...]
  const cityArray = Object.entries(staticCityPerformanceData.value).map(([code, data]: [string, any]) => ({
    code,
    data
  }))

  // 2. 按客户数量 (customerTotal) 降序排序
  cityArray.sort((a, b) => {
    const countA = a.data.customerTotal || 0
    const countB = b.data.customerTotal || 0
    return countB - countA // 降序：从大到小
  })

  // 3. 返回排序后的代码数组 ['QD', 'JN', ...]
  return cityArray.map(item => item.code)
})


// 获取区域法务经理业绩数据(页面初始化)
const fetchLeaderData = async () => {
  try {
    const response = await getSalescenterLeaderPerformance()
    if (response && response.data) {
      // 1. 赋值原始数据
      // 用于顶部卡片静态数据
      staticCityPerformanceData.value = response.data
      // 下方表格动态数据，随筛选改变
      cityPerformanceData.value = response.data
      
      //console.log('获取区域业绩数据:', cityPerformanceData.value)

     // 1. 构建基础列表数据
     const listData = buildCityList(response.data)
      
      // 2. 分别赋值给月度和年度列表（初始状态两者数据一致）
      monthCityPerformanceList.value = [...listData]
      yearCityPerformanceList.value = [...listData]
      
      // 3. 填充个人列表
      updatePersonalLists(response.data)

    }
    } catch (error) {
    console.error('获取区域业绩失败:', error)
  }
}

// 【新增】提取构建列表的逻辑，方便复用
const buildCityList = (data: any) => {
  const cityValues = Object.entries(data)
  return cityValues.map(([code, city]: [string, any]) => {
    const perf = city.teamPerformance || {}
    return {
      cityCode: code,
      cityName: city.cityName || getCityName(code),
      monthAchievedBalance: perf.teamMonthAchievedBalance || 0,
      yearAchievedBalance: perf.teamYearAchievedBalance || 0,
      monthPerformanceRate: calculateMonthPerformanceRate(perf),
      yearPerformanceRate: calculateYearPerformanceRate(perf)
    }
  })
}

// 【新增】辅助函数：填充月度和年度个人业绩列表
const updatePersonalLists = (data: any) => {
  const cityValues = Object.entries(data)
  const tempMonthList: any[] = []
  const tempYearList: any[] = []

  cityValues.forEach(([code, cityData]: [string, any]) => {
    // 确保 teamPerformanceList 存在且为数组
    if (Array.isArray(cityData.teamPerformanceList)) {
      // 将当前城市的成员列表添加到总列表中
      tempMonthList.push(...cityData.teamPerformanceList)
      tempYearList.push(...cityData.teamPerformanceList)
    }
  })

  // 赋值给响应式变量，触发计算属性（monthPersonalRankings/yearPersonalRankings）自动更新
  monthPerformanceList.value = tempMonthList
  yearPerformanceList.value = tempYearList
}


// 获取区域法务经理业绩数据(月份筛选)
const listMonthLeaderData = async () => {
  try {
    // 1. 构造请求参数，使用表单中选中的月份
    const params = {
      month: filterMonthForm.month
    }

    const response = await listMonthSalescenterLeaderPerformance(params)
    if (response && response.data) {
      // 2. 赋值原始数据
      cityPerformanceData.value = response.data
      
      //console.log('获取月度区域业绩数据:', cityPerformanceData.value)

      // 1. 构建新的月度列表数据
      const newList = buildCityList(response.data)
      
      // 2. 【关键】按本月业绩排序
      newList.sort((a, b) => (b.monthAchievedBalance || 0) - (a.monthAchievedBalance || 0))
      
      // 3. 【关键】只更新月度列表，年度列表保持原样不变
      monthCityPerformanceList.value = newList


      // 3. 更新个人月度列表
      const cityValues = Object.entries(response.data)
      const tempMonthList: any[] = []
      
      cityValues.forEach(([code, cityData]: [string, any]) => {
        // 确保 teamPerformanceList 存在且为数组
        if (Array.isArray(cityData.teamPerformanceList)) {
          // 将当前城市下的所有成员加入临时数组
          tempMonthList.push(...cityData.teamPerformanceList)
        }
      })

      // 5. 赋值给响应式变量
      // 由于 monthPersonalRankings 是 computed 且依赖 monthPerformanceList
      // 这里赋值后，表格会自动根据新的月度数据进行降序排序
      monthPerformanceList.value = tempMonthList

      // 【可选】如果需要清洗数据（例如处理目标为0的情况），可以在这里添加
      // monthPerformanceList.value.forEach(member => { ... })
    }
  } catch (error) {
    console.error('获取月度区域业绩失败:', error)
  }
}

// 获取区域法务经理业绩数据(年份筛选)
const listYearLeaderData = async () => {
  try {
    // 1. 构造请求参数，使用表单中选中的年份
    const params = {
      year: filterYearForm.year
    }

    const response = await listYearSalescenterLeaderPerformance(params)
    if (response && response.data) {
      // 2. 赋值原始数据
      cityPerformanceData.value = response.data
      
      //console.log('获取年度区域业绩数据:', cityPerformanceData.value)
       // 1. 构建新的年度列表数据
       const newList = buildCityList(response.data)
      
      // 2. 【关键】按年度业绩排序
      newList.sort((a, b) => (b.yearAchievedBalance || 0) - (a.yearAchievedBalance || 0))
      
      // 3. 【关键】只更新年度列表，月度列表保持原样不变
      yearCityPerformanceList.value = newList

      // 3. 更新个人年度列表
      const cityValues = Object.entries(response.data)
      const tempYearList: any[] = []
     
      
      cityValues.forEach(([code, cityData]: [string, any]) => {
        // 确保 teamPerformanceList 存在且为数组
        if (Array.isArray(cityData.teamPerformanceList)) {
          // 将当前城市下的所有成员加入临时数组
          tempYearList.push(...cityData.teamPerformanceList)
        }
      })

      // 5. 赋值给响应式变量
      // 由于 yearPersonalRankings 是 computed 且依赖 yearPerformanceList
      // 这里赋值后，表格会自动根据新的年度数据进行降序排序
      yearPerformanceList.value = tempYearList

      // 【可选】如果需要清洗数据（例如处理年度目标为0的情况），可以在这里添加
      // yearPerformanceList.value.forEach(member => { ... })
    }
  } catch (error) {
    console.error('获取年度区域业绩失败:', error)
  }
}



// 4. 修改月份筛选确认逻辑
const handleMonthFilterConfirm = () => {
  listMonthLeaderData()
  //showMonthFilterDialog.value = false
}

// 5. 新增：重置月份筛选
const resetMonthFilter = () => {
  filterMonthForm.month = undefined
  //listMonthPerformanceData()
  //showMonthFilterDialog.value = false
}

const clearMonthFilter = () => {
  filterMonthForm.month = undefined
}
// 6. 修改年份筛选确认逻辑 (补充之前缺失的部分)
const handleYearFilterConfirm = () => {
  listYearLeaderData()
  //showYearFilterDialog.value = false
}

// 7. 重置年份筛选
const resetYearFilter = () => {
  //filterMonthForm.month = undefined
  filterYearForm.year = undefined
  //listYearPerformanceData()
  //showYearFilterDialog.value = false
}
const clearYearFilter = () => {
  //filterMonthForm.month = undefined
  filterYearForm.year = undefined
}

// 计算城市月度业绩完成率
const calculateMonthPerformanceRate = (teamPerformance: any) => {
  if (!teamPerformance?.teamMonthPerformanceGoal) return 0
  return Math.round((teamPerformance.teamMonthAchievedBalance / teamPerformance.teamMonthPerformanceGoal) * 100)
}

// 计算城市年度业绩完成率
const calculateYearPerformanceRate = (teamPerformance: any) => {
  if (!teamPerformance?.teamYearPerformanceGoal) return 0
  return Math.round((teamPerformance.teamYearAchievedBalance / teamPerformance.teamYearPerformanceGoal) * 100)
}

// 格式化金额
const formatCurrency = (value: string | number) => {
  if (!value && value !== 0) return '¥0.00'
  return '¥' + parseFloat(value.toString()).toFixed(2)
}

// 新增：获取月度完成业绩
const getMonthAchieved = (member: any) => {
   // 判断数组是否存在且不为空
   if (member.monthPerformanceAchieved && member.monthPerformanceAchieved.length > 0) {
    // 尝试多种可能的字段名
    const obj = member.monthPerformanceAchieved[0];
    return parseFloat(obj.monthBalance || obj.balance || 0);
  }
  return 0;
}

// 新增：获取年度完成业绩
const getYearAchieved = (member: any) => {
  // 判断数组是否存在且不为空
  if (member.yearPerformanceAchieved && member.yearPerformanceAchieved.length > 0) {
    const obj = member.yearPerformanceAchieved[0];
    // 使用 parseFloat 确保返回的是数字类型，方便后续排序计算
    // 请根据后端实际返回的字段名调整，这里兼容 monthBalance, balance, yearBalance
    return parseFloat(obj.monthBalance || obj.balance || obj.yearBalance || 0);
  }
  return 0;
}

// 【新增】月度个人业绩排名（按月业绩降序）
const monthPersonalRankings = computed(() => {
 // 1. 复制年度成员列表数组，避免修改原数据
 const list = [...monthPerformanceList.value]
  
  // 2. 根据年度业绩金额降序排序 (由大到小)
  list.sort((a, b) => {
    // 使用 getYearAchieved 获取每个人的年度总业绩
    const amountA = getMonthAchieved(a)
    const amountB = getMonthAchieved(b)
    return amountB - amountA
  })
  
  // 3. 取前50名 (如果需要全部排名，可以去掉 .slice(0, 50))
  return list.slice(0, 100)
})

const yearPersonalRankings = computed(() => {
  // 1. 复制年度成员列表数组，避免修改原数据
  const list = [...yearPerformanceList.value]
  
  // 2. 根据年度业绩金额降序排序 (由大到小)
  list.sort((a, b) => {
    // 使用 getYearAchieved 获取每个人的年度总业绩
    const amountA = getYearAchieved(a)
    const amountB = getYearAchieved(b)
    return amountB - amountA
  })
  
  // 3. 取前50名 (如果需要全部排名，可以去掉 .slice(0, 50))
  return list.slice(0, 100)
})

// 【新增】计算当前显示的月份
const currentDisplayMonth = computed(() => {
  // 1. 优先使用筛选表单中选中的月份
  if (filterMonthForm.month) {
    return filterMonthForm.month;
  }

  // 2. 如果没有选中，尝试从已加载的数据中获取（作为备选方案）
  // 注意：这取决于后端返回的数据结构中是否包含明确的月份字段
  if (monthPerformanceList.value && monthPerformanceList.value.length > 0) {
    const firstMember = monthPerformanceList.value[0];
    // 假设数据结构和之前讨论的一致
    if (firstMember.monthPerformanceAchieved && firstMember.monthPerformanceAchieved.length > 0) {
      // 尝试从业绩数组中获取月份，字段名可能是 'month', 'statMonth' 等，需根据实际后端返回调整
      const monthData = firstMember.monthPerformanceAchieved[0];
      if (monthData.month) return monthData.month;
    }
  }

  // 3. 默认返回当前系统年月 (格式: YYYY-MM)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

// 【新增】计算当前显示的年份
const currentDisplayYear = computed(() => {
  // 1. 优先使用筛选表单中选中的年份
  if (filterYearForm.year) {
    return filterYearForm.year;
  }

  // 2. 如果没有选中，尝试从已加载的年度数据中获取（作为备选方案）
  if (yearPerformanceList.value && yearPerformanceList.value.length > 0) {
    const firstMember = yearPerformanceList.value[0];
    // 假设年度业绩数据存储在 yearPerformanceAchieved 数组中
    if (firstMember.yearPerformanceAchieved && firstMember.yearPerformanceAchieved.length > 0) {
      // 尝试获取年份字段，通常可能是 'year' 或 'statYear'，请根据后端实际返回调整
      const yearData = firstMember.yearPerformanceAchieved[0];
      if (yearData.year) return yearData.year;
    }
  }

  // 3. 默认返回当前系统年份 (格式: YYYY)
  return new Date().getFullYear().toString();
});

// 城市代码映射表
const cityMap: Record<string, string> = {
  'BZ': '滨州',
  'DY': '东营',
  'DZ': '德州',
  'HZ': '菏泽',
  'JN': '济宁',
  'LC': '聊城',
  'QD': '青岛',
  'TA': '泰安',
  'WH': '威海',
  'ZB': '淄博'
  // 添加其他城市...
}

// 获取城市名称的方法
const getCityName = (code: string) => {
  return cityMap[code] || code // 如果找不到映射，就显示代码本身
}

onMounted(() => {
  fetchLeaderData()
})
</script>

<style lang="scss" scoped>
.legal-leader-performance {
  padding: 20px;

  .statistic-card,
  .performance-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .statistic-header,
  .performance-header {
    padding: 1px 20px;
    border-radius: 8px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;
    color:#1890ff;
  }

  .statistic-content,
  .performance-content {
    padding: 20px;
  }

  .city-stat-item {
    margin-bottom: 30px;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .city-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    
    .city-name {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .stat-item {
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px dashed #ebeef5;
    &:last-child {
      border-bottom: none;
    }
  }

  .label {
    font-weight: 500;
    color: #333;
    margin-right: 10px;
  }

  .value {
    font-size: 20px;
    font-weight: 600;
    color: #ff6b35;
    margin-right: 20px;
  }

  .progress-item,
  .chart-item,
  .ranking-item,
  .annual-performance {
    margin-bottom: 20px;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .annual-performance {
    h4 {
      margin-bottom: 10px;
    }
    
    .annual-amount {
      font-size: 24px;
      font-weight: bold;
      color: #1890ff;
    }
  }

  .city-performance-section,
  .personal-ranking-section {
    margin-bottom: 20px;
    
    h4 {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .el-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    
    th {
      background-color: #f5f7fa;
      font-weight: 500;
      color: #333;
    }
    
    td {
      padding: 12px 16px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .city-stat-item {
      padding: 10px;
    }
    
    .city-header {
      margin-bottom: 10px;
    }
    
    .stat-item {
      margin-bottom: 10px;
    }
  }
}
</style>