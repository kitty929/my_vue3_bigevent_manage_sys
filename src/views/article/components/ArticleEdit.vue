<script setup>
import { ref } from 'vue'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 组件对外暴露一个方法 open ,基于Open传来的参数，区别添加还是编辑
// open({}) => 表单无需渲染，是添加
// open({ id, cate_name, ... }) => 表单需要渲染，是编辑
// open调用后，可以打开弹窗

const open = (row) => {
  console.log(row)
  // 显示抽屉
  visibleDrawer.value = true
  // 接收传参
}

// 暴露数据
defineExpose({
  open
})
</script>
<template>
  <!-- 抽屉 -->
  <el-drawer v-model="visibleDrawer" title="标题" direction="rtl" size="50%">
    <span>Hi</span>
  </el-drawer>
</template>
