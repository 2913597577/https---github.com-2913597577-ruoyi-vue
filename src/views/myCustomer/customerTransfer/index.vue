<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="公司对接人" prop="contactPerson">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="公司对接人联系方式" prop="contactInfo">
              <el-input v-model="queryParams.contactInfo" placeholder="请输入公司对接人联系方式" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人职务" prop="contactPosition">
              <el-input v-model="queryParams.contactPosition" placeholder="请输入对接人职务" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人年龄" prop="contactAge">
              <el-input v-model="queryParams.contactAge" placeholder="请输入对接人年龄" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="附赠自然人" prop="additionalPerson">
              <el-input v-model="queryParams.additionalPerson" placeholder="请输入附赠自然人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="附赠自然人联系方式" prop="additionalContact">
              <el-input v-model="queryParams.additionalContact" placeholder="请输入附赠自然人联系方式" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="附赠自然人职务" prop="additionalPosition">
              <el-input v-model="queryParams.additionalPosition" placeholder="请输入附赠自然人职务" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="附赠自然人年龄" prop="additionalAge">
              <el-input v-model="queryParams.additionalAge" placeholder="请输入附赠自然人年龄" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="公司所属行业" prop="companyIndustry">
              <el-input v-model="queryParams.companyIndustry" placeholder="请输入公司所属行业" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="queryParams.companyAddress" placeholder="请输入公司地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="员工人数" prop="employeeCount">
              <el-input v-model="queryParams.employeeCount" placeholder="请输入员工人数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户性格及工作习惯描述" prop="customerDescription">
              <el-input v-model="queryParams.customerDescription" placeholder="请输入客户性格及工作习惯描述" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="实付金额" prop="actualPayment">
              <el-input v-model="queryParams.actualPayment" placeholder="请输入实付金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款情况" prop="balanceStatus">
              <el-input v-model="queryParams.balanceStatus" placeholder="请输入尾款情况" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="服务周期开始时间" prop="serviceStart">
              <el-date-picker clearable
                v-model="queryParams.serviceStart"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择服务周期开始时间"
              />
            </el-form-item>
            <el-form-item label="服务周期结束时间" prop="serviceEnd">
              <el-date-picker clearable
                v-model="queryParams.serviceEnd"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择服务周期结束时间"
              />
            </el-form-item>
            <el-form-item label="律师咨询情况" prop="lawyerConsultation">
              <el-input v-model="queryParams.lawyerConsultation" placeholder="请输入律师咨询情况" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="其他费用沟通" prop="otherFee">
              <el-input v-model="queryParams.otherFee" placeholder="请输入其他费用沟通" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['myCustomer:customerTransfer:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['myCustomer:customerTransfer:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['myCustomer:customerTransfer:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['myCustomer:customerTransfer:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerTransferList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="公司名称" align="center" prop="companyName" />
        <el-table-column label="公司对接人" align="center" prop="contactPerson" />
        <el-table-column label="公司对接人联系方式" align="center" prop="contactInfo" />
        <el-table-column label="对接人职务" align="center" prop="contactPosition" />
        <el-table-column label="对接人年龄" align="center" prop="contactAge" />
        <el-table-column label="附赠自然人" align="center" prop="additionalPerson" />
        <el-table-column label="附赠自然人联系方式" align="center" prop="additionalContact" />
        <el-table-column label="附赠自然人职务" align="center" prop="additionalPosition" />
        <el-table-column label="附赠自然人年龄" align="center" prop="additionalAge" />
        <el-table-column label="公司所属行业" align="center" prop="companyIndustry" />
        <el-table-column label="公司地址" align="center" prop="companyAddress" />
        <el-table-column label="员工人数" align="center" prop="employeeCount" />
        <el-table-column label="是否有代账公司(1:是,0:否)" align="center" prop="accountingCompany" />
        <el-table-column label="客户性格及工作习惯描述" align="center" prop="customerDescription" />
        <el-table-column label="实付金额" align="center" prop="actualPayment" />
        <el-table-column label="尾款情况" align="center" prop="balanceStatus" />
        <el-table-column label="签约类型(1-常法 2-单项 3-律师费 4-其他)" align="center" prop="contractType" />
        <el-table-column label="常法签约(1-升级版 2-标准版 3-其他)" align="center" prop="serviceType" />
        <el-table-column label="服务周期开始时间" align="center" prop="serviceStart" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceStart, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务周期结束时间" align="center" prop="serviceEnd" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceEnd, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="律师咨询情况" align="center" prop="lawyerConsultation" />
        <el-table-column label="其他费用沟通" align="center" prop="otherFee" />
        <el-table-column label="财务是否确认(1:是,0:否)" align="center" prop="financeConfirmed" />
        <el-table-column label="以前是否有过公司法务(1:是,0:否)" align="center" prop="preLegal" />
        <el-table-column label="以前合作公司名称" align="center" prop="preCompany" />
        <el-table-column label="以前不合作原因" align="center" prop="preReason" />
        <el-table-column label="公司以前出现过的纠纷及解决方式" align="center" prop="preDiscuss" />
        <el-table-column label="待处理事项登记(1-劳资纠纷2-合同纠纷3-借贷纠纷4-承揽纠纷5-财税问题6-执行案件7-其他)" align="center" prop="pendingMatters" />
        <el-table-column label="待处理事项备注" align="center" prop="pendingRemark" />
        <el-table-column label="欠款问题详细登记(1- 相关主体2-已知债务人信息3-标的额4-证据情况5-案件处理要求6-其他)" align="center" prop="debtDetails" />
        <el-table-column label="欠款问题备注" align="center" prop="debtRemark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['myCustomer:customerTransfer:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['myCustomer:customerTransfer:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户信息录入对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerTransferFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司对接人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入公司对接人" />
        </el-form-item>
        <el-form-item label="公司对接人联系方式" prop="contactInfo">
          <el-input v-model="form.contactInfo" placeholder="请输入公司对接人联系方式" />
        </el-form-item>
        <el-form-item label="对接人职务" prop="contactPosition">
          <el-input v-model="form.contactPosition" placeholder="请输入对接人职务" />
        </el-form-item>
        <el-form-item label="对接人年龄" prop="contactAge">
          <el-input v-model="form.contactAge" placeholder="请输入对接人年龄" />
        </el-form-item>
        <el-form-item label="附赠自然人" prop="additionalPerson">
          <el-input v-model="form.additionalPerson" placeholder="请输入附赠自然人" />
        </el-form-item>
        <el-form-item label="附赠自然人联系方式" prop="additionalContact">
          <el-input v-model="form.additionalContact" placeholder="请输入附赠自然人联系方式" />
        </el-form-item>
        <el-form-item label="附赠自然人职务" prop="additionalPosition">
          <el-input v-model="form.additionalPosition" placeholder="请输入附赠自然人职务" />
        </el-form-item>
        <el-form-item label="附赠自然人年龄" prop="additionalAge">
          <el-input v-model="form.additionalAge" placeholder="请输入附赠自然人年龄" />
        </el-form-item>
        <el-form-item label="公司所属行业" prop="companyIndustry">
          <el-input v-model="form.companyIndustry" placeholder="请输入公司所属行业" />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model="form.companyAddress" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="员工人数" prop="employeeCount">
          <el-input v-model="form.employeeCount" placeholder="请输入员工人数" />
        </el-form-item>
        <el-form-item label="客户性格及工作习惯描述" prop="customerDescription">
            <el-input v-model="form.customerDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="实付金额" prop="actualPayment">
          <el-input v-model="form.actualPayment" placeholder="请输入实付金额" />
        </el-form-item>
        <el-form-item label="尾款情况" prop="balanceStatus">
          <el-input v-model="form.balanceStatus" placeholder="请输入尾款情况" />
        </el-form-item>
        <el-form-item label="服务周期开始时间" prop="serviceStart">
          <el-date-picker clearable
            v-model="form.serviceStart"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择服务周期开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="服务周期结束时间" prop="serviceEnd">
          <el-date-picker clearable
            v-model="form.serviceEnd"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择服务周期结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="律师咨询情况" prop="lawyerConsultation">
            <el-input v-model="form.lawyerConsultation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="其他费用沟通" prop="otherFee">
            <el-input v-model="form.otherFee" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="财务签名" prop="financeSignature">
            <el-input v-model="form.financeSignature" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="以前合作公司名称" prop="preCompany">
          <el-input v-model="form.preCompany" placeholder="请输入以前合作公司名称" />
        </el-form-item>
        <el-form-item label="以前不合作原因" prop="preReason">
            <el-input v-model="form.preReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="公司以前出现过的纠纷及解决方式" prop="preDiscuss">
            <el-input v-model="form.preDiscuss" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="待处理事项备注" prop="pendingRemark">
            <el-input v-model="form.pendingRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="欠款问题备注" prop="debtRemark">
            <el-input v-model="form.debtRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CustomerTransfer" lang="ts">
import { listCustomerTransfer, getCustomerTransfer, delCustomerTransfer, addCustomerTransfer, updateCustomerTransfer } from '@/api/myCustomer/customerTransfer';
import { CustomerTransferVO, CustomerTransferQuery, CustomerTransferForm } from '@/api/myCustomer/customerTransfer/types';

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
  form: {...initFormData},
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
  form.value = {...initFormData};
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
const handleUpdate = async (row?: CustomerTransferVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerTransfer(_id);
  Object.assign(form.value, res.data);
  form.value.pendingMatters = form.value.pendingMatters.split(",");
  form.value.debtDetails = form.value.debtDetails.split(",");
  dialog.visible = true;
  dialog.title = "修改客户信息录入";
}

/** 提交按钮 */
const submitForm = () => {
  customerTransferFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
        form.value.pendingMatters = form.value.pendingMatters.join(",");
        form.value.debtDetails = form.value.debtDetails.join(",");
      if (form.value.id) {
        await updateCustomerTransfer(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerTransfer(form.value).finally(() =>  buttonLoading.value = false);
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
