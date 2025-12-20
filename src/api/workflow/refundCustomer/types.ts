// types.ts
export interface DcCustomerRiskRefundVO {
  id: string | number;
  lawyerId: string | number;
  customerId: string | number;
  customerName: string;
  principal: string;
  principalPhone: string;
  inviterId: string | number;
  signDate: string;
  expireDate: string;
  contractAmount: number;
  serviceHours: string;
  reasons: string;
  refundAmount: number;
  remark1: string;
  remark2: string;
  remark3: string;
  status: string;
  delFlag: string;
  createTime?: string;
  // 新增字段
  contractNo: string;
  refundMethod: string;
  refundBank: string;
  bankNumber: string;
  refundAccountName: string;
  refundDate: string;
  refundVoucherNo: string;
  financePayer: string;
  accountingVoucherNo: string;
  actualReceipt: number;
  balance: number;
}

export interface DcCustomerRiskRefundForm extends BaseEntity {
  id?: string | number;
  lawyerId?: string | number;
  customerId?: string | number;
  customerName?: string;
  principal?: string;
  principalPhone?: string;
  inviterId?: string | number;
  signDate?: string;
  expireDate?: string;
  contractAmount?: number;
  serviceHours?: string;
  reasons?: string;
  refundAmount?: number;
  remark1?: string;
  remark2?: string;
  remark3?: string;
  status?: string;
  // 新增字段
  contractNo?: string;
  refundMethod?: string;
  refundBank?: string;
  bankNumber?: string;
  refundAccountName?: string;
  refundDate?: string;
  refundVoucherNo?: string;
  financePayer?: string;
  accountingVoucherNo?: string;
  actualReceipt?: number;
  balance?: number;
}

export interface DcCustomerRiskRefundQuery extends PageQuery {
  lawyerId?: string | number;
  customerId?: string | number;
  customerName?: string;
  principal?: string;
  reasons?: string;
  status?: string;
  contractNo?: string;
  refundMethod?: string;
  refundBank?: string;
  refundAccountName?: string;
  financePayer?: string;
  accountingVoucherNo?: string;
}