// 导入 Vue
import Vue from 'vue'
// 导入 App.vue
import App from './App.vue'
// 导入 路由
import router from './router'
// 导入 vuex
import store from './store'
// 导入 Vant 组件 和 Vant 的懒加载组件
import Vant, { Lazyload } from 'vant'
// 导入 Vant 样式
import 'vant/lib/index.css'
// 导入 iconfont 字体图标样式
import '@/style/iconfont.css'
// // 导入 dayjs 组件
// import dayjs from 'dayjs'
// // 导入 dayjs 中处理相对时间的插件
// import relativeTime from 'dayjs/plugin/relativeTime'
// // 导入 dayjs 中的语言包
// import 'dayjs/locale/zh-cn'
// 导入全局过滤器
import '@/filter/myfilter.js'

// // 拓展插件
// dayjs.extend(relativeTime)
// // 全局使用语言包
// dayjs.locale('zh-cn')

// console.log('----------------------dayjs------------------------')
// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss a')) // 2020-06-13 16:54:55 下午
// console.log(dayjs().from(dayjs('1990'))) // 30 年内
// console.log(dayjs('1990').fromNow()) // 30 年前
// console.log('----------------------dayjs------------------------')

// 导入自定义插件
import Plugin from '@/utils/plugin.js'

// 使用Vant 组件
Vue.use(Vant)
// 使用Vant 的懒加载组件
Vue.use(Lazyload)
// 使用自定义插件
Vue.use(Plugin)
// use的内部执行过程
// Vue.use = function (Plugin) {
//   Plugin.install(Vue)
// }

Vue.config.productionTip = false

// // 封装一个全局的登录验证的方法
// Vue.prototype.$login = function () {
//   // 判断用户是否登录
//   const token = store.state.userInfo.token
//   if (token) {
//     return true // 返回一个true 可以执行后续代码
//   } else {
//     Vue.prototype.$toast.fail('尚未登录，请登录！') // 提示信息
//     router.push('/login') // 跳转到登录页
//     return false // 返回一个false 终止执行后续代码
//   }
// }

// 创建一个 vue 实例
new Vue({
  router, // 挂载路由到 vue 实例
  store, // 挂载vuex到 vue 实例
  render: h => h(App) // 渲染 App.vue 到 vue 实例
}).$mount('#app')
