import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerRiskRefundVO, CustomerRiskRefundForm, CustomerRiskRefundQuery } from '@/api/customerRiskRefund/customerRiskRefund/types';

/**
 * 查询客户风险/退费列表
 * @param query
 * @returns {*}
 */

export const listCustomerRiskRefund = (query?: CustomerRiskRefundQuery): AxiosPromise<CustomerRiskRefundVO[]> => {
  return request({
    url: '/customerRiskRefund/customerRiskRefund/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户风险/退费详细
 * @param id
 */
export const getCustomerRiskRefund = (id: string | number): AxiosPromise<CustomerRiskRefundVO> => {
  return request({
    url: '/customerRiskRefund/customerRiskRefund/' + id,
    method: 'get'
  });
};

/**
 * 新增客户风险/退费
 * @param data
 */
export const addCustomerRiskRefund = (data: CustomerRiskRefundForm) => {
  return request({
    url: '/customerRiskRefund/customerRiskRefund',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户风险/退费
 * @param data
 */
export const updateCustomerRiskRefund = (data: CustomerRiskRefundForm) => {
  return request({
    url: '/customerRiskRefund/customerRiskRefund',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户风险/退费
 * @param id
 */
export const delCustomerRiskRefund = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customerRiskRefund/customerRiskRefund/' + id,
    method: 'delete'
  });
};
