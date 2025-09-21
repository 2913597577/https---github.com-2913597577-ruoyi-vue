export interface CustomerIntentionTrackingVO {
  /**
   * 意向客户id
   */
  customerId: string | number;

  /**
   * 意向客户
   */
  customerName: number;

  /**
   * 备注
   */
  customerRemark: string;

}

export interface CustomerIntentionTrackingForm extends BaseEntity {
  /**
   * 意向客户表id
   */
  inentionId?: string | number;

  /**
   * 意向客户id
   */
  customerId?: string | number;

  /**
   * 意向客户
   */
  customerName?: number;

  /**
   * 备注
   */
  customerRemark?: string;

}

export interface CustomerIntentionTrackingQuery extends PageQuery {

  /**
   * 意向客户表id
   */
  inentionId?: string | number;

  /**
   * 意向客户id
   */
  customerId?: string | number;

  /**
   * 意向客户
   */
  customerName?: number;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



