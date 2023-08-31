<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
// 基于Store的数据，初始化imgUrl的初始值
import { useUserStore } from '../../stores/modules/user'
import { userUploadAvatarService } from '@/api/user.js'
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)

const uploadRef = ref()

const onUploadFile = (file) => {
  console.log(file)
  // 预览选择的图片
  // 基于FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
  // 或者
  // imgUrl.value = URL.createObjectURL(file.raw)
}

// 上传头像
const onUploadAvatar = async () => {
  // 发送请求更新头像
  await userUploadAvatarService(imgUrl.value)
  // userStore重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage({ type: 'success', message: '更换头像成功' })
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="10">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
      </el-col>
    </el-row>

    <br />
    <el-button
      type="primary"
      :icon="Plus"
      size="large"
      @click="uploadRef.$el.querySelector('input').click()"
      >选择图片</el-button
    >
    <el-button
      type="success"
      :icon="Upload"
      size="large"
      @click="onUploadAvatar"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
