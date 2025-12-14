export interface DcExpenseReimbursementVO {
  id: string | number;
  applyDate: string;
  applicantId: string | number;
  applicantName: string;
  departmentId: string | number;
  departmentName: string;
  position: string;
  expenseReason: string;
  expenseDate: string;
  expenseType: string;
  expenseDescription: string;
  invoiceCount: number;
  invoiceAmount: number;
  reimbursementAmount: number;
  differenceReason: string;
  attachmentPath: string;
  advancedAmount: number;
  refundOrSupplement: number;
  status: string;
  paymentMethod: string;
  receiverBankAccount: string;
  receiverBankName: string;
  receiverName: string;
  financeVoucherNo: string;
  paymentDate: string;
  financePayerId: string | number;
  financePayerName: string;
  remark: string;
  delFlag: string;
  createTime?: string;
}

export interface DcExpenseReimbursementForm extends BaseEntity {
  id?: string | number;
  applyDate?: string;
  applicantId?: string | number;
  applicantName?: string;
  departmentId?: string | number;
  departmentName?: string;
  position?: string;
  expenseReason?: string;
  expenseDate?: string;
  expenseType?: string;
  expenseDescription?: string;
  invoiceCount?: number;
  invoiceAmount?: number;
  reimbursementAmount?: number;
  differenceReason?: string;
  attachmentPath?: string;
  advancedAmount?: number;
  refundOrSupplement?: number;
  status?: string;
  paymentMethod?: string;
  receiverBankAccount?: string;
  receiverBankName?: string;
  receiverName?: string;
  financeVoucherNo?: string;
  paymentDate?: string;
  financePayerId?: string | number;
  financePayerName?: string;
  remark?: string;
}

export interface DcExpenseReimbursementQuery extends PageQuery {
  applicantName?: string;
  departmentName?: string;
  expenseType?: string;
  status?: string;
  applyDate?: string;
  expenseDate?: string;
}