import { createRouter, createWebHistory } from 'vue-router'

// createRouter创建路由实例
// 配置history模式
// 1. history模式： createWebHistory  地址栏不带#
// 2. hash模式： createWebHashHistory  地址栏带#

// vite中的环境变量：import.meta.env.BASE_URL  就是vite.config.js中的base配置，配置链接中的前面总是带有的一个base，比如/jd/home,/jd/index
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        }
      ]
    }
  ]
})

export default router
