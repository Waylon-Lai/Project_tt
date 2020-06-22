<template>
  <div class="searchResult">
    <!-- <div>通过编程式导航传过来的参数：{{$route.query.key}}</div> -->
    <!-- <div>通过动态路由传过来的参数：{{$route.params.key}}</div> -->
    <!-- 头部标题 -->
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
      class="title"
      title="搜索结果"
    />
    <!-- 内容区域 -->
    <!-- 下拉刷新加载更多内容 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item, index) in resultList" :key="index">
        <van-cell @click="goToDetail(item)" >
          <template #title>
            <!-- 标题 -->
            <h4>{{ item.title }}</h4>
            <!-- 图片 -->
            <van-grid v-show="item.cover.type !== 0" :border="false" :column-num="3">
              <van-grid-item v-for="(imgItem, imgIndex) in item.cover.images" :key="imgIndex">
                <!-- 设置lazy-load属性来开启图片懒加载，需要搭配 Lazyload 组件使用 -->
                <van-image lazy-load :src="imgItem" />
              </van-grid-item>
            </van-grid>
            <!-- 文章信息 -->
            <div class="msgbox">
              <div class="left">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用全局过滤器 -->
                <span>{{ item.pubdate | timeFilter }}</span>
              </div>
            </div>
          </template>
        </van-cell>
        <van-grid direction="horizontal" :column-num="3">
          <van-grid-item @click="comment" :text="item.comm_count.toString()">
            <template #icon>
              <van-icon style="margin-right:8px;" name="comment" size="20" />
            </template>
          </van-grid-item>
          <van-grid-item text="点赞">
            <template #icon>
              <van-icon style="margin-right:8px;" name="like" size="20" />
            </template>
          </van-grid-item>
          <van-grid-item @click="share" icon="share" text="分享">
            <template #icon>
              <van-icon style="margin-right:8px;" name="share" size="20" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
    </van-list>
  </div>
</template>

<script>
// 导入获取搜索结果的网络请求
import { apiSearchResult } from '@/api/article.js'
export default {
  name: 'SearchResult',
  data() {
    return {
      loading: false,
      finished: false,
      keyWord: '', // 搜索关键词
      page: 1, // 搜索的页码
      perPage: 10, // 每页显示的数据条数
      resultList: [] // 搜索结果列表
    }
  },
  mounted () {
    // 接收动态路由传过来的搜索关键词
    this.keyWord = this.$route.params.key
  },
  methods: {
    onClickLeft() {
      this.$router.back() // 返回上一个路由
    },
    // 滚动条与底部距离小于 offset 时触发的方法
    async onLoad() {
      // 获取搜索结果
      const res = await apiSearchResult({
        page: this.page++, // 每次调用页码加1，获取新的内容
        perPage: this.perPage,
        keyWord: this.keyWord
      })
      // 将获取到的文章列表添加到当前频道中 添加的时候要通过拼接 不然会一直循环新数据覆盖老数据的情况
      this.resultList = [...this.resultList, ...res.data.data.results]
      // 数据更新完毕后，将当前频道对应loading设置成false 结束加载状态
      this.loading = false
      // 如果在当前频道没获取到文章列表 会一直发送请求获取
      // 解决方案：直接将当前频道对应finished设置成true 认定数据已加载完
      if (res.data.data.results.length === 0) {
        this.finished = true
      }
    },
    // 评论功能
    comment () {
      // // 判断用户是否登录
      // const token = this.$store.state.userInfo.token
      // if (token) {
      //   // console.log('已登录')
      // } else {
      //   this.$toast.fail('尚未登录，请登录！')
      //   this.$router.push('/login') // 跳转到登录页
      // }
      // 使用全局封装的登录验证方法
      if (!this.$login()) {
        // 未登录返回false 取反为true 因此在这中断函数
        return
      }
      console.log('登录啦')
    },
    // 点赞功能
    // 分享功能
    share () {},
    // 前往文章详情页面
    goToDetail (item) {
      // 通过动态路由方式进行路由传参
      this.$router.push(`/detail/${item.art_id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.searchResult {
  margin-top: 46px;
  .title {
    z-index: 100;
    background-color: #579df1;
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
    /deep/ .van-icon-arrow-left {
      color: #fff;
    }
  }
  .msgbox {
    .left {
      color: #999;
      span {
        margin-right: 10px;
      }
    }
  }
}
</style>
