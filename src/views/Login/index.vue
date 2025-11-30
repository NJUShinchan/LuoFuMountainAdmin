<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h3>景区管理后台</h3>
      </template>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="codeId">
          <el-input
              v-model="loginForm.codeId"
              placeholder="请输入管理员凭证"
              prefix-icon="el-icon-key"
              size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { adminLogin } from '@/api/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const loginFormRef = ref(null);
const loginForm = reactive({ codeId: '' });

const loginRules = {
  codeId: [{ required: true, message: '请输入管理员凭证', trigger: 'blur' }]
};

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const { data } = await adminLogin(loginForm.codeId);
        authStore.login(data.token);
        ElMessage.success('登录成功');
        // 跳转到之前想访问的页面，或者默认首页
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } catch (error) {
        // 错误已在 request.js 中统一处理
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  .login-card {
    width: 400px;
    h3 {
      text-align: center;
      margin: 0;
    }
  }
}
</style>
