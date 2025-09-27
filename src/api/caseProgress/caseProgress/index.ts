import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CaseProgressVO, CaseProgressForm, CaseProgressQuery } from '@/api/caseProgress/caseProgress/types';

/**
 * 查询案件进展表列表
 * @param query
 * @returns {*}
 */

export const listCaseProgress = (query?: CaseProgressQuery): AxiosPromise<CaseProgressVO[]> => {
  return request({
    url: '/caseProgress/caseProgress/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询案件进展表详细
 * @param id
 */
export const getCaseProgress = (id: string | number): AxiosPromise<CaseProgressVO> => {
  return request({
    url: '/caseProgress/caseProgress/' + id,
    method: 'get'
  });
};

/**
 * 新增案件进展表
 * @param data
 */
export const addCaseProgress = (data: CaseProgressForm) => {
  return request({
    url: '/caseProgress/caseProgress',
    method: 'post',
    data: data
  });
};

/**
 * 修改案件进展表
 * @param data
 */
export const updateCaseProgress = (data: CaseProgressForm) => {
  return request({
    url: '/caseProgress/caseProgress',
    method: 'put',
    data: data
  });
};

/**
 * 删除案件进展表
 * @param id
 */
export const delCaseProgress = (id: string | number | Array<string | number>) => {
  return request({
    url: '/caseProgress/caseProgress/' + id,
    method: 'delete'
  });
};
