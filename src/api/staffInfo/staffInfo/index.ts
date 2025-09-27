import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { StaffInfoVO, StaffInfoForm, StaffInfoQuery } from '@/api/staffInfo/staffInfo/types';

/**
 * 查询员工档案列表
 * @param query
 * @returns {*}
 */

export const listStaffInfo = (query?: StaffInfoQuery): AxiosPromise<StaffInfoVO[]> => {
  return request({
    url: '/staffInfo/staffInfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询员工档案详细
 * @param id
 */
export const getStaffInfo = (id: string | number): AxiosPromise<StaffInfoVO> => {
  return request({
    url: '/staffInfo/staffInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增员工档案
 * @param data
 */
export const addStaffInfo = (data: StaffInfoForm) => {
  return request({
    url: '/staffInfo/staffInfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改员工档案
 * @param data
 */
export const updateStaffInfo = (data: StaffInfoForm) => {
  return request({
    url: '/staffInfo/staffInfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除员工档案
 * @param id
 */
export const delStaffInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/staffInfo/staffInfo/' + id,
    method: 'delete'
  });
};
