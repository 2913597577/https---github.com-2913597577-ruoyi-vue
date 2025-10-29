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

// export interface CustomerPerformanceQuery extends PageQuery {

//   /**
//    * 流转单id
//    */
//   transferId?: string | number;

//   /**
//    * 业绩所属用户id
//    */
//   userId?: string | number;

//   /**
//    * 业绩所属用户名字
//    */
//   userName?: number;

//   /**
//    * 业绩所属金额
//    */
//   balance?: number;

//   /**
//    * 业绩所属城市
//    */
//   city?: string;

//     /**
//      * 日期范围参数
//      */
//     params?: any;
// }

export interface CustomerPerformanceQuery {
  userId?: number[];
  transferId?: number[];
  city?: string[];
  serviceCity?: string[];
  inviterId?: number[];
  serviceType?: number[];
  serviceStart?: string; // YYYY-MM-DD格式的日期字符串
  serviceEnd?: string; // YYYY-MM-DD格式的日期字符串
  pageNum?: number;
  pageSize?: number;
}

// 响应数据类型
export interface CustomerPerformanceResponse {
  code: number;
  msg: string;
  data: any[]; // JSONArray格式的数据
}

