import Vue from 'vue'

// 导入 dayjs 组件
import dayjs from 'dayjs'
// 导入 dayjs 中处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入 dayjs 中的语言包
import 'dayjs/locale/zh-cn'

// 拓展插件
dayjs.extend(relativeTime)
// 全局使用语言包
dayjs.locale('zh-cn')

// 创建一个全局过滤器
Vue.filter('timeFilter', function (value) {
  // 处理时间
  // return dayjs().from(dayjs(value))
  return dayjs(value).fromNow()
})
