<template>
  <el-container class="main-layout">
    <el-aside 
      :width="isCollapse ? '64px' : '200px'" 
      class="sidebar"
      :class="{ 'sidebar-collapsed': isCollapse }"
    >
      <div class="logo">
        <h2 :class="{ 'logo-collapsed': isCollapse }">{{ isCollapse ? '景区' : '景区管理平台' }}</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
      >
        <el-menu-item index="/admin/resource">
          <el-icon><icon-menu /></el-icon>
          <span slot="title">资源管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/checkin">
          <el-icon><location /></el-icon>
          <span slot="title">打卡点管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/merchant">
          <el-icon><shop /></el-icon>
          <span slot="title">商家管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentMenu }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-actions">
            <el-button @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/admin/stores/user'
import { 
  Menu as IconMenu, 
  Location, 
  Shop 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activeMenu = ref('/admin/resource')
const currentMenu = ref('资源管理')
const isCollapse = ref(false)

const handleSelect = (index) => {
  router.push(index)
  currentMenu.value = getMenuName(index)
}

const getMenuName = (path) => {
  const menuMap = {
    '/admin/resource': '资源管理',
    '/admin/checkin': '打卡点管理',
    '/admin/merchant': '商家管理'
  }
  return menuMap[path] || '首页'
}

const handleLogout = () => {
  userStore.logout()
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  activeMenu.value = route.path
  currentMenu.value = getMenuName(route.path)
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 64px !important;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.logo-collapsed {
  font-size: 16px;
  padding-left: 20px;
}

.el-menu {
  border-right: none;
  background: transparent;
}

.el-menu-item {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

.el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  border-left: 4px solid #60a5fa;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.el-menu-item span {
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .el-menu-item span {
  opacity: 0;
  width: 0;
  display: none;
}

.header {
  background: linear-gradient(90deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
}

/* 添加平滑过渡效果 */
.el-aside {
  transition: width 0.3s ease;
}

.el-menu {
  transition: all 0.3s ease;
}

.el-menu-item {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px !important;
  }
  
  .logo-collapsed {
    font-size: 14px;
  }
  
  .sidebar-collapsed .el-menu-item span {
    display: none;
  }
}
</style>
