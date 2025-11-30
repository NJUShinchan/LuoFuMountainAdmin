<template>
  <div class="upload-container">
    <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        :limit="1"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadFile } from '@/api/upload';

// 定义 props，用于 v-model 双向绑定
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

// 定义 emits，用于触发 v-model 的更新事件
const emit = defineEmits(['update:modelValue']);

// 内部维护的文件列表
const fileList = ref([]);

// 监听外部传入的 modelValue 变化，同步到内部 fileList
watch(() => props.modelValue, (newVal) => {
  if (newVal && !fileList.value.find(file => file.url === newVal)) {
    fileList.value = [{ name: 'image', url: newVal }];
  } else if (!newVal) {
    fileList.value = [];
  }
}, { immediate: true });

// 当用户选择文件时触发
const handleFileChange = async (file) => {
  const formData = new FormData();
  formData.append('file', file.raw); // 文件对象在 file.raw 中

  try {
    const { data } = await uploadFile(formData);
    // 上传成功，更新 fileList 和 v-model
    fileList.value = [{ name: file.name, url: data.url }];
    emit('update:modelValue', data.url);
  } catch (error) {
    // 上传失败，移除刚刚添加的文件预览
    fileList.value = fileList.value.filter(item => item.uid !== file.uid);
    ElMessage.error('图片上传失败');
  }
};

// 当用户从列表中移除文件时触发
const handleRemove = () => {
  fileList.value = [];
  emit('update:modelValue', '');
};
</script>

<style scoped>
</style>
