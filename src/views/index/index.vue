<template>
  <div class="index">
    <!-- 头部区域 -->
    <van-nav-bar :fixed="true" class="top" title="主页" />
    <!-- 频道区域 -->
    <van-tabs class="nav" v-model="active">
      <van-tab v-for="item in channelList" :key="item.id" :title="item.name">
        <!-- 上拉刷新重新获取内容 -->
        <van-pull-refresh v-model="item.refreshing" @refresh="onRefresh">
          <!-- 下拉刷新加载更多内容 -->
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell @click="goToDetail(subItem)" v-for="(subItem, subIndex) in item.articleList" :key="subIndex">
               <template #title>
                <!-- 标题 -->
                <h4>{{ subItem.title }}</h4>
                <!-- 图片 -->
                <van-grid v-show="subItem.cover.type !== 0" :border="false" :column-num="3">
                  <van-grid-item v-for="(imgItem, imgIndex) in subItem.cover.images" :key="imgIndex">
                    <!-- 设置lazy-load属性来开启图片懒加载，需要搭配 Lazyload 组件使用 -->
                    <van-image lazy-load :src="imgItem" />
                  </van-grid-item>
                </van-grid>
                <!-- 其它信息 -->
                <div class="msgbox">
                  <div class="left">
                    <span>{{ subItem.aut_name }}</span>
                    <span>{{ subItem.comm_count }}评论</span>
                    <!-- 使用全局过滤器 -->
                    <span>{{ subItem.pubdate | timeFilter }}</span>
                  </div>
                  <div class="right">
                    <van-icon @click="openMore(subItem)" name="cross" />
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 操作按钮 -->
    <div class="process" @click="show = true"><van-icon style="margin-top:8px;" name="bars" /></div>
    <!-- 弹出层子组件 -->
    <!-- <Popup :show="show" :active="active" @updateActive="v=>active=v" :channelList="channelList"></Popup> -->
    <!-- $event也可以捕捉到子组件传过来的值  active=$event 等于 v=>active=v -->
    <!-- <Popup :show="show" :active="active" @updateActive="active = $event" :channelList="channelList"></Popup> -->
    <!-- v-model：传入的键：value 修改的事件名 input -->
    <!-- 为了能够让数据与组件进行双向绑定：不使用 v-model 的情况下进行双向绑定，可以使用一个关键字 .sync -->
    <!-- .sync 与 v-model 的作用是一样的，也可以用来进行双向绑定 -->
    <!-- .sync 在传入时 键：为 任意的(xxx)  修改的事件名 update:xxx -->
    <!-- <Popup :show="show" :active="active" @update:active="active = $event" :channelList="channelList"></Popup> -->
    <Popup :show="show" :active.sync="active" :channelList="channelList"></Popup>
    <More ref="moreRef" :authorId="authorId" :articleId="articleId" @dislike-article="delArticle" />
  </div>
</template>

<script>
// 导入获取用户频道列表的网络请求
import { apiGetChannel } from '@/api/channel.js'
// 导入操作localStorage的方法
import { getLocal } from '@/utils/local.js'
// 导入获取文章列表的网络请求
import { apiGetArticleList } from '@/api/article.js'
// 导入弹出层子组件
import Popup from './components/popup'
// 导入更多 子组件
import More from './components/more'
export default {
  name: 'Index',
  components: {
    Popup,
    More
  },
  data() {
    return {
      // list: [],
      // loading: false, // 上拉刷新加载状态
      // finished: false, // 上拉刷新完成状态
      // refreshing: false, // 下拉刷新加载状态
      channelList: [], // 用户频道列表
      active: 0, // 频道区域当前选中标签的标识符
      show: false, // 控制弹出层的显示和隐藏
      articleId: '', // 文章id
      authorId: '' // 文章作者id
    }
  },
  mounted() {
    this.getChannel()
  },
  methods: {
    // 滚动条与底部距离小于 offset 时触发的方法
    async onLoad() {
      // console.log('触底啦')
      // List 组件通过loading和finished两个变量控制加载状态，当组件滚动到底部时，会触发load事件并将loading设置成true。
      // 此时可以发起异步操作并更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   console.log(this.list.length)
      //   // 数据更新完毕后，将loading设置成false 结束加载状态即可
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     // 若数据已全部加载完毕，则直接将finished设置成true即可。
      //     this.finished = true
      //   }
      // }, 1000)
      // console.log(this.active)
      // 获取当前选中的频道
      const currentChannel = this.channelList[this.active]
      // 获取当前选中的频道id
      const currentChannelId = currentChannel.id
      // 发送请求获取文章列表
      const res = await apiGetArticleList(currentChannelId)
      // console.log(res)
      // 将获取到的文章列表添加到当前频道中 添加的时候要通过拼接 不然会一直循环新数据覆盖老数据的情况
      currentChannel.articleList = [...currentChannel.articleList, ...res.data.data.results]
      // 数据更新完毕后，将当前频道对应loading设置成false 结束加载状态
      currentChannel.loading = false
      // 如果在当前频道没获取到文章列表 会一直发送请求获取
      // 解决方案：直接将当前频道对应finished设置成true 认定数据已加载完
      if (res.data.data.results.length === 0) {
        currentChannel.finished = true
      }
    },
    onRefresh() {
      // console.log('下拉刷新啦')
      // // 假设页面原先的内容已加载完了
      // this.finished = true
      // // 下拉刷新时会触发 refresh 事件，将 refreshing 设置成true
      // // 在事件的回调函数中可以进行同步或异步操作，操作完成后将 refreshing 设置为 false，表示加载完成。
      // setTimeout(() => {
      //   // 首先要清除原先页面显示的内容
      //   this.list = []
      //   // 重新获取新内容
      //   this.finished = false
      //   // 将 refreshing 设置为 false，表示加载完成
      //   this.refreshing = false
      // }, 1000)
      // 获取到当前频道
      const currentChannel = this.channelList[this.active]
      // 首先要清除原先页面显示的内容
      currentChannel.articleList = []
      // currentChannel.loading = false
      currentChannel.finished = false
      currentChannel.refreshing = false
      this.onLoad()
    },
    // 获取用户频道列表
    async getChannel() {
      try {
        // 得到用户信息 判断用户是否登录
        const token = this.$store.state.userInfo.token
        if (token) {
          // 用户登录了 从服务器中获取当前用户对应的频道列表
          const res = await apiGetChannel()
          // console.log(res.data)
          this.channelList = res.data.data.channels
        } else {
          // 用户没有登录 判断 localStorage 中是否存在频道数据
          const myChannel = getLocal('channelList')
          if (myChannel) {
            // localStorage 中存在数据 直接将数据拿出来渲染
            this.channelList = myChannel
          } else {
            // localStorage 中不存在数据 则从服务器中获取默认的7条频道列表
            const res = await apiGetChannel()
            this.channelList = res.data.data.channels
          }
        }
      } catch (error) {
        console.log('出错了')
      }
      // 获取到数据后调用方法给每个单独的频道添加额外的属性
      this.addOtherProp()
    },
    // 给每个单独的频道添加额外的属性
    addOtherProp() {
      // 由于不同的频道下的数据源是不一样的，所以将来要正确渲染数据需要给每个频道都设置一组自己的数据
      this.channelList.forEach(item => {
        // item.articleList = [] // 文章列表
        // item.loading = false // 上拉刷新加载状态
        // item.finished = false // 上拉刷新完成状态
        // item.refreshing = false // 下拉刷新加载状态
        // 加载完文章数据之后，页面不会马上显示这个数据，先切换到另一个频道之后再切换回来才会执行
        // 因为 articleList 数据是 channelList 定义之后，动态添加上去的数据，而这样的数据是没有响应式特点的
        //  这个问题的解决方案：this.$set(obj,prop,value)
        this.$set(item, 'articleList', [])
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'refreshing', false)
      })
      // console.log(this.channelList)
    },
    // 打开更多页面
    openMore (article) {
      this.$refs.moreRef.show = true
      // 获取到点击对应的文章id
      this.articleId = article.art_id
      this.authorId = article.aut_id
    },
    // 删除不感兴趣的文章
    delArticle (artID) {
      // console.log(artID) // 拿到从子组件传过来的要删除的文章id
      // 得到当前频道
      const currentChannel = this.channelList[this.active]
      // 删除对应id的文章
      currentChannel.articleList.forEach((item, index) => {
        if (item.art_id === artID) {
          currentChannel.articleList.splice(index, 1)
        }
      })
    },
    // 前往文章详情页
    goToDetail (item) {
      this.$router.push(`/detail/${item.art_id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.index {
  margin-top: 90px;
  margin-bottom: 50px;
  .top {
    background-color: #579df1;
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
  }
  .nav {
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      left: 0px;
      z-index: 999;
      width: 90%;
    }
  }
  .process {
    position: fixed;
    top: 46px;
    right: 0px;
    width: 10%;
    height: 44px;
    line-height: 44px;
    background-color: skyblue;
    text-align: center;
    font-size: 30px;
    z-index: 1000;
  }
  .msgbox {
    display: flex;
    justify-content: space-between;
    .left {
      color: #999;
      span {
        margin-right: 10px;
      }
    }
    .right {
      border: 1px solid #ccc;
      width: 24px;
      height: 15px;
      text-align: center;
      line-height: 15px;
    }
  }
}
</style>
