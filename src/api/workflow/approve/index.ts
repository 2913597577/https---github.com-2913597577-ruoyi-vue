import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ApproveVO, ApproveQuery, ApproveForm } from '@/api/workflow/approve/types';

/**
 * 查询审批列表
 * @param query
 * @returns {*}
 */
export const listApprove = (query?: ApproveQuery): AxiosPromise<ApproveVO[]> => {
  return request({
    url: '/workflow/approve/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询审批详细
 * @param id
 */
export const getApprove = (id: string | number): AxiosPromise<ApproveVO> => {
  return request({
    url: '/workflow/approve/' + id,
    method: 'get'
  });
};

/**
 * 新增审批
 * @param data
 */
export const addApprove = (data: ApproveForm): AxiosPromise<ApproveVO> => {
  return request({
    url: '/workflow/approve',
    method: 'post',
    data: data
  });
};

/**
 * 修改审批
 * @param data
 */
export const updateApprove = (data: ApproveForm): AxiosPromise<ApproveVO> => {
  return request({
    url: '/workflow/approve',
    method: 'put',
    data: data
  });
};

/**
 * 删除审批
 * @param id
 */
export const delApprove = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/approve/' + id,
    method: 'delete'
  });
};