<template>
  <div class="users">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>사용자 목록</span>
              <el-button type="primary" @click="handleAdd">새 사용자</el-button>
            </div>
          </template>
          
          <el-table :data="users" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="사용자명" />
            <el-table-column prop="name" label="이름" />
            <el-table-column prop="email" label="이메일" />
            <el-table-column label="작업" width="150">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">수정</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">삭제</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 사용자 추가/수정 다이얼로그 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '사용자 수정' : '새 사용자 추가'"
      width="500px"
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="사용자명">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="비밀번호">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="이름">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="이메일">
          <el-input v-model="userForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="handleSubmit">확인</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:9898/api'

const users = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const userForm = ref({
  id: null,
  username: '',
  password: '',
  name: '',
  email: ''
})

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`)
    users.value = response.data
  } catch (error) {
    ElMessage.error('사용자 목록을 불러오는데 실패했습니다.')
  }
}

const handleAdd = () => {
  isEdit.value = false
  userForm.value = { id: null, username: '', password: '', name: '', email: '' }
  dialogVisible.value = true
}

const handleEdit = (user) => {
  isEdit.value = true
  userForm.value = { ...user }
  dialogVisible.value = true
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      '정말로 이 사용자를 삭제하시겠습니까?',
      '경고',
      {
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        type: 'warning'
      }
    )
    await axios.delete(`${API_BASE_URL}/users/${user.id}`)
    ElMessage.success('사용자가 삭제되었습니다.')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('사용자 삭제에 실패했습니다.')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`${API_BASE_URL}/users/${userForm.value.id}`, userForm.value)
      ElMessage.success('사용자가 수정되었습니다.')
    } else {
      await axios.post(`${API_BASE_URL}/users`, userForm.value)
      ElMessage.success('사용자가 추가되었습니다.')
    }
    dialogVisible.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error(isEdit.value ? '사용자 수정에 실패했습니다.' : '사용자 추가에 실패했습니다.')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 