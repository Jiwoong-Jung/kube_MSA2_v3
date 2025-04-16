<template>
  <div class="products">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>상품 목록</span>
              <el-button type="primary" @click="handleAdd">새 상품</el-button>
            </div>
          </template>
          
          <el-table :data="products" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="상품명" />
            <el-table-column prop="description" label="설명" />
            <el-table-column prop="price" label="가격">
              <template #default="scope">
                {{ scope.row.price.toLocaleString() }}원
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="재고" />
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

    <!-- 상품 추가/수정 다이얼로그 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '상품 수정' : '새 상품 추가'"
      width="500px"
    >
      <el-form :model="productForm" label-width="80px">
        <el-form-item label="상품명">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="설명">
          <el-input v-model="productForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="가격">
          <el-input-number v-model="productForm.price" :min="0" :step="1000" />
        </el-form-item>
        <el-form-item label="재고">
          <el-input-number v-model="productForm.stock" :min="0" :step="1" />
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

const products = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const productForm = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  stock: 0
})

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`)
    products.value = response.data
  } catch (error) {
    ElMessage.error('상품 목록을 불러오는데 실패했습니다.')
  }
}

const handleAdd = () => {
  isEdit.value = false
  productForm.value = { id: null, name: '', description: '', price: 0, stock: 0 }
  dialogVisible.value = true
}

const handleEdit = (product) => {
  isEdit.value = true
  productForm.value = { ...product }
  dialogVisible.value = true
}

const handleDelete = async (product) => {
  try {
    await ElMessageBox.confirm(
      '정말로 이 상품을 삭제하시겠습니까?',
      '경고',
      {
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        type: 'warning'
      }
    )
    await axios.delete(`${API_BASE_URL}/products/${product.id}`)
    ElMessage.success('상품이 삭제되었습니다.')
    fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('상품 삭제에 실패했습니다.')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`${API_BASE_URL}/products/${productForm.value.id}`, productForm.value)
      ElMessage.success('상품이 수정되었습니다.')
    } else {
      await axios.post(`${API_BASE_URL}/products`, productForm.value)
      ElMessage.success('상품이 추가되었습니다.')
    }
    dialogVisible.value = false
    fetchProducts()
  } catch (error) {
    ElMessage.error(isEdit.value ? '상품 수정에 실패했습니다.' : '상품 추가에 실패했습니다.')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products {
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