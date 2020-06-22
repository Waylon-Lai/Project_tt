<template>
  <div class="filePick">
    <van-popup class="filePop" v-model="show">
      <div class="picker">
        <div @click="openFile">从相册中选择</div>
        <!-- 隐藏域 -->
        <input
          @change="changeAvatar"
          type="file"
          ref="album"
          style="display:none;"
        />
        <div class="camera">拍照</div>
        <div>取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入图片预览插件
import { ImagePreview } from 'vant'
// 导入操作用户的网络请求
import { apiUploadPhoto } from '@/api/user.js'
export default {
  data() {
    return {
      show: false
    }
  },
  methods: {
    // 打开文件 从文件中选择头像
    openFile () {
      // 触发 input:file 的点击事件
      this.$refs.album.click()
    },
    // 触发input 的change的事件
    changeAvatar (e) {
      // console.log('被触发了')
      // console.log(e)
      // 关闭选择框
      this.show = false
      // 得到选择的头像文件
      // 1.通过事件对象获取
      // const avatarFile = e.target.files[0]
      // 2.通过input（dom元素）获取
      // files 由dom元素调用
      const avatarFile = this.$refs.album.files[0]
      // 生成头像url
      // 1.使用 URL.createObjectURL
      // const avatarUrl = URL.createObjectURL(avatarFile)
      // // 使用预览插件 展示头像
      // ImagePreview([avatarUrl])
      // 2.使用 FileReader 对象
      // 2.1 创建一个fileReader对象实例
      var reader = new FileReader()
      // 生成头像url
      reader.readAsDataURL(avatarFile)
      // 执行转换后的逻辑代码
      reader.addEventListener('load', () => {
        // reader.result 为转换后的结果
        const avatarUrl = reader.result
        ImagePreview({
          images: [avatarUrl],
          // 关闭时的回调函数
          onClose: this.uploadAvatar
        })
      })
    },
    // 上传头像
    uploadAvatar () {
      this.$dialog.confirm({
        title: '提示',
        message: '您确定要更新头像吗？'
      }).then(async () => {
        // on confirm
        // 获取到头像文件
        const avatarFile = this.$refs.album.files[0]
        // 发送网络请求上传用户头像
        const res = await apiUploadPhoto(avatarFile)
        // console.log(res)
        // 更新父组件中的用户头像
        this.$parent.info.photo = res.data.data.photo
        // 成功提示
        this.$toast.success('更新头像成功')
      }).catch(() => {
        // on cancel
        this.$toast.fail('已放弃更改')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filePick {
  .filePop {
    width: 80%;
    border-radius: 5px;
    .picker {
      text-align: center;
      font-size: 15px;
      color: #969799;
      .camera {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
      }
      div {
        height: 45px;
        line-height: 45px;
      }
    }
  }
}
</style>
