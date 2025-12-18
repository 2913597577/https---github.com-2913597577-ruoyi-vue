<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="search">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="报销人姓名" prop="applicantName">
            <el-input v-model="queryParams.applicantName" placeholder="请输入报销人姓名" clearable />
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentName">
            <el-input v-model="queryParams.departmentName" placeholder="请输入所属部门" clearable />
          </el-form-item>
          <el-form-item label="费用类型" prop="expenseType">
            <el-select v-model="queryParams.expenseType" placeholder="请选择费用类型" clearable>
              <el-option label="差旅费" value="travel" />
              <el-option label="招待费" value="entertainment" />
              <el-option label="办公费" value="office" />
              <el-option label="交通费" value="transportation" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
              <el-option label="草稿" value="draft" />
              <el-option label="审核中" value="pending" />
              <el-option label="已完成" value="completed" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="expenseReimbursementList" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="填报日期" align="center" prop="applyDate" width="120">
        <template #default="scope">
            <span>{{ parseTime(scope.row.applyDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报销人姓名" align="center" prop="applicantName" />
        <el-table-column label="所属部门" align="center" prop="departmentName" />
        <el-table-column label="岗位/职务" align="center" prop="position" />
        <el-table-column label="报销事由" align="center" prop="expenseReason" />
        <el-table-column label="费用类型" align="center" prop="expenseType">
          <template #default="scope">
            <dict-tag :options="dc_reimbursement_type" :value="scope.row.expenseType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="费用日期" align="center" prop="expenseDate" width="120">
        <template #default="scope">
            <span>{{ parseTime(scope.row.expenseDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费用明细描述" align="center" prop="expenseDescription" />
        <el-table-column label="发票总张数" align="center" prop="invoiceCount" />
        <el-table-column label="发票总金额" align="center" prop="invoiceAmount" width="120" />
        <el-table-column label="报销金额" align="center" prop="reimbursementAmount" width="120"/>
        <el-table-column label="已预支金额" align="center" prop="advancedAmount" width="120"/>
        <el-table-column label="应退/应补金额" align="center" prop="refundOrSupplement" width="120"/>
        <el-table-column label="差额说明" align="center" prop="deferredReason" />
        <el-table-column label="发票附件" align="center" prop="attachmentPath" />
        <el-table-column label="支付日期" align="center" prop="paymentDate">
        <template #default="scope">
            <span>{{ parseTime(scope.row.paymentDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" align="center" prop="paymentMethod"> 
          <template #default="scope">
            <dict-tag :options="dc_reimbursement_payment" :value="scope.row.expenseType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付人" align="center" prop="financePayerName" />
        <el-table-column label="收款账户姓名" align="center" prop="receiverName" />
        <el-table-column label="收款银行名称" align="center" prop="receiverBankName" />
        <el-table-column label="收款银行账号" align="center" prop="receiverBankAccount" />
        <el-table-column label="财务记账凭证号" align="center" prop="financeVoucherNo" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="wf_business_status" :value="scope.row.status"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'reject'">
                <el-button size="small" link type="warning" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              </el-col>
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'reject'">
                <el-button size="small" link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" link size="small" icon="View" @click="handleView(scope.row)">查看</el-button>
              </el-col>
              <el-col :span="1.5" v-if="scope.row.status === 'pending'">
                <el-button size="small" type="primary" icon="Notification" @click="handleCancelProcessApply(scope.row.id)">撤销</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="success" link size="small" icon="View" @click="handleTransportRecord(scope.row)">物流信息</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

     <!-- 屏幕右侧弹窗显示物流信息组件加载 -->
     <ApprovalTransportRecord ref="approvalTransportRecordRef" />

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="DcExpenseReimbursement" lang="ts">
import { delDcExpenseReimbursement, listDcExpenseReimbursement } from '@/api/workflow/expenseReimbursement';
import { cancelProcessApply } from '@/api/workflow/instance';
import { DcExpenseReimbursementForm, DcExpenseReimbursementQuery, DcExpenseReimbursementVO } from '@/api/workflow/expenseReimbursement/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { dc_reimbursement_type } = toRefs<any>(proxy?.useDict('dc_reimbursement_type'));
const { dc_reimbursement_payment } = toRefs<any>(proxy?.useDict('dc_reimbursement_payment'));
const { wf_business_status } = toRefs<any>(proxy?.useDict('wf_business_status'));
const expenseReimbursementList = ref<DcExpenseReimbursementVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const data = reactive<PageData<DcExpenseReimbursementForm, DcExpenseReimbursementQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    applicantName: undefined,
    departmentName: undefined,
    expenseType: undefined,
    status: undefined
  },
  rules: {}
});

const { queryParams } = toRefs(data);

/** 查看屏幕右侧弹窗显示的审批物流信息 */
import ApprovalTransportRecord from '@/components/Process/approvalTransportRecord.vue';
const approvalTransportRecordRef = ref<InstanceType<typeof ApprovalTransportRecord>>();

const handleTransportRecord = (row?: DcExpenseReimbursementVO) => {
  approvalTransportRecordRef.value?.init(row.id);
};

/** Query expense reimbursement list */
const getList = async () => {
  loading.value = true;
  const res = await listDcExpenseReimbursement(queryParams.value);
  expenseReimbursementList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** Search button operation */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** Reset button operation */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** Multi-selection checkbox */
const handleSelectionChange = (selection: DcExpenseReimbursementVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** Add button operation */
const handleAdd = () => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/expenseReimbursementEdit/index`,
    query: {
      type: 'add'
    }
  });
};

/** Update button operation */
const handleUpdate = (row?: DcExpenseReimbursementVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/expenseReimbursementEdit/index`,
    query: {
      id: row.id,
      type: 'update'
    }
  });
};

/** View button operation */
const handleView = (row?: DcExpenseReimbursementVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/expenseReimbursementEdit/index`,
    query: {
      id: row.id,
      type: 'view'
    }
  });
};

/** Delete button operation */
const handleDelete = async (row?: DcExpenseReimbursementVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除报销申请编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delDcExpenseReimbursement(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** Export button operation */
const handleExport = () => {
  proxy?.download(
    'workflow/expense/reimbursement/export',
    {
      ...queryParams.value
    },
    `expense_reimbursement_${new Date().getTime()}.xlsx`
  );
};

/** Cancel process application */
const handleCancelProcessApply = async (id: string) => {
  await proxy?.$modal.confirm('是否确认撤销当前单据？');
  loading.value = true;
  const data = {
    businessId: id,
    message: '申请人撤销流程！'
  };
  await cancelProcessApply(data).finally(() => (loading.value = false));
  await getList();
  proxy?.$modal.msgSuccess('撤销成功');
};

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
    if (column.label == "发票总金额" || column.label == "报销金额" || column.label == "已预支金额" || column.label == "应退/应补金额") {
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