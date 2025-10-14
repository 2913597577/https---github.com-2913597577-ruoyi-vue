import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerJobOrderVO, CustomerJobOrderForm, CustomerJobOrderQuery } from '@/api/customerJobOrder/customerJobOrder/types';

/**
 * 查询工单管理列表
 * @param query
 * @returns {*}
 */

export const listCustomerJobOrder = (query?: CustomerJobOrderQuery): AxiosPromise<CustomerJobOrderVO[]> => {
  return request({
    url: '/customerJobOrder/customerJobOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工单管理详细
 * @param id
 */
export const getCustomerJobOrder = (id: string | number): AxiosPromise<CustomerJobOrderVO> => {
  return request({
    url: '/customerJobOrder/customerJobOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增工单管理
 * @param data
 */
export const addCustomerJobOrder = (data: CustomerJobOrderForm) => {
  return request({
    url: '/customerJobOrder/customerJobOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改工单管理
 * @param data
 */
export const updateCustomerJobOrder = (data: CustomerJobOrderForm) => {
  return request({
    url: '/customerJobOrder/customerJobOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除工单管理
 * @param id
 */
export const delCustomerJobOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerJobOrder/customerJobOrder/' + id,
    method: 'delete'
  });
};

// 接工单接口
export function acceptCustomerJobOrder(id: string) {
  return request({
    url: '/customerJobOrder/customerJobOrder/accept',
    method: 'get',
    params: { id }
  })
};
