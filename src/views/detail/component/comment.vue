<template>
  <div class="comment">
      <van-field class="box" v-model="value" center clearable placeholder="写评论">
          <template #button>
              <van-button @click="submit" size="small" type="primary">发表</van-button>
          </template>
      </van-field>
  </div>
</template>

<script>
// 添加操作comment的网络请求
import { apiAddComments, apiAddCommentsReply } from '@/api/comment.js'
export default {
  name: 'AddComment',
  props: ['isReply', 'commentId'], // isReply传过来布尔值 true代表添加评论的回复 false代表添加评论
  data () {
    return {
      value: '', // 输入的评论内容
      articleId: ''
    }
  },
  mounted() {
    this.articleId = this.$route.params.id
  },
  methods: {
    // 发表功能
    async submit () {
      // 判断用户是否登录
      if (!this.$login()) return
      if (this.isReply) {
        // 添加评论的回复
        const res = await apiAddCommentsReply({
          commentId: this.commentId.toString(),
          content: this.value,
          articleId: this.articleId
        })
        // console.log(res)
        // 得到新的评论回复对象
        const newReply = res.data.data.new_obj
        // 把新的评论回复对象推送到父组件的replyList中
        this.$emit('addReply', newReply)
      } else {
        // 添加评论
        const res = await apiAddComments({
          articleId: this.articleId,
          content: this.value
        })
        // console.log(res)
        // 得到新的评论数据对象
        const newComment = res.data.data.new_obj
        // 把新的评论数据对象推送到父组件的comemntList中
        // this.$parent.commentList.unshift(newComment)
        this.$emit('addComment', newComment)
      }
      // 清空输入框
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    /deep/ .van-field__control {
        border: 1px solid #ccc;
        height: 30px;
        border-radius: 30px;
        padding-left: 10px;
    }
}
</style>
