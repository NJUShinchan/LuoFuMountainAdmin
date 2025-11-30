<template>
  <div class="app-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>礼品管理</span>
          <el-button type="primary" @click="handleAdd">新增礼品</el-button>
        </div>
      </template>

      <!-- 礼品列表表格 -->
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="礼品名称" />
        <el-table-column prop="points" label="所需积分" width="120" />
        <el-table-column label="库存" width="100">
          <template #default="scope">
            <!-- 库存少于10时，显示红色警报标签 -->
            <el-tag :type="scope.row.stock < 10 ? 'danger' : 'success'">
              {{ scope.row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeCount" label="已兑换" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                size="small"
                :type="scope.row.status === 1 ? 'warning' : 'success'"
                @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '下架' : '上架' }}
            </el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-form-item label="礼品名称">
          <el-input v-model="form.name" placeholder="请输入礼品名称" />
        </el-form-item>
        <el-form-item label="所需积分">
          <el-input-number v-model="form.points" :min="0" placeholder="兑换此礼品需要的积分" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="form.stock" :min="0" placeholder="当前库存" style="width: 100%" />
        </el-form-item>
        <el-form-item label="兑换规则">
          <el-input v-model="form.rule" type="textarea" :rows="3" placeholder="例如：每人限兑换一次" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
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
import { ElMessage } from 'element-plus';
// 从对应的API文件导入函数
import { getMallList, updateMallItem, createMallItem } from '@/api/mall';

// --- 响应式数据定义 ---
const loading = ref(false); // 表格加载状态
const list = ref([]); // 礼品列表数据
const dialogVisible = ref(false); // 对话框显示状态
const dialogTitle = ref(''); // 对话框标题
const isEdit = ref(false); // 是否为编辑模式
const formRef = ref(null); // 表单引用

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// 表单数据
const form = reactive({
  id: undefined,
  name: '',
  points: 0,
  stock: 0,
  rule: '',
  status: 1 // 默认上架
});

// --- 方法定义 ---

/**
 * 获取礼品列表数据
 */
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await getMallList({
      current: pagination.current,
      size: pagination.size
    });
    list.value = data.records;
    pagination.total = data.total;
  } catch (error) {
    // 错误已在 request.js 中统一处理
  } finally {
    loading.value = false;
  }
};

/**
 * 重置表单数据
 */
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    name: '',
    points: 0,
    stock: 0,
    rule: '',
    status: 1
  });
};

/**
 * 打开新增对话框
 */
const handleAdd = () => {
  resetForm();
  isEdit.value = false;
  dialogTitle.value = '新增礼品';
  dialogVisible.value = true;
};

/**
 * 打开编辑对话框
 * @param {object} row - 当前行数据
 */
const handleEdit = (row) => {
  Object.assign(form, row); // 将行数据复制到表单
  isEdit.value = true;
  dialogTitle.value = '编辑礼品';
  dialogVisible.value = true;
};

/**
 * 保存表单数据（新增或编辑）
 */
const handleSave = async () => {
  const action = isEdit.value ? updateMallItem : createMallItem;
  try {
    await action(form);
    ElMessage.success(`${isEdit.value ? '更新' : '创建'}成功`);
    dialogVisible.value = false;
    fetchData(); // 重新获取列表数据
  } catch (error) {
    // 错误已在 request.js 中统一处理
  }
};

/**
 * 切换礼品上架/下架状态
 * @param {object} row - 当前行数据
 */
const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    await updateMallItem({ ...row, status: newStatus });
    ElMessage.success('状态切换成功');
    fetchData(); // 重新获取列表数据
  } catch (error) {
    // 错误已在 request.js 中统一处理
  }
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
