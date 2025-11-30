<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header><span>积分策略</span></template>
          <el-form :model="policyForm" label-width="120px">
            <el-form-item label="每日打卡积分"><el-input-number v-model="policyForm.dailyCheckinPoints" :min="0" /></el-form-item>
            <el-form-item label="连续打卡奖励">
              <el-table :data="policyForm.consecutiveBonus" style="width: 100%">
                <el-table-column label="连续天数" prop="days" width="120">
                  <template #default="scope"><el-input-number v-model="scope.row.days" :min="1" size="small"/></template>
                </el-table-column>
                <el-table-column label="额外积分" prop="bonusPoints">
                  <template #default="scope"><el-input-number v-model="scope.row.bonusPoints" :min="0" size="small"/></template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope"><el-button size="small" type="danger" @click="removeBonusRow(scope.$index)">删除</el-button></template>
                </el-table-column>
              </el-table>
              <el-button type="text" @click="addBonusRow">添加规则</el-button>
            </el-form-item>
            <el-form-item><el-button type="primary" @click="savePolicy">保存策略</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>积分统计报表 (本月)</span></template>
          <div ref="chartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header"><span>积分记录</span><el-button type="primary" @click="showBatchAdjustDialog">批量调整</el-button></div>
      </template>
      <el-table v-loading="loading" :data="records" style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="totalPoints" label="总积分" width="100" />
        <el-table-column prop="changePoints" label="变动积分" width="100" />
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="createdAt" label="时间" width="180" />
      </el-table>
      <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="fetchRecords"
          @current-change="fetchRecords"
      />

    </el-card>

    <!-- 批量调整对话框 -->
    <el-dialog v-model="batchAdjustVisible" title="批量调整积分" width="40%">
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="batchForm.userIds" type="textarea" placeholder="多个ID用英文逗号隔开, 如: 1,2,3" />
        </el-form-item>
        <el-form-item label="调整积分"><el-input-number v-model="batchForm.points" /></el-form-item>
        <el-form-item label="原因"><el-input v-model="batchForm.reason" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="batchAdjustVisible = false">取 消</el-button><el-button type="primary" @click="doBatchAdjust">确 定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { getPointsPolicy, updatePointsPolicy, getPointsRecords, batchAdjustPoints } from '@/api/points';

// 响应式数据
const loading = ref(true);
const records = ref([]);
const pagination = reactive({ current: 1, size: 10, total: 0 });
const policyForm = reactive({ dailyCheckinPoints: 10, consecutiveBonus: [{ days: 7, bonusPoints: 20 }] });
const batchAdjustVisible = ref(false);
const batchForm = reactive({ userIds: '', points: 0, reason: '' });
const chartRef = ref(null);

// 方法
const fetchPolicy = async () => {
  try { const { data } = await getPointsPolicy(); Object.assign(policyForm, data || policyForm); } catch {}
};
const savePolicy = async () => { await updatePointsPolicy(policyForm); ElMessage.success('策略已保存'); };
const fetchRecords = async () => {
  loading.value = true;
  try { const { data } = await getPointsRecords(pagination); records.value = data.records; pagination.total = data.total; } finally { loading.value = false; }
};
const addBonusRow = () => { policyForm.consecutiveBonus.push({ days: null, bonusPoints: null }); };
const removeBonusRow = (index) => { policyForm.consecutiveBonus.splice(index, 1); };
const showBatchAdjustDialog = () => { Object.assign(batchForm, { userIds: '', points: 0, reason: '' }); batchAdjustVisible.value = true; };
const doBatchAdjust = async () => {
  const userIds = batchForm.userIds.split(',').map(id => parseInt(id.trim()));
  await batchAdjustPoints({ userIds, points: batchForm.points, reason: batchForm.reason });
  ElMessage.success('批量调整成功'); batchAdjustVisible.value = false; fetchRecords();
};
const initChart = () => {
  nextTick(() => {
    const chart = echarts.init(chartRef.value);
    const option = { /* ... ECharts配置 ... */ };
    chart.setOption(option);
  });
};

// 生命周期
onMounted(() => { fetchPolicy(); fetchRecords(); initChart(); });
</script>
