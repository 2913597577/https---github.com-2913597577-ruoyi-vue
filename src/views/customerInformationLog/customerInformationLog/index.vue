<template>
  <div class="p-2">
    <!-- <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="120px">
            <el-form-item label="负责人" prop="principal">
              <el-input v-model="queryParams.principal" placeholder="请输入负责人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="法务支持" prop="lawyerId">
              <el-input v-model="queryParams.lawyerId" placeholder="请输入法务法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="套餐类型" prop="packageType">
              <el-select v-model="queryParams.packageType" placeholder="请选择套餐类型" clearable >
                <el-option v-for="dict in combo_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="是否转为意向客户" prop="isIntention">
              <el-input v-model="queryParams.isIntention" placeholder="请输入是否转为意向客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否转为风险客户" prop="isRisk">
              <el-input v-model="queryParams.isRisk" placeholder="请输入是否转为风险客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否转为退费客户" prop="isRefund">
              <el-input v-model="queryParams.isRefund" placeholder="请输入是否转为退费客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="queryParams.customerType" placeholder="请选择客户类型  A-0 B-1 C-2 D-3" clearable >
                <el-option v-for="dict in dc_customer_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="客户服务城市" prop="customerCity">
              <el-input v-model="queryParams.customerCity" placeholder="请输入客户服务城市" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否分配法务支持" prop="isAssigned">
              <el-input v-model="queryParams.isAssigned" placeholder="请输入是否分配法务支持 0-未分配 1-已分配" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
 -->
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8" justify="space-between">
          <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customerInformationLog:customerInformationLog:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerInformationLog:customerInformationLog:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customerInformationLog:customerInformationLog:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customerInformationLog:customerInformationLog:export']">导出</el-button>
          </el-col>
          </div>
          <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['customerInformationLog:customerInformationLog:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['customerInformationLog:customerInformationLog:refresh']">刷新
            </el-button>
          </el-col>
        </div>
          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerInformationLogList" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="签约日期" align="center" prop="signDate" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customerName" />
        <el-table-column label="负责人" align="center" prop="principal" />
        <el-table-column label="负责人电话" align="center" prop="principalPhone" width="100px" show-overflow-tooltip />
        <el-table-column label="法务支持" align="center" prop="lawyerId" />
        <el-table-column label="甩单人" align="center" prop="transferPerson" />
        <el-table-column label="杀单手" align="center" prop="closer" />
        <el-table-column label="签约类型" align="center" prop="contractType" />
        <el-table-column label="套餐类型" align="center" prop="packageType">
          <template #default="scope">
            <dict-tag :options="combo_type" :value="scope.row.packageType"/>
          </template>
        </el-table-column>
        <el-table-column label="合同金额" align="center" prop="contractAmount" width="140" />
        <el-table-column label="实收金额" align="center" prop="actualReceipt" width="140" />
        <el-table-column label="尾款金额" align="center" prop="balance" width="140" />
        <el-table-column label="到期时间" align="center" prop="expireDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否转为意向客户" align="center" prop="isIntention">
          <template #default="scope">
            <dict-tag :options="dc_false_true" :value="scope.row.isIntention"/>
          </template>
        </el-table-column>
        <el-table-column label="是否转为风险客户" align="center" prop="isRisk">
          <template #default="scope">
            <dict-tag :options="dc_false_true" :value="scope.row.isRisk"/>
          </template>
        </el-table-column>
        <el-table-column label="是否转为退费客户" align="center" prop="isRefund">
          <template #default="scope">
            <dict-tag :options="dc_false_true" :value="scope.row.isRefund"/>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" align="center" prop="contractCode" />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column label="续费/尾款动作(1-续费 2-付尾款 3-其他)" align="center" prop="actionType" />
        <el-table-column label="客户id" align="center" prop="transferId" />
        <el-table-column label="客户总表id" align="center" prop="customerInfoId" />
        <el-table-column label="客户总表创建时间" align="center" prop="infoCreateTime" width="120px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.infoCreateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户总表更新时间" align="center" prop="infoUpdateTime" width="120px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.infoUpdateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户经理id" align="center" prop="accountManagerId" />
        <el-table-column label="邀约人id" align="center" prop="inviterId" />
        <el-table-column label="服务时长" align="center" prop="serviceDuration" />
        <el-table-column label="合同金额" align="center" prop="contractAmount" />
        <el-table-column label="客户类型" align="center" prop="customerType">
          <template #default="scope">
            <dict-tag :options="dc_customer_type" :value="scope.row.customerType"/>
          </template>
        </el-table-column>
        <el-table-column label="立案账号" align="center" prop="caseFillingAccount" />
        <el-table-column label="立案密码" align="center" prop="caseFillingPwd" />
        <el-table-column label="客户服务城市" align="center" prop="customerCity" />
        <el-table-column label="是否分配法务支持" align="center" prop="isAssigned">
          <template #default="scope">
            <dict-tag :options="dc_true_or_false" :value="scope.row.isAssigned"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customerInformationLog:customerInformationLog:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customerInformationLog:customerInformationLog:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 筛选按钮弹窗 -->
    <el-dialog v-model="searchDialogVisible" title="筛选" width="920px" append-to-body draggable>
      <div class="p-2">
      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="120px">
            <el-form-item label="负责人" prop="principal">
              <el-input v-model="queryParams.principal" placeholder="请输入负责人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="法务支持" prop="lawyerId">
              <el-input v-model="queryParams.lawyerId" placeholder="请输入法务法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="套餐类型" prop="packageType">
              <el-select v-model="queryParams.packageType" placeholder="请选择套餐类型" clearable >
                <el-option v-for="dict in combo_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="是否转为意向客户" prop="isIntention">
              <el-input v-model="queryParams.isIntention" placeholder="请输入是否转为意向客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否转为风险客户" prop="isRisk">
              <el-input v-model="queryParams.isRisk" placeholder="请输入是否转为风险客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否转为退费客户" prop="isRefund">
              <el-input v-model="queryParams.isRefund" placeholder="请输入是否转为退费客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="queryParams.customerType" placeholder="请选择客户类型  A-0 B-1 C-2 D-3" clearable >
                <el-option v-for="dict in dc_customer_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="客户服务城市" prop="customerCity">
              <el-input v-model="queryParams.customerCity" placeholder="请输入客户服务城市" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否分配法务支持" prop="isAssigned">
              <el-input v-model="queryParams.isAssigned" placeholder="请输入是否分配法务支持 0-未分配 1-已分配" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
    </div>
    </el-dialog>
    <!-- 添加或修改客户信息记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerInformationLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="签约日期" prop="signDate">
          <el-date-picker clearable
            v-model="form.signDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
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
        <el-form-item label="套餐类型" prop="packageType">
          <el-select v-model="form.packageType" placeholder="请选择套餐类型">
            <el-option
                v-for="dict in combo_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实收金额" prop="actualReceipt">
          <el-input v-model="form.actualReceipt" placeholder="请输入实收金额" />
        </el-form-item>
        <el-form-item label="尾款金额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入尾款金额" />
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker clearable
            v-model="form.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否转为意向客户" prop="isIntention">
          <el-input v-model="form.isIntention" placeholder="请输入是否转为意向客户" />
        </el-form-item>
        <el-form-item label="是否转为风险客户" prop="isRisk">
          <el-input v-model="form.isRisk" placeholder="请输入是否转为风险客户" />
        </el-form-item>
        <el-form-item label="是否转为退费客户" prop="isRefund">
          <el-input v-model="form.isRefund" placeholder="请输入是否转为退费客户" />
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
        <el-form-item label="客户总表id" prop="customerInfoId">
          <el-input v-model="form.customerInfoId" placeholder="请输入客户总表id" />
        </el-form-item>
        <el-form-item label="客户总表创建时间" prop="infoCreateTime">
          <el-date-picker clearable
            v-model="form.infoCreateTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择客户总表创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户总表更新时间" prop="infoUpdateTime">
          <el-date-picker clearable
            v-model="form.infoUpdateTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择客户总表更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户经理id" prop="accountManagerId">
          <el-input v-model="form.accountManagerId" placeholder="请输入客户经理id" />
        </el-form-item>
        <el-form-item label="邀约人id" prop="inviterId">
          <el-input v-model="form.inviterId" placeholder="请输入邀约人id" />
        </el-form-item>
        <el-form-item label="服务时长" prop="serviceDuration">
          <el-input v-model="form.serviceDuration" placeholder="请输入服务时长" />
        </el-form-item>
        <el-form-item label="合同金额" prop="contractAmount">
          <el-input v-model="form.contractAmount" placeholder="请输入合同金额" />
        </el-form-item>
        <el-form-item label="客户类型  A-0 B-1 C-2 D-3" prop="customerType">
          <el-select v-model="form.customerType" placeholder="请选择客户类型  A-0 B-1 C-2 D-3">
            <el-option
                v-for="dict in dc_customer_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="立案账号" prop="caseFillingAccount">
          <el-input v-model="form.caseFillingAccount" placeholder="请输入立案账号" />
        </el-form-item>
        <el-form-item label="立案密码" prop="caseFillingPwd">
          <el-input v-model="form.caseFillingPwd" placeholder="请输入立案密码" />
        </el-form-item>
        <el-form-item label="客户服务城市" prop="customerCity">
          <el-input v-model="form.customerCity" placeholder="请输入客户服务城市" />
        </el-form-item>
        <el-form-item label="是否分配法务支持 0-未分配 1-已分配" prop="isAssigned">
          <el-input v-model="form.isAssigned" placeholder="请输入是否分配法务支持 0-未分配 1-已分配" />
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

<script setup name="CustomerInformationLog" lang="ts">
import { listCustomerInformationLog, getCustomerInformationLog, delCustomerInformationLog, addCustomerInformationLog, updateCustomerInformationLog } from '@/api/customerInformationLog/customerInformationLog';
import { CustomerInformationLogVO, CustomerInformationLogQuery, CustomerInformationLogForm } from '@/api/customerInformationLog/customerInformationLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_false_true, dc_true_or_false,dc_customer_type, combo_type } = toRefs<any>(proxy?.useDict('dc_false_true', 'dc_true_or_false','dc_customer_type', 'combo_type'));

const customerInformationLogList = ref<CustomerInformationLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const route = useRoute();

const queryFormRef = ref<ElFormInstance>();
const customerInformationLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerInformationLogForm = {
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
  isIntention: undefined,
  isRisk: undefined,
  isRefund: undefined,
  contractCode: undefined,
  remarks: undefined,
  actionType: undefined,
  transferId: undefined,
  customerInfoId: undefined,
  infoCreateTime: undefined,
  infoUpdateTime: undefined,
  accountManagerId: undefined,
  inviterId: undefined,
  serviceDuration: undefined,
  contractAmount: undefined,
  customerType: undefined,
  caseFillingAccount: undefined,
  caseFillingPwd: undefined,
  customerCity: undefined,
  isAssigned: undefined
}
const data = reactive<PageData<CustomerInformationLogForm, CustomerInformationLogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    principal: undefined,
    lawyerId: undefined,
    contractType: undefined,
    packageType: undefined,
    isIntention: undefined,
    isRisk: undefined,
    isRefund: undefined,
    customerType: undefined,
    customerCity: undefined,
    isAssigned: undefined,
    customerInfoId: undefined,
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
    isAssigned: [
      { required: true, message: "是否分配法务支持 0-未分配 1-已分配不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

//查找相关
const searchDialogVisible = ref(false)


/** 查询客户信息记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerInformationLog(queryParams.value);
  customerInformationLogList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 查找按钮操作 */
const handleSearch = () => {
  searchDialogVisible.value = true
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  customerInformationLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerInformationLogVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户信息记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerInformationLogVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerInformationLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改客户信息记录";
}

/** 提交按钮 */
const submitForm = () => {
  customerInformationLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerInformationLog(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerInformationLog(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerInformationLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户信息记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerInformationLog(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerInformationLog/customerInformationLog/export', {
    ...queryParams.value
  }, `customerInformationLog_${new Date().getTime()}.xlsx`)
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
    if (column.label == "合同金额" || column.label == "实收金额" || column.label == "尾款金额") {
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



watch(
  () => route.query.customerInfoId,
  (newCustomerInfoId) => {
    if (newCustomerInfoId) {
      // 2. 有CustomerId：查询该客户的单条跟踪记录，并渲染到表格
      try {
        queryParams.value.customerInfoId = newCustomerInfoId;
        handleQuery();
      } catch (error) {
        console.error('获记录失败:', error);
        proxy?.$modal.msgError('获记录失败');
      }
    } else {
      // 如果 intentionCustomerId 为空，则加载所有数据
      getList();
    }
  },
  { immediate: true } // 立即执行一次
);
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
      color:#303133;
      font-weight: bold;
    }
  }
}

</style>
