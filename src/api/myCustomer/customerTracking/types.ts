export interface CustomerTrackingVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 备注
   */
  customerRemark: string;

  /**
   * 跟踪状态
   */
  cumtomerStatus: number;

  /**
   * 跟踪时间
   */
  trackingTime: string;

  /**
   * 下次跟踪时间
   */
  nextTime: string;

}

export interface CustomerTrackingForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 备注
   */
  customerRemark?: string;

  /**
   * 跟踪状态
   */
  cumtomerStatus?: number;

  /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 下次跟踪时间
   */
  nextTime?: string;

}

export interface CustomerTrackingQuery extends PageQuery {

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 备注
   */
  customerRemark?: string;

  /**
   * 跟踪状态
   */
  cumtomerStatus?: number;

  /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 下次跟踪时间
   */
  nextTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



