<template>
  <div class="info">
    <!-- 头部标题 -->
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
      class="title"
      right-text="保存"
      @click-right="save"
      title="个人信息"
    />
    <!-- 头像&昵称&介绍 -->
    <van-cell-group style="margin-bottom:8px;">
      <van-cell @click="showUpdataAvatar" title="头像" is-link value="内容" >
        <template #default>
          <img class="avatar" :src="info.photo" alt="">
        </template>
      </van-cell>
      <van-cell title="昵称" @click="showUpdateName=true" is-link :value="info.name" />
      <van-cell title="介绍" @click="showUpdateIntro=true" is-link :value="info.intro" />
    </van-cell-group>
    <!-- 性别&生日 -->
    <van-cell-group>
      <van-cell title="性别" @click="showUpdateGender=true" is-link :value="info.gender ? '女' : '男'" />
      <van-cell title="生日" @click="showUpdateBirthday=true" is-link :value="info.birthday" />
    </van-cell-group>
    <!-- 修改名字弹出框 -->
    <van-popup v-model="showUpdateName" position="bottom" :style="{ height: '8%' }" >
      <van-field required v-model="info.name" />
    </van-popup>
    <!-- 修改介绍弹出框 -->
    <van-popup v-model="showUpdateIntro" position="bottom" :style="{ height: '8%' }" >
      <van-field required v-model="info.intro" />
    </van-popup>
    <!-- 修改性别弹出框 -->
    <van-popup v-model="showUpdateGender" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showUpdateGender = false"
        @confirm="confirmGender"
      />
    </van-popup>
    <!-- 修改生日弹出框 -->
    <van-popup v-model="showUpdateBirthday" round position="bottom">
      <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="showUpdateBirthday=false"
      @confirm="confirmBirthday"
      />
    </van-popup>
    <!-- 使用选择文件的子组件 -->
    <FilePick ref="filePickRef" />
  </div>
</template>

<script>
// 导入操作用户的网络请求
import { apiOwnInfo, apiUserProfile, apiUpdateUserInfo } from '@/api/user.js'
// 导入选择文件的子组件
import FilePick from './components/FilePick'
// 导入 dayjs 组件
import dayjs from 'dayjs'
export default {
  name: 'Info',
  components: {
    FilePick
  },
  data () {
    return {
      info: {}, // 当前用户信息
      showUpdateName: false, // 显示和隐藏修改名字弹出框
      showUpdateIntro: false, // 显示和隐藏修改介绍弹出框
      showUpdateGender: false, // 显示和隐藏修改性别弹出框
      showUpdateBirthday: false, // 显示和隐藏修改生日弹出框
      columns: ['男', '女'], // 性别的选项
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2030, 12, 31),
      currentDate: new Date()
    }
  },
  // computed: {
  //   filterDate: {
  //     get: function () {
  //       return dayjs(this.currentDate).format('YYYY-MM-DD')
  //     },
  //     set: function (newValue) {
  //       this.info.birthday = dayjs(newValue).format('YYYY-MM-DD')
  //     }
  //   }
  // },
  mounted() {
    this.getOwnInfo()
    this.getUserProfile()
  },
  methods: {
    // 保存修改
    async save () {
      try {
        // 发送请求修改用户信息
        await apiUpdateUserInfo({
          name: this.info.name,
          gender: this.info.gender,
          birthday: this.info.birthday,
          intro: this.info.intro
        })
        this.$toast.success('修改个人信息成功')
        // 成功提示
      } catch (error) {
        // 失败提示
        this.$toast.fail(error.message)
      }
    },
    // 得到用户的头像 & 昵称 & 介绍
    async getOwnInfo () {
      const res = await apiOwnInfo()
      // console.log(res)
      this.$set(this.info, 'photo', res.data.data.photo)
      this.$set(this.info, 'name', res.data.data.name)
      this.$set(this.info, 'intro', res.data.data.intro)
    },
    // 得到用户的性别 & 生日
    async getUserProfile () {
      const res = await apiUserProfile()
      // console.log(res)
      this.$set(this.info, 'gender', res.data.data.gender)
      this.$set(this.info, 'birthday', res.data.data.birthday)
    },
    // 修改头像-弹出头像选择
    showUpdataAvatar () {
      this.$refs.filePickRef.show = true
    },
    // 性别确认更改后触发的事件
    confirmGender (value) {
      // console.log(value)
      // 判断选择的值
      if (value === '男') {
        this.info.gender = 0
      } else {
        this.info.gender = 1
      }
      this.showUpdateGender = false
    },
    // 生日确认更改后触发的事件
    confirmBirthday () {
      // console.log(this.currentDate)
      // 使用dayjs格式化时间
      const birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.info.birthday = birthday
      this.showUpdateBirthday = false
    }
    // 时间选择的格式化器
    // formatter (type, val) {
    //   console.log(type)
    //   console.log(val)
    // }
  }
}
</script>

<style lang="less" scoped>
.info {
  margin-top: 46px;
  height: 621px;
  background-color: #ededed;
  .title {
    z-index: 100;
    background-color: #579df1;
    /deep/ .van-nav-bar__title,
    /deep/ .van-icon-arrow-left,
    /deep/ .van-nav-bar__text {
      color: #fff;
    }
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>
