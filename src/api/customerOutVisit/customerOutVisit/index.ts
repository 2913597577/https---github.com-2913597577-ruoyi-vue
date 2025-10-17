import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerOutVisitVO, CustomerOutVisitForm, CustomerOutVisitQuery } from '@/api/customerOutVisit/customerOutVisit/types';

/**
 * 查询客户出访记录列表
 * @param query
 * @returns {*}
 */

export const listCustomerOutVisit = (query?: CustomerOutVisitQuery): AxiosPromise<CustomerOutVisitVO[]> => {
  return request({
    url: '/customerOutVisit/customerOutVisit/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户出访记录详细
 * @param id
 */
export const getCustomerOutVisit = (id: string | number): AxiosPromise<CustomerOutVisitVO> => {
  return request({
    url: '/customerOutVisit/customerOutVisit/' + id,
    method: 'get'
  });
};

/**
 * 新增客户出访记录
 * @param data
 */
export const addCustomerOutVisit = (data: CustomerOutVisitForm) => {
  return request({
    url: '/customerOutVisit/customerOutVisit',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户出访记录
 * @param data
 */
export const updateCustomerOutVisit = (data: CustomerOutVisitForm) => {
  return request({
    url: '/customerOutVisit/customerOutVisit',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户出访记录
 * @param id
 */
export const delCustomerOutVisit = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerOutVisit/customerOutVisit/' + id,
    method: 'delete'
  });
};
