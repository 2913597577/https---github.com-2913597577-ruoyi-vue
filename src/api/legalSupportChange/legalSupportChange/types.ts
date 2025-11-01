export interface LegalSupportChangeVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 客户id（流转单id）
   */
  customerId: string | number;

  /**
   * 法务支持
   */
  legalSupportName: string;

  /**
   * 法务支持ID
   */
  legalSupportId: string | number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 创建人
   */
  createBy: number;

}

export interface LegalSupportChangeForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户id（流转单id）
   */
  customerId?: string | number;

  /**
   * 法务支持
   */
  legalSupportName?: string;

  /**
   * 法务支持ID
   */
  legalSupportId?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 创建人
   */
  createBy?: number;

}

export interface LegalSupportChangeQuery extends PageQuery {

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户id（流转单id）
   */
  customerId?: string | number;

  /**
   * 法务支持
   */
  legalSupportName?: string;

  /**
   * 法务支持ID
   */
  legalSupportId?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 创建人
   */
  createBy?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



