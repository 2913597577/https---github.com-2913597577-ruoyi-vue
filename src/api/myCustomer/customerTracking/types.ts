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
   * 跟踪记录
   */
  customerRemark: string;

  /**
   * 跟踪类型
   */
  trackingType: number;

  /**
   * 跟踪状态
   */
  cumtomerStatus: number;

  /**
   * 跟踪时间
   */
  trackingTime: string;

  /**
   * 提交状态
   */
  submitStatus: number;

  /**
   * 下次跟踪时间
   */
  nextTime: string;

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
   * 跟踪记录
   */
  customerRemark?: string;

  /**
   * 跟踪类型
   */
  trackingType?: number;

  /**
   * 跟踪状态
   */
  cumtomerStatus?: number;

  /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 提交状态
   */
  submitStatus?: number;

  /**
   * 下次跟踪时间
   */
  nextTime?: string;

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

}

export interface CustomerTrackingQuery extends PageQuery {

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 跟踪记录
   */
  customerRemark?: string;

  /**
   * 跟踪类型
   */
  trackingType?: number;

  /**
   * 跟踪状态
   */
  cumtomerStatus?: number;

  /**
   * 跟踪时间
   */
  trackingTime?: string;

  /**
   * 提交状态
   */
  submitStatus?: number;

  /**
   * 下次跟踪时间
   */
  nextTime?: string;

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
     * 日期范围参数
     */
    params?: any;
}



