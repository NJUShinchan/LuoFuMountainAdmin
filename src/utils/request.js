import axios from 'axios'
import { ElMessage } from 'element-plus'


const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    
    const token = localStorage.getItem('Admin-Token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  error => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        
        localStorage.removeItem('Admin-Token')
        
        window.location.href = '/admin/login'
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
    return Promise.reject(error)
  }
)

export function getToken() {
  return localStorage.getItem('Admin-Token')
}

export function setToken(token) {
  return localStorage.setItem('Admin-Token', token)
}

export function removeToken() {
  return localStorage.removeItem('Admin-Token')
}

export default service