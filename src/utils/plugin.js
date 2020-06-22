// 封装Vue的插件：用来全局登录验证
import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'
Vue.use(Toast)
// 创建一个对象
const pluginObj = {}
// 添加一个install方法 传入vue
pluginObj.install = function (vue) {
  // 在这里给Vue添加全局方法
  vue.prototype.$login = function () {
    // 判断用户是否登录
    const token = store.state.userInfo.token
    if (token) {
      return true // 返回一个true 可以执行后续代码
    } else {
      Toast.fail('尚未登录，请登录！') // 提示信息
      router.push('/checkLogin') // 跳转到验证登录页面
      return false // 返回一个false 终止执行后续代码
    }
  }
}
// 暴露出去
export default pluginObj
