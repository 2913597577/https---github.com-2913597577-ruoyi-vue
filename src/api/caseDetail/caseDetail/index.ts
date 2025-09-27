import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CaseDetailVO, CaseDetailForm, CaseDetailQuery } from '@/api/caseDetail/caseDetail/types';

/**
 * 查询欠款案件表列表
 * @param query
 * @returns {*}
 */

export const listCaseDetail = (query?: CaseDetailQuery): AxiosPromise<CaseDetailVO[]> => {
  return request({
    url: '/caseDetail/caseDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询欠款案件表详细
 * @param id
 */
export const getCaseDetail = (id: string | number): AxiosPromise<CaseDetailVO> => {
  return request({
    url: '/caseDetail/caseDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增欠款案件表
 * @param data
 */
export const addCaseDetail = (data: CaseDetailForm) => {
  return request({
    url: '/caseDetail/caseDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改欠款案件表
 * @param data
 */
export const updateCaseDetail = (data: CaseDetailForm) => {
  return request({
    url: '/caseDetail/caseDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除欠款案件表
 * @param id
 */
export const delCaseDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/caseDetail/caseDetail/' + id,
    method: 'delete'
  });
};
