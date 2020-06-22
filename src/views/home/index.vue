<template>
  <div class="home">
      <!-- 嵌套路由出口 -->
      <router-view></router-view>
      <!-- 底部标签栏 -->
      <van-tabbar route>
        <van-tabbar-item to="/index" icon="home-o">主页</van-tabbar-item>
        <van-tabbar-item to="/search" icon="search">搜索</van-tabbar-item>
        <van-tabbar-item icon="video-o">视频</van-tabbar-item>
        <van-tabbar-item to="/my" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
