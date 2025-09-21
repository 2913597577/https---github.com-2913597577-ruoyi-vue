import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerIntentionTrackingVO, CustomerIntentionTrackingForm, CustomerIntentionTrackingQuery } from '@/api/customerIntentionTracking/customerIntentionTracking/types';

/**
 * 查询意向客户跟踪记录列表
 * @param query
 * @returns {*}
 */

export const listCustomerIntentionTracking = (query?: CustomerIntentionTrackingQuery): AxiosPromise<CustomerIntentionTrackingVO[]> => {
  return request({
    url: '/customerIntentionTracking/customerIntentionTracking/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询意向客户跟踪记录详细
 * @param id
 */
export const getCustomerIntentionTracking = (id: string | number): AxiosPromise<CustomerIntentionTrackingVO> => {
  return request({
    url: '/customerIntentionTracking/customerIntentionTracking/' + id,
    method: 'get'
  });
};

/**
 * 新增意向客户跟踪记录
 * @param data
 */
export const addCustomerIntentionTracking = (data: CustomerIntentionTrackingForm) => {
  return request({
    url: '/customerIntentionTracking/customerIntentionTracking',
    method: 'post',
    data: data
  });
};

/**
 * 修改意向客户跟踪记录
 * @param data
 */
export const updateCustomerIntentionTracking = (data: CustomerIntentionTrackingForm) => {
  return request({
    url: '/customerIntentionTracking/customerIntentionTracking',
    method: 'put',
    data: data
  });
};

/**
 * 删除意向客户跟踪记录
 * @param id
 */
export const delCustomerIntentionTracking = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerIntentionTracking/customerIntentionTracking/' + id,
    method: 'delete'
  });
};
