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
// 获取客户流转单列表
  export const getTransferList = () => {
  return request({
    url: '/common/getTransferList',
    method: 'get'
  })
  }

  // 获取团队业绩统计
export const getPerformance = () => {
  return request({
    url: '/common/getPerformance',
    method: 'get'
  })
  }

  export const getLeaderPerformance = () => {
  return request({
    url: '/common/getLeaderPerformance',
    method: 'get'
  })
  }