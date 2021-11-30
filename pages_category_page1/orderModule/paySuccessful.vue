<template>
  <view class="payCourteous">
    <view class="imgBox">
      <image src="../../static/images/payIcon.png"></image>
    </view>
    <view class="successful">支付成功</view>
    <view class="btnBox fs28 font-color-333">
      <view class="orderBtn btn" @click="goToOrder">查看订单</view>
      <view class="homeBtn btn" @click="goToHome">返回首页</view>
    </view>
    <view class="orderPolite" v-if="orderPolite.growth || orderPolite.couponList">
      <view class="politeImgBox">
        <image src="../../static/images/politeIcon.png"></image>
      </view>
      <view class="rightInfo">
        <view class="growthBox" v-if="orderPolite.growth">恭喜获得额外会员成长值<text class="growth">{{ orderPolite.growth }}</text></view>
        <view class="couponBox" v-for="(item, index) of orderPolite.couponList" :key="index">恭喜获得<text class="coupon">{{item.discount}}</text>{{ item.couponType === 1 ? '满减优惠券' : '折扣券'}} </view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  name: "payCourteous",
  data() {
    return {
      orderId: null,
      orderPolite: {}
    }
  },
  onLoad(option) {
    this.orderId = option.orderId
    if (this.orderId) {
      this.getOrderPoliteFn()
    }
  },
  methods: {
    goToOrder() {
      uni.navigateTo({
        url: '../orderModule/index?type=0'
      })
    },
    goToHome() {
      uni.switchTab({
        url: '../../pages/tabbar/index/index'
      })
    },
    getOrderPoliteFn() {
      wx.showLoading({
        title: '加载中...',
      })
      NET.request(API.getOrderPolite,{
        orderId: this.orderId
      },'GET').then(res => {
        wx.hideLoading()
        this.orderPolite = res.data
      }).catch(res => {
        wx.hideLoading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.payCourteous {
  border-top: 2rpx solid #F3F4F5;
  padding: 30rpx;
  .imgBox {
    padding-top: 100rpx;
    display: flex;
    justify-content: center;
    image {
      width: 166rpx;
      height: 121rpx;
    }
  }
  .successful {
    text-align: center;
    margin-top: 30rpx;
  }
  .btnBox {
    display: flex;
    justify-content: center;
    margin-top: 30rpx;
    .btn {
      width: 140rpx;
      height: 58rpx;
      line-height: 58rpx;
      border: 2rpx solid #999999;
      text-align: center;
      font-size: 24rpx;
      color: #999999;
    }
    .orderBtn {
      margin-right: 30rpx;
    }
    .homeBtn {
      background: #333333;
      border: none;
      color: #FFEBC4;
    }
  }
  .orderPolite {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 670rpx;
    background: #FFF9F6;
    border: 2rpx solid #FBE9E6;
    margin: 100rpx auto 0 auto;
    padding: 30rpx;
    box-sizing: border-box;
    .politeImgBox {
      image {
        width: 186rpx;
        height: 186rpx;
      }
    }
    .rightInfo {
      font-size: 28rpx;
      color: #333333;
      .growthBox {
        margin-bottom: 30rpx;
        .growth {
          color: #C83732;
        }
      }
      .couponBox {
        margin-bottom: 30rpx;
        .coupon {
          color: #C83732;
        }
        &:last-child {
          margin-bottom: 0 !important;
        }
      }
    }
  }
}
</style>
