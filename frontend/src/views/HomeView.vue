<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <h2>마이크로서비스 아키텍처 데모</h2>
            </div>
          </template>
          <div class="card-content">
            <p>이 애플리케이션은 Spring Boot와 Vue.js를 사용한 마이크로서비스 아키텍처 데모입니다.</p>
            <el-divider />
            <h3>주요 기능</h3>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="hover">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><User /></el-icon>
                      <span>사용자 관리</span>
                    </div>
                  </template>
                  <p>사용자 정보 조회 및 관리</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><Goods /></el-icon>
                      <span>상품 관리</span>
                    </div>
                  </template>
                  <p>상품 정보 조회 및 관리</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <template #header>
                    <div class="feature-header">
                      <el-icon><Connection /></el-icon>
                      <span>마이크로서비스</span>
                    </div>
                  </template>
                  <p>Spring Cloud 기반 마이크로서비스</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { User, Goods, Connection } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}

.card-content {
  text-align: center;
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.el-card {
  margin-bottom: 20px;
}
</style> 