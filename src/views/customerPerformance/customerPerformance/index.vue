<template>
    <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" >
            <!-- 流转单id改为多选下拉 -->
            <el-form-item label="对接客户" prop="transferId">
              <el-select 
                v-model="queryParams.transferId" 
                placeholder="请选择对接客户" 
                clearable 
                multiple 
                filterable
                collapse-tags
                collapse-tags-tooltip
                @change="handleQuery">
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
            
            <!-- 业绩所属用户id改为多选下拉 -->
            <el-form-item label="业绩所属员工" prop="userId" label-width="120px">
              <el-select 
                v-model="queryParams.userId" 
                placeholder="请选择业绩所属员工" 
                clearable 
                multiple 
                filterable
                collapse-tags
                collapse-tags-tooltip
                @change="handleQuery">
                 <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId">
                </el-option>
              </el-select>
            </el-form-item>

                        <!-- 邀请人ID改为多选下拉 -->
            <el-form-item label="签单人" prop="inviterId">
              <el-select 
                v-model="queryParams.inviterId" 
                placeholder="请选择签单人" 
                clearable 
                multiple 
                filterable
                collapse-tags
                collapse-tags-tooltip
                @change="handleQuery">
                <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId">
                </el-option>
              </el-select>
            </el-form-item>
            
            <!-- 服务类型改为多选下拉 -->
            <el-form-item label="服务类型" prop="serviceType">
              <el-select 
                v-model="queryParams.serviceType" 
                placeholder="请选择服务类型" 
                clearable 
                multiple 
                collapse-tags
                collapse-tags-tooltip
                @change="handleQuery">
                <el-option v-for="dict in combo_type" :key="dict.value" :value="dict.value" :label="dict.label">
                </el-option>
              </el-select>
            </el-form-item>
    
            <!-- 业绩所属城市改为多选下拉 -->
            <el-form-item label="业绩所属城市" prop="city" label-width="120px">
              <el-select 
                v-model="queryParams.city" 
                placeholder="请选择业绩所属城市" 
                clearable 
                multiple 
                filterable
                collapse-tags
                collapse-tags-tooltip
                @change="handleQuery"
                style="width: 200px;"
                >
                <el-option v-for="item in dc_sercive_city" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
            <!-- 服务城市改为多选下拉 -->
            <el-form-item label="服务城市" prop="serviceCity">
              <el-select 
                v-model="queryParams.serviceCity" 
                placeholder="请选择服务城市" 
                clearable 
                multiple 
                filterable
                collapse-tags
                collapse-tags-tooltip
                style="width: 200px;"
                @change="handleQuery">
                <el-option v-for="item in dc_sercive_city" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
            <!-- 服务时间保持日期范围选择器 -->
            <!-- 签单时间 -->
            <el-form-item label="签单时间" prop="serviceStart">
              <el-date-picker
                v-model="queryParams.serviceStart"
                type="date"
                placeholder="请选择签单时间"
                value-format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>

            <!-- 服务结束时间 -->
            <el-form-item label="服务到期时间" prop="serviceEnd" label-width="120px">
              <el-date-picker
                v-model="queryParams.serviceEnd"
                type="date"
                placeholder="请选择服务结束时间"
                value-format="YYYY-MM-DD">
              </el-date-picker>
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['customerPerformance:customerPerformance:add']">新增</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['customerPerformance:customerPerformance:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['customerPerformance:customerPerformance:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['customerPerformance:customerPerformance:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerPerformanceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="流转单编号" align="center" prop="transferId" /> -->
        <!-- <el-table-column label="业绩所属用户id" align="center" prop="userId" /> -->
        <el-table-column label="客户" align="center" prop="companyName" />
        <el-table-column label="服务类型" align="center" prop="serviceType" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="combo_type" :value="scope.row.serviceType ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="业绩所属人" align="center" prop="user_name" />
        <el-table-column label="业绩所属金额" align="center" prop="balance" />
        <el-table-column label="业绩所属城市" align="center" prop="city">
          <template #default="scope">
            <dict-tag :options="dc_sercive_city" :value="scope.row.city" />
          </template>
      </el-table-column>
        <el-table-column label="客户服务城市" align="center" prop="serviceCity">
            <template #default="scope">
              <dict-tag :options="dc_sercive_city" :value="scope.row.serviceCity" />
            </template>
        </el-table-column>
        <el-table-column label="签单时间" align="center" prop="serviceStart" width="120">
        <template #default="scope">
          <span>{{ scope.row.serviceStart ? parseTime(scope.row.serviceStart, '{y}-{m}-{d}') : '' }}</span>
        </template>
        </el-table-column>
        <el-table-column label="服务到期时间" align="center" prop="serviceEnd" width="120">
          <template #default="scope">
          <span>{{ scope.row.serviceEnd ? parseTime(scope.row.serviceEnd, '{y}-{m}-{d}') : '' }}</span>
        </template>
        </el-table-column>
        <el-table-column label="分配人" align="center" prop="creater_name" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customerPerformance:customerPerformance:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customerPerformance:customerPerformance:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改业绩归属登记对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerPerformanceFormRef" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="流转单id" prop="transferId">
          <el-input v-model="form.transferId" placeholder="请输入流转单id" />
        </el-form-item>
        <el-form-item label="业绩所属用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入业绩所属用户id" />
        </el-form-item> -->
        <el-form-item label="业绩所属员工" prop="userId">
         <el-select 
                v-model="form.userId" 
                placeholder="请选择业绩所属员工" 
                clearable 
                >
                 <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="业绩所属金额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入业绩所属金额"  clearable/>
        </el-form-item>
        <el-form-item label="业绩所属城市" prop="city">
           <el-select v-model="form.city" placeholder="请选择归属城市" clearable >
                <el-option v-for="item in dc_sercive_city" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
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

<script setup name="CustomerPerformance" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listUser } from '@/api/customerInfo/customerInfo';
import { listCustomerPerformance, getCustomerPerformance, delCustomerPerformance, addCustomerPerformance, updateCustomerPerformance, listCustomerPerformanceByPage } from '@/api/customerPerformance/customerPerformance';
import { CustomerPerformanceVO, CustomerPerformanceQuery, CustomerPerformanceForm } from '@/api/customerPerformance/customerPerformance/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_sercive_city,combo_type } = toRefs<any>(proxy?.useDict('dc_sercive_city','combo_type'));
const customerPerformanceList = ref<CustomerPerformanceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerPerformanceFormRef = ref<ElFormInstance>();
const serviceDateRange = ref<[string, string] | null>(null);


const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerPerformanceForm = {
  id: undefined,
  transferId: undefined,
  userId: undefined,
  userName: undefined,
  balance: undefined,
  city: undefined,
}
const data = reactive<PageData<CustomerPerformanceForm, CustomerPerformanceQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    transferId: undefined,
    city: undefined,
    serviceCity: undefined,
    inviterId: undefined,
    serviceType: undefined,
    serviceStart: undefined,
    serviceEnd: undefined,
   },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    transferId: [
      { required: true, message: "流转单id不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "业绩所属用户id不能为空", trigger: "blur" }
    ],
    userName: [
      { required: true, message: "业绩所属用户名字不能为空", trigger: "blur" }
    ],
    balance: [
      { required: true, message: "业绩所属金额不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "业绩所属城市不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

const customerList = ref<any[]>([]);
const userList = ref([]); // 用户列表

const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}

const loadUserList = async () => {
  try {
    // 调用接口：system/user/list?pageNum=1&pageSize=10&deptId=1969581806504747009
    const response = await listUser();
    userList.value = response.rows;
  } catch (error) {
    proxy?.$modal.msgError('加载人员失败，请稍后重试');
    console.error('人员列表加载异常：', error);
  }
};



/** 查询业绩归属登记列表 */
const getList = async () => {
  loading.value = true;
  // 使用新的分页查询接口
  const res = await listCustomerPerformanceByPage(queryParams.value);
    if (!res.data) {
    customerPerformanceList.value = [];
    total.value = 0;
    loading.value = false;
    return;
  }
  total.value = res.data.count || 0; // 根据实际返回的数据结构调整
  customerPerformanceList.value = res.data.list; // 注意：返回数据结构可能不同
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
  customerPerformanceFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerPerformanceVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加业绩归属登记";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerPerformanceVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerPerformance(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改业绩归属登记";
}

/** 提交按钮 */
const submitForm = () => {
  customerPerformanceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomerPerformance(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomerPerformance(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerPerformanceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除业绩归属登记编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerPerformance(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerPerformance/customerPerformance/export', {
    ...queryParams.value
  }, `customerPerformance_${new Date().getTime()}.xlsx`)
}


onMounted(() => {
  loadUserList();
  loadCustomerList();
  getList();
});
</script>
