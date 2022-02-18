<!-- 优惠券列表 -->
<template>
	<view class="container">
		<view class="list">
			<view
				class="item"
				v-for="(item, index) in list"
				v-if="item.state === 0"
			>
				<view class="info-box">
          <view class="discoun" v-if="item.couponType == 1"><text style="font-size: 28rpx">￥</text>{{item.reduceMoney}}</view>
          <view class="discoun" v-if="item.couponType == 2">{{item.reduceMoney}}折</view>
				  <view class="info-date">{{getDate(item.startTime)}}-{{getDate(item.endTime)}}</view>
          <view class="info-condition" v-if="item.couponType == 1">满{{item.fullMoney}}元减{{item.reduceMoney}}元</view>
          <view class="info-condition" v-if="item.couponType == 2">{{item.reduceMoney}}折优惠</view>
          <view class="use-btn" @click="useTap(item)">立即使用</view>
				</view>
			</view>
      <view v-if="ifEmpty" class="emptyOrder-box flex-items-plus flex-column">
        <image class="emptyOrder-img" src="https://ceres.zkthink.com/static/img/bgnull.png"></image>
        <label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
      </view>
		</view>
		<!-- 触底 -->
    <view class="reachBottom" v-if="topLeft > 400 && list.length > 0">
			<image class="reach-icon" src="https://ceres.zkthink.com/static/img/reachBottom.png" mode="widthFix"></image>
			<text class="reach-text">这里到底了哦~~</text>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				list:[],
				// page:1,
				// pageSize:20,
				total:0,
        availableList: [],
				// loadingType:0,
				topLeft: 0,
        ifEmpty: false
			}
		},
		onShow() {
			this.getFindCouponList()
		},
		onPageScroll(e) {
	    this.topLeft = e.scrollTop
	  },
		methods: {
			getFindCouponList(){
			    uni.showLoading({
            mask: true,
			      title: '加载中...',
			    })
			    NET.request(API.FindCouponList,"GET").then(res => {
			      uni.hideLoading()
				    this.list = res.data
            if (this.list.length === 0) {
              this.ifEmpty = true
            }
            this.list.forEach((item => {
              if (item.state === 0) {
                this.availableList.push(item)
              }
            }))
			    }).catch(res => {
			      uni.hideLoading()
			    })
			},
			getDate(time) {
			    if (!time) return '';
			    return time.split(' ')[0].split('-').join('.');
			},
			useTap(item){
        uni.navigateTo({
          url: `../../pages_category_page1/goodsModule/couponShopList?activityId=${item.activityId}&shopCouponId=${item.shopCouponId}`
        })
			}
		}
	}
</script>

<style lang="scss" scoped>
.emptyOrder-box{
	margin: 70upx auto 0 auto;
	.emptyOrder-img{
		margin-top: 45%;
		width: 113upx;
		height: 98upx;
	}
}
.list {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 50%;
  height: 291rpx;
  background: url("https://ceres.zkthink.com/static/images/couponsIcon.png") no-repeat center top;
  border-radius: 10rpx;
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  position: relative;
  background-size: contain;
  padding: 0 56rpx;
  margin-bottom: 30rpx;
}

.discoun {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  font-size: 40rpx;
  color: #C5AA7B;
  margin: 0 auto;
  padding-top: 50rpx;
}

.discoun text {
  display: inline-block;
}

.info-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-condition {
  font-size: 20rpx;
  font-weight: 400;
  color: #999999;
  margin: 0 auto;
}

.info-date {
  font-size: 20rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
  margin: 0 auto;
}

.use-btn {
  height: 48rpx;
  border: 2rpx solid #C5AA7B;
  line-height: 48rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 500;
  background-color: #C5AA7B;
  color: #FFFFFF;
  margin: 50rpx auto 0 auto;
  padding: 0 5rpx;
}

// 触底样式
.reachBottom{
	margin-top: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.reach-icon{
		width: 150rpx;
		height: 150rpx;
	}
	.reach-text{
		margin: 20rpx 0;
		color: #CCCCCC;
	}
}
</style>
