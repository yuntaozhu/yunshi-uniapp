<template>
  <div>
    <u-popup v-model="shareShow" :round="10" mode="bottom" @close="cancel(1)">
      <view class="share">
        <!-- <u-mask :show="true" class="flex-items-plus flex-row"> -->
        <text class="h3">邀请好友</text>
        <view class="share-list">
          <view class="ul">
            <!-- #ifdef APP-PLUS -->
            <view class="li" @click="share('weixin')">
              <image class="icon" src="../static/images/share/weixin2x.png"></image>
              <label class="label">微信</label>
            </view>
            <view class="li" @click="share('weixinpyq')">
              <image class="icon" src="../static/images/share/pyq.png"></image>
              <label class="label">朋友圈</label>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <view class="li">
              <button open-type="share" @share='onShareAppMessage' :data-obj="wxShareData" class="share-button">
                <image class="icon" src="../static/images/share/forward.png"></image>
                <label class="label">好友</label>
              </button>
            </view>
            <view class="li" @click="share('weixinpyq')">
              <image class="icon" src="../static/images/share/pyq.png"></image>
              <label class="label">朋友圈</label>
            </view>
            <!-- #endif -->
            <view class="li" @click="share('lianjie')">
              <image class="icon" src="../static/images/share/lianjie.png"></image>
              <label class="label">链接</label>
            </view>
          </view>
        </view>
        <view class="btn-close" @click="cancel(1)">取消</view>
      </view>
    </u-popup>
    <u-popup v-model="wapShow" :round="10" mode="bottom" :border-radius="10" @close="cancel(2)">
      <view class="share-h5">
        <view class="text">
          点击浏览器下方
          <view class="icon">
            <u-icon name="list" color="#fff" size="28"></u-icon>
          </view>
          即可进行分享
        </view>
      </view>
    </u-popup>
  </div>
</template>

<script>
import ClipboardJS from "clipboard"
import UImage from "../uview-ui/components/u-image/u-image";

const API = require('../config/api')
export default {
  components: {UImage},
  props: {
    img: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      dafault: ''
    },
    title: {
      type: String,
      dafault: ''
    },
    urlParms: {
      type: String,
      default: ''
    },
  },
  onShareAppMessage(e) {
    if(e.from=='button'){
      // 点击button
    }
    if(e.from=='menu'){
      // 点击右上角按钮
    }
    // 获取按钮传进来的参数 data 中的item值
    let params = e.target.dataset.obj// 获取的为 data 中定义的item值
    return {
      path: `/pages_category_page1/goodsModule/inviteSpell?${params.url}`
    }
  },
  name: "share",
  data() {
    return {
      shareShow: false,
      wapShow: false,
      wxShareData: {
        url: ''
      }
      // longUrl: ''
    };
  },
  mounted() {
    // this.longUrl = API.shareLink + '/#' + this.url
    // console.log(this.longUrl, this.url
    this.wxShareData = this.url
  },
  computed:{
    longUrl(){
      return API.shareLink + '/#' + this.url
    }
  },
  methods: {
    cancel(key) {
      if (key === 1) {
        this.shareShow = false
        this.$emit('shareCancel')
      } else if (key === 2) {
        this.wapShow = false
      }

    },
    wxShare(type) {
      // #ifdef APP-PLUS
      uni.share({
        provider: "weixin",
        type: 0,
        title: this.title,
        scene: type,//WXSceneSession会话 WXSceneTimeline朋友圈
        imageUrl: this.img,
        href: this.longUrl,
        success: () => {
        },
        fail: (err) => {
          console.log("err",err)
        }
      })
      // #endif
      // #ifdef MP-WEIXIN
      uni.showToast({
        title:"请点击右上角打开菜单进行朋友圈分享",
        icon:"none"
      })
      // #endif
    },
    share(key) {
      switch (key) {
        case 'weixin':
          this.wxShare("WXSceneSession")
          break
        case 'weixinpyq':

          this.wxShare("WXSceneTimeline")
          break
        case 'qq':

          break
        case 'weibo':

          break
        case 'lianjie':
          uni.setClipboardData({
            data: this.title + this.longUrl,
            success: () => {
              uni.showToast({
                title: '复制成功'
              })
            }
          })
          break
      }

    },
    //重写分享方法
    overShare: function () {
      //监听路由切换
      //间接实现全局设置分享内容
      wx.onAppRoute(function (res) {
        //获取加载的页面
        let pages = getCurrentPages(),
            //获取当前页面的对象
            view = pages[pages.length - 1],
            data;
        if (view) {
          data = view.data;
          console.log('是否重写分享方法', data.isOverShare);
          if (!data.isOverShare) {
            data.isOverShare = true;
            view.onShareAppMessage = function () {
              //你的分享配置
              return {
                title: '标题',
                path: '/pages/nearby/index'
              };
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.share{
  background-color: #F8F8F8;
  text-align: center;
  .h3{
    font-size: 30rpx;
    color: #333333;
    line-height: 42rpx;
    padding: 30rpx 0;
    border-bottom: 2px solid #F0F0F0;
    display: block;
  }
  .share-list{
    padding: 40rpx 0 54rpx;
    .ul{
      display: flex;
      justify-content: space-around;
      .li{
        &::after {
          border: none;
        }
        .icon{
          display: block;
          width: 92rpx;
          height: 92rpx;
        }
        .label{
          padding-top: 22rpx;
          font-size: 24rpx;
          line-height: 34rpx;
          color: #333333;
          display: block;
        }
      }
    }
  }
  .btn-close{
    background-color: #fff;
    padding: 30rpx 0;
    font-size: 26rpx;
    color: #333;
  }
}

.share-h5{
  padding:0 20rpx;
  display: flex;
  justify-content: center;
  .text{
    line-height: 100rpx;
    font-size: 30px;
    .icon{
      background-color: #333;
      border-radius: 50%;
      display: inline-block;
      width: 40rpx;
      height: 40rpx;
      text-align: center;
      line-height: 40rpx;
      margin: 0 10rpx;
    }
  }
}
.share-button::after {
  border: none;
}
</style>
