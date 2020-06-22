<template>
      <van-cell>
          <template #title>
              <div class="comment">
                  <div class="aut_img">
                      <img :src="comment.aut_photo" alt="">
                  </div>
                  <div class="aut_msg">
                      <div class="aut_name">{{ comment.aut_name }}</div>
                      <div class="content">{{ comment.content }}</div>
                      <div class="other">
                          <span class="time">{{ comment.pubdate | timeFilter }}</span>
                          <span v-if="isShowReply" @click="reply" class="repeat">回复 {{ comment.reply_count }}</span>
                      </div>
                  </div>
                  <div class="like">
                    <van-icon :color="comment.is_liking ? 'red' : '#666'" name="like" /> {{ comment.like_count }}
                  </div>
              </div>
          </template>
      </van-cell>
</template>

<script>
// 导入bus公共实例
import bus from '@/utils/bus.js'
export default {
  name: 'CommentList',
  props: ['comment', 'isShowReply'], // isShowReply 传入一个布尔值，是否显示回复按钮
  data() {
    return {
    }
  },
  methods: {
    // 回复功能
    reply () {
      // 通过父组件打开回复弹出框
      this.$parent.$parent.replyShow = true
      // 通过bus公共实例传值给兄弟组件commentReply
      bus.$emit('transferToReply', this.comment)
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  display: flex;
  .aut_img img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .aut_msg {
    margin-left: 8px;
    flex: 1;
    .aut_name {
      color: skyblue;
    }
    .content {
        padding: 10px;
    }
    .repeat {
        padding: 6px 10px;
        background-color: #ccc;
        border-radius: 20px;
        margin-left: 20px;
    }
  }
}
</style>
