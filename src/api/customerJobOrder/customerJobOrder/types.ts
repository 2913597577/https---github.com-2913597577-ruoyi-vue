export interface CustomerJobOrderVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 法务支持
   */
  legalSupport: string;

  /**
   * 法务支持id
   */
  legalSupportId: string | number;

  /**
   * 源合同地址
   */
  preContractAddress: number;

  /**
   * 源合同文件名
   */
  preContractName: string;

  /**
   * 新合同地址
   */
  newContractAddress: number;

  /**
   * 新合同文件名
   */
  newContractName: string;

  /**
   * 客户要求
   */
  customerRequirements: string;

  /**
   * 交付时间
   */
  deliveryTime: string;

  /**
   * 跟踪记录id
   */
  trackingId: string | number;

  /**
   * 处理人id
   */
  contractHandler: number;

  /**
   * 处理人
   */
  contractHandlerName: string;

  /**
   * 工单处理状态
   */
  processingStatus: number;

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

export interface CustomerJobOrderForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 法务支持
   */
  legalSupport?: string;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 源合同地址
   */
  preContractAddress?: string | number;

  /**
   * 源合同文件名
   */
  preContractName?: string;

  /**
   * 新合同地址
   */
  newContractAddress?: string | number;

  /**
   * 新合同文件名
   */
  newContractName?: string;

  /**
   * 客户要求
   */
  customerRequirements?: string;

  /**
   * 交付时间
   */
  deliveryTime?: string;

  /**
   * 跟踪记录id
   */
  trackingId?: string | number;

  /**
   * 处理人id
   */
  contractHandler?: number;

  /**
   * 处理人
   */
  contractHandlerName?: string;

  /**
   * 工单处理状态
   */
  processingStatus?: number;

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

export interface CustomerJobOrderQuery extends PageQuery {

  /**
   * 法务支持
   */
  legalSupport?: string;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 源合同地址
   */
  preContractAddress?: number;

  /**
   * 源合同文件名
   */
  preContractName?: string;

  /**
   * 新合同地址
   */
  newContractAddress?: number;

  /**
   * 新合同文件名
   */
  newContractName?: string;

  /**
   * 客户要求
   */
  customerRequirements?: string;

  /**
   * 交付时间
   */
  deliveryTime?: string;

  /**
   * 跟踪记录id
   */
  trackingId?: string | number;

  /**
   * 处理人id
   */
  contractHandler?: number;

  /**
   * 处理人
   */
  contractHandlerName?: string;

  /**
   * 工单处理状态
   */
  processingStatus?: number;

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



