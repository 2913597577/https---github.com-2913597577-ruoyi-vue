export interface CustomerPerformanceVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 流转单id
   */
  transferId: string | number;

  /**
   * 业绩所属用户id
   */
  userId: string | number;

  /**
   * 业绩所属用户名字
   */
  userName: number;

  /**
   * 业绩所属金额
   */
  balance: number;

  /**
   * 业绩所属城市
   */
  city: string;

}

export interface CustomerPerformanceForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 流转单id
   */
  transferId?: string | number;

  /**
   * 业绩所属用户id
   */
  userId?: string | number;

  /**
   * 业绩所属用户名字
   */
  userName?: number;

  /**
   * 业绩所属金额
   */
  balance?: number;

  /**
   * 业绩所属城市
   */
  city?: string;

}

export interface CustomerPerformanceQuery extends PageQuery {

  /**
   * 流转单id
   */
  transferId?: string | number;

  /**
   * 业绩所属用户id
   */
  userId?: string | number;

  /**
   * 业绩所属用户名字
   */
  userName?: number;

  /**
   * 业绩所属金额
   */
  balance?: number;

  /**
   * 业绩所属城市
   */
  city?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



