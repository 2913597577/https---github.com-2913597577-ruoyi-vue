export interface CaseProgressVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 案件id
   */
  caseId: string | number;

  /**
   * 案件类型
   */
  caseType: string;

  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 客户姓名
   */
  customerName: number;

  /**
   * 案件进展
   */
  caseProgress: string;

  
    /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 下次跟踪时间
   */
  nextTrackingTime?: string;

}

export interface CaseProgressForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 案件id
   */
  caseId?: string | number;

  /**
   * 案件类型
   */
  caseType?: string;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户姓名
   */
  customerName?: number;

  /**
   * 案件进展
   */
  caseProgress?: string;

    /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 下次跟踪时间
   */
  nextTrackingTime?: string;

}

export interface CaseProgressQuery extends PageQuery {

  /**
   * 案件id
   */
  caseId?: string | number;

  /**
   * 案件类型
   */
  caseType?: string;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户姓名
   */
  customerName?: number;

  /**
   * 案件进展
   */
  caseProgress?: string;

    /**
     * 日期范围参数
     */
    params?: any;
    
    /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 下次跟踪时间
   */
  nextTrackingTime?: string;
}



