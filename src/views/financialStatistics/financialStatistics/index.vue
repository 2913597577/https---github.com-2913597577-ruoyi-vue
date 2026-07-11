<template>
  <div class="p-2">
    <!-- <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="财务类型" prop="financialType">
              <el-select v-model="queryParams.financialType" placeholder="请选择财务类型" clearable >
                <el-option v-for="dict in dc_financial_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="来源类型" prop="sourceType">
              <el-select v-model="queryParams.sourceType" placeholder="请选择来源类型" clearable >
                <el-option v-for="dict in dc_financial_source_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="归属城市" prop="city">
              <el-select v-model="queryParams.city" placeholder="请选择业绩归属城市" clearable >
                <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="录入人" prop="createrName">
              <el-input v-model="queryParams.createrName" placeholder="请输入录入人姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="流水时间" prop="flowTime">
              <el-date-picker clearable
                v-model="queryParams.flowTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择流水时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['financialStatistics:financialStatistics:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['financialStatistics:financialStatistics:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['financialStatistics:financialStatistics:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['financialStatistics:financialStatistics:export']">导出</el-button>
          </el-col>
        </div>
        <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['financialStatistics:financialStatistics:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['financialStatistics:financialStatistics:refresh']">刷新
            </el-button>
          </el-col>
        </div>

          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table 
       v-loading="loading" 
       border 
       :data="financialStatisticsList" 
       height="650" 
       @selection-change="handleSelectionChange"
       :row-class-name="tableRowClassName"
        row-key="id">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="项目名称" align="center" prop="companyName" width="160" show-overflow-tooltip />
        <el-table-column label="金额" align="center" prop="balance" />
        <el-table-column label="财务类型" align="center" prop="financialType">
          <template #default="scope">
            <dict-tag :options="dc_financial_type" :value="scope.row.financialType"/>
          </template>
        </el-table-column>
        <el-table-column label="来源类型" align="center" prop="sourceType">
          <template #default="scope">
            <dict-tag :options="dc_financial_source_type" :value="scope.row.sourceType"/>
          </template>
        </el-table-column>
        <!-- <el-table-column label="发票凭证" align="center" prop="contractNoUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.contractNoUrl" :width="50" :height="50" />
          </template>
        </el-table-column> -->
         <el-table-column label="发票凭证" align="center" prop="contractNoUrl" width="100">
          <template #default="scope">
            <div class="contract-cell" style="display: flex; justify-content: center; align-items: center;">
              <!-- 有发票凭证时显示查看图标 -->
              <div v-if="scope.row.contractNoUrl" 
                   class="image-trigger" 
                   @click="handlePreviewInvoice(scope.row.contractNoUrl)"
                   style="cursor: pointer; display: flex; align-items: center;">
                <el-icon :size="20" style="color: #409EFF;">
                  <Picture />
                </el-icon>
                <span style="font-size: 12px; margin-left: 4px; color: #409EFF;">查看</span>
              </div>
              
              <!-- 无发票凭证时显示上传图标 -->
              <div v-else 
                   class="image-trigger" 
                   @click="handleUploadInvoice(scope.row)" 
                   v-hasPermi="['financialStatistics:financialStatistics:edit']"
                   style="cursor: pointer; display: flex; align-items: center;">
                <el-icon :size="20" style="color: #F56C6C;">
                  <Document />
                </el-icon>
                <span style="font-size: 12px; margin-left: 4px; color: #F56C6C;">上传</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="100" show-overflow-tooltip />
        <el-table-column label="归属城市" align="center" prop="city" width="80">
          <template #default="scope">
            <dict-tag :options="dc_sercive_city" :value="scope.row.city"/>
          </template>
        </el-table-column>
        <el-table-column label="录入人" align="center" prop="operatorId" width="80" show-overflow-tooltip >
          <template #default="scope">
            <span>{{ getUserNameById(scope.row.operatorId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流水时间" align="center" prop="flowTime" width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.flowTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="operation-column" width="200" fixed="right">
          <template #default="scope">
             <el-tooltip content="查看" placement="top">
              <el-button link type="info" icon="View" @click="handleView(scope.row)">
                查看
              </el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['financialStatistics:financialStatistics:edit']">修改</el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['financialStatistics:financialStatistics:remove']">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  <!-- 筛选按钮弹窗 -->
  <el-dialog v-model="searchDialogVisible" title="筛选" width="900px" append-to-body draggable>
    <div class="p-2">
      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
             <el-form-item label="项目名称" prop="companyName">
              <el-input v-model="queryParams.companyName" placeholder="请输入项目名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="财务类型" prop="financialType">
              <el-select v-model="queryParams.financialType" placeholder="请选择财务类型" clearable >
                <el-option v-for="dict in dc_financial_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="来源类型" prop="sourceType">
              <el-select v-model="queryParams.sourceType" placeholder="请选择来源类型" clearable >
                <el-option v-for="dict in dc_financial_source_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="归属城市" prop="city">
              <el-select v-model="queryParams.city" placeholder="请选择业绩归属城市" clearable >
                <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="录入人" prop="createrName">
              <el-input v-model="queryParams.createrName" placeholder="请输入录入人姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="流水时间" prop="flowTime">
              <el-date-picker clearable
                v-model="queryParams.flowTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择流水时间"
              />
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


    <!-- 添加或修改财务统计对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="financialStatisticsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入财务项目名称" />
        </el-form-item>
        <el-form-item label="金额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="财务类型" prop="financialType">
          <el-select v-model="form.financialType" placeholder="请选择财务类型">
            <el-option
                v-for="dict in dc_financial_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源类型" prop="sourceType">
          <el-select v-model="form.sourceType" placeholder="请选择来源类型">
            <el-option
                v-for="dict in dc_financial_source_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票凭证" prop="contractNo">
          <image-upload v-model="form.contractNo"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="归属城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择业绩归属城市">
            <el-option
                v-for="dict in dc_sercive_city"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水时间" prop="flowTime">
          <el-date-picker clearable
            v-model="form.flowTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择流水时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 发票图片预览组件 -->
    <el-image-viewer 
      v-if="showInvoiceViewer" 
      :url-list="invoicePreviewUrl" 
      @close="closeInvoiceViewer" 
    />

    <!-- 发票上传弹窗 -->
    <el-dialog title="上传发票凭证" v-model="uploadDialogVisible" width="500px" append-to-body>
      <el-form label-width="100px">
        <el-form-item label="发票图片">
          <!-- 使用若依自带的 image-upload 组件 -->
          <image-upload v-model="tempInvoiceUrl" :limit="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="submitInvoiceUpload">确 定</el-button>
          <el-button @click="cancelInvoiceUpload">取 消</el-button>
        </div>
      </template>
    </el-dialog>

     <!-- 新增：查看财务统计记录列表弹窗 -->
    <el-dialog :title="viewDialog.title" v-model="viewDialog.visible" width="900px" append-to-body draggable>
      <el-table :data="viewStatisticsList" border v-loading="viewLoading">
        <!-- <el-table-column label="项目类型" align="center" prop="companyName" show-overflow-tooltip /> -->
        <el-table-column label="金额" align="center" prop="balance" width="120" />
        <el-table-column label="财务类型" align="center" prop="financialType" width="100">
          <template #default="scope">
            <dict-tag :options="dc_financial_type" :value="scope.row.financialType"/>
          </template>
        </el-table-column>
        <el-table-column label="来源类型" align="center" prop="sourceType" width="100">
          <template #default="scope">
            <dict-tag :options="dc_financial_source_type" :value="scope.row.sourceType"/>
          </template>
        </el-table-column>
        <el-table-column label="归属城市" align="center" prop="city" width="100">
          <template #default="scope">
            <dict-tag :options="dc_sercive_city" :value="scope.row.city"/>
          </template>
        </el-table-column>
        <el-table-column label="录入人" align="center" prop="operatorId" width="100">
          <template #default="scope">
            <span>{{ getUserNameById(scope.row.operatorId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流水时间" align="center" prop="flowTime" width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.flowTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialog.visible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="FinancialStatistics" lang="ts">
import { listFinancialStatistics, getFinancialStatistics, delFinancialStatistics, addFinancialStatistics, updateFinancialStatistics } from '@/api/financialStatistics/financialStatistics';
import { FinancialStatisticsVO, FinancialStatisticsQuery, FinancialStatisticsForm } from '@/api/financialStatistics/financialStatistics/types';
import { selectAllUser } from '@/api/customerInfo/customerInfo';
import { Picture, Document } from '@element-plus/icons-vue'; 

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_financial_type, dc_financial_source_type, dc_sercive_city } = toRefs<any>(proxy?.useDict('dc_financial_type', 'dc_financial_source_type', 'dc_sercive_city'));

const financialStatisticsList = ref<FinancialStatisticsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const userList = ref([]); 

const queryFormRef = ref<ElFormInstance>();
const financialStatisticsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FinancialStatisticsForm = {
  id: undefined,
  balance: undefined,
  financialType: undefined,
  sourceType: undefined,
  contractNo: undefined,
  remark: undefined,
  city: undefined,
  createrName: undefined,
  remark1: undefined,
  remark2: undefined,
  remark3: undefined,
  flowTime: undefined,
}
const data = reactive<PageData<FinancialStatisticsForm, FinancialStatisticsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    balance: undefined,
    financialType: undefined,
    sourceType: undefined,
    contractNo: undefined,
    city: undefined,
    createrName: undefined,
    remark1: undefined,
    remark2: undefined,
    remark3: undefined,
    flowTime: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "财务项目名称不能为空", trigger: "blur" }
    ],
    balance: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    financialType: [
      { required: true, message: "财务类型不能为空", trigger: "change" }
    ],
    sourceType: [
      { required: true, message: "来源类型不能为空", trigger: "change" }
    ],
    flowTime: [
      { required: true, message: "流水时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

// 1. 发票预览相关状态
const showInvoiceViewer = ref(false);
const invoicePreviewUrl = ref<string[]>([]);

// 2. 发票上传相关状态 (用于弹窗)
const uploadDialogVisible = ref(false);
const currentUploadRow = ref<FinancialStatisticsVO | null>(null);
const tempInvoiceUrl = ref<string>(''); // 临时存储上传后的URL

/** 3. 预览发票图片 */
const handlePreviewInvoice = (url: any) => {
  if (!url) {
    proxy?.$modal.msgWarning("暂无发票凭证");
    return;
  }
  
  let urls: string[] = [];
  if (Array.isArray(url)) {
    urls = url.filter((item: any) => item);
  } else if (typeof url === 'string') {
    if (url.includes(',')) {
      urls = url.split(',').map((u: string) => u.trim()).filter((u: string) => u);
    } else {
      urls = [url];
    }
  }

  if (urls.length === 0) {
     proxy?.$modal.msgWarning("发票图片链接无效");
     return;
  }

  invoicePreviewUrl.value = urls;
  showInvoiceViewer.value = true;
};

/** 4. 关闭预览 */
const closeInvoiceViewer = () => {
  showInvoiceViewer.value = false;
  invoicePreviewUrl.value = [];
};

/** 5. 点击上传按钮 */
const handleUploadInvoice = (row: FinancialStatisticsVO) => {
  currentUploadRow.value = row;
  tempInvoiceUrl.value = ''; // 清空临时URL
  uploadDialogVisible.value = true;
};

/** 6. 提交上传 (在弹窗中点击确定) */
const submitInvoiceUpload = async () => {
  if (!currentUploadRow.value || !tempInvoiceUrl.value) {
    proxy?.$modal.msgWarning("请先选择图片");
    return;
  }

  buttonLoading.value = true;
  try {
    // ✅ 修改点：复制当前行的所有数据，而不是只构造两个字段
    // 这样能保证 financialType, sourceType 等必填字段不为空
    const updateData = {
      ...currentUploadRow.value, // 展开原有所有数据
      contractNo: tempInvoiceUrl.value // 仅覆盖发票凭证字段
    };
    
    await updateFinancialStatistics(updateData);
    
    proxy?.$modal.msgSuccess("上传成功");
    uploadDialogVisible.value = false;
    await getList(); // 刷新列表以显示新图片
  } catch (error) {
    console.error('上传失败:', error);
    proxy?.$modal.msgError("上传失败");
  } finally {
    buttonLoading.value = false;
  }
};

/** 7. 取消上传 */
const cancelInvoiceUpload = () => {
  uploadDialogVisible.value = false;
  tempInvoiceUrl.value = '';
};

// 8. 定义查看弹窗相关的响应式变量
const viewDialog = reactive({
  visible: false,
  title: ''
});

const viewStatisticsList = ref<FinancialStatisticsVO[]>([]);
const viewLoading = ref(false);

// 9. 查看按钮处理函数
const handleView = async (row: FinancialStatisticsVO) => {
  if (!row.companyName) {
    proxy?.$modal.msgWarning('该记录缺少项目名称');
    return;
  }

  viewLoading.value = true;
  viewDialog.visible = true;
  viewDialog.title = `【${row.companyName}】的财务统计记录`;

  try {
    // 调用列表接口，传入 companyName 作为筛选条件
    const res = await listFinancialStatistics({ 
      companyName: row.companyName, // ✅ 直接传入字符串，非数组格式
      pageNum: 1,
      pageSize: 100 // 获取该项目类型下较多的记录
    });
    
    viewStatisticsList.value = res.rows || [];
    
    if (viewStatisticsList.value.length === 0) {
      proxy?.$modal.msgWarning('未查询到该项目名称的其他财务记录');
    }
  } catch (error) {
    console.error('获取财务记录失败:', error);
    proxy?.$modal.msgError('获取财务记录失败');
    viewStatisticsList.value = [];
  } finally {
    viewLoading.value = false;
  }
};

//查找相关
const searchDialogVisible = ref(false)

/** 查找按钮操作 */
const handleSearch = () => {
  searchDialogVisible.value = true
}


/** 查询财务统计列表 */
const getList = async () => {
  loading.value = true;
  const res = await listFinancialStatistics(queryParams.value);
  financialStatisticsList.value = res.rows;
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
  financialStatisticsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: FinancialStatisticsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加财务统计";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: FinancialStatisticsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getFinancialStatistics(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改财务统计";
}

/** 提交按钮 */
const submitForm = () => {
  financialStatisticsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateFinancialStatistics(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addFinancialStatistics(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: FinancialStatisticsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除财务统计编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delFinancialStatistics(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('financialStatistics/financialStatistics/export', {
    ...queryParams.value
  }, `financialStatistics_${new Date().getTime()}.xlsx`)
}

const loadUserList = async () => {
  try {
    // 调用接口：system/user/list?pageNum=1&pageSize=10&deptId=1969581806504747009
    const response = await selectAllUser();
    userList.value = response;
  } catch (error) {
    proxy?.$modal.msgError('加载人员失败，请稍后重试');
    console.error('人员列表加载异常：', error);
  }
};

// 根据用户ID获取用户名
const getUserNameById = (userId: string) => {
  if (!userId) return ''
  const user = userList.value.find((item: any) => item.userId === userId)
  return user ? `${user.nickName}` : ''
}

// 选中多行之后，颜色高亮显示
const tableRowClassName = ({ row }: { row: FinancialStatisticsVO }) => {
  // 如果当前行的 id 在选中的 ids 数组中，返回一个特定的类名
  if (ids.value.includes(row.id)) {
    return 'selected-row';
  }
  return '';
};

onMounted(() => {
  loadUserList(),
  getList();
});
</script>

<style scoped>
:deep(.el-table__body .el-table__row.selected-row > td) {
  background-color: #e6f7ff !important;
}
:deep(.el-table__body .el-table__row.selected-row:hover > td) {
  background-color: #e6f7ff !important;
}
</style>
