<template>
  <div class="legal-support-performance">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20">
      <!-- 左侧统计信息 -->
      <el-col :span="16">
        <el-card class="statistic-card">
          <div class="statistic-header">
            <h3>客户信息统计</h3>
          </div>
          <div class="statistic-content">
            <div class="stat-item">
              <span class="label">客户数量：</span>
               <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.customerTotal }}</span>
              <span class="label">近30天未跟进客户：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.outstandingTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">意向客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerIntention')">{{ customerCount.intentionTotal }}</span>
              <span class="label">临期客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.expiringTotal }}</span>
              <span class="label">尾款客户数量：</span>
              <span class="value" @click="$router.push('/customer/customerInfo')">{{ customerCount.balanceTotal }}</span>
            </div>
            <div class="stat-item">
              <span class="label">本月内勤数量：</span>
              <span class="value" @click="$router.push('/legalSupport/customerTracking')" >{{ customerCount.trackingTotal }}</span>
              <span class="label">外勤数量：</span>
              <span class="value" @click="$router.push('/legalSupport/customerOutVisit')">{{ customerCount.outVisitTotal }}</span>
              <span class="label">保单数量：</span>
              <span class="value" @click="$router.push('/legalSupport/insuranceCase')">{{ customerCount.insuranceTotal }}</span>
              <span class="label">工单数量：</span>
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
            <div class="performance-item">
              <span class="label">本月业绩任务：</span>
              <span class="value" @click="$router.push('/salesStatistics/performanceTask')">{{ performanceCount.monthPerformanceGoal }}</span>
              <span class="label">已完成金额：</span>
              <span class="value" @click="$router.push('/salesStatistics/customerPerformance')">{{ formatCurrency(performanceCount.monthAchievedBalance) }}</span>
              <span class="label">出访任务：</span>
              <span class="value" @click="$router.push('/salesStatistics/performanceTask')">{{ performanceCount.monthVisitGoal }}</span>
              <span class="label">出访完成：</span>
              <span class="value" @click="$router.push('/legalSupport/customerOutVisit')">{{ customerCount.outVisitTotal }}</span>
            </div>
            <div class="performance-item">
              <span class="label">年度业绩累积金额：</span>
              <span class="value" @click="$router.push('/salesStatistics/customerPerformance')">{{ formatCurrency(performanceCount.yearAchievedBalance) }}</span>
              <span class="label">年度排名：</span>
              <span class="value">{{ performanceCount.yearPerformanceRank }}</span>
            </div>

            <!-- 套餐类型对比图表 -->
            <div class="chart-container">
              <h4>套餐类型对比</h4>
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
      <el-col :span="8">
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="legalSupportPerformance" lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 修改此行
import { getLegalSupportPerformance } from '@/api/common'

// 统计数据
const customerCount = ref<any>({})
const performanceCount = ref<any>({})
const neededInfo = ref<any[]>([])
const packageType = ref<any>([])
const router = useRouter()

// 获取法务支持业绩统计
const fetchPerformanceData = async () => {
  try {
    const response = await getLegalSupportPerformance()
    if (response && response.data) {
      // 解析客户统计数据
      customerCount.value = response.data.customerCount

      // 解析业绩统计数据
      performanceCount.value = response.data.performanceCount

      packageType.value = response.data.packageType

      // 解析待办事项数据
      neededInfo.value = response.data.neededInfo
    }
  } catch (error) {
    console.error('获取业绩统计失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchPerformanceData()
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
  .todo-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .statistic-header,
  .performance-header,
  .todo-header {
    
    padding: 15px 20px;
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
