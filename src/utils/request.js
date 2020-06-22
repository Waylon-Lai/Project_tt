// 封装axios文件
// 1.导入axios
import axios from 'axios'
// 导入vuex中的store对象
import store from '@/store/index.js'
// 导入解决数字超过js的处理范围的第三方插件 json-bigint
import JSONbig from 'json-bigint'
// 导入操作localStorage的方法
import { setLocal } from '@/utils/local.js'
// 2.创建一个 axios 实例
const http = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn',
  // transformResponse 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理 这里的data为服务器返回来的json格式的字符串
    // 添加一个 try-catch 防止将来响应的数据为空时，代码报错
    try {
      // 使用 json-bigint 解析data
      return JSONbig.parse(data)
    } catch (error) {
      // 使用原生 JSON 解析data
      return JSON.parse(data)
    }
  }]
})

// 创建一个新的 axios 实例
const newHttp = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 3.设置请求拦截器 每次发送请求前调用
http.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 从store中获取token 若存在就设置在请求头中
    // 在请求头中设置携带token
    if (store.state.userInfo.token) {
      config.headers.Authorization = `Bearer ${store.state.userInfo.token}`
    }
    return config
  }, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 4.设置响应拦截器
http.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response
  }, async function(error) {
    // 对响应错误做点什么
    // console.dir(error)
    if (error.response.status === 401) {
      // 证明token已过期
      // 得到refresh_token
      const refreshToken = store.state.userInfo.refresh_token
      // 将 refresh_token 发送到服务器 得到新的token
      // 要使用新的axios的实例发送请求 因为老的axios实例已经在请求拦截器中设置携带token了，会把过期的token携带过去，继续报错
      const res = await newHttp({
        method: 'put',
        url: '/app/v1_0/authorizations',
        headers: {
          // 设置请求头携带refresh_token
          Authorization: `Bearer ${refreshToken}`
        }
      })
      // console.log(res)
      // 新的token
      const newToken = res.data.data.token
      // 得到新的userInfo对象
      const userInfo = {
        token: newToken,
        refresh_token: refreshToken
      }
      // 把新的 userInfo 重新设置在 store 中
      store.commit('setUserInfo', userInfo)
      // 把新的 userInfo 覆盖原先存在 localStorage 的userInfo 对象
      setLocal('userInfo', userInfo)
      // 继续完成原先由于token过期尚未完成网络请求 用回原来的axios实例
      return http(error.config) // 一定要return回去
    }
    return Promise.reject(error)
  }
)
// 5.把实例暴露出去
export default http
