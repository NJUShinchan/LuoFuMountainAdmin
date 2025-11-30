<template>
  <div class="admin-layout-wrapper">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo-container">
        <img v-if="!isCollapse" src="@/assets/logo.svg" alt="Logo" class="logo-img" />
        <span v-if="!isCollapse" class="logo-title">景区管理后台</span>
      </div>
      <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
      >
        <!-- 动态渲染菜单项 -->
        <template v-for="route in menuRoutes" :key="route.path">
          <el-menu-item v-if="!route.hidden" :index="route.path">
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="navbar">
        <div class="navbar-left">
          <el-icon class="fold-btn" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta.title">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="navbar-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span style="margin-left: 8px;">管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessageBox } from 'element-plus';

// --- 状态管理 ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// --- 响应式数据 ---
const isCollapse = ref(false); // 控制侧边栏折叠

// --- 计算属性 ---

/**
 * 当前激活的菜单项
 */
const activeMenu = computed(() => route.path);

/**
 * 当前路由对象
 */
const currentRoute = computed(() => route);

/**
 * 从路由配置中过滤出需要显示在菜单中的路由
 */
const menuRoutes = computed(() => {
  // 在 constantRoutes 中找到 children 数组
  const layoutRoute = router.options.routes.find(r => r.path === '/');
  return layoutRoute ? layoutRoute.children.filter(r => !r.hidden) : [];
});

// --- 方法 ---

/**
 * 切换侧边栏折叠状态
 */
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

/**
 * 处理退出登录
 */
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    authStore.logout();
    router.push('/login');
  }).catch(() => {});
};
</script>

<style lang="scss" scoped>
.admin-layout-wrapper {
  height: 100vh;
  display: flex;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  .logo-container {
    height: 60px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b2f3a;
    .logo-img {
      height: 40px;
      width: auto;
    }
    .logo-title {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      margin-left: 12px;
    }
  }
  .sidebar-menu {
    border-right: none;
    width: 100% !important;
  }
}

.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .navbar-left {
    display: flex;
    align-items: center;
    .fold-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
      &:hover {
        color: #409EFF;
      }
    }
  }
  .navbar-right {
    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
