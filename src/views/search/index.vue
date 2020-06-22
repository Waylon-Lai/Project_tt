<template>
  <div class="search">
      <!-- 头部搜索框 -->
       <van-search
            v-model="inputValue"
            background="#3296fa"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
            @input="think"
        />
      <!-- 联想区域 -->
      <van-cell-group v-if="thinkList.length !== 0">
          <van-cell title="您可能想搜索" />
          <van-cell @click="onSearch(item.oldItem)" v-for="(item, index) in thinkList" :key="index" icon="search">
            <template #title>
              <span v-html="item.newItem"></span>
            </template>
          </van-cell>
      </van-cell-group>
      <!-- 搜索历史区域 -->
      <van-cell-group v-else>
          <van-cell title="历史记录">
              <template #default>
                  <van-icon @click="clearHistory" name="delete" />
              </template>
          </van-cell>
          <van-cell @click="onSearch(item)" v-for="(item, index) in historyList" :key="index" icon="search" :title="item">
              <template #default>
                  <van-icon @click.stop="delHistory(index)" name="cross" />
              </template>
          </van-cell>
      </van-cell-group>

  </div>
</template>

<script>
// 导入获取联想建议（自动补全）的网络请求
import { apiThink } from '@/api/utils.js'
// 导入操作localStorage的方法
import { setLocal, getLocal, removeLocal } from '@/utils/local.js'
export default {
  name: 'Search',
  data() {
    return {
      inputValue: '', // 搜索框中输入的内容
      thinkList: [], // 联想内容列表
      timer: null, // 声明一个计时器 用于防抖
      historyList: getLocal('history') || [] // 一进入页面就获取localStorage中的历史记录列表
    }
  },
  methods: {
    // 当前点击回车（完成）时会触发的方法
    onSearch (value) {
      // console.log(value)
      // 通过编程式导航的方式进行路由传参
      // this.$router.push(`/searchResult?key=${value}`)
      // this.$router.push({
      //   path: '/searchResult',
      //   query: {
      //     key: value
      //   }
      // })
      // 通过动态路由方式进行路由传参
      this.$router.push(`/searchResult/${value}`)
      // 把搜索内容存到 历史记录列表 中 (使用unshift从头部插入)
      this.historyList.unshift(value)
      // 数组去重
      this.historyList = [...new Set(this.historyList)]
      // 把 历史记录列表 存到 localStorage 中
      setLocal('history', this.historyList)
    },
    // 点击取消时触发
    onCancel () {
      console.log('onCancel')
    },
    // 根据输入内容获取联想内容
    think () {
      // 一进来就清除之前的计时器
      // 放在判断内容为空后面的话 会出现一个bug：
      // 当我们快速删除全部内容的时候（时间少于300毫秒） 此时由于输入内容为空 会执行return中断函数 无法清除计时器
      // 而在最后一个计时器中会执行代码发送请求，由于此时输入内容已为空 所以会报错
      clearTimeout(this.timer)
      // 判断输入内容是否为空
      if (this.inputValue.trim().length === 0) {
        // 内容为空
        this.thinkList = [] // 清除联想内容列表
        return // 不再发送请求
      }
      // 内容不为空则继续发送请求获取联想内容列表
      // 设置计时器
      this.timer = setTimeout(async () => {
        const res = await apiThink(this.inputValue)
        // console.log(res)
        // 为了达到关键字高亮的效果 可以在得到所有联想的结果后
        // 遍历数据联想的结果的数据源，将里面所有包含关键字的内容进行内容的替换（换成有标签包裹的内容）
        // 最后将数据在页面上遍历时，使用 v-html 来渲染
        const oldArr = res.data.data.options
        this.thinkList = oldArr.map(item => {
          // return item.replace(this.inputValue, `<span style="color: red">${this.inputValue}</span>`)
          // 用正则进行全局匹配
          // return item.replace(new RegExp(this.inputValue, 'g'), `<span style="color: red">${this.inputValue}</span>`)
          return {
            oldItem: item, // 原来的数据 用于路由传参
            newItem: item.replace(new RegExp(this.inputValue, 'g'), `<span style="color: red">${this.inputValue}</span>`) // 替换后的数据 用于页面渲染
          }
        })
      }, 300)
    },
    // 删除单条历史记录
    delHistory (index) {
      // 从历史记录列表中删除
      this.historyList.splice(index, 1)
      // 把 新的历史记录列表 重新存到 localStorage 中
      setLocal('history', this.historyList)
    },
    // 清空所有历史记录
    clearHistory () {
      // 确认提示
      this.$dialog.confirm({
        title: '提示',
        message: '是否要清空所有的历史记录？'
      }).then(() => {
        // on confirm
        this.historyList = [] // 清空历史记录列表
        removeLocal('history') // 在 localStorage 中删除对应数据
      }).catch(() => {
        // on cancel
        this.$toast.success('已取消')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .van-search__action {
    color: #fff;
  }
  .van-search__action:active {
    background-color: skyblue;
  }
}
</style>
