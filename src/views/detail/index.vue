<template>
    <div class="detail">
        <!-- 头部标题 -->
        <van-nav-bar @click-left="$router.back()" left-arrow :fixed="true" class="mytitle" :title="detail.title" />
        <!-- 文章标题 -->
        <h1>{{ detail.title }}</h1>
        <!-- 作者信息 -->
        <van-cell class="info">
            <template #title>
                <div class="auth">
                    <div class="authImg">
                        <img :src="detail.aut_photo" alt="">
                    </div>
                    <div class="authMsg">
                        <div class="authName">{{ detail.aut_name }}</div>
                        <div class="authTime">{{ detail.pubdate | timeFilter }}</div>
                    </div>
                    <div class="follow">
                        <!-- 使用两个按钮  分别触发不同的事件 -->
                        <van-button @click="follow" v-if="detail.is_followed === false" type="info" icon="plus">关注</van-button>
                        <van-button @click="unfollow" v-else type="info">已关注</van-button>
                    </div>
                </div>
            </template>
        </van-cell>
        <!-- 文章区域 -->
        <van-cell>
            <template #title>
                <div v-html="detail.content"></div>
            </template>
        </van-cell>
        <!-- 点赞 & 不喜欢 -->
        <div class="btnbox">
            <div class="item">
                <van-button @click="unZan" v-if="detail.attitude === 1" round type="danger" icon="like" plain>点赞</van-button>
                <van-button @click="zan" v-if="detail.attitude !== 1" round type="default" icon="like" plain>点赞</van-button>
            </div>
            <div class="item">
                <van-button @click="cancelDislike" v-if="detail.attitude === 0" round type="danger" icon="delete" plain>不喜欢</van-button>
                <van-button @click="dislike" v-if="detail.attitude !== 0" round type="default" icon="delete" plain>不喜欢</van-button>
            </div>
        </div>
        <!-- 评论列表区域 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 使用评论列表组件 -->
          <CommentList :isShowReply="true" :comment="item" v-for="(item, index) in commentList" :key="index" />
        </van-list>
        <!-- 添加评论区域 -->
        <AddComment :isReply="false" @addComment="add" />
        <!-- 回复弹出层区域 -->
        <CommentReply v-model="replyShow" />
    </div>
</template>

<script>
// 导入评论列表组件
import CommentList from './component/commentList'
// 导入添加评论组件
import AddComment from './component/comment'
// 导入回复弹出层子组件
import CommentReply from './component/commentReply'
// 导入操作文章的网络请求
import { apiGetDetail, apiZan, apiUnZan, apiDislike, apiCancelDislike } from '@/api/article.js'
// 导入操作用户的网络请求
import { apiFollow, apiUnfollow } from '@/api/user.js'
// 导入操作评论的网络请求
import { apiGetComments } from '@/api/comment.js'
export default {
  name: 'Comment',
  components: {
    // 注册组件
    CommentList,
    AddComment,
    CommentReply
  },
  data () {
    return {
      loading: false,
      finished: false,
      articleId: '', // 文章id
      detail: {}, // 文章详情
      commentList: [], // 评论列表
      offset: null, // 偏移量，与后端last_id对应
      limit: 10, // 页容量
      endid: 0, // 最后一页的id
      replyShow: false // 控制回复弹出层的显示和隐藏
    }
  },
  mounted() {
    // 获取动态路由传过来的文章id
    this.articleId = this.$route.params.id
    // 调用方法获取文章详情
    this.getDetail()
  },
  methods: {
    async onLoad () {
      // console.log('onLoad')
      // 发送请求获取文章对应的评论列表
      const res = await apiGetComments({
        sourceId: this.articleId,
        offset: this.offset,
        limit: this.limit
      })
      // console.log(res)
      this.offset = res.data.data.last_id // 得到上一页对应的页码id
      this.endid = res.data.data.end_id // 得到最后一页对应的页码id
      // 将获取到的评论列表添加到当前频道中 添加的时候要通过拼接 不然会一直循环新数据覆盖老数据的情况
      this.commentList = [...this.commentList, ...res.data.data.results]
      // 数据更新完毕后，将当前频道对应loading设置成false 结束加载状态
      this.loading = false
      if (this.offset === this.endid) {
        // 数据已加载完毕
        this.finished = true
      }
    },
    // 获取文章详情
    async getDetail () {
      const res = await apiGetDetail(this.articleId)
      // console.log(res)
      this.detail = res.data.data
    },
    // 关注用户
    async follow () {
      // 判断用户是否登录
      if (!this.$login()) {
        // 未登录
        return
      }
      await apiFollow(this.detail.aut_id)
      // 手动将关注状态设置为 true
      this.detail.is_followed = true
    },
    // 取关用户
    async unfollow () {
      // 判断用户是否登录
      if (!this.$login()) {
        // 未登录
        return
      }
      // 手动将关注状态设置为 false 这里要放在发送请求前面 因为请求返回内容为空会造成报错 无法执行发送请求后面的代码
      this.detail.is_followed = false
      await apiUnfollow(this.detail.aut_id)
    },
    // 点赞文章
    async zan () {
      if (!this.$login()) {
        return
      }
      await apiZan(this.detail.art_id)
      // 手动设置 点赞状态
      this.detail.attitude = 1 // -1: 无态度，0-不喜欢，1-点赞
    },
    // 取消点赞文章
    async unZan () {
      if (!this.$login()) {
        return
      }
      // // 手动设置 取消 点赞状态
      // this.detail.attitude = -1 // -1: 无态度，0-不喜欢，1-点赞
      // await apiUnZan(this.detail.art_id)
      try {
        await apiUnZan(this.detail.art_id)
      } catch (error) {

      } finally {
        // 无论前面代码是否执行成功 最终都会执行这里的代码
        this.detail.attitude = -1
      }
    },
    // 不喜欢文章
    async dislike () {
      if (!this.$login()) {
        return
      }
      await apiDislike(this.detail.art_id)
      this.detail.attitude = 0
    },
    // 取消不喜欢文章
    async cancelDislike () {
      if (!this.$login()) {
        return
      }
      try {
        await apiCancelDislike(this.detail.aut_id)
      } catch (error) {
      } finally {
        this.detail.attitude = -1
      }
    },
    // 添加评论
    add (newComment) {
      this.commentList.unshift(newComment)
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
    margin-top: 46px;
    margin-bottom: 50px;
    .mytitle {
        background-color: #3e9df8;
        /deep/ .van-nav-bar__title {
            color: #fff;
        }
        /deep/ .van-nav-bar__arrow {
            color: #fff;
        }
    }
    .info {
      position: sticky;
      top: 46px;
      left: 0;
      z-index: 100;
    }
    h1 {
        text-align: center;
        font-weight: 400;
        padding: 20px;
    }
    .auth {
        display: flex;
        .authImg {
            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
        }
        .authMsg {
            margin-left: 10px;
            flex: 1; // flex设置1 其他兄弟的宽度会由内容撑开
        }
    }
    .btnbox {
        margin: 30px 0px;
        display: flex;
        .item {
            flex: 1;
            text-align: center;
        }
    }
}
</style>
