import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入自定义组件
import Login from '@/views/login/index.vue'
import Home from '@/views/home'
import Index from '@/views/index'
import My from '@/views/my/index.vue'
import Search from '@/views/search/index.vue'
import SearchResult from '@/views/searchResult'
import Detail from '@/views/detail/index.vue'
import Info from '@/views/info'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  // 添加一个验证登录路由 路由组件依然是Login
  {
    path: '/checkLogin',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 路由重定向
    redirect: '/index',
    // 配置嵌套路由
    children: [
      {
        // 以 / 开头的嵌套路径会被当作根路径
        path: '/index',
        component: Index
      },
      {
        path: '/my',
        component: My
      },
      {
        path: '/search',
        component: Search
      }
    ]
  },
  {
    // path: '/searchResult',
    // 配置动态路由
    path: '/searchResult/:key',
    component: SearchResult
  },
  {
    // path: '/searchResult',
    // 配置动态路由
    path: '/detail/:id',
    component: Detail
  },
  {
    path: '/info',
    component: Info
  }
]

const router = new VueRouter({
  routes
})

export default router
