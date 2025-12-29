<template>
  <div class="legal-leader-performance">
    <!-- 客户统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>客户统计</h3>
          </div>
          <div class="statistic-content">
            <div v-for="(cityData, cityCode) in cityPerformanceData" :key="cityCode" class="city-stat-item">
              <div class="city-header">
                <span class="city-name">{{ cityData.cityName }}</span>
              </div>
              <div class="stat-item">
                <span class="label">客户数量：</span>
                <span class="value">{{ cityData.customerTotal }}</span>
                <span class="label">近20天未跟进客户：</span>
                <span class="value">{{ cityData.outStandingTotal }}</span>
              </div>
              <div class="stat-item">
                <span class="label">意向客户数量：</span>
                <span class="value">{{ cityData.intentionTotal }}</span>
                <span class="label">前2后2临期客户数量：</span>
                <span class="value">{{ cityData.expiringTotal }}</span>
                <span class="label">尾款客户数量：</span>
                <span class="value">{{ cityData.balanceTotal }}</span>
              </div>
              
              <!-- 城市任务进度 -->
              <div class="progress-item">
                <h4>{{ cityData.cityName }}月度业绩完成率</h4>
                <el-progress
                  :percentage="calculateCityPerformanceRate(cityData.teamPerformance)"
                  :format="(percent) => `${percent}%`"
                  color="#1890ff"
                  :stroke-width="20"
                />
                <div class="progress-info">
                  <span>已完成：{{ formatCurrency(cityData.teamPerformance?.teamMonthAchievedBalance || 0) }}</span>
                  <span>目标：{{ formatCurrency(cityData.teamPerformance?.teamMonthPerformanceGoal || 0) }}</span>
                </div>
              </div>
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
            <!-- 各城市业绩情况 -->
            <div class="city-performance-section">
              <h4>各城市月度/年度业绩情况</h4>
              <el-table :data="cityPerformanceList" stripe style="width: 100%">
                <el-table-column prop="cityName" label="城市" width="120" />
                <el-table-column prop="monthAchievedBalance" label="本月业绩" width="150">
                  <template #default="scope">
                    {{ formatCurrency(scope.row.monthAchievedBalance) }}
                  </template>
                </el-table-column>
                <el-table-column prop="yearAchievedBalance" label="年度业绩" width="150">
                  <template #default="scope">
                    {{ formatCurrency(scope.row.yearAchievedBalance) }}
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRate" label="月度完成率" width="120">
                  <template #default="scope">
                    {{ scope.row.monthPerformanceRate }}%
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRate" label="年度完成率" width="120">
                  <template #default="scope">
                    {{ scope.row.yearPerformanceRate }}%
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 个人业绩排名 -->
            <div class="personal-ranking-section">
              <h4>个人业绩排名</h4>
              <el-table :data="personalRankings" stripe style="width: 100%">
                <el-table-column prop="userName" label="姓名" width="120" />
                <el-table-column prop="monthAchievedBalance" label="本月业绩" width="150">
                  <template #default="scope">
                    {{ formatCurrency(scope.row.monthAchievedBalance) }}
                  </template>
                </el-table-column>
                <el-table-column prop="monthPerformanceRank" label="本月排名" width="120" />
                <el-table-column prop="yearAchievedBalance" label="年度业绩" width="150">
                  <template #default="scope">
                    {{ formatCurrency(scope.row.yearAchievedBalance) }}
                  </template>
                </el-table-column>
                <el-table-column prop="yearPerformanceRank" label="年度排名" width="120" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalLeaderPerformance" lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getLeaderPerformance } from '@/api/common'

// 数据响应式变量
const cityPerformanceData = ref<any>({})
const cityPerformanceList = ref<any[]>([])
const personalRankings = ref<any[]>([])

// 获取法务经理业绩数据
const fetchLeaderData = async () => {
  try {
    const response = await getLeaderPerformance()
    if (response && response.data) {
      // 处理返回的JSON对象数据
      cityPerformanceData.value = response.data
      
      // 构建城市业绩列表
      cityPerformanceList.value = Object.values(cityPerformanceData.value).map((city: any) => ({
        cityName: city.cityName,
        monthAchievedBalance: city.teamPerformance?.teamMonthAchievedBalance || 0,
        yearAchievedBalance: city.teamPerformance?.teamYearAchievedBalance || 0,
        monthPerformanceRate: calculateCityPerformanceRate(city.teamPerformance),
        yearPerformanceRate: calculateYearPerformanceRate(city.teamPerformance)
      }))
      
      // 构建个人业绩排名
      personalRankings.value = []
      Object.values(cityPerformanceData.value).forEach((city: any) => {
        if (city.teamPerformanceList && city.teamPerformanceList.length > 0) {
          city.teamPerformanceList.forEach((member: any) => {
            personalRankings.value.push({
              userName: member.userName,
              monthAchievedBalance: member.monthAchievedBalance,
              monthPerformanceRank: member.monthPerformanceRank,
              yearAchievedBalance: member.yearAchievedBalance,
              yearPerformanceRank: member.yearPerformanceRank
            })
          })
        }
      })
      
      // 按月度业绩排序
      personalRankings.value.sort((a, b) => b.monthAchievedBalance - a.monthAchievedBalance)
    }
  } catch (error) {
    console.error('获取经理业绩失败:', error)
  }
}

// 计算城市月度业绩完成率
const calculateCityPerformanceRate = (teamPerformance: any) => {
  if (!teamPerformance?.teamMonthPerformanceGoal) return 0
  return Math.round((teamPerformance.teamMonthAchievedBalance / teamPerformance.teamMonthPerformanceGoal) * 100)
}

// 计算城市年度业绩完成率
const calculateYearPerformanceRate = (teamPerformance: any) => {
  if (!teamPerformance?.teamYearPerformanceGoal) return 0
  return Math.round((teamPerformance.teamYearAchievedBalance / teamPerformance.teamYearPerformanceGoal) * 100)
}

// 格式化金额
const formatCurrency = (value: string | number) => {
  if (!value && value !== 0) return '¥0.00'
  return '¥' + parseFloat(value.toString()).toFixed(2)
}

onMounted(() => {
  fetchLeaderData()
})
</script>

<style lang="scss" scoped>
.legal-leader-performance {
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

  .city-stat-item {
    margin-bottom: 30px;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .city-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    
    .city-name {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
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

  .city-performance-section,
  .personal-ranking-section {
    margin-bottom: 20px;
    
    h4 {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

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

  // 响应式设计
  @media (max-width: 768px) {
    .city-stat-item {
      padding: 10px;
    }
    
    .city-header {
      margin-bottom: 10px;
    }
    
    .stat-item {
      margin-bottom: 10px;
    }
  }
}
</style>