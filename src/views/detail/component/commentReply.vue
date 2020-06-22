<template>
  <div class="commentReply">
      <van-popup style="margin-bottom:50px" :value="value" @input="closePop" position="bottom" :style="{ height: '70%' }" >
          <van-nav-bar :title="currentComment.reply_count+'条回复'">
              <template #left>
                <van-icon @click="closePop(false)" name="cross" />
              </template>
          </van-nav-bar>
          <!-- 当前评论区域 -->
          <van-cell title="当前评论" />
          <CommentList :isShowReply="false" :comment="currentComment" />
          <!-- 回复列表区域 -->
          <van-cell title="该评论的回复:" />
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <CommentList :isShowReply="false" :comment="item" v-for="(item, index) in replyList" :key="index" />
          </van-list>
          <!-- 回复输入框区域 -->
          <AddComment @addReply="addReply" :commentId="currentComment.com_id" :isReply="true" />
        </van-popup>
  </div>
</template>

<script>
// 导入评论组件
import AddComment from './comment'
// 导入评论列表组件
import CommentList from './commentList'
// 导入bus公共实例
import bus from '@/utils/bus.js'
// 导入操作评论的网络请求
import { apiGetCommentsReply } from '@/api/comment.js'
export default {
  name: 'Reply',
  props: ['value'],
  components: {
    AddComment,
    CommentList
  },
  data () {
    return {
      loading: false,
      finished: false,
      currentComment: {}, // 当前评论
      offset: null, // 偏移量，与后端last_id对应
      limit: 10, // 页容量
      endid: 0, // 最后一页的id
      replyList: [] // 回复列表
    }
  },
  mounted () {
    bus.$on('transferToReply', comment => {
      // 通过bus公共实例接收兄弟组件的传值
      this.currentComment = comment
      // bug表现：第一次打开评论回复时，数据正常显示，第二次打开评论回复时，回复的数据依旧 是第一次的数据
      // 原因：
      //   所有的评论回复使用的同一个组件
      //   第一次打开时，会给数据赋值，关闭时，仅仅只是将面板隐藏，数据依旧保存着
      //   第二次再打开，会直接将数据进行渲染
      // 解决方案：
      //   每次显示这个组件时，应该清空上一次打开时留下来的缓存数据
      this.loading = false
      this.finished = false
      this.offset = null
      this.limit = 10
      this.endid = 0
      this.replyList = []
    })
  },
  methods: {
    // 关闭弹出层
    closePop (v) {
      this.$emit('input', v)
    },
    async onLoad () {
      // 发送请求获取当前评论的回复列表
      const res = await apiGetCommentsReply({
        sourceId: this.currentComment.com_id.toString(),
        offset: this.offset,
        limit: this.limit
      })
      this.replyList = [...this.replyList, ...res.data.data.results]
      this.offset = res.data.data.last_id
      this.endid = res.data.data.end_id
      this.loading = false
      if (this.offset === this.endid) {
        this.finished = true
      }
    },
    // 添加评论的回复
    addReply (newReply) {
      // 添加评论回复
      this.replyList.unshift(newReply)
      // 评论回复总条数加1
      this.currentComment.reply_count++
    }
  }
}
</script>

<style>

</style>
