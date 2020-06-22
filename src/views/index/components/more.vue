<template>
  <div class="more">
      <van-popup class="morepop" v-model="show" @closed="isReport=false">
        <!-- 操作页面 -->
        <van-cell-group v-if="isReport === false">
          <van-cell @click="dislike" icon="bill-o" title="不感兴趣" />
          <van-cell @click="isReport=true" class="mycell" icon="warn-o" is-link title="反馈垃圾内容" />
          <van-cell @click="addToBlacklist" title="拉黑作者" />
        </van-cell-group>
        <!-- 举报详情页面 -->
        <van-cell-group v-else>
          <van-cell @click="isReport=false" icon="arrow-left" />
          <van-cell @click="reportArticle(item.id)" v-for="item in report" :key="item.id" :title="item.type" />
        </van-cell-group>
      </van-popup>
  </div>
</template>

<script>
// 导入操作文章的网络请求
import { apiDislikeArticle, apiReportArticle, apiAddToBlackList } from '@/api/article.js'
export default {
  props: ['articleId', 'authorId'],
  data() {
    return {
      show: false, // 是否显示弹出层
      // 举报类别
      report: [
        { id: 0, type: '其他问题' },
        { id: 1, type: '标题夸张' },
        { id: 2, type: '低俗色情' },
        { id: 3, type: '错别字多' },
        { id: 4, type: '旧闻重复' },
        { id: 5, type: '广告软文' },
        { id: 6, type: '内容不实' },
        { id: 7, type: '涉嫌违法犯罪' },
        { id: 8, type: '侵权' }
      ],
      isReport: false // 是否显示举报详情页面
    }
  },
  methods: {
    // 把文章标记为不喜欢
    async dislike () {
      // 判断用户是否登录
      const token = this.$store.state.userInfo.token
      if (token) {
        // 把文章id 又传回父组件
        // 事件名最好不要用驼峰命名法
        this.$emit('dislike-article', this.articleId)
        // 发送请求把文章标记为不喜欢
        await apiDislikeArticle(this.articleId)
      } else {
        // 用户没有登录
        this.$toast('对不起，只有登录之后才能进行操作')
      }
      // 关闭弹出层
      this.show = false
    },
    // 举报文章
    async reportArticle (typeId) {
      // 判断用户是否登录
      const token = this.$store.state.userInfo.token
      if (token) {
        try {
          await apiReportArticle({
            articleId: this.articleId,
            typeId: typeId
          })
          // 成功提示
          this.$toast.success('举报成功')
        } catch (error) {
          // 失败提示
          this.$toast.fail('操作异常，举报失败')
        }
      } else {
        // 用户没有登录
        this.$toast('对不起，只有登录之后才能进行操作')
      }
      // 关闭弹出层
      this.show = false
      // 切回更多操作
      this.isReport = false
    },
    // 拉黑文章作者
    async addToBlacklist () {
      const token = this.$store.state.userInfo.token
      if (token) {
        try {
          await apiAddToBlackList(this.authorId)
          this.$toast.success('拉黑成功,请刷新')
        } catch (error) {
          this.$toast.fail('操作异常，拉黑失败')
        }
      } else {
        this.$toast('对不起，只有登录之后才能进行操作')
      }
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.more {
    .morepop {
        width: 90%;
        border-radius: 5px;
        .mycell {
            border-top: 1px solid #cecece;
            border-bottom: 1px solid #cecece;
        }
    }
}
</style>
