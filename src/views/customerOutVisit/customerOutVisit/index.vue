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

            <el-form-item label="法务支持姓名" prop="legalSupportName">
              <el-input v-model="queryParams.legalSupportName" placeholder="请输入法务支持姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="出访时间" prop="visitTime">
              <el-date-picker clearable v-model="queryParams.visitTime" type="date" placeholder="请选择出访时间" />
            </el-form-item>
            <el-form-item label="下次出访时间" prop="nextVisitTime">
              <el-date-picker clearable v-model="queryParams.nextVisitTime" type="date" placeholder="请选择下次出访时间" />
            </el-form-item>
            <el-form-item label="是否本月第一次出访" prop="isFirstVisit">
              <el-select v-model="queryParams.isFirstVisit" placeholder="请选择是否本月第一次出访" clearable>
                <el-option v-for="dict in dc_true_or_false" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否计入外勤项数" prop="isOutCount">
              <el-select v-model="queryParams.isOutCount" placeholder="请选择是否计入外勤项数" clearable>
                <el-option v-for="dict in dc_true_or_false" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="面访地点" prop="visitAddress">
              <el-input v-model="queryParams.visitAddress" placeholder="请输入面访地点" clearable @keyup.enter="handleQuery" />
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
              v-hasPermi="['customerOutVisit:customerOutVisit:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['customerOutVisit:customerOutVisit:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['customerOutVisit:customerOutVisit:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['customerOutVisit:customerOutVisit:export']">导出</el-button>
          </el-col>
        </div>
        <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['customerOutVisit:customerOutVisit:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['customerOutVisit:customerOutVisit:refresh']">刷新
            </el-button>
          </el-col>
        </div>
          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerOutVisitList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
        <!-- <el-table-column label="客户id" align="center" prop="customerId" /> -->
        <el-table-column label="客户名称" align="center" prop="customerName" width="160" show-overflow-tooltip />
        <!-- <el-table-column label="法务支持id" align="center" prop="legalSupportId" /> -->
        <el-table-column label="法务支持" align="center" prop="legalSupportName" width="100" />
        <el-table-column label="出访时间" align="center" prop="visitTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.visitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出访内容" align="center" prop="visitPurpose" width="160" show-overflow-tooltip />
        <el-table-column label="下次出访时间" align="center" prop="nextVisitTime" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.nextVisitTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否本月第一次出访" align="center" prop="isFirstVisit" width="80">
          <template #header>
            <span style="font-size: 11px; font-weight: bold;">本月第一次出访</span>
          </template>
          <template #default="scope">
            <dict-tag :options="dc_true_or_false" :value="scope.row.isFirstVisit" />
          </template>
        </el-table-column>
        <el-table-column label="是否计入外勤项数" align="center" prop="isOutCount" width="80">
          <template #header>
            <span style="font-size: 11px; font-weight: bold;">计入外勤项数</span>
          </template>
          <template #default="scope">
            <dict-tag :options="dc_true_or_false" :value="scope.row.isOutCount" />
          </template>
        </el-table-column>
        <el-table-column label="出访定位" align="center" prop="visitAddress" show-overflow-tooltip />
        <el-table-column label="出访照片" align="center" prop="placePic1Url" width="100" show-overflow-tooltip>
          <template #default="scope">
            <image-preview :src="scope.row.placePic1Url" :width="20" :height="20" />
          </template>
        </el-table-column>
        <el-table-column label="出访记录表" align="center" prop="outRecord" width="100" show-overflow-tooltip>
          <template #default="scope">
            <div class="contract-cell">
              <el-button v-if="scope.row.outRecord" link type="primary" icon="download"
                @click="handleViewContract(scope.row)">
                下载附件
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip width="200px"
          fixed="right">
          <template #default="scope">
            <!--修改按钮-->
            <el-tooltip content="修改">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['customerOutVisit:customerOutVisit:edit']">修改</el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip content="删除">
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['customerOutVisit:customerOutVisit:remove']">删除</el-button>
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

            <!-- <el-form-item label="法务支持姓名" prop="legalSupportName">
              <el-input v-model="queryParams.legalSupportName" placeholder="请输入法务支持姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="出访时间" prop="visitTime">
              <el-date-picker clearable v-model="queryParams.visitTime" type="date" placeholder="请选择出访时间" />
            </el-form-item>
            <el-form-item label="下次出访时间" prop="nextVisitTime">
              <el-date-picker clearable v-model="queryParams.nextVisitTime" type="date" placeholder="请选择下次出访时间" />
            </el-form-item>
            <el-form-item label="是否本月第一次出访" prop="isFirstVisit">
              <el-select v-model="queryParams.isFirstVisit" placeholder="请选择是否本月第一次出访" clearable>
                <el-option v-for="dict in dc_true_or_false" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否计入外勤项数" prop="isOutCount">
              <el-select v-model="queryParams.isOutCount" placeholder="请选择是否计入外勤项数" clearable>
                <el-option v-for="dict in dc_true_or_false" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="面访地点" prop="visitAddress">
              <el-input v-model="queryParams.visitAddress" placeholder="请输入面访地点" clearable @keyup.enter="handleQuery" />
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
  <!-- </template> -->
</el-dialog>


    <!-- 添加或修改客户出访记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body draggable>
      <el-form ref="customerOutVisitFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" filterable>
            <el-option v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
              :value="item.customer_id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="法务支持id" prop="legalSupportId">
          <el-input v-model="form.legalSupportId" placeholder="请输入法务支持id" />
        </el-form-item>
        <el-form-item label="法务支持姓名" prop="legalSupportName">
          <el-input v-model="form.legalSupportName" placeholder="请输入法务支持姓名" />
        </el-form-item> -->
        <el-form-item label="法务支持" prop="legalSupport" >
          <el-select filterable v-model="form.legalSupportId" placeholder="请选择法务支持人员" clearable style="width: 100%;"
            @change="handleLegalSupportChange">
            <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
              :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出访时间" prop="visitTime">
          <el-date-picker clearable v-model="form.visitTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择出访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次出访时间" prop="nextVisitTime">
          <el-date-picker clearable v-model="form.nextVisitTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下次出访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面访目的" prop="visitPurpose">
          <el-input v-model="form.visitPurpose" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否本月第一次出访" prop="isFirstVisit">
          <el-radio-group v-model="form.isFirstVisit">
            <el-radio v-for="dict in dc_true_or_false" :key="dict.value" :value="parseInt(dict.value)">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否计入外勤项数" prop="isOutCount">
          <el-radio-group v-model="form.isOutCount">
            <el-radio v-for="dict in dc_true_or_false" :key="dict.value" :value="parseInt(dict.value)">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户地点照片" prop="placePic1">
          <image-upload v-model="form.placePic1" />
        </el-form-item>
        <el-form-item label="面访记录附件" prop="outRecord">
          <file-upload :limit="1" v-model="uploadFile" />
        </el-form-item>
        <el-form-item label="面访地点" prop="visitAddress">
          <el-input v-model="form.visitAddress" type="textarea" placeholder="请输入内容" />
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

<script setup name="CustomerOutVisit" lang="ts">
import { getCustomerByUserId } from '@/api/common';
import { listLawyerSupport } from '@/api/customerInfo/customerInfo';
import { listCustomerOutVisit, getCustomerOutVisit, delCustomerOutVisit, addCustomerOutVisit, updateCustomerOutVisit } from '@/api/customerOutVisit/customerOutVisit';
import { CustomerOutVisitVO, CustomerOutVisitQuery, CustomerOutVisitForm } from '@/api/customerOutVisit/customerOutVisit/types';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_true_or_false } = toRefs<any>(proxy?.useDict('dc_true_or_false'));

const customerOutVisitList = ref<CustomerOutVisitVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const customerList = ref<any[]>([]);
const uploadFile = ref();

const queryFormRef = ref<ElFormInstance>();
const customerOutVisitFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerOutVisitForm = {
  customerId: undefined,
  customerName: undefined,
  legalSupportId: undefined,
  legalSupportName: undefined,
  visitTime: undefined,
  nextVisitTime: undefined,
  visitPurpose: undefined,
  isFirstVisit: undefined,
  isOutCount: undefined,
  placePic1: undefined,
  placePic2: undefined,
  placePic3: undefined,
  placePic4: undefined,
  outRecord: undefined,
  visitAddress: undefined,
}
const data = reactive<PageData<CustomerOutVisitForm, CustomerOutVisitQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    customerId: undefined,
    customerName: undefined,
    legalSupportId: undefined,
    legalSupportName: undefined,
    visitTime: undefined,
    nextVisitTime: undefined,
    isFirstVisit: undefined,
    isOutCount: undefined,
    visitAddress: undefined,
    params: {
    }
  },
  rules: {
    customerId: [
      { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
    legalSupportId: [
      { required: true, message: "法务支持id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户出访记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerOutVisit(queryParams.value);
  customerOutVisitList.value = res.rows;
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
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  customerOutVisitFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerOutVisitVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  uploadFile.value = null;
  dialog.visible = true;
  dialog.title = "添加客户出访记录";

  try {

    const pos = await getCurrentPosition();
    console.log(pos);

    const address = await reverseGeocode(pos.lat, pos.lng);
    console.log(address)
    form.value.visitAddress = address;
    console.log(address)
    proxy?.$modal.msgSuccess('已自动获取当前位置');
  } catch (error) {
    console.warn('获取定位失败:', error);
    proxy?.$modal.msgWarning('无法获取当前位置');
  }
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerOutVisitVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerOutVisit(_id);
  Object.assign(form.value, res.data);
  uploadFile.value = [];
  dialog.visible = true;
  dialog.title = "修改客户出访记录";
}

/** 提交按钮 */
const submitForm = () => {
  customerOutVisitFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (uploadFile.value) {
        form.value.outRecord = uploadFile.value[0].ossId;
      }
      form.value.customerName = getCustomerNameById(form.value.customerId);
      if (form.value.id) {
        await updateCustomerOutVisit(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerOutVisit(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
} 

/** 查找按钮操作 */
const handleSearch = () => {
  searchDialogVisible.value = true
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerOutVisitVO) => {
  const customerName = row?.customerName;
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户出访 编号为:"' + _ids + '",客户名称为:"'+ customerName +'"的数据项？').finally(() => loading.value = false);
  await delCustomerOutVisit(_ids);
  proxy?.$modal.msgSuccess("删除成功!");
  await getList();
}

const loadCustomerList = async () => {
  try {
    const res = await getCustomerByUserId();
    customerList.value = res.data;
    // console.log(customerList.value)
  } catch (error) {
    console.error('获取客户列表失败:', error);
    proxy?.$modal.msgError('获取客户列表失败');
  }
}

const getCustomerNameById = (customerId: string | number) => {
  if (!customerId) return '';
  let customer = customerList.value.find(item => item.transfer_id === customerId);
  if (!customer) {
    customer = customerList.value.find(item => item.customer_id === customerId);
  }
  return customer ? customer.customer_realName : '';
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

const handleViewContract = (row: CustomerOutVisitVO) => {
  if (row.outRecord) {
    proxy?.$download.oss(row.outRecord);
  } else {
    proxy?.$modal.msgWarning(`无合同文件可下载`);
  }
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('customerOutVisit/customerOutVisit/export', {
    ...queryParams.value
  }, `customerOutVisit_${new Date().getTime()}.xlsx`)
}

/** 获取当前位置经纬度 */
const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('当前浏览器不支持地理定位'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('用户拒绝授权获取位置'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('位置信息不可用'));
            break;
          case error.TIMEOUT:
            reject(new Error('获取位置超时'));
            break;
          default:
            reject(new Error('未知错误'));
        }
      }
    );
  });
};

/** 根据经纬度调用高德API获取详细地址 */
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const key = 'a86984fb0449d5fdffd6e78d4544ca2d'; // 替换为你自己的Key
  const url = `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=${key}&radius=1000&extensions=all`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === '1' && data.regeocode) {
      return data.regeocode.formatted_address;
    } else {
      throw new Error('逆地理编码失败');
    }
  } catch (err) {
    console.error('逆地理编码失败:', err);
    throw err;
  }
};
// /** 判断是否在微信环境 */
// const isWeixin = () => /micromessenger/i.test(navigator.userAgent);

// /** 微信定位（依赖微信JS-SDK） */
// const getWeixinPosition = (): Promise<{ lat: number; lng: number }> => {
//   return new Promise((resolve, reject) => {
//     if (!window.wx) {
//       reject(new Error('未检测到微信 JS-SDK，请先引入 https://res.wx.qq.com/open/js/jweixin-1.6.0.js'));
//       return;
//     }

//     window.wx.ready(() => {
//       window.wx.getLocation({
//         type: 'gcj02', // 微信返回GCJ-02坐标
//         success: (res: any) => {
//           resolve({ lat: res.latitude, lng: res.longitude });
//         },
//         fail: (err: any) => {
//           reject(new Error('微信定位失败: ' + JSON.stringify(err)));
//         }
//       });
//     });

//     window.wx.error((err: any) => {
//       reject(new Error('微信SDK验证失败: ' + JSON.stringify(err)));
//     });
//   });
// };

// /** 通用获取定位函数：微信优先，其次浏览器 */
// const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
//   return new Promise(async (resolve, reject) => {
//     if (isWeixin()) {
//       // 微信环境
//       try {
//         const pos = await getWeixinPosition();
//         return resolve(pos);
//       } catch (err) {
//         console.warn('微信定位失败，尝试浏览器定位...', err);
//       }
//     }

//     // 浏览器定位（需 HTTPS 或 localhost）
//     if (!navigator.geolocation) {
//       return reject(new Error('当前浏览器不支持地理定位'));
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         });
//       },
//       (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             reject(new Error('用户拒绝授权获取位置'));
//             break;
//           case error.POSITION_UNAVAILABLE:
//             reject(new Error('位置信息不可用'));
//             break;
//           case error.TIMEOUT:
//             reject(new Error('获取位置超时'));
//             break;
//           default:
//             reject(new Error('未知错误'));
//         }
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   });
// };

// /** 高德逆地理编码 */
// const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//   const key = 'a86984fb0449d5fdffd6e78d4544ca2d'; // 请替换为你自己的高德Web服务Key
//   const url = `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=${key}&radius=1000&extensions=all`;

//   try {
//     const res = await fetch(url);
//     const data = await res.json();
//     if (data.status === '1' && data.regeocode) {
//       return data.regeocode.formatted_address;
//     } else {
//       throw new Error('逆地理编码失败');
//     }
//   } catch (err) {
//     console.error('逆地理编码失败:', err);
//     throw err;
//   }
// };
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
