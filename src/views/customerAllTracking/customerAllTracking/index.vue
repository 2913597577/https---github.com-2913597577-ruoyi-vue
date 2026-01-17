<!-- views/tracking/index.vue -->
<template>
  <div class="tracking-container">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
      <el-card shadow="hover">
    <!-- 查询条件 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="客户名称" prop="customerId">
        <el-select-v2 v-model="queryParams.customerId" placeholder="请选择客户" :options="customerList" :props="selectProps"
          filterable clearable :loading="loading">
          <template #empty>
            <div class="empty-state">未找到匹配的客户</div>
          </template>
        </el-select-v2>
      </el-form-item>

      <el-form-item label="法务支持" prop="legalSupportId" label-width="68px">
        <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable
          style="width: 100%;" @change="handleLegalSupportChange">
          <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
            :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跟踪类型" prop="trackingType">
        <el-select v-model="queryParams.trackingType" placeholder="请选择跟踪类型" clearable style="width: 200px">
          <el-option label="全部" :value="null" />
          <el-option label="回访" :value="1" />
          <el-option label="出访" :value="2" />
          <el-option label="保险" :value="3" />
          <el-option label="工单" :value="4" />
          <el-option label="案件" :value="5" />
        </el-select>
      </el-form-item>

      <el-form-item label="跟踪时间" prop="trackingTime">
        <el-date-picker v-model="queryParams.trackingTime" type="date" placeholder="请选择跟踪时间" value-format="YYYY-MM-DD"
          style="width: 200px" />
      </el-form-item>

      <el-form-item label="下次跟踪时间" prop="nextTrackingTime">
        <el-date-picker v-model="queryParams.nextTrackingTime" type="date" placeholder="请选择下次跟踪时间"
          value-format="YYYY-MM-DD" style="width: 200px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
      </div>
    </transition>
    <!-- 操作按钮 -->
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
    <el-card shadow="never">

      <template #header>
        <el-row :gutter="10" class="mb8">
         <!--  <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['customerAllTracking:customerAllTracking:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerAllTracking:customerAllTracking:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerAllTracking:customerAllTracking:remove']">删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerAllTracking:customerAllTracking:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="trackingList" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="跟踪记录" align="center" width="120" show-overflow-tooltip>
        <template #default="scope">
          <!-- 详情按钮：点击携带当前行id跳转 -->
          <el-button link type="primary" icon="View" size="default" @click="handleTrackingDetail(scope.row)"
            style="padding: 0 6px;">
            详情
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="客户名称" align="center" prop="customerId" width="200" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ getCustomerNameById(scope.row.customerId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法务支持" align="center" prop="legalSupportName" width="120" />
      <el-table-column label="跟踪时间" align="center" prop="trackingTime" width="140">
        <template #default="scope">
          <span>{{ scope.row.trackingTime ? parseTime(scope.row.trackingTime, '{y}-{m}-{d}') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟踪内容" align="center" prop="remark" width="240" show-overflow-tooltip />
      <el-table-column label="下次跟踪时间" align="center" prop="nextTrackingTime" width="140">
        <template #default="scope">
          <span>{{ scope.row.nextTrackingTime ? parseTime(scope.row.nextTrackingTime, '{y}-{m}-{d}') : '' }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="跟踪类型" align="center" prop="trackingType" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.trackingType === 1">回访</el-tag>
          <el-tag v-else-if="scope.row.trackingType === 2" type="success">出访</el-tag>
          <el-tag v-else-if="scope.row.trackingType === 3" type="warning">保险</el-tag>
          <el-tag v-else-if="scope.row.trackingType === 4" type="danger">工单</el-tag>
          <el-tag v-else-if="scope.row.trackingType === 5" type="info">案件</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button type="primary" link icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="trackingRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model.number="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="法务支持ID" prop="legalSupportId">
          <el-input v-model.number="form.legalSupportId" placeholder="请输入法务支持ID" />
        </el-form-item>
        <el-form-item label="跟踪时间" prop="trackingTime">
          <el-date-picker v-model="form.trackingTime" type="datetime" placeholder="请选择跟踪时间"
            value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="下次跟踪时间" prop="nextTrackingTime">
          <el-date-picker v-model="form.nextTrackingTime" type="datetime" placeholder="请选择下次跟踪时间"
            value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="跟踪类型" prop="trackingType">
          <el-select v-model="form.trackingType" placeholder="请选择跟踪类型" style="width: 100%">
            <el-option label="回访" :value="1" />
            <el-option label="出访" :value="2" />
            <el-option label="保险" :value="3" />
            <el-option label="工单" :value="4" />
            <el-option label="案件" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getAllTrackingRecords, TrackingQueryParams, TrackingRecord } from '@/api/customerAllTracking';
import { parseTime } from '@/utils/ruoyi';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';

// 定义变量
const loading = ref(true);
const showSearch = ref(true);
const trackingList = ref<TrackingRecord[]>([]);
const total = ref(0);
const title = ref('');
const open = ref(false);
const router = useRouter();
const route = useRoute();
// 查询参数
const queryParams = reactive<TrackingQueryParams>({
  pageNum: 0,
  pageSize: 20
});

// 表单数据
const form = reactive<Partial<TrackingRecord>>({
  id: undefined,
  customerId: undefined,
  customerName: '',
  legalSupportId: undefined,
  legalSupportName: '',
  trackingTime: '',
  nextTrackingTime: '',
  trackingType: undefined,
  remark: ''
});

// 表单校验规则
const rules = {
  customerId: [{ required: true, message: "客户ID不能为空", trigger: "blur" }],
  legalSupportId: [{ required: true, message: "法务支持ID不能为空", trigger: "blur" }],
  trackingType: [{ required: true, message: "跟踪类型不能为空", trigger: "change" }]
};

// 表单引用
const queryRef = ref<InstanceType<typeof ElForm>>();
const trackingRef = ref<InstanceType<typeof ElForm>>();

// 生命周期
/* onMounted(() => {
  getList();
}); */

// 获取数据列表
function getList() {
  loading.value = true;

  getAllTrackingRecords(queryParams).then(response => {
    trackingList.value = response.data.data || [];
    total.value = response.data.total || 0;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

// 搜索按钮操作
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

// 重置查询
function resetQuery() {
  queryRef.value?.resetFields();
  handleQuery();
}

// 添加按钮操作
function handleAdd() {
  form.id = undefined;
  title.value = "添加跟踪记录";
  open.value = true;
}

// 修改按钮操作
function handleUpdate(row: TrackingRecord) {
  Object.assign(form, row);
  title.value = "修改跟踪记录";
  open.value = true;
}

// 提交表单
function submitForm() {
  trackingRef.value?.validate((valid) => {
    if (valid) {
      // 这里应该调用相应的API进行保存操作
      ElMessage.success("保存成功");
      open.value = false;
      getList();
    }
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.id = undefined;
  form.customerId = undefined;
  form.customerName = '';
  form.legalSupportId = undefined;
  form.legalSupportName = '';
  form.trackingTime = '';
  form.nextTrackingTime = '';
  form.trackingType = undefined;
  form.remark = '';
  trackingRef.value?.resetFields();
}

// 删除按钮操作
function handleDelete(row: TrackingRecord) {
  ElMessageBox.confirm(
    `是否确认删除跟踪记录编号为"${row.id}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 这里应该调用相应的API进行删除操作
    ElMessage.success('删除成功');
    getList();
  });
}

const customerList = ref([]);


// select 的 props 定义为常量，避免递归更新
const selectProps = {
  label: 'customer_name',
  value: 'customer_id'
}

const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  // console.log(customerId, '客户id')
  // console.log(customerList.value, '客户列表')
  let customer = customerList.value.find(item => item.transfer_id === customerId);
  if (!customer) {
     customer = customerList.value.find(item => item.customer_id === customerId);
  }
  // console.log(customer)
  return customer ? customer.customer_realName : '';
};
const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}
const lawyerList = ref([]);

const handleLegalSupportChange = (userId: string) => {
  if (userId) {
    // 查找选中的律师信息
    const selectedLawyer = lawyerList.value.find(lawyer => lawyer.userId === userId);
    if (selectedLawyer) {
      // 设置法务支持名称到 legalSupport 字段
      form.legalSupportName = selectedLawyer.nickName;
    }
  } else {
    // 清空选择时重置相关字段
    form.legalSupportName = undefined;
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
// 新增：跟踪记录详情跳转函数
const handleTrackingDetail = (data) => {

  // console.log(data)
  const { trackingType, customerId } = data;

  if (!trackingType || !customerId) {
    ElMessage.error("跳转失败：trackingType或customerId为空");
    return;
  }

  let targetPath = "";
  switch (trackingType) {
    case 1:
      targetPath = "/legalSupport/customerTracking";
      break;
    case 2:
      targetPath = "/legalSupport/customerOutVisit";
      break;
    case 3:
      targetPath = "/legalSupport/insuranceCase";
      break;
    case 4:
      targetPath = "/legalSupport/customerJobOrder";
      break;
    case 5:
      targetPath = "/legalSupport/caseDetail";
      break;
    default:
      console.error("跳转失败：未知的trackingType", trackingType);
      return; // 未知类型时终止跳转
  }


  router.push({
    path: targetPath,
    query: { customerId: customerId }
  });
};


watch(
  () => route.query.customerId,
  async (newCustomerId) => {
    if (newCustomerId) {
      // 确保客户列表已加载
      if (customerList.value.length === 0) {
        await loadCustomerList();
      }

      queryParams.customerId = newCustomerId;

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
      queryParams.customerId = undefined;
      await getList();
    }
  },
  { immediate: true }
);


/* onMounted(() => {
  loadLawyerSupportList();
  loadCustomerList();
}); */
onMounted(async () => {
  await loadCustomerList(); // 等待客户列表加载完成
  loadLawyerSupportList();
  await getList(); // 客户列表加载完后，再获取工单列表并渲染
});
</script>

<!-- <style scoped>
.tracking-container {
  padding: 20px;
}
</style>
 -->