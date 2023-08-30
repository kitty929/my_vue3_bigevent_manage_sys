import request from '@/utils/request'

// 分类：获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}

// 分类：添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data)
}

// 分类：编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info', data)
}

// 分类：删除文章分类
export const artDelChannelService = (id) => {
  return request.delete(`/my/cate/del`, {
    params: {
      id
    }
  })
}

// 文章：获取文章列表
export const artGetListService = (params) => {
  return request.get('/my/article/list', { params })
}
