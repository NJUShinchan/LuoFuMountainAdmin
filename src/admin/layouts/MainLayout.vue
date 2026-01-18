<!-- src/admin/layouts/MainLayout.vue -->
<template>
  <el-container class="main-layout">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <h2>景区管理平台</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="/admin/resource">
          <el-icon><icon-menu /></el-icon>
          <span>资源管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/checkin">
          <el-icon><location /></el-icon>
          <span>打卡点管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/merchant">
          <el-icon><shop /></el-icon>
          <span>商家管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentMenu }}</el-breadcrumb-item>
          </el-breadcrumb>
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
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  activeMenu.value = route.path
  currentMenu.value = getMenuName(route.path)
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: #fff;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #20232a;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  color: #bfcbd9;
}

.el-menu-item.is-active {
  background-color: #263445;
  color: #fff;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
