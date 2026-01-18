import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { unlockAdmin } from '@/admin/api/auth'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref(localStorage.getItem('Admin-Token') || '')
  const isAdminLoggedIn = ref(!!token.value)

  const login = async (password) => {
    try {
      const res = await unlockAdmin({ password })
      token.value = res.data.token
      isAdminLoggedIn.value = true
      localStorage.setItem('Admin-Token', res.data.token)
      return true
    } catch (error) {
      console.error('管理员登录失败:', error)
      return false
    }
  }

  const logout = () => {
    token.value = ''
    isAdminLoggedIn.value = false
    localStorage.removeItem('Admin-Token')
    router.push('/admin/login')
  }

  const checkLoginStatus = () => {
    const storedToken = localStorage.getItem('Admin-Token')
    if (storedToken) {
      token.value = storedToken
      isAdminLoggedIn.value = true
    } else {
      isAdminLoggedIn.value = false
    }
  }

  const isLoggedIn = () => {
    return isAdminLoggedIn.value
  }

  return {
    token,
    isAdminLoggedIn,
    login,
    logout,
    checkLoginStatus,
    isLoggedIn
  }
})
