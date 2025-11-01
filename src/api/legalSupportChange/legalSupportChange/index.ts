import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LegalSupportChangeVO, LegalSupportChangeForm, LegalSupportChangeQuery } from '@/api/legalSupportChange/legalSupportChange/types';

/**
 * 查询法务支持变更列表
 * @param query
 * @returns {*}
 */

export const listLegalSupportChange = (query?: LegalSupportChangeQuery): AxiosPromise<LegalSupportChangeVO[]> => {
  return request({
    url: '/legalSupportChange/legalSupportChange/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询法务支持变更详细
 * @param id
 */
export const getLegalSupportChange = (id: string | number): AxiosPromise<LegalSupportChangeVO> => {
  return request({
    url: '/legalSupportChange/legalSupportChange/' + id,
    method: 'get'
  });
};

/**
 * 新增法务支持变更
 * @param data
 */
export const addLegalSupportChange = (data: LegalSupportChangeForm) => {
  return request({
    url: '/legalSupportChange/legalSupportChange',
    method: 'post',
    data: data
  });
};

/**
 * 修改法务支持变更
 * @param data
 */
export const updateLegalSupportChange = (data: LegalSupportChangeForm) => {
  return request({
    url: '/legalSupportChange/legalSupportChange',
    method: 'put',
    data: data
  });
};

/**
 * 删除法务支持变更
 * @param id
 */
export const delLegalSupportChange = (id: string | number | Array<string | number>) => {
  return request({
    url: '/legalSupportChange/legalSupportChange/' + id,
    method: 'delete'
  });
};
