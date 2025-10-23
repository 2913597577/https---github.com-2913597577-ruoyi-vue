export interface CustomerTransferVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 公司名称
   */
  companyName: string;

  /**
   * 公司对接人
   */
  contactPerson: string;

  /**
   * 公司对接人联系方式
   */
  contactInfo: string;

  /**
   * 对接人职务
   */
  contactPosition: string;

  /**
   * 对接人年龄
   */
  contactAge: number;

  /**
   * 附赠自然人
   */
  additionalPerson: string;

  /**
   * 附赠自然人联系方式
   */
  additionalContact: string;

  /**
   * 附赠自然人职务
   */
  additionalPosition: string;

  /**
   * 附赠自然人年龄
   */
  additionalAge: number;

  /**
   * 公司所属行业
   */
  companyIndustry: string;

  /**
   * 公司地址
   */
  companyAddress: string;

  /**
   * 员工人数
   */
  employeeCount: number;

  /**
   * 是否有代账公司(1:是,0:否)
   */
  accountingCompany: number;

  /**
   * 客户性格及工作习惯描述
   */
  customerDescription: string;

  /**
   * 实付金额
   */
  actualPayment: number;

  /**
   * 尾款情况
   */
  balanceStatus: number;

  /**
   * 签约类型(1-常法 2-单项 3-律师费 4-其他)
   */
  contractType: number;

  /**
   * 常法签约(1-升级版 2-标准版 3-其他)
   */
  serviceType: number;

  /**
   * 服务周期开始时间
   */
  serviceStart: string;

  /**
   * 服务周期结束时间
   */
  serviceEnd: string;

  /**
   * 律师咨询情况
   */
  lawyerConsultation: string;

  /**
   * 其他费用沟通
   */
  otherFee: string;

  /**
   * 财务是否确认(1:是,0:否)
   */
  financeConfirmed: number;

  /**
   * 以前是否有过公司法务(1:是,0:否)
   */
  preLegal: number;

  /**
   * 以前合作公司名称
   */
  preCompany: string;

  /**
   * 以前不合作原因
   */
  preReason: string;

  /**
   * 公司以前出现过的纠纷及解决方式
   */
  preDiscuss: string;

  /**
   * 待处理事项登记(1-劳资纠纷2-合同纠纷3-借贷纠纷4-承揽纠纷5-财税问题6-执行案件7-其他)
   */
  pendingMatters: number;

  /**
   * 待处理事项备注
   */
  pendingRemark: string;

  /**
   * 欠款问题详细登记(1- 相关主体2-已知债务人信息3-标的额4-证据情况5-案件处理要求6-其他)
   */
  debtDetails: number;

  /**
   * 欠款问题备注
   */
  debtRemark: string;


  remark: string;

  balancePayType: string

  contractCode: string;

  contractOssId: string;

  customerCity: string;

  auditUserId: string;

  auditUserName: string;

  auditTime: string;


}

export interface CustomerTransferForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 公司名称
   */
  companyName?: string;

  /**
   * 公司对接人
   */
  contactPerson?: string;

  /**
   * 公司对接人联系方式
   */
  contactInfo?: string;

  /**
   * 对接人职务
   */
  contactPosition?: string;

  /**
   * 对接人年龄
   */
  contactAge?: number;

  /**
   * 附赠自然人
   */
  additionalPerson?: string;

  /**
   * 附赠自然人联系方式
   */
  additionalContact?: string;

  /**
   * 附赠自然人职务
   */
  additionalPosition?: string;

  /**
   * 附赠自然人年龄
   */
  additionalAge?: number;

  /**
   * 公司所属行业
   */
  companyIndustry?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 员工人数
   */
  employeeCount?: number;

  /**
   * 是否有代账公司(1:是,0:否)
   */
  accountingCompany?: number;

  /**
   * 客户性格及工作习惯描述
   */
  customerDescription?: string;

  /**
   * 实付金额
   */
  actualPayment?: number;

  /**
   * 尾款情况
   */
  balanceStatus?: number;

  /**
   * 签约类型(1-常法 2-单项 3-律师费 4-其他)
   */
  contractType?: number;

  /**
   * 常法签约(1-升级版 2-标准版 3-其他)
   */
  serviceType?: number;

  /**
   * 服务周期开始时间
   */
  serviceStart?: string;

  /**
   * 服务周期结束时间
   */
  serviceEnd?: string;

  /**
   * 律师咨询情况
   */
  lawyerConsultation?: string;

  /**
   * 其他费用沟通
   */
  otherFee?: string;

  /**
   * 财务是否确认(1:是,0:否)
   */
  financeConfirmed?: number;

  /**
   * 财务签名
   */
  financeSignature?: string;

  /**
   * 以前是否有过公司法务(1:是,0:否)
   */
  preLegal?: number;

  /**
   * 以前合作公司名称
   */
  preCompany?: string;

  /**
   * 以前不合作原因
   */
  preReason?: string;

  /**
   * 公司以前出现过的纠纷及解决方式
   */
  preDiscuss?: string;

  /**
   * 待处理事项登记(1-劳资纠纷2-合同纠纷3-借贷纠纷4-承揽纠纷5-财税问题6-执行案件7-其他)
   */
  pendingMatters?: number;

  /**
   * 待处理事项备注
   */
  pendingRemark?: string;

  /**
   * 欠款问题详细登记(1- 相关主体2-已知债务人信息3-标的额4-证据情况5-案件处理要求6-其他)
   */
  debtDetails?: number;

  /**
   * 欠款问题备注
   */
  debtRemark?: string;

  /**
   * 客户经理id
   */
  accountManagerId?: string | number;

  /**
   * 邀约人id
   */
  inviterId?: string | number;


  balancePayType?: string;

  contractCode?: string;

  contractOssId?: string;

  customerCity?: string;

  auditUserId?: string;

  auditUserName?: string;

  auditTime?: string;


}

export interface CustomerTransferQuery extends PageQuery {

  /**
   * 公司名称
   */
  companyName?: string;

  /**
   * 公司对接人
   */
  contactPerson?: string;

  /**
   * 公司对接人联系方式
   */
  contactInfo?: string;

  /**
   * 客户经理id
   */
  accountManagerId?: string | number;
  /**
   * 邀约人id
   */
  inviterId?: string | number;

  /**
   * 对接人职务
   */
  contactPosition?: string;

  /**
   * 对接人年龄
   */
  contactAge?: number;

  /**
   * 附赠自然人
   */
  additionalPerson?: string;

  /**
   * 附赠自然人联系方式
   */
  additionalContact?: string;

  /**
   * 附赠自然人职务
   */
  additionalPosition?: string;

  /**
   * 附赠自然人年龄
   */
  additionalAge?: number;

  /**
   * 公司所属行业
   */
  companyIndustry?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 员工人数
   */
  employeeCount?: number;

  /**
   * 是否有代账公司(1:是,0:否)
   */
  accountingCompany?: number;

  /**
   * 客户性格及工作习惯描述
   */
  customerDescription?: string;

  /**
   * 实付金额
   */
  actualPayment?: number;

  /**
   * 尾款情况
   */
  balanceStatus?: number;

  /**
   * 签约类型(1-常法 2-单项 3-律师费 4-其他)
   */
  contractType?: number;

  /**
   * 常法签约(1-升级版 2-标准版 3-其他)
   */
  serviceType?: number;

  /**
   * 服务周期开始时间
   */
  serviceStart?: string;

  /**
   * 服务周期结束时间
   */
  serviceEnd?: string;

  /**
   * 律师咨询情况
   */
  lawyerConsultation?: string;

  /**
   * 其他费用沟通
   */
  otherFee?: string;

  /**
   * 财务是否确认(1:是,0:否)
   */
  financeConfirmed?: number;

  balancePayType?: string;

  contractCode?: string;

  contractOssId?: string;

  customerCity?: string;

  auditUserId?: string;

  auditUserName?: string;
  
  auditTime?: string;


  /**
   * 日期范围参数
   */
  params?: any;
}



