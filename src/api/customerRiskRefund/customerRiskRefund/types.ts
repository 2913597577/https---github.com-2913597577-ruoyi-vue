export interface CustomerRiskRefundVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 法务支持（律师id）
   */
  lawyerId: string | number;

  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 客户对接人
   */
  principal: string;

  /**
   * 客户对接人联系方式
   */
  principalPhone: string;

  /**
   * 大成负责人id
   */
  inviterId: string | number;

  /**
   * 签约日期
   */
  signDate: string;

  /**
   * 到期时间
   */
  expireDate: string;

  /**
   * 签单金额
   */
  contractAmount: number;

  /**
   * 服务时长
   */
  serviceHours: string;

  /**
   * 1-风险 2-退费
   */
  customerType: number;

  /**
   * 风险/退费原因
   */
  reasons: string;

  /**
   * 退款金额
   */
  refundAmount: number;

  /**
   * 备注
   */
  remark1: string;

  /**
   * 备注
   */
  remark2: string;

  /**
   * 备注
   */
  remark3: string;

}

export interface CustomerRiskRefundForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 法务支持（律师id）
   */
  lawyerId?: string | number;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户对接人
   */
  principal?: string;

  /**
   * 客户对接人联系方式
   */
  principalPhone?: string;

  /**
   * 大成负责人id
   */
  inviterId?: string | number;

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 到期时间
   */
  expireDate?: string;

  /**
   * 签单金额
   */
  contractAmount?: number;

  /**
   * 服务时长
   */
  serviceHours?: string;

  /**
   * 1-风险 2-退费
   */
  customerType?: number;

  /**
   * 风险/退费原因
   */
  reasons?: string;

  /**
   * 退款金额
   */
  refundAmount?: number;

  /**
   * 备注
   */
  remark1?: string;

  /**
   * 备注
   */
  remark2?: string;

  /**
   * 备注
   */
  remark3?: string;

}

export interface CustomerRiskRefundQuery extends PageQuery {

  /**
   * 法务支持（律师id）
   */
  lawyerId?: string | number;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户对接人
   */
  principal?: string;

  /**
   * 客户对接人联系方式
   */
  principalPhone?: string;

  /**
   * 大成负责人id
   */
  inviterId?: string | number;

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 到期时间
   */
  expireDate?: string;

  /**
   * 签单金额
   */
  contractAmount?: number;

  /**
   * 服务时长
   */
  serviceHours?: string;

  /**
   * 1-风险 2-退费
   */
  customerType?: number;

  /**
   * 风险/退费原因
   */
  reasons?: string;

  /**
   * 退款金额
   */
  refundAmount?: number;

  /**
   * 备注
   */
  remark1?: string;

  /**
   * 备注
   */
  remark2?: string;

  /**
   * 备注
   */
  remark3?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



