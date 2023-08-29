<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
const channelList = ref([])
const loading = ref(false)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  console.log(channelList.value)
}
getChannelList()

const onEditChannel = (row, $index) => {
  console.log(row, $index)
}
const onDeleteChannel = (row, $index) => {
  console.log(row, $index)
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button>添加分类</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%">
      <el-table-column lable="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" lable="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" lable="分类别名"></el-table-column>
      <el-table-column lable="操作" width="100">
        <!-- row是channelList的每一项，$index是索引 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
            >编辑</el-button
          >
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteChannel(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
