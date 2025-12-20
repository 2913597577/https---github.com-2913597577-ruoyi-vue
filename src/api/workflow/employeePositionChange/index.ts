import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DcEmployeePositionChangeVO, DcEmployeePositionChangeQuery, DcEmployeePositionChangeForm } from '@/api/workflow/employeePositionChange/types';

/**
 * Query employee position change list
 * @param query
 * @returns {*}
 */
export const listDcEmployeePositionChange = (query?: DcEmployeePositionChangeQuery): AxiosPromise<DcEmployeePositionChangeVO[]> => {
  return request({
    url: '/workflow/employee/position/change/list',
    method: 'get',
    params: query
  });
};

/**
 * Export employee position change list
 * @param query
 * @returns {*}
 */
export const exportDcEmployeePositionChange = (query?: DcEmployeePositionChangeQuery): AxiosPromise<Blob> => {
  return request({
    url: '/workflow/employee/position/change/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  });
};

/**
 * Query employee position change details
 * @param id
 */
export const getDcEmployeePositionChange = (id: string | number): AxiosPromise<DcEmployeePositionChangeVO> => {
  return request({
    url: '/workflow/employee/position/change/' + id,
    method: 'get'
  });
};

/**
 * Add employee position change
 * @param data
 */
export const addDcEmployeePositionChange = (data: DcEmployeePositionChangeForm): AxiosPromise<DcEmployeePositionChangeVO> => {
  return request({
    url: '/workflow/employee/position/change',
    method: 'post',
    data: data
  });
};

/**
 * Update employee position change
 * @param data
 */
export const updateDcEmployeePositionChange = (data: DcEmployeePositionChangeForm): AxiosPromise<DcEmployeePositionChangeVO> => {
  return request({
    url: '/workflow/employee/position/change',
    method: 'put',
    data: data
  });
};

/**
 * Delete employee position change
 * @param ids
 */
export const delDcEmployeePositionChange = (ids: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/employee/position/change/' + ids,
    method: 'delete'
  });
};