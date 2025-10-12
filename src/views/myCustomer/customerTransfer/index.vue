<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="公司名称" prop="companyName" label-width="68px">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="contactPerson" label-width="68px">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款情况" prop="balanceStatus" label-width="68px">
              <el-input v-model="queryParams.balanceStatus" placeholder="请输入尾款情况" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="签约类型" prop="signType" label-width="68px">
              <el-input v-model="queryParams.contractType" placeholder="请输入签约类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始时间" prop="serviceStart" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceStart" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务周期开始时间" />
            </el-form-item>
            <el-form-item label="结束时间" prop="serviceEnd" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceEnd" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务周期结束时间" />
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
              v-hasPermi="['myCustomer:customerTransfer:add']">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['myCustomer:customerTransfer:edit']">修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['myCustomer:customerTransfer:remove']">删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['myCustomer:customerTransfer:export']">导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerTransferList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="公司名称" align="center" prop="companyName" width="180" show-overflow-tooltip />
        <el-table-column label="公司地址" align="center" prop="companyAddress" width="150" show-overflow-tooltip />
        <el-table-column label="员工人数" align="center" prop="employeeCount" width="80" show-overflow-tooltip />
        <el-table-column label="所属行业" align="center" prop="companyIndustry" width="100" show-overflow-tooltip />
        <el-table-column label="对接人" align="center" prop="contactPerson" width="100" show-overflow-tooltip />
        <el-table-column label="对接人电话" align="center" prop="contactInfo" width="120" show-overflow-tooltip />
        <el-table-column label="对接人职务" align="center" prop="contactPosition" width="100" show-overflow-tooltip />
        <el-table-column label="开始时间" align="center" prop="serviceStart" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceStart, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="serviceEnd" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceEnd, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" align="center" prop="actualPayment" width="100" show-overflow-tooltip />
        <el-table-column label="尾款情况" align="center" prop="balanceStatus" width="100" show-overflow-tooltip />
        <el-table-column label="签约类型" align="center" prop="contractType" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="contract_type" :value="scope.row.contractType" />
          </template>
        </el-table-column>
        <el-table-column label="常法签约" align="center" prop="serviceType" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dc_service_type" :value="scope.row.serviceType" />
          </template>
        </el-table-column>
        <el-table-column label="附赠自然人" align="center" prop="additionalPerson" width="100" show-overflow-tooltip />
        <el-table-column label="律师咨询情况" align="center" prop="lawyerConsultation" width="120" show-overflow-tooltip />
        <el-table-column label="其他费用" align="center" prop="otherFee" width="80" show-overflow-tooltip />
        <el-table-column label="财务确认" align="center" prop="financeConfirmed" width="80" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="finance_confirmed" :value="scope.row.financeConfirmed" />
          </template>
        </el-table-column>
        <el-table-column label="自然人电话" align="center" prop="additionalContact" width="120" show-overflow-tooltip />
        <el-table-column label="自然人职务" align="center" prop="additionalPosition" width="100" show-overflow-tooltip />
        <el-table-column label="自然人年龄" align="center" prop="additionalAge" width="90" show-overflow-tooltip />
        <el-table-column label="代账公司" align="center" prop="accountingCompany" width="80" show-overflow-tooltip />
        <el-table-column label="客户描述" align="center" prop="customerDescription" width="120" show-overflow-tooltip />
        <el-table-column label="是否有过法务" align="center" prop="preLegal" width="80" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="[{ label: '否', value: '0' }, { label: '是', value: '1' }]" :value="scope.row.preLegal" />
          </template>
        </el-table-column>
        <el-table-column label="合作公司名称" align="center" prop="preCompany" width="120" show-overflow-tooltip />
        <el-table-column label="不合作原因" align="center" prop="preReason" width="100" show-overflow-tooltip />
        <el-table-column label="公司纠纷及解决方式" align="center" prop="preDiscuss" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项登记" align="center" prop="pendingMatters" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项备注" align="center" prop="pendingRemark" width="130" show-overflow-tooltip />
        <el-table-column label="欠款问题登记" align="center" prop="debtDetails" width="120" />
        <el-table-column label="欠款问题备注" align="center" prop="debtRemark" width="120" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300" fixed="right">
          <template #default="scope">
            <div class="table-action-buttons">
              <el-button link type="success" v-has-roles="['FinanceCenter']" icon="Operation"
                @click="handleProcess(scope.row)">处置</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>


    <el-dialog :title="dialog.title" v-model="dialog.visible" width="90%" append-to-body>
      <div class="min-h-[800px] bg-white p-4">
        <!-- 头部区域 -->
        <div class="border-b-2 border-black p-4 flex justify-between items-start mb-2">
          <div class="flex items-center gap-2">
            <div class="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-white font-bold">DC</div>
            <div>
              <div class="font-bold text-lg">大成正服</div>
              <div class="text-xs">DACHENGZHIFU</div>
            </div>
          </div>
          <div class="text-right text-sm">让每一家公司都拥有自己的法务部</div>
        </div>

        <!-- 流转单标题 -->
        <div class="text-center py-4 border-b border-black mb-2">
          <h1 class="text-2xl font-bold">成交客户内部流转单</h1>
        </div>

        <!-- 交易日期与人员信息 -->
        <div class="border-b border-black mb-2">
          <table class="w-full border-collapse">
            <tr>
              <td class="border-r border-black p-2 w-32 bg-gray-50">交易日期：</td>
              <td class="p-2">
                <el-date-picker clearable v-model="form.transactionDate" type="date" value-format="YYYY-MM-DD"
                  placeholder="选择日期" size="small"></el-date-picker>
              </td>
              <td class="border-l border-black p-2 w-32 bg-gray-50">邀约人：</td>
              <td class="p-2">
                <el-input v-model="form.inviterId" placeholder="请输入邀约人" size="small"></el-input>
              </td>
              <td class="border-l border-black p-2 w-32 bg-gray-50">客户经理：</td>
              <td class="p-2">
                <el-input v-model="form.accountManagerId" placeholder="请输入客户经理" size="small"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <!-- 公司信息区域 -->
        <div class="border-b border-black mb-2">
          <table class="w-full border-collapse">
            <!-- 公司名称 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 w-32 bg-gray-50">公司名称：</td>
              <td colspan="7" class="p-2">
                <el-input v-model="form.companyName" placeholder="请输入公司名称" size="small"
                  :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' }]"></el-input>
              </td>
            </tr>

            <!-- 公司对接人信息 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">公司对接人<br>姓名：</td>
              <td class="border-r border-black p-2 w-40">
                <el-input v-model="form.contactPerson" placeholder="对接人姓名" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 w-32 bg-gray-50">联系方式：<br>（微信）</td>
              <td class="border-r border-black p-2 w-40">
                <el-input v-model="form.contactInfo" placeholder="联系方式" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 w-24 bg-gray-50">职务：</td>
              <td class="border-r border-black p-2 w-32">
                <el-input v-model="form.contactPosition" placeholder="职务" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 w-24 bg-gray-50">年龄：</td>
              <td class="p-2">
                <el-input v-model="form.contactAge" placeholder="年龄" size="small" type="number"></el-input>
              </td>
            </tr>

            <!-- 附赠自然人信息 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">附赠自然人：</td>
              <td class="border-r border-black p-2">
                <el-input v-model="form.additionalPerson" placeholder="自然人姓名" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">联系方式：<br>（微信）</td>
              <td class="border-r border-black p-2">
                <el-input v-model="form.additionalContact" placeholder="联系方式" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">职务：</td>
              <td class="border-r border-black p-2">
                <el-input v-model="form.additionalPosition" placeholder="职务" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">年龄：</td>
              <td class="p-2">
                <el-input v-model="form.additionalAge" placeholder="年龄" size="small" type="number"></el-input>
              </td>
            </tr>

            <!-- 公司行业与地址 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">公司所属行业：</td>
              <td colspan="3" class="border-r border-black p-2">
                <el-input v-model="form.companyIndustry" placeholder="请输入所属行业" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">公司地址：</td>
              <td colspan="3" class="p-2">
                <el-input v-model="form.companyAddress" placeholder="请输入公司地址" size="small"></el-input>
              </td>
            </tr>

            <!-- 员工人数与代账公司 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">员工人数：</td>
              <td class="border-r border-black p-2">
                <el-input v-model="form.employeeCount" placeholder="员工人数" size="small" type="number"></el-input>
              </td>
              <td colspan="2" class="border-r border-black p-2 bg-gray-50">是否有代账公司：</td>
              <td colspan="4" class="p-2">
                <el-radio-group v-model="form.accountingCompany" size="small">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不确定">不确定</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <!-- 客户性格描述 -->
            <tr>
              <td colspan="8" class="p-2 bg-gray-50">客户性格及工作习惯描述：</td>
            </tr>
            <tr>
              <td colspan="8" class="p-2 border-b border-black">
                <el-input v-model="form.customerDescription" type="textarea" placeholder="请描述客户性格及工作习惯" size="small"
                  rows="2"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <!-- 签约情况区域 -->
        <div class="text-center py-2 border-b border-black bg-gray-50 mb-2">
          <h2 class="text-lg font-bold">签约情况</h2>
        </div>
        <div class="border-b border-black mb-2">
          <table class="w-full border-collapse">
            <!-- 金额与签约类型 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 w-32 bg-gray-50">支付金额：</td>
              <td class="border-r border-black p-2 w-40">
                <el-input v-model="form.actualPayment" placeholder="实付金额" size="small" type="number"></el-input>
              </td>
              <td class="border-r border-black p-2 w-32 bg-gray-50">尾款情况：</td>
              <td class="border-r border-black p-2 flex-1">
                <el-input v-model="form.balanceStatus" placeholder="尾款情况描述" size="small"></el-input>
              </td>
              <td class="border-r border-black p-2 w-48 bg-gray-50">签约类型：</td>
              <td class="p-2">
                <el-select v-model="form.contractType" placeholder="选择类型" size="small">
                  <el-option label="常法" value="常法"></el-option>
                  <el-option label="单项" value="单项"></el-option>
                  <el-option label="律师费" value="律师费"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </td>
            </tr>

            <!-- 常法版本与服务周期 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">常法签约：</td>
              <td class="border-r border-black p-2">
                <el-radio-group v-model="form.serviceType" size="small">
                  <el-radio label="升级版">升级版</el-radio>
                  <el-radio label="标准版">标准版</el-radio>
                </el-radio-group>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">服务周期：</td>
              <td class="border-r border-black p-2">
                <div class="flex gap-2 items-center">
                  <el-date-picker clearable v-model="form.serviceStart" type="date" value-format="YYYY-MM-DD"
                    placeholder="开始日期" size="small"></el-date-picker>
                  <span class="text-gray-500">至</span>
                  <el-date-picker clearable v-model="form.serviceEnd" type="date" value-format="YYYY-MM-DD"
                    placeholder="结束日期" size="small"></el-date-picker>
                </div>
              </td>
              <td class="border-r border-black p-2 bg-gray-50">财务确<br>认状态：</td>
              <td class="p-2">
                <el-select v-model="form.financeConfirmed" placeholder="选择状态" size="small">
                  <el-option label="已确认" value="已确认"></el-option>
                  <el-option label="未确认" value="未确认"></el-option>
                </el-select>
              </td>
            </tr>

            <!-- 财务签字 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">财务签字：</td>
              <td colspan="5" class="p-2">
                <el-input v-model="form.financeSignature" placeholder="请输入财务签字信息" size="small"></el-input>
              </td>
            </tr>

            <!-- 律师咨询情况 -->
            <tr class="border-b border-black">
              <td class="border-r border-black p-2 bg-gray-50">律师咨询情况：</td>
              <td colspan="5" class="p-2">
                <el-input v-model="form.lawyerConsultation" type="textarea" placeholder="请描述咨询情况" size="small"
                  rows="2"></el-input>
              </td>
            </tr>

            <!-- 其他费用沟通 -->
            <tr>
              <td class="border-r border-black p-2 bg-gray-50">其他费用沟通：</td>
              <td colspan="5" class="p-2">
                <el-input v-model="form.otherFee" type="textarea" placeholder="请描述其他费用沟通情况" size="small"
                  rows="2"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <!-- 客户情况概述区域 -->
        <div class="text-center py-2 border-b border-black bg-gray-50 mb-2">
          <h2 class="text-lg font-bold">客户情况概述</h2>
        </div>
        <div class="border-b border-black mb-2">
          <table class="w-full border-collapse">
            <!-- 以前是否有法务 -->
            <tr class="border-b border-black">
              <td class="p-3">
                <div class="flex items-center gap-4 flex-wrap">
                  <span class="whitespace-nowrap">以前是否有过公司法务：</span>
                  <el-radio-group v-model="form.preLegal" size="small">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                  <span class="ml-4 whitespace-nowrap">合作公司名称：</span>
                  <el-input v-model="form.preCompany" placeholder="合作公司名称" size="small" style="width: 200px"></el-input>
                  <span class="ml-4 whitespace-nowrap">不合作原因：</span>
                  <el-input v-model="form.preReason" placeholder="不合作原因" size="small"
                    style="flex: 1; min-width: 200px"></el-input>
                </div>
              </td>
            </tr>

            <!-- 以前纠纷及解决方式 -->
            <tr class="border-b border-black">
              <td class="p-3">
                <div class="flex items-start gap-2">
                  <span class="whitespace-nowrap">公司以前出现过的纠纷及解决方式：</span>
                  <el-input v-model="form.preDiscuss" type="textarea" placeholder="请详细描述纠纷及解决方式" size="small" rows="2"
                    style="flex: 1"></el-input>
                </div>
              </td>
            </tr>

            <!-- 待处理事项登记 -->
            <tr class="border-b border-black">
              <td class="p-3">
                <div class="leading-relaxed">
                  <span>待处理事项登记：</span>
                  <el-input v-model="form.pendingRemark" type="textarea" placeholder="劳资纠纷、合同纠纷、借贷纠纷等" size="small"
                    rows="2" style="width: 100%; margin-top: 8px"></el-input>
                  <!-- 待处理事项列表可根据需要添加 -->
                </div>
              </td>
            </tr>

            <!-- 欠款问题登记 -->
            <tr>
              <td class="p-3">
                <div class="leading-relaxed">
                  <span>欠款问题请详细登记：</span>
                  <el-input v-model="form.debtRemark" type="textarea" placeholder="相关主体、已知债务人信息、标的额等" size="small"
                    rows="2" style="width: 100%; margin-top: 8px"></el-input>
                  <!-- 欠款详情列表可根据需要添加 -->
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- 备注大文本区域 -->
        <div class="min-h-[150px] border-b border-black p-4 mb-4">
          <div class="font-medium mb-2">其他备注信息：</div>
          <el-input v-model="form.remark" type="textarea" placeholder="请输入其他需要补充的备注信息" size="small" rows="4"
            style="width: 100%"></el-input>
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="auditDialogVisible" title="审核" width="500px" append-to-body>
      <el-form :model="auditForm" label-width="100px">
        <!-- 审核状态 -->
        <el-form-item label="审核">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">未通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 上传签名：仅在通过时显示 -->
        <el-form-item v-if="auditForm.auditStatus === '1'" label="电子签名">
          <fileUpload v-model="localFileList" :limit="1" :file-size="2" :file-type="['png', 'jpg', 'jpeg']"
            :is-show-tip="false" />
          <div v-if="localFileList.length > 0 && localFileList[0].url" style="margin-top: 8px;">
            <img :src="localFileList[0].url" class="signature-preview" />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: right;">
          <el-button @click="auditCancel" :disabled="submitting">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submitAudit">确定</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="CustomerTransfer" lang="ts">
import { listUser } from '@/api/customerInfo/customerInfo';
import {
  addCustomerTransfer,
  audit,
  delCustomerTransfer,
  getCustomerTransfer,
  listCustomerTransfer,
  updateCustomerTransfer
} from '@/api/myCustomer/customerTransfer';
import { CustomerTransferForm, CustomerTransferQuery, CustomerTransferVO } from '@/api/myCustomer/customerTransfer/types';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerTransferList = ref<CustomerTransferVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const userList = ref([]); // 用户列表
const {
  contract_type,
  dc_service_type,
  finance_confirmed
} = toRefs<any>(proxy?.useDict('contract_type', 'dc_service_type', 'finance_confirmed'));


const queryFormRef = ref<ElFormInstance>();
const customerTransferFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerTransferForm = {
  id: undefined,
  companyName: undefined,
  contactPerson: undefined,
  contactInfo: undefined,
  contactPosition: undefined,
  contactAge: undefined,
  additionalPerson: undefined,
  additionalContact: undefined,
  additionalPosition: undefined,
  additionalAge: undefined,
  companyIndustry: undefined,
  companyAddress: undefined,
  employeeCount: undefined,
  accountingCompany: undefined,
  customerDescription: undefined,
  actualPayment: undefined,
  balanceStatus: undefined,
  contractType: undefined,
  serviceType: undefined,
  serviceStart: undefined,
  serviceEnd: undefined,
  lawyerConsultation: undefined,
  otherFee: undefined,
  financeConfirmed: undefined,
  financeSignature: undefined,
  preLegal: undefined,
  preCompany: undefined,
  preReason: undefined,
  preDiscuss: undefined,
  pendingMatters: [],
  pendingRemark: undefined,
  debtDetails: [],
  debtRemark: undefined,
  accountManagerId: undefined,
  inviterId: undefined,
  remark: undefined,
}
const data = reactive<PageData<CustomerTransferForm, CustomerTransferQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyName: undefined,
    contactPerson: undefined,
    contactInfo: undefined,
    contactPosition: undefined,
    contactAge: undefined,
    additionalPerson: undefined,
    additionalContact: undefined,
    additionalPosition: undefined,
    additionalAge: undefined,
    companyIndustry: undefined,
    companyAddress: undefined,
    employeeCount: undefined,
    accountingCompany: undefined,
    customerDescription: undefined,
    actualPayment: undefined,
    balanceStatus: undefined,
    contractType: undefined,
    serviceType: undefined,
    serviceStart: undefined,
    serviceEnd: undefined,
    lawyerConsultation: undefined,
    otherFee: undefined,
    financeConfirmed: undefined,

    params: {}
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "公司名称不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "公司对接人不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户信息录入列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomerTransfer(queryParams.value);
  customerTransferList.value = res.rows;
  total.value = res.total;
  loading.value = false;
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

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  customerTransferFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerTransferVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户信息录入";
}

/** 修改按钮操作 */
/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerTransferVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerTransfer(_id);
  Object.assign(form.value, res.data);
  // 添加空值检查
  form.value.pendingMatters = form.value.pendingMatters ? form.value.pendingMatters.split(",") : [];
  form.value.debtDetails = form.value.debtDetails ? form.value.debtDetails.split(",") : [];
  dialog.visible = true;
  dialog.title = "修改客户信息录入";
}
// 弹窗显示
const auditDialogVisible = ref(false)
// 当前行
const currentRow = ref<any>(null)
// 提交状态
const submitting = ref(false)

// 上传相关
const localFileList = ref([])
const auditForm = ref({ auditStatus: '1', pictureUrl: '' })
// 打开审核弹窗
const handleProcess = (row?: any) => {
  currentRow.value = row || null
  localFileList.value = []
  auditDialogVisible.value = true
}

// 点击取消
function auditCancel() {
  auditDialogVisible.value = false
}

// 提交审核
async function submitAudit() {
  if (submitting.value) return
  console.log(localFileList.value[0])
  // 如果审核通过，必须上传签名图片
  if (auditForm.value.auditStatus === '1') {
    if (localFileList.value.length === 0 || !(localFileList.value[0].raw instanceof File)) {
      ElMessage.warning('请先上传签名图片（必须是文件）')
      return
    }
  }

  submitting.value = true
  try {
    let pictureFile: File | string = ''
    if (auditForm.value.auditStatus === '1') {
      pictureFile = localFileList.value[0].raw
    }

    const res = await audit(
      currentRow.value?.id || '',
      auditForm.value.auditStatus,
      pictureFile
    )

    if (res && res.code === 200) {
      ElMessage.success('操作成功')
      auditDialogVisible.value = false
      // 刷新列表
      // emit('success') 或 getList()
    } else {
      ElMessage.error(res?.msg || '操作失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('请求出错，请稍后再试')
  } finally {
    submitting.value = false
  }
}

/** 提交按钮 */
const submitForm = () => {
  customerTransferFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.pendingMatters = form.value.pendingMatters.join(",");
      form.value.debtDetails = form.value.debtDetails.join(",");
      if (form.value.id) {
        await updateCustomerTransfer(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCustomerTransfer(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}
/** 删除按钮操作 */
const handleDelete = async (row?: CustomerTransferVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户信息录入编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomerTransfer(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('myCustomer/customerTransfer/export', {
    ...queryParams.value
  }, `customerTransfer_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
<<<<<<< HEAD

=======
  loadUserList();
>>>>>>> 114b17ed90f540c4367ac5ae62773c95fec67ce2
  getList();
});
</script>
<style scoped>
.signature-preview {
  width: 160px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 4px;
  background: #fff;
}

.transfer-form-card {
  border-radius: 10px;
  padding: 28px 32px;
  background: #f9f9fb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* 分组容器：纸质表格区块感 */
.form-group {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 28px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}

/* 分组标题：更清晰的层级感 */
.group-title {
  font-size: 15px;
  font-weight: 600;
  color: #0066cc;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff33;
  letter-spacing: 0.5px;
}

/* 表单整体字体 */
.el-form {
  font-size: 14px;
  color: #333;
}

/* 输入框：长度统一，字体略大，纸质感边框 */
.el-input,
.el-textarea {
  width: 100%;
  font-size: 14px;
}

.el-input__inner,
.el-textarea__inner {
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  transition: all 0.2s ease;
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: #1890ff;
  box-shadow: 0 0 3px rgba(24, 144, 255, 0.4);
}

/* 表单项：增加行距 */
.el-form-item {
  margin-bottom: 14px !important;
}

/* 每行间距增加 */
.el-row {
  margin-bottom: 10px;
}

/* 输入区域更均匀地排列（纸质表格感） */
.el-col {
  padding-right: 12px;
}

/* 调整日期选择器显示宽度 */
.el-date-editor {
  width: 100%;
}

/* 底部按钮区：居中且更大间距 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e0e0e0;
  margin-top: 10px;
}

/* 按钮样式柔和一点 */
.el-button {
  min-width: 100px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
}

.table-action-buttons {
  display: flex;
  justify-content: center;
  gap: 2px;
  /* 按钮间距 */
  flex-wrap: nowrap;
}

.table-action-buttons .el-button {
  font-size: 13px;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
