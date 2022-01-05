<template>
	<view>
		<view class="totalClient-topBackImg flex-items flex-column">
      <view class="topBg">
        <view class="font-color-8A734A mar-top-30 fs60">{{SubordinateSalesData.total}}</view>
        <view class="font-color-C5AA7B">累计分销员(人）</view>
      </view>
		</view>
    <view class="content directAwardInfo" v-if="SubordinateSalesData.total>0">
      <view class="directAwardTit fs32 font-color-333">我的客户信息</view>
      <view class="flex-center clientList-box mar-top-30" v-for="(item, index) in SubordinateSalesDatalist"
            :key="index">
        <view class="directAward-box font-color-656 fs26" @click="arrowTypeChange(index)">
          <view class="directAward-icon flex-row-plus flex-items flex-sp-between">
            <view>
              <label class="orderId-box name font-color-333 fs28">分销员昵称：{{item.distributorName}}</label>
              <view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
                <label class="orderId-box font-color-999">手机号：{{item.distributorPhone}}</label>
              </view>
            </view>
            <image v-if="item.ifOpen == false" class="arrow-down" src="https://ceres.zkthink.com/static/images/arrowDownIcon.png"></image>
            <image v-if="item.ifOpen == true" class="arrow-down" src="https://ceres.zkthink.com/static/images/arrowUpIcon.png"></image>
          </view>
          <view v-if="item.ifOpen == true">
            <view class="flex-row-plus flex-itdistributionOrderems mar-top-30 flex-sp-between">
              <label class="orderId-box font-color-999">累计下单数：{{item.orders}}</label>
              <label class="commission-box mar-left-70 font-color-999">累计分佣：¥{{item.price}}</label>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="emptyCart-box flex-items-plus flex-column">
      <image class="emptyCart-img" src="https://ceres.zkthink.com/static/img/bgnull.png"></image>
      <label class="font-color-999 fs26 mar-top-30 font-color-999">这里空空如也~</label>
    </view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				item: {},
				SubordinateSalesQuery: {
					model: {
						tenantCode: '',
					}
				},
				SubordinateSalesData: [],
				shopId: 0,
				distributorId: 0,
				page: 1, //当前页
				pageSize: 10, //每页记录数
				loadingType: 0,
				SubordinateSalesDatalist: []
			}
		},
		onLoad: function(options) {
			this.shopId = options.shopId
			this.distributorId = options.distributorId
			this.getSubordinateSales()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.pageSize = this.pageSize + 10
				this.getSubordinateSales()
			}
		},
		methods: {
			getSubordinateSales() {
				uni.showLoading({
          mask: true,
					title: '加载中...'
				})
				NET.request(API.FindSubordinateSalesList, {
					shopId: this.shopId,
					distributorId: this.distributorId,
					page: this.page,
					pageSize: this.pageSize,
				}, 'GET').then(res => {
					uni.hideLoading()
					if (res.data.list.length == 0) {
						this.loadingType = 1
					}
					this.SubordinateSalesDatalist = res.data.list
					this.SubordinateSalesData = res.data
				}).catch(res => {
					uni.hideLoading()
				})
			},
			arrowTypeChange(arrowTypeId) {
				this.SubordinateSalesData.list[arrowTypeId].ifOpen = this.SubordinateSalesData.list[arrowTypeId].ifOpen == false ? true : false
			}
		}
	}
</script>

<style lang="scss">
page {
  background: #333333;
}
	.emptyCart-box {
		margin-top: 300upx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.totalClient-topBackImg {
		width: 100%;
    padding: 0 20rpx;
    .topBg {
      width: 100%;
      height: 196upx;
      background: url("https://ceres.zkthink.com/static/images/totalPersonnelTopBackImg.png") no-repeat;
      margin-top: 50rpx;
      text-align: center;
    }
		.content {
			width: 690upx;
			background-color: #FFFFFF;
			.totalClient-left {
				width: 170upx;
				height: 20upx;
			}

			.massage-text {
				padding: 0 20upx;
			}
		}
	}

	.top {
		height: 50upx;
		background-image: linear-gradient(#FF8E14, #FFFFFF);
	}
.directAwardInfo {
  width: 100%;
  height: 100vh;
  background: #F8F8F8;
  padding: 0 20rpx;
  .directAwardTit {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    color: #333333;
    text-align: center;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #EEEEEE;
    font-weight: bold;
  }
}
	.uni-collapse-cell[data-v-8f47561c] {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		flex-direction: column;
		border-color: #c8c7cc;
		border-bottom-width: 1px;
		border-bottom-style: none;
	}

	.directAward-box {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		background-color: #FFFFFF;
		padding: 50upx 20upx;
		.orderId-box {
			width: 320upx;
			display: flex;
			justify-content: flex-start;
			flex-direction: row;
		}
    label.name {
      font-weight: bold;
    }
		.commission-box {
      text-align: right;
		}

		.arrow-down {
			width: 24upx;
			height: 24upx;
		}

		.upBox {
			border-top: 1upx solid #EDEDED;
			margin-top: 30upx;
		}
	}
</style>
