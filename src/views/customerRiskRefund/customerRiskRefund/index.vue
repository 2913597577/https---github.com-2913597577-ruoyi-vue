<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="客户名称" prop="customerName" label-width="68px">
              <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="principal" label-width="68px">
              <el-input v-model="queryParams.principal" placeholder="请输入客户对接人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="负责人" prop="inviterId" label-width="68px"
              :style="{ '--el-form-label-font-size': '14px' }">
              <el-input v-model="queryParams.inviterId" placeholder="请输入大成负责人id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="到期时间" prop="expireDate" label-width="68px">
              <el-date-picker clearable v-model="queryParams.expireDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择到期时间" />
            </el-form-item>
            <el-form-item label="服务时长" prop="serviceHours" label-width="68px">
              <el-input v-model="queryParams.serviceHours" placeholder="请输入服务时长" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="风险" prop="customerType" label-width="68px">
              <el-select v-model="queryParams.customerType" placeholder="请选择风险" clearable>
                <el-option label="风险" value="1"></el-option>
                <el-option label="退费" value="2"></el-option>
              </el-select>
            </el-form-item> -->
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:edit']">修改</el-button>
          </el-col> -->
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
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="客户名称" align="center" prop="customerName" width="120" show-overflow-tooltip />
        <el-table-column label="负责人" align="center" prop="principal" width="90" show-overflow-tooltip />
        <el-table-column label="负责人电话" align="center" prop="principalPhone" width="100" show-overflow-tooltip />
        <el-table-column label="法务支持" align="center" width="100" prop="lawyerId" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.lawyerId">
              {{ getLawyerNameById(scope.row.lawyerId) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="签单金额" align="center" prop="contractAmount" width="90" show-overflow-tooltip />
        <el-table-column label="退款金额" align="center" prop="refundAmount" width="90" show-overflow-tooltip
        v-if="customerTypeLabel == '退费'" />
        <!-- <el-table-column label="大成负责人" align="center" prop="inviterId" width="90" show-overflow-tooltip /> -->
        <el-table-column label="签约日期" align="center" prop="signDate" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" prop="expireDate" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
       
        <el-table-column label="服务时长" align="center" prop="serviceHours" width="80" show-overflow-tooltip />
        <!-- <el-table-column :label="customerTypeLabel" align="center" prop="customerType" width="80" show-overflow-tooltip /> -->
        <el-table-column :label="customerTypeLabel + '原因'" align="center" prop="reasons" width="120"
          show-overflow-tooltip />
       
        <el-table-column label="备注" align="center" prop="remark1" width="100" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip
          width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:edit']">
              修改
            </el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['customerRiskRefund:customerRiskRefund:remove']">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户风险/退费对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerRiskRefundFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="法务支持" prop="lawyerId" label-width="90px">
          <el-input v-model="form.lawyerId" placeholder="请输入法务支持" />
        </el-form-item> -->
        <el-form-item label="法务支持" prop="legalSupport" label-width="90px">
          <el-select filterable v-model="form.lawyerId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName" label-width="90px">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="对接人" prop="principal" label-width="90px">
          <el-input v-model="form.principal" placeholder="请输入客户对接人" />
        </el-form-item>
        <el-form-item label="对接人电话" prop="principalPhone" label-width="90px">
          <el-input v-model="form.principalPhone" placeholder="请输入对接人联系方式" />
        </el-form-item>
        <el-form-item label="大成负责人" prop="inviterId" label-width="90px">
          <el-input v-model="form.inviterId" placeholder="请输入大成负责人" />
        </el-form-item>
        <el-form-item label="签单金额" prop="contractAmount" label-width="90px">
          <el-input v-model="form.contractAmount" placeholder="请输入签单金额" />
        </el-form-item>
        <el-form-item label="服务时长" prop="serviceHours" label-width="90px">
          <el-input v-model="form.serviceHours" placeholder="请输入服务时长" />
        </el-form-item>
        <el-form-item label="签约日期" prop="signDate" label-width="90px">
          <el-date-picker clearable v-model="form.signDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择签约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate" label-width="90px">
          <el-date-picker clearable v-model="form.expireDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="customerTypeLabel + '原因'" prop="reasons" label-width="90px">
          <el-input v-model="form.reasons" placeholder="请输入风险/退费原因" />
        </el-form-item>
        <el-form-item v-if="form.customerType == 2" label="退款金额" prop="refundAmount" label-width="90px">
          <el-input v-model="form.refundAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark1" label-width="90px">
          <el-input v-model="form.remark1" type="textarea" placeholder="请输入内容" />
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
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
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
  //form.value.customerType = form.value.customerType.split(",");
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
const lawyerList = ref([]);
const loadLawyerSupportList = async () => {
  try {
    // 调用接口：system/user/list?pageNum=1&pageSize=10&deptId=1969581806504747009
    const response = await listLawyerSupport();
    console.log('法务支持人员列表：', response);
    lawyerList.value = response.rows;
  } catch (error) {
    proxy?.$modal.msgError('加载法务支持人员失败，请稍后重试');
    console.error('法务人员列表加载异常：', error);
  }
};
/**
 * 法务支持选择变化处理
 */
const handleLegalSupportChange = (userId: string) => {
  if (userId) {

    form.value.lawyerId = userId;

  } else {
    // 清空选择时重置相关字段
    form.value.lawyerId = undefined;
  }
}

// 添加获取法务人员姓名的方法
const getLawyerNameById = (lawyerId: string | number) => {
  console.log('lawyerId:', lawyerId);
  if (!lawyerId) return '';
  const lawyer = lawyerList.value.find(item => item.userId === lawyerId);
  console.log('lawyer:', lawyer);
  return lawyer ? `${lawyer.nickName}` : '';
};
onMounted(() => {
  loadLawyerSupportList();
  getList();
});
</script>
