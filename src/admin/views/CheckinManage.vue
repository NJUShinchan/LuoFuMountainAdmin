<template>
  <div class="checkin-manage">
    <el-card class="manage-card">
      <template #header>
        <div class="card-header">
          <h2>打卡点管理</h2>
          <el-button type="primary" @click="handleAdd">新增打卡点</el-button>
        </div>
      </template>
      
      <el-table :data="checkinList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="latitude" label="纬度" />
        <el-table-column prop="longitude" label="经度" />
        <el-table-column prop="score" label="积分" />
        <el-table-column label="今日打卡数" width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.todayHasCheckin }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          @current-change="handlePageChange"
          background
          layout="total, prev, pager, next"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form ref="checkinForm" :model="checkinForm" label-width="80px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="checkinForm.name" placeholder="请输入打卡点名称" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude" :rules="[{ required: true, message: '请输入纬度', trigger: 'blur' }]">
          <el-input v-model="checkinForm.latitude" type="number" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude" :rules="[{ required: true, message: '请输入经度', trigger: 'blur' }]">
          <el-input v-model="checkinForm.longitude" type="number" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="积分" prop="score" :rules="[{ required: true, message: '请输入积分', trigger: 'blur' }]">
          <el-input v-model="checkinForm.score" type="number" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="半径范围" prop="radius">
          <el-input v-model="checkinForm.radius" type="number" placeholder="请输入半径范围(米)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCheckinLocationList, saveCheckinLocation, deleteCheckinLocation } from '@/admin/api/checkin'
import { ElMessage, ElForm } from 'element-plus'

const checkinList = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})
const dialogVisible = ref(false)
const dialogTitle = ref('新增打卡点')
const checkinForm = ref({
  name: '',
  latitude: '',
  longitude: '',
  score: '',
  radius: ''
})
const checkinFormRef = ref(null)
const editingId = ref(null)

onMounted(() => {
  fetchCheckinList()
})

const fetchCheckinList = async () => {
  loading.value = true
  try {
    const res = await getCheckinLocationList({
      current: pagination.value.current,
      size: pagination.value.size
    })
    checkinList.value = res.data.records
    pagination.value.total = res.data.total
  } catch (error) {
    ElMessage.error('获取打卡点列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.value.current = page
  fetchCheckinList()
}

const handleAdd = () => {
  dialogTitle.value = '新增打卡点'
  checkinForm.value = {
    name: '',
    latitude: '',
    longitude: '',
    score: '',
    radius: ''
  }
  editingId.value = null
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑打卡点'
  checkinForm.value = { ...row }
  editingId.value = row.id
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!checkinFormRef.value) return
  await checkinFormRef.value.validate((valid) => {
    if (valid) {
      const data = {
        ...checkinForm.value,
        latitude: parseFloat(checkinForm.value.latitude),
        longitude: parseFloat(checkinForm.value.longitude),
        score: parseInt(checkinForm.value.score),
        radius: checkinForm.value.radius ? parseInt(checkinForm.value.radius) : null
      }
      
      if (editingId.value) {
        // 编辑逻辑
        saveCheckinLocation({ ...data, id: editingId.value })
      } else {
        // 新增逻辑
        saveCheckinLocation(data)
      }
      
      dialogVisible.value = false
      fetchCheckinList()
      ElMessage.success(editingId.value ? '更新成功' : '新增成功')
    }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessage.confirm('确定要删除该打卡点吗？')
    await deleteCheckinLocation(id)
    ElMessage.success('删除成功')
    fetchCheckinList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.checkin-manage {
  padding: 20px;
}

.manage-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
