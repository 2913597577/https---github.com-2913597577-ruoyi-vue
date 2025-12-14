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
              <span class="value">{{ teamCustomerCount.total }}</span>
              <span class="label">近30天未跟进客户：</span>
              <span class="value">{{ teamCustomerCount.noTracking }}</span>
            </div>
            <div class="stat-item">
              <span class="label">意向客户数量：</span>
              <span class="value">{{ teamCustomerCount.intention }}</span>
              <span class="label">前2后2临期客户数量：</span>
              <span class="value">{{ teamCustomerCount.expiring }}</span>
              <span class="label">尾款客户数量：</span>
              <span class="value">{{ teamCustomerCount.balance }}</span>
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
              <h4>团队任务进度</h4>
              <el-progress
                :percentage="teamProgress"
                :format="(percent) => `${percent}%`"
                color="#1890ff"
                :stroke-width="20"
              />
            </div>

            <!-- 成员任务完成柱状图 -->
            <div class="chart-item">
              <h4>团队内各成员任务完成情况柱状图</h4>
              <div class="bar-chart">
                <div v-for="(member, index) in teamMembers" :key="index" class="bar">
                  <span class="name">{{ member.name }}</span>
                  <el-progress
                    :percentage="member.completedRate"
                    :format="(percent) => `${percent}%`"
                    :width="200"
                    :stroke-width="10"
                    color="#f56a00"
                  />
                </div>
              </div>
            </div>

            <!-- 成员业绩排名 -->
            <div class="ranking-item">
              <h4>团队内成员业绩排名</h4>
              <el-table :data="rankings" stripe style="width: 100%">
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="achievement" label="业绩金额" width="120" />
                <el-table-column prop="rank" label="排名" width="80" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalSupervisorPerformance" lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLegalSupportPerformance } from '@/api/common'

// 数据响应式变量
const teamCustomerCount = ref<any>({})
const teamProgress = ref(0)
const teamMembers = ref<any[]>([])
const rankings = ref<any[]>([])

// 获取法务主管业绩数据
const fetchSupervisorData = async () => {
  try {
    const response = await getLegalSupportPerformance()
    if (response && response.data) {
      teamCustomerCount.value = response.data.customerCount
      teamProgress.value = response.data.teamProgress || 0
      teamMembers.value = response.data.members || []
      rankings.value = response.data.rankings || []
    }
  } catch (error) {
    console.error('获取主管业绩失败:', error)
  }
}

onMounted(() => {
  fetchSupervisorData()
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
  }

  .progress-item,
  .chart-item,
  .ranking-item {
    margin-bottom: 20px;
  }

  .bar-chart {
    margin-top: 10px;
    .bar {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .name {
        width: 100px;
        font-weight: 500;
      }
    }
  }

  .ranking-item {
    .el-table {
      font-size: 14px;
    }
  }
}
</style>
