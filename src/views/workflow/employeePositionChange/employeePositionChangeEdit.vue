<template>
  <div class="p-2">
    <el-card shadow="never">
      <approvalButton
        @submitForm="submitForm"
        @approvalVerifyOpen="approvalVerifyOpen"
        @handleApprovalRecord="handleApprovalRecord"
        :buttonLoading="buttonLoading"
        :id="form.id"
        :status="form.status"
        :pageType="routeParams.type"
      />
    </el-card>
    <el-card shadow="never" style="height: 78vh; overflow-y: auto">
      <el-form ref="employeePositionChangeFormRef" v-loading="loading" :disabled="routeParams.type === 'view'" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请日期" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择申请日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant">
              <el-input v-model="form.applicant" placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请人所属部门" prop="applicantDept">
              <el-input v-model="form.applicantDept" placeholder="请输入申请人所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位变动类型" prop="changeType">
              <el-select v-model="form.changeType" placeholder="请选择岗位变动类型" clearable style="width: 100%">
                <el-option label="部门调动" value="部门调动" />
                <el-option label="职级晋升" value="职级晋升" />
                <el-option label="职级降低" value="职级降低" />
                <el-option label="转正" value="转正" />
                <el-option label="离职" value="离职" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="employeeName">
              <el-input v-model="form.employeeName" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工工号" prop="employeeId">
              <el-input v-model="form.employeeId" placeholder="请输入员工工号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="变动前所属部门" prop="originalDept">
              <el-input v-model="form.originalDept" placeholder="请输入变动前所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变动前职务" prop="originalPosition">
              <el-input v-model="form.originalPosition" placeholder="请输入变动前职务" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="变动前职级" prop="originalRank">
              <el-input v-model="form.originalRank" placeholder="请输入变动前职级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职公司日期" prop="companyEntryDate">
              <el-date-picker
                v-model="form.companyEntryDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择入职公司日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="现岗位任职日期" prop="currentPositionEntryDate">
              <el-date-picker
                v-model="form.currentPositionEntryDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择现岗位任职日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拟定月度基本工资" prop="targetMonthlySalary">
              <el-input-number v-model="form.targetMonthlySalary" placeholder="请输入拟定月度基本工资" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="拟定年度总薪酬" prop="targetAnnualSalary">
              <el-input-number v-model="form.targetAnnualSalary" placeholder="请输入拟定年度总薪酬" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位变动主要原因" prop="changeReasons">
              <el-input v-model="form.changeReasons" placeholder="请输入岗位变动主要原因" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="新岗位是否设置试用期" prop="probationPeriod">
              <el-radio-group v-model="form.probationPeriod">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工本人确认" prop="employeeConfirmation">
              <el-radio-group v-model="form.employeeConfirmation">
                <el-radio label="未确认">未确认</el-radio>
                <el-radio label="已确认">已确认</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="拟调动至部门" prop="targetDept">
              <el-input v-model="form.targetDept" placeholder="请输入拟调动至部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拟定职务" prop="targetPosition">
              <el-input v-model="form.targetPosition" placeholder="请输入拟定职务" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="拟定职级" prop="targetRank">
              <el-input v-model="form.targetRank" placeholder="请输入拟定职级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到岗日期" prop="expectedReportDate">
              <el-date-picker
                v-model="form.expectedReportDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择预计到岗日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="详细评估意见" prop="evaluationOpinion">
          <el-input v-model="form.evaluationOpinion" type="textarea" :rows="3" placeholder="请输入详细评估意见" />
        </el-form-item>
        
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- Submit component -->
    <submitVerify ref="submitVerifyRef" :task-variables="taskVariables" @submit-callback="submitCallback" />
    <!-- Approval record -->
    <approvalRecord ref="approvalRecordRef" />
    <el-dialog v-model="dialogVisible.visible" :title="dialogVisible.title" :before-close="handleClose" width="500">
      <el-select v-model="flowCode" placeholder="Select" style="width: 240px">
        <el-option v-for="item in flowCodeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitFlow()"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DcEmployeePositionChange" lang="ts">
import { addDcEmployeePositionChange, getDcEmployeePositionChange, updateDcEmployeePositionChange } from '@/api/workflow/employeePositionChange';
import { DcEmployeePositionChangeForm, DcEmployeePositionChangeQuery, DcEmployeePositionChangeVO } from '@/api/workflow/employeePositionChange/types';
import { startWorkFlow } from '@/api/workflow/task';
import SubmitVerify from '@/components/Process/submitVerify.vue';
import ApprovalRecord from '@/components/Process/approvalRecord.vue';
import ApprovalButton from '@/components/Process/approvalButton.vue';
import { AxiosResponse } from 'axios';
import { StartProcessBo } from '@/api/workflow/workflowCommon/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const loading = ref(true);
// Route parameters
const routeParams = ref<Record<string, any>>({});

const flowCodeOptions = [
  {
    value: 'employeePositionChange',
    label: '员工岗位变动审批'
  }
];

const flowCode = ref<string>('');

const dialogVisible = reactive<DialogOption>({
  visible: false,
  title: '流程定义'
});
// Submit component
const submitVerifyRef = ref<InstanceType<typeof SubmitVerify>>();
// Approval record component
const approvalRecordRef = ref<InstanceType<typeof ApprovalRecord>>();
// Button component
const approvalButtonRef = ref<InstanceType<typeof ApprovalButton>>();

const employeePositionChangeFormRef = ref<ElFormInstance>();

const submitFormData = ref<StartProcessBo>({
  businessId: '',
  flowCode: '',
  variables: {}
});
const taskVariables = ref<Record<string, any>>({});

const initFormData: DcEmployeePositionChangeForm = {
  id: undefined,
  applyDate: undefined,
  applicant: undefined,
  applicantDept: undefined,
  changeType: undefined,
  employeeName: undefined,
  employeeId: undefined,
  originalDept: undefined,
  originalPosition: undefined,
  originalRank: undefined,
  companyEntryDate: undefined,
  currentPositionEntryDate: undefined,
  originalContractAttachment: undefined,
  targetDept: undefined,
  targetPosition: undefined,
  targetRank: undefined,
  expectedReportDate: undefined,
  newContractAttachment: undefined,
  currentMonthlySalary: undefined,
  currentAnnualSalary: undefined,
  targetMonthlySalary: undefined,
  targetAnnualSalary: undefined,
  salaryAdjustmentRate: undefined,
  welfareChange: undefined,
  changeReasons: undefined,
  evaluationOpinion: undefined,
  probationPeriod: undefined,
  originalDeptManagerOpinion: undefined,
  targetDeptManagerOpinion: undefined,
  hrDeptOpinion: undefined,
  employeeConfirmation: undefined,
  effectiveDate: undefined,
  hrHandler: undefined,
  hrArchiveAttachment: undefined,
  remarks: undefined,
  status: undefined
};

const data = reactive<PageData<DcEmployeePositionChangeForm, DcEmployeePositionChangeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    applyDate: [{ required: true, message: '申请日期不能为空', trigger: 'blur' }],
    applicant: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
    changeType: [{ required: true, message: '岗位变动类型不能为空', trigger: 'blur' }],
    employeeName: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }]
  }
});

const handleClose = () => {
  dialogVisible.visible = false;
  flowCode.value = '';
  buttonLoading.value = false;
};

const { form, rules } = toRefs(data);

/** Reset form */
const reset = () => {
  form.value = { ...initFormData };
  employeePositionChangeFormRef.value?.resetFields();
};

/** Get details */
const getInfo = () => {
  loading.value = true;
  buttonLoading.value = false;
  nextTick(async () => {
    const res = await getDcEmployeePositionChange(routeParams.value.id);
    Object.assign(form.value, res.data);
    loading.value = false;
    buttonLoading.value = false;
  });
};

/** Submit button */
const submitForm = (status: string) => {
  try {
    employeePositionChangeFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let res: AxiosResponse<DcEmployeePositionChangeVO>;
        if (form.value.id) {
          res = await updateDcEmployeePositionChange(form.value).finally(() => (buttonLoading.value = false));
        } else {
          res = await addDcEmployeePositionChange(form.value).finally(() => (buttonLoading.value = false));
        }
        form.value = res.data;
        if (status === 'draft') {
          buttonLoading.value = false;
          proxy?.$modal.msgSuccess('暂存成功');
          proxy.$tab.closePage(proxy.$route);
          proxy.$router.go(-1);
        } else {
          if ((form.value.status === 'draft' && (flowCode.value === '' || flowCode.value === null)) || routeParams.value.type === 'add') {
            flowCode.value = flowCodeOptions[0].value;
            dialogVisible.visible = true;
            return;
          }
          // If already started, pass a dummy parameter
          if (flowCode.value === '' || flowCode.value === null) {
            flowCode.value = 'xx';
          }
          await handleStartWorkFlow(res.data);
        }
      }
    });
  } finally {
    buttonLoading.value = false;
  }
};

const submitFlow = async () => {
  handleStartWorkFlow(form.value);
  dialogVisible.visible = false;
};

// Start workflow
const handleStartWorkFlow = async (data: DcEmployeePositionChangeForm) => {
  try {
    submitFormData.value.flowCode = flowCode.value;
    submitFormData.value.businessId = data.id;
    // Process variables
    taskVariables.value = {
      // Approval process variables
      employeeName: data.employeeName,
      changeType: data.changeType,
      applicant: data.applicant
    };
    submitFormData.value.variables = taskVariables.value;
    const resp = await startWorkFlow(submitFormData.value);
    if (submitVerifyRef.value) {
      buttonLoading.value = false;
      submitVerifyRef.value.openDialog(resp.data.taskId);
    }
  } finally {
    buttonLoading.value = false;
  }
};

// Approval record
const handleApprovalRecord = () => {
  approvalRecordRef.value.init(form.value.id);
};

// Submit callback
const submitCallback = async () => {
  await proxy.$tab.closePage(proxy.$route);
  proxy.$router.go(-1);
};

// Approval
const approvalVerifyOpen = async () => {
  submitVerifyRef.value.openDialog(routeParams.value.taskId);
};

onMounted(() => {
  routeParams.value = proxy.$route.query;
  reset();
  if (routeParams.value.type === 'update' || routeParams.value.type === 'view' || routeParams.value.type === 'approval') {
    getInfo();
  } else {
    loading.value = false;
  }
});
</script>