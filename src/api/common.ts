import request from '@/utils/request'

// 获取当前用户关联的客户列表
export const getCustomerByUserId = () => {
  return request({
    url: '/common/getCustomerByUserId',
    method: 'get'
  })
}


// 获取客户意向列表
export const getIntentionCustomerByUserId = () => {
  return request({
    url: '/common/getIntentionCustomerByUserId',
    method: 'get'
  })
}

// 获取客户类型
export const getCustomerType = () => {
  return request({
    url: '/common/getCustomerType',
    method: 'get'
  })
}

// 获取客户类型统计
export const getCustomerCategory = () => {
  return request({
    url: '/common/getCustomerCategory',
    method: 'get'
  })
}

// 获取服务数据统计
export const getServiceData = (params?: {
  year?: number
  month?: number
  day?: number
  lawyerId?: string
}) => {
  return request({
    url: '/common/getServiceData',
    method: 'get',
    params
  })
}

export const getRiskRefundData = (params?: {
  year?: number
  month?: number
  day?: number
}) => {
  return request({
    url: '/common/getRiskRefundData',
    method: 'get',
    params
  })
}

// 获取案件详情
export const getCaseDetail=()=>{
  return request({
    url: '/common/getCaseDetail',
    method: 'get'
  })
}

// 获取法务支持业绩统计
export const getLegalSupportPerformance = () => {
  return request({
    url: '/common/getLegalSupportPerformance',
    method: 'get'
  })
  }
// 获取法务支持业绩统计(支持按月份筛选)
export function listMonthLegalSupportPerformance(query?: any) {
  return request({
    url: '/common/getMonthlyPerformanceAmount', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query 
  })
}
// 获取法务支持业绩统计(支持按年份筛选)
export function listYearLegalSupportPerformance(query?: any) {
  return request({
    url: '/common/getYearlyPerformanceAmount', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query 
  })
}

// 获取客户流转单列表
  export const getTransferList = () => {
  return request({
    url: '/common/getTransferList',
    method: 'get'
  })
  }

  // 获取流转单、二次收费流转单、客户总表 客户基本信息
  export const getCustomerWithTransferInfo = () => {
    return request({
      url: '/common/getCustomerWithTransferInfo',
      method: 'get'
    })
    }

  // 获取法务支持团队业绩统计
export const getPerformance = () => {
  return request({
    url: '/common/getPerformance',
    method: 'get'
  })
  }

  // 获取法务支持团队业绩统计(支持按月份筛选)
export function listMonthTeamPerformance(query?: any) {
  return request({
    url: '/common/getMonthlyTeamPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
}

// 获取法务支持团队业绩统计(支持按年份筛选)
export function listYearTeamPerformance(query?: any) {
  return request({
    url: '/common/getYearlyTeamPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
} 

// 获取法务支持业绩管理模块数据
  export const getLeaderPerformance = () => {
  return request({
    url: '/common/getLeaderPerformance',
    method: 'get'
  })
  }

   // 获取法务支持业绩管理模块(支持按月份筛选)
export function listMonthLeaderPerformance(query?: any) {
  return request({
    url: '/common/getMonthlyLeaderPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
}

 // 获取法务支持业绩管理模块(支持按年份筛选)
 export function listYearLeaderPerformance(query?: any) {
  return request({
    url: '/common/getYearlyLeaderPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
}


// 获取销售中心业绩管理模块数据
  export const getSalescenterLeaderPerformance = () => {
  return request({
    url: '/common/getSalescenterLeaderPerformance',
    method: 'get'
  })
  }

   // 获取销售中心业绩管理模块(支持按月份筛选)
export function listMonthSalescenterLeaderPerformance(query?: any) {
  return request({
    url: '/common/getMonthlySalescenterLeaderPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
}

 // 获取销售中心业绩管理模块(支持按年份筛选)
 export function listYearSalescenterLeaderPerformance(query?: any) {
  return request({
    url: '/common/getYearlySalescenterLeaderPerformance', // 请替换为实际的后端接口地址
    method: 'get', 
    params: query
  })
}

