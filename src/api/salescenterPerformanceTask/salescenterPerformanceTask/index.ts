import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PerformanceTaskVO, PerformanceTaskForm, PerformanceTaskQuery } from '@/api/salescenterPerformanceTask/salescenterPerformanceTask/types';

/**
 * 查询业绩任务列表
 * @param query
 * @returns {*}
 */

export const listPerformanceTask = (query?: PerformanceTaskQuery): AxiosPromise<PerformanceTaskVO[]> => {
  return request({
    url: '/salescenterPerformanceTask/salescenterPerformanceTask/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询业绩任务详细
 * @param id
 */
export const getPerformanceTask = (id: string | number): AxiosPromise<PerformanceTaskVO> => {
  return request({
    url: '/salescenterPerformanceTask/salescenterPerformanceTask/' + id,
    method: 'get'
  });
};

/**
 * 新增业绩任务
 * @param data
 */
export const addPerformanceTask = (data: PerformanceTaskForm) => {
  return request({
    url: '/salescenterPerformanceTask/salescenterPerformanceTask',
    method: 'post',
    data: data
  });
};

/**
 * 修改业绩任务
 * @param data
 */
export const updatePerformanceTask = (data: PerformanceTaskForm) => {
  return request({
    url: '/salescenterPerformanceTask/salescenterPerformanceTask',
    method: 'put',
    data: data
  });
};

/**
 * 删除业绩任务
 * @param id
 */
export const delPerformanceTask = (id: string | number | Array<string | number>) => {
  return request({
    url: '/salescenterPerformanceTask/salescenterPerformanceTask/' + id,
    method: 'delete'
  });
};
