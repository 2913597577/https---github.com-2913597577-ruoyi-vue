<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="财务确认" prop="financeConfirmed" label-width="68px">
              <el-select v-model="queryParams.financeConfirmed" placeholder="请选择财务确认状态" clearable
                @keyup.enter="handleQuery">
                <el-option v-for="item in financeStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName" label-width="68px">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="contactPerson" label-width="68px">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="尾款金额" prop="balanceStatus" label-width="68px">
              <el-input v-model="queryParams.balanceStatus" placeholder="尾款金额" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="签约类型" prop="signType" label-width="68px">
              <el-input v-model="queryParams.contractType" placeholder="请输入签约类型" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
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
        <el-table-column label="财务确认" align="center" prop="financeConfirmed" width="80" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="finance_confirmed" :value="scope.row.financeConfirmed ?? ''" />
          </template>
        </el-table-column>
         <el-table-column label="审核人" align="center" prop="auditUserName" width="100" show-overflow-tooltip />
          <el-table-column label="审核时间" align="center" prop="auditTime" width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同操作" align="center" prop="contractOssId" width="100" show-overflow-tooltip>
          <template #default="scope">
            <div class="contract-cell">
              <el-button v-if="scope.row.contractOssId" class="contract-code" @click="handleViewContract(scope.row)"
                link type="danger" icon="Download">合同下载</el-button>
              <el-button v-if="!scope.row.contractOssId" link type="primary" icon="Upload"
                @click="handleUpload(scope.row)">
                上传合同
              </el-button>
            </div>
          </template>

          <!-- v-hasPermi="['myCustomer:customerTransfer:contractDownload']"

          v-hasPermi="['myCustomer:customerTransfer:contractUpload']" -->
        </el-table-column>
        <el-table-column label="录入人" align="center" prop="inviterId" width="100" show-overflow-tooltip >
          <template #default="scope">
            <span>{{ getUserNameById(scope.row.inviterId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center" prop="companyName" width="180" show-overflow-tooltip />
        <el-table-column label="公司地址" align="center" prop="companyAddress" width="150" show-overflow-tooltip />
        <el-table-column label="员工人数" align="center" prop="employeeCount" width="80" show-overflow-tooltip />
        <el-table-column label="所属行业" align="center" prop="companyIndustry" width="100" show-overflow-tooltip />
        <el-table-column label="对接人" align="center" prop="contactPerson" width="100" show-overflow-tooltip />
        <el-table-column label="对接人电话" align="center" prop="contactInfo" width="120" show-overflow-tooltip />
        <el-table-column label="对接人职务" align="center" prop="contactPosition" width="100" show-overflow-tooltip />
        <el-table-column label="开始时间" align="center" prop="serviceStart" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceStart, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="serviceEnd" width="100">
          <template #default="scope">
            <span>{{ parseTime(scope.row.serviceEnd, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" align="center" prop="actualPayment" width="100" show-overflow-tooltip />
        <el-table-column label="尾款金额" align="center" prop="balanceStatus" width="100" show-overflow-tooltip />
        <el-table-column label="尾款支付条件" align="center" prop="balancePayType" width="100" show-overflow-tooltip />
        <!-- <el-table-column label="签约类型" align="center" prop="contractType" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="contract_type" :value="scope.row.contractType ?? ''" />
          </template>
        </el-table-column> -->
        <el-table-column label="套餐类型" align="center" prop="serviceType" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="combo_type" :value="scope.row.serviceType ?? ''" />
          </template>
        </el-table-column>
<<<<<<< HEAD
        <el-table-column label="客户服务城市" align="center" prop="customerCity" width="140" show-overflow-tooltip>
=======
        <el-table-column label="客户服务城市" align="center" prop="customerCity" width="100" show-overflow-tooltip >
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
          <template #default="scope">
            <dict-tag :options="dc_sercive_city" :value="scope.row.customerCity ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="附赠自然人" align="center" prop="additionalPerson" width="100" show-overflow-tooltip />
        <el-table-column label="律师咨询情况" align="center" prop="lawyerConsultation" width="100" show-overflow-tooltip />
        <el-table-column label="其他费用" align="center" prop="otherFee" width="80" show-overflow-tooltip />

        <el-table-column label="自然人电话" align="center" prop="additionalContact" width="100" show-overflow-tooltip />
        <el-table-column label="自然人职务" align="center" prop="additionalPosition" width="100" show-overflow-tooltip />
        <el-table-column label="自然人年龄" align="center" prop="additionalAge" width="90" show-overflow-tooltip />
        <el-table-column label="代账公司" align="center" prop="accountingCompany" width="80" show-overflow-tooltip>
        <template #default="scope">
            <dict-tag :options="dc_accounting_company" :value="scope.row.accountingCompany ?? ''" />
          </template>
         </el-table-column>
        <el-table-column label="客户描述" align="center" prop="customerDescription" width="100" show-overflow-tooltip />
        <el-table-column label="是否有过法务" align="center" prop="preLegal" width="80" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dc_legal_affairs" :value="scope.row.preLegal ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="合作公司名称" align="center" prop="preCompany" width="100" show-overflow-tooltip />
        <el-table-column label="不合作原因" align="center" prop="preReason" width="100" show-overflow-tooltip />
        <el-table-column label="公司纠纷及解决方式" align="center" prop="preDiscuss" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项登记" align="center" prop="pendingMatters" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项备注" align="center" prop="pendingRemark" width="200" show-overflow-tooltip />
        <el-table-column label="欠款问题登记" align="center" prop="debtDetails" width="120" />
        <el-table-column label="欠款问题备注" align="center" prop="debtRemark" width="120" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="operation-column" show-overflow-tooltip width="280"
        fixed="right">
          <template #default="scope">
            <!-- <div class="table-action-buttons"> -->
              <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
              <el-button link type="success" v-has-roles="['FinanceCenter']" icon="Operation"
                @click="handleProcess(scope.row)">处置</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>


    <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%" append-to-body
      :custom-class="'native-style-dialog'">
      <div class="min-h-[800px] bg-white p-4">
        <el-form ref="customerTransferFormRef" :model="form" :rules="rules" label-width="0" hide-required-asterisk>
          <!-- 头部区域 -->
          <div class="border-b-2 border-black p-4 flex justify-between items-start mb-1">
            <div class="flex items-center gap-2">
              <img src="@/assets/images/logo.jpg" alt="logo" class="w-30 h-8" />
            </div>
            <div class="text-right text-sm text-gray-600">
              <div>让每一家公司都拥有自己的法务部</div>
            </div>
          </div>

          <!-- 流转单标题 -->
          <div class="text-center py-3 border-b border-black mb-1 mt-0">
            <h1 class="text-2xl font-bold text-blue-700">成交客户内部流转单</h1>
          </div>

          <!-- 交易日期与人员信息 -->
          <div class="border-b border-black mb-1 mt-0">
            <table class="w-full border-collapse">
              <tr>
                <td class="border-r border-black p-2 w-32 bg-blue-50">交易日期：<span class="text-red-500">*</span></td>
                <td class="p-2 w-32">
                  <input type="date"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <!-- <td class="border-l border-black p-2 w-32 bg-blue-50">邀约人：<span class="text-red-500">*</span></td>
                <td class="p-2 w-64">
                  <el-select v-model="form.inviterId" placeholder="请选择邀约人" filterable>
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
                </td>
                <td class="border-l border-black p-2 w-32 bg-blue-50">客户经理：<span class="text-red-500">*</span></td>
                <td class="p-2">
                  <el-select v-model="form.accountManagerId" placeholder="请选择客户经理" filterable>
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
                </td> -->
                <td class="border-l border-black p-2 w-32 bg-blue-50">客户归属城市：<span class="text-red-500">*</span></td>
                <td class="p-2">
                  <el-select v-model="form.customerCity" placeholder="请选择服务城市" style="width: 120px">
                    <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                      :value="dict.value"></el-option>
                  </el-select>
                </td>
<<<<<<< HEAD
                <td class="border-l border-black p-2 w-24 bg-blue-50" style="width: 100px">合同编号：<span
                    class="text-red-500">*</span></td>
                <input type="text" v-model="form.contractCode" placeholder="请输入合同编号" style="width: 410px;"
                  class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
=======
                <td class="border-l border-black p-2 w-24 bg-blue-50" style="width: 100px">合同编号：<span class="text-red-500">*</span> </td>
                <td class="p-2">
                   <input type="text" v-model="form.contractCode" placeholder="请输入合同编号" style="width: 180px;"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>

                    <!-- <input type="text" v-model="form.contractCode" placeholder="请输入录入人姓名" style="width: 140px;"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"></input> -->
                    <!-- <td class="border-l border-black p-2 w-32 bg-blue-50" style="width: 80px">录入人：<span class="text-red-500">*</span></td>
                    <td class="p-2">
                  <el-select v-model="form.inviterId" placeholder="请选择录入人" filterable>
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
                    </td> -->
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
              </tr>
            </table>
          </div>

          <!-- 公司对接人/自然人信息 -->
          <div class="border-b border-black mb-1 mt-0">
            <table class="w-full border-collapse">
              <!-- 公司名称（必填） -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">公司名称：<span class="text-red-500">*</span></td>
                <td colspan="7" class="p-2">
                  <input type="text" v-model="form.companyName" placeholder="请输入公司名称（必填）"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                    required>
                </td>
              </tr>
              <!-- 公司对接人信息 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">公司对接人<br>姓名：<span class="text-red-500">*</span>
                </td>
                <td class="border-r border-black p-2 w-40">
                  <el-form-item prop="contactPerson" style="margin-bottom: 0;" :show-message="false"
                    hide-required-asterisk>
                    <el-input v-model="form.contactPerson" placeholder="对接人姓名" />
                  </el-form-item>
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">联系方式：<br>（微信）<span class="text-red-500">*</span>
                </td>
                <td class="border-r border-black p-2 w-40">
                  <input type="text" v-model="form.contactInfo" placeholder="联系方式"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-24 bg-blue-50">职务：</td>
                <td class="border-r border-black p-2 w-32">
                  <input type="text" v-model="form.contactPosition" placeholder="职务"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-24 bg-blue-50">年龄：</td>
                <td class="p-2">
                  <input type="number" v-model="form.contactAge" placeholder="年龄"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
              </tr>

              <!-- 附赠自然人信息 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">附赠自然人：</td>
                <td class="border-r border-black p-2 w-40">
                  <input type="text" v-model="form.additionalPerson" placeholder="自然人姓名"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">联系方式：<br>（微信）</td>
                <td class="border-r border-black p-2 w-40">
                  <input type="text" v-model="form.additionalContact" placeholder="联系方式"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-24 bg-blue-50">职务：</td>
                <td class="border-r border-black p-2 w-32">
                  <input type="text" v-model="form.additionalPosition" placeholder="职务"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-24 bg-blue-50">年龄：</td>
                <td class="p-2">
                  <input type="number" v-model="form.additionalAge" placeholder="年龄"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
              </tr>

              <!-- 公司行业与地址 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">公司所属行业：</td>
                <td colspan="3" class="border-r border-black p-2">
                  <input type="text" v-model="form.companyIndustry" placeholder="请输入所属行业"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">公司地址：</td>
                <td colspan="3" class="p-2">
                  <input type="text" v-model="form.companyAddress" placeholder="请输入公司地址"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
              </tr>

              <!-- 员工人数与代账公司 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">员工人数：</td>
                <td class="border-r border-black p-2 w-40">
                  <input type="number" v-model="form.employeeCount" placeholder="员工人数"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td colspan="2" class="border-r border-black p-2 w-64 bg-blue-50">是否有代账公司：</td>
                <td colspan="4" class="p-2">
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-1 cursor-pointer text-gray-700">
                      <input type="radio" name="accountingCompany" value="0" v-model="form.accountingCompany"
                        class="w-4 h-4 cursor-pointer accent-blue-500">
                      <span>是</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer text-gray-700">
                      <input type="radio" name="accountingCompany" value="1" v-model="form.accountingCompany"
                        class="w-4 h-4 cursor-pointer accent-blue-500">
                      <span>否</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer text-gray-700">
                      <input type="radio" name="accountingCompany" value="2" v-model="form.accountingCompany"
                        class="w-4 h-4 cursor-pointer accent-blue-500">
                      <span>不确定</span>
                    </label>
                  </div>
                </td>
              </tr>

              <!-- 客户性格描述 -->
              <tr>
                <td colspan="8" class="p-2 bg-blue-50">客户性格及工作习惯描述：</td>
              </tr>
              <tr>
                <td colspan="8" class="p-2 border-b border-black">
                  <textarea v-model="form.customerDescription" placeholder="请描述客户性格及工作习惯"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                    rows="2"></textarea>
                </td>
              </tr>
            </table>
          </div>

          <!-- 签约情况区域 -->
          <div class="text-center py-2 border-b border-black bg-blue-100 mb-1 mt-0">
            <h2 class="text-lg font-bold text-blue-800">签约情况</h2>
          </div>
          <div class="border-b border-black mb-1 mt-0">
            <table class="w-full border-collapse">
              <!-- 金额与签约类型 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">实收金额：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 w-40">
                  <el-form-item prop="actualPayment" style="margin-bottom: 0;" :show-message="false"
                    hide-required-asterisk>
                    <el-input v-model="form.actualPayment" placeholder="实收金额" type="number" />
                  </el-form-item>
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">尾款金额：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text" v-model="form.balanceStatus" placeholder="尾款金额,没有填0"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-48 bg-blue-50">尾款支付条件：</td>
                <td class="p-2">
                  <input type="text" v-model="form.balancePayType" placeholder="尾款支付条件"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
              </tr>

              <!-- 常法版本与服务周期 -->
              <tr class="border-b border-black">

                <td class="border-r border-black p-2 w-32 bg-blue-50">套餐类型：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 w-40">
                  <select v-model="form.serviceType"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">

                    <option v-for="dict in combo_type" :key="dict.value" :value="dict.value">
                      {{ dict.label }}
                    </option>
                  </select>
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">服务周期：<span class="text-red-500">*</span></td>
                <td colspan="2" class="border-r border-black p-2">
                  <div class="flex gap-2">
                    <input type="date" v-model="form.serviceStart" placeholder="开始日期"
                      class="w-1/3 p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                    <span class="self-center text-gray-500">至</span>
                    <input type="date" v-model="form.serviceEnd" placeholder="结束日期"
                      class="w-1/3 p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                  </div>
                </td>
                <!-- <td class="p-2 w-48 bg-blue-50">财务确<br>认状态：</td>
                <td class="p-2">
                  <select v-model="form.financeConfirmed"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                    <option value="">选择状态</option>
                    <option value="1">已确认</option>
                    <option value="0">未确认</option>
                  </select>
                </td> -->
              </tr>

              <!-- 财务签字 -->
              <!-- <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">财务签字：</td>
                <td colspan="5" class="p-2">
                  <input type="text" v-model="form.financeSignature" placeholder="请输入财务签字信息"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
              </tr> -->

              <!-- 律师咨询情况 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">律师咨询情况：</td>
                <td colspan="5" class="p-2">
                  <textarea v-model="form.lawyerConsultation" placeholder="请描述是否咨询律师、是否给客户约定所交费用包含律师费等"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                    rows="2"></textarea>
                </td>
              </tr>

              <!-- 其他费用沟通 -->
              <tr>
                <td class="border-r border-black p-2 w-32 bg-blue-50">其他费用沟通：</td>
                <td colspan="5" class="p-2">
                  <textarea v-model="form.otherFee" placeholder="请描述是否给客户讲清调档费、保险费、诉讼费等其他费用"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 placeholder-gray-500"
                    rows="2"></textarea>
                </td>
              </tr>
            </table>
          </div>

          <!--业绩归属登记-->
          <div class="text-center py-2 border-b border-black bg-blue-100 mb-1 mt-0">
            <h2 class="text-lg font-bold text-blue-800">业绩归属登记</h2>
          </div>
          <div class="border-b border-black mb-1 mt-0">
            <table class="w-full border-collapse">
              <!-- 业绩归属类型1 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属人1：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 flex-1">
<<<<<<< HEAD
                  <input type="text" placeholder="业绩所属人1"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
=======
                  <el-select v-model="form.performanceInfo[0].userId" placeholder="请选择业绩所属人1" filterable @change="changeUser(0)">
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属金额：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text" placeholder="分配业绩金额" v-model="form.performanceInfo[0].balance"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属城市：<span class="text-red-500">*</span></td>
                <td class="border-r border-black p-2 flex-1">
                  <el-select v-model="form.performanceInfo[0].city" placeholder="请选择业绩所属城市" style="width: 200px">
                  <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
                </td>
              </tr>
              <!-- 业绩归属类型2 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属人2：</td>
                <td class="border-r border-black p-2 flex-1">
<<<<<<< HEAD
                  <input type="text" placeholder="业绩所属人2"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属金额：</td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text" placeholder="分配业绩金额"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-48 bg-blue-50">业绩所属城市：</td>
                <td class="p-2">
                  <input type="text" placeholder="所属城市"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
=======
                 <el-select v-model="form.performanceInfo[1].userId" placeholder="请选择业绩所属人2" filterable @change="changeUser(1)">
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属金额：</td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text"  placeholder="分配业绩金额" v-model="form.performanceInfo[1].balance"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属城市：</td>
                <td class="border-r border-black p-2 flex-1">
                  <el-select v-model="form.performanceInfo[1].city" placeholder="请选择业绩所属城市" style="width: 200px">
                  <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
                </td>
              </tr>
              <!-- 业绩归属类型3 -->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属人3：</td>
                <td class="border-r border-black p-2 flex-1">
<<<<<<< HEAD
                  <input type="text" placeholder="业绩所属人3"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
=======
                  <el-select v-model="form.performanceInfo[2].userId" placeholder="请选择业绩所属人3" filterable @change="changeUser(2)">
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属金额：</td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text"  placeholder="分配业绩金额" v-model="form.performanceInfo[2].balance"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
               <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属城市：</td>
                <td class="border-r border-black p-2 flex-1">
                  <el-select v-model="form.performanceInfo[2].city" placeholder="请选择业绩所属城市" style="width: 200px">
                  <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
                </td>
              </tr>
              <!-- 业绩归属类型4-->
              <tr class="border-b border-black">
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属人4：</td>
                <td class="border-r border-black p-2 flex-1">
<<<<<<< HEAD
                  <input type="text" placeholder="业绩所属人4"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
=======
                  <el-select v-model="form.performanceInfo[3].userId" placeholder="请选择业绩所属人4" filterable @change="changeUser(3)">
                    <el-option v-for="user in userList" :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" :value="user.userId"></el-option>
                  </el-select>
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8
                </td>
                <td class="border-r border-black p-2 w-32 bg-blue-50">业绩所属金额：</td>
                <td class="border-r border-black p-2 flex-1">
                  <input type="text"  placeholder="分配业绩金额" v-model="form.performanceInfo[3].balance"
                    class="w-full p-1 border border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                </td>
                <td class="border-r border-black p-2 w-48 bg-blue-50">业绩所属城市：</td>
                <td class="p-2">
                  <el-select v-model="form.performanceInfo[3].city" placeholder="请选择业绩所属城市" style="width: 200px">
                  <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
                </td>
              </tr>
            </table>
          </div>


          <!-- 客户情况概述 -->
          <div class=" text-center py-2 border-b border-black bg-blue-100 mb-1 mt-0">
            <h2 class="text-lg font-bold text-blue-800">客户情况概述</h2>
          </div>
          <div class="border-b border-black mb-1 mt-0">
            <table class="w-full border-collapse">
              <!-- 以前是否有法务 -->
              <tr class="border-b border-black">
                <td class="p-3">
                  <div class="flex items-center gap-4 flex-wrap">
                    <span class="whitespace-nowrap text-gray-700">以前是否有过公司法务：</span>
                    <label class="flex items-center gap-1 cursor-pointer text-gray-700">
                      <input type="radio" name="preLegal" value="1" v-model="form.preLegal"
                        class="w-4 h-4 cursor-pointer accent-blue-500">
                      <span>是</span>
                    </label>
                    <label class="flex items-center gap-1 cursor-pointer text-gray-700">
                      <input type="radio" name="preLegal" value="0" v-model="form.preLegal"
                        class="w-4 h-4 cursor-pointer accent-blue-500">
                      <span>否</span>
                    </label>
                    <span class="ml-4 whitespace-nowrap text-gray-700">合作公司名称：</span>
                    <input type="text" v-model="form.preCompany" placeholder="合作公司名称"
                      class="flex-1 p-1 border-b border-gray-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                    <span class="ml-4 whitespace-nowrap text-gray-700">不合作原因：</span>
                    <input type="text" v-model="form.preReason" placeholder="不合作原因"
                      class="flex-1 p-1 border-b border-gray-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300">
                  </div>
                </td>
              </tr>

              <!-- 以前纠纷及解决方式 -->
              <tr class="border-b border-black">
                <td class="p-3">
                  <div class="flex items-start gap-2">
                    <span class="whitespace-nowrap pt-1 text-gray-700">公司以前出现过的纠纷及解决方式：</span>
                    <textarea v-model="form.preDiscuss" placeholder="请详细描述纠纷及解决方式"
                      class="flex-1 p-1 border-b border-gray-400 text-sm outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                      rows="2"></textarea>
                  </div>
                </td>
              </tr>

              <!-- 待处理事项登记 -->
              <tr class="border-b border-black">
                <td class="p-3">
                  <div class="leading-relaxed">
                    <span class="text-gray-700">待处理事项登记：劳资纠纷、合同纠纷、借贷纠纷、承揽纠纷、财税问题、执行案件等</span>
                    <textarea v-model="form.pendingRemark"
                      class="w-full mt-2 p-1 border-b border-gray-400 text-sm outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                      rows="2"></textarea>
                  </div>
                </td>
              </tr>

              <!-- 欠款问题登记 -->
              <tr>
                <td class="p-3">
                  <div class="leading-relaxed">
                    <span class="text-gray-700">欠款问题请详细登记：相关主体、已知债务人信息、标的额、证据情况、案件处理要求等</span>
                    <textarea v-model="form.debtRemark"
                      class="w-full mt-2 p-1 border-b border-gray-400 text-sm outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                      rows="2"></textarea>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- 备注大文本区域 -->
          <div class="min-h-[100px] border-b border-black p-4 mb-4 mt-0">
            <div class="font-medium mb-2 text-blue-800">其他备注信息：</div>
            <textarea v-model="form.remark" placeholder="请输入其他需要补充的备注信息"
              class="w-full p-2 border border-gray-300 text-sm resize-none min-h-[50px] focus:border-blue-500 focus:ring-1 focus:ring-blue-300"></textarea>
          </div>
        </el-form>
      </div>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <div class="dialog-footer flex justify-end gap-4">
          <button
            :class="['px-4 py-2 text-sm rounded-md transition-all duration-200', buttonLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-sm active:bg-blue-800']"
            :disabled="buttonLoading" @click="submitForm">
            {{ buttonLoading ? '提交中...' : '确 定' }}
          </button>
          <button
            class="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
            @click="cancel">
            取 消
          </button>
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


    <!-- 替换原有的查看对话框 -->
    <!-- 替换原有的查看对话框 -->
    <el-dialog v-model="viewDialogVisible" title="客户流转单详情" width="700px" append-to-body>
      <div class="customer-transfer-detail">
        <el-scrollbar max-height="600px">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="录入日期">
              {{ parseTime(viewForm.createTime, '{y}-{m}-{d}') }}
            </el-descriptions-item>
            <el-descriptions-item label="财务确认">
              <dict-tag :options="finance_confirmed" :value="viewForm.financeConfirmed !== undefined && viewForm.financeConfirmed !== null ? viewForm.financeConfirmed : ''" />
              <!-- <dict-tag :options="finance_confirmed" :value="viewForm.financeConfirmed ?? ''" /> -->
            </el-descriptions-item>
            <el-descriptions-item label="合同编号">
              {{ viewForm.contractCode }}
            </el-descriptions-item>
            <el-descriptions-item label="合同OssID">
              {{ viewForm.contractOssId }}
            </el-descriptions-item>
            <el-descriptions-item label="客户归属城市">
              <dict-tag :options="dc_sercive_city" :value="viewForm.customerCity !== undefined && viewForm.customerCity !== null ? viewForm.customerCity : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="公司名称" label-align="left" align="left" width="60">
              {{ viewForm.companyName }}
            </el-descriptions-item>
            <el-descriptions-item label="所属行业">
              {{ viewForm.companyIndustry }}
            </el-descriptions-item>
            <el-descriptions-item label="公司地址">
              {{ viewForm.companyAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="员工人数">
              {{ viewForm.employeeCount }}
            </el-descriptions-item>
            <el-descriptions-item label="是否有代账公司">
              <!-- <span v-if="viewForm.accountingCompany === 0">是</span>
              <span v-else-if="viewForm.accountingCompany === 1">否</span>
              <span v-else-if="viewForm.accountingCompany === 2">不确定</span> -->
              <dict-tag :options="dc_accounting_company" :value="viewForm.accountingCompany !== undefined && viewForm.accountingCompany !== null ? viewForm.accountingCompany : ''" />
            </el-descriptions-item>
            <!-- <el-descriptions-item label="邀约人">
              {{ getUserNameById(viewForm.inviterId) }}
            </el-descriptions-item>
            <el-descriptions-item label="客户经理">
              {{ getUserNameById(viewForm.accountManagerId) }}
            </el-descriptions-item> -->

            <el-descriptions-item label="对接人姓名">
              {{ viewForm.contactPerson }}
            </el-descriptions-item>
            <el-descriptions-item label="对接人联系方式">
              {{ viewForm.contactInfo }}
            </el-descriptions-item>
            <el-descriptions-item label="对接人职务">
              {{ viewForm.contactPosition }}
            </el-descriptions-item>
            <el-descriptions-item label="对接人年龄">
              {{ viewForm.contactAge }}
            </el-descriptions-item>

            <el-descriptions-item label="附赠自然人">
              {{ viewForm.additionalPerson }}
            </el-descriptions-item>
            <el-descriptions-item label="自然人联系方式">
              {{ viewForm.additionalContact }}
            </el-descriptions-item>
            <el-descriptions-item label="自然人职务">
              {{ viewForm.additionalPosition }}
            </el-descriptions-item>
            <el-descriptions-item label="自然人年龄">
              {{ viewForm.additionalAge }}
            </el-descriptions-item>
            <el-descriptions-item label="客户性格及工作习惯描述">
              {{ viewForm.customerDescription }}
            </el-descriptions-item>
            <el-descriptions-item label="实付金额">
              {{ viewForm.actualPayment }}
            </el-descriptions-item>
            <el-descriptions-item label="尾款情况">
              {{ viewForm.balanceStatus }}
            </el-descriptions-item>
           <!--  <el-descriptions-item label="签约类型">
              <dict-tag :options="contract_type" :value="viewForm.contractType || ''" />
            </el-descriptions-item> -->
            <el-descriptions-item label="套餐类型">
              <dict-tag :options="combo_type" :value="viewForm.serviceType !== undefined && viewForm.serviceType !== null ? viewForm.serviceType : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="服务周期">
              {{ parseTime(viewForm.serviceStart, '{y}-{m}-{d}') }} 至 {{ parseTime(viewForm.serviceEnd, '{y}-{m}-{d}')
              }}
            </el-descriptions-item>

            <el-descriptions-item label="财务签字">
              {{ viewForm.financeSignature }}
            </el-descriptions-item>
            <el-descriptions-item label="律师咨询情况">
              {{ viewForm.lawyerConsultation }}
            </el-descriptions-item>
            <el-descriptions-item label="其他费用沟通">
              {{ viewForm.otherFee }}
            </el-descriptions-item>

            <el-descriptions-item label="以前是否有过公司法务">
              <!-- {{ viewForm.preLegal === 1 ? '是' : '否' }} -->
              <dict-tag :options="dc_legal_affairs" :value="viewForm.preLegal !== undefined && viewForm.preLegal !== null ? viewForm.preLegal : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="合作公司名称">
              {{ viewForm.preCompany }}
            </el-descriptions-item>
            <el-descriptions-item label="不合作原因">
              {{ viewForm.preReason }}
            </el-descriptions-item>
            <el-descriptions-item label="公司以前出现过的纠纷及解决方式">
              {{ viewForm.preDiscuss }}
            </el-descriptions-item>
            <el-descriptions-item label="待处理事项登记">
              {{ viewForm.pendingRemark }}
            </el-descriptions-item>
            <el-descriptions-item label="欠款问题请详细登记">
              {{ viewForm.debtRemark }}
            </el-descriptions-item>
            <el-descriptions-item label="其他备注信息">
              {{ viewForm.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-scrollbar>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="transferInfoDialog.title" v-model="transferInfoDialog.visible" width="500px" append-to-body>
      <el-form ref="customerintentionFormRef" :model="transferFormData" :rules="rules" label-width="80px">
        <el-form-item label="合同文件" prop="contractOssId">
          <file-upload :limit="1" :fileSize="10" v-model="contract" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitintentionForm">确 定</el-button>
          <el-button @click="customerInfoDialogCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="CustomerTransfer" lang="ts">
import { listSeller, listUser } from '@/api/customerInfo/customerInfo';
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

const { dc_sercive_city } = toRefs<any>(proxy?.useDict('dc_sercive_city'));
const { dc_accounting_company } = toRefs<any>(proxy?.useDict('dc_accounting_company'));
const { dc_legal_affairs } = toRefs<any>(proxy?.useDict('dc_legal_affairs'));
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
  finance_confirmed,
  combo_type
} = toRefs<any>(proxy?.useDict('contract_type', 'dc_service_type', 'finance_confirmed', 'combo_type'));


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
  balancePayType: undefined,

  contractCode: undefined,

  contractOssId: undefined,

  customerCity: undefined,
<<<<<<< HEAD
=======
performanceInfo: [
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined }
]
>>>>>>> 7ac8664c25c3bacb63119a48f683f2605a4d5ba8

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
    balancePayType: undefined,

    contractCode: undefined,

    contractOssId: undefined,

    customerCity: undefined,

    params: {}
  },
  rules: {
    companyName: [
      { required: true, message: "公司名称不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "公司对接人不能为空", trigger: "blur" }
    ],
    actualPayment: [
      { required: true, message: "支付金额不能为空", trigger: "blur" }
    ],
    contractType: [
      { required: true, message: "签约类型不能为空", trigger: "change" }
    ],
    serviceStart: [
      { required: true, message: "服务周期开始日期不能为空", trigger: "change" }
    ],
    serviceEnd: [
      { required: true, message: "服务周期结束日期不能为空", trigger: "change" }
    ],
    balanceStatus: [
      { required: true, message: "尾款金额", trigger: "blur" }
    ],

  }
});

const transferInfoDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const transferFormData = ref({
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
  balancePayType: undefined,

  contractCode: undefined,

  contractOssId: undefined,

  customerCity: undefined,

});


const { queryParams, form, rules } = toRefs(data);

const financeStatusList = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已通过' },
  { value: 2, label: '未通过' }
];
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

const changeUser = (index: number) => {
  // 获取当前选择的用户ID
  const userId = form.value.performanceInfo[index].userId;

  if (userId) {
    // 在用户列表中查找选中的用户
    const selectedUser = userList.value.find(user => user.userId === userId);
    if (selectedUser) {
      // 设置用户名
      form.value.performanceInfo[index].userName = selectedUser.nickName;
    }
  } else {
    // 清空选择时重置相关字段
    form.value.performanceInfo[index].userName = undefined;
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
  customerTransferFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const contract = ref(null);

const handleViewContract = (row: CustomerTransferVO) => {
  if (row.contractOssId) {
    proxy?.$download.oss(row.contractOssId);
  } else {
    proxy?.$modal.msgWarning(`无合同文件可下载`);
  }
};

const handleUpload = async (row: CustomerTransferVO) => {
  contract.value = [];
  reset();
  const _id = row?.id;
  if (!_id) {
    proxy?.$modal.msgWarning('请选择要上传合同的流转单');
    return;
  }

  const res = await getCustomerTransfer(_id);
  Object.assign(transferFormData.value, res.data);
  transferInfoDialog.visible = true;
  transferInfoDialog.title = "上传合同";
};

const customerInfoDialogCancel = () => {
  transferInfoDialog.visible = false;
};

// 替换原有的 submitintentionForm 方法为以下代码：
const submitintentionForm = async () => {
  // 使用正确的表单引用
  if (contract.value) {
    transferFormData.value.contractOssId = contract.value[0].ossId;
  }

  await updateCustomerTransfer(transferFormData.value).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("操作成功");
  transferInfoDialog.visible = false;
  getList();
};

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
  dialog.title = "";
}

/** 修改按钮操作 */
/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerTransferVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomerTransfer(_id);
  Object.assign(form.value, res.data);

    // 确保 performanceInfo 格式正确
if (!form.value.performanceInfo || !Array.isArray(form.value.performanceInfo)) {
    form.value.performanceInfo = [
      { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
      { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
      { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
      { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined }
    ];
  } else {
    // 确保至少有4个元素
    while (form.value.performanceInfo.length < 4) {
      form.value.performanceInfo.push({
        id: undefined,
        transferId: undefined,
        userId: undefined,
        userName: undefined,
        balance: undefined,
        city: undefined
      });
    }
  }

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
  console.log('提交审核')
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
      getList()
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

  console.log('Form ref:', customerTransferFormRef.value);
  console.log('Form data:', form.value);

  if (!customerTransferFormRef.value) {
    console.error('Form ref is null');
    proxy?.$modal.msgError("表单初始化失败，请刷新页面重试");
    return;
  }

  customerTransferFormRef.value.validate(async (valid: boolean) => {
    console.log('Form validation result:', valid);
    if (valid) {
      buttonLoading.value = true;
      try {
        form.value.financeConfirmed = 0; // 默认未确认
        // 处理数组字段
        if (Array.isArray(form.value.pendingMatters)) {
          form.value.pendingMatters = form.value.pendingMatters.join(",");
        }
        if (Array.isArray(form.value.debtDetails)) {
          form.value.debtDetails = form.value.debtDetails.join(",");
        }

        console.log('Form data after processing:', form.value);

        if (form.value.id) {
          await updateCustomerTransfer(form.value);
        } else {
          await addCustomerTransfer(form.value);
        }

        proxy?.$modal.msgSuccess("操作成功");
        dialog.visible = false;
        await getList();
      } catch (error) {
        console.error('Submit error:', error);
        proxy?.$modal.msgError("操作失败，请重试");
      } finally {
        buttonLoading.value = false;
      }
    } else {
      console.log('Form validation failed');
      proxy?.$modal.msgError("请填写必填项");
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

// 查看对话框相关变量
const viewDialogVisible = ref(false)
const viewForm = ref<CustomerTransferVO>({} as CustomerTransferVO)

// 查看按钮处理函数
const handleView = (row: CustomerTransferVO) => {
  viewForm.value = { ...row }
  viewDialogVisible.value = true
}

// 根据用户ID获取用户名
const getUserNameById = (userId: string) => {
  if (!userId) return ''
  const user = userList.value.find((item: any) => item.userId === userId)
  return user ? `${user.nickName}` : ''
}

onMounted(() => {

  loadUserList();
  getList();
});
</script>
<style lang="scss" scoped>
// -------------------------- 1. 基础变量定义（移除蓝色背景相关配置）--------------------------
$color-primary: #1890ff; // 主色调（仅用于文字、边框、聚焦效果，不用于背景）
$color-primary-light: rgba(24, 144, 255, 0.2); // 仅用于边框/下划线，不用于背景
$color-primary-shadow: rgba(24, 144, 255, 0.4); // 仅用于输入框聚焦阴影

// 关键：移除蓝色背景变量，替换为中性背景色
$color-text-main: #333; // 主要文本色
$color-text-secondary: #666; // 次要文本色
$color-border-light: #cfd8dc; // 浅色边框（保持中性）
$color-border-dashed: #e0e0e0; // 虚线边框（保持中性）
$color-bg-card: #f9f9fb; // 卡片外层背景（浅灰，非蓝色）
$color-bg-group: #fff; // 表单分组背景（纯白，非蓝色）
$color-bg-preview: #fff; // 签名预览背景（纯白）
$color-bg-neutral: #f5f5f5; // 新增中性浅灰背景（用于标签列/标题栏，替代原蓝色背景）

$radius-main: 8px; // 主要圆角
$radius-small: 6px; // 小圆角
$radius-xs: 2px; // 超小圆角

$shadow-card: 0 4px 20px rgba(0, 0, 0, 0.06); // 卡片阴影
$shadow-group: 0 1px 6px rgba(0, 0, 0, 0.05); // 分组阴影

$font-size-base: 14px; // 基础字体大小
$font-size-sm: 13px; // 小字体大小
$font-size-md: 15px; // 中字体大小

$spacing-xs: 2px; // 超小间距
$spacing-sm: 4px; // 小间距
$spacing-md: 8px; // 中间距
$spacing-lg: 10px; // 大间距
$spacing-xl: 14px; // 超大间距
$spacing-xxl: 20px; // 特大间距
$spacing-xxxl: 28px; // 极大间距


// -------------------------- 2. 混入定义（保留核心逻辑，无蓝色背景相关修改）--------------------------
// 输入框聚焦样式混入（仅用于边框/阴影，无背景色）
@mixin input-focus-style {
  border-color: $color-primary;
  box-shadow: 0 0 3px $color-primary-shadow;
  transition: all 0.2s ease;
}

// 按钮基础样式混入（无背景色配置，保持原逻辑）
@mixin button-base-style {
  min-width: 100px;
  font-size: $font-size-base;
  font-weight: 500;
  border-radius: $radius-small;
}

// 卡片基础样式混入（背景为浅灰，非蓝色）
@mixin card-base-style {
  border-radius: $radius-main;
  background: $color-bg-card; // 浅灰背景，非蓝色
  box-shadow: $shadow-card;
  padding: $spacing-xxl (
    $spacing-xxl + $spacing-sm
  ); // 28px 32px
}


// -------------------------- 3. 具体样式实现（移除所有蓝色背景）--------------------------
// 签名预览区域（纯白背景，无蓝色）
.signature-preview {
  width: 160px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee; // 中性边框
  border-radius: $radius-small;
  padding: $spacing-sm;
  background: $color-bg-preview; // 纯白背景
}

// 流转表单卡片（外层容器：浅灰背景，非蓝色）
.transfer-form-card {
  @include card-base-style;
}

.textarea-red-placeholder::placeholder {
  color: red;
  opacity: 1;
}

// 表单分组容器（关键：移除蓝色背景，改用纯白+中性边框）
.form-group {
  background: $color-bg-group; // 纯白背景（替代原蓝色背景）
  border: 1px solid $color-border-light; // 中性边框
  border-radius: $radius-main;
  padding: $spacing-xxl $spacing-xxl; // 20px 24px
  margin-bottom: $spacing-xxxl; // 28px
  box-shadow: $shadow-group;
}

// 分组标题（关键：移除蓝色背景，下划线改用中性色）
.group-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: #333; // 中性文字色（替代原蓝色系文字）
  margin-bottom: $spacing-xl; // 14px
  padding-bottom: $spacing-md; // 8px
  border-bottom: 2px solid $color-border-light; // 中性下划线（替代原蓝色）
  letter-spacing: 0.5px;
}

// 表单整体字体（无背景色配置，保持原逻辑）
.el-form {
  font-size: $font-size-base;
  color: $color-text-main;

  // 表单项（增加行距，无背景色）
  .el-form-item {
    margin-bottom: $spacing-xl !important; // 14px

    // 表单项标签（无蓝色背景，保持中性）
    .el-form-item__label {
      background: transparent; // 确保无背景
    }
  }
}

// 输入框/文本域（关键：输入框背景改为纯白，无蓝色）
.el-input,
.el-textarea {
  width: 100%;
  font-size: $font-size-base;

  // 输入框内部样式（纯白背景，中性边框）
  &__inner {
    border-radius: $radius-small;
    border: 1px solid $color-border-light; // 中性边框
    background: #fff; // 纯白背景（确保无蓝色）
    transition: all 0.2s ease;

    // 聚焦状态（仅边框/阴影变化，无背景色）
    &:focus {
      @include input-focus-style;
    }
  }
}

// 行容器（无背景色配置，保持原逻辑）
.el-row {
  margin-bottom: $spacing-lg; // 10px;

  // 列容器（均匀排列，无背景色）
  .el-col {
    padding-right: ($spacing-md + $spacing-sm); // 12px
    background: transparent; // 确保无背景
  }
}

// 日期选择器（统一宽度，输入框背景为纯白）
.el-date-editor {
  width: 100%;

  .el-input__inner {
    background: #fff; // 纯白背景（无蓝色）
  }
}

// 对话框底部按钮区（关键：移除蓝色背景，改用中性分割线）
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: $spacing-xxl; // 20px
  padding-top: $spacing-xxl; // 20px
  border-top: 1px dashed $color-border-dashed; // 中性分割线
  margin-top: $spacing-lg; // 10px
  background: transparent; // 确保无背景

  // 按钮样式（无蓝色背景，保持原混入逻辑）
  .el-button {
    @include button-base-style;

    // 确保按钮无额外蓝色背景（仅保留默认主题色）
    &:not(.el-button--primary) {
      background: #fff; // 普通按钮纯白背景
    }
  }
}

// 表格操作按钮组（无背景色，保持原逻辑）
.table-action-buttons {
  display: flex;
  justify-content: center;
  gap: $spacing-xs; // 2px
  flex-wrap: nowrap;

  // 表格内按钮样式（无背景色，透明风格）
  .el-button {
    font-size: $font-size-sm;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent; // 透明背景
  }
}

// 补充：确保表格标签列无蓝色背景（改用中性浅灰）
table td {
  &[class*="bg-"] {
    background: $color-bg-neutral !important; // 中性浅灰（替代原蓝色背景）
  }
}
</style>
