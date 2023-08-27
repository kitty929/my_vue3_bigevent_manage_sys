import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)
    const add = (num) => {
      count.value += num
    }
    return {
      count,
      add
    }
  },
  {
    persist: true
  }
)
