import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerTransferVO, CustomerTransferForm, CustomerTransferQuery } from '@/api/myCustomer/customerTransfer/types';

/**
 * 查询客户信息录入列表
 * @param query
 * @returns {*}
 */

export const listCustomerTransfer = (query?: CustomerTransferQuery): AxiosPromise<CustomerTransferVO[]> => {
  return request({
    url: '/myCustomer/customerTransfer/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户信息录入详细
 * @param id
 */
export const getCustomerTransfer = (id: string | number): AxiosPromise<CustomerTransferVO> => {
  return request({
    url: '/myCustomer/customerTransfer/' + id,
    method: 'get'
  });
};

/**
 * 新增客户信息录入
 * @param data
 */
export const addCustomerTransfer = (data: CustomerTransferForm) => {
  return request({
    url: '/myCustomer/customerTransfer',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户信息录入
 * @param data
 */
export const updateCustomerTransfer = (data: CustomerTransferForm) => {
  return request({
    url: '/myCustomer/customerTransfer',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户信息录入
 * @param id
 */
export const delCustomerTransfer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/myCustomer/customerTransfer/' + id,
    method: 'delete'
  });
};

/**
 * 流转单财务审核
 * @param id
 * @param auditStatus
 * @param pictureFile
 */
export const audit = (id: string | number, auditStatus: string,isSecondaryCharge:string, pictureFile:  File | string) => {
  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('auditStatus', auditStatus);
  formData.append('isSecondaryCharge', isSecondaryCharge);
  formData.append('pictureUrl', pictureFile || '');

  return request({
    url: '/myCustomer/customerTransfer/audit',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

