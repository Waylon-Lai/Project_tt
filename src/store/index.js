import Vue from 'vue'
import Vuex from 'vuex'
// 导入操作localStorage的方法
import { getLocal } from '@/utils/local.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 在打开项目时应该从 localstorage 中取出来 userInfo(有值的情况)
    userInfo: getLocal('userInfo') || {}
  },
  mutations: {
    // 定义一个修改 userInfo 的函数
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {},
  modules: {}
})
