<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="法务支持" prop="legalSupport">
              <el-input v-model="queryParams.legalSupport" placeholder="请输入法务支持" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="法务支持id" prop="legalSupportId">
              <el-input v-model="queryParams.legalSupportId" placeholder="请输入法务支持id" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="法务支持" prop="legalSupportId" label-width="68px">
              <el-select filterable v-model="queryParams.legalSupportId" placeholder="请选择法务支持人员" clearable
                style="width: 100%;" @change="handleLegalSupportChange">
                <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
                  :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="客户名称" prop="customerId">
              <el-select-v2 v-model="queryParams.customerId" placeholder="请选择客户" :options="customerList"
                :props="selectProps" filterable clearable :loading="loading">
                <template #empty>
                  <div class="empty-state">未找到匹配的客户</div>
                </template>
              </el-select-v2>
            </el-form-item>
            <el-form-item label="交付时间" prop="deliveryTime">
              <el-date-picker clearable v-model="queryParams.deliveryTime" type="date" 
                placeholder="请选择交付时间" />
            </el-form-item>
            <el-form-item label="跟踪记录" prop="trackingId">
              <el-input v-model="queryParams.trackingId" placeholder="请输入跟踪记录id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="处理人id" prop="contractHandler">
              <el-input v-model="queryParams.contractHandler" placeholder="请输入处理人id" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="处理人" prop="contractHandlerName">
              <el-input v-model="queryParams.contractHandlerName" placeholder="请输入处理人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="处理状态" prop="processingStatus">
              <el-select v-model="queryParams.processingStatus" placeholder="请选择工单处理状态" clearable>
                <el-option v-for="dict in processing_status" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['customerJobOrder:customerJobOrder:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerJobOrder:customerJobOrder:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerJobOrder:customerJobOrder:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerJobOrder:customerJobOrder:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerJobOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="工单状态" align="center" prop="processingStatus" width="100">
          <template #default="scope">
            <dict-tag :options="processing_status" :value="scope.row.processingStatus" />
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerId" width="160" show-overflow-tooltip >
          <template #default="scope">
            <span>{{ getCustomerNameById(scope.row.customerId) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="法务支持" align="center" prop="legalSupport" width="100" />
        <!-- <el-table-column label="法务支持id" align="center" prop="legalSupportId" /> -->
        <!-- <el-table-column label="源合同地址" align="center" prop="preContractAddress" /> -->
        <el-table-column label="原合同" align="center" prop="preContractName" width="160" show-overflow-tooltip />
        <!-- <el-table-column label="新合同地址" align="center" prop="newContractAddress" /> -->
        <el-table-column label="新合同" align="center" prop="newContractName" width="160" show-overflow-tooltip />
        <el-table-column label="客户要求" align="center" prop="customerRequirements" width="160" show-overflow-tooltip />
        <el-table-column label="交付时间" align="center" prop="deliveryTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="跟踪记录id" align="center" prop="trackingId" />
        <el-table-column label="处理人id" align="center" prop="contractHandler" /> -->
        <el-table-column label="法务中心接单人" align="center" prop="contractHandlerName" width="100">
        <template #header>
            <span style="font-size: 11px; font-weight: bold;">法务中心接单人</span>
        </template>
         </el-table-column>
        <el-table-column label="客户所属方" align="center" prop="remark1" width="100" show-overflow-tooltip />

        <!-- <el-table-column label="备注1" align="center" prop="remark1" />
        <el-table-column label="备注2" align="center" prop="remark2" />
        <el-table-column label="备注3" align="center" prop="remark3" /> -->
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip
        width="300" fixed="right">
          <template #default="scope">
            <el-tooltip content="接工单" placement="top">
              <el-button size="small" v-if="scope.row.processingStatus == 0" link type="success" icon="Menu" @click="handleAccept(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:edit']">接工单</el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button  size="small" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:edit']">修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button size="small" link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:remove']">删除</el-button>
            </el-tooltip>
            <!-- <el-tooltip content="处理" placement="top">
              <el-button link type="primary" icon="Download" @click="handleProcess(scope.row)"
                v-hasPermi="['customerJobOrder:customerJobOrder:process']">下载</el-button>
            </el-tooltip> -->
            <el-tooltip content="合同下载" placement="top" >
              <el-dropdown @command="(command) => handleProcessCommand({ row: scope.row, type: command })">
                <el-button size="small" link type="warning" icon="Download"
                  v-hasPermi="['customerJobOrder:customerJobOrder:process']">合同下载</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="pre">原合同</el-dropdown-item>
                    <el-dropdown-item command="new">新合同</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改工单管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerJobOrderFormRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="法务支持" prop="legalSupport" label-width="90px">
          <el-select filterable v-model="form.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源合同地址" prop="preContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="preFile" />
        </el-form-item>
        <el-form-item label="源合同文件名" prop="preContractName">
          <el-input v-model="form.preContractName" placeholder="请输入源合同文件名" />
        </el-form-item> -->
        <el-form-item label="新合同" prop="newContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="newFile" />
        </el-form-item>
        <!-- <el-form-item label="新合同文件名" prop="newContractName">
          <el-input v-model="form.newContractName" placeholder="请输入新合同文件名" />
        </el-form-item> -->
        <el-form-item label="客户要求" prop="customerRequirements">
          {{ form.customerRequirements }}
          <!-- <el-input v-model="form.customerRequirements" type="textarea" placeholder="请输入内容" /> -->
        </el-form-item>
        <el-form-item label="客户所属方" prop="remark1">
          <el-input v-model="form.remark1" />
        </el-form-item>
        <el-form-item label="交付时间" prop="deliveryTime">
          {{ form.deliveryTime ? parseTime(form.deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}') : '' }}
          <!-- <el-date-picker clearable v-model="form.deliveryTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择交付时间">
          </el-date-picker> -->
        </el-form-item>
        <!-- <el-form-item label="跟踪记录id" prop="trackingId">
          <el-input v-model="form.trackingId" placeholder="请输入跟踪记录id" />
        </el-form-item>
        <el-form-item label="处理人id" prop="contractHandler">
          <el-input v-model="form.contractHandler" placeholder="请输入处理人id" />
        </el-form-item> -->
        <el-form-item label="处理人" prop="contractHandlerName">
          {{ form.contractHandlerName }}
          <!-- <el-input v-model="form.contractHandlerName" placeholder="请输入处理人" /> -->
        </el-form-item>
        <el-form-item label="工单处理状态" prop="processingStatus">
          <el-select v-model="form.processingStatus" placeholder="请选择工单处理状态">
            <el-option v-for="dict in processing_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="备注1" prop="remark1">
          <el-input v-model="form.remark1" placeholder="请输入备注1" />
        </el-form-item>
        <el-form-item label="备注2" prop="remark2">
          <el-input v-model="form.remark2" placeholder="请输入备注2" />
        </el-form-item>
        <el-form-item label="备注3" prop="remark3">
          <el-input v-model="form.remark3" placeholder="请输入备注3" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 在现有 el-dialog 后面添加新的确认对话框 -->
    <el-dialog title="确认接单信息" v-model="acceptDialog.visible" width="500px" append-to-body>
      <el-form :model="acceptDialog.form" label-width="100px">
        <el-form-item label="法务支持">
          <el-input v-model="acceptDialog.form.legalSupport" disabled />
        </el-form-item>
        <el-form-item label="原合同">
          <el-input v-model="acceptDialog.form.preContractName" disabled />
        </el-form-item>
        <el-form-item label="客户要求">
          <el-input v-model="acceptDialog.form.customerRequirements" type="textarea" disabled />
        </el-form-item>
        <el-form-item label="交付时间">
          <el-date-picker v-model="acceptDialog.form.deliveryTime" type="datetime" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="acceptDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAccept">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 在现有 el-dialog 后面添加新的新增工单对话框 -->
    <el-dialog title="新增工单管理" v-model="addDialog.visible" width="500px" append-to-body>
      <el-form ref="addCustomerJobOrderFormRef" :model="addForm" :rules="addRules" label-width="90px">
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="addForm.customerId" placeholder="请选择客户" filterable>
            <el-option v-for="item in customerList" :key="item.transfer_id" :label="item.customer_name"
              :value="item.transfer_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法务支持" prop="legalSupportId" label-width="90px">
          <el-select filterable v-model="addForm.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleAddLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原合同" prop="preContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="addPreFile" />
        </el-form-item>
        <!-- <el-form-item label="原合同文件名" prop="preContractName">
    <el-dialog title="新增工单管理" v-model="addDialog.visible" width="500px" append-to-body>
      <el-form ref="addCustomerJobOrderFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="法务支持" prop="legalSupportId" label-width="90px">
          <el-select filterable v-model="addForm.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleAddLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原合同" prop="preContractAddress">
          <file-upload :limit="1" :fileSize="10" v-model="addPreFile" />
        </el-form-item>
        <!-- <el-form-item label="原合同文件名" prop="preContractName">
      <el-input v-model="addForm.preContractName" placeholder="请输入源合同文件名" />
    </el-form-item> -->
        <!-- <el-form-item label="新合同地址" prop="newContractAddress">
      <file-upload :limit="1" :fileSize="10" v-model="addNewFile" />
    </el-form-item>
    <el-form-item label="新合同文件名" prop="newContractName">
      <el-input v-model="addForm.newContractName" placeholder="请输入新合同文件名" />
    </el-form-item> -->
        <el-form-item label="客户要求" prop="customerRequirements">
          <el-input v-model="addForm.customerRequirements" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="客户所属方" prop="remark1">
          <el-input v-model="addForm.remark1" placeholder="请输入客户所属方" />
        </el-form-item>
        <el-form-item label="交付时间" prop="deliveryTime">
          <el-date-picker clearable v-model="addForm.deliveryTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择交付时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="处理人" prop="contractHandlerName">
      <el-input v-model="addForm.contractHandlerName" placeholder="请输入处理人" />
    </el-form-item> -->
        <!-- <el-form-item label="备注1" prop="remark1">
      <el-input v-model="addForm.remark1" placeholder="请输入备注1" />
    </el-form-item>
    <el-form-item label="备注2" prop="remark2">
      <el-input v-model="addForm.remark2" placeholder="请输入备注2" />
    </el-form-item>
    <el-form-item label="备注3" prop="remark3">
      <el-input v-model="addForm.remark3" placeholder="请输入备注3" />
    </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitAddForm">确 定</el-button>
          <el-button @click="cancelAdd">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="CustomerJobOrder" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { listCustomerJobOrder, getCustomerJobOrder, delCustomerJobOrder, addCustomerJobOrder, updateCustomerJobOrder, acceptCustomerJobOrder } from '@/api/customerJobOrder/customerJobOrder';
import { CustomerJobOrderVO, CustomerJobOrderQuery, CustomerJobOrderForm } from '@/api/customerJobOrder/customerJobOrder/types';
import { useRoute } from 'vue-router';


const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { processing_status } = toRefs<any>(proxy?.useDict('processing_status'));


const route = useRoute();
const customerJobOrderList = ref<CustomerJobOrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const preFile = ref();
const newFile = ref();

const queryFormRef = ref<ElFormInstance>();
const customerJobOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerJobOrderForm = {
  id: undefined,
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
  customerId: undefined,
  customerName: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
}
const data = reactive<PageData<CustomerJobOrderForm, CustomerJobOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
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
    customerId: undefined,
    customerName: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    deliveryTime: [
      { required: true, message: "交付时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerJobOrder(queryParams.value);
  customerJobOrderList.value = res.rows;
  console.log(res.rows, '工单管理')
  total.value = res.total;
  loading.value = false;
}

// const handleAccept = async (row: CustomerJobOrderVO) => {
//   // 检查工单是否已被接收
//   if (row.processingStatus === 1) {
//     proxy?.$modal.msgWarning("该工单已被接收，不能重复接收");
//     return;
//   }

//   // 调用后端接工单接口

//     const res = await acceptCustomerJobOrder(row.id.toString());
//     if (res.code === 200) {
//       proxy?.$modal.msgSuccess("工单接收成功");
//       await getList(); // 刷新列表
//     } else {
//       proxy?.$modal.msgWarning(res.msg || "接工单失败");
//     }
// }
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  customerJobOrderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerJobOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// /** 新增按钮操作 */
// const handleAdd = () => {
//   reset();
//   dialog.visible = true;
//   dialog.title = "添加工单管理";
// }

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerJobOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerJobOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工单管理";
}

/** 提交按钮 */
const submitForm = () => {
  customerJobOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (preFile.value) {
        form.value.preContractAddress = preFile.value[0].ossId;
        form.value.preContractName = preFile.value[0].name;
      }
      if (newFile.value) {
        form.value.newContractAddress = newFile.value[0].ossId;
        form.value.newContractName = newFile.value[0].name;
      }
      if (form.value.id) {
        await updateCustomerJobOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerJobOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/**
 * 法务支持选择变化处理
 */
const handleLegalSupportChange = (userId: string) => {
  if (userId) {
    // 查找选中的律师信息
    const selectedLawyer = lawyerList.value.find(lawyer => lawyer.userId === userId);
    if (selectedLawyer) {
      // 设置法务支持名称到 legalSupport 字段
      form.value.legalSupport = selectedLawyer.nickName;
    }
  } else {
    // 清空选择时重置相关字段
    form.value.legalSupport = undefined;
  }
}
// 修改处理方法，支持选择下载原合同或新合同
const handleProcessCommand = ({ row, type }: { row: CustomerJobOrderVO, type: 'pre' | 'new' }) => {
  if (type === 'pre' && row.preContractAddress) {
    proxy?.$download.oss(row.preContractAddress);
  } else if (type === 'new' && row.newContractAddress) {
    proxy?.$download.oss(row.newContractAddress);
  } else {
    proxy?.$modal.msgWarning(`无${type === 'pre' ? '原' : '新'}合同文件可下载`);
  }
};
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
/** 删除按钮操作 */
const handleDelete = async (row?: CustomerJobOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除工单管理编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerJobOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerJobOrder/customerJobOrder/export', {
    ...queryParams.value
  }, `customerJobOrder_${new Date().getTime()}.xlsx`)
}
const handleProcess = (row: CustomerJobOrderVO) => {
  proxy?.$download.oss(row.preContractAddress);
}

// 添加确认对话框的状态管理
const acceptDialog = reactive({
  visible: false,
  form: {
    id: undefined,
    legalSupport: '',
    preContractName: '',
    newContractName: '',
    customerRequirements: '',
    deliveryTime: ''
  }
});

/**
 * 处理接单按钮点击事件 - 显示确认对话框
 */
const handleAccept = (row: CustomerJobOrderVO) => {
  // 检查工单是否已被接收
  if (row.processingStatus !== 0) {
    proxy?.$modal.msgWarning("该工单已被接收，不能重复接收");
    return;
  }

  // 填充确认对话框数据
  acceptDialog.form.id = row.id;
  acceptDialog.form.legalSupport = row.legalSupport;
  acceptDialog.form.preContractName = row.preContractName;
  acceptDialog.form.newContractName = row.newContractName;
  acceptDialog.form.customerRequirements = row.customerRequirements;
  acceptDialog.form.deliveryTime = row.deliveryTime;

  // 显示确认对话框
  acceptDialog.visible = true;
}

/**
 * 确认接单操作
 */
const confirmAccept = async () => {
  if (!acceptDialog.form.id) return;

  try {
    const res = await acceptCustomerJobOrder(acceptDialog.form.id.toString());
    if (res.code === 200) {
      proxy?.$modal.msgSuccess("工单接收成功");
      acceptDialog.visible = false;
      await getList(); // 刷新列表
    } else {
      proxy?.$modal.msgWarning(res.msg || "接工单失败");
    }
  } catch (error) {
    proxy?.$modal.msgError("接单操作失败");
  }
}

// 新增弹窗相关状态
const addDialog = reactive<DialogOption>({
  visible: false,
  title: '新增工单管理'
});

const addCustomerJobOrderFormRef = ref<ElFormInstance>();
const addPreFile = ref();
const addNewFile = ref();

const addForm = ref<CustomerJobOrderForm>({ ...initFormData });

const addRules = {
  deliveryTime: [
    { required: true, message: "交付时间不能为空", trigger: "blur" }
  ],
};

/** 取消新增按钮 */
const cancelAdd = () => {
  addForm.value = { ...initFormData };
  addCustomerJobOrderFormRef.value?.resetFields();
  addPreFile.value = null;
  addNewFile.value = null;
  addDialog.visible = false;
}

/**
 * 新增法务支持选择变化处理
 */
const handleAddLegalSupportChange = (userId: string) => {
  if (userId) {
    // 查找选中的律师信息
    const selectedLawyer = lawyerList.value.find(lawyer => lawyer.userId === userId);
    if (selectedLawyer) {
      // 设置法务支持名称到 legalSupport 字段
      addForm.value.legalSupport = selectedLawyer.nickName;
    }
  } else {
    // 清空选择时重置相关字段
    addForm.value.legalSupport = undefined;
  }
}

/** 新增提交按钮 */
const submitAddForm = () => {
  addCustomerJobOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      const formData = { ...addForm.value };

      form.value.customerName = getCustomerNameById(form.value.customerId);
      if (addPreFile.value) {
        formData.preContractAddress = addPreFile.value[0].ossId;
        formData.preContractName = addPreFile.value[0].name;
      }
      if (addNewFile.value) {
        formData.newContractAddress = addNewFile.value[0].ossId;
        formData.newContractName = addNewFile.value[0].name;
      }

      try {
        await addCustomerJobOrder(formData);
        proxy?.$modal.msgSuccess("新增成功");
        addDialog.visible = false;
        await getList();
      } finally {
        buttonLoading.value = false;
      }
    }
  });
}

const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  // console.log(customerId, '客户id')
  // console.log(customerList.value, '客户列表')
  const customer = customerList.value.find(item => item.transfer_id === customerId);
  // console.log(customer)
  return customer ? customer.customer_realName : '';
};

/** 修改新增按钮操作 */
const handleAdd = () => {
  addForm.value = { ...initFormData };
  addCustomerJobOrderFormRef.value?.resetFields();
  addPreFile.value = null;
  addNewFile.value = null;
  addDialog.visible = true;
}
// select 的 props 定义为常量，避免递归更新
const selectProps = {
  label: 'customer_name',
  value: 'transfer_id'
}
const customerList = ref<any[]>([]);
const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;

  } catch (error) {
    // console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
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
  await loadCustomerList(); // 等待客户列表加载完成
  loadLawyerSupportList();
  await getList(); // 客户列表加载完后，再获取工单列表并渲染
});
</script>
