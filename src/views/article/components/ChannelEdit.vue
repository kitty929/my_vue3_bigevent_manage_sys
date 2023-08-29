<!-- ArticleChannel.vue中的一个通用组件，分别是"添加分类"和"编辑分类"时的弹窗显示和隐藏 -->

<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'
const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,12}$/,
      message: '分类名称不能超过12个字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母或数字',
      trigger: 'blur'
    }
  ]
}

// 组件对外暴露一个方法 open ,基于Open传来的参数，区别添加还是编辑
// open({}) => 表单无需渲染，是添加
// open({ id, cate_name, ... }) => 表单需要渲染，是编辑
// open调用后，可以打开弹窗

const open = (row) => {
  console.log(row)
  // 打开弹窗
  dialogVisible.value = true
  formModel.value = { ...row } //添加 -> 重置了表单内容，编辑 -> 存储了需要回显的数据
}

// 向外暴露方法
defineExpose({
  open
})

const emit = defineEmits(['success'])
// 确认按钮提交
const onSubmit = async () => {
  await formRef.value.validate()
  // 通过校验再往后面走
  const isEdit = formModel.value.id
  // 如果有id，就是编辑操作
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加操作
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  // 关闭弹窗
  dialogVisible.value = false
  // 通知父组件刷新数据
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
