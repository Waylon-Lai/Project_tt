// 用来处理所有与用户相关的网络请求
// 导入封装号的axios实例http
import http from '@/utils/request.js'

// 封装获取评论的网络请求
export const apiGetComments = ({ sourceId, offset, limit }) => {
  return http({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source: sourceId, // 源id，文章id或评论id
      offset: offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit: limit // 每页获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
    }
  })
}
// 封装获取评论回复的网络请求
export const apiGetCommentsReply = ({ sourceId, offset, limit }) => {
  return http({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source: sourceId, // 源id，文章id或评论id
      offset: offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit: limit // 每页获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
    }
  })
}
// 封装添加评论的网络请求
export const apiAddComments = ({ articleId, content }) => {
  return http({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target: articleId,
      content: content
    }
  })
}

// 封装添加评论回复的网络请求
export const apiAddCommentsReply = ({ commentId, content, articleId }) => {
  return http({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target: commentId,
      content: content,
      art_id: articleId
    }
  })
}
