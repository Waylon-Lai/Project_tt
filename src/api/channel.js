// 用来处理所有与频道相关的网络请求
// 导入封装号的axios实例http
import http from '@/utils/request.js'
// 获取用户频道列表的网络请求
export const apiGetChannel = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}
// 获取所有频道列表的网络请求
export const apiGetAllChannel = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 批量修改用户频道列表的网络请求
export const apiUpdateUserChannel = (channels) => {
  return http({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels: channels
    }
  })
}
