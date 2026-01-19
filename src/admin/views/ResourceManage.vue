
<template>
  <div class="resource-manage">
    <el-button type="primary" @click="handleAdd">新增资源</el-button>
    
    <el-table :data="resourceList" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="hotScore" label="热度" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      @current-change="handlePageChange"
      style="margin-top: 20px"
    />

    
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="resourceFormRef" :model="resourceForm" label-width="80px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="resourceForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
          <el-select v-model="resourceForm.type">
            <el-option label="景点" value="景点" />
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
            <el-option label="商家" value="商家" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="resourceForm.coverImg" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude" :rules="[{ required: true, message: '请输入纬度', trigger: 'blur' }]">
          <el-input v-model="resourceForm.latitude" type="number" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude" :rules="[{ required: true, message: '请输入经度', trigger: 'blur' }]">
          <el-input v-model="resourceForm.longitude" type="number" />
        </el-form-item>
        <el-form-item label="热度" prop="hotScore" :rules="[{ required: true, message: '请输入热度', trigger: 'blur' }]">
          <el-input v-model="resourceForm.hotScore" type="number" />
        </el-form-item>
        <el-form-item label="内容JSON">
          <el-input v-model="resourceForm.contentJson" type="textarea" :rows="5" />
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
import { getResourceList, saveResource, deleteResource } from '@/admin/api/resource'
import { ElMessage, ElMessageBox } from 'element-plus'

const resourceList = ref([])
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})
const dialogVisible = ref(false)
const dialogTitle = ref('新增资源')
const resourceForm = ref({
  name: '',
  type: '',
  coverImg: '',
  latitude: '',
  longitude: '',
  hotScore: '',
  contentJson: ''
})
const resourceFormRef = ref(null)
const editingId = ref(null)

onMounted(() => {
  fetchResourceList()
})

const fetchResourceList = async () => {
  try {
    console.log('获取资源列表，页码:', pagination.value.current) 
    const res = await getResourceList({
      current: pagination.value.current,
      size: pagination.value.size
    })
    resourceList.value = res.data.records
    pagination.value.total = res.data.total
    console.log('获取到的资源数据:', res.data.records) 
  } catch (error) {
    console.error('获取资源列表失败:', error) 
    ElMessage.error('获取资源列表失败')
  }
}

const handlePageChange = (page) => {
  pagination.value.current = page
  fetchResourceList()
}

const handleAdd = () => {
  dialogTitle.value = '新增资源'
  resourceForm.value = {
    name: '',
    type: '',
    coverImg: '',
    latitude: '',
    longitude: '',
    hotScore: '',
    contentJson: ''
  }
  editingId.value = null
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑资源'
  resourceForm.value = { ...row }
  editingId.value = row.id
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!resourceFormRef.value) return
  
  try {
    await resourceFormRef.value.validate()
    
    const data = {
      ...resourceForm.value,
      latitude: parseFloat(resourceForm.value.latitude),
      longitude: parseFloat(resourceForm.value.longitude),
      hotScore: parseInt(resourceForm.value.hotScore)
    }
    
    if (editingId.value) {
      await saveResource({ ...data, id: editingId.value })
    } else {
      await saveResource(data)
    }
    
    dialogVisible.value = false
    fetchResourceList()
    ElMessage.success(editingId.value ? '更新成功' : '新增成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败，请稍后重试')
    }
  }
}

const handleDelete = async (id) => {
  try {
    console.log('准备删除ID:', id) 
    await ElMessageBox.confirm('确定要删除该资源吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    console.log('确认删除，调用deleteResource函数') 
    await deleteResource(id)
    console.log('删除成功')
    ElMessage.success('删除成功')
    fetchResourceList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error) 
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}
</script>

<style scoped>
.resource-manage {
  padding: 20px;
}
</style>
