import { createRouter, createWebHistory } from 'vue-router';

/**
 * 注意: 在Vue Router v4中, 不再使用 new Router(), 而是使用 createRouter()
 * createWebHistory() 用于启用 HTML5 History 模式, URL会更美观 (如 /user)
 */

// 公共路由，不需要权限验证
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/Login/index.vue'),
        hidden: true, // 在侧边栏菜单中隐藏此路由
        meta: { title: '登录' }
    },

    {
        path: '/',
        component: () => import('@/components/Layout/AdminLayout.vue'), // 引入布局组件
        redirect: '/scenic-spot', // 重定向到默认首页
        children: [
            {
                path: 'scenic-spot',
                name: 'ScenicSpot',
                component: () => import('@/views/ScenicSpot/index.vue'),
                meta: { title: '景点简介管理', icon: 'el-icon-s-home' }
            },
            {
                path: 'checkin',
                name: 'Checkin',
                component: () => import('@/views/Checkin/index.vue'),
                meta: { title: '打卡管理', icon: 'el-icon-map-location' }
            },
            {
                path: 'hotel',
                name: 'Hotel',
                component: () => import('@/views/HotelRestaurant/index.vue'),
                meta: { title: '住宿管理', icon: 'el-icon-house' }
            },
            {
                path: 'restaurant',
                name: 'Restaurant',
                component: () => import('@/views/HotelRestaurant/index.vue'),
                meta: { title: '餐饮管理', icon: 'el-icon-food' }
            },
            {
                path: 'gift',
                name: 'Gift',
                component: () => import('@/views/Gift/index.vue'),
                meta: { title: '礼品管理', icon: 'el-icon-present' }
            },
            {
                path: 'points',
                name: 'Points',
                component: () => import('@/views/Points/index.vue'),
                meta: { title: '积分管理', icon: 'el-icon-coin' }
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/User/index.vue'),
                meta: { title: '用户中心', icon: 'el-icon-user' }
            }
        ]
    },

    // 404 页面必须放在最后
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404.vue'),
        hidden: true,
        meta: { title: '404' }
    }
];

/**
 * 创建路由实例
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE_API), // 使用Vite环境变量
    scrollBehavior: () => ({ left: 0, top: 0 }), // 控制路由切换时的滚动位置
    routes: constantRoutes
});

export default router;
