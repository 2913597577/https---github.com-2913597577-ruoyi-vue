<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="法务支持" prop="legalSupportId" label-width="68px">
              <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable
                style="width: 100%;" @change="handleLegalSupportChange">
                <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
                  :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="意向客户" prop="intendedCustomer" label-width="68px">
              <el-input v-model="queryParams.intendedCustomer" placeholder="请输入意向客户" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="type" label-width="68px">
              <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
                <el-option v-for="dict in intention_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="介绍人" prop="introducer" label-width="68px">
              <el-input v-model="queryParams.introducer" placeholder="请输入介绍人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="跟进结果" prop="followUpResult" label-width="68px">
              <el-input v-model="queryParams.followUpResult" placeholder="请输入跟进结果" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="提报日期" prop="submissionDate" label-width="68px">
              <el-date-picker clearable v-model="queryParams.submissionDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择提报日期" />
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
              v-hasPermi="['customerIntention:customerIntention:add']">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerIntention:customerIntention:edit']">修改</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerIntention:customerIntention:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerIntention:customerIntention:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerIntentionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="意向客户跟踪记录" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <!-- 详情按钮：点击携带当前行id跳转 -->
            <el-button link type="primary" icon="View" size="default"
              @click="handleTrackingDetail(scope.row.id)" style="padding: 0 6px;">
              详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="提报日期" align="center" prop="submissionDate" width="160" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ parseTime(scope.row.submissionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法务支持" align="center" prop="legalSupport" width="120" show-overflow-tooltip />
        <el-table-column label="意向客户" align="center" prop="intendedCustomer" width="120" show-overflow-tooltip />
        <el-table-column label="类型" align="center" prop="type" width="130" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="intention_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="来源" align="center" prop="source" width="160" show-overflow-tooltip />
        <el-table-column label="预计金额" align="center" prop="expectedAmount" width="110" show-overflow-tooltip />
        <el-table-column label="介绍人" align="center" prop="introducer" width="120" show-overflow-tooltip />
        <el-table-column label="跟进结果" align="center" prop="followUpResult" width="110" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="cumtomer_status" :value="scope.row.followUpResult" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" show-overflow-tooltip
          width="180" fixed="right">
          <template #default="scope">
            <el-button link type="success" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['customerIntention:customerIntention:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['customerIntention:customerIntention:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户意向登记对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerIntentionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="来源" prop="source" label-width="90px">
          <el-input v-model="form.source" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="介绍人" prop="introducer" label-width="90px">
          <el-input v-model="form.introducer" placeholder="请输入介绍人" />
        </el-form-item>
        <el-form-item label="法务支持" prop="legalSupport" label-width="90px">
          <el-select filterable v-model="form.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向客户" prop="intendedCustomer" label-width="90px">
          <el-input v-model="form.intendedCustomer" placeholder="请输入意向客户" />
        </el-form-item>
        <el-form-item label="签约类型" prop="type" label-width="90px">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option v-for="dict in intention_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计金额" prop="expectedAmount" label-width="90px">
          <el-input v-model="form.expectedAmount" placeholder="请输入预计金额" />
        </el-form-item>
        <el-form-item label="跟进结果" prop="followUpResult" label-width="90px">
          <el-select v-model="form.followUpResult" placeholder="请选择跟进结果">
            <el-option v-for="dict in cumtomer_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提报日期" prop="submissionDate">
          <el-date-picker clearable v-model="form.submissionDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择提报日期">
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

<script setup name="CustomerIntention" lang="ts">
import { listCustomerIntention, getCustomerIntention, delCustomerIntention, addCustomerIntention, updateCustomerIntention } from '@/api/customerIntention/customerIntention';
import { CustomerIntentionVO, CustomerIntentionQuery, CustomerIntentionForm } from '@/api/customerIntention/customerIntention/types';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { intention_type } = toRefs<any>(proxy?.useDict('intention_type'));
const { cumtomer_status } = toRefs<any>(proxy?.useDict('cumtomer_status'));

const customerIntentionList = ref<CustomerIntentionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
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
    // 查找选中的律师信息
    const selectedLawyer = lawyerList.value.find(lawyer => lawyer.userId === userId);
    if (selectedLawyer) {
      // 设置法务支持名称到 legalSupport 字段
      form.value.legalSupport = selectedLawyer.userName;
    }
  } else {
    // 清空选择时重置相关字段
    form.value.legalSupport = undefined;
  }
}

const queryFormRef = ref<ElFormInstance>();
const customerIntentionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerIntentionForm = {
  submissionDate: undefined,
  legalSupport: undefined,
  legalSupportId: undefined,
  intendedCustomer: undefined,
  introducerId: undefined,
  type: undefined,
  source: undefined,
  expectedAmount: undefined,
  introducer: undefined,
  followUpResult: undefined,
}
const data = reactive<PageData<CustomerIntentionForm, CustomerIntentionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    submissionDate: undefined,
    legalSupport: undefined,
    legalSupportId: undefined,
    intendedCustomer: undefined,
    introducerId: undefined,
    type: undefined,
    source: undefined,
    introducer: undefined,
    followUpResult: undefined,
    params: {
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户意向登记列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerIntention(queryParams.value);
  customerIntentionList.value = res.rows;
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
  customerIntentionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerIntentionVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户意向登记";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerIntentionVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerIntention(_id);
  console.log('修改的客户意向登记：', res.data);
  Object.assign(form.value, res.data);

  dialog.visible = true;
  dialog.title = "修改客户意向登记";
}

/** 提交按钮 */
const submitForm = () => {
  customerIntentionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerIntention(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerIntention(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerIntentionVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户意向登记编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerIntention(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerIntention/customerIntention/export', {
    ...queryParams.value
  }, `customerIntention_${new Date().getTime()}.xlsx`)
}


const router = useRouter();
//  新增：跟踪记录详情跳转函数
const handleTrackingDetail = (id: number | string) => {
  // 跳转到目标路由，并通过query参数传递id
  router.push({
    path: '/customer/customerIntentionTracking',  // 目标路由路径（需与实际路由配置一致）
    query: { intentionCustomerId: id }  // 传递id参数（键名可自定义，如customerId）
  });
};

onMounted(() => {
  loadLawyerSupportList();
  getList();
});
</script>
