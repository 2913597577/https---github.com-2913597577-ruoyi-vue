<template>
  <div class="legal-supervisor-performance">
    <!-- 客户统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>客户统计</h3>
          </div>
          <div class="statistic-content">
            <div class="stat-item">
              <span class="label">客户数量：</span>
              <span class="value">{{ customerStats.customerTotal }}</span>
              <span class="label">近30天未跟进客户：</span>
              <span class="value">{{ customerStats.outStandingTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">意向客户数量：</span>
              <span class="value">{{ customerStats.intentionTotal }}</span>
              <span class="label">前2后2临期客户数量：</span>
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
            <h3>业绩展示</h3>
          </div>
          <div class="performance-content">
            <!-- 团队任务进度 -->
            <div class="progress-item">
              <h4>团队月度业绩完成率</h4>
              <el-progress
                :percentage="teamPerformanceRate"
                :format="(percent) => `${percent}%`"
                color="#1890ff"
                :stroke-width="20"
              />
              <div class="progress-info">
                <span>已完成：{{ formatCurrency(teamPerformance.teamMonthAchievedBalance) }}</span>
                <span>目标：{{ formatCurrency(teamPerformance.teamMonthPerformanceGoal) }}</span>
              </div>
            </div>

            <!-- 年度业绩 -->
            <div class="annual-performance">
              <h4>年度累计业绩</h4>
              <div class="annual-amount">
                {{ formatCurrency(teamPerformance.teamYearAchievedBalance) }}
              </div>
            </div>

            <!-- 成员任务完成柱状图 -->
            <div class="chart-item">
              <h4>团队内各成员任务完成情况柱状图</h4>
              <div ref="chartRef" class="chart-container"></div>
            </div>

            <!-- 成员业绩排名 -->
            <div class="ranking-item">
              <h4>团队内成员业绩排名</h4>
              <el-table :data="memberRankings" stripe style="width: 100%">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="monthAchievedBalance" label="业绩金额" width="120">
                  <template #default="scope">
                    {{ formatCurrency(scope.row.monthAchievedBalance) }}
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRank" label="排名" width="80" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalSupervisorPerformance" lang="ts">
import { ref, onMounted, computed, watch } from 'vue'  // 添加了watch导入
import { getPerformance } from '@/api/common'
import * as echarts from 'echarts'

// 数据响应式变量
const performanceData = ref<any>({})
const chartRef = ref<HTMLDivElement | null>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

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

const teamPerformanceRate = computed(() => {
  if (!teamPerformance.value.teamMonthPerformanceGoal) return 0
  return Math.round((teamPerformance.value.teamMonthAchievedBalance / teamPerformance.value.teamMonthPerformanceGoal) * 100)
})

const memberRankings = computed(() => {
  return [...teamPerformanceList.value]
    .sort((a, b) => (a.monthPerformanceRank || 999) - (b.monthPerformanceRank || 999))
    .slice(0, 10)
})

// 获取法务主管业绩数据
const fetchSupervisorData = async () => {
  try {
    const response = await getPerformance()
    if (response && response.data) {
      performanceData.value = response.data
      
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

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  const data = teamPerformanceList.value.map((member: any) => ({
    name: member.userName,
    achievement: parseFloat(member.monthAchievedBalance || '0'),
    visit: parseFloat(member.monthVisitGoal || '0')
  }))
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const value = params[0].value
        return `${params[0].name}<br/>业绩任务: ¥${value[1].toFixed(2)}<br/>出访任务: ${value[2]}`
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '金额/次数',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '业绩任务',
        type: 'bar',
        barWidth: '30%',
        data: data.map(item => item.achievement),
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '出访任务',
        type: 'bar',
        barWidth: '30%',
        data: data.map(item => item.visit),
        itemStyle: {
          color: '#f56a00'
        }
      }
    ]
  }
  
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = echarts.init(chartRef.value)
  } else {
    chartInstance.value = echarts.init(chartRef.value)
  }
  chartInstance.value.setOption(option)
}

// 监听数据变化
watch(
  () => performanceData.value,
  () => {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
    if (teamPerformanceList.value.length > 0) {
      setTimeout(() => {
        initChart()
      }, 100)
    }
  },
  { deep: true }
)

onMounted(() => {
  fetchSupervisorData()
  // 延迟初始化图表，等待数据加载
  setTimeout(() => {
    initChart()
  }, 300)
})

// 组件销毁时清理图表
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
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
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;
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
    font-size: 16px;
    font-weight: 600;
    color: #1890ff;
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
      color: #1890ff;
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