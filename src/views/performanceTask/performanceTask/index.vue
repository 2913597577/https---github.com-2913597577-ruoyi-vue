<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="法务支持" prop="legalSupportId">
              <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
              @keyup.enter="handleQuery">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
            </el-form-item>
            <el-form-item label="任务月份" prop="taskMonth">
              <el-date-picker
              v-model="queryParams.taskMonth"
              type="month"
               format="YYYY-MM" 
              value-format="YYYYMM"  
              placeholder="选择任务月份"
              clearable
              @keyup.enter="handleQuery"
            ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="月度业绩目标" prop="performanceGoal">
              <el-input v-model="queryParams.performanceGoal" placeholder="请输入月度业绩目标" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="月度出访目标" prop="visitGoal">
              <el-input v-model="queryParams.visitGoal" placeholder="请输入月度出访目标" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="已完成的月度业绩目标" prop="achievedPerformanceGoal">
              <el-input v-model="queryParams.achievedPerformanceGoal" placeholder="请输入已完成的月度业绩目标" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="已完成的月度出访目标" prop="achievedVisitGoal">
              <el-input v-model="queryParams.achievedVisitGoal" placeholder="请输入已完成的月度出访目标" clearable @keyup.enter="handleQuery" />
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
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['performanceTask:performanceTask:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['performanceTask:performanceTask:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['performanceTask:performanceTask:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['performanceTask:performanceTask:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="performanceTaskList" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="法务支持id" align="center" prop="legalSupportId" /> -->
        <el-table-column label="法务支持" align="center" prop="legalSupportName" />
        <el-table-column label="任务月份" align="center" prop="taskMonth" />
        <el-table-column label="业绩目标" align="center" prop="performanceGoal" />
        <el-table-column label="出访目标" align="center" prop="visitGoal" />
        <!-- <el-table-column label="已完成的月度业绩目标" align="center" prop="achievedPerformanceGoal" />
        <el-table-column label="已完成的月度出访目标" align="center" prop="achievedVisitGoal" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['performanceTask:performanceTask:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['performanceTask:performanceTask:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改业绩任务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable>
      <el-form ref="performanceTaskFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="法务支持" prop="legalSupportId">
           <el-select filterable v-model="form.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务月份" prop="taskMonth">
          <el-date-picker
              v-model="form.taskMonth"
              type="month"
               format="YYYY-MM" 
              value-format="YYYYMM"  
              placeholder="选择任务月份"
              clearable
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="月度业绩目标" prop="performanceGoal" label-width="100px">
          <el-input v-model="form.performanceGoal" placeholder="请输入月度业绩目标" />
        </el-form-item>
        <el-form-item label="月度出访目标" prop="visitGoal" label-width="100px">
          <el-input v-model="form.visitGoal" placeholder="请输入月度出访目标" />
        </el-form-item>
        <!-- <el-form-item label="已完成的月度业绩目标" prop="achievedPerformanceGoal">
          <el-input v-model="form.achievedPerformanceGoal" placeholder="请输入已完成的月度业绩目标" />
        </el-form-item>
        <el-form-item label="已完成的月度出访目标" prop="achievedVisitGoal">
          <el-input v-model="form.achievedVisitGoal" placeholder="请输入已完成的月度出访目标" />
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

<script setup name="PerformanceTask" lang="ts">
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { listPerformanceTask, getPerformanceTask, delPerformanceTask, addPerformanceTask, updatePerformanceTask } from '@/api/performanceTask/performanceTask';
import { PerformanceTaskVO, PerformanceTaskQuery, PerformanceTaskForm } from '@/api/performanceTask/performanceTask/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const performanceTaskList = ref<PerformanceTaskVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const performanceTaskFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PerformanceTaskForm = {
  id: undefined,
  legalSupportId: undefined,
  legalSupportName: undefined,
  taskMonth: undefined,
  performanceGoal: undefined,
  visitGoal: undefined,
  achievedPerformanceGoal: undefined,
  achievedVisitGoal: undefined,
}
const data = reactive<PageData<PerformanceTaskForm, PerformanceTaskQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    legalSupportId: undefined,
    legalSupportName: undefined,
    taskMonth: undefined,
    performanceGoal: undefined,
    visitGoal: undefined,
    achievedPerformanceGoal: undefined,
    achievedVisitGoal: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    legalSupportId: [
      { required: true, message: "法务支持id不能为空", trigger: "blur" }
    ],
    taskMonth: [
      { required: true, message: "任务月份不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
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
      console.log(selectedLawyer)
      form.value.legalSupportName = selectedLawyer.nickName;
    }
  } else {
    // 清空选择时重置相关字段
    form.value.legalSupportName = undefined;
  }
}
/** 查询业绩任务列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPerformanceTask(queryParams.value);
  performanceTaskList.value = res.rows;
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
  performanceTaskFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PerformanceTaskVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加业绩任务";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PerformanceTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getPerformanceTask(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改业绩任务";
}

/** 提交按钮 */
const submitForm = () => {
  performanceTaskFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePerformanceTask(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPerformanceTask(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PerformanceTaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除业绩任务编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delPerformanceTask(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('performanceTask/performanceTask/export', {
    ...queryParams.value
  }, `performanceTask_${new Date().getTime()}.xlsx`)
}

//列表最后一行添加合计
const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '合计';
      return;
  }

  // 处理需要合计的列，这里应该根据实际业务需求修改列名
    const values = data.map(item => Number(item[column.property]));
    if (column.label == "业绩目标") {
    if (!values.every(value => isNaN(value))) {
    sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
   if (!isNaN(value)) {
   return prev + curr;
    } else {
      return prev;
   }
  }, 0);
       
    sums[index] = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(sums[index]);
 } else {
        //  sums[index] = 'N/A';
}
  }
});
return sums;
}


onMounted(() => {
  loadLawyerSupportList()
  getList();
});
</script>

<style scoped>

::v-deep .el-table__footer-wrapper {
  font-weight: bold;
  font-size: 14px;
  
  .el-table__cell {
    background-color: #f5f7fa !important;
    font-size: 14px;
    color:#1890ff;

    &:first-child {
      color: #303133;
      font-weight: bold;
    }
  }
}

</style>
