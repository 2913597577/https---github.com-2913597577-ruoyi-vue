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
      <el-form ref="expenseReimbursementFormRef" v-loading="loading" :disabled="routeParams.type === 'view'" :model="form" :rules="rules" label-width="120px">
        
        <el-row :gutter="20">
          <el-col :span="24">
         <div class="form-section-title">基础信息</div>
       </el-col>
        </el-row>
       
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报销人姓名" prop="applicantName">
              <el-input v-model="form.applicantName" placeholder="请输入报销人姓名" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门" prop="departmentName">
              <el-input v-model="form.departmentName" placeholder="请输入所属部门" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位/职务" prop="position">
              <el-input v-model="form.position" placeholder="请输入岗位/职务" readonly />
            </el-form-item>
          </el-col>
        </el-row>
    
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="填报日期" prop="applyDate">
              <el-date-picker
                v-model="form.applyDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择填报日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报销事由" prop="expenseReason">
              <el-input v-model="form.expenseReason" type="textarea" :rows="1" placeholder="请输入报销事由" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
         <div class="form-section-title">费用明细</div>
       </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="费用日期" prop="expenseDate">
              <el-date-picker
                v-model="form.expenseDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择费用日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="费用类型" prop="expenseType">
              <el-select v-model="form.expenseType" placeholder="请选择费用类型" filterable clearable>
                <el-option v-for="dict in dc_reimbursement_type" :key="dict.value" :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="费用明细描述" prop="expenseDescription">
              <el-input v-model="form.expenseDescription" type="textarea" :rows="1" placeholder="请输入费用明细描述" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="发票总张数" prop="invoiceCount">
              <el-input-number v-model="form.invoiceCount" placeholder="请输入票据张数" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票总金额" prop="invoiceAmount">
              <el-input-number v-model="form.invoiceAmount" placeholder="请输入单据金额" :precision="2" :step="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报销金额" prop="reimbursementAmount">
              <el-input-number v-model="form.reimbursementAmount" placeholder="请输入报销金额" :precision="2" :step="100" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="已预支金额" prop="advancedAmount">
              <el-input-number v-model="form.advancedAmount" placeholder="请输入已预支金额" :precision="2" :step="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应退/应补金额" prop="refundOrSupplement">
              <el-input-number v-model="form.refundOrSupplement" placeholder="请输入应退/应补金额" :precision="2" :step="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="差额说明" prop="differenceReason">
              <el-input v-model="form.differenceReason" type="textarea" :rows="1" placeholder="请输入差额说明" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="发票附件" prop="attachmentPath">
              <el-input v-model="form.attachmentPath" placeholder="请上传电子发票" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
         <div class="form-section-title">财务处理</div>
       </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="form.paymentMethod" placeholder="请选择支付方式">
                <el-option v-for="dict in dc_reimbursement_payment" :key="dict.value" :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付日期" prop="paymentDate">
              <el-date-picker
                v-model="form.paymentDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择费用日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付人" prop="financePayerName">
              <el-input v-model="form.financePayerName" placeholder="请输入支付人" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="收款账户姓名" prop="receiverName">
              <el-input v-model="form.receiverName" placeholder="请输入收款人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款银行名称" prop="receiverBankName">
              <el-input v-model="form.receiverBankName" placeholder="请输入收款账户开户行" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款银行账号" prop="receiverBankAccount">
              <el-input v-model="form.receiverBankAccount" placeholder="请输入收款账户银行账号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="财务记账凭证号" prop="financeVoucherNo">
              <el-input v-model="form.financeVoucherNo" placeholder="请输入财务记账凭证号" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="1" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 提交组件 -->
    <submitVerify ref="submitVerifyRef" :task-variables="taskVariables" @submit-callback="submitCallback" />
    <!-- 审批记录 -->
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

<script setup name="DcExpenseReimbursementEdit" lang="ts">
import { addDcExpenseReimbursement, getDcExpenseReimbursement, updateDcExpenseReimbursement } from '@/api/workflow/expenseReimbursement';
import { DcExpenseReimbursementForm, DcExpenseReimbursementQuery, DcExpenseReimbursementVO } from '@/api/workflow/expenseReimbursement/types';
import { startWorkFlow } from '@/api/workflow/task';
import SubmitVerify from '@/components/Process/submitVerify.vue';
import ApprovalRecord from '@/components/Process/approvalRecord.vue';
import ApprovalButton from '@/components/Process/approvalButton.vue';
import { AxiosResponse } from 'axios';
import { StartProcessBo } from '@/api/workflow/workflowCommon/types';
import { getInfo } from '@/api/login';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_reimbursement_type } = toRefs<any>(proxy?.useDict('dc_reimbursement_type'));
const { dc_reimbursement_payment } = toRefs<any>(proxy?.useDict('dc_reimbursement_payment'));

const buttonLoading = ref(false);
const loading = ref(true);
// 路由参数
const routeParams = ref<Record<string, any>>({});

const flowCodeOptions = [
  {
    value: 'expenseReimbursement',
    label: '报销申请审批'
  }
];

const flowCode = ref<string>('');

const dialogVisible = reactive<DialogOption>({
  visible: false,
  title: '流程定义'
});
// 提交组件
const submitVerifyRef = ref<InstanceType<typeof SubmitVerify>>();
// 审批记录组件
const approvalRecordRef = ref<InstanceType<typeof ApprovalRecord>>();
// 按钮组件
const approvalButtonRef = ref<InstanceType<typeof ApprovalButton>>();

const expenseReimbursementFormRef = ref<ElFormInstance>();

const submitFormData = ref<StartProcessBo>({
  businessId: '',
  flowCode: '',
  variables: {}
});
const taskVariables = ref<Record<string, any>>({});

const initFormData: DcExpenseReimbursementForm = {
  id: undefined,
  applyDate: undefined,
  applicantId: undefined,
  applicantName: undefined,
  departmentId: undefined,
  departmentName: undefined,
  position: undefined,
  expenseReason: undefined,
  expenseDate: undefined,
  expenseType: undefined,
  expenseDescription: undefined,
  invoiceCount: undefined,
  invoiceAmount: undefined,
  reimbursementAmount: undefined,
  differenceReason: undefined,
  attachmentPath: undefined,
  advancedAmount: undefined,
  refundOrSupplement: undefined,
  status: undefined,
  paymentMethod: undefined,
  receiverBankAccount: undefined,
  receiverBankName: undefined,
  receiverName: undefined,
  financeVoucherNo: undefined,
  paymentDate: undefined,
  financePayerId: undefined,
  financePayerName: undefined,
  remark: undefined
};

const data = reactive<PageData<DcExpenseReimbursementForm, DcExpenseReimbursementQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    applyDate: [{ required: true, message: '填报日期不能为空', trigger: 'blur' }],
    applicantName: [{ required: true, message: '报销人姓名不能为空', trigger: 'blur' }],
    departmentName: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }],
    expenseReason: [{ required: true, message: '报销事由不能为空', trigger: 'blur' }],
    expenseDate: [{ required: true, message: '费用日期不能为空', trigger: 'blur' }],
    expenseType: [{ required: true, message: '费用类型不能为空', trigger: 'blur' }],
    expenseDescription: [{ required: true, message: '费用明细描述不能为空', trigger: 'blur' }],
    invoiceCount: [{ required: true, message: '票据张数不能为空', trigger: 'blur' }],
    invoiceAmount: [{ required: true, message: '单据金额不能为空', trigger: 'blur' }],
    reimbursementAmount: [{ required: true, message: '报销金额不能为空', trigger: 'blur' }]
  }
});

const handleClose = () => {
  dialogVisible.visible = false;
  flowCode.value = '';
  buttonLoading.value = false;
};

const { form, rules } = toRefs(data);

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  expenseReimbursementFormRef.value?.resetFields();
};

/** 获取详情 */
const getApproveInfo = () => {
  loading.value = true;
  buttonLoading.value = false;
  nextTick(async () => {
    const res = await getDcExpenseReimbursement(routeParams.value.id);
    Object.assign(form.value, res.data);
    loading.value = false;
    buttonLoading.value = false;
  });
};

/** 提交按钮 */
const submitForm = (status: string) => {
  try {
    expenseReimbursementFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let res: AxiosResponse<DcExpenseReimbursementVO>;
        if (form.value.id) {
          res = await updateDcExpenseReimbursement(form.value).finally(() => (buttonLoading.value = false));
        } else {
          res = await addDcExpenseReimbursement(form.value).finally(() => (buttonLoading.value = false));
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
          // 说明启动过先随意穿个参数
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

// 提交申请
const handleStartWorkFlow = async (data: DcExpenseReimbursementForm) => {
  try {
    submitFormData.value.flowCode = flowCode.value;
    submitFormData.value.businessId = data.id;
    // 流程变量
    taskVariables.value = {
      // 审批流程变量
      reimbursementAmount: data.reimbursementAmount,
      applicantName: data.applicantName,
      departmentName: data.departmentName
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

// 审批记录
const handleApprovalRecord = () => {
  approvalRecordRef.value.init(form.value.id);
};

// 提交回调
const submitCallback = async () => {
  await proxy.$tab.closePage(proxy.$route);
  proxy.$router.go(-1);
};

// 审批
const approvalVerifyOpen = async () => {
  submitVerifyRef.value.openDialog(routeParams.value.taskId);
};

const getUserInfo = async () => { 
  getInfo().then((res) => {
   form.value.applicantId = res.data.user.userId;
   form.value.applicantName = res.data.user.nickName;
   form.value.departmentId = res.data.user.deptId;
   form.value.departmentName = res.data.user.deptName;
   form.value.position = res.data.user.roles.map((role) => role.roleName).join(',');
  });
};


onMounted(() => {
  nextTick(async () => {
    getUserInfo();
    routeParams.value = proxy.$route.query;
    reset();
    loading.value = false;
    if (routeParams.value.type === 'update' || routeParams.value.type === 'view' || routeParams.value.type === 'approval') {
      getApproveInfo();
    }
  });
});
</script>

<style scoped>
.form-section-title {
  font-size: 12px;
  font-weight: bold;
  color:#409EFF;
  margin-bottom: 20px;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

</style>