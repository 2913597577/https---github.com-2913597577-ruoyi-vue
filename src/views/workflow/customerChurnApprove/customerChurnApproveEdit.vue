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
      <el-form ref="customerChurnApproveFormRef" v-loading="loading" :disabled="routeParams.type === 'view'" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="审批类型" prop="applyType">
          <el-input v-model="form.applyType" placeholder="客户流失审批" readonly />
        </el-form-item>
        
          <el-form-item label="客户名称" prop="customerId">
              <el-select v-model="form.customerId" placeholder="请选择客户" filterable clearable  @change="handleCustomerChange"  :disabled="isCustomerSelectDisabled">
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
      
        <el-form-item label="原因" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入原因" />
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

<script setup name="DcCustomerChurnApprove" lang="ts">
import { addDcCustomerChurnApprove, getDcCustomerChurnApprove, updateDcCustomerChurnApprove } from '@/api/workflow/customerChurnApprove';
import { DcCustomerChurnApproveForm, DcCustomerChurnApproveQuery, DcCustomerChurnApproveVO } from '@/api/workflow/customerChurnApprove/types';
import { startWorkFlow } from '@/api/workflow/task';
import SubmitVerify from '@/components/Process/submitVerify.vue';
import ApprovalRecord from '@/components/Process/approvalRecord.vue';
import ApprovalButton from '@/components/Process/approvalButton.vue';
import { AxiosResponse } from 'axios';
import { StartProcessBo } from '@/api/workflow/workflowCommon/types';
import { get } from 'http';
import { getCustomerByUserId } from '@/api/common';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const loading = ref(true);
// Route parameters
const routeParams = ref<Record<string, any>>({});

const flowCodeOptions = [
  {
    value: 'customerChurnApprove',
    label: '客户流失审批'
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

const customerChurnApproveFormRef = ref<ElFormInstance>();

const submitFormData = ref<StartProcessBo>({
  businessId: '',
  flowCode: '',
  variables: {}
});
const taskVariables = ref<Record<string, any>>({});

const initFormData: DcCustomerChurnApproveForm = {
  id: undefined,
  tenantId: undefined,
  applyType: '客户流失审批',
  customerId: undefined,
  customerName: undefined,
  remark: undefined,
  status: undefined
};
const data = reactive<PageData<DcCustomerChurnApproveForm, DcCustomerChurnApproveQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    applyType: [{ required: true, message: '审批类型不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户id不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }]
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
  customerChurnApproveFormRef.value?.resetFields();
};

/** Get details */
const getInfo = () => {
  loading.value = true;
  buttonLoading.value = false;
  nextTick(async () => {
    const res = await getDcCustomerChurnApprove(routeParams.value.id);
    Object.assign(form.value, res.data);
    loading.value = false;
    buttonLoading.value = false;
  });
};

/** Submit button */
const submitForm = (status: string) => {
  try {

    form.value.applyType = '客户流失审批';

    customerChurnApproveFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let res: AxiosResponse<DcCustomerChurnApproveVO>;
        if (form.value.id) {
          res = await updateDcCustomerChurnApprove(form.value).finally(() => (buttonLoading.value = false));
        } else {
          res = await addDcCustomerChurnApprove(form.value).finally(() => (buttonLoading.value = false));
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
const handleStartWorkFlow = async (data: DcCustomerChurnApproveForm) => {
  try {
    submitFormData.value.flowCode = flowCode.value;
    submitFormData.value.businessId = data.id;
    // Process variables
    taskVariables.value = {
      // Approval process variables
      customerId: data.customerId,
      customerName: data.customerName
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
  // 1. 先等待客户列表加载完成
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
