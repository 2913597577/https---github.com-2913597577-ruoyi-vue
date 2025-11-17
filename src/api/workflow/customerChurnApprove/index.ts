import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DcCustomerChurnApproveVO, DcCustomerChurnApproveQuery, DcCustomerChurnApproveForm } from '@/api/workflow/customerChurnApprove/types';

/**
 * Query customer churn approval list
 * @param query
 * @returns {*}
 */
export const listDcCustomerChurnApprove = (query?: DcCustomerChurnApproveQuery): AxiosPromise<DcCustomerChurnApproveVO[]> => {
  return request({
    url: '/workflow/customer/churn/approve/list',
    method: 'get',
    params: query
  });
};

/**
 * Query customer churn approval details
 * @param id
 */
export const getDcCustomerChurnApprove = (id: string | number): AxiosPromise<DcCustomerChurnApproveVO> => {
  return request({
    url: '/workflow/customer/churn/approve/' + id,
    method: 'get'
  });
};

/**
 * Add customer churn approval
 * @param data
 */
export const addDcCustomerChurnApprove = (data: DcCustomerChurnApproveForm): AxiosPromise<DcCustomerChurnApproveVO> => {
  return request({
    url: '/workflow/customer/churn/approve',
    method: 'post',
    data: data
  });
};

/**
 * Update customer churn approval
 * @param data
 */
export const updateDcCustomerChurnApprove = (data: DcCustomerChurnApproveForm): AxiosPromise<DcCustomerChurnApproveVO> => {
  return request({
    url: '/workflow/customer/churn/approve',
    method: 'put',
    data: data
  });
};

/**
 * Delete customer churn approval
 * @param id
 */
export const delDcCustomerChurnApprove = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/customer/churn/approve/' + id,
    method: 'delete'
  });
};
