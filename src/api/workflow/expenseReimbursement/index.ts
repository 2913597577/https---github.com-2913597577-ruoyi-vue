import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DcExpenseReimbursementVO, DcExpenseReimbursementQuery, DcExpenseReimbursementForm } from '@/api/workflow/expenseReimbursement/types';

/**
 * Query expense reimbursement list
 * @param query
 * @returns {*}
 */
export const listDcExpenseReimbursement = (query?: DcExpenseReimbursementQuery): AxiosPromise<DcExpenseReimbursementVO[]> => {
  return request({
    url: '/workflow/expense/reimbursement/list',
    method: 'get',
    params: query
  });
};

/**
 * Export expense reimbursement list
 * @param query
 * @returns {*}
 */
export const exportDcExpenseReimbursement = (query?: DcExpenseReimbursementQuery) => {
  return request({
    url: '/workflow/expense/reimbursement/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  });
};

/**
 * Query expense reimbursement details
 * @param id
 */
export const getDcExpenseReimbursement = (id: string | number): AxiosPromise<DcExpenseReimbursementVO> => {
  return request({
    url: '/workflow/expense/reimbursement/' + id,
    method: 'get'
  });
};

/**
 * Add expense reimbursement
 * @param data
 */
export const addDcExpenseReimbursement = (data: DcExpenseReimbursementForm): AxiosPromise<DcExpenseReimbursementVO> => {
  return request({
    url: '/workflow/expense/reimbursement',
    method: 'post',
    data: data
  });
};

/**
 * Update expense reimbursement
 * @param data
 */
export const updateDcExpenseReimbursement = (data: DcExpenseReimbursementForm): AxiosPromise<DcExpenseReimbursementVO> => {
  return request({
    url: '/workflow/expense/reimbursement',
    method: 'put',
    data: data
  });
};

/**
 * Delete expense reimbursement
 * @param id
 */
export const delDcExpenseReimbursement = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workflow/expense/reimbursement/' + id,
    method: 'delete'
  });
};