import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerIntentionVO, CustomerIntentionForm, CustomerIntentionQuery } from '@/api/customerIntention/customerIntention/types';

/**
 * 查询客户意向登记列表
 * @param query
 * @returns {*}
 */

export const listCustomerIntention = (query?: CustomerIntentionQuery): AxiosPromise<CustomerIntentionVO[]> => {
  return request({
    url: '/customerIntention/customerIntention/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户意向登记详细
 * @param id
 */
export const getCustomerIntention = (id: string | number): AxiosPromise<CustomerIntentionVO> => {
  return request({
    url: '/customerIntention/customerIntention/' + id,
    method: 'get'
  });
};

/**
 * 新增客户意向登记
 * @param data
 */
export const addCustomerIntention = (data: CustomerIntentionForm) => {
  return request({
    url: '/customerIntention/customerIntention',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户意向登记
 * @param data
 */
export const updateCustomerIntention = (data: CustomerIntentionForm) => {
  return request({
    url: '/customerIntention/customerIntention',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户意向登记
 * @param id
 */
export const delCustomerIntention = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerIntention/customerIntention/' + id,
    method: 'delete'
  });
};
