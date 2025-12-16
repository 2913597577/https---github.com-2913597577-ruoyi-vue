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
      <el-form ref="customerRiskRefundFormRef" v-loading="loading" :disabled="routeParams.type === 'view'" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户名称" prop="customerId">
              <el-select v-model="form.customerId" placeholder="请选择客户" filterable clearable @change="handleCustomerChange" :disabled="isCustomerSelectDisabled">
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户对接人" prop="principal">
              <el-input v-model="form.principal" placeholder="请输入客户对接人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对接人电话" prop="principalPhone">
              <el-input v-model="form.principalPhone" placeholder="请输入对接人电话" />
            </el-form-item>
          </el-col>
        </el-row>
           
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="原合同号" prop="contractNo">
              <el-input v-model="form.contractNo" placeholder="请输入原合同号，用于追溯" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="大成负责人" prop="inviterId">
              <el-select v-model="form.inviterId" placeholder="请选择大成负责人" filterable clearable>
                <el-option v-for="item in inviterList" :key="item.userId" :label="item.nickName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="8">
            <el-form-item label="法务支持" prop="lawyerId">
              <el-select v-model="form.lawyerId" placeholder="请选择法务支持人员" filterable clearable>
                <el-option v-for="item in lawyerList" :key="item.userId" :label="item.nickName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="签约日期" prop="signDate">
              <el-date-picker
                v-model="form.signDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择签约日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期时间" prop="expireDate">
              <el-date-picker
                v-model="form.expireDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择到期时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务时长" prop="serviceHours">
              <el-input v-model="form.serviceHours" placeholder="请输入服务时长" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="合同金额" prop="contractAmount">
              <el-input-number v-model="form.contractAmount" placeholder="请输入合同金额" :precision="2" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收金额" prop="actualReceipt">
              <el-input-number v-model="form.actualReceipt" placeholder="请输入实收金额" :precision="2" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="尾款金额" prop="balance">
              <el-input-number v-model="form.balance" placeholder="请输入尾款金额" :precision="2" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="退款金额" prop="refundAmount">
              <el-input-number v-model="form.refundAmount" placeholder="请输入退款金额" :precision="2" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="退费原因" prop="reasons">
              <el-input v-model="form.reasons" type="textarea" :rows="1" placeholder="请输入退费原因" />
            </el-form-item>
          </el-col> 
         
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="退款方式" prop="refundMethod">
              <el-select v-model="form.refundMethod" placeholder="请选择退款方式" filterable clearable>
                <el-option v-for="item in inviterList" :key="item.userId" :label="item.nickName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款日期" prop="refundDate">
              <el-date-picker
                v-model="form.refundDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择退款日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款凭证号" prop="refundVoucherNo">
              <el-input v-model="form.refundVoucherNo" placeholder="请输入退款凭证号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="退款方开户名" prop="refundAccountName">
              <el-input v-model="form.refundAccountName" placeholder="请输入退款方开户名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款方开户银行" prop="refundBank">
              <el-input v-model="form.refundBank" placeholder="请输入退款方开户行" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款方银行账号" prop="bankNumber">
              <el-input v-model="form.bankNumber" placeholder="请输入退款方开户行账号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="我方付款账户" prop="remark1">
              <el-input v-model="form.remark1" placeholder="请输入我方付款账户" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="财务处理人" prop="financePayer">
              <el-input v-model="form.financePayer" placeholder="请输入财务处理人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记账凭证号" prop="accountingVoucherNo">
              <el-input v-model="form.accountingVoucherNo" placeholder="请输入财务记账凭证号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark2">
              <el-input v-model="form.remark2" type="textarea" :rows="2" placeholder="请输入备注2" />
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="DcCustomerRiskRefund" lang="ts">
import { addDcCustomerRiskRefund, getDcCustomerRiskRefund, updateDcCustomerRiskRefund } from '@/api/workflow/refundCustomer';
import { DcCustomerRiskRefundForm, DcCustomerRiskRefundQuery, DcCustomerRiskRefundVO } from '@/api/workflow/refundCustomer/types';
import { startWorkFlow } from '@/api/workflow/task';
import SubmitVerify from '@/components/Process/submitVerify.vue';
import ApprovalRecord from '@/components/Process/approvalRecord.vue';
import ApprovalButton from '@/components/Process/approvalButton.vue';
import { AxiosResponse } from 'axios';
import { StartProcessBo } from '@/api/workflow/workflowCommon/types';
import { getCustomerByUserId } from '@/api/common';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const loading = ref(true);
// Route parameters
const routeParams = ref<Record<string, any>>({});

const flowCodeOptions = [
  {
    value: 'customerRiskRefund',
    label: '客户退费审批'
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

const customerRiskRefundFormRef = ref<ElFormInstance>();

const submitFormData = ref<StartProcessBo>({
  businessId: '',
  flowCode: '',
  variables: {}
});
const taskVariables = ref<Record<string, any>>({});

const initFormData: DcCustomerRiskRefundForm = {
  id: undefined,
  lawyerId: undefined,
  customerId: undefined,
  customerName: undefined,
  principal: undefined,
  principalPhone: undefined,
  inviterId: undefined,
  signDate: undefined,
  expireDate: undefined,
  contractAmount: undefined,
  serviceHours: undefined,
  reasons: undefined,
  refundAmount: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
  status: undefined
};
const data = reactive<PageData<DcCustomerRiskRefundForm, DcCustomerRiskRefundQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    customerId: [{ required: true, message: '客户id不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
    reasons: [{ required: true, message: '退费原因不能为空', trigger: 'blur' }],
    refundAmount: [{ required: true, message: '退款金额不能为空', trigger: 'blur' }],
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
  customerRiskRefundFormRef.value?.resetFields();
};

/** Get details */
const getInfo = () => {
  loading.value = true;
  buttonLoading.value = false;
  nextTick(async () => {
    const res = await getDcCustomerRiskRefund(routeParams.value.id);
    Object.assign(form.value, res.data);
    loading.value = false;
    buttonLoading.value = false;
  });
};

/** Submit button */
const submitForm = (status: string) => {
  try {
    customerRiskRefundFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let res: AxiosResponse<DcCustomerRiskRefundVO>;
        if (form.value.id) {
          res = await updateDcCustomerRiskRefund(form.value).finally(() => (buttonLoading.value = false));
        } else {
          res = await addDcCustomerRiskRefund(form.value).finally(() => (buttonLoading.value = false));
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
const handleStartWorkFlow = async (data: DcCustomerRiskRefundForm) => {
  try {
    submitFormData.value.flowCode = flowCode.value;
    submitFormData.value.businessId = data.id;
    // Process variables
    taskVariables.value = {
      // Approval process variables
      customerId: data.customerId,
      customerName: data.customerName,
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

const customerList = ref<any[]>([]);
const lawyerList = ref<any[]>([]);
const inviterList = ref<any[]>([]);

const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}

const handleCustomerChange = (customerId) => {
  if (customerId) {
    const selectedCustomer = customerList.value.find(
      item => item.customer_id === customerId
    );
    if (selectedCustomer) {
      form.value.customerName = selectedCustomer.customer_name;
    }
  } else {
    form.value.customerName = '';
  }
};

const isCustomerSelectDisabled = computed(() => {
  return routeParams.value.type === 'add' && routeParams.value.customerId;
});

onMounted(async () => {
  // 1. 先等待客户列表
   await loadCustomerList(); 
  
  // 2. 列表加载完成后，再处理路由参数
  nextTick(() => {
    routeParams.value = proxy.$route.query;
    reset();
    
    if (routeParams.value.type === 'add' && routeParams.value.customerId) {
      // 此时 customerList 已经有数据了
      form.value.customerId = routeParams.value.customerId;
      form.value.customerName = customerList.value.find(item => item.customer_id === routeParams.value.customerId)?.customer_name;
    }
    
    loading.value = false;
    
    // 对于编辑、查看、审批，也在列表加载后再获取详情
    if (routeParams.value.type === 'update' || routeParams.value.type === 'view' || routeParams.value.type === 'approval') {
      getInfo();
    }
  });
});
</script>