<template>
  <div class="app-container home" style="background-image: url('@/assets/images/logoBackgroud.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    <el-row :gutter="10">
      <el-col :sm="12" :lg="12" style="padding-left: 10px">
        <h2>大成企业服务有限公司</h2>
      </el-col>

      <el-col :sm="12" :lg="12" style="padding-left: 10px">
        <!-- <el-col :sm="8" :lg="6"> -->
              <div class="total-card">
                <div class="total-content">
                  <i class="el-icon-user-solid" style="font-size: 24px; color: #409EFF;"></i>
                  <div class="total-info">
                    <div class="total-label">客户总数量</div>
                    <div class="total-number">{{ totalCustomers }}</div>
                  </div>
                </div>
              </div>
            <!-- </el-col> -->
      </el-col>
    </el-row>
    
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
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getCustomerType, getCustomerCategory } from '@/api/common'


const chartRef = ref()
const barChartRef = ref() // 新增柱状图引用
const totalCustomers = ref(0)
let chartInstance: any = null
let barChartInstance: any = null // 新增柱状图实例


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
  initBarChart() // 初始化柱状图
  loadCustomerTypeData()
  loadCustomerCategoryData() // 加载客户分类数据
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
}
</style>