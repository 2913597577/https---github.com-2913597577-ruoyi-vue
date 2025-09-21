<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="签约日期" prop="signDate">
              <el-date-picker clearable
                v-model="queryParams.signDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择签约日期"
              />
            </el-form-item>
            <el-form-item label="编号" prop="contractNo">
              <el-input v-model="queryParams.contractNo" placeholder="请输入编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="负责人" prop="principal">
              <el-input v-model="queryParams.principal" placeholder="请输入负责人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="负责人电话" prop="principalPhone">
              <el-input v-model="queryParams.principalPhone" placeholder="请输入负责人电话" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="法务法务支持" prop="lawyerId">
              <el-input v-model="queryParams.lawyerId" placeholder="请输入法务法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="甩单人" prop="transferPerson">
              <el-input v-model="queryParams.transferPerson" placeholder="请输入甩单人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="杀单手" prop="closer">
              <el-input v-model="queryParams.closer" placeholder="请输入杀单手" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="实收金额" prop="actualReceipt">
              <el-input v-model="queryParams.actualReceipt" placeholder="请输入实收金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款金额" prop="balance">
              <el-input v-model="queryParams.balance" placeholder="请输入尾款金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="到期时间" prop="expireDate">
              <el-date-picker clearable
                v-model="queryParams.expireDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择到期时间"
              />
            </el-form-item>
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="queryParams.contractCode" placeholder="请输入合同编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="queryParams.remarks" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户id" prop="transferId">
              <el-input v-model="queryParams.transferId" placeholder="请输入客户id" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customerInfo:customerInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerInfo:customerInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customerInfo:customerInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customerInfo:customerInfo:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="签约日期" align="center" prop="signDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customerName" />
        <el-table-column label="负责人" align="center" prop="principal" />
        <el-table-column label="负责人电话" align="center" prop="principalPhone" />
        <el-table-column label="法务法务支持" align="center" prop="lawyerId" />
        <el-table-column label="甩单人" align="center" prop="transferPerson" />
        <el-table-column label="杀单手" align="center" prop="closer" />
        <!-- <el-table-column label="签约类型" align="center" prop="contractType" /> -->
        <el-table-column label="签约类型" align="center" prop="contractType">
          <template #default="scope">
            <dict-tag :options="contract_type" :value="scope.row.contractType"/>
          </template>
        </el-table-column>
        <el-table-column label="套餐类型" align="center" prop="packageType" />
        <el-table-column label="实收金额" align="center" prop="actualReceipt" />
        <el-table-column label="尾款金额" align="center" prop="balance" />
        <el-table-column label="到期时间" align="center" prop="expireDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" align="center" prop="contractCode" />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column label="续费/尾款动作(1-续费 2-付尾款 3-其他)" align="center" prop="actionType" />
        <el-table-column label="客户id" align="center" prop="transferId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customerInfo:customerInfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customerInfo:customerInfo:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户总表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable
            v-model="form.signDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择签约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="principal">
          <el-input v-model="form.principal" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="负责人电话" prop="principalPhone">
          <el-input v-model="form.principalPhone" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="法务法务支持" prop="lawyerId">
          <el-input v-model="form.lawyerId" placeholder="请输入法务法务支持" />
        </el-form-item>
        <el-form-item label="甩单人" prop="transferPerson">
          <el-input v-model="form.transferPerson" placeholder="请输入甩单人" />
        </el-form-item>
        <el-form-item label="杀单手" prop="closer">
          <el-input v-model="form.closer" placeholder="请输入杀单手" />
        </el-form-item>
        <el-form-item label="实收金额" prop="actualReceipt">
          <el-input v-model="form.actualReceipt" placeholder="请输入实收金额" />
        </el-form-item>
        <el-form-item label="尾款金额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入尾款金额" />
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker clearable
            v-model="form.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="form.contractCode" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="客户id" prop="transferId">
          <el-input v-model="form.transferId" placeholder="请输入客户id" />
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

<script setup name="CustomerInfo" lang="ts">
import { listCustomerInfo, getCustomerInfo, delCustomerInfo, addCustomerInfo, updateCustomerInfo } from '@/api/customerInfo/customerInfo';
import { CustomerInfoVO, CustomerInfoQuery, CustomerInfoForm } from '@/api/customerInfo/customerInfo/types';


const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { contract_type } = toRefs<any>(proxy?.useDict('contract_type'));

const customerInfoList = ref<CustomerInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerInfoForm = {
  id: undefined,
  signDate: undefined,
  contractNo: undefined,
  customerName: undefined,
  principal: undefined,
  principalPhone: undefined,
  lawyerId: undefined,
  transferPerson: undefined,
  closer: undefined,
  contractType: undefined,
  packageType: undefined,
  actualReceipt: undefined,
  balance: undefined,
  expireDate: undefined,
  contractCode: undefined,
  remarks: undefined,
  actionType: undefined,
  transferId: undefined,
}
const data = reactive<PageData<CustomerInfoForm, CustomerInfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    signDate: undefined,
    contractNo: undefined,
    customerName: undefined,
    principal: undefined,
    principalPhone: undefined,
    lawyerId: undefined,
    transferPerson: undefined,
    closer: undefined,
    contractType: undefined,
    packageType: undefined,
    actualReceipt: undefined,
    balance: undefined,
    expireDate: undefined,
    contractCode: undefined,
    remarks: undefined,
    actionType: undefined,
    transferId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    signDate: [
      { required: true, message: "签约日期不能为空", trigger: "blur" }
    ],
    contractNo: [
      { required: true, message: "编号不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    principal: [
      { required: true, message: "负责人不能为空", trigger: "blur" }
    ],
    contractType: [
      { required: true, message: "签约类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户总表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerInfo(queryParams.value);
  customerInfoList.value = res.rows;
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
  customerInfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerInfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户总表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改客户总表";
}

/** 提交按钮 */
const submitForm = () => {
  customerInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerInfo(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerInfo(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户总表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerInfo/customerInfo/export', {
    ...queryParams.value
  }, `customerInfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
