export interface DcHighRiskCustomerVO {
  id: string | number;
  customerId: string | number;
  customerName: string;
  evidenceText: string;
  riskDiscoveryDate: string;
  isRefundMentioned: number;
  riskDetermination: string;
  complianceIssues: string;
  remark: string;
  status?: string;
  createTime?: string;
}

export interface DcHighRiskCustomerForm extends BaseEntity {
  id?: string | number;
  customerId?: string | number;
  customerName?: string;
  evidenceText?: string;
  riskDiscoveryDate?: string;
  isRefundMentioned?: number;
  riskDetermination?: string;
  complianceIssues?: string;
  remark?: string;
  status?: string;
}

export interface DcHighRiskCustomerQuery extends PageQuery {
  // Query fields based on actual requirements
  customerId?: string | number;
  customerName?: string;
  riskDetermination?: string;
}
