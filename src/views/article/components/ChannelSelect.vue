<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'

defineProps({
  modelValue: {
    type: [String, Number]
  }
})
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value)
}
getChannelList()
</script>
<template>
  <!-- label是展示给用户看的，value是提交给后台 -->
  <!-- <el-select v-model="modelValue"> 不能这样写 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<style></style>
