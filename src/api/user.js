// 用来处理所有与用户相关的网络请求
// 1.导入封装号的axios实例http
import http from '@/utils/request.js'
// 2. 封装注册登录的请求并导出
export const apiLogin = ({ mobile, code }) => {
  return http({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data: {
      mobile: mobile,
      code: code
    }
  })
}
// 封装关注用户的网络请求
export const apiFollow = (userId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
// 封装获取关用户的网络请求
export const apiUnfollow = (userId) => {
  return http({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
// 获取用户自己信息的网络请求
export const apiOwnInfo = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user'
  })
}
// 获取用户个人资料的网络请求
export const apiUserProfile = () => {
  return http({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}
// 修改用户信息的网络请求
export const apiUpdateUserInfo = ({ name, gender, birthday, intro }) => {
  return http({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name: name,
      gender: gender,
      birthday: birthday,
      intro: intro
    }
  })
}
// 编辑用户照片资料（头像、身份证照片)的网络请求
export const apiUploadPhoto = (avatar) => {
  // 默认情况下 axios 与 ajax 一样，只能发送字符到服务器
  // 而现在 photo 并不是字符，而是一个图片文件，所以将来 axios 在发送时，不能解析图片，将 photo 设置为空
  // 问题： axios 不直接发送图片
  // 在 xhr2 中有一个新的对象 FormData ，可以用来帮助 xhr 发送图片到服务器
  // 1.创建一个FormData实例
  var fd = new FormData()
  // 2.将图片文件添加到这个实例中
  fd.append('photo', avatar)
  return http({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data: fd // 3.上传这个实例
  })
}

// 或者通过按需导出
// export { apiLogin }
