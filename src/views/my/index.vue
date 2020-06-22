<template>
  <div class="my">
    <!-- 个人信息区域 -->
    <div class="info">
      <div class="msg">
        <img @click="$router.push('/info')" :src="ownInfo.photo" alt="">
        <span>{{ ownInfo.name }}</span>
        <div class="read">
          <div>今日阅读</div>
          <div> 0 分钟</div>
        </div>
      </div>
      <div class="other">
        <div class="item">
          <div>{{ ownInfo.art_count }}</div>
          <div>动态</div>
        </div>
        <div class="item">
          <div>{{ ownInfo.follow_count }}</div>
          <div>关注</div>
        </div>
        <div class="item">
          <div>{{ ownInfo.fans_count }}</div>
          <div>粉丝</div>
        </div>
      </div>
    </div>
    <!-- 收藏区域 -->
    <van-grid :column-num="3">
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="clock-o" text="历史" />
      <van-grid-item icon="description" text="作品" />
    </van-grid>
    <!-- 信息区域 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link />
    </van-cell-group>
  </div>
</template>

<script>
// 导入操作用户的网络请求
import { apiOwnInfo } from '@/api/user.js'
export default {
  data () {
    return {
      ownInfo: {}
    }
  },
  mounted() {
    // 一进入页面就获取用户自己的信息
    this.getOwnInfo()
  },
  methods: {
    async getOwnInfo () {
      const res = await apiOwnInfo()
      // console.log(res)
      this.ownInfo = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  .info {
    width: 100%;
    height: 200px;
    background-color: #3e9df8;
    color: #fff;
    overflow: hidden;
    .msg {
      display: flex;
      margin-top: 50px;
      margin-left: 30px;
      position: relative;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .read {
        position: absolute;
        top: 0px;
        right: 0px;
        background-color: rgba(0, 0, 0, .3);
        font-size: 12px;
        padding: 5px 10px;
        text-align: center;
        border-radius: 24px 0 0 24px; // opacity: .5;
      }
    }
    .other {
      display: flex;
      margin-top: 30px;
      .item {
        text-align: center;
        flex: 1;
      }
    }
  }
  /deep/ .van-icon-star-o::before {
    color: red;
  }
  /deep/ .van-icon-description::before {
    color: orange;
  }
  /deep/ .van-icon-clock-o::before {
    color: skyblue;
  }
}
</style>
