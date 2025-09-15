<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="companyName" label-width="68px">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="contactPerson" label-width="68px">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款情况" prop="balanceStatus" label-width="68px">
              <el-input v-model="queryParams.balanceStatus" placeholder="请输入尾款情况" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="签约类型" prop="signType" label-width="68px">
              <el-input v-model="queryParams.contractType" placeholder="请输入签约类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始时间" prop="serviceStart" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceStart" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务周期开始时间" />
            </el-form-item>
            <el-form-item label="结束时间" prop="serviceEnd" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceEnd" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务周期结束时间" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['myCustomer:customerTransfer:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['myCustomer:customerTransfer:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['myCustomer:customerTransfer:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['myCustomer:customerTransfer:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerTransferList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="公司名称" align="center" prop="companyName" width="180" show-overflow-tooltip />
        <el-table-column label="公司地址" align="center" prop="companyAddress" width="150" show-overflow-tooltip />
        <el-table-column label="员工人数" align="center" prop="employeeCount" width="80" show-overflow-tooltip />
        <el-table-column label="所属行业" align="center" prop="companyIndustry" width="100" show-overflow-tooltip />
        <el-table-column label="对接人" align="center" prop="contactPerson" width="100" show-overflow-tooltip />
        <el-table-column label="对接人电话" align="center" prop="contactInfo" width="120" show-overflow-tooltip />
        <el-table-column label="对接人职务" align="center" prop="contactPosition" width="100" show-overflow-tooltip />
        <el-table-column label="开始时间" align="center" prop="serviceStart" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceStart, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="serviceEnd" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceEnd, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" align="center" prop="actualPayment" width="100" show-overflow-tooltip />
        <el-table-column label="尾款情况" align="center" prop="balanceStatus" width="100" show-overflow-tooltip />
        <el-table-column label="签约类型" align="center" prop="contractType" width="100" show-overflow-tooltip />
        <el-table-column label="常法签约" align="center" prop="serviceType" width="100" show-overflow-tooltip />
        <el-table-column label="附赠自然人" align="center" prop="additionalPerson" width="100" show-overflow-tooltip />
        <el-table-column label="律师咨询情况" align="center" prop="lawyerConsultation" width="120" show-overflow-tooltip />
        <el-table-column label="其他费用" align="center" prop="otherFee" width="80" show-overflow-tooltip />
        <el-table-column label="财务确认" align="center" prop="financeConfirmed" width="80" show-overflow-tooltip />
        <el-table-column label="自然人电话" align="center" prop="additionalContact" width="120" show-overflow-tooltip />
        <el-table-column label="自然人职务" align="center" prop="additionalPosition" width="100" show-overflow-tooltip />
        <el-table-column label="自然人年龄" align="center" prop="additionalAge" width="90" show-overflow-tooltip />
        <el-table-column label="代账公司" align="center" prop="accountingCompany" width="80" show-overflow-tooltip />
        <el-table-column label="客户描述" align="center" prop="customerDescription" width="120" show-overflow-tooltip />
        <el-table-column label="有过法务" align="center" prop="preLegal" width="80" show-overflow-tooltip />
        <el-table-column label="合作公司名称" align="center" prop="preCompany" width="120" show-overflow-tooltip />
        <el-table-column label="不合作原因" align="center" prop="preReason" width="100" show-overflow-tooltip />
        <el-table-column label="公司纠纷及解决方式" align="center" prop="preDiscuss" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项登记" align="center" prop="pendingMatters" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项备注" align="center" prop="pendingRemark" width="130" show-overflow-tooltip />
        <el-table-column label="欠款问题登记" align="center" prop="debtDetails" width="120" />
        <el-table-column label="欠款问题备注" align="center" prop="debtRemark" width="120" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" show-overflow-tooltip
          width="240" fixed="right">
          <template #default="scope">
            <el-button link type="success" icon="Operation" @click="handleProcess(scope.row)"
              v-hasPermi="['medical:complaint:process']">处置</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['medical:complaint:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['medical:complaint:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户信息录入对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%" append-to-body>
      <el-form ref="customerTransferFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="companyName" label-width="90px">
              <el-input v-model="form.companyName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="companyIndustry" label-width="90px">
              <el-input v-model="form.companyIndustry" placeholder="请输入公司所属行业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司地址" prop="companyAddress" label-width="90px">
              <el-input v-model="form.companyAddress" placeholder="请输入公司地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工人数" prop="employeeCount" label-width="90px">
              <el-input v-model="form.employeeCount" placeholder="请输入员工人数" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户描述" prop="customerDescription" label-width="90px">
              <el-input v-model="form.customerDescription" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接人" prop="contactPerson" label-width="90px">
              <el-input v-model="form.contactPerson" placeholder="请输入公司对接人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接人电话" prop="contactInfo" label-width="90px">
              <el-input v-model="form.contactInfo" placeholder="请输入公司对接人联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接人职务" prop="contactPosition" label-width="90px">
              <el-input v-model="form.contactPosition" placeholder="请输入对接人职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接人年龄" prop="contactAge" label-width="90px">
              <el-input v-model="form.contactAge" placeholder="请输入对接人年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附赠自然人" prop="additionalPerson" label-width="90px">
              <el-input v-model="form.additionalPerson" placeholder="请输入附赠自然人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自然人电话" prop="additionalContact" label-width="90px">
              <el-input v-model="form.additionalContact" placeholder="请输入附赠自然人联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自然人职务" prop="additionalPosition" label-width="90px">
              <el-input v-model="form.additionalPosition" placeholder="请输入附赠自然人职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自然人年龄" prop="additionalAge" label-width="90px">
              <el-input v-model="form.additionalAge" placeholder="请输入附赠自然人年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="咨询情况" prop="lawyerConsultation" label-width="90px">
              <el-input v-model="form.lawyerConsultation" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用沟通" prop="otherFee" label-width="90px">
              <el-input v-model="form.otherFee" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="欠款问题" prop="debtRemark" label-width="90px">
              <el-input v-model="form.debtRemark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实付金额" prop="actualPayment" label-width="90px">
              <el-input v-model="form.actualPayment" placeholder="请输入实付金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尾款情况" prop="balanceStatus" label-width="90px">
              <el-input v-model="form.balanceStatus" placeholder="请输入尾款情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="serviceStart" label-width="90px">
              <el-date-picker clearable v-model="form.serviceStart" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择服务周期开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="serviceEnd" label-width="90px">
              <el-date-picker clearable v-model="form.serviceEnd" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择服务周期结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作公司" prop="preCompany" label-width="90px">
              <el-input v-model="form.preCompany" placeholder="请输入以前合作公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不合作原因" prop="preReason" label-width="90px">
              <el-input v-model="form.preReason" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出现过的纠纷及解决方式" prop="preDiscuss" label-width="180px">
              <el-input v-model="form.preDiscuss" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="待处理事项" prop="pendingRemark" label-width="90px">
              <el-input v-model="form.pendingRemark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="财务签名" prop="financeSignature" label-width="90px">
              <el-input v-model="form.financeSignature" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="auditDialogVisible" title="审核" width="500px" append-to-body>
      <el-form :model="auditForm" label-width="100px">
        <!-- 审核状态 -->
        <el-form-item label="审核">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">未通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 上传签名：仅在通过时显示 -->
        <el-form-item v-if="auditForm.auditStatus === '1'" label="电子签名">
          <fileUpload v-model="localFileList" :limit="1" :file-size="2" :file-type="['png', 'jpg', 'jpeg']"
            :is-show-tip="false" />
          <div v-if="localFileList.length > 0 && localFileList[0].url" style="margin-top: 8px;">
            <img :src="localFileList[0].url" class="signature-preview" />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: right;">
          <el-button @click="auditCancel" :disabled="submitting">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submitAudit">确定</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="CustomerTransfer" lang="ts">
import { listCustomerTransfer, getCustomerTransfer, delCustomerTransfer, addCustomerTransfer, updateCustomerTransfer, audit } from '@/api/myCustomer/customerTransfer';
import { CustomerTransferVO, CustomerTransferQuery, CustomerTransferForm } from '@/api/myCustomer/customerTransfer/types';
import { ElMessage } from 'element-plus';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerTransferList = ref<CustomerTransferVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerTransferFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerTransferForm = {
  id: undefined,
  companyName: undefined,
  contactPerson: undefined,
  contactInfo: undefined,
  contactPosition: undefined,
  contactAge: undefined,
  additionalPerson: undefined,
  additionalContact: undefined,
  additionalPosition: undefined,
  additionalAge: undefined,
  companyIndustry: undefined,
  companyAddress: undefined,
  employeeCount: undefined,
  accountingCompany: undefined,
  customerDescription: undefined,
  actualPayment: undefined,
  balanceStatus: undefined,
  contractType: undefined,
  serviceType: undefined,
  serviceStart: undefined,
  serviceEnd: undefined,
  lawyerConsultation: undefined,
  otherFee: undefined,
  financeConfirmed: undefined,
  financeSignature: undefined,
  preLegal: undefined,
  preCompany: undefined,
  preReason: undefined,
  preDiscuss: undefined,
  pendingMatters: [],
  pendingRemark: undefined,
  debtDetails: [],
  debtRemark: undefined,
}
const data = reactive<PageData<CustomerTransferForm, CustomerTransferQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyName: undefined,
    contactPerson: undefined,
    contactInfo: undefined,
    contactPosition: undefined,
    contactAge: undefined,
    additionalPerson: undefined,
    additionalContact: undefined,
    additionalPosition: undefined,
    additionalAge: undefined,
    companyIndustry: undefined,
    companyAddress: undefined,
    employeeCount: undefined,
    accountingCompany: undefined,
    customerDescription: undefined,
    actualPayment: undefined,
    balanceStatus: undefined,
    contractType: undefined,
    serviceType: undefined,
    serviceStart: undefined,
    serviceEnd: undefined,
    lawyerConsultation: undefined,
    otherFee: undefined,
    financeConfirmed: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "公司名称不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "公司对接人不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户信息录入列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerTransfer(queryParams.value);
  customerTransferList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  customerTransferFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CustomerTransferVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户信息录入";
}

/** 修改按钮操作 */
/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerTransferVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerTransfer(_id);
  Object.assign(form.value, res.data);
  // 添加空值检查
  form.value.pendingMatters = form.value.pendingMatters ? form.value.pendingMatters.split(",") : [];
  form.value.debtDetails = form.value.debtDetails ? form.value.debtDetails.split(",") : [];
  dialog.visible = true;
  dialog.title = "修改客户信息录入";
}
// 弹窗显示
const auditDialogVisible = ref(false)
// 当前行
const currentRow = ref<any>(null)
// 提交状态
const submitting = ref(false)

// 上传相关
const localFileList = ref([])
const auditForm = ref({ auditStatus: '1', pictureUrl: '' })
// 打开审核弹窗
const handleProcess = (row?: any) => {
  currentRow.value = row || null
  localFileList.value = []
  auditDialogVisible.value = true
}

// 点击取消
function auditCancel() {
  auditDialogVisible.value = false
}

// 提交审核
async function submitAudit() {
  if (submitting.value) return
  console.log(localFileList.value[0])
  // 如果审核通过，必须上传签名图片
  if (auditForm.value.auditStatus === '1') {
    if (localFileList.value.length === 0 || !(localFileList.value[0].raw instanceof File)) {
      ElMessage.warning('请先上传签名图片（必须是文件）')
      return
    }
  }

  submitting.value = true
  try {
    let pictureFile: File | string = ''
    if (auditForm.value.auditStatus === '1') {
      pictureFile = localFileList.value[0].raw
    }

    const res = await audit(
      currentRow.value?.id || '',
      auditForm.value.auditStatus,
      pictureFile
    )

    if (res && res.code === 200) {
      ElMessage.success('操作成功')
      auditDialogVisible.value = false
      // 刷新列表
      // emit('success') 或 getList()
    } else {
      ElMessage.error(res?.msg || '操作失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('请求出错，请稍后再试')
  } finally {
    submitting.value = false
  }
}
/** 提交按钮 */
const submitForm = () => {
  customerTransferFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.pendingMatters = form.value.pendingMatters.join(",");
      form.value.debtDetails = form.value.debtDetails.join(",");
      if (form.value.id) {
        await updateCustomerTransfer(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerTransfer(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}
/** 删除按钮操作 */
const handleDelete = async (row?: CustomerTransferVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户信息录入编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerTransfer(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('myCustomer/customerTransfer/export', {
    ...queryParams.value
  }, `customerTransfer_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
<style scoped>
.signature-preview {
  width: 160px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 4px;
  background: #fff;
}
</style>