export interface StaffInfoVO {
  /**
   * 自增主键
   */
  id: string | number;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 员工姓名
   */
  name: string;

  /**
   * 电子邮箱
   */
  email: string;

  /**
   * 手机号码
   */
  mobile: number;

  /**
   * 性别:1男,2女,0未知
   */
  sex: number;

  /**
   * 别名
   */
  nickname: string;

  /**
   * 员工照片
   */
  thumb: number;

  /**
   * 部门id
   */
  deptId: string | number;

  /**
   * 上级主管id
   */
  pid: string | number;

  /**
   * 职位id
   */
  positionId: string | number;

  /**
   * 职务
   */
  positionName: string;

  /**
   * 职级
   */
  positionRank: string;

  /**
   * 员工类型:0未设置,1正式,2试用,3实习
   */
  type: string;

  /**
   * 身份类型:0未设置,1企业员工,2劳务派遣,3兼职员工
   */
  isStaff: string;

  /**
   * 工号
   */
  jobNumber: string;

  /**
   * 生日
   */
  birthday: string;

  /**
   * 年龄
   */
  age: number;

  /**
   * 开始工作时间
   */
  workDate: string;

  /**
   * 工作地点
   */
  workLocation: string;

  /**
   * 工作团队
   */
  team: string;

  /**
   * 籍贯
   */
  nativePlace: string;

  /**
   * 民族
   */
  nation: string;

  /**
   * 家庭地址
   */
  homeAddress: string;

  /**
   * 现居地址
   */
  currentAddress: string;

  /**
   * 紧急联系人
   */
  contact: string;

  /**
   * 紧急联系人电话
   */
  contactMobile: string;

  /**
   * 户口性质:0未设置,1农村户口,2城镇户口
   */
  residentType: string | number;

  /**
   * 户口所在地
   */
  residentPlace: string | number;

  /**
   * 毕业学校
   */
  graduateSchool: string;

  /**
   * 毕业日期（时间戳，0表示未填写）
   */
  graduateDay: string;

  /**
   * 政治面貌:0未设置,1中共党员,2团员
   */
  political: string;

  /**
   * 婚姻状况:0未设置,1未婚,2已婚,3离异
   */
  maritalStatus: string;

  /**
   * 身份证
   */
  idcard: string | number;

  /**
   * 学位
   */
  education: string;

  /**
   * 专业
   */
  speciality: string;

  /**
   * 社保账号
   */
  socialAccount: string;

  /**
   * 医保账号
   */
  medicalAccount: string;

  /**
   * 公积金账号
   */
  providentAccount: string | number;

  /**
   * 银行卡号
   */
  bankAccount: string;

  /**
   * 开户行
   */
  bankInfo: string;

  /**
   * 档案附件（0表示无附件）
   */
  fileIds: string | number;

  /**
   * 员工个人简介
   */
  desc: string;

  /**
   * 员工入职日期
   */
  entryTime: string;

  /**
   * 员工离职日期
   */
  levelTime: string;

  /**
   * 状态：-1待入职,1正常,2离职
   */
  status: number;

}

export interface StaffInfoForm extends BaseEntity {
  /**
   * 自增主键
   */
  id?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 员工姓名
   */
  name?: string;

  /**
   * 电子邮箱
   */
  email?: string;

  /**
   * 手机号码
   */
  mobile?: number;

  /**
   * 性别:1男,2女,0未知
   */
  sex?: number;

  /**
   * 别名
   */
  nickname?: string;

  /**
   * 员工照片
   */
  thumb?: number;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 上级主管id
   */
  pid?: string | number;

  /**
   * 职位id
   */
  positionId?: string | number;

  /**
   * 职务
   */
  positionName?: string;

  /**
   * 职级
   */
  positionRank?: string;

  /**
   * 员工类型:0未设置,1正式,2试用,3实习
   */
  type?: string;

  /**
   * 身份类型:0未设置,1企业员工,2劳务派遣,3兼职员工
   */
  isStaff?: string;

  /**
   * 工号
   */
  jobNumber?: string;

  /**
   * 生日
   */
  birthday?: string;

  /**
   * 年龄
   */
  age?: number;

  /**
   * 开始工作时间
   */
  workDate?: string;

  /**
   * 工作地点
   */
  workLocation?: string;

  /**
   * 工作团队
   */
  team?: string;

  /**
   * 籍贯
   */
  nativePlace?: string;

  /**
   * 民族
   */
  nation?: string;

  /**
   * 家庭地址
   */
  homeAddress?: string;

  /**
   * 现居地址
   */
  currentAddress?: string;

  /**
   * 紧急联系人
   */
  contact?: string;

  /**
   * 紧急联系人电话
   */
  contactMobile?: string;

  /**
   * 户口性质:0未设置,1农村户口,2城镇户口
   */
  residentType?: string | number;

  /**
   * 户口所在地
   */
  residentPlace?: string | number;

  /**
   * 毕业学校
   */
  graduateSchool?: string;

  /**
   * 毕业日期（时间戳，0表示未填写）
   */
  graduateDay?: string;

  /**
   * 政治面貌:0未设置,1中共党员,2团员
   */
  political?: string;

  /**
   * 婚姻状况:0未设置,1未婚,2已婚,3离异
   */
  maritalStatus?: string;

  /**
   * 身份证
   */
  idcard?: string | number;

  /**
   * 学位
   */
  education?: string;

  /**
   * 专业
   */
  speciality?: string;

  /**
   * 社保账号
   */
  socialAccount?: string;

  /**
   * 医保账号
   */
  medicalAccount?: string;

  /**
   * 公积金账号
   */
  providentAccount?: string | number;

  /**
   * 银行卡号
   */
  bankAccount?: string;

  /**
   * 开户行
   */
  bankInfo?: string;

  /**
   * 档案附件（0表示无附件）
   */
  fileIds?: string | number;

  /**
   * 员工个人简介
   */
  desc?: string;

  /**
   * 员工入职日期
   */
  entryTime?: string;

  /**
   * 员工离职日期
   */
  levelTime?: string;

  /**
   * 状态：-1待入职,1正常,2离职
   */
  status?: number;

}

export interface StaffInfoQuery extends PageQuery {

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 员工姓名
   */
  name?: string;

  /**
   * 性别:1男,2女,0未知
   */
  sex?: number;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 职位id
   */
  positionId?: string | number;

  /**
   * 职务
   */
  positionName?: string;

  /**
   * 职级
   */
  positionRank?: string;

  /**
   * 工作地点
   */
  workLocation?: string;

  /**
   * 工作团队
   */
  team?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



