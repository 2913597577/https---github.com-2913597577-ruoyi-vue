export interface DcCustomerChurnApproveVO {
  id: string | number;
  tenantId?: string;
  applyType: string;
  customerId: string | number;
  customerName: string;
  remark: string;
  status?: string;
  createTime?: string;
}

export interface DcCustomerChurnApproveForm extends BaseEntity {
  id?: string | number;
  tenantId?: string;
  applyType?: string;
  customerId?: string | number;
  customerName?: string;
  remark?: string;
  status?: string;
}

export interface DcCustomerChurnApproveQuery extends PageQuery {
  // Query fields based on actual requirements
  applyType?: string;
  customerId?: string | number;
  customerName?: string;
}
