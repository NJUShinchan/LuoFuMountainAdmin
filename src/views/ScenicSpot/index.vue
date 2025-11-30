<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>景点简介管理</span>
          <el-button type="primary" @click="handleAdd">新增景点</el-button>
        </div>
      </template>

      <!-- 数据为空时的提示 -->
      <el-empty v-if="!loading && list.length === 0" description="暂无景点数据" />

      <!-- 景点列表 -->
      <el-table v-else :data="list" style="width: 100%">
        <el-table-column prop="name" label="景点名称" />
        <el-table-column label="封面图" width="150">
          <template #default="scope">
            <el-image
                :src="scope.row.coverImg"
                fit="cover"
                style="width: 100px; height: 60px"
                :preview-src-list="[scope.row.coverImg]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="hotScore" label="热度" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="景点名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="景点" value="景点" />
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <image-upload v-model="form.coverImg" />
        </el-form-item>
        <el-form-item label="经纬度">
          <el-input v-model="form.latitude" placeholder="纬度" style="width: 48%; margin-right: 4%" />
          <el-input v-model="form.longitude" placeholder="经度" style="width: 48%" />
        </el-form-item>
        <el-form-item label="热度">
          <el-input-number v-model="form.hotScore" :min="0" />
        </el-form-item>
        <el-form-item label="详情内容">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入景点详细介绍" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getResourceList, updateResource, deleteResource, createResource } from '@/api/resource';
import ImageUpload from '@/components/Upload/ImageUpload.vue';

// 响应式数据
const loading = ref(true);
const list = ref([]);
const pagination = reactive({ current: 1, size: 10, total: 0 });
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const formRef = ref(null);
const form = reactive({
  id: undefined,
  name: '',
  type: '景点',
  coverImg: '',
  latitude: '',
  longitude: '',
  hotScore: 0,
  content: ''
});

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await getResourceList({
      current: pagination.current,
      size: pagination.size,
      type: '景点' // 只获取景点类型的数据
    });
    list.value = data.records || [];
    pagination.total = data.total || 0;
  } catch (error) {
    console.error('获取景点数据失败:', error);
    ElMessage.error('获取景点数据失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    name: '',
    type: '景点',
    coverImg: '',
    latitude: '',
    longitude: '',
    hotScore: 0,
    content: ''
  });
};

// 新增
const handleAdd = () => {
  resetForm();
  isEdit.value = false;
  dialogTitle.value = '新增景点';
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
  Object.assign(form, row);
  isEdit.value = true;
  dialogTitle.value = '编辑景点';
  dialogVisible.value = true;
};

// 保存
const handleSave = async () => {
  try {
    const action = isEdit.value ? updateResource : createResource;
    await action(form);
    ElMessage.success(`${isEdit.value ? '更新' : '创建'}成功`);
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败');
  }
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除景点"${row.name}"?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async () => {
        await deleteResource(row.id);
        ElMessage.success('删除成功');
        fetchData();
      })
      .catch(() => {});
};

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
