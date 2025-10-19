<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="案件" prop="caseId">
               <el-select v-model="queryParams.caseId" placeholder="请选择案件" filterable clearable>
                <el-option v-for="item in caseDetailList" :key="item.case_id" :label="item.case_detail"
                  :value="item.case_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案件类型" prop="caseType">
              <el-select v-model="queryParams.caseType" placeholder="请选择案件类型" clearable>
                <el-option v-for="dict in customer_case_type" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户id" prop="customerId">
              <el-input v-model="queryParams.customerId" placeholder="请输入客户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户姓名" prop="customerName">
              <el-input v-model="queryParams.customerName" placeholder="请输入客户姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="案件进展" prop="caseProgress">
              <el-input v-model="queryParams.caseProgress" placeholder="请输入案件进展" clearable @keyup.enter="handleQuery" />
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
              v-hasPermi="['caseProgress:caseProgress:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['caseProgress:caseProgress:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['caseProgress:caseProgress:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['caseProgress:caseProgress:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="caseProgressList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="案件" align="center" prop="caseId" />
        <el-table-column label="案件类型" align="center" prop="caseType">
          <template #default="scope">
            <dict-tag :options="customer_case_type" :value="scope.row.caseType" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="客户姓名" align="center" prop="customerName" />
        <el-table-column label="案件进展" align="center" prop="caseProgress" />
        <el-table-column label="跟进日期" align="center" prop="trackingTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.trackingTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下次跟进日期" align="center" prop="nextTrackingTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.nextTrackingTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['caseProgress:caseProgress:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['caseProgress:caseProgress:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改案件进展表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="caseProgressFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="案件" prop="caseId">
         <el-select v-model="form.caseId" placeholder="请选择案件" filterable clearable>
                <el-option v-for="item in caseDetailList" :key="item.case_id" :label="item.case_detail"
                  :value="item.case_id">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="案件类型" prop="caseType">
          <el-select v-model="form.caseType" placeholder="请选择案件类型">
            <el-option v-for="dict in customer_case_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
        </el-form-item> -->
        <el-form-item label="案件进展" prop="caseProgress">
          <el-input v-model="form.caseProgress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="跟进日期" prop="visitTime">
          <el-date-picker clearable v-model="form.trackingTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择出访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次跟进日期" prop="nextVisitTime">
          <el-date-picker clearable v-model="form.nextTrackingTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次出访时间">
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

<script setup name="CaseProgress" lang="ts">
import { listCaseProgress, getCaseProgress, delCaseProgress, addCaseProgress, updateCaseProgress } from '@/api/caseProgress/caseProgress';
import { CaseProgressVO, CaseProgressQuery, CaseProgressForm } from '@/api/caseProgress/caseProgress/types';
import { getCaseDetail } from '@/api/common';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { customer_case_type } = toRefs<any>(proxy?.useDict('customer_case_type'));

const caseProgressList = ref<CaseProgressVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const caseDetailList = ref<any[]>([]);

const loadcaseDetailList = async () => {
  try {
    const res = await getCaseDetail();
    caseDetailList.value = res.data;
  } catch (error) {
    console.error('获取案件列表失败:', error);
    proxy?.$modal.msgError('获取案件列表失败');
  }
}

const queryFormRef = ref<ElFormInstance>();
const caseProgressFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CaseProgressForm = {
  id: undefined,
  caseId: undefined,
  caseType: undefined,
  customerId: undefined,
  customerName: undefined,
  caseProgress: undefined,
}
const data = reactive<PageData<CaseProgressForm, CaseProgressQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    caseId: undefined,
    caseType: undefined,
    customerId: undefined,
    customerName: undefined,
    caseProgress: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    caseId: [
      { required: true, message: "案件id不能为空", trigger: "blur" }
    ],
    caseType: [
      { required: true, message: "案件类型不能为空", trigger: "change" }
    ],
    customerId: [
      { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户姓名不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询案件进展表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCaseProgress(queryParams.value);
  caseProgressList.value = res.rows;
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
  caseProgressFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CaseProgressVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加案件进展表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CaseProgressVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCaseProgress(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改案件进展表";
}

/** 提交按钮 */
const submitForm = () => {
  caseProgressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCaseProgress(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCaseProgress(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CaseProgressVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除案件进展表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCaseProgress(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('caseProgress/caseProgress/export', {
    ...queryParams.value
  }, `caseProgress_${new Date().getTime()}.xlsx`)
}
const route = useRoute();
// 监听 intentionCustomerId 的变化
watch(
  () => route.query.CustomerId,
  (newCustomerId) => {
    if (newCustomerId) {
      // 2. 有CustomerId：查询该客户的单条跟踪记录，并渲染到表格
      try {
        queryParams.value.customerId = newCustomerId;
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
onMounted(() => {
  loadcaseDetailList();
  getList();
});
</script>
