export interface CustomerIntentionTrackingVO {

  /**
   * 主键ID
   */
  id: string | number;
  /**
   * 意向客户id
   */
  intentionId: string | number;

  /**
   * 意向客户
   */
  customerName: string;

  /**
   * 备注
   */
  customerRemark: string;

  /**
   * 跟踪时间
   */
  trackingDate: string;

}

export interface CustomerIntentionTrackingForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;
  /**
   * 意向客户表id
   */
  intentionId?: string | number;

  /**
   * 意向客户
   */
  customerName?: string;

  /**
   * 备注
   */
  customerRemark?: string;

    /**
   * 跟踪时间
   */
  trackingDate?: string;
  /**
   * 下次跟进时间
   */
  nextTrackingDate?: string;

}

export interface CustomerIntentionTrackingQuery extends PageQuery {

  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 意向客户表id
   */
  intentionId?: string | number;


  /**
   * 意向客户
   */
  customerName?: string;

  /**
   * 创建时间
   */
  createTime?: string;
      /**
   * 跟踪时间
   */
  trackingDate?: string;
    /**
   * 下次跟进时间
   */
  nextTrackingDate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



