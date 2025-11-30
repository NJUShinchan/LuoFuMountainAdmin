<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header"><span>打卡点管理</span><el-button type="primary" @click="handleAdd">新增打卡点</el-button></div>
      </template>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="打卡点名称" />
        <el-table-column prop="latitude" label="纬度" width="120" />
        <el-table-column prop="longitude" label="经度" width="120" />
        <el-table-column prop="score" label="积分" width="80" />
        <el-table-column prop="todayHasCheckin" label="今日打卡数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" :type="scope.row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '停用' : '启用' }}
            </el-button>
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
      <el-form :model="form" label-width="120px">
        <el-form-item label="打卡点名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="纬度"><el-input-number v-model="form.latitude" :precision="6" :step="0.000001" style="width: 100%"/></el-form-item>
        <el-form-item label="经度"><el-input-number v-model="form.longitude" :precision="6" :step="0.000001" style="width: 100%"/></el-form-item>
        <el-form-item label="奖励积分"><el-input-number v-model="form.score" :min="0" style="width: 100%"/></el-form-item>
        <el-form-item label="有效半径(米)"><el-input-number v-model="form.radius" :min="10" style="width: 100%"/></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取 消</el-button><el-button type="primary" @click="handleSave">确 定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getCheckinLocationList, updateCheckinPoint, createCheckinPoint } from '@/api/checkin';

// 响应式数据
const loading = ref(true);
const list = ref([]);
const pagination = reactive({ current: 1, size: 10, total: 0 });
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const form = reactive({ id: undefined, name: '', latitude: 0, longitude: 0, score: 0, radius: 50, status: 1 });

// 方法
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await getCheckinLocationList();
    const allData = data || [];
    pagination.total = allData.length;
    const start = (pagination.current - 1) * pagination.size;
    const end = start + pagination.size;
    list.value = allData.slice(start, end);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, { id: undefined, name: '', latitude: 0, longitude: 0, score: 0, radius: 50, status: 1 });
};

const handleAdd = () => { resetForm(); isEdit.value = false; dialogTitle.value = '新增打卡点'; dialogVisible.value = true; };
const handleEdit = (row) => { Object.assign(form, row); isEdit.value = true; dialogTitle.value = '编辑打卡点'; dialogVisible.value = true; };

const handleSave = async () => {
  const action = isEdit.value ? updateCheckinPoint : createCheckinPoint;
  await action(form);
  ElMessage.success(`${isEdit.value ? '更新' : '创建'}成功`);
  dialogVisible.value = false;
  fetchData();
};

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1;
  await updateCheckinPoint({ ...row, status: newStatus });
  ElMessage.success('状态切换成功');
  fetchData();
};

onMounted(fetchData);
</script>
