<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService } from '@/api/article.js'
import { artGetDetailService } from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { artEditService } from '@/api/article.js'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}

// 提供数据
const formModel = ref({
  ...defaultForm
})

// 图片上传相关逻辑
const imgUrl = ref('')

// 组件对外暴露一个方法 open ,基于Open传来的参数，区别添加还是编辑
// open({}) => 表单无需渲染，是添加
// open({ id, cate_name, ... }) => 表单需要渲染，是编辑
// open调用后，可以打开弹窗

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 编辑器的ref
const editRef = ref()
const open = async (row) => {
  console.log(row)
  // 显示抽屉
  visibleDrawer.value = true
  // 接收传参,回显填充
  if (row.id) {
    // 需要基于row.id发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    console.log('编辑回显', res)
    formModel.value = res.data.data
    // 图片需要单独处理
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意： 提交给后台的数据格式，必须是file 对象格式
    // 需要将网路图片地址 转换为 file对象，存储起来
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    console.log('添加')
    formModel.value = {
      ...defaultForm //基于默认数据重置form数据
    }
    // 需要重置图片和content(富文本编辑器)，上面只重置了表单数据。因为imgUrl是上传img地址
    imgUrl.value = ''
    editRef.value.setHTML('')
  }
}

//
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //预览图片
  formModel.value.cover_img = uploadFile.raw
  console.log(uploadFile)
}

const emit = defineEmits('success')
// 提交
const onPublish = async (state) => {
  // 将已发布或草稿的状态写入
  formModel.value.state = state

  // 注意： 当前接口，需要的是formData对象
  // 将普通对象 转换成 formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    console.log('编辑')
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    console.log('添加')
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件添加成功,重新渲染最后一页，因为新的数据添加到了最后一页
    emit('success', 'add')
  }
}

// 暴露数据
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭elment-plus的自动上传，不需要配置action等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图表
             语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
