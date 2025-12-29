<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="财务类型" prop="financialType">
              <el-select v-model="queryParams.financialType" placeholder="请选择财务类型" clearable>
                <el-option v-for="dict in dc_financial_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="归属城市" prop="city">
              <el-select v-model="queryParams.city" placeholder="请选择业绩归属城市" clearable>
                <el-option v-for="dict in dc_sercive_city" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="流水时间范围">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">城市收支统计</span>
          <div>
            <el-radio-group v-model="chartType" size="small">
              <el-radio-button label="income">进账</el-radio-button>
              <el-radio-button label="expense">支出</el-radio-button>
              <el-radio-button label="both">全部</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <div class="chart-container" style="height: 400px;">
        <v-chart :option="barChartOption" autoresize />
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="text-lg font-medium">来源类型占比</div>
          </template>
          <div class="chart-container" style="height: 400px;">
            <v-chart :option="pieChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="text-lg font-medium">财务类型分布</div>
          </template>
          <div class="chart-container" style="height: 400px;">
            <v-chart :option="financialTypeChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="FinancialStatisticsChart" lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { FinancialStatisticsVO, FinancialStatisticsQuery } from '@/api/financialStatistics/financialStatistics/types';
import { getFinancialStatisticsData } from '@/api/financialStatistics/financialStatistics';

// 注册ECharts组件
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent
]);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { dc_financial_type, dc_financial_source_type, dc_sercive_city } = toRefs<any>(proxy?.useDict('dc_financial_type', 'dc_financial_source_type', 'dc_sercive_city'));

const showSearch = ref(true);
const chartType = ref<'income' | 'expense' | 'both'>('both');
const dateRange = ref<[string, string] | null>(null);

const queryParams = reactive({
  financialType: undefined,
  city: undefined,
  flowTime: undefined,
  params: {}
});

// 统计数据
const cityStatistics = ref<any[]>([]);
const sourceTypeStatistics = ref<any[]>([]);
const financialTypeStatistics = ref<any[]>([]);

// 柱状图配置
const barChartOption = computed(() => {
  // 根据城市统计数据生成柱状图
  const cities = cityStatistics.value.map(item => item.cityName);
  const incomeData = cityStatistics.value.map(item => item.incomeTotal || 0);
  const expenseData = cityStatistics.value.map(item => item.expenseTotal || 0);

  const series = [];
  if (chartType.value === 'income' || chartType.value === 'both') {
    series.push({
      name: '进账',
      type: 'bar',
      data: incomeData,
      itemStyle: {
        color: '#5cb85c'
      }
    });
  }
  if (chartType.value === 'expense' || chartType.value === 'both') {
    series.push({
      name: '支出',
      type: 'bar',
      data: expenseData,
      itemStyle: {
        color: '#d9534f'
      }
    });
  }

  return {
    title: {
      text: '各城市收支统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = params[0].axisValue + '<br/>';
        params.forEach((item: any) => {
          result += item.marker + ' ' + item.seriesName + '：' + item.value + ' 元<br/>';
        });
        return result;
      }
    },
    legend: {
      data: chartType.value === 'both' ? ['进账', '支出'] : [chartType.value === 'income' ? '进账' : '支出'],
      top: '10%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: cities,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    series: series
  };
});

// 饼状图配置 - 来源类型占比
const pieChartOption = computed(() => {
  return {
    title: {
      text: '来源类型占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: '20%'
    },
    series: [
      {
        name: '来源类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: sourceTypeStatistics.value.map(item => ({
          value: item.total,
          name: getDictLabel(dc_financial_source_type.value, item.sourceType)
        }))
      }
    ]
  };
});

// 财务类型分布饼图
const financialTypeChartOption = computed(() => {
  return {
    title: {
      text: '财务类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: '20%'
    },
    series: [
      {
        name: '财务类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: financialTypeStatistics.value.map(item => ({
          value: item.total,
          // 将财务类型数字值转换为对应的字典标签
          name: getFinancialTypeLabel(item.financialType)
        }))
      }
    ]
  };
});

// 获取字典标签
const getDictLabel = (dictList: any[], value: string) => {
  const dict = dictList.find(item => item.value === value);
  return dict ? dict.label : value;
};

// 获取财务类型标签（1-收入，2-支出）
const getFinancialTypeLabel = (financialType: number | string) => {
  if (financialType === 1 || financialType === '1') {
    return '收入';
  } else if (financialType === 2 || financialType === '2') {
    return '支出';
  }
  // 如果没有匹配的值，尝试从数据字典中查找
  const dict = dc_financial_type.value?.find((item: any) => item.value == financialType);
  return dict ? dict.label : financialType.toString();
};

// 获取统计数据分析
const getStatisticsData = async () => {
  try {
    // 使用定义好的API函数调用后端接口
    const params = {
      ...queryParams,
      startTime: dateRange.value ? dateRange.value[0] : undefined,
      endTime: dateRange.value ? dateRange.value[1] : undefined
    };
    
    const res = await getFinancialStatisticsData(params);
    
    if (res.code === 200) {
      cityStatistics.value = res.data.cityStatistics || [];
      sourceTypeStatistics.value = res.data.sourceTypeStatistics || [];
      financialTypeStatistics.value = res.data.financialTypeStatistics || [];
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 搜索按钮操作
const handleQuery = () => {
  // 如果设置了时间范围，更新queryParams
  if (dateRange.value) {
    queryParams.flowTime = dateRange.value[0] + ',' + dateRange.value[1];
  } else {
    queryParams.flowTime = undefined;
  }
  
  getStatisticsData();
};

// 重置按钮操作
const resetQuery = () => {
  queryParams.financialType = undefined;
  queryParams.city = undefined;
  dateRange.value = null;
  queryParams.flowTime = undefined;
  getStatisticsData();
};

// 初始化数据
onMounted(() => {
  getStatisticsData();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>