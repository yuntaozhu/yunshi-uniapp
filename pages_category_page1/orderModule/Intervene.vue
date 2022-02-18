<template>
  <view class="container">
    <!-- 平台介入 -->
    <view class="addEvaluate-box flex-items-plus flex-column-plus">
      <view class="addEvaluate flex-column-plus">
        <view class="fs26 mar-top-40 mar-left-20 addEvaluateText"><label>*</label>问题描述</view>
        <view class="textarea-box mar-top-20 mar-left-20">
          <textarea class="textarea-text" v-model="commentText" placeholder-style="color:#BBBBBB" placeholder="填写相关问题"/>
        </view>
        <view class="fs26 mar-top-40 mar-left-20 addEvaluateText"><label>*</label>举证照片</view>
        <view class="mar-left-10 mar-top-10 evaluateImg">
          <u-upload upload-text="上传凭证" :action="action" ref="uUpload" :limitType="['png', 'jpg', 'jpeg', 'webp', 'gif', 'image']" :header="headerToken" :form-data="formData"></u-upload>
        </view>
      </view>
    </view>
    <view class="butBox flex-items-plus mar-left-30">
      <view class="submitbut" @click="submitTap">提交</view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  data() {
    return {
      addCommentVOList:{},
      orderProductVO:{},
      commentText:'',
      fileList:[],
      commentImgsFlag:false,
      commentImgs:'',
      action:API.UploadUrl,
      formData:{'folderId': -1},
      headerToken:{Authorization:''},
      productImage:'',
      afterId: 0,
      orderId: 0
    }
  },
  onLoad(options) {
    this.afterId = options.afterId;
    this.orderId = options.orderId;
  },
  onReady() {
    this.fileList = this.$refs.uUpload.lists
  },
  methods: {
    submitTap(){
      if (!this.commentText) {
        uni.showToast({
          title: '请先说点什么吧',
          icon: 'none'
        })
        return false
      }
      if(this.fileList.length>0){
        this.commentImgsFlag = true
        for(let i=0;i<this.fileList.length;i++){
          this.commentImgs += this.fileList[i].response.data.url+','
        }
      } else {
        uni.showToast({
          title:'请上传举证图片',
        })
        return false
      }
      uni.showLoading({
        title:'正在申请介入...'
      })
      NET.request(API.platform, {
        afterId: this.afterId,
        orderId: this.orderId,
        image: this.commentImgs,
        reason: this.commentText
      }, 'POST').then(res => {
        uni.hideLoading()
        this.intervention = false
        uni.showToast({
          title:'申请成功',
        })
        setTimeout(() => {
          uni.navigateTo({
            url:`../../pages_category_page2/orderModule/afterSale`
          })
        }, 2000)
      }).catch(res => {
        uni.hideLoading()
      })
    }
  }
}
</script>

<style lang="scss">
page{
  background-color: #F7F7F7;
}
.container{
  .addEvaluate-box{
    margin-top: 20upx;
    .addEvaluate{
      width: 690upx;
      background-color: #FFFFFF;
      border-radius: 10upx;
      padding-bottom: 30upx;
      .addEvaluateText {
        font-weight: 400;
        label {
          color: #C5AA7B;
          margin-right: 10rpx;
        }
      }
    }
    .textarea-box{
      .textarea-text{
        width: 610upx;
        height: 200upx;
        background-color: #FFFFFF;
        font-size: 26upx;
        padding: 20upx 20upx;
        border: 2rpx solid #E4E5E6;
      }
    }
    .addPicture-box{
      background-color: #F5F5F5;
      width: 40upx;
      height: 40upx;
      margin-top: 100upx;
      margin-left: 100upx;
      border-radius: 10upx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #BBBBBB;
    }
  }
  .butBox{
    position: absolute;
    bottom: 40upx;
    .submitbut{
      height: 100upx;
      width: 690upx;
      background: #333333;
      color: #FFEBC4;
      font-size: 28upx;
      text-align: center;
      line-height: 100upx;
    }
  }
}
</style>
<style scoped>
.evaluateImg /deep/ .u-upload .u-list-item {
  background: none;
  border: 2rpx solid #E4E5E6;
  border-radius: 0;
}
.evaluateImg /deep/ .u-upload .u-list-item .uicon-plus:before {
  content: '';
  height: 71rpx;
  width: 71rpx;
  background: url("https://ceres.zkthink.com/static/images/addImg.png") no-repeat center center;
  display: block;
  background-size: contain;
}
.evaluateImg /deep/ .u-add-tips {
  color: #999999 !important;
}
</style>
