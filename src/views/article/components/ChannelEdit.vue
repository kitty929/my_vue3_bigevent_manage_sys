<!-- ArticleChannel.vue中的一个通用组件，分别是"添加分类"和"编辑分类"时的弹窗显示和隐藏 -->

<script setup>
import { ref } from 'vue'
const dialogVisible = ref(false)

// 组件对外暴露一个方法 open ,基于Open传来的参数，区别添加还是编辑
// open({}) => 表单无需渲染，是添加
// open({ id, cate_name, ... }) => 表单需要渲染，是编辑
// open调用后，可以打开弹窗

const open = (row) => {
  console.log(row)
  // 打开弹窗
  dialogVisible.value = true
}

// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加弹层" width="30%">
    <div>我是内容部分</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
