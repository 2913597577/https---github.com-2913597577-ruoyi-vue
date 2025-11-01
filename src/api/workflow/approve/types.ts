export interface ApproveVO {
  id: string | number;
  applyType: string;
  balance: string | number;
  remark: string;
  status?: string;
}

export interface ApproveForm extends BaseEntity {
  id?: string | number;
  applyType?: string;
  balance?: string | number;
  remark?: string;
  status?: string;
}

export interface ApproveQuery extends PageQuery {
  // 根据实际需求添加查询字段
   applyType?: string;
}