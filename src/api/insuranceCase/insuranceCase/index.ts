import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InsuranceCaseVO, InsuranceCaseForm, InsuranceCaseQuery } from '@/api/insuranceCase/insuranceCase/types';

/**
 * 查询保险记录表列表
 * @param query
 * @returns {*}
 */

export const listInsuranceCase = (query?: InsuranceCaseQuery): AxiosPromise<InsuranceCaseVO[]> => {
  return request({
    url: '/insuranceCase/insuranceCase/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询保险记录表详细
 * @param id
 */
export const getInsuranceCase = (id: string | number): AxiosPromise<InsuranceCaseVO> => {
  return request({
    url: '/insuranceCase/insuranceCase/' + id,
    method: 'get'
  });
};

/**
 * 新增保险记录表
 * @param data
 */
export const addInsuranceCase = (data: InsuranceCaseForm) => {
  return request({
    url: '/insuranceCase/insuranceCase',
    method: 'post',
    data: data
  });
};

/**
 * 修改保险记录表
 * @param data
 */
export const updateInsuranceCase = (data: InsuranceCaseForm) => {
  return request({
    url: '/insuranceCase/insuranceCase',
    method: 'put',
    data: data
  });
};

/**
 * 删除保险记录表
 * @param id
 */
export const delInsuranceCase = (id: string | number | Array<string | number>) => {
  return request({
    url: '/insuranceCase/insuranceCase/' + id,
    method: 'delete'
  });
};
