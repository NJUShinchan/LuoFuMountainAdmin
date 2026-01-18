import { createApp } from 'vue'
import App from './App.vue'
import router from './admin/router'
import ElementPlus from 'element-plus'  // 引入 Element Plus
import 'element-plus/dist/index.css'    // 引入 Element Plus 样式
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)  // 全局注册 Element Plus
app.mount('#app')
