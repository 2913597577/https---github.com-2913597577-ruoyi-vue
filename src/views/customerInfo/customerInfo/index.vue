<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="签约日期" prop="signDate">
              <el-date-picker clearable v-model="queryParams.signDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择签约日期" />
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
              <el-input v-model="queryParams.principalPhone" placeholder="请输入负责人电话" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="法务法务支持" prop="lawyerId">
              <el-input v-model="queryParams.lawyerId" placeholder="请输入法务法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="甩单人" prop="transferPerson">
              <el-input v-model="queryParams.transferPerson" placeholder="请输入甩单人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="杀单手" prop="closer">
              <el-input v-model="queryParams.closer" placeholder="请输入杀单手" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="实收金额" prop="actualReceipt">
              <el-input v-model="queryParams.actualReceipt" placeholder="请输入实收金额" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款金额" prop="balance">
              <el-input v-model="queryParams.balance" placeholder="请输入尾款金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="到期时间" prop="expireDate">
              <el-date-picker clearable v-model="queryParams.expireDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择到期时间" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['customerInfo:customerInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerInfo:customerInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerInfo:customerInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerInfo:customerInfo:export']">导出</el-button>
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
            <dict-tag :options="contract_type" :value="scope.row.contractType" />
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
        <el-table-column label="是否转为风险客户" align="center" prop="isRisk">
          <template #default="scope">
            <!-- 处理布尔值、数字0/1或字符串"0"/"1"的情况 -->
            <span>{{ scope.row.isRisk ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否转为退费客户" align="center" prop="isRefund">
          <template #default="scope">
            <span>{{ scope.row.isRefund ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否转为意向客户" align="center" prop="isIntention">
          <template #default="scope">
            <span>{{ scope.row.isIntention ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="operation-column" width="220">
          <template #default="scope">
            <div style="display: flex; gap: 8px; justify-content: center;">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" size="default" @click="handleUpdate(scope.row)"
                  v-hasPermi="['customerInfo:customerInfo:edit']" style="padding: 0 6px;"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" size="default" @click="handleDelete(scope.row)"
                  v-hasPermi="['customerInfo:customerInfo:remove']" style="padding: 0 6px;"></el-button>
              </el-tooltip>
              <el-tooltip content="流转" placement="top">
                <el-button link type="primary" icon="RefreshRight" size="default" @click="handleTransfer(scope.row)"
                  v-hasPermi="['customerInfo:customerInfo:transfer']" style="padding: 0 6px;"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改客户总表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable v-model="form.signDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
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
          <el-date-picker clearable v-model="form.expireDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
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
    <!-- 客户流转操作对话框 -->
    <el-dialog title="客户流转" v-model="transferDialog.visible" width="450px" append-to-body
      :before-close="handleTransferClose">
      <el-form ref="transferFormRef" :model="transferForm" label-width="100px" class="mt-2">
        <!-- 流转类型单选框 -->
        <el-form-item label="流转类型" prop="transferType"
          :rules="[{ required: true, message: '请选择流转类型', trigger: 'change' }]">
          <el-radio-group v-model="transferForm.transferType">
            <el-radio label="1" class="mb-2">1 转为风险客户</el-radio>
            <el-radio label="2" class="mb-2">2 转为退费客户</el-radio>
            <el-radio label="3">3 转为意向客户</el-radio>
          </el-radio-group>
        </el-form-item>


      </el-form>
      <!-- 弹窗底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleTransferClose">取消</el-button>
          <el-button type="primary" :loading="transferLoading" @click="handleTransferConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!--转为风险或退费客户操作对话框 -->
    <el-dialog :title="riskRefundDialog.title" v-model="riskRefundDialog.visible" width="500px" append-to-body>
      <el-form ref="customerRiskRefundFormRef" :model="CRRform" :rules="CRRrules" label-width="120px">
        <el-form-item label="法务支持" prop="lawyerId">
          <el-input v-model="CRRform.lawyerId" placeholder="请输入法务支持" />
        </el-form-item>
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="CRRform.customerId" placeholder="请输入客户id" readonly />
          <!-- 客户ID从原客户数据获取，设为只读避免手动输入错误 -->
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="CRRform.customerName" placeholder="请输入客户名称" readonly />
          <!-- 客户名称同理，只读 -->
        </el-form-item>
        <el-form-item label="客户对接人" prop="principal">
          <el-input v-model="CRRform.principal" placeholder="请输入客户对接人" />
        </el-form-item>
        <el-form-item label="客户对接人联系方式" prop="principalPhone">
          <el-input v-model="CRRform.principalPhone" placeholder="请输入客户对接人联系方式" />
        </el-form-item>
        <el-form-item label="大成负责人id" prop="inviterId">
          <el-input v-model="CRRform.inviterId" placeholder="请输入大成负责人id" />
        </el-form-item>
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable v-model="CRRform.signDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择签约日期" />
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker clearable v-model="CRRform.expireDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间" />
        </el-form-item>
        <el-form-item label="签单金额" prop="contractAmount">
          <el-input v-model="CRRform.contractAmount" placeholder="请输入签单金额" />
        </el-form-item>
        <el-form-item label="服务时长" prop="serviceHours">
          <el-input v-model="CRRform.serviceHours" placeholder="请输入服务时长（如：12个月）" />
        </el-form-item>
        <!-- 动态标签：根据流转类型显示「风险原因」或「退费原因」 -->
        <el-form-item :label="CRRform.customerType === 1 ? '风险原因' : '退费原因'" prop="reasons">
          <!-- 占位符同理，直接判断类型 -->
          <el-input v-model="CRRform.reasons" :placeholder="CRRform.customerType === 1 ? '请输入风险原因' : '请输入退费原因'" />
        </el-form-item>
        <!-- 退费专属字段：只有选择「退费客户」时显示 -->
        <el-form-item label="退款金额" prop="refundAmount" v-if="CRRform.customerType === 2">
          <el-input v-model="CRRform.refundAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="备注1" prop="remark1">
          <el-input v-model="CRRform.remark1" type="textarea" placeholder="请输入备注（非必填）" />
        </el-form-item>
        <el-form-item label="备注2" prop="remark2">
          <el-input v-model="CRRform.remark2" type="textarea" placeholder="请输入备注（非必填）" />
        </el-form-item>
        <el-form-item label="备注3" prop="remark3">
          <el-input v-model="CRRform.remark3" type="textarea" placeholder="请输入备注（非必填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="riskRefundDialog.visible = false">取消</el-button>
          <el-button type="primary" :loading="riskRefundLoading" @click="submitRiskRefundForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CustomerInfo" lang="ts">
import { listCustomerInfo, getCustomerInfo, delCustomerInfo, addCustomerInfo, updateCustomerInfo } from '@/api/customerInfo/customerInfo';
import { CustomerInfoVO, CustomerInfoQuery, CustomerInfoForm } from '@/api/customerInfo/customerInfo/types';
import { CustomerRiskRefundQuery, CustomerRiskRefundForm } from '@/api/customerRiskRefund/customerRiskRefund/types';
import { addCustomerRiskRefund } from '@/api/customerRiskRefund/customerRiskRefund';
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
  form: { ...initFormData },
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
  console.log(customerInfoList.value)
  total.value = res.total;
  loading.value = false;
}



const customerRiskRefundFormRef = ref<ElFormInstance>();
const CustomerRiskRefundFormInitFormData: CustomerRiskRefundForm = {
  id: undefined,
  lawyerId: undefined,
  customerId: undefined,
  customerName: undefined,
  principal: undefined,
  principalPhone: undefined,
  inviterId: undefined,
  signDate: undefined,
  expireDate: undefined,
  contractAmount: undefined,
  serviceHours: undefined,
  customerType: undefined, // 1-风险客户 2-退费客户（关键字段，标记当前类型）
  reasons: undefined,
  refundAmount: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
}
const CustomerRiskRefundFormdata = reactive<PageData<CustomerRiskRefundForm, CustomerRiskRefundQuery>>({
  form: { ...CustomerRiskRefundFormInitFormData }, // 原代码错用了initFormData，改为风险/退费的初始数据
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    lawyerId: undefined,
    customerId: undefined,
    customerName: undefined,
    principal: undefined,
    principalPhone: undefined,
    inviterId: undefined,
    signDate: undefined,
    expireDate: undefined,
    contractAmount: undefined,
    serviceHours: undefined,
    customerType: undefined,
    reasons: undefined,
    refundAmount: undefined,
    remark1: undefined,
    remark2: undefined,
    remark3: undefined,
    params: {}
  },
  rules: {
    // 风险/退费表单的验证规则（根据实际需求调整）
    lawyerId: [
      { required: true, message: "法务支持不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    principal: [
      { required: true, message: "客户对接人不能为空", trigger: "blur" }
    ],
    principalPhone: [
      { required: true, message: "客户对接人联系方式不能为空", trigger: "blur" },
      { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
    ],
    signDate: [
      { required: true, message: "签约日期不能为空", trigger: "blur" }
    ],
    reasons: [
      { required: true, message: "原因不能为空", trigger: "blur" }
    ],
    refundAmount: [
      { required: true, message: "退款金额不能为空", trigger: "blur" },
      { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正确的金额格式（最多2位小数）", trigger: "blur" }
    ]
  }
});

// 解构风险/退费表单数据（避免和原客户表单冲突）
const {
  queryParams: CRRqueryParams,
  form: CRRform,
  rules: CRRrules
} = toRefs(CustomerRiskRefundFormdata);

// ---------------------- 2. 风险/退费弹窗相关数据 ----------------------
// 独立的弹窗变量（避免和原客户弹窗的dialog冲突）
const riskRefundDialog = reactive<DialogOption>({
  visible: false,
  title: '' // 动态标题："转为风险客户" 或 "转为退费客户"
});
// 风险/退费弹窗加载状态
const riskRefundLoading = ref(false);
// 动态标签（根据customerType计算：1→"风险原因"，2→"退费原因"）
// const customerTypeLabel = computed(() => {
//   // 增加默认值，避免初始为undefined时显示异常
//   return CRRform.value.customerType === 1 ? '风险原因' : '退费原因';
// });

// ---------------------- 3. 完善流转确认逻辑 ----------------------
const handleTransferConfirm = async () => {
  // 1. 表单验证（确保选择了流转类型）
  const valid = await transferFormRef.value?.validate();
  if (!valid) return;

  // 2. 校验当前客户数据是否存在
  if (!transferDialog.currentRow?.id) {
    proxy?.$modal.msgError('获取客户数据失败，请刷新页面后重试');
    return;
  }

  try {
    transferLoading.value = true;
    const currentCustomer = transferDialog.currentRow;

    // 3. 根据流转类型分支处理
    switch (transferForm.transferType) {
      //  case 1：选择「风险客户」→ 打开风险/退费弹窗并设置类型为1
      case '1':
        resetRiskRefundForm(); // 重置表单
        CRRform.value.customerType = 1; // 标记为风险客户
        // 自动填充客户基础信息（从原客户数据获取，减少手动输入）
        CRRform.value.customerId = currentCustomer.transferId;
        CRRform.value.customerName = currentCustomer.customerName;
        CRRform.value.principal = currentCustomer.principal;
        CRRform.value.principalPhone = currentCustomer.principalPhone;
        CRRform.value.signDate = currentCustomer.signDate;
        CRRform.value.expireDate = currentCustomer.expireDate;
        // 设置弹窗标题
        riskRefundDialog.title = '转为风险客户';
        // 关闭流转弹窗，打开风险/退费弹窗
        transferDialog.visible = false;
        riskRefundDialog.visible = true;
        break;

      //  case 2：选择「退费客户」→ 打开风险/退费弹窗并设置类型为2
      case '2':
        resetRiskRefundForm(); // 重置表单
        CRRform.value.customerType = 2; // 标记为退费客户
        // 自动填充客户基础信息
        CRRform.value.customerId = currentCustomer.transferId;
        CRRform.value.customerName = currentCustomer.customerName;
        CRRform.value.principal = currentCustomer.principal;
        CRRform.value.principalPhone = currentCustomer.principalPhone;
        CRRform.value.signDate = currentCustomer.signDate;
        CRRform.value.expireDate = currentCustomer.expireDate;
        // 设置弹窗标题
        riskRefundDialog.title = '转为退费客户';
        // 关闭流转弹窗，打开风险/退费弹窗
        transferDialog.visible = false;
        riskRefundDialog.visible = true;
        break;

      //  case 3：选择「意向客户」→ 暂不处理，提示功能未开发
      case '3':
        transferDialog.visible = false;
        proxy?.$modal.msgInfo('意向客户流转功能暂未开发，敬请期待');
        break;
    }
  } catch (error) {
    proxy?.$modal.msgError('流转操作异常，请稍后重试');
    console.error('流转异常：', error);
  } finally {
    transferLoading.value = false;
  }
};

// ---------------------- 4. 风险/退费表单重置（避免数据残留） ----------------------
const resetRiskRefundForm = () => {
  CRRform.value = { ...CustomerRiskRefundFormInitFormData };
  customerRiskRefundFormRef.value?.resetFields();
};

// ---------------------- 5. 风险/退费表单提交（对接add接口） ----------------------
const submitRiskRefundForm = async () => {
  // 1. 表单验证
  const valid = await customerRiskRefundFormRef.value?.validate();
  if (!valid) return;

  try {
    riskRefundLoading.value = true;

    // 2. 调用add接口新增风险/退费客户数据
    await addCustomerRiskRefund(CRRform.value);

    // 3. 操作成功反馈
    proxy?.$modal.msgSuccess(`${riskRefundDialog.title}操作成功`);
    // 4. 关闭弹窗并重置表单
    riskRefundDialog.visible = false;
    resetRiskRefundForm();
    // 5. 刷新原客户列表（可选，根据需求决定是否刷新）
    await getList();
  } catch (error) {
    // 6. 操作失败反馈
    proxy?.$modal.msgError(`${riskRefundDialog.title}操作失败，请稍后重试`);
    console.error('风险/退费新增失败：', error);
  } finally {
    riskRefundLoading.value = false;
  }
};


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
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
        await updateCustomerInfo(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerInfo(form.value).finally(() => buttonLoading.value = false);
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
// 流转弹窗状态
const transferDialog = reactive({
  visible: false, // 弹窗显示/隐藏
  currentRow: null as CustomerInfoVO | null // 当前操作的客户数据
});

// 流转表单数据
const transferForm = reactive({
  transferType: '', // 流转类型（1-风险客户 2-退费客户 3-意向客户）
  remark: '' // 流转备注
});

// 流转表单引用（用于验证）
const transferFormRef = ref<ElFormInstance>();
// 流转按钮加载状态
const transferLoading = ref(false);

/** 打开流转弹窗（点击表格「流转」按钮触发） */
const handleTransfer = (row: CustomerInfoVO) => {
  // 记录当前操作的客户数据（用于后续传ID）
  transferDialog.currentRow = row;
  // 重置表单（避免上次数据残留）
  transferForm.transferType = '';
  transferForm.remark = '';
  transferFormRef.value?.resetFields();
  // 显示弹窗
  transferDialog.visible = true;
};

/** 关闭流转弹窗（点击取消/弹窗关闭按钮触发） */
const handleTransferClose = () => {
  transferDialog.visible = false;
  // 重置表单（可选，避免下次打开有残留）
  transferForm.transferType = '';
  transferForm.remark = '';
};


onMounted(() => {
  getList();
});
</script>
