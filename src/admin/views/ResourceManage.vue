<!-- src/admin/views/ResourceManage.vue -->
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

    <!-- 新增/编辑弹窗 -->
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
          <el-upload
            class="cover-uploader"
            :show-file-list="false"
            :http-request="handleCoverUpload"
            accept="image/*"
          >
            <img
              v-if="resourceForm.coverImg"
              :src="resourceForm.coverImg"
              class="cover-img"
            />
            <el-icon v-else class="cover-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <!-- 也允许直接粘贴 URL -->
          <el-input
            v-model="resourceForm.coverImg"
            placeholder="或直接粘贴图片 URL"
            style="margin-top: 10px"
          />
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
import { uploadFile } from '@/admin/api/upload'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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
  const res = await getResourceList({
    current: pagination.value.current,
    size: pagination.value.size
  })
  resourceList.value = res.data.records
  pagination.value.total = res.data.total
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

// 封面图上传
const handleCoverUpload = async (option) => {
  const { file, onSuccess, onError } = option
  try {
    const res = await uploadFile(file, 'image')
    resourceForm.value.coverImg = res.data.url
    ElMessage.success('封面图上传成功')
    onSuccess && onSuccess(res)
  } catch (e) {
    ElMessage.error('封面图上传失败')
    onError && onError(e)
  }
}

const handleSubmit = async () => {
  if (!resourceFormRef.value) return

  const valid = await resourceFormRef.value.validate()
  if (!valid) return

  const form = resourceForm.value

  let contentJson = null
  if (form.contentJson && form.contentJson.trim() !== '') {
    try {
      JSON.parse(form.contentJson)
      contentJson = form.contentJson
    } catch (e) {
      ElMessage.error('内容JSON不是合法的 JSON 格式')
      return
    }
  }

  const data = {
    id: editingId.value || null,
    type: form.type,
    name: form.name,
    coverImg: form.coverImg || null,
    latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
    longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
    hotScore: form.hotScore !== '' ? parseInt(form.hotScore) : null,
    contentJson: contentJson
  }

  await saveResource(data)

  dialogVisible.value = false
  fetchResourceList()
  ElMessage.success(editingId.value ? '更新成功' : '新增成功')
}

const handleDelete = async (id) => {
  try {
    await deleteResource(id)
    ElMessage.success('删除成功')
    fetchResourceList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.resource-manage {
  padding: 20px;
}

.cover-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  display: flex;              
  align-items: center;        
  justify-content: center;    
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
