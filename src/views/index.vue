<template>
  <div class="app-container home" style="background-image: url('@/assets/images/logoBackgroud.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    <el-row :gutter="10">
      <el-col :sm="12" :lg="12" style="padding-left: 10px">
        <h2>大成企业服务有限公司</h2>
      </el-col>

      <el-col :sm="12" :lg="12" style="padding-left: 10px">
        <div class="total-card">
          <div class="total-content">
            <i class="el-icon-user-solid" style="font-size: 24px; color: #409EFF;"></i>
            <div class="total-info">
              <div class="total-label">客户总数量</div>
              <div class="total-number">{{ totalCustomers }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据统计区域 -->
    <el-row :gutter="10" class="mb-4">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ statisticsTitle }}</span>
              <el-button type="primary" size="small" @click="showFilterDialog = true" style="margin-left: 10px;">
                筛选
              </el-button>
            </div>
          </template>

          <!-- 数据表格 -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-table :data="serviceData" style="width: 100%" border size="small">
                <el-table-column prop="trackingCount" label="服务数量" width="120" />
                <el-table-column prop="customerCount" label="客户数量" width="120" />
                <el-table-column prop="insuranceCount" label="保单数量" width="120" />
                <el-table-column prop="riskDataCount" label="风险客户数量" width="120" />
                <el-table-column prop="refundDataCount" label="退费客户数量" width="120" />
                <el-table-column prop="refundAmountSum" label="退费金额" width="120" />
                <el-table-column prop="returnTrackingCount" label="回访次数" width="120" />
                <el-table-column prop="visitTrackingCount" label="出访次数" width="120" />
                <el-table-column prop="referralCount" label="转介绍客户数量" width="120" />
                <el-table-column prop="caseTrackingCount" label="案件总数" width="120" />
                <el-table-column prop="undoTrackingCount" label="待处理数量" width="120" />
                <el-table-column prop="doingTrackingCount" label="跟进中数量" width="120" />
                <el-table-column prop="didTrackingCount" label="已完结数量" width="120" />
              </el-table>
            </el-col>
            <!-- <el-col :span="4">
              <el-table :data="riskRefundData" style="width: 100%" border size="small">
                <el-table-column prop="name" label="风险退费数据" width="120" />
                <el-table-column prop="count" label="数量/金额" width="120" />
              </el-table>
            </el-col> -->
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选弹窗 -->
    <el-dialog v-model="showFilterDialog" title="数据筛选" width="500px" append-to-body>
      <el-form :model="filterForm" label-width="60px" size="small">
        <el-form-item label="年份">
          <el-select v-model="filterForm.year" placeholder="请选择年份" clearable style="width: 100%">
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="月份">
          <el-select v-model="filterForm.month" placeholder="请选择月份" clearable style="width: 100%">
            <el-option
              v-for="item in 12"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-select v-model="filterForm.day" placeholder="请选择日期" clearable style="width: 100%">
            <el-option
              v-for="item in daysInMonth"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="法务支持">
              <el-select filterable v-model="filterForm.lawyerId" placeholder="请选择法务支持人员" clearable
                style="width: 100%;">
                <el-option v-for="lawyer in lawyerList" :key="lawyer.userId"
                  :label="lawyer.nickName + '(' + lawyer.userName + ')'" :value="lawyer.userId" filterable></el-option>
              </el-select>
            </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showFilterDialog = false">取消</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="handleFilterConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 客户总览区域 -->
    <el-row :gutter="10">
      <el-col :sm="24" :lg="24">
        <el-card>
          <el-row :gutter="5" align="middle">
            <!-- 右侧：图表区域 -->
            <el-col :sm="16" :lg="18">
              <el-row :gutter="10">
                <!-- 左侧柱状图 -->
                <el-col :sm="12" :lg="12">
                  <div ref="barChartRef" style="width: 100%; height: 300px;"></div>
                </el-col>
                <!-- 右侧饼状图 -->
                <el-col :sm="12" :lg="12">
                  <div ref="chartRef" style="width: 100%; height: 300px;"></div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-divider style="margin: 10px 0;" />
  </div>
</template>

<script setup name="Index" lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import { getCustomerType, getCustomerCategory, getRiskRefundData } from '@/api/common'
import { getServiceData } from '@/api/common'
import { listLawyerSupport } from '@/api/customerInfo/customerInfo'


const chartRef = ref()
const barChartRef = ref()
const totalCustomers = ref(0)
const showFilterDialog = ref(false) // 控制筛选弹窗显示
let chartInstance: any = null
let barChartInstance: any = null
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 数据统计筛选表单
const filterForm = reactive({
  year: undefined as number | undefined,
  month: undefined as number | undefined,
  day: undefined as number | undefined,
  lawyerId: undefined as string | undefined
})

// 数据统计表格数据
const serviceData = ref([])

// 退费风险数据数据
const riskRefundData = ref([
  { name: '风险客户数量', count: 0, type: 'riskDataCount' },
  { name: '退费客户数量', count: 0, type: 'refundDataCount' },
  { name: '退费金额', count: 0, type: 'refundAmount' }
])

// 年份选项（近10年）
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => currentYear - i)
})

// 月份天数
const daysInMonth = computed(() => {
  if (!filterForm.year || !filterForm.month) {
    return Array.from({ length: 31 }, (_, i) => i + 1)
  }

  const date = new Date(filterForm.year, filterForm.month, 0)
  return Array.from({ length: date.getDate() }, (_, i) => i + 1)
})

// 获取服务数据
const fetchServiceData = async () => {
  try {
    const res = await getServiceData({
      year: filterForm.year,
      month: filterForm.month,
      day: filterForm.day,
      lawyerId:filterForm.lawyerId
    })
    serviceData.value=res.data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 获取退费风险数据
const fetchRiskRefundData = async () => {
  try {
    const res = await getRiskRefundData({
      year: filterForm.year,
      month: filterForm.month,
      day: filterForm.day
    })

    // 更新表格数据
    riskRefundData.value[0].count = res.data.riskDataCount || 0
    riskRefundData.value[1].count = res.data.refundDataCount || 0
    riskRefundData.value[2].count = res.data.refundAmountSum || 0
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.year = undefined
  filterForm.month = undefined
  filterForm.day = undefined
  filterForm.lawyerId = undefined
  fetchServiceData()
  //fetchRiskRefundData()
}

// 筛选确认
const handleFilterConfirm = () => {
  fetchServiceData()
 // fetchRiskRefundData()
  showFilterDialog.value = false
}

// 客户类型映射
const customerTypeMap: Record<number, string> = {
  0: 'A类客户',
  1: 'B类客户',
  2: 'C类客户',
  3: 'D类客户'
}

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
}

const loadCustomerTypeData = () => {
  getCustomerType().then(res => {
    // 计算客户总数量
    totalCustomers.value = res.data.reduce((total: number, item: any) => total + item.count, 0)

    const data = res.data.map((item: any) => ({
      value: item.count,
      name: customerTypeMap[item.customer_type]
    }))

    const option = {
      title: {
        text: '客户类型分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          name: '客户类型',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    chartInstance.setOption(option)
  })
}

const goTarget = (url: string) => {
  window.open(url, '__blank')
}

const initBarChart = () => {
  barChartInstance = echarts.init(barChartRef.value)
}

 const statisticsTitle = computed(() => {
   if (filterForm.year || filterForm.month || filterForm.day) {
     let title = '';
     if (filterForm.year) title += `${filterForm.year}年`;
     if (filterForm.month) title += `${filterForm.month}月`;
     if (filterForm.day) title += `${filterForm.day}日`;
     return `${title}数据统计`;
   } else {
     // 默认显示当前年月
     const now = new Date();
     //return `${now.getFullYear()}年${now.getMonth() + 1}月数据统计`;
     return `${now.getFullYear()}年数据统计`;
   }
 });

const lawyerList = ref([]);
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

const loadCustomerCategoryData = () => {
  getCustomerCategory().then(res => {
    const data = res.data
    const option = {
      title: {
        text: '客户分类统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['意向客户', '风险客户', '退费客户']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [data.intention_count || 0, data.risk_count || 0, data.refund_count || 0],
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            color: function(params: any) {
              const colors = ['#5470c6', '#fac858', '#ee6666']
              return colors[params.dataIndex]
            }
          }
        }
      ]
    }

    barChartInstance.setOption(option)
  })
}

onMounted(() => {
  initChart()
  initBarChart()
  loadCustomerTypeData()
  loadCustomerCategoryData()
  loadLawyerSupportList()
  fetchServiceData() // 加载服务数据
  //fetchRiskRefundData() // 加载退费风险数据
})
</script>

<style lang="scss" scoped>
.home {
  background-image: url('@/assets/images/logoBackgroud.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;

  blockquote {
    padding: 5px 10px;
    margin: 0 0 10px;
    font-size: 14px;
    border-left: 3px solid #eee;
  }
  hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 10px;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #676a6c;
  overflow-x: hidden;

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 100;
  }

  p {
    margin-top: 5px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      margin-block-start: 0.5em;
      margin-block-end: 0.5em;
      padding-inline-start: 20px;
    }
  }

  // 调整客户总数量卡片样式
  .total-card {
    height: 100%;
    display: flex;
    align-items: center;

    .total-content {
      display: flex;
      align-items: center;
      width: 100%;

      .total-info {
        margin-left: 5px;

        .total-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 2px;
        }

        .total-number {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  .card-header {
    font-size: 16px;
    font-weight: bold;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }
}
</style>
