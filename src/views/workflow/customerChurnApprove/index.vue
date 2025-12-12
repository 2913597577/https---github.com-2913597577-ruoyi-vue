<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="search">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <!-- <el-form-item label="审批类型" prop="applyType">
            <el-input v-model="queryParams.applyType" placeholder="请输入审批类型" clearable />
          </el-form-item> -->
          <el-form-item label="客户姓名" prop="customerName">
            <el-input v-model="queryParams.customerName" placeholder="请输入客户姓名" clearable />
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
          <!-- <el-col :span="1.5">
            <el-button v-hasPermi="['workflow:customerChurnApprove:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button v-hasPermi="['workflow:customerChurnApprove:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerChurnApproveList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="false" label="主键" align="center" prop="id" />
        <!-- <el-table-column label="审批类型" align="center" prop="applyType" /> -->
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="客户姓名" align="center" prop="customerName" />
        <el-table-column label="原因" align="center" prop="remark" />
        <el-table-column align="center" label="流程状态" min-width="70">
          <template #default="scope">
            <dict-tag :options="wf_business_status" :value="scope.row.status"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="162">
          <template #default="scope">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'cancel' || scope.row.status === 'back'">
                <el-button v-hasPermi="['workflow:customerChurnApprove:edit']" size="small" link type="warning" icon="Edit" @click="handleUpdate(scope.row)"
                  >修改</el-button
                >
              </el-col>
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'cancel' || scope.row.status === 'back'">
                <el-button v-hasPermi="['workflow:customerChurnApprove:remove']" size="small" link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" size="small" link icon="View" @click="handleView(scope.row)">查看</el-button>
              </el-col>
              <!-- <el-col :span="1.5" v-if="scope.row.status === 'waiting'">
                <el-button size="small" type="primary" icon="Notification" @click="handleCancelProcessApply(scope.row.id)">撤销</el-button>
              </el-col> -->
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

<script setup name="DcCustomerChurnApprove" lang="ts">
import { delDcCustomerChurnApprove, listDcCustomerChurnApprove } from '@/api/workflow/customerChurnApprove';
import { cancelProcessApply } from '@/api/workflow/instance';
import { DcCustomerChurnApproveForm, DcCustomerChurnApproveQuery, DcCustomerChurnApproveVO } from '@/api/workflow/customerChurnApprove/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { wf_business_status } = toRefs<any>(proxy?.useDict('wf_business_status'));
const customerChurnApproveList = ref<DcCustomerChurnApproveVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const data = reactive<PageData<DcCustomerChurnApproveForm, DcCustomerChurnApproveQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    applyType: undefined,
    customerName: undefined
  },
  rules: {}
});

const { queryParams } = toRefs(data);

 /** 查看屏幕右侧弹窗显示的审批物流信息 */
 import ApprovalTransportRecord from '@/components/Process/approvalTransportRecord.vue';
const approvalTransportRecordRef = ref<InstanceType<typeof ApprovalTransportRecord>>();

const handleTransportRecord = (row?: DcCustomerChurnApproveVO) => {
  approvalTransportRecordRef.value?.init(row.id);
};

/** Query customer churn approval list */
const getList = async () => {
  loading.value = true;
  const res = await listDcCustomerChurnApprove(queryParams.value);
  customerChurnApproveList.value = res.rows;
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
const handleSelectionChange = (selection: DcCustomerChurnApproveVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** Add button operation */
const handleAdd = () => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/customerChurnApproveEdit/index`,
    query: {
      type: 'add'
    }
  });
};

/** Update button operation */
const handleUpdate = (row?: DcCustomerChurnApproveVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/customerChurnApproveEdit/index`,
    query: {
      id: row.id,
      type: 'update'
    }
  });
};

/** View button operation */
const handleView = (row?: DcCustomerChurnApproveVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/customerChurnApproveEdit/index`,
    query: {
      id: row.id,
      type: 'view'
    }
  });
};

/** Delete button operation */
const handleDelete = async (row?: DcCustomerChurnApproveVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户流失审批编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delDcCustomerChurnApprove(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** Export button operation */
const handleExport = () => {
  proxy?.download(
    'workflow/customer/churn/approve/export',
    {
      ...queryParams.value
    },
    `customer_churn_approve_${new Date().getTime()}.xlsx`
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

onMounted(() => {
  getList();
});
</script>
