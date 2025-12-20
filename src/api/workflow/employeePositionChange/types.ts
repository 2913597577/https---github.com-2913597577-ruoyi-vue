export interface DcEmployeePositionChangeVO {
  id: string | number;
  applyDate: string;
  applicant: string;
  applicantDept: string;
  changeType: string;
  employeeName: string;
  employeeId: string;
  originalDept: string;
  originalPosition: string;
  originalRank: string;
  companyEntryDate: string;
  currentPositionEntryDate: string;
  originalContractAttachment: string;
  targetDept: string;
  targetPosition: string;
  targetRank: string;
  expectedReportDate: string;
  newContractAttachment: string;
  currentMonthlySalary: number;
  currentAnnualSalary: number;
  targetMonthlySalary: number;
  targetAnnualSalary: number;
  salaryAdjustmentRate: number;
  welfareChange: string;
  changeReasons: string;
  evaluationOpinion: string;
  probationPeriod: string;
  originalDeptManagerOpinion: string;
  targetDeptManagerOpinion: string;
  hrDeptOpinion: string;
  employeeConfirmation: string;
  effectiveDate: string;
  hrHandler: string;
  hrArchiveAttachment: string;
  remarks: string;
  status: string;
  createTime?: string;
  updateTime?: string;
}

export interface DcEmployeePositionChangeForm extends BaseEntity {
  id?: string | number;
  applyDate?: string;
  applicant?: string;
  applicantDept?: string;
  changeType?: string;
  employeeName?: string;
  employeeId?: string;
  originalDept?: string;
  originalPosition?: string;
  originalRank?: string;
  companyEntryDate?: string;
  currentPositionEntryDate?: string;
  originalContractAttachment?: string;
  targetDept?: string;
  targetPosition?: string;
  targetRank?: string;
  expectedReportDate?: string;
  newContractAttachment?: string;
  currentMonthlySalary?: number;
  currentAnnualSalary?: number;
  targetMonthlySalary?: number;
  targetAnnualSalary?: number;
  salaryAdjustmentRate?: number;
  welfareChange?: string;
  changeReasons?: string;
  evaluationOpinion?: string;
  probationPeriod?: string;
  originalDeptManagerOpinion?: string;
  targetDeptManagerOpinion?: string;
  hrDeptOpinion?: string;
  employeeConfirmation?: string;
  effectiveDate?: string;
  hrHandler?: string;
  hrArchiveAttachment?: string;
  remarks?: string;
  status?: string;
}

export interface DcEmployeePositionChangeQuery extends PageQuery {
  applicant?: string;
  applicantDept?: string;
  changeType?: string;
  employeeName?: string;
  status?: string;
  applyDate?: string;
}