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
      <el-form ref="approveFormRef" v-loading="loading" :disabled="routeParams.type === 'view'" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审批类型" prop="applyType">
          <el-input v-model="form.applyType" placeholder="请输入审批类型" />
        </el-form-item>
        <el-form-item label="金额" prop="balance">
          <el-input v-model="form.balance" type="number" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="申请原因" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入申请原因" />
        </el-form-item>
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

<script setup name="Approve" lang="ts">
import { addApprove, getApprove, updateApprove } from '@/api/workflow/approve';
import { ApproveForm, ApproveQuery, ApproveVO } from '@/api/workflow/approve/types';
import { startWorkFlow } from '@/api/workflow/task';
import SubmitVerify from '@/components/Process/submitVerify.vue';
import ApprovalRecord from '@/components/Process/approvalRecord.vue';
import ApprovalButton from '@/components/Process/approvalButton.vue';
import { AxiosResponse } from 'axios';
import { StartProcessBo } from '@/api/workflow/workflowCommon/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buttonLoading = ref(false);
const loading = ref(true);
//路由参数
const routeParams = ref<Record<string, any>>({});

const flowCodeOptions = [
  {
    value: 'approve1',
    label: '审批申请-普通'
  }
];

const flowCode = ref<string>('');

const dialogVisible = reactive<DialogOption>({
  visible: false,
  title: '流程定义'
});
//提交组件
const submitVerifyRef = ref<InstanceType<typeof SubmitVerify>>();
//审批记录组件
const approvalRecordRef = ref<InstanceType<typeof ApprovalRecord>>();
//按钮组件
const approvalButtonRef = ref<InstanceType<typeof ApprovalButton>>();

const approveFormRef = ref<ElFormInstance>();

const submitFormData = ref<StartProcessBo>({
  businessId: '',
  flowCode: '',
  variables: {}
});
const taskVariables = ref<Record<string, any>>({});

const initFormData: ApproveForm = {
  id: undefined,
  applyType: undefined,
  balance: undefined,
  remark: undefined,
  status: undefined
};
const data = reactive<PageData<ApproveForm, ApproveQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    applyType: [{ required: true, message: '审批类型不能为空', trigger: 'blur' }],
    balance: [{ required: true, message: '金额不能为空', trigger: 'blur' }]
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
  approveFormRef.value?.resetFields();
};

/** 获取详情 */
const getInfo = () => {
  loading.value = true;
  buttonLoading.value = false;
  nextTick(async () => {
    const res = await getApprove(routeParams.value.id);
    Object.assign(form.value, res.data);
    loading.value = false;
    buttonLoading.value = false;
  });
};

/** 提交按钮 */
const submitForm = (status: string) => {
  try {
    approveFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        let res: AxiosResponse<ApproveVO>;
        if (form.value.id) {
          res = await updateApprove(form.value).finally(() => (buttonLoading.value = false));
        } else {
          res = await addApprove(form.value).finally(() => (buttonLoading.value = false));
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
          //说明启动过先随意穿个参数
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
//提交申请
const handleStartWorkFlow = async (data: ApproveForm) => {
  try {
    submitFormData.value.flowCode = flowCode.value;
    submitFormData.value.businessId = data.id;
    //流程变量
    taskVariables.value = {
      // 审批流程变量
      balance: data.balance
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
//审批记录
const handleApprovalRecord = () => {
  approvalRecordRef.value.init(form.value.id);
};
//提交回调
const submitCallback = async () => {
  await proxy.$tab.closePage(proxy.$route);
  proxy.$router.go(-1);
};
//审批
const approvalVerifyOpen = async () => {
  submitVerifyRef.value.openDialog(routeParams.value.taskId);
};

onMounted(() => {
  nextTick(async () => {
    routeParams.value = proxy.$route.query;
    reset();
    loading.value = false;
    if (routeParams.value.type === 'update' || routeParams.value.type === 'view' || routeParams.value.type === 'approval') {
      getInfo();
    }
  });
});
</script>