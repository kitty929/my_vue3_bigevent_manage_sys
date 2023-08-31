<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'

// 不需要了，要进行动态渲染
// const articleList = ref([
//   {
//     id: 5961,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:53:52.604',
//     state: '已发布',
//     cate_name: '体育'
//   },
//   {
//     id: 5962,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:54:30.904',
//     state: '草稿',
//     cate_name: '体育'
//   }
// ])
const articleList = ref([]) //文章列表
const total = ref(0) //总条数
const loading = ref(false)

// 与子组件进行绑定,定义请求参数请求
// 不是用别名，使用id
// const cateId = ref(53799)
const params = ref({
  pagenum: 1, //当前页
  pagesize: 5, //当前页的每页条数
  cate_id: '',
  state: ''
})

const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
  console.log(articleList.value)
}
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数改变了，那么原来的正在访问的当前页意义就不大了，数据大概率不在原来那一页了
  // 重新从第一页开始渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页和每页条数开始重新渲染
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  // 更新当前页，基于最新的当前页开始渲染
  params.value.pagenum = page
  getArticleList()
}

const articleEditRef = ref()
// 添加文章逻辑
const onAddArticle = () => {
  // visibleDrawer.value = true
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  // console.log(row)
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDelArticle = (row) => {
  console.log(row)
}

// 搜索逻辑 按照最新条件重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 //重置页码
  getArticleList()
}
// 重置逻辑 将筛选条件清空，重新检索，从第一个开始展示
const onReset = () => {
  params.value.cate_id = ''
  params.value.state = ''
  params.value.pagenum = 1
  getArticleList()
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数,在渲染
    params.value.pagenum = lastPage
    getArticleList()
  } else {
    // 如果是编辑，渲染当前页
    getArticleList()
  }
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 inline属性是在一行显示 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- 通用组件-- el-select 获取文章分类;  -->
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue的简写 还是需要封装-->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布/草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            circle
            plain
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            :icon="Delete"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      :background="true"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉区域 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
