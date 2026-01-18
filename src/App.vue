<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/admin/stores/user'

// 初始化用户状态
const userStore = useUserStore()
const router = useRouter()

// 全局错误处理
const errorHandler = (error) => {
  if (error.response) {
    const status = error.response.status
    if (status === 401) {
      userStore.logout()
      router.push('/admin/login')
      ElMessage.error('登录已过期，请重新登录')
    } else if (status === 403) {
      ElMessage.error('没有权限访问此功能')
    } else if (status === 500) {
      ElMessage.error('服务器内部错误')
    } else {
      ElMessage.error(`请求失败: ${error.response.data.msg || '未知错误'}`)
    }
  } else if (error.request) {
    ElMessage.error('网络连接失败，请检查网络')
  } else {
    ElMessage.error(`请求错误: ${error.message}`)
  }
}

// 全局事件监听
const handleKeyPress = (event) => {
  if (event.key === 'Escape') {
    // 按ESC键关闭所有弹窗
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  userStore.checkLoginStatus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style>
/* 全局样式 */
#app {
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 全局按钮 hover 效果 */
.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 全局表格样式 */
.el-table {
  border-radius: 4px;
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

.el-table td {
  padding: 12px 0;
}

/* 全局表单样式 */
.el-form-item {
  margin-bottom: 22px;
}

.el-form-item__label {
  font-weight: 500;
  color: #606266;
  padding: 0 12px 0 0;
}

/* 全局卡片样式 */
.el-card {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: none;
}

.el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-card__body {
  padding: 20px;
}

/* 全局提示框样式 */
.el-message {
  min-width: 300px;
}

/* 全局加载状态 */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 全局弹窗样式 */
.el-dialog {
  border-radius: 4px;
}

.el-dialog__header {
  padding: 20px 20px 10px;
}

.el-dialog__title {
  font-weight: 600;
  color: #303133;
}

.el-dialog__body {
  padding: 20px;
}

/* 全局分页样式 */
.el-pagination {
  margin-top: 20px;
  text-align: right;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .el-menu {
    display: flex;
    flex-wrap: wrap;
  }

  .el-menu-item {
    width: 33.33%;
    text-align: center;
    padding: 10px 0;
  }
}
</style>
