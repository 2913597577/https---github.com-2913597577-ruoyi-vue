export interface CaseDetailVO {
  /**
   * 自增主键
   */
  id: string | number;

  /**
   * 客户id(客户编号)
   */
  customerId: string | number;

  /**
   * 欠款人
   */
  debtorName: string;

  /**
   * 欠款金额
   */
  debtAmount: number;

  /**
   * 剩余欠款
   */
  remainingAmount: number;

  /**
   * 联系电话
   */
  contactPhone: string;

  /**
   * 身份证号
   */
  idCard: string | number;

  /**
   * 需求接收时间
   */
  requestReceiveTime: string;

  /**
   * 备注（证据情况等）
   */
  evidenceNotes: string | number;

  /**
   * 立案系统账号
   */
  filingSystemAccount: string;

  /**
   * 立案密码
   */
  filingPassword: string;

  /**
   * 立案日期
   */
  filingDate: string;

  /**
   * 下次联系时间
   */
  nextContactTime: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 0-未处理 1-推进中 2-无法推进 3 -已办结
   */
  caseStatus: number;

  /**
   * 法官
   */
  judgeName: string;

  /**
   * 法官电话
   */
  judgePhone: string;

}

export interface CaseDetailForm extends BaseEntity {
  /**
   * 自增主键
   */
  id?: string | number;

  /**
   * 客户id(客户编号)
   */
  customerId?: string | number;

  /**
   * 欠款人
   */
  debtorName?: string;

  /**
   * 欠款金额
   */
  debtAmount?: number;

  /**
   * 剩余欠款
   */
  remainingAmount?: number;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 身份证号
   */
  idCard?: string | number;

  /**
   * 需求接收时间
   */
  requestReceiveTime?: string;

  /**
   * 备注（证据情况等）
   */
  evidenceNotes?: string | number;

  /**
   * 立案系统账号
   */
  filingSystemAccount?: string;

  /**
   * 立案密码
   */
  filingPassword?: string;

  /**
   * 立案日期
   */
  filingDate?: string;

  /**
   * 下次联系时间
   */
  nextContactTime?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 0-未处理 1-推进中 2-无法推进 3 -已办结
   */
  caseStatus?: number;

  /**
   * 法官
   */
  judgeName?: string;

  /**
   * 法官电话
   */
  judgePhone?: string;

}

export interface CaseDetailQuery extends PageQuery {

  /**
   * 客户id(客户编号)
   */
  customerId?: string | number;

  /**
   * 欠款人
   */
  debtorName?: string;

  /**
   * 欠款金额
   */
  debtAmount?: number;

  /**
   * 剩余欠款
   */
  remainingAmount?: number;

  /**
   * 联系电话
   */
  contactPhone?: string;

  /**
   * 身份证号
   */
  idCard?: string | number;

  /**
   * 需求接收时间
   */
  requestReceiveTime?: string;

  /**
   * 备注（证据情况等）
   */
  evidenceNotes?: string | number;

  /**
   * 立案系统账号
   */
  filingSystemAccount?: string;

  /**
   * 立案密码
   */
  filingPassword?: string;

  /**
   * 立案日期
   */
  filingDate?: string;

  /**
   * 下次联系时间
   */
  nextContactTime?: string;

  /**
   * 0-未处理 1-推进中 2-无法推进 3 -已办结
   */
  caseStatus?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



