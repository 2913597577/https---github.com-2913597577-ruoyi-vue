export interface InsuranceCaseVO {
  /**
   * 自增主键
   */
  id: string | number;

  /**
   * 客户id(客户编号)
   */
  customerId: string | number;

  /**
   * 下单日期
   */
  orderDate: string;

  /**
   * 工单号
   */
  insuranceNumber: string;

  /**
   * 法务支持id
   */
  legalSupportId: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName: string;

  /**
   * 原告方
   */
  plaintiff: string;

  /**
   * 被告方
   */
  defendant: string;

  /**
   * 标的额
   */
  subjectAmount: number;

  /**
   * 案由
   */
  caseReason: string;

  /**
   * 管辖权法院
   */
  jurisdictionCourt: string;

  /**
   * 保费
   */
  premium: number;

  /**
   * 备注
   */
  remark: string;

}

export interface InsuranceCaseForm extends BaseEntity {
  /**
   * 自增主键
   */
  id?: string | number;

  /**
   * 客户id(客户编号)
   */
  customerId?: string | number;

  /**
   * 下单日期
   */
  orderDate?: string;

  /**
   * 工单号
   */
  insuranceNumber?: string;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 原告方
   */
  plaintiff?: string;

  /**
   * 被告方
   */
  defendant?: string;

  /**
   * 标的额
   */
  subjectAmount?: number;

  /**
   * 案由
   */
  caseReason?: string;

  /**
   * 管辖权法院
   */
  jurisdictionCourt?: string;

  /**
   * 保费
   */
  premium?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface InsuranceCaseQuery extends PageQuery {

  /**
   * 客户id(客户编号)
   */
  customerId?: string | number;

  /**
   * 下单日期
   */
  orderDate?: string;

  /**
   * 工单号
   */
  insuranceNumber?: string;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 原告方
   */
  plaintiff?: string;

  /**
   * 被告方
   */
  defendant?: string;

  /**
   * 标的额
   */
  subjectAmount?: number;

  /**
   * 案由
   */
  caseReason?: string;

  /**
   * 管辖权法院
   */
  jurisdictionCourt?: string;

  /**
   * 保费
   */
  premium?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



