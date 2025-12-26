export interface FinancialStatisticsVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 金额
   */
  balance: number;

  /**
   * 财务类型
   */
  financialType: number;

  /**
   * 来源类型
   */
  sourceType: string;

  /**
   * 发票凭证
   */
  contractNo: string;

  /**
   * 发票凭证Url
   */
  contractNoUrl: string;
  /**
   * 备注
   */
  remark: string;

  /**
   * 业绩归属城市
   */
  city: string;

  /**
   * 创建人姓名
   */
  createrName: string;

  /**
   * 备注1
   */
  remark1: string;

  /**
   * 备注2
   */
  remark2: string;

  /**
   * 备注3
   */
  remark3: string;

  /**
   * 流水时间（财务进账/支出具体时间）
   */
  flowTime: string;

}

export interface FinancialStatisticsForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 金额
   */
  balance?: number;

  /**
   * 财务类型
   */
  financialType?: number;

  /**
   * 来源类型
   */
  sourceType?: string;

  /**
   * 发票凭证
   */
  contractNo?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 业绩归属城市
   */
  city?: string;

  /**
   * 创建人姓名
   */
  createrName?: string;

  /**
   * 备注1
   */
  remark1?: string;

  /**
   * 备注2
   */
  remark2?: string;

  /**
   * 备注3
   */
  remark3?: string;

  /**
   * 流水时间（财务进账/支出具体时间）
   */
  flowTime?: string;

}

export interface FinancialStatisticsQuery extends PageQuery {

  /**
   * 金额
   */
  balance?: number;

  /**
   * 财务类型
   */
  financialType?: number;

  /**
   * 来源类型
   */
  sourceType?: string;

  /**
   * 发票凭证
   */
  contractNo?: string;

  /**
   * 业绩归属城市
   */
  city?: string;

  /**
   * 创建人姓名
   */
  createrName?: string;

  /**
   * 备注1
   */
  remark1?: string;

  /**
   * 备注2
   */
  remark2?: string;

  /**
   * 备注3
   */
  remark3?: string;

  /**
   * 流水时间（财务进账/支出具体时间）
   */
  flowTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



