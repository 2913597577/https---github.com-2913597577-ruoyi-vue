<template>
  <div class="p-2">
   <!--  <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="对接客户" prop="customerId">
              <el-select v-model="queryParams.customerId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="欠款人" prop="debtorName">
              <el-input v-model="queryParams.debtorName" placeholder="请输入欠款人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="欠款金额" prop="debtAmount">
              <el-input v-model="queryParams.debtAmount" placeholder="请输入欠款金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="剩余欠款" prop="remainingAmount">
              <el-input v-model="queryParams.remainingAmount" placeholder="请输入剩余欠款" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="需求接收时间" prop="requestReceiveTime">
              <el-date-picker clearable v-model="queryParams.requestReceiveTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择需求接收时间" />
            </el-form-item>
            <el-form-item label="备注" prop="evidenceNotes">
              <el-input v-model="queryParams.evidenceNotes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案系统账号" prop="filingSystemAccount">
              <el-input v-model="queryParams.filingSystemAccount" placeholder="请输入立案系统账号" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案密码" prop="filingPassword">
              <el-input v-model="queryParams.filingPassword" placeholder="请输入立案密码" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案日期" prop="filingDate">
              <el-date-picker clearable v-model="queryParams.filingDate" type="date" 
                placeholder="请选择立案日期" />
            </el-form-item>
            <el-form-item label="下次联系时间" prop="nextContactTime">
              <el-date-picker clearable v-model="queryParams.nextContactTime" type="date" 
                placeholder="请选择下次联系时间" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition> -->

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8" justify="space-between">
         <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['caseDetail:caseDetail:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['caseDetail:caseDetail:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['caseDetail:caseDetail:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['caseDetail:caseDetail:export']">导出</el-button>
          </el-col>
        </div>
        <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['customerInfo:customerInfo:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['customerInfo:customerInfo:refresh']">刷新
            </el-button>
          </el-col>
        </div>
          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="caseDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="自增主键" align="center" prop="id" v-if="true" />
        <el-table-column label="客户id(客户编号)" align="center" prop="customerId" /> -->
        <el-table-column label="跟踪记录" align="center" width="80" show-overflow-tooltip>
          <template #default="scope">
            <!-- 详情按钮：点击携带当前行id跳转 -->
            <el-button link type="primary" icon="View" size="default"
              @click="handleTrackingDetail(scope.row.customerId)" style="padding: 0 6px;">
              详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerId" width="160" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ getCustomerNameById(scope.row.customerId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法务支持" align="center" prop="legalSupportName" width="100" />
        <el-table-column label="债务人" align="center" prop="debtorName" width="100" />
        <el-table-column label="欠款金额" align="center" prop="debtAmount" width="100" />
        <el-table-column label="剩余欠款" align="center" prop="remainingAmount" width="100" />
        <el-table-column label="联系电话" align="center" prop="contactPhone" width="100" />
        <el-table-column label="身份证号" align="center" prop="idCard" width="140" show-overflow-tooltip />
        <el-table-column label="需求接收时间" align="center" prop="requestReceiveTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.requestReceiveTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标的" align="center" prop="remark" width="100" show-overflow-tooltip />
        <el-table-column label="证据备注" align="center" prop="evidenceNotes" width="100" show-overflow-tooltip />
        <el-table-column label="立案日期" align="center" prop="filingDate" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.filingDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="立案系统账号" align="center" prop="filingSystemAccount" width="100" show-overflow-tooltip />
        <el-table-column label="立案密码" align="center" prop="filingPassword" width="100" show-overflow-tooltip />
        <el-table-column label="下次联系时间" align="center" prop="nextContactTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.nextContactTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法官" align="center" prop="judgeName" width="80" show-overflow-tooltip />
        <el-table-column label="法官电话" align="center" prop="judgePhone" width="100" show-overflow-tooltip />
        <el-table-column label="案件状态" align="center" prop="caseStatus" />
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip
        width="200" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['caseDetail:caseDetail:edit']">修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['caseDetail:caseDetail:remove']">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

<!-- 搜索按钮弹窗内容 -->
<el-dialog v-model="searchDialogVisible" title="筛选" width="900px" append-to-body draggable>
  <!-- <template> -->
  <div class="p-2">
  <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="对接客户" prop="customerId">
              <el-select v-model="queryParams.customerId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="欠款人" prop="debtorName">
              <el-input v-model="queryParams.debtorName" placeholder="请输入欠款人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="欠款金额" prop="debtAmount">
              <el-input v-model="queryParams.debtAmount" placeholder="请输入欠款金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="剩余欠款" prop="remainingAmount">
              <el-input v-model="queryParams.remainingAmount" placeholder="请输入剩余欠款" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="需求接收时间" prop="requestReceiveTime">
              <el-date-picker clearable v-model="queryParams.requestReceiveTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择需求接收时间" />
            </el-form-item>
            <el-form-item label="备注" prop="evidenceNotes">
              <el-input v-model="queryParams.evidenceNotes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案系统账号" prop="filingSystemAccount">
              <el-input v-model="queryParams.filingSystemAccount" placeholder="请输入立案系统账号" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案密码" prop="filingPassword">
              <el-input v-model="queryParams.filingPassword" placeholder="请输入立案密码" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立案日期" prop="filingDate">
              <el-date-picker clearable v-model="queryParams.filingDate" type="date" 
                placeholder="请选择立案日期" />
            </el-form-item>
            <el-form-item label="下次联系时间" prop="nextContactTime">
              <el-date-picker clearable v-model="queryParams.nextContactTime" type="date" 
                placeholder="请选择下次联系时间" />
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

    <!-- 添加或修改欠款案件表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable>
      <el-form ref="caseDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="客户id(客户编号)" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id(客户编号)" />
        </el-form-item> -->
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" filterable>
            <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
              :value="item.customer_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法务支持" prop="legalSupport" label-width="90px">
          <el-select filterable v-model="form.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债务人" prop="debtorName">
          <el-input v-model="form.debtorName" placeholder="请输入欠款人" />
        </el-form-item>
        <el-form-item label="欠款金额" prop="debtAmount">
          <el-input v-model="form.debtAmount" placeholder="请输入欠款金额" />
        </el-form-item>
        <el-form-item label="剩余欠款" prop="remainingAmount">
          <el-input v-model="form.remainingAmount" placeholder="请输入剩余欠款" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="需求接收时间" prop="requestReceiveTime">
          <el-date-picker clearable v-model="form.requestReceiveTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择需求接收时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证据备注" prop="evidenceNotes">
          <el-input v-model="form.evidenceNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="立案系统账号" prop="filingSystemAccount">
          <el-input v-model="form.filingSystemAccount" placeholder="请输入立案系统账号" />
        </el-form-item>
        <el-form-item label="立案密码" prop="filingPassword">
          <el-input v-model="form.filingPassword" placeholder="请输入立案密码" />
        </el-form-item>
        <el-form-item label="立案日期" prop="filingDate">
          <el-date-picker clearable v-model="form.filingDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择立案日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次联系时间" prop="nextContactTime">
          <el-date-picker clearable v-model="form.nextContactTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次联系时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标的" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="法官" prop="judgeName">
          <el-input v-model="form.judgeName" placeholder="请输入法官" />
        </el-form-item>
        <el-form-item label="法官电话" prop="judgePhone">
          <el-input v-model="form.judgePhone" placeholder="请输入法官电话" />
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

<script setup name="CaseDetail" lang="ts">
import { listCaseDetail, getCaseDetail, delCaseDetail, addCaseDetail, updateCaseDetail } from '@/api/caseDetail/caseDetail';
import { CaseDetailVO, CaseDetailQuery, CaseDetailForm } from '@/api/caseDetail/caseDetail/types';
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;


const route = useRoute();
const caseDetailList = ref<CaseDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const caseDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CaseDetailForm = {
  id: undefined,
  customerId: undefined,
  debtorName: undefined,
  debtAmount: undefined,
  remainingAmount: undefined,
  contactPhone: undefined,
  idCard: undefined,
  requestReceiveTime: undefined,
  evidenceNotes: undefined,
  filingSystemAccount: undefined,
  filingPassword: undefined,
  filingDate: undefined,
  nextContactTime: undefined,
  remark: undefined,
  caseStatus: undefined,
  judgeName: undefined,
  judgePhone: undefined,
  legalSupportId: undefined,
  legalSupportName: undefined
}
const data = reactive<PageData<CaseDetailForm, CaseDetailQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    customerId: undefined,
    debtorName: undefined,
    debtAmount: undefined,
    remainingAmount: undefined,
    contactPhone: undefined,
    idCard: undefined,
    requestReceiveTime: undefined,
    evidenceNotes: undefined,
    filingSystemAccount: undefined,
    filingPassword: undefined,
    filingDate: undefined,
    nextContactTime: undefined,
    caseStatus: undefined,
    legalSupportId: undefined,
    legalSupportName: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "自增主键不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "客户id(客户编号)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


const customerList = ref<any[]>([]);

const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}

// 根据客户ID获取客户名称
const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  let customer = customerList.value.find(item => item.transfer_id === customerId);
  if (!customer){
    customer=customerList.value.find(item => item.customer_id === customerId);
  }
  return customer ? customer.customer_realName : '';
};

/** 查询欠款案件表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCaseDetail(queryParams.value);
  caseDetailList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

//查找相关
const searchDialogVisible = ref(false)

/** 查找按钮操作 */
const handleSearch = () => {
  searchDialogVisible.value = true
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  caseDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CaseDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加欠款案件表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CaseDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCaseDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改欠款案件表";
}

/** 提交按钮 */
const submitForm = () => {
  caseDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCaseDetail(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCaseDetail(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CaseDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除欠款案件表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCaseDetail(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('caseDetail/caseDetail/export', {
    ...queryParams.value
  }, `caseDetail_${new Date().getTime()}.xlsx`)
}

const router = useRouter();
//  新增：跟踪记录详情跳转函数
const handleTrackingDetail = (id: number | string) => {
  // 跳转到目标路由，并通过query参数传递id
  router.push({
    path: '/legalSupport/caseProgress',  // 目标路由路径（需与实际路由配置一致）
    query: { CustomerId: id }  // 传递id参数（键名可自定义，如customerId）
  });
};

const lawyerList = ref([]);
/**
 * 法务支持选择变化处理
 */
const handleLegalSupportChange = (userId: string) => {
  if (userId) {
    // 查找选中的律师信息
    const selectedLawyer = lawyerList.value.find(lawyer => lawyer.userId === userId);
    if (selectedLawyer) {
      // 设置法务支持名称到 legalSupport 字段


      form.value.legalSupportName = selectedLawyer.nickName;

    }
  } else {
    // 清空选择时重置相关字段
    form.value.legalSupportId = undefined;
    form.value.legalSupportName = undefined;
  }
}

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



watch(
  () => route.query.customerId,
  async (newCustomerId) => {
    // 等待客户列表加载完毕再操作
    if (customerList.value.length === 0) {
      await loadCustomerList();
    }

    if (newCustomerId) {
      queryParams.value.customerId = newCustomerId;
    } else {
      queryParams.value.customerId = undefined;
    }

    await getList(); // 确保客户列表已加载
  },
  { immediate: true }
);

onMounted(() => {
  loadLawyerSupportList();
  loadCustomerList();
  getList();
});
</script>


