<template>
  <div class="legal-support-performance">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20">
      <!-- 左侧统计信息 -->
      <el-col :span="24">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>客户信息统计</h3>
          </div>
          <div class="statistic-content">
            <div class="stat-item">
              <span class="label">客户总数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.customerTotal }}</span>
              <span class="label">近15天未跟进客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.outstandingTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">意向客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerIntention')">{{ customerCount.intentionTotal }}</span>
              <span class="label">临期客户（7天后到期）数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.expiringTotal }}</span>
              <span class="label">尾款客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.balanceTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">本月回访数量：</span>
              <span class="value" @click="$router.push('/legalSupport/customerTracking')" >{{ customerCount.trackingTotal }}</span>
              <span class="label">本月出访数量：</span>
              <span class="value" @click="$router.push('/legalSupport/customerOutVisit')">{{ customerCount.outVisitTotal }}</span>
              <span class="label">本月保单数量：</span>
              <span class="value" @click="$router.push('/legalSupport/insuranceCase')">{{ customerCount.insuranceTotal }}</span>
              <span class="label">本月下工单数量：</span>
              <span class="value" @click="$router.push('/legalSupport/customerJobOrder')">{{ customerCount.jobOrderTotal }}</span>
            </div>
          </div>
        </el-card>

        <!-- 业绩展示框 -->
        <el-card class="performance-card" style="margin-top: 20px;">
          <div class="performance-header">
        <h3>我的业绩展示</h3>
        </div>  
          <div class="performance-content">
            <!-- <div class="performance-item">
              <span class="label">本月业绩任务：</span>
              <span class="value" @click="$router.push('/salesStatistics/performanceTask')">{{ performanceCount.monthPerformanceGoal }}</span>
              <span class="label">已完成金额：</span>
              <span class="value" @click="$router.push('/salesStatistics/customerPerformance')">{{ performanceCount.monthPerformanceAchieved }}</span>
              <span class="label">本月出访任务：</span>
              <span class="value" @click="$router.push('/salesStatistics/performanceTask')">{{ performanceCount.monthVisitGoal }}</span>
              <span class="label">出访完成：</span>
              <span class="value" @click="$router.push('/legalSupport/customerOutVisit')">{{ customerCount.outVisitTotal }}</span>
            </div>
            <div class="performance-item">
              <span class="label">本年业绩任务累积金额：</span>
              <span class="value" @click="$router.push('/salesStatistics/performanceTask')">{{ performanceCount.yearPerformanceGoal }}</span>
              <span class="label">本年已完成业绩累积金额：</span>
              <span class="value" @click="$router.push('/salesStatistics/customerPerformance')">{{ performanceCount.yearPerformanceAchieved }}</span>
              <span class="label">年度排名：</span>
              <span class="value">{{ performanceCount.yearPerformanceRank }}</span>
            </div> -->
            
             <!-- 新增：两个表格区域 -->
             <div class="table-sections" style="margin-top: 30px;"> 
              <!-- 表格1：本月业绩任务 -->
              <div class="table-box">
                <!-- 修改此处：使用 flex 布局让标题和按钮同行显示，并两端对齐 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="margin: 0; color: #303133;">本月业绩任务明细</h4>
                  <el-button type="primary" icon="Search" size="small" @click="showMonthFilterDialog = true">
                    筛选
                  </el-button>
                </div>
                <el-table :data="performanceMonthCount.monthPerformanceGoal" border stripe style="width: 100%" height="265">
                  <el-table-column prop="legal_support_name" label="姓名" width="120"></el-table-column>
                  <el-table-column prop="sum1" label="业绩目标" width="200">
                    <template #default="scope">
                      {{ formatCurrency(scope.row.sum1) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="sum2" label="出访目标" width="200"></el-table-column>
                  <el-table-column prop="remark1" label="归属城市" width="120"></el-table-column>
                  <el-table-column label="月份" width="120">
                    <template #default>
                  {{ performanceMonthCount.month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`  }}
                  </template>
                  </el-table-column> 
                </el-table>
              </div>
              <!-- 表格2：已完成金额 -->
              <div class="table-box" style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px; color: #303133;">本月已完成业绩明细</h4>
                <el-table :data="performanceMonthCount.monthPerformanceAchieved" border stripe style="width: 100%" height="265">
                  <el-table-column prop="performanceRank" label="本月排名" width="120">
                    <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">{{ scope.row.performanceRank }}</span>
                    </template>
                  </el-table-column>
                  
                  <el-table-column prop="username" label="姓名" width="200"></el-table-column>
                  <el-table-column prop="monthBalance" label="完成金额" width="200">
                    <template #default="scope">
                      <span style="color: #ff6b35; font-weight: bold;">{{ formatCurrency(scope.row.monthBalance) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="city" label="归属城市" width="120"></el-table-column>
                  <el-table-column label="月份" width="120">
                    <template #default>
                  {{ performanceMonthCount.month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` }}
                  </template>
                  </el-table-column> 
                </el-table>
              </div>

              <!-- 表格3：本年业绩任务 -->
               <div class="table-box" style="margin-top: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="margin: 0; color: #303133;">本年业绩任务明细</h4>
                  <el-button type="primary" icon="Search" size="small" @click="showYearFilterDialog = true">
                    筛选
                  </el-button>
                </div>
                <el-table :data="performanceYearCount.yearPerformanceGoal" border stripe style="width: 100%" height="265">
                  <el-table-column prop="legal_support_name" label="姓名" width="120"></el-table-column>
                  <el-table-column prop="sum1" label="业绩目标" width="200">
                    <template #default="scope">
                      {{ formatCurrency(scope.row.sum1) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="sum2" label="出访目标" width="200"></el-table-column>
                  <el-table-column prop="remark1" label="归属城市" width="120"></el-table-column>
                  <el-table-column label="年份" width="120">
                    <template #default>
                  {{ performanceYearCount.year || new Date().getFullYear() }}
                  </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 表格4：已完成金额 -->
              <div class="table-box" style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px; color: #303133;">本年已完成业绩明细</h4>
                <el-table :data="performanceYearCount.yearPerformanceAchieved" border stripe style="width: 100%" height="265">
                  <el-table-column prop="performanceRank" label="本年排名" width="120">
                    <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">{{ scope.row.performanceRank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="username" label="姓名" width="200"></el-table-column>
                  <el-table-column prop="monthBalance" label="完成金额" width="200">
                    <template #default="scope">
                      <span style="color: #ff6b35; font-weight: bold;">{{ formatCurrency(scope.row.monthBalance) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="city" label="归属城市" width="120"></el-table-column>
                  <el-table-column label="年份" width="120">
                    <template #default>
                  {{ performanceYearCount.year || new Date().getFullYear() }}
                  </template>
                  </el-table-column> 
                </el-table>
              </div>
            </div>
            </div>
          </el-card>

 <!-- 新增：月份业绩数据筛选弹窗 -->
 <el-dialog v-model="showMonthFilterDialog" title="月份业绩数据筛选" width="500px" append-to-body draggable @open="clearMonthFilter">
            <el-form :model="filterMonthForm" label-width="80px" size="small">
             
               <!-- 修改此处：使用 el-date-picker -->
     <el-form-item label="请选择月份">
       <el-date-picker 
         v-model="filterMonthForm.month" 
         type="month" 
         value-format="YYYY-MM"
         placeholder="请选择月份" 
         style="width: 100%" 
       />
     </el-form-item>
            </el-form>

            <template #footer>
              <div class="dialog-footer">
                <!-- <el-button @click="showMonthFilterDialog = false">取消</el-button> -->
                <el-button @click="resetMonthFilter">重置</el-button>
                <el-button type="primary" @click="handleMonthFilterConfirm">确定</el-button>
              </div>
            </template>
          </el-dialog>

<!-- 新增：年份业绩数据筛选弹窗 -->
<el-dialog v-model="showYearFilterDialog" title="年份业绩数据筛选" width="500px" append-to-body draggable  @open="clearYearFilter">
            <el-form :model="filterYearForm" label-width="80px" size="small">
                <el-form-item label="请选择年份">
       <el-date-picker 
         v-model="filterYearForm.year" 
         type="year" 
         value-format="YYYY"
         placeholder="请选择年份" 
         style="width: 100%" 
       />
     </el-form-item>

            </el-form>

            <template #footer>
              <div class="dialog-footer">
                <!-- <el-button @click="showYearFilterDialog = false">取消</el-button> -->
                <el-button @click="resetYearFilter">重置</el-button>
                <el-button type="primary" @click="handleYearFilterConfirm">确定</el-button>
              </div>
            </template>
          </el-dialog>

           <!-- 卡片3：套餐类型对比图表 (新增独立卡片) -->
        <el-card class="chart-card" style="margin-top: 20px;">
          <div class="performance-header">
            <h4>客户套餐类型</h4>
          </div>
          <div class="performance-content">
            <!-- 套餐类型对比图表 -->
            <div class="chart-container">
              <div class="chart-wrapper">
                <el-progress
                  type="circle"
                  :percentage="getPackageTypePercentage('常法')"
                  :width="80"
                  :stroke-width="10"
                  :format="(percent) => `${percent}%`"
                  color="#1890ff"
                />
                <el-progress
                  type="circle"
                  :percentage="getPackageTypePercentage('单项')"
                  :width="80"
                  :stroke-width="10"
                  :format="(percent) => `${percent}%`"
                  color="#f56a00"
                />
                <el-progress
                  type="circle"
                  :percentage="getPackageTypePercentage('法务增值')"
                  :width="80"
                  :stroke-width="10"
                  :format="(percent) => `${percent}%`"
                  color="#7cb342"
                />
                <el-progress
                  type="circle"
                  :percentage="getPackageTypePercentage('财务增值')"
                  :width="80"
                  :stroke-width="10"
                  :format="(percent) => `${percent}%`"
                  color="#e6a23c"
                />
                <el-progress
                  type="circle"
                  :percentage="getPackageTypePercentage('咨询费')"
                  :width="80"
                  :stroke-width="10"
                  :format="(percent) => `${percent}%`"
                  color="#9a66d2"
                />
              </div>
              <div class="chart-legend">
                <span class="legend-item"><i class="dot" style="background:#1890ff;"></i>常法</span>
                <span class="legend-item"><i class="dot" style="background:#f56a00;"></i>单项</span>
                <span class="legend-item"><i class="dot" style="background:#7cb342;"></i>法务增值</span>
                <span class="legend-item"><i class="dot" style="background:#e6a23c;"></i>财务增值</span>
                <span class="legend-item"><i class="dot" style="background:#9a66d2;"></i>咨询费</span>
              </div>
            </div>
          </div>
        </el-card>

      </el-col>

      <!-- 右侧待办事项 -->
     <!--  <el-col :span="8">
        <el-card class="todo-card">
          <div class="todo-header" @click="$router.push('/legalSupport/customerAllTracking')">
            <h3>今日待办事项</h3>
          </div>
          <div class="todo-content">
            <div v-if="neededInfo.length === 0" class="no-todo">
              <i class="el-icon-check"></i>
              <p>暂无待办事项</p>
            </div>
            <div v-else class="todo-list" >
              <div v-for="(item, index) in neededInfo" :key="index" class="todo-item">
                <span class="client-id">客户: {{ item.customerName }}</span>
                <span class="task-content">事项内容: {{ item.remark }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script setup name="legalSupportPerformance" lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router' // 修改此行
import { getLegalSupportPerformance } from '@/api/common'
import { listMonthLegalSupportPerformance } from '@/api/common'
import { listYearLegalSupportPerformance } from '@/api/common'

// 1. 定义弹窗显示状态
const showMonthFilterDialog = ref(false)
const showYearFilterDialog = ref(false)

// 2. 定义筛选表单
const filterMonthForm = reactive({
  month: undefined as string | undefined
})

const filterYearForm = reactive({
  year: undefined as string | undefined,
})


// 统计数据
const customerCount = ref<any>({})
//const performanceCount = ref<any>({})
//const neededInfo = ref<any[]>([])
const packageType = ref<any>([])
// 【新增】月份筛选后的业绩数据
const performanceMonthCount = ref<any>({
  monthPerformanceGoal: [],
  monthPerformanceAchieved: [],
  month: '' // 用于显示月份
})

// 【新增】年份筛选后的业绩数据
const performanceYearCount = ref<any>({
  yearPerformanceGoal: [],
  yearPerformanceAchieved: [],
  year: ''
})



// 新增：用于存储两个表格的数据
//const taskList = ref<any[]>([])      // 本月业绩任务列表
//const completedList = ref<any[]>([]) // 本月已完成金额列表


const router = useRouter()

// 获取法务支持业绩统计
const fetchPerformanceData = async () => {
  try {
    
    const params: any = {}
   
    const response = await getLegalSupportPerformance()
    if (response && response.data) {
      // 解析客户统计数据
      customerCount.value = response.data.customerCount

      // 解析业绩统计数据
      performanceMonthCount.value = response.data.performanceCount
      performanceYearCount.value = response.data.performanceCount

      console.log("performanceMonthCount:", performanceMonthCount.value);

      packageType.value = response.data.packageType

      // 解析待办事项数据
      //neededInfo.value = response.data.neededInfo
       // 假设后端返回字段名为 performanceTaskList 和 performanceCompletedList
      // 请根据实际接口返回的字段名调整以下赋值
      //taskList.value = response.data.performanceCount || []
      //completedList.value = response.data.performanceCompletedList || []
    }
  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}


// 3. 修改获取数据的方法，支持传入筛选参数(月份)
const listMonthPerformanceData = async () => {
  try {
    const params: any = {}
    
    // 如果选择了月份，直接传入 (格式为 YYYY-MM)
    if (filterMonthForm.month) {
      params.month = filterMonthForm.month
    }
    
    const response = await listMonthLegalSupportPerformance(params)
    if (response && response.data) {
      performanceMonthCount.value = response.data
      //console.log("performanceCount:", performanceMonthCount.value);
    }
  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}

// 3. 修改获取数据的方法，支持传入筛选参数(月份)
const listYearPerformanceData = async () => {
  try {
    const params: any = {}
    
    // 如果选择了月份，直接传入 (格式为 YYYY-MM)
    if (filterMonthForm.month) {
      params.month = filterMonthForm.month
    }
    
    // 如果选择了年份，传入年份
    if (filterYearForm.year) {
      params.year = filterYearForm.year
    }

    const response = await listYearLegalSupportPerformance(params)
    if (response && response.data) {
      performanceYearCount.value = response.data
      //console.log("performanceCount:", performanceYearCount.value);
    }
  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}

// 4. 修改月份筛选确认逻辑
const handleMonthFilterConfirm = () => {
  listMonthPerformanceData()
  //showMonthFilterDialog.value = false
}

// 5. 新增：重置月份筛选
const resetMonthFilter = () => {
  filterMonthForm.month = undefined
  //listMonthPerformanceData()
  //showMonthFilterDialog.value = false
}

const clearMonthFilter = () => {
  filterMonthForm.month = undefined
}
// 6. 修改年份筛选确认逻辑 (补充之前缺失的部分)
const handleYearFilterConfirm = () => {
  listYearPerformanceData()
  //showYearFilterDialog.value = false
}

// 7. 重置年份筛选
const resetYearFilter = () => {
  filterMonthForm.month = undefined
  filterYearForm.year = undefined
  //listYearPerformanceData()
  //showYearFilterDialog.value = false
}
const clearYearFilter = () => {
  filterMonthForm.month = undefined
  filterYearForm.year = undefined
}
// 页面加载时获取数据
onMounted(() => {
  fetchPerformanceData()
  //listMonthPerformanceData(),
  //listYearPerformanceData()
})

// 计算套餐类型百分比
const getPackageTypePercentage = (type: string): number => {
  if (!packageType.value || !Array.isArray(packageType.value)) {
    return 0
  }

  const total = packageType.value.reduce((sum, item) => sum + (item.count || 0), 0)
  if (total === 0) return 0

  const targetItem = packageType.value.find(item => {
    const typeNameMap = {
      '0': '常法',
      '1': '单项',
      '2': '法务增值',
      '3': '财务增值',
      '4': '咨询费'
    }
    return typeNameMap[item.package_type] === type
  })

  return targetItem ? Math.round((targetItem.count / total) * 100) : 0
}

//添加金额格式化处理函数
const formatCurrency = (value) => {
  if (!value) return '￥0.00';
  return parseFloat(value).toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  });
};

</script>

<style lang="scss" scoped>
.legal-support-performance {
  padding: 20px;

  .statistic-card,
  .performance-card,
  .chart-card,
  .todo-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .statistic-header,
  .performance-header,
  .todo-header {
    
    padding: 1px 20px;
    border-radius: 8px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;
    color:#1890ff;
  }

  .statistic-content,
  .performance-content,
  .todo-content {
    padding: 20px;
  }

  .stat-item,
  .performance-item {
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
    }
  }

  .label {
    font-weight: 500;
    color: #333;
    margin-right: 10px;
  }

  .value {
    font-size: 20px;
    font-weight: 700;
    // color: #1890ff;
    color:#ff6b35;
    margin-right: 30px;
    cursor: pointer;
  }

  .value:hover {
  color: #409eff;
  text-decoration: underline;
}

  .sub-label {
    font-size: 12px;
    color: #666;
    margin-left: 15px;
  }

  .performance-header h3 {
    color: #1890ff;
  }

  .chart-container {
    margin-top: 20px;
  }

  .chart-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 12px;
    color: #666;
  }

  .legend-item {
    display: flex;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .todo-header h3 {
    color:#1890ff;
  }

  .no-todo {
    text-align: center;
    color: #999;
    padding: 40px 0;
  }

  .todo-list {
    list-style: none;
    padding: 0;
  }

  .todo-item {
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }
  }

  .client-id {
    font-weight: 500;
    color: #1890ff;
    margin-right: 10px;
  }

  .task-content {
    color: #666;
  }

  .stat-clickable {
  cursor: pointer;
}
}
</style>
