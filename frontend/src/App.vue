<script setup>
import { ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem } from 'element-plus'
</script>

<template>
  <el-container class="layout-container">
    <el-header>
      <el-menu
        mode="horizontal"
        :router="true"
        class="el-menu-demo"
      >
        <el-menu-item index="/">홈</el-menu-item>
        <el-menu-item index="/users">사용자</el-menu-item>
        <el-menu-item index="/products">상품</el-menu-item>
      </el-menu>
    </el-header>
    
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>
.layout-container {
  min-height: 100vh;
}

.el-header {
  padding: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
