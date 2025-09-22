import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerTrackingVO, CustomerTrackingForm, CustomerTrackingQuery } from '@/api/myCustomer/customerTracking/types';

/**
 * 查询客户跟踪列表
 * @param query
 * @returns {*}
 */

export const listCustomerTracking = (query?: CustomerTrackingQuery): AxiosPromise<CustomerTrackingVO[]> => {
  return request({
    url: '/myCustomer/customerTracking/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户跟踪详细
 * @param id
 */
export const getCustomerTracking = (id: string | number): AxiosPromise<CustomerTrackingVO> => {
  return request({
    url: '/myCustomer/customerTracking/' + id,
    method: 'get'
  });
};

/**
 * 新增客户跟踪
 * @param data
 */
export const addCustomerTracking = (data: CustomerTrackingForm) => {
  return request({
    url: '/myCustomer/customerTracking',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户跟踪
 * @param data
 */
export const updateCustomerTracking = (data: CustomerTrackingForm) => {
  return request({
    url: '/myCustomer/customerTracking',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户跟踪
 * @param id
 */
export const delCustomerTracking = (id: string | number | Array<string | number>) => {
  return request({
    url: '/myCustomer/customerTracking/' + id,
    method: 'delete'
  });
};

/**
 * 提交客户跟踪
 * @param id 
 * @param status 
 */
export const submitCustomerTracking = (id: string | number, submitStatus: string | number) => {
  return request({
    url: '/myCustomer/customerTracking/submit',
    method: 'post',
    data: { id, submitStatus }
  });
};