<template>
  <div class="container">
    <el-drawer
      v-model="visible"
      :size="props.width"
      :with-header="false"
      :close-on-click-modal="false"
      direction="rtl"
      class="approval-drawer"
    >
      <div class="drawer-header">
        <div class="header-title">
          <span class="title-text">物流信息</span>
          <el-icon class="close-icon" @click="visible = false">
            <Close />
          </el-icon>
        </div>
      </div>
      
      <div class="drawer-content">
        <div v-loading="loading" class="timeline-container">
          <!-- 当前状态指示器（顶部紧凑版） -->
          <div v-if="historyList.length > 0" class="compact-status-indicator">
            <div class="indicator-icon">
              <el-icon><InfoFilled /></el-icon>
            </div>
            <div class="indicator-text">
              <span class="label">当前审批状态:</span>
              <dict-tag 
                class="status-tag" 
                :options="wf_task_status" 
                :value="getCurrentStatus()"
                size="small"
              />
            </div>
          </div>
          
          <!-- 时间轴 - 倒序排列 -->
          <el-timeline v-if="historyList.length > 0" class="compact-timeline">
            <el-timeline-item
              v-for="(item, index) in reversedHistoryList"
              :key="index"
              :timestamp="item.createTime"
              :type="getTimelineType(item.flowStatus)"
              :color="getTimelineColor(item.flowStatus)"
              placement="top"
              :hide-timestamp="false"
              class="compact-timeline-item"
            >
              <!-- 时间轴节点 -->
              <div class="compact-timeline-card" :class="getCardClass(item.flowStatus)">
                <!-- 节点头部紧凑布局 -->
                <div class="compact-card-header">
                  <div class="compact-node-info">
                    <div class="node-name-status">
                      <span class="compact-node-name">{{ item.nodeName }}</span>
                      <dict-tag 
                        class="compact-status-tag" 
                        :options="wf_task_status" 
                        :value="item.flowStatus"
                        size="small"
                      />
                    </div>
                    
                    <!-- 紧凑时间信息 -->
                    <div class="compact-time-info">
                      <div class="compact-time-item">
                        <el-icon class="time-icon"><Clock /></el-icon>
                        <span class="time-text">{{ formatCompactTime(item.createTime) }}</span>
                      </div>
                      <div v-if="item.updateTime" class="compact-time-item">
                        <el-icon class="time-icon"><Check /></el-icon>
                        <span class="time-text">{{ formatCompactTime(item.updateTime) }}</span>
                      </div>
                      <div v-if="item.runDuration" class="compact-time-item">
                        <el-icon class="time-icon"><Timer /></el-icon>
                        <span class="time-text">{{ item.runDuration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 紧凑办理人 -->
                <div v-if="item.approveName" class="compact-card-section">
                  <div class="compact-section-title">
                    <el-icon class="section-icon"><User /></el-icon>
                    <span class="section-text">办理人</span>
                  </div>
                  <div class="compact-approver-list">
                    <template v-if="item.approveName">
                      <el-tag 
                        v-for="(name, idx) in item.approveName.split(',')" 
                        :key="idx" 
                        size="small"
                        :type="getApproverTagType(item.flowStatus)"
                        class="compact-approver-tag"
                      >
                        {{ name }}
                      </el-tag>
                    </template>
                  </div>
                </div>
                
                <!-- 紧凑审批意见 -->
                <div v-if="item.message" class="compact-card-section">
                  <div class="compact-section-title">
                    <el-icon class="section-icon"><ChatLineRound /></el-icon>
                    <span class="section-text">审批意见</span>
                  </div>
                  <div class="compact-message-content">
                    {{ item.message }}
                  </div>
                </div>
                
                <!-- 紧凑附件 -->
                <div v-if="item.attachmentList && item.attachmentList.length > 0" class="compact-card-section">
                  <div class="compact-section-title">
                    <el-icon class="section-icon"><Paperclip /></el-icon>
                    <span class="section-text">附件 ({{ item.attachmentList.length }})</span>
                  </div>
                  <div class="compact-attachment-list">
                    <div 
                      v-for="(attachment, attIndex) in item.attachmentList" 
                      :key="attIndex" 
                      class="compact-attachment-item"
                      @click="handleDownload(attachment.ossId)"
                    >
                      <el-icon class="compact-attachment-icon"><Document /></el-icon>
                      <span class="compact-attachment-name">{{ attachment.originalName }}</span>
                      <el-icon class="compact-attachment-icon"><Download /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          
          <!-- 紧凑空状态 -->
          <div v-else class="compact-empty-state">
            <el-icon class="empty-icon"><Notebook /></el-icon>
            <span class="empty-text">暂无审批记录</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { flowHisTaskList } from '@/api/workflow/instance';
import { propTypes } from '@/utils/propTypes';
import { listByIds } from '@/api/system/oss';
import { 
  Close, 
  Paperclip, 
  Clock, 
  Check, 
  Timer, 
  User, 
  ChatLineRound, 
  Document, 
  Download,
  Notebook,
  InfoFilled
} from '@element-plus/icons-vue';
import { onMounted, ref, computed } from 'vue';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { wf_task_status } = toRefs<any>(proxy?.useDict('wf_task_status'));
const props = defineProps({
  width: propTypes.string.def('400px'), // 更窄的宽度
  height: propTypes.string.def('100%')
});

const loading = ref(false);
const visible = ref(false);
const historyList = ref<Array<any>>([]);

// 计算属性：获取倒序排列的审批记录
const reversedHistoryList = computed(() => {
  return [...historyList.value].reverse();
});

// 初始化查询审批记录
const init = async (businessId: string | number) => {
  visible.value = true;
  loading.value = true;
  historyList.value = [];
  
  try {
    const resp = await flowHisTaskList(businessId);
    if (resp.data) {
      // 按创建时间正序排序（最早的在前）
      const sortedList = [...resp.data.list].sort((a, b) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      });
      historyList.value = sortedList;
      
      // 并行获取附件信息
      if (historyList.value.length > 0) {
        const attachmentPromises = historyList.value.map(async (item) => {
          if (item.ext) {
            try {
              const res = await getIds(item.ext);
              item.attachmentList = res.data || [];
            } catch (error) {
              item.attachmentList = [];
              console.error('获取附件信息失败:', error);
            }
          } else {
            item.attachmentList = [];
          }
        });
        
        await Promise.all(attachmentPromises);
      }
    }
  } catch (error) {
    console.error('获取审批记录失败:', error);
    proxy?.$modal.msgError('获取审批记录失败');
  } finally {
    loading.value = false;
  }
};

const getIds = async (ids: string | number) => {
  const res = await listByIds(ids);
  return res;
};

/** 下载按钮操作 */
const handleDownload = (ossId: string) => {
  proxy?.$download.oss(ossId);
};

/** 格式化时间 - 紧凑版 */
const formatCompactTime = (time: string) => {
  if (!time) return '';
  return dayjs(time).format('MM-DD HH:mm:ss');
};

/** 获取时间轴节点类型 */
const getTimelineType = (status: string) => {
  // 已审核完成的状态为绿色
  if (status === 'pass') return 'success';
  // 未审核（进行中、待处理等）为黄色
  if (['transfer', 'waiting', 'depute', 'copy', 'sign'].includes(status)) return 'warning';
  // 其他状态为灰色
  return 'info';
};

/** 获取时间轴节点颜色 */
const getTimelineColor = (status: string) => {
  // 已审核完成：绿色
  if (status === 'pass') return '#67c23a';
  // 未审核（进行中、待处理等）：黄色
  if (['transfer', 'waiting', 'depute', 'copy', 'sign'].includes(status)) return '#e6a23c';
  // 错误状态：红色
  if (['cancel', 'invalid', 'back', 'termination'].includes(status)) return '#f56c6c';
  // 其他：灰色
  return '#909399';
};

/** 获取卡片样式类 */
const getCardClass = (status: string) => {
  if (status === 'pass') return 'card-success'; // 已审核：绿色
  if (['transfer', 'waiting', 'depute', 'copy', 'sign'].includes(status)) return 'card-warning'; // 未审核：黄色
  if (['cancel', 'invalid', 'back', 'termination'].includes(status)) return 'card-danger';
  return 'card-default';
};

/** 获取办理人标签类型 */
const getApproverTagType = (status: string) => {
  if (status === 'pass') return 'success';
  if (['transfer', 'waiting', 'depute', 'copy', 'sign'].includes(status)) return 'warning';
  if (['cancel', 'invalid', 'back', 'termination'].includes(status)) return 'danger';
  return 'info';
};

/** 获取当前状态（最新的一条记录） */
const getCurrentStatus = () => {
  if (historyList.value.length === 0) return '';
  const lastItem = historyList.value[historyList.value.length - 1];
  return lastItem.flowStatus;
};

/**
 * 对外暴露子组件方法
 */
defineExpose({
  init
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
}

/* 抽屉样式 */
:deep(.el-drawer.rtl) {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.approval-drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 紧凑头部样式 */
.drawer-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.close-icon {
  font-size: 18px;
  color: #909399;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #409eff;
  }
}

/* 紧凑内容区域 */
.drawer-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 紧凑时间轴容器 */
.timeline-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 紧凑状态指示器 */
.compact-status-indicator {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border: 1px solid #d1e9ff;
  border-radius: 6px;
  margin-bottom: 16px;
}

.indicator-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #409eff;
  border-radius: 4px;
  margin-right: 10px;
  
  .el-icon {
    color: white;
    font-size: 14px;
  }
}

.indicator-text {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
}

/* 紧凑时间轴样式 */
.compact-timeline {
  padding: 0;
  
  :deep(.el-timeline-item) {
    padding-bottom: 16px;
    
    &:last-child {
      padding-bottom: 8px;
    }
    
    .el-timeline-item__node {
      width: 12px;
      height: 12px;
      border-width: 2px;
    }
    
    .el-timeline-item__tail {
      left: 5px;
    }
    
    .el-timeline-item__timestamp {
      font-size: 11px;
      color: #8c8c8c;
      margin-top: 2px;
    }
  }
}

/* 紧凑时间轴卡片 */
.compact-timeline-card {
  position: relative;
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-left: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border-left: 3px solid #409eff;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.card-success {
    border-left-color: #67c23a; /* 已审核：绿色 */
    background-color: rgba(103, 194, 58, 0.02);
  }
  
  &.card-warning {
    border-left-color: #e6a23c; /* 未审核：黄色 */
    background-color: rgba(230, 162, 60, 0.02);
  }
  
  &.card-danger {
    border-left-color: #f56c6c;
    background-color: rgba(245, 108, 108, 0.02);
  }
  
  &.card-default {
    border-left-color: #909399;
    background-color: #fafafa;
  }
}

/* 紧凑卡片头部 */
.compact-card-header {
  margin-bottom: 12px;
}

.compact-node-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.node-name-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.compact-node-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.compact-status-tag {
  font-size: 11px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
}

/* 紧凑时间信息 */
.compact-time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  margin-left: 8px;
}

.compact-time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #606266;
  
  .time-icon {
    font-size: 11px;
  }
  
  .time-text {
    white-space: nowrap;
  }
}

/* 紧凑卡片区域 */
.compact-card-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #f0f0f0;
  
  &:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
}

.compact-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  
  .section-icon {
    color: #606266;
    font-size: 12px;
  }
  
  .section-text {
    font-size: 12px;
  }
}

/* 紧凑办理人列表 */
.compact-approver-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.compact-approver-tag {
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  font-size: 11px;
  
  &:hover {
    transform: none;
  }
}

/* 紧凑审批意见 */
.compact-message-content {
  padding: 8px 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: #495057;
}

/* 紧凑附件列表 */
.compact-attachment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.compact-attachment-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
  }
}

.compact-attachment-icon {
  margin-right: 6px;
  color: #409eff;
  font-size: 12px;
}

.compact-attachment-name {
  flex: 1;
  font-size: 12px;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 紧凑空状态 */
.compact-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #c0c4cc;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #909399;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .drawer-header {
    padding: 10px 12px;
  }
  
  .title-text {
    font-size: 15px;
  }
  
  .timeline-container {
    padding: 12px;
  }
  
  .compact-status-indicator {
    padding: 8px 10px;
    margin-bottom: 12px;
  }
  
  .compact-timeline-card {
    padding: 10px;
    margin-left: 12px;
  }
  
  .compact-node-info {
    flex-direction: column;
    gap: 6px;
  }
  
  .compact-time-info {
    text-align: left;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }
}
</style>