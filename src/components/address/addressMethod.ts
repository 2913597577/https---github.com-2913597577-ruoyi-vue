// src/utils/addressMethod.ts
import provinceCityAreaData from '@/assets/address.json'

// 根据code查找name
export const getNameByCode = (code: string) => {
  // 先在省份中查找
  let province = provinceCityAreaData.find(p => p.code === code);
  if (province) return province.name;
  
  // 在所有城市中查找
  for (let province of provinceCityAreaData) {
    if (province.city) {
      let city = province.city.find(c => c.code === code);
      if (city) return city.name;
    }
  }
  
  // 在所有区县中查找
  for (let province of provinceCityAreaData) {
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
export const getCodeByName = (name: string) => {
  // 先在省份中查找
  let province = provinceCityAreaData.find(p => p.name === name);
  if (province) return province.code;
  
  // 在所有城市中查找
  for (let province of provinceCityAreaData) {
    if (province.city) {
      let city = province.city.find(c => c.name === name);
      if (city) return city.code;
    }
  }
  
  // 在所有区县中查找
  for (let province of provinceCityAreaData) {
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