<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
           <el-form-item label="客户名称" prop="customerId">
              <el-select v-model="queryParams.customerId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                  :value="item.customer_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法务支持" prop="legalSupportId" label-width="68px">
              <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable>
                <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
                  :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker clearable
                v-model="queryParams.createTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间"
              />
            </el-form-item>
            <el-form-item label="操作人" prop="createBy">
              <el-select v-model="queryParams.createBy" placeholder="请选择操作人" filterable clearable>
                <el-option v-for="user in userList" :key="user.userId"
                    :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
              </el-select>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['legalSupportChange:legalSupportChange:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['legalSupportChange:legalSupportChange:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['legalSupportChange:legalSupportChange:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['legalSupportChange:legalSupportChange:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="legalSupportChangeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="客户名称" align="center" prop="customerName" />
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="法务支持" align="center" prop="legalSupportName" />
        <!-- <el-table-column label="法务支持ID" align="center" prop="legalSupportId" /> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <!-- <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="remark1" />
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['legalSupportChange:legalSupportChange:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['legalSupportChange:legalSupportChange:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改法务支持变更对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="legalSupportChangeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="法务支持" prop="legalSupportName">
          <el-input v-model="form.legalSupportName" placeholder="请输入法务支持" />
        </el-form-item>
        <el-form-item label="法务支持ID" prop="legalSupportId">
          <el-input v-model="form.legalSupportId" placeholder="请输入法务支持ID" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable
            v-model="form.createTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建人" />
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

<script setup name="LegalSupportChange" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport, listUser } from '@/api/customerInfo/customerInfo';
import { listLegalSupportChange, getLegalSupportChange, delLegalSupportChange, addLegalSupportChange, updateLegalSupportChange } from '@/api/legalSupportChange/legalSupportChange';
import { LegalSupportChangeVO, LegalSupportChangeQuery, LegalSupportChangeForm } from '@/api/legalSupportChange/legalSupportChange/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const legalSupportChangeList = ref<LegalSupportChangeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const legalSupportChangeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: LegalSupportChangeForm = {
  id: undefined,
  customerName: undefined,
  customerId: undefined,
  legalSupportName: undefined,
  legalSupportId: undefined,
  createTime: undefined,
  createBy: undefined,
}
const data = reactive<PageData<LegalSupportChangeForm, LegalSupportChangeQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerName: undefined,
    customerId: undefined,
    legalSupportName: undefined,
    legalSupportId: undefined,
    createTime: undefined,
    createBy: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
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

/** 查询法务支持变更列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLegalSupportChange(queryParams.value);
  legalSupportChangeList.value = res.rows;
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
  legalSupportChangeFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LegalSupportChangeVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加法务支持变更";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LegalSupportChangeVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getLegalSupportChange(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改法务支持变更";
}

/** 提交按钮 */
const submitForm = () => {
  legalSupportChangeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateLegalSupportChange(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLegalSupportChange(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

const lawyerList = ref([]);
const loadLawyerSupportList = async () => {
  try {
    // 调用接口：system/user/list?pageNum=1&pageSize=10&deptId=1969581806504747009
    const response = await listLawyerSupport();
    // console.log('法务支持人员列表：', response);
    lawyerList.value = response.rows;
  } catch (error) {
    proxy?.$modal.msgError('加载法务支持人员失败，请稍后重试');
    // console.error('法务人员列表加载异常：', error);
  }
};

const userList = ref([]);
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
/** 删除按钮操作 */
const handleDelete = async (row?: LegalSupportChangeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除法务支持变更编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delLegalSupportChange(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('legalSupportChange/legalSupportChange/export', {
    ...queryParams.value
  }, `legalSupportChange_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  loadUserList();
  loadCustomerList();
  loadLawyerSupportList();
  getList();
});
</script>
