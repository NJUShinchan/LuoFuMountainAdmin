<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>页面未找到</h2>
    <p>抱歉，您访问的页面不存在。</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  color: #909399;
}
.not-found h1 {
  font-size: 10rem;
  margin: 0;
  color: #c0c4cc;
}
.not-found h2 {
  font-size: 2rem;
  margin: 0;
}
</style>
