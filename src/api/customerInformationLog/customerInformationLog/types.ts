export interface CustomerInformationLogVO {
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
   * 是否转为意向客户
   */
  isIntention: number;

  /**
   * 是否转为风险客户
   */
  isRisk: number;

  /**
   * 是否转为退费客户
   */
  isRefund: number;

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

  /**
   * 客户总表id
   */
  customerInfoId: string | number;

  /**
   * 客户总表创建时间
   */
  infoCreateTime: string;

  /**
   * 客户总表更新时间
   */
  infoUpdateTime: string;

  /**
   * 客户经理id
   */
  accountManagerId: string | number;

  /**
   * 邀约人id
   */
  inviterId: string | number;

  /**
   * 服务时长
   */
  serviceDuration: string;

  /**
   * 合同金额
   */
  contractAmount: number;

  /**
   * 客户类型  A-0 B-1 C-2 D-3
   */
  customerType: number;

  /**
   * 立案账号
   */
  caseFillingAccount: string;

  /**
   * 立案密码
   */
  caseFillingPwd: string;

  /**
   * 客户服务城市
   */
  customerCity: string;

  /**
   * 是否分配法务支持 0-未分配 1-已分配
   */
  isAssigned: number;

}

export interface CustomerInformationLogForm extends BaseEntity {
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
   * 是否转为意向客户
   */
  isIntention?: number;

  /**
   * 是否转为风险客户
   */
  isRisk?: number;

  /**
   * 是否转为退费客户
   */
  isRefund?: number;

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
   * 客户总表id
   */
  customerInfoId?: string | number;

  /**
   * 客户总表创建时间
   */
  infoCreateTime?: string;

  /**
   * 客户总表更新时间
   */
  infoUpdateTime?: string;

  /**
   * 客户经理id
   */
  accountManagerId?: string | number;

  /**
   * 邀约人id
   */
  inviterId?: string | number;

  /**
   * 服务时长
   */
  serviceDuration?: string;

  /**
   * 合同金额
   */
  contractAmount?: number;

  /**
   * 客户类型  A-0 B-1 C-2 D-3
   */
  customerType?: number;

  /**
   * 立案账号
   */
  caseFillingAccount?: string;

  /**
   * 立案密码
   */
  caseFillingPwd?: string;

  /**
   * 客户服务城市
   */
  customerCity?: string;

  /**
   * 是否分配法务支持 0-未分配 1-已分配
   */
  isAssigned?: number;


}

export interface CustomerInformationLogQuery extends PageQuery {

  /**
   * 负责人
   */
  principal?: string;

  /**
   * 法务法务支持（律师id）
   */
  lawyerId?: string | number;

  /**
   * 签约类型
   */
  contractType?: number;

  /**
   * 套餐类型
   */
  packageType?: number;

  /**
   * 是否转为意向客户
   */
  isIntention?: number;

  /**
   * 是否转为风险客户
   */
  isRisk?: number;

  /**
   * 是否转为退费客户
   */
  isRefund?: number;

  /**
   * 客户类型  A-0 B-1 C-2 D-3
   */
  customerType?: number;

  /**
   * 客户服务城市
   */
  customerCity?: string;

  /**
   * 是否分配法务支持 0-未分配 1-已分配
   */
  isAssigned?: number;

  customerInfoId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



