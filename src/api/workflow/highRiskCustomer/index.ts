import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DcHighRiskCustomerVO, DcHighRiskCustomerQuery, DcHighRiskCustomerForm } from '@/api/workflow/highRiskCustomer/types';

/**
 * Query high risk customer list
 * @param query
 * @returns {*}
 */
export const listDcHighRiskCustomer = (query?: DcHighRiskCustomerQuery): AxiosPromise<DcHighRiskCustomerVO[]> => {
  return request({
    url: '/workflow/high/risk/customer/list',
    method: 'get',
    params: query
  });
};

/**
 * Query high risk customer details
 * @param id
 */
export const getDcHighRiskCustomer = (id: string | number): AxiosPromise<DcHighRiskCustomerVO> => {
  return request({
    url: '/workflow/high/risk/customer/' + id,
    method: 'get'
  });
};

/**
 * Add high risk customer
 * @param data
 */
export const addDcHighRiskCustomer = (data: DcHighRiskCustomerForm): AxiosPromise<DcHighRiskCustomerVO> => {
  return request({
    url: '/workflow/high/risk/customer',
    method: 'post',
    data: data
  });
};

/**
 * Update high risk customer
 * @param data
 */
export const updateDcHighRiskCustomer = (data: DcHighRiskCustomerForm): AxiosPromise<DcHighRiskCustomerVO> => {
  return request({
    url: '/workflow/high/risk/customer',
    method: 'put',
    data: data
  });
};

/**
 * Delete high risk customer
 * @param id
 */
export const delDcHighRiskCustomer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/high/risk/customer/' + id,
    method: 'delete'
  });
};
