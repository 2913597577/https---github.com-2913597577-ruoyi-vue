<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="意向客户" prop="intentionId" label-width="68px">
              <el-select v-model="queryParams.intentionId" placeholder="请输入意向客户" filterable clearable>
                <el-option v-for="item in customerList" :key="item.intention_id" :label="item.intended_customer"
                  :value="item.intention_id">
                </el-option>
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
              v-hasPermi="['customerIntentionTracking:customerIntentionTracking:add']">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerIntentionTracking:customerIntentionTracking:edit']">修改</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerIntentionTracking:customerIntentionTracking:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerIntentionTracking:customerIntentionTracking:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerIntentionTrackingList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="意向客户" align="center" prop="customerName" show-overflow-tooltip />
        <el-table-column label="跟踪时间" align="center" prop="trackingDate">
        <template #default="scope">
            <span>{{ parseTime(scope.row.trackingDate, '{y}-{m}-{d}') }}</span>
        </template>
       </el-table-column>
       <el-table-column label="跟踪内容" align="center" prop="customerRemark" show-overflow-tooltip />
        <el-table-column label="下次跟踪时间" align="center" prop="nextTrackingDate">
        <template #default="scope">
            <span>{{ parseTime(scope.row.nextTrackingDate, '{y}-{m}-{d}') }}</span>
        </template>
       </el-table-column>
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip
          width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['customerIntentionTracking:customerIntentionTracking:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['customerIntentionTracking:customerIntentionTracking:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改意向客户跟踪记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerIntentionTrackingFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="意向客户" prop="intentionId">
          <el-select v-model="form.intentionId" placeholder="请输入意向客户" filterable clearable @change="handleChange">
            <el-option v-for="item in customerList" :key="item.intention_id" :label="item.intended_customer"
              :value="item.intention_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟踪内容" prop="customerRemark">
          <el-input v-model="form.customerRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="跟踪时间" prop="trackingDate">
         <el-date-picker clearable v-model="form.trackingDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择跟踪时间" required>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次跟踪时间" prop="nextTrackingDate">
         <el-date-picker clearable v-model="form.nextTrackingDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次跟踪时间">
          </el-date-picker>
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
import { getIntentionCustomerByUserId } from '@/api/common';
import { listCustomerIntentionTracking, getCustomerIntentionTracking, delCustomerIntentionTracking, addCustomerIntentionTracking, updateCustomerIntentionTracking } from '@/api/customerIntentionTracking/customerIntentionTracking';
import { CustomerIntentionTrackingVO, CustomerIntentionTrackingQuery, CustomerIntentionTrackingForm } from '@/api/customerIntentionTracking/customerIntentionTracking/types';
import { useRoute } from 'vue-router';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerIntentionTrackingList = ref<CustomerIntentionTrackingVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const route = useRoute();
const queryFormRef = ref<ElFormInstance>();
const customerIntentionTrackingFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerIntentionTrackingForm = {
  id: undefined,
  intentionId: undefined,
  customerName: undefined,
  customerRemark: undefined,
  trackingDate:undefined,
  nextTrackingDate: undefined,
}
const data = reactive<PageData<CustomerIntentionTrackingForm, CustomerIntentionTrackingQuery>>({
  form: { ...initFormData },
  queryParams: {
    id: undefined,
    pageNum: 1,
    pageSize: 10,
    intentionId: undefined,
    customerName: undefined,
    trackingDate:undefined,
    nextTrackingDate: undefined,
    params: {
    }
  },
  rules: {
    intentionId: [
      { required: true, message: "请选择意向客户", trigger: "change" }
    ],
    customerRemark: [
      { required: true, message: "请输入备注", trigger: "blur" }
    ],
    trackingDate: [
      { required: true, message: "请选择跟踪时间", trigger: "change" }
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
  form.value = { ...initFormData };
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

  console.log(row)
  const _id = row?.intentionId || ids.value[0]
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
        await updateCustomerIntentionTracking(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerIntentionTracking(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerIntentionTrackingVO) => {
  const customerName = row?.customerName;
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除跟踪记录 编号为:"' + _ids + '",客户名称为:"'+ customerName +'"的数据项？').finally(() => loading.value = false);
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

const customerList = ref<any[]>([]);
const loadIntentionCustomerList = async () => {
  try {
    const res = await getIntentionCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取意向客户列表失败:', error);
    proxy?.$modal.msgError('获取意向客户列表失败');
  }
}

const handleChange = (intentionId: string) => {
  console.log('Selected Intention ID:', intentionId);
  if (intentionId) {
    // 获取选中的意向客户信息
    const selectedCustomer = customerList.value.find(customer => customer.intention_id === intentionId);
    if (selectedCustomer) {
      // 设置意向客户ID到 intentionId 字段，customerName 用于显示
      form.value.intentionId = intentionId;
      form.value.customerName = selectedCustomer.intended_customer;
    }
  } else {
    // 清空选择时重置相关字段
    form.value.intentionId = undefined;
    form.value.customerName = undefined;
  }
}

// 监听 intentionCustomerId 的变化
watch(
  () => route.query.intentionCustomerId,
  (newIntentionCustomerId) => {
    if (newIntentionCustomerId) {
      // 2. 有CustomerId：查询该客户的单条跟踪记录，并渲染到表格
      try {
        queryParams.value.intentionId = newIntentionCustomerId;
        handleQuery();
      } catch (error) {
        console.error('获取客户跟踪记录失败:', error);
        proxy?.$modal.msgError('获取客户跟踪记录失败');
      }
    } else {
      // 如果 intentionCustomerId 为空，则加载所有数据
      getList();
    }
  },
  { immediate: true } // 立即执行一次
);

onMounted(async () => {

  await loadIntentionCustomerList();
  await getList();
});
</script>
