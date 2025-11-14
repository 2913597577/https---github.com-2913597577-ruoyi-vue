<template>
  <div class="p-2">
   <!--  <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="客户名称" prop="customerId">
              <el-select-v2 v-model="queryParams.customerId" placeholder="请选择客户" :options="customerList"
                :props="selectProps" filterable clearable :loading="loading">
                <template #empty>
                  <div class="empty-state">未找到匹配的客户</div>
                </template>
              </el-select-v2>
            </el-form-item>
            <el-form-item label="跟踪状态" prop="cumtomerStatus">
              <el-select v-model="queryParams.cumtomerStatus" placeholder="请选择跟踪状态" clearable>
                <el-option v-for="dict in cumtomer_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="回访时间" prop="trackingTime">
              <el-date-picker clearable v-model="queryParams.trackingTime" type="date" 
                placeholder="请选择回访时间" />
            </el-form-item>
            <el-form-item label="提交状态" prop="submitStatus">
              <el-select v-model="queryParams.submitStatus" placeholder="请选择提交状态" clearable>
                <el-option v-for="dict in submit_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="下次回访时间" prop="nextTime">
              <el-date-picker clearable v-model="queryParams.nextTime" type="date" 
                placeholder="请选择下次回访时间" />
            </el-form-item>
            <el-form-item label="日志类型" prop="isReturn">
              <el-select v-model="queryParams.isReturn" placeholder="请选择日志类型" clearable>
                <el-option :key=0 label="普通日志" value=0></el-option>
                <el-option :key=1 label="回访日志" value=1></el-option>
              </el-select>
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
              v-hasPermi="['myCustomer:customerTracking:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['myCustomer:customerTracking:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['myCustomer:customerTracking:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['myCustomer:customerTracking:export']">导出</el-button>
          </el-col>
        </div>
        <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['myCustomer:customerTracking:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['myCustomer:customerTracking:refresh']">刷新
            </el-button>
          </el-col>
        </div>

          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerTrackingList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="客户名称" align="center" prop="customerId" width="180" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ getCustomerNameById(scope.row.customerId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法务支持" align="center" prop="legalSupportName" width="100" />
        <!-- <el-table-column label="跟踪状态" align="center" prop="cumtomerStatus">
          <template #default="scope">
            <dict-tag :options="cumtomer_status" :value="scope.row.cumtomerStatus" />
          </template>
        </el-table-column> -->
        <el-table-column label="回访时间" align="center" prop="trackingTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.trackingTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="回访内容" align="center" prop="customerRemark" show-overflow-tooltip />
        <!-- <el-table-column label="提交状态" align="center" prop="submitStatus">
          <template #default="scope">
            <dict-tag :options="submit_status" :value="scope.row.submitStatus" />
          </template>
        </el-table-column> -->
        <el-table-column label="下次回访时间" align="center" prop="nextTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内勤项数计数" align="center" prop="interCount" width="100" />
        <!-- <el-table-column label="风险提示" align="center" prop="remark1" />
        <el-table-column label="处理进度" align="center" prop="remark2" /> -->
        <!-- <el-table-column label="备注" align="center" prop="remark3" /> -->
        <el-table-column label="回访分类" align="center" prop="trackingType" width="120">
          <template #default="scope">
            <dict-tag :options="dc_follow_classification" :value="scope.row.trackingType ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip
          width="200" fixed="right">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button link type="info" icon="View" @click="handleView(scope.row)">
                查看
              </el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['myCustomer:customerTracking:edit']">修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['myCustomer:customerTracking:remove']">删除</el-button>
            </el-tooltip>
            <!-- <el-tooltip content="提交" placement="top">
              <el-button link type="success" icon="Upload" @click="handleSubmit(scope.row)"
                v-hasPermi="['myCustomer:customerTracking:submit']"
                v-if="scope.row.submitStatus == 0 && scope.row.trackingType == 2">提交</el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
     
    <!-- 筛选按钮弹窗 -->
    <el-dialog v-model="searchDialogVisible" title="筛选" width="900px" append-to-body draggable>
      <div class="p-2">
        <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="客户名称" prop="customerId">
              <el-select-v2 v-model="queryParams.customerId" placeholder="请选择客户" :options="customerList"
                :props="selectProps" filterable clearable :loading="loading">
                <template #empty>
                  <div class="empty-state">未找到匹配的客户</div>
                </template>
              </el-select-v2>
            </el-form-item>
            <!-- <el-form-item label="跟踪状态" prop="cumtomerStatus">
              <el-select v-model="queryParams.cumtomerStatus" placeholder="请选择跟踪状态" clearable>
                <el-option v-for="dict in cumtomer_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="回访时间" prop="trackingTime">
              <el-date-picker clearable v-model="queryParams.trackingTime" type="date" 
                placeholder="请选择回访时间" />
            </el-form-item>
            <!-- <el-form-item label="提交状态" prop="submitStatus">
              <el-select v-model="queryParams.submitStatus" placeholder="请选择提交状态" clearable>
                <el-option v-for="dict in submit_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="下次回访时间" prop="nextTime">
              <el-date-picker clearable v-model="queryParams.nextTime" type="date" 
                placeholder="请选择下次回访时间" />
            </el-form-item>
            <!-- <el-form-item label="日志类型" prop="isReturn">
              <el-select v-model="queryParams.isReturn" placeholder="请选择日志类型" clearable>
                <el-option :key=0 label="普通日志" value=0></el-option>
                <el-option :key=1 label="回访日志" value=1></el-option>
              </el-select>
            </el-form-item> -->

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

    <!-- 添加或修改客户跟踪对话框 --> 
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body draggable>
      <el-form ref="customerTrackingFormRef" :model="form" :rules="rules" label-width="100px">
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
        <el-form-item label="回访分类" prop="trackingType">
          <el-select v-model="form.trackingType" placeholder="请选择回访类型">
            <el-option v-for="dict in dc_follow_classification" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回访记录" prop="customerRemark">
          <el-input v-model="form.customerRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
       
        <!-- <el-form-item label="跟踪状态" prop="cumtomerStatus">
          <el-select v-model="form.cumtomerStatus" placeholder="请选择跟踪状态">
            <el-option v-for="dict in cumtomer_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="回访时间" prop="trackingTime">
          <el-date-picker clearable v-model="form.trackingTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择回访时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="提交状态" prop="submitStatus">
          <el-select v-model="form.submitStatus" placeholder="请选择提交状态">
            <el-option v-for="dict in submit_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="下次回访时间" prop="nextTime">
          <el-date-picker clearable v-model="form.nextTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次回访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内勤项数计数" prop="interCount">
          <el-input v-model="form.interCount" placeholder="请输入内勤项数计数" />
        </el-form-item>
        <!-- <el-form-item label="风险提示" prop="remark1">
          <el-input v-model="form.remark1" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理进度" prop="remark2">
          <el-input v-model="form.remark2" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="日志类型" prop="isReturn">
          <el-radio-group v-model="form.isReturn">
            <el-radio :label=0>普通记录</el-radio>
            <el-radio :label=1>回访记录</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="备注3" prop="remark3">
          <el-input v-model="form.remark3" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改工单管理对话框 -->
    <el-dialog :title="jobOrderDialog.title" v-model="jobOrderDialog.visible" width="500px" append-to-body>
      <el-form ref="customerJobOrderFormRef" :model="jobOrderForm" :rules="rules" label-width="80px">

        <el-form-item label="源合同地址" prop="preContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="preFile" />
        </el-form-item>

        <el-form-item label="客户要求" prop="customerRequirements">
          <el-input v-model="jobOrderForm.customerRequirements" type="textarea" placeholder="请输入内容" />
        </el-form-item>

        <el-form-item label="交付时间" prop="deliveryTime">
          <el-date-picker clearable v-model="jobOrderForm.deliveryTime" type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择交付时间">
          </el-date-picker>
        </el-form-item>

      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitJobOrderForm">确 定</el-button>
          <el-button @click="jobOrderDialogCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看客户跟踪记录对话框 -->
    <el-dialog :title="viewDialog.title" v-model="viewDialog.visible" width="800px" append-to-body draggable>
      <el-table :data="viewCustomerTrackings" border>
        <el-table-column label="回访时间" align="center" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.trackingTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="回访内容" prop="customerRemark" align="center"  show-overflow-tooltip />
        <el-table-column label="回访分类" align="center" width="100">
            <template #default="scope">
              <dict-tag :options="dc_follow_classification" :value="scope.row.trackingType ?? ''" />
            </template>
          </el-table-column>
         <!--  <el-table-column label="跟踪状态" align="center" width="100">
            <template #default="scope">
              <dict-tag :options="cumtomer_status" :value="scope.row.cumtomerStatus" />
            </template>
          </el-table-column> -->

        <!-- <el-table-column label="下次跟踪时间" align="center" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="风险提示" prop="remark1" show-overflow-tooltip />
          <el-table-column label="处理进度" prop="remark2" show-overflow-tooltip /> -->
      <el-table-column label="法务支持" prop="legalSupportName" align="center" width="100px" show-overflow-tooltip /> 
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialog.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="CustomerTracking" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listCustomerTracking, getCustomerTracking, delCustomerTracking, addCustomerTracking, updateCustomerTracking } from '@/api/myCustomer/customerTracking';
import { CustomerTrackingVO, CustomerTrackingQuery, CustomerTrackingForm } from '@/api/myCustomer/customerTracking/types';
import { addCustomerJobOrder } from '@/api/customerJobOrder/customerJobOrder';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { useRoute } from 'vue-router';  // 用于接收路由参数


const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { customer_tracking_type, cumtomer_status, submit_status } = toRefs<any>(proxy?.useDict('customer_tracking_type', 'cumtomer_status', 'submit_status'));
const {dc_follow_classification} = toRefs<any>(proxy?.useDict('dc_follow_classification'));
const customerTrackingList = ref<CustomerTrackingVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const customerList = ref<any[]>([]);
const queryFormRef = ref<ElFormInstance>();
const customerTrackingFormRef = ref<ElFormInstance>();

const CustomerId = route.query.customerId;

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const jobOrderDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerTrackingForm = {
  id: undefined,
  customerId: undefined,
  customerRemark: undefined,
  trackingType: undefined,
  cumtomerStatus: undefined,
  legalSupportId: undefined,
  trackingTime: undefined,
  submitStatus: undefined,
  legalSupportName: undefined,
  nextTime: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
  isReturn: 0,
  interCount: 0
}

const preFile = ref(null);
const data = reactive<PageData<CustomerTrackingForm, CustomerTrackingQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    customerId: undefined,
    customerRemark: undefined,
    trackingType: undefined,
    cumtomerStatus: undefined,
    trackingTime: undefined,
    submitStatus: undefined,
    nextTime: undefined,
    remark1: undefined,
    remark2: undefined,
    remark3: undefined,
    isReturn: undefined,
    legalSupportId: undefined,
    interCount: 0,

    /**
 * 是否回访记录
 */
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


const jobOrderForm = ref({
  legalSupport: undefined,
  legalSupportId: undefined,
  preContractAddress: undefined,
  preContractName: undefined,
  newContractAddress: undefined,
  newContractName: undefined,
  customerRequirements: undefined,
  deliveryTime: undefined,
  trackingId: undefined,
  contractHandler: undefined,
  contractHandlerName: undefined,
  processingStatus: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,

});

// select 的 props 定义为常量，避免递归更新
const selectProps = {
  label: 'customer_name',
  value: 'customer_id'
}

const lawyerList = ref([]);

//查找相关
const searchDialogVisible = ref(false)

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
      console.log(form.value.legalSupportId);
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
/** 查询客户跟踪列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerTracking(queryParams.value);
  customerTrackingList.value = res.rows;
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
  form.value = { ...initFormData };
  customerTrackingFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerTrackingVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  if (CustomerId) {
    form.value.customerId = CustomerId;
  }
  dialog.visible = true;
  dialog.title = "添加客户跟踪";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerTrackingVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerTracking(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改客户跟踪";
}

/** 提交按钮 */
const submitForm = () => {
  customerTrackingFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerTracking(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerTracking(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerTrackingVO) => {
  const _ids = row?.id || ids.value;
  console.log(row)
  await proxy?.$modal.confirm('是否确认删除客户跟踪编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerTracking(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('myCustomer/customerTracking/export', {
    ...queryParams.value
  }, `customerTracking_${new Date().getTime()}.xlsx`)
}

const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}

//处理提交工单
const handleSubmit = async (row?: CustomerTrackingVO) => {
  console.log(row)
  const _id = row?.id || ids.value;
  if (!_id) {
    proxy?.$modal.msgWarning('请选择要提交的客户跟踪记录');
    return;
  }
  console.log(_id)
  // 将选中的客户跟踪记录信息填充到工单表单中
  jobOrderForm.value.trackingId = _id;

  console.log(jobOrderForm.value)
  // 打开工单弹窗
  jobOrderDialog.visible = true;
  jobOrderDialog.title = '新增/修改工单';
};
const jobOrderDialogCancel = () => {
  jobOrderDialog.visible = false;
};
const submitJobOrderForm = async () => {
  if (preFile.value) {

    jobOrderForm.value.preContractAddress = preFile.value[0].ossId;
    jobOrderForm.value.preContractName = preFile.value[0].name;
  }

  await addCustomerJobOrder(jobOrderForm.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  jobOrderDialog.visible = false;
}
// 根据客户ID获取客户名称
const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  let customer = customerList.value.find(item => item.transfer_id === customerId);
  if (!customer) {
    customer = customerList.value.find(item => item.customer_id === customerId);
  }
  return customer ? customer.customer_realName : '';
};

// 添加查看对话框相关变量
const viewDialog = reactive({
  visible: false,
  title: ''
});

const viewCustomerTrackings = ref<CustomerTrackingVO[]>([]);

// 查看按钮处理函数
const handleView = async (row: CustomerTrackingVO) => {
  const customerId = row.customerId;
  const customerName = getCustomerNameById(customerId);

  // 查询该客户的所有跟踪记录
  try {
    const res = await listCustomerTracking({ customerId });
    viewCustomerTrackings.value = res.rows;
    viewDialog.title = `【${customerName}】的跟踪记录`;
    viewDialog.visible = true;
  } catch (error) {
    proxy?.$modal.msgError('获取客户跟踪记录失败');
  }
};

// 监听 intentionCustomerId 的变化
watch(
  () => route.query.customerId,
  async (newCustomerId) => {
    if (newCustomerId) {
      // 确保客户列表已加载
      if (customerList.value.length === 0) {
        await loadCustomerList();
      }

      queryParams.value.customerId = newCustomerId;

      // 验证客户ID是否在客户列表中
      const customerExists = customerList.value.some(
        item => item.customer_id === newCustomerId
      );

      if (!customerExists) {
        console.warn(`客户ID ${newCustomerId} 不在客户列表中`);
        // 可以选择清空或保留显示ID
        // queryParams.value.customerId = undefined;
      }

      await handleQuery();
    } else {
      queryParams.value.customerId = undefined;
      await getList();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // 1. 优先加载客户下拉框（无论是否有CustomerId，表单都需要）
  await loadLawyerSupportList();
  await loadCustomerList();
  await getList();

});
</script>
