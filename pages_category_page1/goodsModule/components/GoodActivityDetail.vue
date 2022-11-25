<!--
    * @FileDescription: 商品信息（包括活动信息、优惠券）
    * @Author: kahu
    * @Date: 2022/11/7
    * @LastEditors: kahu
    * @LastEditTime: 2022/11/7
-->
<template>
  <view>
    <!-- 商品详情 -->
    <swiper
        class="goodsImgswiper-box "
        :indicator-dots="true"
        :autoplay="true"
    >
      <swiper-item
          v-for="(imgItem, index) in productInfo.images"
          :key="index"
      >
        <image
            class="goodsImg default-img u-skeleton-fillet"
            :src="imgItem"
        ></image>
      </swiper-item>
    </swiper>
    <!-- 分享 -->
    <view
        class="share-box flex-items-plus"
        @click="shareMenuShow"
    >
      <image
          class="share-img"
          src="https://ceres.zkthink.com/static/images/shareBut.png"
      ></image>
      <label class="fs24 mar-left-5">分享</label>
    </view>
    <view class="goodgDes-box flex-start flex-column">
      <view
          v-if="skuSelect.activityType === 0"
          class="priceBuyNum-box flex-display u-skeleton-fillet flex-sp-between mar-left-30"
      >
        <view>
          <label class="fs36 font-color-C83732">¥</label>
          <label class="fs36 fs-bold font-color-C83732 mar-left-10">{{ skuSelect.price || 0 }}</label>
          <label class="fs24 font-color-999 discountsPriceLine mar-left-20">¥
            {{ skuSelect.originalPrice || 0 }}</label>
        </view>
        <label class="fs24 font-color-999">{{ productInfo.users || 0 }}人付款</label>
      </view>
      <view
          v-else-if="skuSelect.activityType === 8"
          class="sceneMarketingBox"
      >
        <view class="flex-row-plus flex-items-plus mar-left-30 mar-top-10">
          <label class="fs30 font-color-FFF">¥</label>
          <label class="fs42 mar-left-5 font-color-FFF">{{ skuSelect.price || 0 }}</label>
          <label class="fs28 mar-left-10 discountsPriceLine font-color-CCC">¥
            {{ skuSelect.originalPrice || 0 }}</label>
        </view>
        <view class="sceneNameBox">{{ productInfo.sceneName }}</view>
      </view>
      <view
          v-else
          class="seckill-box"
      >
        <view
            class="flex-items flex-sp-between"
            v-if="skuSelect.activityType === 9 "
        >
          <view class="vipImg flex-items">
            <image
                class="vip-icon"
                src="https://ceres.zkthink.com/static/images/vipDetail.png"
                mode=""
            >
            </image>
          </view>
          <view class="flex-row-plus flex-items-plus mar-left-30 mar-top-10">
            <label class="fs30 font-color-FFF">¥</label>
            <label class="fs42 mar-left-5 font-color-FFF">{{ skuSelect.price || 0 }}</label>
            <label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥
              {{ skuSelect.originalPrice || 0 }}
            </label>
          </view>
        </view>
        <view
            v-else
            class="flex-items flex-row flex-sp-between"
        >
          <view class="flex-column-plus">
            <image
                v-if="[2,4].includes(skuSelect.activityType)"
                class="seckill-icon"
                src="https://ceres.zkthink.com/static/images/seckillicon.png"
                mode=""
            ></image>
            <image
                v-if="[3,5].includes(skuSelect.activityType)"
                class="discount-icon"
                src="https://ceres.zkthink.com/static/images/discounticon.png"
                mode=""
            ></image>
            <image
                v-if="skuSelect.activityType === 1"
                class="spell-icon"
                src="https://ceres.zkthink.com/static/images/spellicon.png"
                mode=""
            ></image>
            <view class="flex-row-plus flex-items mar-top-10">
              <label class="fs30 font-color-FFF">¥</label>
              <label class="fs42 mar-left-5 font-color-FFF">{{ skuSelect.price || 0 }}</label>
              <label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥
                {{ skuSelect.originalPrice || 0 }}
              </label>
            </view>
          </view>
          <view
              v-if="[1,2,3,4,5].includes(skuSelect.activityType)"
              class="countdown flex-column-plus"
          >
            <view v-if="timeActiveType">
              <label class="fs28">距离结束剩余</label>
              <view class="flex-row-plus fs34 flex-items-plus mar-top-10">
                <view class="countdown-box flex-items-plus">{{ activeTimeObj.day }}</view>
                <view class="font-color-999">天</view>
                <view class="countdown-box flex-items-plus">{{ activeTimeObj.hour }}</view>
                <view class="font-color-999">:</view>
                <view class="countdown-box flex-items-plus">{{ activeTimeObj.min }}</view>
                <view class="font-color-999">:</view>
                <view class="countdown-box flex-items-plus">{{ activeTimeObj.sec }}</view>
              </view>
            </view>
            <view v-else>
              <label class="fs28 mar-right-20">即将开始：{{ skuSelect.startTime }}</label>
              <!--              <view class="fs28 mar-right-20 mar-top-20">{{productInfo.startTime}}</view>-->
            </view>
          </view>
        </view>
      </view>
      <view class="nameContainer">
        <view class="goodsName-box overflowNoDot mar-top-30 mar-left-30 u-skeleton-fillet">
          <label class="goodsName fs32 mar-left-20 ">{{ productInfo.productName }}</label>
        </view>
        <view
            class="collectBox "
            @click="handleCollect"
        >
          <image
              v-if="productInfo.ifCollect === 1"
              class="store-icon  "
              src="https://ceres.zkthink.com/static/images/shoucangActive1.png"
          ></image>
          <image
              v-else
              class="store-icon"
              src="https://ceres.zkthink.com/static/images/shoucang2x.png"
          >
          </image>
          <label class="fs22">收藏</label>
        </view>
      </view>
      <view
          v-if="markTools.length>0 || shopMarkTools.length>0"
          class="activity-box mar-top-10"
          @click="couponShowClick"
      >
        <label class="fs24 font-color-999">优惠</label>
        <view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
          <view
              class="fs20 overflow"
              style="width: 500rpx;"
          >
            {{ productInfo.couponSplicing }}
          </view>
          <view class="flex-items">
            <label class="fs24 font-color-C5AA7B">领券</label>
            <image
                class="coupon-arrow"
                src="https://ceres.zkthink.com/static/img/user/arrow.png"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <!--  分享弹出  -->
    <u-action-sheet
        :list="shareObj.actionList"
        v-model="shareObj.actionShow"
        @click="handleShareSelect"
    ></u-action-sheet>

    <shareSpell
        ref="shareSpell"
        @shareCancel="shareCancel"
        :url="shareObj.url"
        :img="shareObj.image"
        :title="shareObj.title"
    >
    </shareSpell>
  </view>
</template>


<script>
import { TimeFormatting } from "../../../utils/timeUtil";
import NET from "../../../utils/request";
import API from "../../../config/api";
import shareSpell from '../../../component/share.vue'

export default {
  name: "GoodActivityDetail",
  components: {shareSpell},
  data() {
    return {
      // 活动倒计时
      timeDifference: 0,
      activeTimeObj: {
        day: '00',
        hour: '00',
        min: '00',
        sec: '00'
      },
      countdownInterval: null,
      // 分享
      shareObj: {
        url: '',
        image: '',
        title: '好友分享了一个很棒的商品',
        actionList: [
          {text: '生成分享海报'},
          {text: '邀请好友'}
        ],
        actionShow: false
      },
    }
  },
  props: {
    // 商品信息
    productInfo: {
      type: Object,
      default: () => ({})
    },
    // 当前选中的sku
    skuSelect: {
      type: Object,
      default: () => ({})
    },
    timeActiveType: {
      type: Boolean,
      default: () => false
    },
    markTools: {
      type: Array,
      default: () => ([])
    },
    shopMarkTools: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    /**
     * 初始化活动倒计时
     * @param endTimestamp
     */
    handleGetCountDownNumber(endTimestamp) {
      endTimestamp = endTimestamp.substring(0, 19).replace(/-/g, '/');
      // 与当前时间的时间差（秒）
      const timeDifference = (new Date(endTimestamp).getTime() - new Date().getTime()) / 1000;
      this.timeDifference = timeDifference
      this.activeTimeObj = TimeFormatting(timeDifference)
      this.handleCountDown()
    },

    /**
     * 开始倒计时
     */
    handleCountDown() {
      if (this.countdownInterval) {
        return
      }
      this.countdownInterval = setInterval(() => {
        if (this.timeDifference <= 0) {
          clearInterval(this.countdownInterval)
          uni.showToast({
            title: "活动结束",
            duration: 2000,
            icon: 'none'
          })
          this.$emit('activityEnd', 0)
        } else {
          this.timeDifference--
          this.activeTimeObj = TimeFormatting(this.timeDifference)
        }
      }, 1000)
    },

    /**
     * 拉起父组件优惠券
     */
    couponShowClick() {
      this.$emit('couponClick')
    },


    /**
     * 收藏
     */
    handleCollect() {
      if (this.productInfo.ifCollect === 0) {
        NET.request(API.collect, {
          productId: parseInt(this.productInfo.productId)
        }, 'POST').then(res => {
          this.productInfo.ifCollect = 1
          uni.showToast({
            title: '收藏成功',
            icon: "success"
          })
        })
      } else {
        NET.request(API.cancelCollect, {
          ids: [this.productInfo.productId]
        }, 'PUT').then(res => {
          this.productInfo.ifCollect = 0
          uni.showToast({
            title: '取消收藏成功',
            icon: "success"
          })
        })
      }
    },

    /**
     * 海报分享
     */
    sharePoster() {
      let system = undefined
      // #ifdef APP-PLUS
      system = 1
      // #endif

      // #ifdef H5
      system = 3
      // #endif

      // #ifdef MP-WEIXIN
      system = 2
      // #endif

      // #ifdef MP-ALIPAY
      system = 4
      // #endif
      uni.showLoading({
        mask: true,
        title: '请稍候...'
      })
      NET.request(API.getSharePic, {
        productId: this.productInfo.productId,
        shopId: this.productInfo.shopId,
        skuId: this.skuSelect.skuId,
        terminal: system
      }, 'GET').then(res => {
        uni.hideLoading()
        // 推广商品
        uni.navigateTo({
          url: `/pages_category_page1/distributionModule/shareProduct?shareType=2&productImage=${ this.productInfo.images[0] }&shopId=${ this.productInfo.shopId }&productId=${ this.productInfo.productId }&skuId=${ this.skuSelect.skuId }&productName=${ this.productInfo.productName }&price=${ this.productInfo.price }&headImage=${ res.data.headImage }&shareName=${ res.data.name }&shareImg=${ res.data }`
        });
      }).catch(res => {
        uni.hideLoading()
      })
    },
    shareMenuShow() {
      this.shareObj.actionShow = true
    },
    shareCancel() {
      this.$refs.shareSpell.shareShow = false
    },
    handleShareSelect(index) {
      if (index === 0) {
        this.sharePoster()
      } else {
        this.shareObj.url = '/pages_category_page1/goodsModule/goodsDetails?shopId=' + this.productInfo.shopId + '&productId=' + this.productInfo.productId + '&skuId=' + this.skuSelect.skuId
        this.shareObj.image = this.productInfo.images[0]
        this.shareObj.title = `【cereshop】好友分享了一个好物给您！${ this.productInfo.productName } ￥${ this.productInfo.price } `
        this.$refs.shareSpell.shareShow = true
      }
    },
  }
}
</script>

<style
    lang="scss"
    scoped
>

.goodsImgswiper-box {
  width: 750upx;
  height: 750upx;

  .goodsImg {
    width: 750upx;
    height: 750upx;
  }
}

.share-box {
  width: 200upx;
  height: 60upx;
  background-color: #FFFFFF;
  border-radius: 30upx 0 0 30upx;
  position: absolute;
  top: 30upx;
  right: 0;
  z-index: 99;

  .share-img {
    width: 36upx;
    height: 36upx;
  }
}

.goodgDes-box {
  background-color: #FFFFFF;
  width: 100%;
  padding-bottom: 25upx;

  .priceBuyNum-box {
    width: 677upx;
    margin-top: 30upx;
  }

  .nameContainer {
    display: flex;

    .goodsName-box {
      width: 677upx;
      height: 85upx;

      .img618-cion {
        width: 70upx;
        height: 36upx;
      }
    }

    .collectBox {
      width: 80rpx;
      margin: 0 30rpx 0 15rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .store-icon {
      width: 48upx;
      height: 48upx;
    }
  }

  .discounts-box {
    margin-top: 20upx;

    .discounts-text {
      margin-left: 10upx;
      color: #FF7800;
      background-color: #FFE4CC;
      padding: 6upx 12upx;
      border-radius: 4upx;
    }
  }

  .activity-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    border-top: 1upx solid #EDEDED;

    .activity-content {
      width: 614upx;
      padding-top: 20upx;

      .activity-text {
        color: #FF7700;
        border: 1upx solid #FF7700;
        padding: 6upx 23upx;
      }

      .coupon-arrow {
        width: 16upx;
        height: 24upx;
        margin-left: 15upx;
      }
    }
  }
}

.seckill-box {
  width: 100%;
  background: url("https://ceres.zkthink.com/static/images/storeTop_Img.png") no-repeat left top;
  padding: 35rpx 30rpx;

  .seckill-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .vip-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .discount-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .spell-icon {
    width: 182rpx;
    height: 37rpx;
    background-size: contain;
    margin-bottom: 20rpx;
  }

  .countdown {
    text-align: center;

    label {
      text-align: center;
      color: #CCCCCC;
    }
  }

  .countdown-box {
    padding: 0 8rpx;
    height: 48rpx;
    color: #FFEBC4;
    background-color: #525252;
    margin: 10rpx;
  }
}

</style>
