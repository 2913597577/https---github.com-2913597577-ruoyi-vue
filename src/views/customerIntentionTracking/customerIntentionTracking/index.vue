<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="意向客户" prop="inentionId">
              <el-input v-model="queryParams.inentionId" placeholder="请输入意向客户表id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="意向客户id" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入意向客户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="意向客户" prop="customerName">
              <el-input v-model="queryParams.customerName" placeholder="请输入意向客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker clearable
                v-model="queryParams.createTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerIntentionTrackingList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
        <el-table-column label="意向客户id" align="center" prop="customerId" />
        <el-table-column label="意向客户" align="center" prop="customerName" />
        <el-table-column label="备注" align="center" prop="customerRemark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改意向客户跟踪记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerIntentionTrackingFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="意向客户表id" prop="inentionId">
          <el-input v-model="form.inentionId" placeholder="请输入意向客户表id" />
        </el-form-item>
        <el-form-item label="意向客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入意向客户id" />
        </el-form-item>
        <el-form-item label="意向客户" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入意向客户" />
        </el-form-item>
        <el-form-item label="备注" prop="customerRemark">
            <el-input v-model="form.customerRemark" type="textarea" placeholder="请输入内容" />
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

<script setup name="CustomerIntentionTracking" lang="ts">
import { listCustomerIntentionTracking, getCustomerIntentionTracking, delCustomerIntentionTracking, addCustomerIntentionTracking, updateCustomerIntentionTracking } from '@/api/customerIntentionTracking/customerIntentionTracking';
import { CustomerIntentionTrackingVO, CustomerIntentionTrackingQuery, CustomerIntentionTrackingForm } from '@/api/customerIntentionTracking/customerIntentionTracking/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerIntentionTrackingList = ref<CustomerIntentionTrackingVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerIntentionTrackingFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerIntentionTrackingForm = {
  inentionId: undefined,
  customerId: undefined,
  customerName: undefined,
  customerRemark: undefined,
}
const data = reactive<PageData<CustomerIntentionTrackingForm, CustomerIntentionTrackingQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    inentionId: undefined,
    customerId: undefined,
    customerName: undefined,
    createTime: undefined,
    params: {
    }
  },
  rules: {
    inentionId: [
      { required: true, message: "意向客户表id不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "意向客户id不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "意向客户不能为空", trigger: "blur" }
    ],
    customerRemark: [
      { required: true, message: "备注不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询意向客户跟踪记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerIntentionTracking(queryParams.value);
  customerIntentionTrackingList.value = res.rows;
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
  customerIntentionTrackingFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerIntentionTrackingVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加意向客户跟踪记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerIntentionTrackingVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerIntentionTracking(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改意向客户跟踪记录";
}

/** 提交按钮 */
const submitForm = () => {
  customerIntentionTrackingFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerIntentionTracking(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerIntentionTracking(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerIntentionTrackingVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除意向客户跟踪记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerIntentionTracking(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerIntentionTracking/customerIntentionTracking/export', {
    ...queryParams.value
  }, `customerIntentionTracking_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
