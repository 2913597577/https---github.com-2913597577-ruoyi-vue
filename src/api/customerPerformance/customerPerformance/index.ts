import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerPerformanceVO, CustomerPerformanceForm, CustomerPerformanceQuery } from '@/api/customerPerformance/customerPerformance/types';

/**
 * 查询业绩归属登记列表
 * @param query
 * @returns {*}
 */

export const listCustomerPerformance = (query?: CustomerPerformanceQuery): AxiosPromise<CustomerPerformanceVO[]> => {
  return request({
    url: '/customerPerformance/customerPerformance/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业绩归属登记详细
 * @param id
 */
export const getCustomerPerformance = (id: string | number): AxiosPromise<CustomerPerformanceVO> => {
  return request({
    url: '/customerPerformance/customerPerformance/' + id,
    method: 'get'
  });
};

/**
 * 新增业绩归属登记
 * @param data
 */
export const addCustomerPerformance = (data: CustomerPerformanceForm) => {
  return request({
    url: '/customerPerformance/customerPerformance',
    method: 'post',
    data: data
  });
};

/**
 * 修改业绩归属登记
 * @param data
 */
export const updateCustomerPerformance = (data: CustomerPerformanceForm) => {
  return request({
    url: '/customerPerformance/customerPerformance',
    method: 'put',
    data: data
  });
};

/**
 * 删除业绩归属登记
 * @param id
 */
export const delCustomerPerformance = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerPerformance/customerPerformance/' + id,
    method: 'delete'
  });
};
