<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="法务支持" prop="lawyerId">
              <el-input v-model="queryParams.lawyerId" placeholder="请输入法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户id" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="principal">
              <el-input v-model="queryParams.principal" placeholder="请输入客户对接人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人联系方式" prop="principalPhone" label-width="120px"
              :style="{ '--el-form-label-font-size': '14px' }">
              <el-input v-model="queryParams.principalPhone" placeholder="请输入客户对接人联系方式" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="大成负责人" prop="inviterId" label-width="100px"
              :style="{ '--el-form-label-font-size': '14px' }">
              <el-input v-model="queryParams.inviterId" placeholder="请输入大成负责人id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="签约日期" prop="signDate">
              <el-date-picker clearable v-model="queryParams.signDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择签约日期" />
            </el-form-item>
            <el-form-item label="到期时间" prop="expireDate">
              <el-date-picker clearable v-model="queryParams.expireDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择到期时间" />
            </el-form-item>
            <el-form-item label="签单金额" prop="contractAmount">
              <el-input v-model="queryParams.contractAmount" placeholder="请输入签单金额" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="服务时长" prop="serviceHours">
              <el-input v-model="queryParams.serviceHours" placeholder="请输入服务时长" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item :label="customerTypeLabel + '原因'" prop="reasons">
              <el-input v-model="form.reasons" :placeholder="'请输入' + customerTypeLabel + '原因'" />
            </el-form-item>
            <el-form-item label="退款金额" prop="refundAmount">
              <el-input v-model="queryParams.refundAmount" placeholder="请输入退款金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="备注" prop="remark1">
              <el-input v-model="queryParams.remark1" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="备注" prop="remark2">
              <el-input v-model="queryParams.remark2" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="备注" prop="remark3">
              <el-input v-model="queryParams.remark3" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
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
              v-hasPermi="['customerRiskRefund:customerRiskRefund:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerRiskRefundList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="法务支持" align="center" prop="lawyerId" />
        <el-table-column label="客户id" align="center" prop="customerId" />
        <el-table-column label="客户名称" align="center" prop="customerName" />
        <el-table-column label="客户对接人" align="center" prop="principal" />
        <el-table-column label="客户对接人联系方式" align="center" prop="principalPhone" />
        <el-table-column label="大成负责人id" align="center" prop="inviterId" />
        <el-table-column label="签约日期" align="center" prop="signDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" prop="expireDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签单金额" align="center" prop="contractAmount" />
        <el-table-column label="服务时长" align="center" prop="serviceHours" />
        <el-table-column :label="customerTypeLabel" align="center" prop="customerType" />
        <el-table-column :label="customerTypeLabel + '原因'" align="center" prop="reasons" />
        <el-table-column label="退款金额" align="center" prop="refundAmount" />
        <el-table-column label="备注" align="center" prop="remark1" />
        <el-table-column label="备注" align="center" prop="remark2" />
        <el-table-column label="备注" align="center" prop="remark3" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['customerRiskRefund:customerRiskRefund:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['customerRiskRefund:customerRiskRefund:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户风险/退费对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerRiskRefundFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="法务支持" prop="lawyerId">
          <el-input v-model="form.lawyerId" placeholder="请输入法务支持" />
        </el-form-item>
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户对接人" prop="principal">
          <el-input v-model="form.principal" placeholder="请输入客户对接人" />
        </el-form-item>
        <el-form-item label="客户对接人联系方式" prop="principalPhone">
          <el-input v-model="form.principalPhone" placeholder="请输入客户对接人联系方式" />
        </el-form-item>
        <el-form-item label="大成负责人id" prop="inviterId">
          <el-input v-model="form.inviterId" placeholder="请输入大成负责人id" />
        </el-form-item>
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable v-model="form.signDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择签约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker clearable v-model="form.expireDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签单金额" prop="contractAmount">
          <el-input v-model="form.contractAmount" placeholder="请输入签单金额" />
        </el-form-item>
        <el-form-item label="服务时长" prop="serviceHours">
          <el-input v-model="form.serviceHours" placeholder="请输入服务时长" />
        </el-form-item>
        <el-form-item :label="customerTypeLabel + '原因'" prop="reasons">
          <el-input v-model="form.reasons" placeholder="请输入风险/退费原因" />
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input v-model="form.refundAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark1">
          <el-input v-model="form.remark1" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark2">
          <el-input v-model="form.remark2" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark3">
          <el-input v-model="form.remark3" type="textarea" placeholder="请输入内容" />
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

<script setup name="CustomerRiskRefund" lang="ts">
import { listCustomerRiskRefund, getCustomerRiskRefund, delCustomerRiskRefund, addCustomerRiskRefund, updateCustomerRiskRefund } from '@/api/customerRiskRefund/customerRiskRefund';
import { CustomerRiskRefundVO, CustomerRiskRefundQuery, CustomerRiskRefundForm } from '@/api/customerRiskRefund/customerRiskRefund/types';
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerRiskRefundList = ref<CustomerRiskRefundVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const route = useRoute()

const queryFormRef = ref<ElFormInstance>();
const customerRiskRefundFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerRiskRefundForm = {
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
  customerType: undefined,
  reasons: undefined,
  refundAmount: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
}
const data = reactive<PageData<CustomerRiskRefundForm, CustomerRiskRefundQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
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
    customerType: undefined,
    reasons: undefined,
    refundAmount: undefined,
    remark1: undefined,
    remark2: undefined,
    remark3: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    principal: [
      { required: true, message: "客户对接人不能为空", trigger: "blur" }
    ],
    signDate: [
      { required: true, message: "签约日期不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const customerTypeLabel = computed(() => {
  const pathArr = route.path.split("/");
  const lastSegment = pathArr[pathArr.length - 1];
  if (lastSegment === "1") return "风险";
  if (lastSegment === "2") return "退费";
  return "风险/退费";
});/** 查询客户风险/退费列表 */
const getList = async () => {
  loading.value = true;
  // 把路由参数绑定到 customerType
  // 从路由 path 截取最后一个部分作为 customerType
  const pathArr = route.path.split("/");
  const lastSegment = pathArr[pathArr.length - 1];
  if (lastSegment) {
    console.log('lastSegment:', lastSegment)
    queryParams.value.customerType = Number(lastSegment);
  }
  const res = await listCustomerRiskRefund(queryParams.value);
  customerRiskRefundList.value = res.rows;
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
  customerRiskRefundFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerRiskRefundVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  const title = customerTypeLabel.value;
  dialog.title = `添加客户${title}原因`;
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerRiskRefundVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerRiskRefund(_id);
  Object.assign(form.value, res.data);
  form.value.customerType = form.value.customerType.split(",");
  dialog.visible = true;
  const title = customerTypeLabel.value;
  dialog.title = `修改客户${title}`;
}
/** 提交按钮 */
const submitForm = () => {
  customerRiskRefundFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      // 获取路由最后一段，赋值给 customerType
      const pathArr = route.path.split("/");
      const lastSegment = pathArr[pathArr.length - 1];
      form.value.customerType = Number(lastSegment);

      if (form.value.id) {
        await updateCustomerRiskRefund(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerRiskRefund(form.value).finally(() => buttonLoading.value = false);
      }

      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerRiskRefundVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户风险/退费编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerRiskRefund(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerRiskRefund/customerRiskRefund/export', {
    ...queryParams.value
  }, `customerRiskRefund_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
