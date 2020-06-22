<template>
  <div class="channel">
    <!-- <van-popup v-model="show" position="bottom" :style="{ height: '30%' }" > -->
    <!-- v-model 底层实现原理 通过 :value 和 @input  上面的代码相当于下面的代码
      其中input事件触发的方法为 v=>show=v（内部帮我们写好的） 这个事件我们也可以自定义
    -->
    <!-- <van-popup :value="show" @input="v=>show=v" position="bottom" :style="{ height: '30%' }" > -->
    <van-popup
      :value="show"
      @input="changeShow"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <!-- 我的频道区域 -->
      <van-cell title="我的频道">
        <template #default>
          <van-button
            @click="isShow = !isShow"
            plain
            round
            type="danger"
            size="mini"
            >{{ isShow === false ? '编辑' : '完成' }}</van-button
          >
        </template>
      </van-cell>
      <van-grid>
        <van-grid-item
          @click="changeChannel(index)"
          class="itemsFather"
          v-for="(item, index) in channelList"
          :key="index"
        >
          <template #text>
            <span :class="{ active: active === index}">{{ item.name }}</span>
            <van-icon @click.stop="delChannelFromMy(index)" v-show="isShow && index !== 0" class="items" size="12" name="clear" />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 推荐频道区域 -->
      <van-cell title="推荐频道"> </van-cell>
      <van-grid>
        <van-grid-item
          @click="addChannelToMy(item)"
          v-for="(item, index) in recommendChannel"
          :key="index"
        >
          <template #text>
            <span>{{ item.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
// 导入获取所有频道列表和批量修改用户频道列表的网络请求
import { apiGetAllChannel, apiUpdateUserChannel } from '@/api/channel.js'
// 导入操作localStorage的方法
import { setLocal } from '@/utils/local.js'
export default {
  name: 'Popup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    channelList: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShow: false, // 控制叉叉图标的显示和隐藏
      allChannel: [] // 所有的频道列表
    }
  },
  mounted() {
    // 一进入页面调用方法获取所有频道列表
    this.getAllChannel()
  },
  methods: {
    changeShow(v) {
      // 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行
      // 实际上， show 是父组件传过来的原始数据，但是我们试图通过子组件的 v-model 去改变show
      // 也就是试图通过子组件 直接 去改变父组件的数据（而不是通过发送事件的方式），这是不允许的
      // 因为 Vue 是单向数据流 也就是说， 数据总是从父组件传到子组件 ，子组件没有权利修改父组件传过来的数据， 只能请求 父组件对原始数据进行修改。
      // console.log(v) //false
      this.$parent.show = v
    },
    // 获取所有频道列表
    async getAllChannel() {
      const res = await apiGetAllChannel()
      // console.log(res)
      this.allChannel = res.data.data.channels
    },
    // 把点击的推荐频道添加到我的频道中
    addChannelToMy (item) {
      // 给每个新增的频道动态添加额外的属性
      this.$set(item, 'articleList', [])
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'refreshing', false)
      this.channelList.push(item)
      // // 判断用户是否登录
      // const token = this.$store.state.userInfo.token
      // if (token) {
      //   // 用户已登录 直接发送请求更新用户对应的频道列表
      //   // 由于后台要求我们传的请求参数为[{ id:频道id, seq: 序号}] 形式的
      //   // 并且频道id为0的对应 推荐频道 这个应该是固定的，不能被用户操作的 要从列表中删除 所以要对我的频道列表进行处理
      //   const channels = this.channelList.slice(1).map((item, index) => {
      //     return {
      //       id: item.id,
      //       seq: index + 2 // seq 频道的顺序(seq 是从 1 开始的),但是要注意 seq = 1 的位置永远是给推荐留着的 所以这里从2开始
      //     }
      //   })
      //   // console.log(channels)
      //   await apiUpdateUserChannel(channels)
      // } else {
      //   // 用户没有登录  那么应该把当前的我的频道列表存到 localStorage
      //   setLocal('channelList', this.channelList)
      // }
      // 调用方法更新用户频道列表
      this.updateUserChannel()
    },
    // 封装更新用户对应频道列表的方法
    async updateUserChannel () {
      // 判断用户是否登录
      const token = this.$store.state.userInfo.token
      if (token) {
        // 用户已登录 直接发送请求更新用户对应的频道列表
        // 由于后台要求我们传的请求参数为[{ id:频道id, seq: 序号}] 形式的
        // 并且频道id为0的对应 推荐频道 这个应该是固定的，不能被用户操作的 要从列表中删除 所以要对我的频道列表进行处理
        const channels = this.channelList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2 // seq 频道的顺序(seq 是从 1 开始的),但是要注意 seq = 1 的位置永远是给推荐留着的 所以这里从2开始
          }
        })
        // console.log(channels)
        await apiUpdateUserChannel(channels)
      } else {
        // 用户没有登录  那么应该把当前的我的频道列表存到 localStorage
        setLocal('channelList', this.channelList)
      }
    },
    // 点击叉叉图标删除我的频道
    delChannelFromMy (index) {
      this.channelList.splice(index, 1)
      // 调用方法更新用户频道列表
      this.updateUserChannel()
      // this.active > index && this.$parent.active-- // 优雅的写法
      if (this.active > index) {
        // 解决bug:当删除的的频道在当前选中的频道前面时 保持当前频道的选中状态
        this.$parent.active--
      }
    },
    // 点击我的频道更改主页选中的频道
    changeChannel (index) {
      // console.log(index)
      // this.$emit('updateActive', index)
      this.$emit('update:active', index) // 使用sync进行双向绑定的方式
    }
  },
  computed: {
    recommendChannel() {
      const ids = this.channelList.map(item => item.id)
      const newChannel = this.allChannel.filter(item => {
        return !ids.includes(item.id)
      })
      return newChannel
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .itemsFather {
    position: relative;
    .items {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
  /deep/ .van-grid-item__content {
    font-size: 12px;
  }
  .active {
    color: red;
  }
}
</style>
