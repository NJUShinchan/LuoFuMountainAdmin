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
        
        <el-form-item label="内容">
          <el-button type="primary" @click="openContentEditor">
            编辑内容
          </el-button>
          <span v-if="resourceForm.contentJson" style="margin-left: 10px; color: #67C23A;">
            已配置
          </span>
          <span v-else style="margin-left: 10px; color: #F56C6C;">
            未配置
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 内容编辑弹窗 -->
    <el-dialog
      title="编辑资源内容"
      v-model="contentDialogVisible"
      width="700px"
    >
      <el-form :model="contentForm" label-width="80px">
        <el-form-item label="内容块">
          <div
            v-for="(item, index) in contentForm.items"
            :key="index"
            class="content-item"
          >
            <!-- 类型选择-->
            <el-select
              v-model="item.type"
              placeholder="类型"
              style="width: 120px; margin-right: 10px;"
            >
              <el-option label="文本" value="text" />
              <el-option label="图片" value="image" />
            </el-select>

            <!-- 文本 -->
            <template v-if="item.type === 'text'">
              <el-input
                v-model="item.value"
                placeholder="请输入文本内容"
                type="textarea"
                :rows="2"
                style="flex: 1;"
              />
            </template>

            <!-- 图片 -->
            <template v-else-if="item.type === 'image'">
              <div class="image-item-editor">
                <el-upload
                  class="content-img-uploader"
                  :show-file-list="false"
                  :http-request="(option) => handleContentImageUpload(option, index)"
                  accept="image/*"
                >
                  <img
                    v-if="item.url"
                    :src="item.url"
                    class="content-img"
                  />
                  <el-icon v-else class="cover-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
                <el-input
                  v-model="item.url"
                  placeholder="或直接粘贴图片 URL"
                  style="margin-left: 10px; flex: 1;"
                />
              </div>
            </template>

            <!-- 排序 / 删除 -->
            <div class="content-item-actions">
              <el-button
                link
                type="primary"
                @click="moveItem(index, -1)"
                :disabled="index === 0"
              >上移</el-button>
              <el-button
                link
                type="primary"
                @click="moveItem(index, 1)"
                :disabled="index === contentForm.items.length - 1"
              >下移</el-button>
              <el-button
                link
                type="danger"
                @click="removeItem(index)"
              >删除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="content-dialog-footer">
          <div class="content-dialog-footer-left">
            <el-button type="primary" link @click="addItem('text')">
              新增文本块
            </el-button>
            <el-button type="primary" link @click="addItem('image')">
              新增图片块
            </el-button>
          </div>
          <div class="content-dialog-footer-right">
            <el-button @click="contentDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmContent">确定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getResourceList, saveResource, deleteResource, getResourceDetail } from '@/admin/api/resource'
import { uploadFile } from '@/admin/api/upload'
import { ElMessage, ElForm, ElMessageBox } from 'element-plus'  
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

//内容编辑相关
const contentDialogVisible = ref(false)
const contentForm = ref({
  items: []
})

const emptyContentForm = () => ({
  items: []
})

// 打开内容编辑弹窗
const openContentEditor = () => {
  if (resourceForm.value.contentJson) {
    try {
      const parsed = JSON.parse(resourceForm.value.contentJson)
      let list = []

      if (Array.isArray(parsed)) {
        list = parsed
      } else if (parsed && Array.isArray(parsed.content)) {
        list = parsed.content
      }

      contentForm.value.items = list.map(item => {
        if (item.type === 'image') {
          return {
            type: 'image',
            url: item.value || ''
          }
        }
        
        return {
          type: item.type || 'text',
          value: item.value || ''
        }
      })
    } catch (e) {
      contentForm.value = emptyContentForm()
    }
  } else {
    contentForm.value = emptyContentForm()
  }
  contentDialogVisible.value = true
}

// 确认内容，写回 JSON 字符串
const confirmContent = () => {
  const content = contentForm.value.items.map(item => {
    if (item.type === 'image') {
      return {
        type: 'image',
        value: item.url || ''
      }
    }
    return {
      type: item.type || 'text',
      value: item.value || ''
    }
  })

  resourceForm.value.contentJson = JSON.stringify(content)
  contentDialogVisible.value = false
}

// 新增内容块
const addItem = (type = 'text') => {
  const item = { type }
  if (type === 'image') {
    item.url = ''
  } else {
    item.value = ''
  }
  contentForm.value.items.push(item)
}

// 删除内容块
const removeItem = (index) => {
  contentForm.value.items.splice(index, 1)
}

// 上移 / 下移
const moveItem = (index, step) => {
  const newIndex = index + step
  if (newIndex < 0 || newIndex >= contentForm.value.items.length) return
  const items = contentForm.value.items
  const [moved] = items.splice(index, 1)
  items.splice(newIndex, 0, moved)
}

// 内容图片上传
const handleContentImageUpload = async (option, index) => {
  const { file, onSuccess, onError } = option
  try {
    const res = await uploadFile(file, 'image')
    contentForm.value.items[index].url = res.data.url
    ElMessage.success('图片上传成功')
    onSuccess && onSuccess(res)
  } catch (e) {
    ElMessage.error('图片上传失败')
    onError && onError(e)
  }
}

onMounted(() => {
  fetchResourceList()
})

const fetchResourceList = async () => {
  try {
    console.log('获取资源列表，页码:', pagination.value.current) 
    const res = await getResourceList({
      page: pagination.value.current,   
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

const handleEdit = async (row) => {
  dialogTitle.value = '编辑资源'
  try {
    const res = await getResourceDetail(row.id)
    const detail = res.data

    resourceForm.value = {
      id: detail.id,
      name: detail.name,
      type: detail.type,
      coverImg: detail.coverImg || '',
      latitude: detail.latitude ?? '',
      longitude: detail.longitude ?? '',
      hotScore: detail.hotScore ?? '',
      contentJson: detail.content || ''
    }

    editingId.value = detail.id
    dialogVisible.value = true
  } catch (e) {
    ElMessage.error('获取资源详情失败')
  }
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

.content-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.content-item-actions {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.image-item-editor {
  display: flex;
  align-items: center;
  flex: 1;
}

.content-img-uploader {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-dialog-footer-left .el-button {
  margin-right: 8px;
}
</style>
