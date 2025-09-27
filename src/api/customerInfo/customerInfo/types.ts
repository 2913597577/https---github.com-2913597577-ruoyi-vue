export interface CustomerInfoVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 签约日期
   */
  signDate: string;

  /**
   * 编号
   */
  contractNo: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 负责人
   */
  principal: string;

  /**
   * 负责人电话
   */
  principalPhone: string;

  /**
   * 法务法务支持（律师id）
   */
  lawyerId: string | number;

  /**
   * 甩单人
   */
  transferPerson: string;

  /**
   * 杀单手
   */
  closer: string;

  /**
   * 签约类型
   */
  contractType: number;

  /**
   * 套餐类型
   */
  packageType: number;

  /**
   * 实收金额
   */
  actualReceipt: number;

  /**
   * 尾款金额
   */
  balance: number;

  /**
   * 到期时间
   */
  expireDate: string;

  /**
   * 合同编号
   */
  contractCode: string;

  /**
   * 备注
   */
  remarks: string;

  /**
   * 续费/尾款动作(1-续费 2-付尾款 3-其他)
   */
  actionType: number;

  /**
   * 客户id（流转单id）
   */
  transferId: string | number;

}

export interface CustomerInfoForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 编号
   */
  contractNo?: string;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 负责人
   */
  principal?: string;

  /**
   * 负责人电话
   */
  principalPhone?: string;

  /**
   * 法务法务支持（律师id）
   */
  lawyerId?: string | number;

  /**
   * 甩单人
   */
  transferPerson?: string;

  /**
   * 杀单手
   */
  closer?: string;

  /**
   * 签约类型
   */
  contractType?: number;

  /**
   * 套餐类型
   */
  packageType?: number;

  /**
   * 实收金额
   */
  actualReceipt?: number;

  /**
   * 尾款金额
   */
  balance?: number;

  /**
   * 到期时间
   */
  expireDate?: string;

  /**
   * 合同编号
   */
  contractCode?: string;

  /**
   * 备注
   */
  remarks?: string;

  /**
   * 续费/尾款动作(1-续费 2-付尾款 3-其他)
   */
  actionType?: number;

  /**
   * 客户id（流转单id）
   */
  transferId?: string | number;
  /**
   * 客户类型
   */
  customerType?: string | number;

}

export interface CustomerInfoQuery extends PageQuery {

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 编号
   */
  contractNo?: string;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 负责人
   */
  principal?: string;

  /**
   * 负责人电话
   */
  principalPhone?: string;

  /**
   * 法务法务支持（律师id）
   */
  lawyerId?: string | number;

  /**
   * 甩单人
   */
  transferPerson?: string;

  /**
   * 杀单手
   */
  closer?: string;

  /**
   * 签约类型
   */
  contractType?: number;

  /**
   * 套餐类型
   */
  packageType?: number;

  /**
   * 实收金额
   */
  actualReceipt?: number;

  /**
   * 尾款金额
   */
  balance?: number;

  /**
   * 到期时间
   */
  expireDate?: string;

  /**
   * 合同编号
   */
  contractCode?: string;

  /**
   * 备注
   */
  remarks?: string;

  /**
   * 续费/尾款动作(1-续费 2-付尾款 3-其他)
   */
  actionType?: number;

  /**
   * 客户id（流转单id）
   */
  transferId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



