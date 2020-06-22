<template>
  <div class="login">
    <!-- 头部标题 -->
    <van-nav-bar class="top" title="登录" />
    <!-- form表单部分 -->
    <van-form @submit="onSubmit">
      <!-- 1.手机号&验证码输入框 -->
      <van-cell-group>
        <van-field
          :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！' }
          ]"
          v-model="user.phone"
          placeholder="请输入手机号"
        >
          <template #left-icon>
            <span class="iconfont icon-phone"></span>
          </template>
        </van-field>
        <van-field
          :rules="[{ required: true, message: '请填写验证码' }]"
          v-model="user.code"
          placeholder="请输入验证码"
        >
          <!-- 使用插槽 插入按钮和图标
          1.把单标签变为双标签
          2.加一个容器 template
          3.给 template 添加插槽的属性
          4.在 template 标签之中添加内容
          -->
          <template #button>
            <van-button
              class="code"
              color="#ededed"
              round
              size="small"
              type="primary"
              >发送验证码</van-button
            >
          </template>
          <template #left-icon>
            <span class="iconfont icon-Lock"></span>
          </template>
        </van-field>
      </van-cell-group>
      <!-- 2.登录按钮 -->
      <div class="loginBtn">
        <van-button :loading="isLoading" type="info" size="large"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 1.直接导入axios的方式
// import axios from 'axios'
// 2.使用封装的axios实例http
// import http from '@/utils/request.js'
// 3.使用封装好的网络请求文件
import { apiLogin } from '@/api/user.js'
// 导入操作localStorage的方法
import { setLocal } from '@/utils/local.js'
export default {
  name: 'login',
  data () {
    return {
      isLoading: false, // 加载状态开关
      user: {
        phone: '15611111111',
        code: '246810'
      }
    }
  },
  methods: {
    async onSubmit () {
      if (this.isLoading === false) {
        // 控制多次点击按钮只发送一次请求
        // 开启加载状态
        this.isLoading = true
        // 1.直接导入axios的方式
        // axios({
        //   method: 'post',
        //   url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        //   data: {
        //     mobile: this.user.phone,
        //     code: this.user.code
        //   }
        // }).then(res => {
        //   console.log(res.data)
        //   this.$router.push('/home')
        // })
        // 2.使用封装的axios实例http
        // http({
        //   method: 'post',
        //   url: '/app/v1_0/authorizations',
        //   data: {
        //     mobile: this.user.phone,
        //     code: this.user.code
        //   }
        // }).then(res => {
        //   console.log(res.data)
        //   this.$router.push('/home')
        // })
        try {
          // 正常执行 try 中的逻辑 如果没有问题就一直执行下去（不执行 catch 中的逻辑)
          // 3.使用封装好的网络请求文件
          const res = await apiLogin({
            // 传参使用到了对象结构语法
            mobile: this.user.phone,
            code: this.user.code
          })
          // console.log(res.data)
          // 获取到登录数据后关闭加载状态
          this.isLoading = false
          // 把登录用户信息保存在vuex的仓库中
          this.$store.commit('setUserInfo', res.data.data)
          // 把登录用户信息保存在本地仓库localStorage中
          setLocal('userInfo', res.data.data)
          // console.log(this.$route.path) // 获取到当前页面的路由路径
          if (this.$route.path === '/login') {
            // 处于登录页面，跳转到首页
            this.$router.push('/home')
          } else {
            // 处于验证登录页面 返回到上一个路由
            this.$router.back()
          }
        } catch (error) {
          // 如果在 try 中的代码有错误，就会马上中断 try 中的逻辑去执行 catch 中的逻辑
          // console.log('出错啦')
          // 出错后关闭加载状态
          this.isLoading = false
          // 错误提示
          this.$toast.fail('手机号或者验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .top {
    background-color: #579df1;
    // 使用了css的局部作用域scoped 所以设置的样式无法作用于所使用的vant的标签（相当于子组件)
    // 解决方案：使用深度选择器/deep/
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
  }
  .icon-Lock {
    line-height: 30px;
  }
  .code {
    /deep/ .van-button__text {
      color: #666;
    }
  }
  .loginBtn {
    padding: 20px;
  }
}
</style>
