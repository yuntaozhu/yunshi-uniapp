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
    <view class="evaluateIcon flex-items">
      <image src="../../static/images/evaluateIcon.png"></image>
      <text>热门推荐</text>
    </view>
    <view class="recommendList">
      <view class="itemBox" v-for="(item, index) of productList" @click="goodsDateils(item.shopId,item.productId,item.skuId)">
        <view class="itemImg">
          <image :src="item.image"></image>
        </view>
        <view class="itemTit">{{item.productName}}</view>
        <view class="flex-items shopNameBox">
          <view class="shopName">{{item.shopName}}</view>
          <view class="paymentNum">{{item.users}}人付款</view>
        </view>
        <view class="itemPrice">
          <view class="price">￥{{item.price}}</view>
          <view class="originalPrice">￥{{item.originalPrice}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('@/utils/request')
const API = require('@/config/api')
export default {
  name: "evaSuccessful",
  data() {
    return {
      orderId: null,
      orderPolite: {},
      list: [],
      pageSize: 1,
      productList:[]
    }
  },
  onLoad() {
    this.GetremenList()
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
    // 获取列表数据
    GetremenList() {
      let timestamp = new Date().getTime()
      NET.request(API.GetremenList, {
        page: this.pageSize,
        pageSize: 5,
        timestamp: timestamp
      }, 'get').then(res => {
        uni.stopPullDownRefresh();
        console.log(res)
        if (res.code == 200) {
          this.productList = res.data.list
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    //商品详情
    goodsDateils(shopId, productId, skuId) {
      console.log(111)
      uni.navigateTo({
        url: 'goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' +
            skuId
      })
    }
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
  }
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
  .evaluateIcon {
    margin: 50rpx 0;
    justify-content: center;
    image {
      width: 36rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
  }
  .recommendList {
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .itemBox {
      background: #FFFFFF;
      width: 345rpx;
      margin: 0 0 20rpx 0;
      .itemImg {
        width: 345rpx;
        height: 314rpx;
        image {
          width: 100%;
          height: 314rpx;
        }
      }
      .itemTit {
        padding: 0 20rpx;
        height: 40rpx;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
      .shopNameBox {
        padding: 0 20rpx;
        height: 40rpx;
        justify-content: space-between;
        margin-top: 20rpx;
        .shopName {
          color: #FFEBC4;
          font-size: 20rpx;
          width: 140rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
          border-radius: 0 20rpx 20rpx 0;
          background: #333333;
          height: 40rpx;
          padding-left: 10rpx;
        }
        .paymentNum {
          border: 2rpx solid #E4E5E6;
          color: #C5AA7B;
          font-size: 20rpx;
          padding: 5rpx;
        }
      }
      .itemPrice {
        display: flex;
        align-items: center;
        padding: 0 20rpx 10rpx 20rpx;
        margin-top: 20rpx;
        .price {
          font-size: 40rpx;
          color: #C83732;
          margin-right: 10rpx;
        }
        .originalPrice {
          color: #CCCCCC;
          font-size: 24rpx;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>
