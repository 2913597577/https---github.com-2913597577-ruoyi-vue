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

  // ==================== 新增字段 ====================

  /**
   * 决策人姓名
   */
  decisionMaker: string;

  /**
   * 决策人联系方式
   */
  decisionMakerContact: string;

  /**
   * 决策人职务
   */
  decisionMakerPosition: string;

  /**
   * 决策人年龄
   */
  decisionMakerAge: number;

  /**
   * 二开类型(0-续费、1-尾款、2-咨询费、3-升级常法、4-律师函、5-合同定审、6-立案、7-诉讼文书、8-法务其他、9-财税代账、10-财税其他)
   */
  secondDevelopmentType: number;

  /**
   * 是否是二次收费(0-否, 1-是)
   */
  isSecondaryCharge: number;

  /**
   * 债务人
   */
  debtor: string;

  /**
   * 欠款金额
   */
  debtAmount: number;

  /**
   * 债务人联系电话
   */
  debtorContact: string;

  /**
   * 证据备注
   */
  evidenceRemark: string;

  /**
   * 客户来源(0-销售外呼、1-地推引流、2-客户转介绍、3-电商媒体、4-上门/来电、5-员工资源、6-其他来源)
   */
  customerSource: string;

  /**
   * 推荐人ID
   */
  referrerId: string | number;

  /**
   * 推荐人
   */
  referrer: string;

  /**
   * 省份
   */
  province: string;

  /**
   * 城市
   */
  city: string;

  /**
   * 区/县
   */
  district: string;

  // ==================== 原有其他字段 ====================

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

  performanceInfo: any;

  invoiceRequirements: string;

  invoiceContent: string;

  invoiceStatus: number;
  
  customerId: string| number;
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

    customerId: string| number;

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

  // ==================== 新增字段 ====================

  /**
   * 决策人姓名
   */
  decisionMaker?: string;

  /**
   * 决策人联系方式
   */
  decisionMakerContact?: string;

  /**
   * 决策人职务
   */
  decisionMakerPosition?: string;

  /**
   * 决策人年龄
   */
  decisionMakerAge?: number;

  /**
   * 二开类型(0-续费、1-尾款、2-咨询费、3-升级常法、4-律师函、5-合同定审、6-立案、7-诉讼文书、8-法务其他、9-财税代账、10-财税其他)
   */
  secondDevelopmentType?: number;

  /**
   * 是否是二次收费(0-否, 1-是)
   */
  isSecondaryCharge?: number;

  /**
   * 债务人
   */
  debtor?: string;

  /**
   * 欠款金额
   */
  debtAmount?: number;

  /**
   * 债务人联系电话
   */
  debtorContact?: string;

  /**
   * 证据备注
   */
  evidenceRemark?: string;

  /**
   * 客户来源(0-销售外呼、1-地推引流、2-客户转介绍、3-电商媒体、4-上门/来电、5-员工资源、6-其他来源)
   */
  customerSource?: string;

  /**
   * 推荐人ID
   */
  referrerId?: string | number;

  /**
   * 推荐人
   */
  referrer?: string;

  /**
   * 省份
   */
  province?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 区/县
   */
  district?: string;

  // ==================== 原有其他字段 ====================

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

  performanceInfo?: any;

  invoiceRequirements?: string;

  invoiceContent?: string;

  invoiceStatus?: number;
}

export interface BaseEntity {
  // 假设 BaseEntity 有一些基础字段，如 createBy, updateBy 等
  // 这里保持原样
}

export interface CustomerTransferForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

    customerId: string| number;

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

  // ==================== 新增字段 ====================

  /**
   * 决策人姓名
   */
  decisionMaker?: string;

  /**
   * 决策人联系方式
   */
  decisionMakerContact?: string;

  /**
   * 决策人职务
   */
  decisionMakerPosition?: string;

  /**
   * 决策人年龄
   */
  decisionMakerAge?: number;

  /**
   * 二开类型(0-续费、1-尾款、2-咨询费、3-升级常法、4-律师函、5-合同定审、6-立案、7-诉讼文书、8-法务其他、9-财税代账、10-财税其他)
   */
  secondDevelopmentType?: number;

  /**
   * 是否是二次收费(0-否, 1-是)
   */
  isSecondaryCharge?: number;

  /**
   * 债务人
   */
  debtor?: string;

  /**
   * 欠款金额
   */
  debtAmount?: number;

  /**
   * 债务人联系电话
   */
  debtorContact?: string;

  /**
   * 证据备注
   */
  evidenceRemark?: string;

  /**
   * 客户来源(0-销售外呼、1-地推引流、2-客户转介绍、3-电商媒体、4-上门/来电、5-员工资源、6-其他来源)
   */
  customerSource?: string;

  /**
   * 推荐人ID
   */
  referrerId?: string | number;

  /**
   * 推荐人
   */
  referrer?: string;

  /**
   * 省份
   */
  province?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 区/县
   */
  district?: string;

  // ==================== 原有其他字段 ====================

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

  performanceInfo?: any;
  /**
   * 日期范围参数
   */
  params?: any;

  invoiceRequirements?:string;

  invoiceContent?:string;

  invoiceStatus?:number;
}