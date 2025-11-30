<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="exportUsers">导出列表</el-button>
        </div>
      </template>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatarUrl" :size="50" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
                size="small"
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '冻结' : '恢复' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 补充完整的分页组件 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserList, updateUserStatus } from '@/api/user';
import * as XLSX from 'xlsx';

// --- 响应式数据 ---
const loading = ref(true);
const list = ref([]);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// --- 方法定义 ---
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await getUserList(pagination);
    list.value = data.records;
    pagination.total = data.total;
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = (row) => {
  const newStatus = row.status === 'active' ? 'frozen' : 'active';
  const actionText = newStatus === 'active' ? '恢复' : '冻结';
  ElMessageBox.confirm(`确认${actionText}该用户?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await updateUserStatus(row.id, newStatus);
    ElMessage.success(`${actionText}成功`);
    fetchData();
  }).catch(() => {});
};

const exportUsers = async () => {
  const tHeader = ['用户ID', '昵称', '积分', '角色', '状态'];
  const filterVal = ['id', 'nickname', 'points', 'role', 'status'];
  const { data } = await getUserList({ size: 9999 }); // 获取所有数据用于导出
  const dataToExport = data.records.map(v => filterVal.map(j => v[j]));
  const ws = XLSX.utils.json_to_sheet(dataToExport, { header: tHeader });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '用户列表');
  XLSX.writeFile(wb, 'user-list.xlsx');
};

// --- 生命周期 ---
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
