import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerInformationLogVO, CustomerInformationLogForm, CustomerInformationLogQuery } from '@/api/customerInformationLog/customerInformationLog/types';

/**
 * 查询客户信息记录列表
 * @param query
 * @returns {*}
 */

export const listCustomerInformationLog = (query?: CustomerInformationLogQuery): AxiosPromise<CustomerInformationLogVO[]> => {
  return request({
    url: '/customerInformationLog/customerInformationLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户信息记录详细
 * @param id
 */
export const getCustomerInformationLog = (id: string | number): AxiosPromise<CustomerInformationLogVO> => {
  return request({
    url: '/customerInformationLog/customerInformationLog/' + id,
    method: 'get'
  });
};

/**
 * 新增客户信息记录
 * @param data
 */
export const addCustomerInformationLog = (data: CustomerInformationLogForm) => {
  return request({
    url: '/customerInformationLog/customerInformationLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户信息记录
 * @param data
 */
export const updateCustomerInformationLog = (data: CustomerInformationLogForm) => {
  return request({
    url: '/customerInformationLog/customerInformationLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户信息记录
 * @param id
 */
export const delCustomerInformationLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerInformationLog/customerInformationLog/' + id,
    method: 'delete'
  });
};
