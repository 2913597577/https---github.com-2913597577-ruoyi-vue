<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="对接客户" prop="customerId">
              <el-select v-model="queryParams.customerId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in customerList" :key="item.transfer_id" :label="item.customer_name"
                  :value="item.transfer_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单日期" prop="orderDate">
              <el-date-picker clearable v-model="queryParams.orderDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择下单日期" />
            </el-form-item>
            <el-form-item label="工单号" prop="insuranceNumber">
              <el-input v-model="queryParams.insuranceNumber" placeholder="请输入工单号" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="法务支持id" prop="legalSupportId">
              <el-input v-model="queryParams.legalSupportId" placeholder="请输入法务支持id" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="法务支持" prop="legalSupportId" label-width="68px">
              <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable
                style="width: 100%;" @change="handleLegalSupportChange">
                <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
                  :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原告方" prop="plaintiff">
              <el-input v-model="queryParams.plaintiff" placeholder="请输入原告方" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="被告方" prop="defendant">
              <el-input v-model="queryParams.defendant" placeholder="请输入被告方" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="标的额" prop="subjectAmount">
              <el-input v-model="queryParams.subjectAmount" placeholder="请输入标的额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="案由" prop="caseReason">
              <el-input v-model="queryParams.caseReason" placeholder="请输入案由" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="法院" prop="jurisdictionCourt">
              <el-input v-model="queryParams.jurisdictionCourt" placeholder="请输入管辖权法院" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="保费" prop="premium">
              <el-input v-model="queryParams.premium" placeholder="请输入保费" clearable @keyup.enter="handleQuery" />
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
              v-hasPermi="['insuranceCase:insuranceCase:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['insuranceCase:insuranceCase:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['insuranceCase:insuranceCase:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['insuranceCase:insuranceCase:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="insuranceCaseList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="自增主键" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="客户id(客户编号)" align="center" prop="customerId" /> -->
        <el-table-column label="客户名称" align="center" prop="customerId">
          <template #default="scope">
            <span>{{ getCustomerNameById(scope.row.customerId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法务支持员工" align="center" prop="legalSupportName" />
        <el-table-column label="下单日期" align="center" prop="orderDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单号" align="center" prop="insuranceNumber" />
        <!-- <el-table-column label="法务支持id" align="center" prop="legalSupportId" /> -->

        <el-table-column label="原告方" align="center" prop="plaintiff" />
        <el-table-column label="被告方" align="center" prop="defendant" />
        <el-table-column label="标的额" align="center" prop="subjectAmount" />
        <el-table-column label="案由" align="center" prop="caseReason" />
        <el-table-column label="管辖权法院" align="center" prop="jurisdictionCourt" />
        <el-table-column label="保费" align="center" prop="premium" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['insuranceCase:insuranceCase:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['insuranceCase:insuranceCase:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改保险记录表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="insuranceCaseFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="客户id(客户编号)" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id(客户编号)" />
        </el-form-item> -->
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" filterable>
            <el-option v-for="item in customerList" :key="item.transfer_id" :label="item.customer_name"
              :value="item.transfer_id">
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
        <el-form-item label="下单日期" prop="orderDate">
          <el-date-picker clearable v-model="form.orderDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工单号" prop="insuranceNumber">
          <el-input v-model="form.insuranceNumber" placeholder="请输入工单号" />
        </el-form-item>
        <!-- <el-form-item label="法务支持id" prop="legalSupportId">
          <el-input v-model="form.legalSupportId" placeholder="请输入法务支持id" />
        </el-form-item>
        <el-form-item label="法务支持姓名" prop="legalSupportName">
          <el-input v-model="form.legalSupportName" placeholder="请输入法务支持姓名" />
        </el-form-item> -->
        <el-form-item label="原告方" prop="plaintiff">
          <el-input v-model="form.plaintiff" placeholder="请输入原告方" />
        </el-form-item>
        <el-form-item label="被告方" prop="defendant">
          <el-input v-model="form.defendant" placeholder="请输入被告方" />
        </el-form-item>
        <el-form-item label="标的额" prop="subjectAmount">
          <el-input v-model="form.subjectAmount" placeholder="请输入标的额" />
        </el-form-item>
        <el-form-item label="案由" prop="caseReason">
          <el-input v-model="form.caseReason" placeholder="请输入案由" />
        </el-form-item>
        <el-form-item label="管辖权法院" prop="jurisdictionCourt">
          <el-input v-model="form.jurisdictionCourt" placeholder="请输入管辖权法院" />
        </el-form-item>
        <el-form-item label="保费" prop="premium">
          <el-input v-model="form.premium" placeholder="请输入保费" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="InsuranceCase" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { listInsuranceCase, getInsuranceCase, delInsuranceCase, addInsuranceCase, updateInsuranceCase } from '@/api/insuranceCase/insuranceCase';
import { InsuranceCaseVO, InsuranceCaseQuery, InsuranceCaseForm } from '@/api/insuranceCase/insuranceCase/types';
import { useRoute } from 'vue-router';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;



const route = useRoute();
const insuranceCaseList = ref<InsuranceCaseVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const insuranceCaseFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InsuranceCaseForm = {
  id: undefined,
  customerId: undefined,
  orderDate: undefined,
  insuranceNumber: undefined,
  legalSupportId: undefined,
  legalSupportName: undefined,
  plaintiff: undefined,
  defendant: undefined,
  subjectAmount: undefined,
  caseReason: undefined,
  jurisdictionCourt: undefined,
  premium: undefined,
  remark: undefined,
}
const data = reactive<PageData<InsuranceCaseForm, InsuranceCaseQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerId: undefined,
    orderDate: undefined,
    insuranceNumber: undefined,
    legalSupportId: undefined,
    legalSupportName: undefined,
    plaintiff: undefined,
    defendant: undefined,
    subjectAmount: undefined,
    caseReason: undefined,
    jurisdictionCourt: undefined,
    premium: undefined,
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

/** 查询保险记录表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInsuranceCase(queryParams.value);
  insuranceCaseList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

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

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  insuranceCaseFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InsuranceCaseVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加保险记录表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InsuranceCaseVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getInsuranceCase(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改保险记录表";
}

/** 提交按钮 */
const submitForm = () => {
  insuranceCaseFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInsuranceCase(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addInsuranceCase(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}


// 根据客户ID获取客户名称
const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  const customer = customerList.value.find(item => item.transfer_id === customerId);
  return customer ? customer.customer_realName : '';
};

/** 删除按钮操作 */
const handleDelete = async (row?: InsuranceCaseVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除保险记录表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delInsuranceCase(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

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
      form.value.legalSupportName = selectedLawyer.userName;
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

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('insuranceCase/insuranceCase/export', {
    ...queryParams.value
  }, `insuranceCase_${new Date().getTime()}.xlsx`)
}
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

onMounted(async () => {
  await loadLawyerSupportList();
  await loadCustomerList();
  await getList();
});
</script>
