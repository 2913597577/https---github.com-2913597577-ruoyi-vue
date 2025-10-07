import request from '@/utils/request'

// 获取当前用户关联的客户列表
export const getCustomerByUserId = () => {
  return request({
    url: '/common/getCustomerByUserId',
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