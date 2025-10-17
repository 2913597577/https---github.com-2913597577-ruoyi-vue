export interface CustomerOutVisitVO {
  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 客户姓名
   */
  customerName: string;

  /**
   * 法务支持id
   */
  legalSupportId: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName: string;

  /**
   * 出访时间
   */
  visitTime: string;

  /**
   * 下次出访时间
   */
  nextVisitTime: string;

  /**
   * 面访目的
   */
  visitPurpose: string;

  /**
   * 是否本月第一次出访
   */
  isFirstVisit: number;

  /**
   * 是否计入外勤项数
   */
  isOutCount: number;

  /**
   * 客户地点照片
   */
  placePic1: string;

  /**
   * 客户地点照片Url
   */
  placePic1Url: string;
  /**
   * 客户地点照片
   */
  placePic2: string;

  /**
   * 客户地点照片Url
   */
  placePic2Url: string;
  /**
   * 客户地点照片
   */
  placePic3: string;

  /**
   * 客户地点照片Url
   */
  placePic3Url: string;
  /**
   * 客户地点照片
   */
  placePic4: string;

  /**
   * 客户地点照片Url
   */
  placePic4Url: string;
  /**
   * 面访记录附件
   */
  outRecord: string;

  /**
   * 面访地点
   */
  visitAddress: string;

}

export interface CustomerOutVisitForm extends BaseEntity {
  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户姓名
   */
  customerName?: string;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 出访时间
   */
  visitTime?: string;

  /**
   * 下次出访时间
   */
  nextVisitTime?: string;

  /**
   * 面访目的
   */
  visitPurpose?: string;

  /**
   * 是否本月第一次出访
   */
  isFirstVisit?: number;

  /**
   * 是否计入外勤项数
   */
  isOutCount?: number;

  /**
   * 客户地点照片
   */
  placePic1?: string;

  /**
   * 客户地点照片
   */
  placePic2?: string;

  /**
   * 客户地点照片
   */
  placePic3?: string;

  /**
   * 客户地点照片
   */
  placePic4?: string;

  /**
   * 面访记录附件
   */
  outRecord?: string;

  /**
   * 面访地点
   */
  visitAddress?: string;

}

export interface CustomerOutVisitQuery extends PageQuery {
  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 客户姓名
   */
  customerName?: string;
  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 出访时间
   */
  visitTime?: string;

  /**
   * 下次出访时间
   */
  nextVisitTime?: string;

  /**
   * 是否本月第一次出访
   */
  isFirstVisit?: number;

  /**
   * 是否计入外勤项数
   */
  isOutCount?: number;

  /**
   * 面访地点
   */
  visitAddress?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



