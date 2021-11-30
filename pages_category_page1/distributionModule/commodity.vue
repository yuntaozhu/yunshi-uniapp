<template>
	<view class="container">
		<view>
			<view v-for="(item, index) in Productlist" :key="index" class="goodsDetails-box flex-display flex-column mar-left-30"
				  @click="goodsDatails(item)">
				<view class="goodsDetails flex-items-plus flex-row mar-top-30">
					<image class="goodsImg" :src="item.image"></image>
					<view class="mar-left-30">
						<view class="goodsName-box overflowNoDot">
							<label class="goodsName fs26 mar-left-20">{{item.productName}}</label>
						</view>
						<view class="priceBuyNum-box mar-top-20">
							<label class="fs24 font-color-C5AA7B">¥</label>
							<label class="fs36 font-color-C5AA7B mar-left-10">{{item.price}}</label>
							<label class="fs24 font-color-999 mar-left-20" v-if="item.users != null">{{item.users}}人付款</label>
							<label class="fs24 font-color-999 mar-left-20" v-else>0人付款</label>
						</view>
						<view class="fenxiang" @click.stop="fenxiang(item)">
							分享
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		data() {
			return {
				Productlist: [],
				item:{},
				fenxiangitem: {},
				show: false,
				erweima: '',
				tuimgs:'',
				size: 160, // 二维码大小
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				shopId:0,
				headimg:'',
				username:'',
				distributorId:0,
				page: 1,
				pageSize: 20,
				loadingType:0
			}
		},
		onLoad(options) {
			this.shopId = options.shopId
			this.distributorId = options.distributorId
			this.headimg = options.headimg
			this.username = options.username
			this.getStoreProductList()
		},
		onReachBottom() {
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getStoreProductList()
			}
		},
		methods: {
			getStoreProductList() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.StoreProductList, {
					shopId: this.shopId,
					page:this.page,
					pageSize:this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.Productlist = this.Productlist.concat(res.data.list)
				}).catch(res => {
					uni.hideLoading()
				})
			},
			goodsDatails(item) {
				uni.navigateTo({
					url: '../goodsModule/goodsDetails?productId='+item.productId+'&shopId='+this.shopId+'&skuId='+item.skuId
				})
			},
			fenxiang(item) {
				// #ifdef H5
				var system = 3
				// #endif

				// #ifdef MP-WEIXIN
				var system = 2
				// #endif

				// #ifdef MP-ALIPAY
				var system = 4
				// #endif

				uni.showLoading({
				  title: '请稍候...'
				})
				NET.request(API.getSharePic, {
				  productId: item.productId,
				  shopId: item.shopId,
				  skuId: item.skuId,
				  terminal: system
				}, 'GET').then(res => {
				  uni.hideLoading()
				  // 推广商品
				  uni.navigateTo({
					url: `../../pages_category_page1/distributionModule/shareProduct?shareType=2&shareImg=${res.data}&productId=${item.productId}&skuId=${item.skuId}&shopId=${item.shopId}&salesId=${this.distributorId}`
				  });
				}).catch(res => {
				  uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	input {
		padding-left: 80upx;
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

	}

	.qrimg-i {
		margin-right: 10px;
	}

	.rect {
		width: 89%;
		height: 80%;
		background-color: #fff;
		position: relative;
		.guanbi {
			width: 46rpx;
			height: 46rpx;
			position: absolute;
			top: -100rpx;
			left: 50%;
			margin-left: -23rpx;
		}

		.user {
			display: flex;
			padding: 20upx;

		}


	}

	.fenx {
		position: fixed;
		bottom: 0rpx;
		z-index: 10001;
		background-color: #F7F7F7;
		width: 100%;
		height: 98rpx;
		display: flex;
		color: #343434;

		view {
			line-height: 98rpx;
		}

		image {
			width: 50rpx;
			height: 50rpx;
			display: inline-block;
			margin-top: 25rpx;
		}
	}

	.fenxiang {
		height: 50upx;
		line-height: 50upx;
		width: 120upx;
		color: #FFEBC4;
		text-align: center;
		position: absolute;
		background-color: #333333;
		right: 10upx;
	}

	.container {
		.emptyCart-box {
			margin-top: 70upx;
      .emptyCart-img{
        width: 216rpx;
        height: 156rpx;
      }
		}

		.searchImg {
			width: 36upx;
			height: 36upx;
			position: absolute;
			left: 60upx;
		}

		.search-box {
			background-color: #F7F7F7;
			border-radius: 33upx;
			width: 530upx;
			height: 66upx;
		}

		.searchboxPlace {
			font-size: 26upx;
			color: #A9A9A9;
			padding-right: 30upx;
		}

		.searchClose-icon {
			width: 30upx;
			height: 30upx;
			margin-left: -50upx;
		}

		.promotion618 {
			width: 130upx;
			height: 30upx;
		}

		.goodsDetails-box {
			width: 690upx;

			.goodsDetails {
				position: relative;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 30upx;

				.goodsName-box {
					width: 389upx;
					height: 85upx;

					.img618-cion {
						width: 70upx;
						height: 36upx;
					}
				}

				.goodsImg {
					width: 260upx;
					height: 260upx;
				}

				.discounts-box {
					margin-left: -10upx;
					margin-top: 20upx;

					.discounts-text {
						margin-left: 10upx;
						color: #C5AA7B;
						background-color: #FFE4CC;
						padding: 6upx 12upx;
						border-radius: 4upx;
					}
				}

				.arrowImg {
					width: 20upx;
					height: 20upx;
				}
			}


		}
	}
</style>
