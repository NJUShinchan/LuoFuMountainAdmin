import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

const service = axios.create({
    baseURL: 'https://your-api-domain.com/api', // !!! 替换为您的API基础URL
    timeout: 15000
});

service.interceptors.request.use(
    config => {
        const authStore = useAuthStore();
        if (authStore.token) {
            config.headers['Authorization'] = `Bearer ${authStore.token}`;
        }
        return config;
    },
    error => {
        console.error(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            ElMessage.error(res.msg || 'Error');
            if (res.code === 401) {
                const authStore = useAuthStore();
                authStore.logout();
                window.location.reload();
            }
            return Promise.reject(new Error(res.msg || 'Error'));
        } else {
            return res;
        }
    },
    error => {
        ElMessage.error(error.message || '请求失败');
        return Promise.reject(error);
    }
);

export default service;
