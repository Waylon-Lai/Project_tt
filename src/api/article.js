// 用来处理所有与文章相关的网络请求
// 导入封装号的axios实例http
import http from '@/utils/request.js'
// 封装获取文章列表的网络请求
export const apiGetArticleList = (id) => {
  return http({
    method: 'get',
    url: '/app/v1_1/articles',
    params: {
      channel_id: id,
      timestamp: Date.now(),
      with_top: 0
    }
  })
}
// 封装把文章标记为不喜欢的网络请求
export const apiDislikeArticle = (articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
// 封装举报文章的网络请求
export const apiReportArticle = ({ articleId, typeId }) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type: typeId,
      remark: ''
    }
  })
}
// 封装拉黑文章作者的网络请求
export const apiAddToBlackList = (authorId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: authorId
    }
  })
}
// 封装获取搜索结果的网络请求
export const apiSearchResult = ({ page, perPage, keyWord }) => {
  return http({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      page: page,
      per_page: perPage,
      q: keyWord
    }
  })
}
// 封装获取文章详情的网络请求
export const apiGetDetail = (articleId) => {
  return http({
    method: 'get',
    url: `/app/v1_0/articles/${articleId}`
  })
}
// 封装对文章点赞的网络请求
export const apiZan = (articleId) => {
  return http({
    method: 'post',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
// 封装取消对文章点赞的网络请求
export const apiUnZan = (articleId) => {
  return http({
    method: 'delete',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
// 封装对文章不喜欢的网络请求
export function apiDislike (articleId) {
  return http.post('/app/v1_0/article/dislikes', {
    target: articleId
  })
}
// 封装取消对文章不喜欢的网络请求
export function apiCancelDislike (articleId) {
  return http.delete(`/app/v1_0/article/dislikes/${articleId}`)
}
