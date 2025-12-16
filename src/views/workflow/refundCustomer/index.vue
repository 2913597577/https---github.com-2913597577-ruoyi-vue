<!-- index.vue -->
<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="search">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="客户id" prop="customerId">
            <el-input v-model="queryParams.customerId" placeholder="请输入客户id" clearable />
          </el-form-item>
          <el-form-item label="客户姓名" prop="customerName">
            <el-input v-model="queryParams.customerName" placeholder="请输入客户姓名" clearable />
          </el-form-item>
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="queryParams.customerType" placeholder="请选择客户类型" clearable>
              <el-option label="风险" value="1" />
              <el-option label="退费" value="2" />
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
            <el-button v-hasPermi="['workflow:customer:risk:refund:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerRiskRefundList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="客户姓名" align="center" prop="customerName" />
        <el-table-column label="客户对接人" align="center" prop="principal" />
        <el-table-column label="对接人电话" align="center" prop="principalPhone" />
        <el-table-column label="原合同号" align="center" prop="contractNo" />
        <el-table-column label="大成负责人" align="center" prop="inviterId" />
        <el-table-column label="法务支持" align="center" prop="lawyerId" />
        <el-table-column label="签约日期" align="center" prop="signDate" />
        <el-table-column label="到期时间" align="center" prop="expireDate" />
        <el-table-column label="服务时长" align="center" prop="serviceHours" />
        <el-table-column label="合同金额" align="center" prop="contractAmount" />
        <el-table-column label="实收金额" align="center" prop="actualReceipt" />
        <el-table-column label="尾款金额" align="center" prop="balance" />
        <el-table-column label="退款金额" align="center" prop="refundAmount" />
       <!--  <el-table-column label="客户类型" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.customerType === 1">风险</el-tag>
            <el-tag v-else-if="scope.row.customerType === 2" type="warning">退费</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="退费原因" align="center" prop="reasons" />
        <el-table-column label="退款方式" align="center" prop="refundMethod" />
        <el-table-column label="退款日期" align="center" prop="refundDate" />
        <el-table-column label="退款凭证号" align="center" prop="refundVoucherNo" />
        <el-table-column label="退款方开户名" align="center" prop="refundAccountName" />
        <el-table-column label="退款方开户银行" align="center" prop="refundBank" />
        <el-table-column label="退款方银行账号" align="center" prop="bankNumber" />
        <el-table-column label="退款方式" align="center" prop="refundMethod" />
        <el-table-column label="我方付款账户" align="center" prop="remark1" />
        <el-table-column label="财务处理人" align="center" prop="financePayer" />
        <el-table-column label="记账凭证号" align="center" prop="accountingVoucherNo" />
        <el-table-column label="备注" align="center" prop="remark2" />

        <el-table-column align="center" label="流程状态" min-width="70">
          <template #default="scope">
            <dict-tag :options="wf_business_status" :value="scope.row.status"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'cancel' || scope.row.status === 'back'">
                <el-button v-hasPermi="['workflow:customer:risk:refund:edit']" size="small" link type="warning" icon="Edit" @click="handleUpdate(scope.row)"
                  >修改</el-button
                >
              </el-col>
              <el-col :span="1.5" v-if="scope.row.status === 'draft' || scope.row.status === 'cancel' || scope.row.status === 'back'">
                <el-button v-hasPermi="['workflow:customer:risk:refund:remove']" size="small" link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" link size="small" icon="View" @click="handleView(scope.row)">查看</el-button>
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

<script setup name="DcCustomerRiskRefund" lang="ts">
import { delDcCustomerRiskRefund, listDcCustomerRiskRefund } from '@/api/workflow/refundCustomer';
import { DcCustomerRiskRefundForm, DcCustomerRiskRefundQuery, DcCustomerRiskRefundVO } from '@/api/workflow/refundCustomer/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { wf_business_status } = toRefs<any>(proxy?.useDict('wf_business_status'));
const customerRiskRefundList = ref<DcCustomerRiskRefundVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const data = reactive<PageData<DcCustomerRiskRefundForm, DcCustomerRiskRefundQuery>>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerId: undefined,
    customerName: undefined,
    customerType: undefined
  },
  rules: {}
});

const { queryParams } = toRefs(data);

/** 查看屏幕右侧弹窗显示的审批物流信息 */
import ApprovalTransportRecord from '@/components/Process/approvalTransportRecord.vue';
const approvalTransportRecordRef = ref<InstanceType<typeof ApprovalTransportRecord>>();

const handleTransportRecord = (row?: DcCustomerRiskRefundVO) => {
  approvalTransportRecordRef.value?.init(row.id);
};

/** Query customer risk/refund list */
const getList = async () => {
  loading.value = true;
  const res = await listDcCustomerRiskRefund(queryParams.value);
  customerRiskRefundList.value = res.rows;
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
const handleSelectionChange = (selection: DcCustomerRiskRefundVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** Add button operation */
const handleAdd = () => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/refundCustomerEdit/index`,
    query: {
      type: 'add'
    }
  });
};

/** Update button operation */
const handleUpdate = (row?: DcCustomerRiskRefundVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/refundCustomerEdit/index`,
    query: {
      id: row.id,
      type: 'update'
    }
  });
};

/** View button operation */
const handleView = (row?: DcCustomerRiskRefundVO) => {
  proxy.$tab.closePage(proxy.$route);
  proxy.$router.push({
    path: `/workflow/refundCustomerEdit/index`,
    query: {
      id: row.id,
      type: 'view'
    }
  });
};

/** Delete button operation */
const handleDelete = async (row?: DcCustomerRiskRefundVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户风险/退费记录编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delDcCustomerRiskRefund(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** Export button operation */
const handleExport = () => {
  proxy?.download(
    'workflow/customer/risk/refund/export',
    {
      ...queryParams.value
    },
    `customer_risk_refund_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>