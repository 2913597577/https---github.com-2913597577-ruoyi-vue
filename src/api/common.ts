import request from '@/utils/request'

// 获取当前用户关联的客户列表
export const getCustomerByUserId = () => {
  return request({
    url: '/common/getCustomerByUserId',
    method: 'get'
  })
}