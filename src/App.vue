<script setup>
import { useUserStore, useCounterStore } from '@/stores'

// 在vue3 CompositionAPI中
// 1. 获取路由对象 router useRouter()
//    const router = useRouter()
// 2. 获取路由参数 route useRoute()
//   const route = useRoute()

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const goList = () => {
  // this.$router.push('/list') 这是错的
  console.log(router, route)
  router.push('/list')
}

const userStore = useUserStore()
const useCounter = useCounterStore()
</script>

<template>
  <router-view></router-view>
  <hr />
  <hr />
  <hr />

  <div>这是App.vue</div>
  <test-demo></test-demo>
  <el-button @click="$router.push('/home')">跳首页</el-button>
  <el-button @click="goList">跳列表页</el-button>

  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>

  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('wm login token')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button>

  <hr />
  <p>{{ useCounter.count }}</p>
  <el-button @click="useCounter.add(3)">+3</el-button>
</template>

<style scoped></style>
