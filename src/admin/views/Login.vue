<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>景区管理平台</h2>
          <p>管理员登录</p>
        </div>
      </template>
      <el-form ref="loginFormRef" :model="loginForm">
        <el-form-item label="管理密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入管理密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/admin/stores/user' 
const loginFormRef = ref(null)

const loginForm = reactive({
  password: ''
})

const router = useRouter()
const loading = ref(false)
const userStore = useUserStore() 

const handleLogin = async () => {
  loading.value = true
  try {
    // 调用 Pinia 的登录方法
    const ok = await userStore.login(loginForm.password)
    if (!ok) {
      ElMessage.error('密码错误或系统异常，请重试')
      return
    }

    ElMessage.success('登录成功')
    router.push('/admin/resource')
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.login-header p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.login-button {
  width: 100%;
  margin-top: 20px;
}

/* 确保表单项有足够的空间 */
.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}
</style>
