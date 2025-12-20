// index.ts
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { 
  DcCustomerRiskRefundVO, 
  DcCustomerRiskRefundQuery, 
  DcCustomerRiskRefundForm 
} from './types';

/**
 * 查询客户风险/退费记录列表
 * @param query 查询参数
 * @returns {*}
 */
export const listDcCustomerRiskRefund = (query?: DcCustomerRiskRefundQuery): AxiosPromise<DcCustomerRiskRefundVO[]> => {
  return request({
    url: '/workflow/customer/refund/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户风险/退费记录详情
 * @param id 记录ID
 */
export const getDcCustomerRiskRefund = (id: string | number): AxiosPromise<DcCustomerRiskRefundVO> => {
  return request({
    url: '/workflow/customer/refund/' + id,
    method: 'get'
  });
};

/**
 * 添加客户风险/退费记录
 * @param data 表单数据
 */
export const addDcCustomerRiskRefund = (data: DcCustomerRiskRefundForm): AxiosPromise<DcCustomerRiskRefundVO> => {
  return request({
    url: '/workflow/customer/refund',
    method: 'post',
    data: data
  });
};

/**
 * 更新客户风险/退费记录
 * @param data 表单数据
 */
export const updateDcCustomerRiskRefund = (data: DcCustomerRiskRefundForm): AxiosPromise<DcCustomerRiskRefundVO> => {
  return request({
    url: '/workflow/customer/refund',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户风险/退费记录
 * @param id 记录ID或ID数组
 */
export const delDcCustomerRiskRefund = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/customer/refund/' + id,
    method: 'delete'
  });
};