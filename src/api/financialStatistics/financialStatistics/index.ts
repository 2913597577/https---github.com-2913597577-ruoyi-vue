import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FinancialStatisticsVO, FinancialStatisticsForm, FinancialStatisticsQuery } from '@/api/financialStatistics/financialStatistics/types';

/**
 * 查询财务统计列表
 * @param query
 * @returns {*}
 */

export const listFinancialStatistics = (query?: FinancialStatisticsQuery): AxiosPromise<FinancialStatisticsVO[]> => {
  return request({
    url: '/financialStatistics/financialStatistics/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询财务统计详细
 * @param id
 */
export const getFinancialStatistics = (id: string | number): AxiosPromise<FinancialStatisticsVO> => {
  return request({
    url: '/financialStatistics/financialStatistics/' + id,
    method: 'get'
  });
};

/**
 * 新增财务统计
 * @param data
 */
export const addFinancialStatistics = (data: FinancialStatisticsForm) => {
  return request({
    url: '/financialStatistics/financialStatistics',
    method: 'post',
    data: data
  });
};

/**
 * 修改财务统计
 * @param data
 */
export const updateFinancialStatistics = (data: FinancialStatisticsForm) => {
  return request({
    url: '/financialStatistics/financialStatistics',
    method: 'put',
    data: data
  });
};

/**
 * 删除财务统计
 * @param id
 */
export const delFinancialStatistics = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financialStatistics/financialStatistics/' + id,
    method: 'delete'
  });
};


export function getFinancialStatisticsData(query: any) {
  return request({
    url: '/financialStatistics/financialStatistics/statistics',
    method: 'get',
    params: query
  });
}