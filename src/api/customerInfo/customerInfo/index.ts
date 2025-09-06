import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerInfoVO, CustomerInfoForm, CustomerInfoQuery } from '@/api/customerInfo/customerInfo/types';

/**
 * 查询客户总表列表
 * @param query
 * @returns {*}
 */

export const listCustomerInfo = (query?: CustomerInfoQuery): AxiosPromise<CustomerInfoVO[]> => {
  return request({
    url: '/customerInfo/customerInfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户总表详细
 * @param id
 */
export const getCustomerInfo = (id: string | number): AxiosPromise<CustomerInfoVO> => {
  return request({
    url: '/customerInfo/customerInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增客户总表
 * @param data
 */
export const addCustomerInfo = (data: CustomerInfoForm) => {
  return request({
    url: '/customerInfo/customerInfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户总表
 * @param data
 */
export const updateCustomerInfo = (data: CustomerInfoForm) => {
  return request({
    url: '/customerInfo/customerInfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户总表
 * @param id
 */
export const delCustomerInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerInfo/customerInfo/' + id,
    method: 'delete'
  });
};
