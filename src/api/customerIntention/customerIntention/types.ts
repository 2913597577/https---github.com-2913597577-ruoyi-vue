export interface CustomerIntentionVO {
  /**
   * 提报日期
   */
  submissionDate: string;

  /**
   * 法务支持
   */
  legalSupport: string;

  /**
   * 意向客户
   */
  intendedCustomer: string;

  /**
   * 类型
   */
  type: number;

  /**
   * 来源
   */
  source: string;

  /**
   * 预计金额
   */
  expectedAmount: number;

  /**
   * 介绍人
   */
  introducer: string;

  /**
   * 跟进结果
   */
  followUpResult: number;

}

export interface CustomerIntentionForm extends BaseEntity {
  /**
   * 提报日期
   */
  submissionDate?: string;

  /**
   * 法务支持
   */
  legalSupport?: string;

  /**
   * 法务支持ID
   */
  legalSupportId?: string | number;

  /**
   * 意向客户
   */
  intendedCustomer?: string;

  /**
   * 意向客户id
   */
  intendedCustomerId?: string | number;

  /**
   * 类型
   */
  type?: number;

  /**
   * 来源
   */
  source?: string;

  /**
   * 预计金额
   */
  expectedAmount?: number;

  /**
   * 介绍人
   */
  introducer?: string;

  /**
   * 跟进结果
   */
  followUpResult?: number;

}

export interface CustomerIntentionQuery extends PageQuery {

  /**
   * 提报日期
   */
  submissionDate?: string;

  /**
   * 法务支持
   */
  legalSupport?: string;

  /**
   * 法务支持ID
   */
  legalSupportId?: string | number;

  /**
   * 意向客户
   */
  intendedCustomer?: string;

  /**
   * 意向客户id
   */
  intendedCustomerId?: string | number;

  /**
   * 类型
   */
  type?: number;

  /**
   * 来源
   */
  source?: string;

  /**
   * 介绍人
   */
  introducer?: string;

  /**
   * 跟进结果
   */
  followUpResult?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



