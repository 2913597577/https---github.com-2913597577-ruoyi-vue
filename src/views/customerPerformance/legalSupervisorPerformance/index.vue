<template>
  <div class="legal-supervisor-performance">
    <!-- 客户统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>客户信息统计</h3>
          </div>
          <div class="statistic-content">
            <div class="stat-item">
              <span class="label">客户数量：</span>
              <span class="value">{{ customerStats.customerTotal }}</span>
              <span class="label">近15天未跟进客户：</span>
              <span class="value">{{ customerStats.outStandingTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">意向客户数量：</span>
              <span class="value">{{ customerStats.intentionTotal }}</span>
              <span class="label">前7后7临期客户数量：</span>
              <span class="value">{{ customerStats.expiringTotal }}</span>
              <span class="label">尾款客户数量：</span>
              <span class="value">{{ customerStats.balanceTotal }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 业绩展示框 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="performance-card">
          <div class="performance-header">
            <h3>团队业绩展示</h3>
          </div>
          <div class="performance-content">
            <!-- 团队任务进度 -->
            <div class="progress-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #303133;">
                  月度业绩完成率（{{ currentDisplayMonth }}）
                </h4>
                <el-button type="primary" icon="Search" size="small" @click="showMonthFilterDialog = true">
                  筛选
                </el-button>
              </div>
              <el-progress
                :percentage="teamMonthPerformanceRate"
                :format="(percent) => `${percent}%`"
                color="#67c23a"
                :stroke-width="3"
              />
              <div class="progress-info">
                <span>已完成：{{ formatCurrency(teamPerformance.teamMonthAchievedBalance) }}</span>
                <span>目标：{{ formatCurrency(teamPerformance.teamMonthPerformanceGoal) }}</span>
              </div>
            </div>

              <!-- 成员任务完成柱状图 -->
              <div class="chart-item">
              <h4>
                月度任务完成情况（{{ currentDisplayMonth }}）
              </h4>
              <div ref="chartRefMonth" class="chart-container"></div>
            </div>
             <!-- 团队任务进度 -->
            <!--  <div class="progress-item">
              <h4>团队月度出访完成率</h4>
              <el-progress
                :percentage="teamMonthVisitRate"
                :format="(percent) => `${percent}%`"
                color="#67c23a"
                :stroke-width="3"
              />
              <div class="progress-info">
                <span>已完成：{{ formatCurrency(teamPerformance.teamMonthAchievedVisit) }}</span>
                <span>目标：{{ formatCurrency(teamPerformance.teamMonthVisitGoal) }}</span>
              </div>
            </div> -->

            <!-- 成员月度业绩排名 -->
            <div class="ranking-item">
              <h4>
                月度业绩排名（{{ currentDisplayMonth }}）
              </h4>
              <el-table :data="memberRankings" stripe style="width: 100%; font-size: 12px;">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="monthAchievedBalance" label="业绩金额" width="120">
                  <template #default="scope">
                    <span style="color: #ff6b35; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    {{ formatCurrency(getMonthAchieved(scope.row)) }} 
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRank" label="排名" width="80">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getMonthRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
                  </el-table-column>
                  <el-table-column prop="city" label="归属城市" width="120">
                    <template #default="scope">
                    {{ scope.row.monthPerformanceAchieved?.[0]?.city || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="月份" width="120">
                    <template #default="scope">
                      {{ currentDisplayMonth }}
                  </template>
                  </el-table-column> 
              </el-table>
            </div>

            <div class="progress-item" style="margin-top: 50px;">
              <!-- 修改此处：使用 flex 布局让标题和按钮同行显示，并两端对齐 -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #303133;">
                  年度业绩完成率（{{ currentDisplayYear }}）
                </h4>
                <el-button type="primary" icon="Search" size="small" @click="showYearFilterDialog = true">
                  筛选
                </el-button>
              </div>
              <el-progress
                :percentage="teamYearPerformanceRate"
                :format="(percent) => `${percent}%`"
                color="#67c23a"
                :stroke-width="3"
              />
              <div class="progress-info">
                <span>已完成：{{ formatCurrency(teamPerformance.teamYearAchievedBalance) }}</span>
                <span>目标：{{ formatCurrency(teamPerformance.teamYearPerformanceGoal) }}</span>
              </div>
            </div>

          <!--   <div class="progress-item">
              <h4>团队年度出访完成率</h4>
              <el-progress
                :percentage="teamYearVisitRate"
                :format="(percent) => `${percent}%`"
                color="#67c23a"
                :stroke-width="3"
              />
              <div class="progress-info">
                <span>已完成：{{ formatCurrency(teamPerformance.teamYearAchievedVisit) }}</span>
                <span>目标：{{ formatCurrency(teamPerformance.teamYearVisitGoal) }}</span>
              </div>
            </div> -->
            <!-- 年度业绩 -->
            <div class="annual-performance">
              <h4>
              本年度已完成业绩累计（{{ currentDisplayYear }}）
              </h4>
              <div class="annual-amount">
                {{ formatCurrency(teamPerformance.teamYearAchievedBalance) }}
              </div>
            </div>

             <!-- 成员任务完成柱状图 -->
             <div class="chart-item">
              <h4>
                年度任务完成情况（{{ currentDisplayYear }}）
              </h4>
              <div ref="chartRefYear" class="chart-container"></div>
            </div>

             <!-- 成员年度业绩排名 -->
             <div class="ranking-item">
              <h4>
                年度业绩排名（{{ currentDisplayYear }}）
              </h4>
              <el-table :data="yearMemberRankings" stripe style="width: 100%; font-size: 12px;">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="monthAchievedBalance" label="业绩金额" width="120">
                  <template #default="scope">
                    <span style="color: #ff6b35; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    {{ formatCurrency(getYearAchieved(scope.row)) }}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRank" label="排名" width="80">
                  <template #default="scope">
                    <span style="color: #7cb342; font-weight: bold;">
                    <!-- {{ formatCurrency(scope.row.monthAchievedBalance) }} -->
                    <!-- {{getYearRank(scope.row) }} -->
                    {{ scope.$index + 1 }}
                  </span>
                  </template>
              </el-table-column>
              <el-table-column prop="city" label="归属城市" width="120">
                    <template #default="scope">
                    {{ scope.row.yearPerformanceAchieved?.[0]?.city || '-' }}
                    </template>
              </el-table-column>
              <el-table-column label="年份" width="120">
                    <template #default="scope">
                      {{ currentDisplayYear }}
                  </template>
                  </el-table-column> 
              </el-table>
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


      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalSupervisorPerformance" lang="ts">
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue'  // 添加了watch导入
import { getPerformance } from '@/api/common'
import * as echarts from 'echarts'
import { listMonthTeamPerformance } from '@/api/common'
import { listYearTeamPerformance } from '@/api/common'

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



// 数据响应式变量
const performanceData = ref<any>({})
//const chartRef = ref<HTMLDivElement | null>(null)

// 【新增】独立存储月度成员列表
const monthPerformanceList = ref<any[]>([])
// 【新增】独立存储年度成员列表
const yearPerformanceList = ref<any[]>([])
  
const chartRefMonth = ref<HTMLDivElement | null>(null)
const chartRefYear = ref<HTMLDivElement | null>(null)

const chartInstanceMonth = ref<echarts.ECharts | null>(null)
const chartInstanceYear = ref<echarts.ECharts | null>(null)


// 计算属性
const customerStats = computed(() => {
  return {
    customerTotal: performanceData.value.customerTotal || 0,
    outStandingTotal: performanceData.value.outStandingTotal || 0,
    intentionTotal: performanceData.value.intentionTotal || 0,
    expiringTotal: performanceData.value.expiringTotal || 0,
    balanceTotal: performanceData.value.balanceTotal || 0
  }
})

const teamPerformance = computed(() => {
  return performanceData.value.teamPerformance || {}
})

const teamPerformanceList = computed(() => {
  return performanceData.value.teamPerformanceList || []
})



// 【新增】计算当前显示的月份
const currentDisplayMonth = computed(() => {
  // 【修改】使用 monthPerformanceList
  if (monthPerformanceList.value && monthPerformanceList.value.length > 0) {
    const firstMember = monthPerformanceList.value[0];
    // 优先取成员对象上的 month 字段
    if (firstMember.month) {
      return firstMember.month;
    }
    // 其次取业绩数组里的 month 字段
    if (firstMember.monthPerformanceAchieved && firstMember.monthPerformanceAchieved.length > 0) {
      return firstMember.monthPerformanceAchieved[0].month;
    }
  }
  
  // 默认返回当前年月
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

// 【新增】计算当前显示的年份
const currentDisplayYear = computed(() => {
  // 【修改】使用 yearPerformanceList
  if (yearPerformanceList.value && yearPerformanceList.value.length > 0) {
    const firstMember = yearPerformanceList.value[0];
    // 优先取成员对象上的 year 字段（如果后端返回了的话）
    if (firstMember.year) {
      return firstMember.year;
    }
    // 其次取年度业绩数组里的 year 字段
    if (firstMember.yearPerformanceAchieved && firstMember.yearPerformanceAchieved.length > 0) {
      return firstMember.yearPerformanceAchieved[0].year;
    }
  }
  // 默认返回当前系统年份
  return new Date().getFullYear().toString();
});

const teamMonthPerformanceRate = computed(() => {
  if (!teamPerformance.value.teamMonthPerformanceGoal) return 0
  return Math.round((teamPerformance.value.teamMonthAchievedBalance / teamPerformance.value.teamMonthPerformanceGoal) * 100)
})
const teamMonthVisitRate = computed(() => {
  if (!teamPerformance.value.teamMonthVisitGoal) return 0
  return Math.round((teamPerformance.value.teamMonthAchievedVisit / teamPerformance.value.teamMonthVisitGoal) * 100)
})

const teamYearPerformanceRate = computed(() => {
  if (!teamPerformance.value.teamYearPerformanceGoal) return 0
  return Math.round((teamPerformance.value.teamYearAchievedBalance / teamPerformance.value.teamYearPerformanceGoal) * 100)
})

const teamYearVisitRate = computed(() => {
  if (!teamPerformance.value.teamYearVisitGoal) return 0
  return Math.round((teamPerformance.value.teamYearAchievedVisit / teamPerformance.value.teamYearVisitGoal) * 100)
})

/* const memberRankings = computed(() => {
  return [...teamPerformanceList.value]
    .sort((a, b) => (a.monthPerformanceRank || 999) - (b.monthPerformanceRank || 999))
    .slice(0, 20)
}) */

const memberRankings = computed(() => {
  // 1. 复制数组，避免修改原数据
  const list = [...monthPerformanceList.value]
  
  // 2. 根据月度业绩金额降序排序 (由大到小)
  list.sort((a, b) => {
    const amountA = getMonthAchieved(a)
    const amountB = getMonthAchieved(b)
    return amountB - amountA
  })
  
  // 3. 取前50名
  return list.slice(0, 50)
})

const yearMemberRankings = computed(() => {
  const list = [...yearPerformanceList.value]
  // 根据年度业绩金额降序排序
  list.sort((a, b) => {
    const amountA = getYearAchieved(a)
    const amountB = getYearAchieved(b)
    return amountB - amountA
  })
  return list.slice(0, 50)
})



// 获取法务主管业绩数据
const fetchSupervisorData = async () => {
  try {
    const response = await getPerformance()
    if (response && response.data) {
      performanceData.value = response.data
      
      console.log("获取到的业绩数据:", performanceData.value)
      
      // 【修改】初始化时，同时填充月度和年度列表
      if (response.data.teamPerformanceList) {
        monthPerformanceList.value = response.data.teamPerformanceList
        yearPerformanceList.value = response.data.teamPerformanceList
      }

      // 校验数据
      performanceData.value.teamPerformanceList?.forEach((member: any) => {
        if (member.monthPerformanceGoal === '0' || member.monthPerformanceGoal === 0) {
          member.monthPerformanceGoal = null
        }
      })
    }
  } catch (error) {
    console.error('获取主管业绩失败:', error)
  }
}

// 3. 修改法务主管获取数据的方法，支持传入筛选参数(月份)
const listMonthSupervisorData = async () => {
  try {
    const params: any = {}
    
    // 如果选择了月份，直接传入 (格式为 YYYY-MM)
    if (filterMonthForm.month) {
      params.month = filterMonthForm.month
    } else {
      // 如果没有选择月份，可以传空或者当前月份，取决于后端逻辑
      // params.month = undefined 
    }
    
    const response = await listMonthTeamPerformance(params)
    if (response && response.data) {
      const newData = response.data
      
      // 【关键修改】将获取到的月度列表数据更新到主数据源中
      // 这样 memberRankings 和 initChart 就能读取到最新的数据
      if (newData.teamPerformanceList) {
        monthPerformanceList.value = newData.teamPerformanceList
      }
      
      // 如果有团队汇总数据，也一并更新（可选，看后端是否返回）
      if (newData.teamPerformance) {
        performanceData.value.teamPerformance = {
          ...performanceData.value.teamPerformance,
          ...newData.teamPerformance
        }
      }

      // 保存原始筛选结果以备他用
      performanceMonthCount.value = newData
      
      // 【关键修改】数据更新后，重新初始化图表
      // 使用 nextTick 确保 DOM 和数据同步
      await nextTick()
      initChart()
    
    }
  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}

// 3. 修改获取数据的方法，支持传入筛选参数(月份)
const listYearSupervisorData = async () => {
  try {
    const params: any = {}
    
    
    // 如果选择了年份，传入年份
    if (filterYearForm.year) {
      params.year = filterYearForm.year
    }

    const response = await listYearTeamPerformance(params)
    if (response && response.data) {
      const newData = response.data
      
      // 【关键修改】将获取到的年度列表数据更新到主数据源中
      // 这样 yearMemberRankings 和 initChart (年度部分) 就能读取到最新的数据
      if (newData.teamPerformanceList) {
        yearPerformanceList.value = newData.teamPerformanceList
      }
      
      // 如果有团队汇总数据，也一并更新（可选，看后端是否返回）
      if (newData.teamPerformance) {
        performanceData.value.teamPerformance = {
          ...performanceData.value.teamPerformance,
          ...newData.teamPerformance
        }
      }

      // 保存原始筛选结果以备他用
      performanceYearCount.value = newData
      
      // 【关键修改】数据更新后，重新初始化图表
      // 使用 nextTick 确保 DOM 和数据同步
      await nextTick()
      initChart()
    }

  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}

// 4. 修改月份筛选确认逻辑
const handleMonthFilterConfirm = () => {
  listMonthSupervisorData()
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
  listYearSupervisorData()
  //showYearFilterDialog.value = false
}

// 7. 重置年份筛选
const resetYearFilter = () => {
  //filterMonthForm.month = undefined
  filterYearForm.year = undefined
  //listYearPerformanceData()
  //showYearFilterDialog.value = false
}
const clearYearFilter = () => {
  //filterMonthForm.month = undefined
  filterYearForm.year = undefined
}

// 修改计算成员完成率函数
const calculateMemberRate = (member: any) => {
  const achieved = parseFloat(member.monthAchievedBalance || '0')
  const goal = parseFloat(member.monthPerformanceGoal || '0')
  
  // 处理目标为0的情况
  if (goal === 0) {
    return achieved > 0 ? 100 : 0
  }
  
  return Math.round((achieved / goal) * 100)
}

// 格式化金额
const formatCurrency = (value: string | number) => {
  if (!value && value !== 0) return '¥0.00'
  return '¥' + parseFloat(value.toString()).toFixed(2)
}

// 新增：获取月度完成业绩
const getMonthAchieved = (member: any) => {
   // 判断数组是否存在且不为空
   if (member.monthPerformanceAchieved && member.monthPerformanceAchieved.length > 0) {
    // 尝试多种可能的字段名
    const obj = member.monthPerformanceAchieved[0];
    return parseFloat(obj.monthBalance || obj.balance || 0);
  }
  return 0;
}

// 获取月度排名 (通常直接在根节点，但为了统一处理也可以写个函数)
const getMonthRank = (member: any) => {
  // 优先取根节点的 rank
  if (member.monthPerformanceRank) {
    return member.monthPerformanceRank;
  }
  // 如果根节点没有，再尝试从数组里找（备选方案）
  if (member.monthPerformanceAchieved && member.monthPerformanceAchieved.length > 0) {
    return member.monthPerformanceAchieved[0].performanceRank || '-';
  }
  return '-';
}
// 新增：获取年度完成业绩
const getYearAchieved = (member: any) => {
  // 判断数组是否存在且不为空
  if (member.yearPerformanceAchieved && member.yearPerformanceAchieved.length > 0) {
    const obj = member.yearPerformanceAchieved[0];
    // 使用 parseFloat 确保返回的是数字类型，方便后续排序计算
    // 请根据后端实际返回的字段名调整，这里兼容 monthBalance, balance, yearBalance
    return parseFloat(obj.monthBalance || obj.balance || obj.yearBalance || 0);
  }
  return 0;
}
// 获取年度排名 (通常直接在根节点，但为了统一处理也可以写个函数)
const getYearRank = (member: any) => {
  // 优先取根节点的 rank
  if (member.yearPerformanceRank) {
    return member.yearPerformanceRank;
  }
  // 如果根节点没有，再尝试从数组里找（备选方案）
  if (member.yearPerformanceAchieved && member.yearPerformanceAchieved.length > 0) {
    return member.yearPerformanceAchieved[0].performanceRank || '-';
  }
  return '-';
}

// 初始化图表
const initChart = () => {
  // --- 1. 初始化月度图表 ---
if (chartRefMonth.value) {
  // 使用当前的 teamPerformanceList，它现在会被 listMonthSupervisorData 更新
  const currentList = monthPerformanceList.value || []

  const monthData = currentList.map((member: any) => {
    // 1. 处理完成业绩 (monthPerformanceAchieved)
    // 后端返回可能是 []，需要安全访问
    let achievement = 0;
    if (member.monthPerformanceAchieved && member.monthPerformanceAchieved.length > 0) {
      // 假设第一个元素包含 balance 或 monthBalance
      const achievedObj = member.monthPerformanceAchieved[0];
      achievement = parseFloat(achievedObj.monthBalance || achievedObj.balance || 0);
    }

    // 2. 处理业绩目标 (monthPerformanceGoal)
    // 后端返回格式: [{ sum1: "10000.00", ... }]
    let goal = 0;
    if (member.monthPerformanceGoal && member.monthPerformanceGoal.length > 0) {
      const goalObj = member.monthPerformanceGoal[0];
      // 提取 sum1 字段
      goal = parseFloat(goalObj.sum1 || 0);
    }

    return {
      name: member.userName,
      achievement: achievement,
      goal: goal
    };
  });

    // 销毁旧实例防止内存泄漏
    if (chartInstanceMonth.value) {
      chartInstanceMonth.value.dispose()
    }
    
    chartInstanceMonth.value = echarts.init(chartRefMonth.value)
    
    const monthOption = {
      title: { text: '月度任务完成情况', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: { data: ['完成业绩', '业绩目标'], bottom: 0 },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: monthData.map(item => item.name),
        axisLabel: { rotate: 45, interval: 0, fontSize: 10,      // 设置字号变小，例如 10px 或 12px
          fontWeight: 'bold' }
      },
      yAxis: {
        type: 'value',
        name: '金额'
      },
      series: [
        {
          name: '完成业绩',
          type: 'bar',
          data: monthData.map(item => item.achievement),
          itemStyle: { color: '#1890ff' },
          // 添加 label 配置以显示数值
          label: {
            show: true,
            position: 'top', // 数值显示在柱子顶部
            formatter: (params: any) => {
              // 格式化显示为货币形式，如 ¥1,234.56
              return '¥' + params.value.toLocaleString(); 
            },
            fontSize: 10,
            color: '#333'
          }
        },
        {
          name: '业绩目标',
          type: 'bar',
          data: monthData.map(item => item.goal),
          itemStyle: { color: '#f56a00' },
          // 添加 label 配置以显示数值
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return '¥' + params.value.toLocaleString();
            },
            fontSize: 10,
            color: '#333'
          }
        }
      ]
    }
    chartInstanceMonth.value.setOption(monthOption)
  }

  // --- 2. 初始化年度图表 (补充部分) ---
  if (chartRefYear.value) {
    // 使用当前的 teamPerformanceList
    const currentList = yearPerformanceList.value || []

    // 映射年度数据
    const yearData = currentList.map((member: any) => {
      // 1. 安全获取年度完成业绩
      // 后端返回格式可能为: [{ monthBalance: "xxx", ... }] 或 [{ balance: "xxx", ... }]
      let achievement = 0;
      if (member.yearPerformanceAchieved && member.yearPerformanceAchieved.length > 0) {
        const achievedObj = member.yearPerformanceAchieved[0];
        // 请根据实际后端返回的字段名调整，这里假设是 monthBalance 或 balance
        achievement = parseFloat(achievedObj.monthBalance || achievedObj.balance || 0);
      }

      // 2. 安全获取年度目标
      // 后端返回格式: [{ sum1: "10000.00", ... }]
      let goal = 0;
      if (member.yearPerformanceGoal && member.yearPerformanceGoal.length > 0) {
        const goalObj = member.yearPerformanceGoal[0];
        // 提取 sum1 字段作为目标值
        goal = parseFloat(goalObj.sum1 || 0);
      }

      return {
        name: member.userName,
        achievement: achievement,
        goal: goal
      };
    });
    // 销毁旧实例
    if (chartInstanceYear.value) {
      chartInstanceYear.value.dispose()
    }

    chartInstanceYear.value = echarts.init(chartRefYear.value)

    const yearOption = {
      title: { text: '年度任务完成情况', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: { data: ['完成业绩', '业绩目标'], bottom: 0 },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%', // 增加顶部空间防止标题遮挡
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: yearData.map(item => item.name),
        axisLabel: { rotate: 45, interval: 0, fontSize: 10,      // 设置字号变小，例如 10px 或 12px
          fontWeight: 'bold' }
      
      },
      yAxis: {
        type: 'value',
        name: '金额'
      },
      series: [
        {
          name: '完成业绩',
          type: 'bar',
          data: yearData.map(item => item.achievement),
          itemStyle: { color: '#7cb342' },
           // 添加 label 配置
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return '¥' + params.value.toLocaleString();
            },
            fontSize: 10,
            color: '#333'
          }// 年度使用绿色区分
        },
        {
          name: '业绩目标',
          type: 'bar',
          data: yearData.map(item => item.goal),
          itemStyle: { color: '#e6a23c' },
          // 添加 label 配置
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return '¥' + params.value.toLocaleString();
            },
            fontSize: 10,
            color: '#333'
          }
        }
      ]
    }
    chartInstanceYear.value.setOption(yearOption)
  }
}

watch(
  () => performanceData.value,
  (newVal) => {
    if (newVal && teamPerformanceList.value.length > 0) {
      // 使用 nextTick 确保 DOM 更新后再渲染图表
      setTimeout(() => {
        initChart()
      }, 100)
    }
  },
  { deep: true }
)

onMounted(() => {
  fetchSupervisorData()
})

onUnmounted(() => {
  // 5. 清理所有图表实例
  if (chartInstanceMonth.value) {
    chartInstanceMonth.value.dispose()
    chartInstanceMonth.value = null
  }
  if (chartInstanceYear.value) {
    chartInstanceYear.value.dispose()
    chartInstanceYear.value = null
  }
})

</script>

<style lang="scss" scoped>
.legal-supervisor-performance {
  padding: 20px;

  .statistic-card,
  .performance-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .statistic-header,
  .performance-header {
    padding: 1px 20px;
    border-radius: 8px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;
    color:#1890ff;
  }

  .statistic-content,
  .performance-content {
    padding: 20px;
  }

  .stat-item {
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
    font-weight: 600;
    color: #ff6b35;
    margin-right: 20px;
  }

  .progress-item,
  .chart-item,
  .ranking-item,
  .annual-performance {
    margin-bottom: 20px;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .annual-performance {
    h4 {
      margin-bottom: 10px;
    }
    
    .annual-amount {
      font-size: 24px;
      font-weight: bold;
      color: #ff6b35;
    }
  }

  .bar-chart {
    margin-top: 10px;
    .bar {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .name {
        width: 100px;
        font-weight: 500;
        margin-right: 15px;
      }
      .amount {
        margin-left: 15px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .ranking-item {
    .el-table {
      font-size: 14px;
    }
  }

  // 图表容器样式
  .chart-container {
    width: 100%;
    height: 400px;
    margin-top: 20px;
  }

  // 表格样式优化
  .el-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    
    th {
      background-color: #f5f7fa;
      font-weight: 500;
      color: #333;
    }
    
    td {
      padding: 12px 16px;
    }
  }

  // 进度条样式优化
  .el-progress {
    margin: 10px 0;
  }

  // 响应式设计
  @media (max-width: 768px) {
    .bar {
      flex-direction: column;
      align-items: flex-start;
      
      .name {
        width: auto;
        margin-bottom: 5px;
      }
      
      .amount {
        margin-left: 0;
      }
    }
    
    .chart-container {
      height: 300px;
    }
  }
}
</style>