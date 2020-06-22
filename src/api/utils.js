// 用来处理其他类的网络请求
// 导入封装好的axios实例http
import http from '@/utils/request.js'
// 获取联想建议（自动补全）的网络请求
export const apiThink = (searchWord) => {
  return http({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q: searchWord
    }
  })
}
