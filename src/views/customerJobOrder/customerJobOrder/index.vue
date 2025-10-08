<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="法务支持" prop="legalSupport">
              <el-input v-model="queryParams.legalSupport" placeholder="请输入法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="法务支持id" prop="legalSupportId">
              <el-input v-model="queryParams.legalSupportId" placeholder="请输入法务支持id" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
        
            <el-form-item label="交付时间" prop="deliveryTime">
              <el-date-picker clearable v-model="queryParams.deliveryTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择交付时间" />
            </el-form-item>
            <el-form-item label="跟踪记录" prop="trackingId">
              <el-input v-model="queryParams.trackingId" placeholder="请输入跟踪记录id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="处理人id" prop="contractHandler">
              <el-input v-model="queryParams.contractHandler" placeholder="请输入处理人id" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="处理人" prop="contractHandlerName">
              <el-input v-model="queryParams.contractHandlerName" placeholder="请输入处理人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="处理状态" prop="processingStatus">
              <el-select v-model="queryParams.processingStatus" placeholder="请选择工单处理状态" clearable>
                <el-option v-for="dict in processing_status" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
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
              v-hasPermi="['customerJobOrder:customerJobOrder:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerJobOrder:customerJobOrder:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerJobOrder:customerJobOrder:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerJobOrder:customerJobOrder:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerJobOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="法务支持" align="center" prop="legalSupport" />
        <el-table-column label="法务支持id" align="center" prop="legalSupportId" />
        <el-table-column label="源合同地址" align="center" prop="preContractAddress" />
        <el-table-column label="源合同文件名" align="center" prop="preContractName" />
        <el-table-column label="新合同地址" align="center" prop="newContractAddress" />
        <el-table-column label="新合同文件名" align="center" prop="newContractName" />
        <el-table-column label="客户要求" align="center" prop="customerRequirements" />
        <el-table-column label="交付时间" align="center" prop="deliveryTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟踪记录id" align="center" prop="trackingId" />
        <el-table-column label="处理人id" align="center" prop="contractHandler" />
        <el-table-column label="处理人" align="center" prop="contractHandlerName" />
        <el-table-column label="工单处理状态" align="center" prop="processingStatus">
          <template #default="scope">
            <dict-tag :options="processing_status" :value="scope.row.processingStatus" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注1" align="center" prop="remark1" />
        <el-table-column label="备注2" align="center" prop="remark2" />
        <el-table-column label="备注3" align="center" prop="remark3" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240px">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:edit']">修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:remove']">删除</el-button>
            </el-tooltip>
            <el-tooltip content="处理" placement="top">
              <el-button link type="primary" icon="Download" @click="handleProcess(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:process']">处理</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改工单管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerJobOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="法务支持" prop="legalSupport">
          <el-input v-model="form.legalSupport" placeholder="请输入法务支持" />
        </el-form-item>
        <el-form-item label="法务支持id" prop="legalSupportId">
          <el-input v-model="form.legalSupportId" placeholder="请输入法务支持id" />
        </el-form-item>
        <el-form-item label="源合同地址" prop="preContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="preFile" />
        </el-form-item>
        <el-form-item label="源合同文件名" prop="preContractName">
          <el-input v-model="form.preContractName" placeholder="请输入源合同文件名" />
        </el-form-item>
        <el-form-item label="新合同地址" prop="newContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="newFile" />
        </el-form-item>
        <el-form-item label="新合同文件名" prop="newContractName">
          <el-input v-model="form.newContractName" placeholder="请输入新合同文件名" />
        </el-form-item>
        <el-form-item label="客户要求" prop="customerRequirements">
          <el-input v-model="form.customerRequirements" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="交付时间" prop="deliveryTime">
          <el-date-picker clearable v-model="form.deliveryTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择交付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跟踪记录id" prop="trackingId">
          <el-input v-model="form.trackingId" placeholder="请输入跟踪记录id" />
        </el-form-item>
        <el-form-item label="处理人id" prop="contractHandler">
          <el-input v-model="form.contractHandler" placeholder="请输入处理人id" />
        </el-form-item>
        <el-form-item label="处理人" prop="contractHandlerName">
          <el-input v-model="form.contractHandlerName" placeholder="请输入处理人" />
        </el-form-item>
        <el-form-item label="工单处理状态" prop="processingStatus">
          <el-select v-model="form.processingStatus" placeholder="请选择工单处理状态">
            <el-option v-for="dict in processing_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="备注1" prop="remark1">
          <el-input v-model="form.remark1" placeholder="请输入备注1" />
        </el-form-item>
        <el-form-item label="备注2" prop="remark2">
          <el-input v-model="form.remark2" placeholder="请输入备注2" />
        </el-form-item>
        <el-form-item label="备注3" prop="remark3">
          <el-input v-model="form.remark3" placeholder="请输入备注3" />
        </el-form-item> -->
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

<script setup name="CustomerJobOrder" lang="ts">
import { listCustomerJobOrder, getCustomerJobOrder, delCustomerJobOrder, addCustomerJobOrder, updateCustomerJobOrder } from '@/api/customerJobOrder/customerJobOrder';
import { CustomerJobOrderVO, CustomerJobOrderQuery, CustomerJobOrderForm } from '@/api/customerJobOrder/customerJobOrder/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { processing_status } = toRefs<any>(proxy?.useDict('processing_status'));

const customerJobOrderList = ref<CustomerJobOrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const preFile = ref();
const newFile = ref();

const queryFormRef = ref<ElFormInstance>();
const customerJobOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerJobOrderForm = {
  id: undefined,
  legalSupport: undefined,
  legalSupportId: undefined,
  preContractAddress: undefined,
  preContractName: undefined,
  newContractAddress: undefined,
  newContractName: undefined,
  customerRequirements: undefined,
  deliveryTime: undefined,
  trackingId: undefined,
  contractHandler: undefined,
  contractHandlerName: undefined,
  processingStatus: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
}
const data = reactive<PageData<CustomerJobOrderForm, CustomerJobOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    legalSupport: undefined,
    legalSupportId: undefined,
    preContractAddress: undefined,
    preContractName: undefined,
    newContractAddress: undefined,
    newContractName: undefined,
    customerRequirements: undefined,
    deliveryTime: undefined,
    trackingId: undefined,
    contractHandler: undefined,
    contractHandlerName: undefined,
    processingStatus: undefined,
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
    deliveryTime: [
      { required: true, message: "交付时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerJobOrder(queryParams.value);
  customerJobOrderList.value = res.rows;
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
  customerJobOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerJobOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工单管理";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerJobOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerJobOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工单管理";
}

/** 提交按钮 */
const submitForm = () => {
  customerJobOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      console.log(preFile.value);
      if (preFile.value) {
        console.log("存在文件");
        form.value.preContractAddress = preFile.value[0].ossId;
        form.value.preContractName = preFile.value[0].name;
      }
      if (form.value.id) {
        await updateCustomerJobOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerJobOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerJobOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除工单管理编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerJobOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerJobOrder/customerJobOrder/export', {
    ...queryParams.value
  }, `customerJobOrder_${new Date().getTime()}.xlsx`)
}
const handleProcess = (row: CustomerJobOrderVO) => {
  proxy?.$download.oss(row.preContractAddress);
}
onMounted(() => {
  getList();
});
</script>
