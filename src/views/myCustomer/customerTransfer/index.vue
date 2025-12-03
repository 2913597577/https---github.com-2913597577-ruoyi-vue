<template>
  <div class="p-2">
  <!--   <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="财务确认" prop="financeConfirmed" label-width="68px">
              <el-select v-model="queryParams.financeConfirmed" placeholder="请选择财务确认状态" clearable
                @keyup.enter="handleQuery" style="width: 160px">
                <el-option v-for="item in financeStatusList" :key="item.value" :label="item.label"
                  :value="item.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName" label-width="68px">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" style="width: 160px" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="contactPerson" label-width="68px">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" style="width: 160px" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款金额" prop="balanceStatus" label-width="68px">
              <el-input v-model="queryParams.balanceStatus" placeholder="尾款金额" style="width: 160px" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="归属城市" prop="customerCity" label-width="88px">
              <el-select v-model="queryParams.customerCity" placeholder="请选择客户归属城市" clearable
              @change="handleQuery" style="width: 160px">
                <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                  :value="dict.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票状态" prop="invoiceStatus" label-width="68px">
              <el-select v-model="queryParams.invoiceStatus" placeholder="请选择开票状态" clearable
                @keyup.enter="handleQuery" style="width: 160px">
                <el-option v-for="item in invoiceStatusList" :key="item.value" :label="item.label"
                  :value="item.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="serviceStart" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceStart" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务开始时间" style="width: 160px" />
            </el-form-item>
            <el-form-item label="结束时间" prop="serviceEnd" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceEnd" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择服务结束时间" style="width: 160px" />
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
        </div>
        <div class="flex items-center">
          <el-col :span="1.5">
            <el-button type="primary"  icon="Search" @click="handleSearch"
              v-hasPermi="['myCustomer:customerTransfer:search']">筛选
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button   icon="Refresh" @click="getList"
              v-hasPermi="['myCustomer:customerTransfer:refresh']">刷新
            </el-button>
          </el-col>
        </div>
          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="customerTransferList" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries"> 
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="财务确认" align="center" prop="financeConfirmed" width="80" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="finance_confirmed" :value="scope.row.financeConfirmed ?? ''" />
          </template>
        </el-table-column>
         <el-table-column label="审核人" align="center" prop="auditUserName" width="80" show-overflow-tooltip />
          <el-table-column label="审核时间" align="center" prop="auditTime" width="80">
          <template #default="scope">
            <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同操作" align="center" prop="contractUrl" width="100" show-overflow-tooltip>
          <template #default="scope">
            <div class="contract-cell">
              <image-preview v-if="scope.row.contractUrl" :src="scope.row.contractUrl" :width="20" :height="20" />
              <el-button v-if="!scope.row.contractUrl" link type="primary" icon="Upload"
                @click="handleUpload(scope.row)">
                上传合同
              </el-button>
            </div>
          </template>

          <!-- v-hasPermi="['myCustomer:customerTransfer:contractDownload']"

          v-hasPermi="['myCustomer:customerTransfer:contractUpload']" -->
        </el-table-column>
        <el-table-column label="录入人" align="center" prop="inviterId" width="80" show-overflow-tooltip >
          <template #default="scope">
            <span>{{ getUserNameById(scope.row.inviterId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center" prop="companyName" width="180" show-overflow-tooltip />
        <el-table-column label="公司地址" align="center" prop="companyAddress" width="150" show-overflow-tooltip />
        <el-table-column label="员工人数" align="center" prop="employeeCount" width="80" show-overflow-tooltip>
        <template #default="scope">
            <dict-tag :options="dc_employee_count" :value="scope.row.employeeCount ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="所属行业" align="center" prop="companyIndustry" width="100" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dc_company_industry" :value="scope.row.companyIndustry ?? ''" />
          </template>
        </el-table-column>
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
        <el-table-column label="实付金额" align="center" prop="actualPayment" width="140" show-overflow-tooltip />
        <el-table-column label="尾款金额" align="center" prop="balanceStatus" width="140" show-overflow-tooltip />
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
        <el-table-column label="客户服务城市" align="center" prop="customerCity" width="100" show-overflow-tooltip >
          <template #default="scope">
            <dict-tag :options="dc_sercive_city" :value="scope.row.customerCity ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="合同编号" align="center" prop="contractCode" width="100" show-overflow-tooltip />
        <el-table-column label="开票要求" align="center" prop="invoiceRequirements" width="100" show-overflow-tooltip >
        <template #default="scope">
            <dict-tag :options="dc_invoice_requirement" :value="scope.row.invoiceRequirements ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="开票状态" align="center" prop="invoiceStatus" width="100" show-overflow-tooltip >
          <template #default="scope">
            <dict-tag :options="dc_invoice_status" :value="scope.row.invoiceStatus ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="开票内容" align="center" prop="invoiceContent" width="100" show-overflow-tooltip />
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
        <el-table-column label="是否有过法务" align="center" prop="preLegal" width="90" show-overflow-tooltip>
          <template #header>
           <span style="font-size: 11px; font-weight: bold;">是否有过法务</span>
          </template>
          <template #default="scope">
            <dict-tag :options="dc_legal_affairs" :value="scope.row.preLegal ?? ''" />
          </template>
        </el-table-column>
        <el-table-column label="合作公司名称" align="center" prop="preCompany" width="100" show-overflow-tooltip />
        <el-table-column label="不合作原因" align="center" prop="preReason" width="100" show-overflow-tooltip />
        <el-table-column label="公司纠纷及解决方式" align="center" prop="preDiscuss" width="150" show-overflow-tooltip />
        <el-table-column label="待处理事项登记" align="center" prop="pendingRemark" width="150" show-overflow-tooltip />
        <!-- <el-table-column label="待处理事项备注" align="center" prop="pendingRemark" width="200" show-overflow-tooltip /> -->
        <el-table-column label="欠款问题登记" align="center" prop="debtDetails" width="120" />
        <el-table-column label="欠款问题备注" align="center" prop="debtRemark" width="120" show-overflow-tooltip />
        <el-table-column label="录入日期" align="center" prop="auditTime" width="80">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
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

 <!-- 新增和修改按钮弹窗内容 -->
<template>
  <el-dialog  :title="dialog.title" v-model="dialog.visible" width="70%" append-to-body draggable
    class="customer-transfer-dialog"
  >
    <div class="dialog-content">
      <el-form  ref="customerTransferFormRef" :model="form" :rules="rules" label-width="120px hide-required-asterisk">
        
        <!-- 头部区域 -->
        <div class="header-section">
          <div class="logo-area">
            <img src="@/assets/images/logo.jpg" alt="logo" class="logo" />
          </div>
       <!-- 流转单标题 -->
          <div class="title-section">
          <h1 class="blue-title">成交客户内部流转单</h1>
        </div>
          <!-- <div class="slogan-area">
            <div>让每一家公司都拥有自己的法务部</div>
          </div> -->
        </div>

       

        <!-- 客户基本信息 -->
        <div class="form-section-1">
          <div class="section-title">客户基本信息</div>
          
          <el-row :gutter="20" class="form-row">
            <el-col :span="8">
              <el-form-item label="客户归属城市" prop="customerCity" class="form-item">
                <el-select 
                  v-model="form.customerCity" 
                  placeholder="请选择服务城市" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_sercive_city" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractCode" class="form-item">
                <el-input 
                  v-model="form.contractCode" 
                  placeholder="请输入合同编号(8位数字)" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
          <el-form-item label="主体名称" prop="companyName" class="form-item">
            <el-input 
              v-model="form.companyName" 
              placeholder="请输入公司名称" 
            />
          </el-form-item>
          </el-col>
          </el-row>
      
          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="决策人姓名" prop="decisionMaker" class="form-item">
                <el-input 
                  v-model="form.decisionMaker" 
                  placeholder="决策人姓名" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式" prop="decisionMakerContact" class="form-item">
                <el-input 
                  v-model="form.decisionMakerContact" 
                  placeholder="联系方式" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职务" class="form-item">
                <el-input 
                  v-model="form.decisionMakerPosition" 
                  placeholder="职务" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄" class="form-item">
                <el-input 
                  v-model="form.decisionMakerAge" 
                  placeholder="年龄" 
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="对接人姓名" prop="contactPerson" class="form-item">
                <el-input 
                  v-model="form.contactPerson" 
                  placeholder="对接人姓名" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式" prop="contactInfo" class="form-item">
                <el-input 
                  v-model="form.contactInfo" 
                  placeholder="联系方式" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职务" class="form-item">
                <el-input 
                  v-model="form.contactPosition" 
                  placeholder="职务" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄" class="form-item">
                <el-input 
                  v-model="form.contactAge" 
                  placeholder="年龄" 
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="附赠主体" class="form-item">
                <el-input 
                  v-model="form.additionalPerson" 
                  placeholder="附赠主体姓名" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式" class="form-item">
                <el-input 
                  v-model="form.additionalContact" 
                  placeholder="联系方式" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职务" class="form-item">
                <el-input 
                  v-model="form.additionalPosition" 
                  placeholder="职务" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄" class="form-item">
                <el-input 
                  v-model="form.additionalAge" 
                  placeholder="年龄" 
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="form-row">
            <el-col :span="6">
              <el-form-item label="公司行业" prop="companyIndustry" class="form-item">
                <!-- <el-input 
                  v-model="form.companyIndustry" 
                  placeholder="请输入所属行业" 
                /> -->
                <el-select 
                  v-model="form.companyIndustry" 
                  placeholder="请选择公司行业" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_company_industry" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
           <el-form-item label="公司地址" prop="addressModel" class="form-item">
              <el-row :gutter="10">
                <el-col :span="14">
                  <address-selector v-model="addressModel" />
                </el-col>
                <el-col :span="10">
                  <el-input 
                    v-model="form.companyAddress" 
                    placeholder="请输入详细地址" 
                  />
                </el-col>
              </el-row>
            </el-form-item>
            
          </el-col>
          </el-row>
          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="员工人数" class="form-item">
                <!-- <el-input 
                  v-model="form.employeeCount" 
                  placeholder="员工人数" 
                  type="number"
                /> -->
                <el-select 
                  v-model="form.employeeCount" 
                  placeholder="请选择员工人数" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_employee_count" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="16">
             <el-form-item label="是否有代账公司" class="form-item">
               <el-radio-group v-model="form.accountingCompany">
                 <el-radio label="0">是</el-radio>
                 <el-radio label="1">否</el-radio>
                 <el-radio label="2">不确定</el-radio>
               </el-radio-group>
             </el-form-item>
           </el-col>
           
         </el-row>
         <el-form-item label="客户性格及工作习惯描述:" class="form-item">
            <el-input
              v-model="form.customerDescription"
              type="textarea"
              :rows="2"
              placeholder="请描述客户性格及工作习惯"
            />
          </el-form-item>
        </div>


        <!-- 签约情况 -->
        <div class="form-section-2">
          <div class="section-title">签约情况</div>
          
          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="合同金额" prop="contractAmount" class="form-item">
                <el-input 
                  v-model="form.contractAmount" 
                  placeholder="合同金额" 
                  type="number"
                   @input="calculateBalanceAmount"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实收金额" prop="actualPayment" class="form-item">
                <el-input 
                  v-model="form.actualPayment" 
                  placeholder="实收金额" 
                  type="number"
                 @input="calculateBalanceAmount"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item label="尾款金额" prop="balanceStatus" class="form-item">
                <el-input 
                  v-model="form.balanceStatus" 
                  placeholder="尾款金额" 
                  type="number"
                  readonly
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="尾款支付条件" class="form-item" prop="balancePayType" :rules="balancePayTypeRules">
                <el-input 
                  v-model="form.balancePayType" 
                  placeholder="尾款支付条件" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="套餐类型" prop="serviceType" class="form-item">
                <el-select 
                  v-model="form.serviceType" 
                  placeholder="请选择套餐类型" 
                  style="width: 90%"
                >
                  <el-option 
                    v-for="dict in combo_type" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务周期" class="form-item" prop="serviceEnd">
                <div class="date-range">
                  <el-date-picker
                    v-model="form.serviceStart"
                    type="date"
                    placeholder="开始日期"
                    style="width: 60%"
                  />
                  <span class="date-separator">至</span>
                  <el-date-picker
                    v-model="form.serviceEnd"
                    type="date"
                    placeholder="结束日期"
                    style="width: 60%"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户来源" prop="customerSource" class="form-item">
                <el-select 
                  v-model="form.customerSource" 
                  placeholder="请选择客户来源" 
                  style="width: 90%"
                >
                  <el-option 
                    v-for="dict in dc_customer_source" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        
          <el-row :gutter="20" class="form-row">
            <el-col :span="6">
              <el-form-item label="开票要求" prop="invoiceRequirements" class="form-item">
                <el-select 
                  v-model="form.invoiceRequirements" 
                  placeholder="请选择开票要求" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_invoice_requirement" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票状态" prop="invoiceStatus" class="form-item">
                <el-select 
                  v-model="form.invoiceStatus" 
                  placeholder="请选择开票状态" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_invoice_status" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票内容" class="form-item">
                <el-input 
                  v-model="form.invoiceContent" 
                  placeholder="请输入开票内容" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="推荐人" class="form-item">
                <el-input 
                  v-model="form.referrer" 
                  placeholder="请输入推荐人" 
                />
              </el-form-item>
            </el-col>
          </el-row>
         
          <el-form-item label="律师咨询情况:" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.lawyerConsultation"
              type="textarea"
              :rows="2"
              placeholder="请描述是否咨询律师、是否给客户约定所交费用包含律师费等"
            />
          </el-form-item>
       
          <el-form-item label="其他费用沟通:" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.otherFee"
              type="textarea"
              :rows="2"
              placeholder="请描述是否给客户讲清调档费、保险费、诉讼费等其他费用"
            />
          </el-form-item>
        
        </div>

        <!-- 业绩归属登记 -->
        <div class="form-section-3">
          <div class="section-title">业绩归属登记</div>
          <!-- 业绩金额汇总提示 -->
     <div class="performance-summary" :class="{ 'error': hasPerformanceSumError }">
      <span>分配业绩金额总和: {{ performanceTotal }} 元</span>
       <span v-if="hasPerformanceSumError" class="error-text">
      （与实收金额 {{ form.actualPayment || 0 }} 元不一致）
       </span>
      <span v-else class="success-text">✓ 金额匹配</span>
      </div>
          <div 
            v-for="(performance, index) in form.performanceInfo" 
            :key="index"
            class="performance-row"
          >
            <el-row :gutter="20" class="form-row">
              <el-col :span="8">
                <el-form-item 
                  :label="`业绩所属人${index + 1}`" 
                  :prop="`performanceInfo[${index}].userId`"
                  :rules="index === 0 ? rules.performanceUserId : []"
                  class="form-item"
                >
                  <el-select 
                    v-model="performance.userId" 
                    :placeholder="`请选择业绩所属人${index + 1}`" 
                    filterable
                    @change="changeUser(index)"
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="user in userList" 
                      :key="user.userId"
                      :label="user.nickName + '(' + user.userName + ')'" 
                      :value="user.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item 
                  :label="`业绩所属金额`" 
                  :prop="`performanceInfo[${index}].balance`"
                  :rules="index === 0 ? rules.performanceBalance : []"
                  class="form-item"
                >
                  <el-input 
                    v-model="performance.balance"
                    :placeholder="`请分配业绩金额`" 
                    type="number"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  :label="`业绩所属城市`" 
                  :prop="`performanceInfo[${index}].city`"
                  :rules="index === 0 ? rules.performanceCity : []"
                  class="form-item"
                >
                  <el-select 
                    v-model="performance.city" 
                    :placeholder="`请选择业绩所属城市`" 
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="dict in dc_sercive_city" 
                      :key="dict.value" 
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="index > 0">
                <div class="remove-btn-container">
                  <el-button 
                    type="danger" 
                    plain 
                    size="small"
                    @click="removePerformance(index)"
                    class="remove-btn"
                  >
                    删除
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <div class="add-btn-container" v-if="form.performanceInfo.length < 4">
            <el-button 
              type="primary" 
              plain 
              @click="addPerformance"
              class="add-btn"
            >
              + 添加业绩归属人
            </el-button>
          </div>
        </div>

        <!-- 客户情况概述 -->
        <div class="form-section-4">
          <div class="section-title">客户情况概述</div>
          
          <el-form-item label="以前是否有过公司法务" class="form-item" style="margin-bottom: 20px;">
            <el-radio-group v-model="form.preLegal">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-row :gutter="20" class="form-row" v-if="form.preLegal === '1'">
            <el-col :span="8">
              <el-form-item label="合作公司名称" class="form-item">
                <el-input 
                  v-model="form.preCompany" 
                  placeholder="合作公司名称" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="不合作原因" class="form-item">
                <el-input 
                  v-model="form.preReason" 
                  placeholder="不合作原因" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="公司以前出现过的纠纷及解决方式:" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.preDiscuss"
              type="textarea"
              :rows="2"
              placeholder="请详细描述纠纷及解决方式"
            />
          </el-form-item>
          
         <!--  <el-form-item label="待处理事项登记：" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.pendingRemark"
              type="textarea"
              :rows="2"
              placeholder="劳资纠纷、合同纠纷、借贷纠纷、承揽纠纷、财税问题、执行案件等"
            />
          </el-form-item> -->
 <el-form-item label="待处理事项登记：" class="form-item" style="margin-bottom: 20px;">
  <el-select
    v-model="form.pendingRemark"
    multiple
    placeholder="请选择待处理事项（可多选）"
    style="width: 100%"
  >
    <el-option
      v-for="item in pendingMattersOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-form-item>
         <!--  <el-form-item label="欠款问题请详细登记:" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.debtRemark"
              type="textarea"
              :rows="2"
              placeholder="相关主体、已知债务人信息、标的额、证据情况、案件处理要求等"
            />
          </el-form-item> -->

          <el-form-item label="其他备注信息:" class="form-item" style="margin-bottom: 20px;">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入其他需要补充的备注信息"
            />
          </el-form-item>

        </div>
      </el-form>
    </div>
     <!-- 案件登记 -->
     <div class="form-section-5">
          <div class="section-title">案件登记</div>
          <el-row :gutter="20" class="form-row">
            <el-col :span="8">
              <el-form-item label="债务人" prop="debtor" class="form-item">
                <el-input 
                  v-model="form.debtor" 
                  placeholder="债务人姓名" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="欠款金额" prop="debtAmount" class="form-item">
                <el-input 
                  v-model="form.debtAmount" 
                  placeholder="欠款金额" 
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="debtorContact" class="form-item">
                <el-input 
                  v-model="form.debtorContact" 
                  placeholder="联系电话" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="证据备注:" prop="evidenceRemark" class="form-item">
            <el-input
              v-model="form.evidenceRemark"
              type="textarea"
              :rows="2"
              placeholder="请输入证据备注信息"
            />
          </el-form-item>
          </div>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button 
          type="primary" 
          :loading="buttonLoading" 
          @click="submitForm"
          size="default"
        >
          {{ buttonLoading ? '提交中...' : '确 定' }}
        </el-button>
        <el-button @click="cancel" size="default">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>


    <!-- 搜索按钮弹窗内容 -->
  <el-dialog v-model="searchDialogVisible" title="筛选" width="900px" append-to-body draggable>
  <!-- <template> -->
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">  
       <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="财务确认" prop="financeConfirmed" label-width="68px">
              <el-select v-model="queryParams.financeConfirmed" placeholder="请选择财务确认状态" clearable
                @keyup.enter="handleQuery" style="width: 160px">
                <el-option v-for="item in financeStatusList" :key="item.value" :label="item.label"
                  :value="item.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName" label-width="68px">
              <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" style="width: 160px" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="对接人" prop="contactPerson" label-width="68px">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入公司对接人" style="width: 160px" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="尾款金额" prop="balanceStatus" label-width="68px">
              <el-input v-model="queryParams.balanceStatus" placeholder="尾款金额" style="width: 160px" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="签约类型" prop="signType" label-width="68px">
              <el-input v-model="queryParams.contractType" placeholder="请输入签约类型" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="归属城市" prop="customerCity" label-width="88px">
              <el-select v-model="queryParams.customerCity" placeholder="请选择客户归属城市" clearable
              @change="handleQuery" style="width: 160px">
                <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label"
                  :value="dict.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票状态" prop="invoiceStatus" label-width="68px">
              <el-select v-model="queryParams.invoiceStatus" placeholder="请选择开票状态" clearable
                @keyup.enter="handleQuery" style="width: 160px">
                <el-option v-for="item in invoiceStatusList" :key="item.value" :label="item.label"
                  :value="item.value" align="center" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="serviceStart" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceStart" type="date" 
                placeholder="请选择服务开始时间" style="width: 160px" />
            </el-form-item>
            <el-form-item label="结束时间" prop="serviceEnd" label-width="68px">
              <el-date-picker clearable v-model="queryParams.serviceEnd" type="date" 
                placeholder="请选择服务结束时间" style="width: 160px" />
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

    <!-- 处置按钮弹窗内容 -->
    <el-dialog v-model="auditDialogVisible" title="审核" width="680px" append-to-body draggable>
      <el-form :model="auditForm" label-width="100px" class="audit-signature-form">
        <el-form-item label="公司名称" prop="companyName" class="audit-form-item">
            <el-input v-model="currentRow.companyName" readonly />
        </el-form-item>

      <el-row>
        <el-col :span="8">
        <el-form-item label="合同金额" prop="contractAmount" class="audit-form-item">
            <el-input v-model="currentRow.contractAmount" readonly />
        </el-form-item>
         </el-col>
      <el-col :span="8">
         <el-form-item label="实收金额" prop="actualPayment" class="audit-form-item">
            <el-input v-model="currentRow.actualPayment" readonly />
        </el-form-item>
         </el-col>
        <el-col :span="8">
         <el-form-item label="尾款金额" prop="balanceStatus" class="audit-form-item">
            <el-input v-model="currentRow.balanceStatus" readonly />
        </el-form-item>
         </el-col>
       </el-row>
       <el-row>
            <el-col :span="8">
              <el-form-item label="开票要求" prop="invoiceRequirements" class="audit-form-item">
                <el-select 
                  v-model="currentRow.invoiceRequirements" 
                  placeholder="请选择开票要求" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_invoice_requirement" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开票状态" prop="invoiceStatus" class="audit-form-item">
                <el-select 
                  v-model="currentRow.invoiceStatus" 
                  placeholder="请选择开票状态" 
                  style="width: 100%"
                >
                  <el-option 
                    v-for="dict in dc_invoice_status" 
                    :key="dict.value" 
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开票内容" prop="invoiceContent" class="audit-form-item">
                <el-input 
                  v-model="currentRow.invoiceContent"  />
              </el-form-item>
            </el-col>
          </el-row>
        <!-- 审核状态 -->
        <el-form-item label="财务审核" class="audit-form-item1">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
         <!-- 审核意见 -->
        <!-- 上传签名：仅在通过时显示 -->
        <el-form-item v-if="auditForm.auditStatus === '1'" label="电子签名" class="audit-form-item2">
          <fileUpload v-model="localFileList" :limit="1" :file-size="2" :file-type="['png', 'jpg', 'jpeg']"
            :is-show-tip="false" />
          <div v-if="localFileList.length > 0 && localFileList[0].url" style="margin-top: 8px;">
            <img :src="localFileList[0].url" class="signature-preview" />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: right">
          <el-button type="primary" :loading="submitting" @click="submitAudit">确定</el-button>
          <el-button @click="auditCancel" :disabled="submitting">取消</el-button>
        </div>
      </template>
    </el-dialog>
  

    <!-- 替换原有的查看对话框 -->
    <!-- 替换原有的查看对话框 -->
    <el-dialog v-model="viewDialogVisible" title="客户流转单详情" width="700px" append-to-body draggable>
      <div class="customer-transfer-detail">
        <el-scrollbar max-height="600px">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="录入日期">
              {{ parseTime(viewForm.createTime, '{y}-{m}-{d}') }}
            </el-descriptions-item>
            <el-descriptions-item label="财务确认">
              <dict-tag :options="finance_confirmed"
                :value="viewForm.financeConfirmed !== undefined && viewForm.financeConfirmed !== null ? viewForm.financeConfirmed : ''" />
              <!-- <dict-tag :options="finance_confirmed" :value="viewForm.financeConfirmed ?? ''" /> -->
            </el-descriptions-item>
            <el-descriptions-item label="合同编号">
              {{ viewForm.contractCode }}
            </el-descriptions-item>
            <el-descriptions-item label="合同OssID">
              {{ viewForm.contractOssId }}
            </el-descriptions-item>
            <el-descriptions-item label="客户归属城市">
              <dict-tag :options="dc_sercive_city"
                :value="viewForm.customerCity !== undefined && viewForm.customerCity !== null ? viewForm.customerCity : ''" />
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
              <dict-tag :options="dc_accounting_company"
                :value="viewForm.accountingCompany !== undefined && viewForm.accountingCompany !== null ? viewForm.accountingCompany : ''" />
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
              <dict-tag :options="combo_type"
                :value="viewForm.serviceType !== undefined && viewForm.serviceType !== null ? viewForm.serviceType : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="服务周期">
              {{ parseTime(viewForm.serviceStart, '{y}-{m}-{d}') }} 至 {{ parseTime(viewForm.serviceEnd, '{y}-{m}-{d}')}}
            </el-descriptions-item>

            <!-- <el-descriptions-item label="财务签字">
              {{ viewForm.financeSignature }}
            </el-descriptions-item> -->
            <el-descriptions-item label="开票状态">
              <dict-tag :options="dc_invoice_status" :value="viewForm.invoiceStatus !== undefined && viewForm.invoiceStatus !== null ? viewForm.invoiceStatus : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="律师咨询情况">
              {{ viewForm.lawyerConsultation }}
            </el-descriptions-item>
            <el-descriptions-item label="其他费用沟通">
              {{ viewForm.otherFee }}
            </el-descriptions-item>

            <el-descriptions-item label="以前是否有过公司法务">
              <!-- {{ viewForm.preLegal === 1 ? '是' : '否' }} -->
              <dict-tag :options="dc_legal_affairs"
                :value="viewForm.preLegal !== undefined && viewForm.preLegal !== null ? viewForm.preLegal : ''" />
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
          <el-button @click="viewDialogVisible = false" icon="Close">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="transferInfoDialog.title" v-model="transferInfoDialog.visible" width="500px" append-to-body>
      <el-form ref="customerintentionFormRef" :model="transferFormData" :rules="rules" label-width="80px">
        <el-form-item label="合同照片" prop="contractOssId">
          <image-upload v-model="contract" />
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
import provinceCityAreaData from '@/assets/address.json'
import addressSelector from '@/components/address/address.vue';
import { getNameByCode, getCodeByName } from '@/components/address/addressMethod';
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
import { de } from 'element-plus/es/locale/index.mjs';


const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { dc_sercive_city } = toRefs<any>(proxy?.useDict('dc_sercive_city'));
const { dc_accounting_company } = toRefs<any>(proxy?.useDict('dc_accounting_company'));
const { dc_legal_affairs } = toRefs<any>(proxy?.useDict('dc_legal_affairs'));
const { dc_invoice_requirement } = toRefs<any>(proxy?.useDict('dc_invoice_requirement'));
const { dc_invoice_status } = toRefs<any>(proxy?.useDict('dc_invoice_status'));
const { dc_company_industry } = toRefs<any>(proxy?.useDict('dc_company_industry'));
const { dc_employee_count } = toRefs<any>(proxy?.useDict('dc_employee_count'));
const { dc_customer_source } = toRefs<any>(proxy?.useDict('dc_customer_source'));
const { finance_confirmed, combo_type } = toRefs<any>(proxy?.useDict('finance_confirmed', 'combo_type'));
const customerTransferList = ref<CustomerTransferVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const userList = ref([]); // 用户列表

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

  invoiceRequirements: undefined,

  invoiceContent: undefined,

  invoiceStatus: undefined,

performanceInfo: [
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  /* { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined },
  { id: undefined, transferId: undefined, userId: undefined, userName: undefined, balance: undefined, city: undefined } */
]

}
const data = reactive<PageData<CustomerTransferForm, CustomerTransferQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
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

    invoiceRequirements: undefined,

    invoiceContent: undefined,
    
    invoiceStatus: undefined,

    params: {}
  },
  rules: {
    customerCity: [
      { required: true, message: "客户归属城市不能为空", trigger: "blur" }
    ],
    contractCode: [
      { required: true, message: "合同编号不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "公司名称不能为空", trigger: "blur" }
    ],
    decisionMaker: [
      { required: true, message: "公司决策人姓名不能为空", trigger: "change" }
    ],
    decisionMakerContact: [
      { required: true, message: "决策人联系方式不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "公司对接人姓名不能为空", trigger: "blur" }
    ],
    contactInfo: [
      { required: true, message: "对接人联系方式不能为空", trigger: "blur" }
    ],
    companyIndustry: [
      { required: true, message: "所属行业不能为空", trigger: "change" }
    ],
   /*  addressModel: [
      { required: true, message: "公司地址不能为空", trigger: "change" }
    ], */
    contractAmount: [
      { required: true, message: "合同金额不能为空", trigger: "blur" }
    ],
    actualPayment: [
      { required: true, message: "实收金额不能为空", trigger: "blur" }
    ],
    balanceStatus: [
      { required: true, message: "尾款金额不能为空", trigger: "blur" }
    ],
    serviceType: [
      { required: true, message: "套餐类型不能为空", trigger: "change" }
    ],
    serviceStart: [
      { required: true, message: "服务周期开始日期不能为空", trigger: "change" }
    ],
    serviceEnd: [
      { required: true, message: "服务周期日期不能为空", trigger: "change" }
    ],
    customerSource: [
      { required: true, message: "客户来源不能为空", trigger: "change" }
    ],
    invoiceRequirements: [
      { required: true, message: "开票要求不能为空", trigger: "change" }
    ],
    invoiceStatus: [
      { required: true, message: "开票状态不能为空", trigger: "change" }
    ],
   /*  'performanceInfo.0.userId': [
      { required: true, message: "业绩所属人1不能为空", trigger: "blur" }
    ],
   'performanceInfo.0.balance': [
      { required: true, message: "业绩所属金额不能为空", trigger: "blur" }
    ],
    'performanceInfo.0.city': [
      { required: true, message: "业绩所属城市不能为空", trigger: "blur" }
    ],   */
   performanceUserId: [{ required: true, message: '请选择业绩所属人', trigger: 'change' }],
   performanceBalance: [{ required: true, message: '请输入分配业绩金额', trigger: 'blur' }],
   performanceCity: [{ required: true, message: '请选择业绩所属城市', trigger: 'change' }],
 
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

  invoiceRequirements: undefined,

  invoiceContent: undefined,

  invoiceStatus: undefined

});


const { queryParams, form, rules } = toRefs(data);

const financeStatusList = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已通过' },
  { value: 2, label: '未通过' }
];

const invoiceStatusList = [
  { value: 0, label: '未开票' },
  { value: 1, label: '已开票' }
];

//待处理事项登记
const pendingMattersOptions = [
  { value: '经济纠纷', label: '经济纠纷' },
  { value: '劳资纠纷', label: '劳资纠纷' },
  { value: '合同定审', label: '合同定审' },
  { value: '公司经营问题', label: '公司经营问题' },
  { value: '财税问题', label: '财税问题' },
  { value: '其他问题', label: '其他问题' }
];

//列表最后一行添加合计
const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '合计';
      return;
  }
  //这里应该根据实际业务需求修改列名
    const values = data.map(item => Number(item[column.property]));
    if (column.label == "实付金额" || column.label == "尾款金额") {
    if (!values.every(value => isNaN(value))) {
    sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
   if (!isNaN(value)) {
   return prev + curr;
    } else {
      return prev;
   }
  }, 0);
    //  sums[index] = sums[index].toFixed(2);
    sums[index] = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(sums[index]);

 } else {
        //  sums[index] = 'N/A';
}
  }
});
return sums;
}

/** 查询客户信息录入列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.isSecondaryCharge=0; // 只查询初次收费的流转单
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
  
    addressModel.value = {
      province: getCodeByName(form.value.province || ''),
      city: getCodeByName(form.value.city || ''),
      district: getCodeByName(form.value.district || '')
    };
  
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

// 添加地址模型的响应式引用
const addressModel = ref({
  province: '',
  city: '',
  district: ''
})

// 监听地址模型变化，更新表单数据
watch(addressModel, (newVal) => {
  // 可以在这里处理选中的省市区数据，例如保存名称而不是代码
   console.log('地址选择变化:', newVal)
}, { deep: true })


// 替换原有的 submitintentionForm 方法为以下代码：
const submitintentionForm = async () => {
  // 使用正确的表单引用
  console.log(contract.value);
  if (contract.value) {
    transferFormData.value.contractOssId = contract.value;
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
  form.value.pendingRemark = form.value.pendingRemark ? form.value.pendingRemark.split(",") : [];
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
//查找相关
const searchDialogVisible = ref(false)
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

//流转单业绩归属登记新增按钮
const addPerformance = () => {
  if (form.value.performanceInfo.length < 4) {
    form.value.performanceInfo.push({ userId: '', balance: '', city: '' })
  }
}
//流转单业绩归属登记删除按钮
const removePerformance = (index) => {
  if (form.value.performanceInfo.length > 1) {
    form.value.performanceInfo.splice(index, 1)
  }
}
// 尾款金额自动计算方法
const calculateBalanceAmount = () => {
  const contractAmount = parseFloat(form.value.contractAmount) || 0;
  const actualPayment = parseFloat(form.value.actualPayment) || 0;
  form.value.balanceStatus = contractAmount - actualPayment;
}
// 尾款支付条件的动态验证规则
const balancePayTypeRules = computed(() => {
  const balanceStatus = parseFloat(form.value.balanceStatus) || 0;
  if (balanceStatus !== 0) {
    return [
      { required: true, message: "尾款金额不为0时,需填写尾款支付条件", trigger: "blur" }
    ];
  }
  return [];
});
// 提交审核
async function submitAudit() {
  console.log('提交审核')
  if (submitting.value) return
  console.log(localFileList.value[0])
  // 如果审核通过，必须上传签名图片
  if (auditForm.value.auditStatus === '1') {
    if (localFileList.value.length === 0 || !(localFileList.value[0].raw instanceof File)) {
      ElMessage.warning('请先上传个人签名图片！')
      return
    }
  }
 // 合同文件是否上传验证
if (!currentRow.value?.contractOssId) {
    ElMessage.warning('请先上传合同文件！')
    return
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
      "0",
      pictureFile
    )

    if (res && res.code === 200) {
      ElMessage.success('审核操作成功，此客户信息已录入客户总表！')
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

//分配业绩金额总和验证相关代码
// 计算属性 - 业绩金额总和
const performanceTotal = computed(() => {
  return form.value.performanceInfo.reduce((sum, item) => {
    const amount = Number(item.balance) || 0
    return sum + amount
  }, 0)
})

// 计算属性 - 是否有业绩金额总和错误
const hasPerformanceSumError = computed(() => {
  const actualPayment = Number(form.value.actualPayment) || 0
  return Math.abs(performanceTotal.value - actualPayment) > 0.01 // 允许0.01的精度误差
})

// 监听实收金额变化，自动验证业绩金额总和
watch(() => form.value.actualPayment, () => {
  validatePerformanceSum()
})

// 监听业绩金额变化，自动验证
watch(() => form.value.performanceInfo.map(p => p.balance), () => {
  validatePerformanceSum()
}, { deep: true })


// 验证业绩金额总和
function validatePerformanceSum() {
  if (customerTransferFormRef.value) {
    // 触发实收金额字段的验证
    customerTransferFormRef.value.validateField('actualPayment')
    
    // 触发所有业绩金额字段的验证
    form.value.performanceInfo.forEach((item, index) => {
      customerTransferFormRef.value.validateField(`performanceInfo[${index}].balance`)
    })
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
// 先验证业绩金额总和
if (hasPerformanceSumError.value) {
      ElMessage.error('业绩金额总和必须等于实收金额，请检查并修正')
      return
    }

  customerTransferFormRef.value.validate(async (valid: boolean) => {
    console.log('Form validation result:', valid);
    if (valid) {
      buttonLoading.value = true;
      try {
        form.value.financeConfirmed = 0; // 默认未确认

        form.value.province = getNameByCode(addressModel.value.province)
        form.value.city = getNameByCode(addressModel.value.city)
        form.value.district = getNameByCode(addressModel.value.district)
        // 处理数组字段
        if (Array.isArray(form.value.pendingRemark)) {
          form.value.pendingRemark = form.value.pendingRemark.join(",");
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
  const companyName = row?.companyName || '';
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户信息 编号为:"' + _ids + '",公司名称为:"'+ companyName +'"的数据项？').finally(() => loading.value = false);
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

/** 查找按钮操作 */
const handleSearch = () => {
  searchDialogVisible.value = true
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


<style scoped>
.customer-transfer-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 4px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color);
  margin-bottom: 10px;
}

.logo {
  width: 100px;
  height: 30px;
}

.slogan-area {
  text-align: right;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom:10px;
}

.title-section {

  text-align: center;
  padding: 8px 0;
  margin-bottom: 10px;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blue-title {
  color:cornflowerblue;
 
}

.title-section h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.form-section-1 {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  height: 430px;
}
.form-section-2 {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  height: 360px;
}

.form-section-3 {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  height: 460px;
}
.form-section-4 {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  height: 350px;
}
.form-section-5 {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  height: 200px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-light);
  color:dodgerblue;
  text-align: center;
  background-color: var(--el-color-primary-light-9); 
  padding-top: 12px;
  border-radius: 4px 4px 0 0;
}

.form-row {
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 0;
}

.performance-row {
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
  height: 60px;
}

.remove-btn-container {
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding-bottom: 6px;
}

.remove-btn {
  width: 100%;
}

.add-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.add-btn {
  width: 200px;
}

.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.date-separator {
  padding: 0 8px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);

}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-row {
    margin-bottom: 12px;
  }
  
  .form-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .performance-row {
    padding: 12px;
  }
}

.performance-summary {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* font-weight: bold; */
}

.performance-summary.error {
  border-color: var(--el-color-error);
  background-color: var(--el-color-error-light-9);
}

.error-text {
  color: var(--el-color-error);
  font-weight: 500;
}

.success-text {
  color: var(--el-color-success);
  font-weight: 500;
}

.auto-distribute-btn {
  margin-left: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .performance-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.audit-signature-form {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 25px;
  background-color: var(--el-bg-color);
  height: 260px;
  margin-bottom: 1px;
}

.audit-form-item {
  margin-bottom: 20px;
}
.audit-form-item1 {
 
  margin-bottom: 30px;
  
}
.audit-form-item2 {

  margin-bottom: 20px;
}

::v-deep .el-table__footer-wrapper {
  font-weight: bold;
  font-size: 14px;
  
  .el-table__cell {
    background-color: #f5f7fa !important;
    font-size: 14px;
    
    &:first-child {
      color: #303133;
      font-weight: bold;
    }
  }
}

</style>
