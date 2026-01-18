<template>
  <div class="merchant-manage">
    <el-card class="manage-card">
      <template #header>
        <div class="card-header">
          <h2>商家管理</h2>
          <el-button type="primary" @click="handleAdd">创建商家</el-button>
        </div>
      </template>
      
      <el-table :data="merchantList" style="width: 100%" v-loading="loading">
        <el-table-column prop="merchantId" label="商家ID" width="100" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resourceName" label="关联资源" />
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row.merchantId)">详情</el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" @click="handleResetPassword(row.merchantId)">重置密码</el-button>
            <el-button 
              :type="row.status === 1 ? 'danger' : 'success'" 
              size="small"
              @click="handleToggleStatus(row.merchantId, row.status)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.merchantId)">删除</el-button>
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


    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      @open="handleDialogOpen"
    >
      
      <el-form ref="merchantFormRef" :model="merchantForm" label-width="80px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="merchantForm.name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
          <el-select v-model="merchantForm.type">
            <el-option label="景点" value="景点" />
            <el-option label="住宿" value="住宿" />
            <el-option label="餐饮" value="餐饮" />
            <el-option label="商家" value="商家" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="username" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
          <el-input v-model="merchantForm.username" placeholder="请输入登录账号" :disabled="!!editingId" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="merchantForm.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="merchantForm.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="merchantForm.address" placeholder="请输入商家地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="merchantForm.status"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
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
import { ref, onMounted, reactive } from 'vue'
import { 
  getMerchantList, 
  createMerchant, 
  getMerchantDetail, 
  updateMerchant, 
  resetMerchantPassword, 
  updateMerchantStatus, 
  deleteMerchant 
} from '@/admin/api/merchant'
import { ElMessage, ElMessageBox } from 'element-plus'

// 列表数据
const merchantList = ref([])
const loading = ref(false)

// 分页数据
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('创建商家')


const merchantFormRef = ref(null)


const merchantForm = ref({
  name: '',
  type: '',
  username: '',
  contactName: '',
  contactPhone: '',
  address: '',
  status: '1'
})

const editingId = ref(null)

onMounted(() => {
  fetchMerchantList()
})

const fetchMerchantList = async () => {
  loading.value = true
  try {
    const res = await getMerchantList({
      current: pagination.value.current,
      size: pagination.value.size
    })
    merchantList.value = res.data.records
    pagination.value.total = res.data.total
  } catch (error) {
    ElMessage.error('获取商家列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.value.current = page
  fetchMerchantList()
}


const resetFormData = () => {
  merchantForm.value = {
    name: '',
    type: '',
    username: '',
    contactName: '',
    contactPhone: '',
    address: '',
    status: '1'
  }
  editingId.value = null
}

const handleAdd = () => {
  dialogTitle.value = '创建商家'
  resetFormData()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑商家'
  
  merchantForm.value = { ...row }
  
  if (typeof merchantForm.value.status === 'number') {
    merchantForm.value.status = merchantForm.value.status.toString()
  }
  
  editingId.value = row.merchantId
  dialogVisible.value = true
}


const handleDialogOpen = () => {
  merchantFormRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!merchantFormRef.value) return

  try {

    const valid = await merchantFormRef.value.validate()
    if (!valid) return

    
    const data = {
      ...merchantForm.value,
      status: parseInt(merchantForm.value.status) 
    }
    
    loading.value = true 
    
    
    if (editingId.value) {
      await updateMerchant({ ...data, merchantId: editingId.value })
    } else {
      await createMerchant(data)
    }
    
    
    dialogVisible.value = false
    fetchMerchantList()
    ElMessage.success(editingId.value ? '更新成功' : '创建成功')

  } catch (error) {
    console.error('提交失败:', error)
    
    if (!error.fields) {
       ElMessage.error(error.message || '操作失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const handleDetail = async (id) => {
  try {
    const res = await getMerchantDetail(id)
    console.log('商家详情:', res.data)
    ElMessage.success('获取详情成功')
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleResetPassword = async (id) => {
  try {
    await ElMessageBox.confirm('确定要重置该商家密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await resetMerchantPassword({ merchantId: id, newPassword: '123456' })
    ElMessage.success('密码重置成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置失败')
    }
  }
}

const handleToggleStatus = async (id, currentStatus) => {
  try {
    await ElMessageBox.confirm('确定要修改商家状态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateMerchantStatus({ merchantId: id, status: currentStatus === 1 ? 0 : 1 })
    ElMessage.success('状态更新成功')
    fetchMerchantList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('更新失败')
    }
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商家吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMerchant(id)
    ElMessage.success('删除成功')
    fetchMerchantList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.merchant-manage {
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
