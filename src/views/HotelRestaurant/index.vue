<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ currentType === '住宿' ? '住宿' : '餐饮' }}管理</span>
          <el-button type="primary" @click="handleAdd">新增{{ currentType === '住宿' ? '住宿' : '餐饮' }}</el-button>
        </div>
      </template>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column label="封面图" width="150">
          <template #default="scope">
            <el-image :src="scope.row.coverImg" fit="cover" style="width: 100px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="hotScore" label="热度" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="fetchData"
          @current-change="fetchData"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择" :disabled="isEdit">
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图"><image-upload v-model="form.coverImg" /></el-form-item>
        <el-form-item label="热度"><el-input-number v-model="form.hotScore" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getResourceList, updateResource, deleteResource, createResource } from '@/api/resource';
import ImageUpload from '@/components/Upload/ImageUpload.vue';

const route = useRoute();

// --- 响应式数据 ---
const loading = ref(true);
const list = ref([]);
const pagination = reactive({ current: 1, size: 10, total: 0 });
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const formRef = ref(null);
const form = reactive({ id: undefined, name: '', type: '住宿', coverImg: '', hotScore: 0, status: 1 });

// --- 计算属性 ---
const currentType = ref('住宿');

// --- 监听路由变化 ---
watch(
    () => route.name,
    (newName) => {
      if (newName === 'Hotel') currentType.value = '住宿';
      if (newName === 'Restaurant') currentType.value = '餐饮';
      fetchData();
    },
    { immediate: true } // 立即执行一次
);

// --- 方法定义 ---
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await getResourceList({ current: pagination.current, size: pagination.size, type: currentType.value });
    list.value = data.records;
    pagination.total = data.total;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, { id: undefined, name: '', type: currentType.value, coverImg: '', hotScore: 0, status: 1 });
};

const handleAdd = () => {
  resetForm();
  isEdit.value = false;
  dialogTitle.value = `新增${currentType.value}`;
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  Object.assign(form, row);
  isEdit.value = true;
  dialogTitle.value = `编辑${currentType.value}`;
  dialogVisible.value = true;
};

const handleSave = async () => {
  const action = isEdit.value ? updateResource : createResource;
  try {
    await action(form);
    ElMessage.success(`${isEdit.value ? '更新' : '创建'}成功`);
    dialogVisible.value = false;
    fetchData();
  } catch (error) {}
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该${currentType.value}?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      .then(async () => {
        await deleteResource(row.id);
        ElMessage.success('删除成功');
        fetchData();
      })
      .catch(() => {});
};

onMounted(() => {
  // 初始化类型
  if (route.name === 'Hotel') currentType.value = '住宿';
  if (route.name === 'Restaurant') currentType.value = '餐饮';
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
