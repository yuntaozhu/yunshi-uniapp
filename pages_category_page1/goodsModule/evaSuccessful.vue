<template>
  <view class="payCourteous">
    <view class="evaBox">
      <view class="imgBox">
        <image src="../../static/images/payIcon.png"></image>
      </view>
      <view class="successful">评价成功</view>
      <view class="btnBox fs28 font-color-333">
        <view class="orderBtn btn" @click="goToOrder">查看订单</view>
        <view class="homeBtn btn" @click="goToHome">返回首页</view>
      </view>
    </view>

    <HotTemplate />
  </view>
</template>

<script>
import HotTemplate from '@/components/hoteRecommed/index.vue'

const NET = require('@/utils/request')
const API = require('@/config/api')
export default {
  name: "evaSuccessful",
  components: {
    HotTemplate
  },
  data() {
    return {
      orderId: null,
      orderPolite: {},
      list: [],
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
  }
}
</script>

<style lang="scss" scoped>
page {
  background: #F8F8F8;
}
.payCourteous {
  border-top: 2rpx solid #F3F4F5;
  .evaBox {
    padding: 30rpx 30rpx 50rpx 30rpx;
    background: #FFFFFF;
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
  }
}
</style>
