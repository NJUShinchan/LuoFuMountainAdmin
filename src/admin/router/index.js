import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/admin/views/Login.vue'
import ResourceManage from '@/admin/views/ResourceManage.vue'
import CheckinManage from '@/admin/views/CheckinManage.vue'
import MerchantManage from '@/admin/views/MerchantManage.vue'
import MainLayout from '@/admin/layouts/MainLayout.vue'
import NotFound from '@/admin/views/404.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin/login'
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: Login,
    meta: { 
      requiresAuth: false, 
      hiddenLayout: true 
    }
  },
  {
    path: '/admin',
    component: MainLayout,
    meta: { 
      requiresAuth: true 
    },
    children: [
      {
        path: 'resource',
        name: 'ResourceManage',
        component: ResourceManage,
        meta: { requiresAuth: true }
      },
      {
        path: 'checkin',
        name: 'CheckinManage',
        component: CheckinManage,
        meta: { requiresAuth: true }
      },
      {
        path: 'merchant',
        name: 'MerchantManage',
        component: MerchantManage,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  
  const token = localStorage.getItem('Admin-Token')
  
  const requiresAuth = to.meta.requiresAuth

  
  if (requiresAuth && !token) {
    next('/admin/login')
  } else if (!requiresAuth && token && to.path === '/admin/login') {
    
    next('/admin/resource')
  } else {
    
    next()
  }
})

export default router