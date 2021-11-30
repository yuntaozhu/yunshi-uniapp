<template>
	<view class="content">
		<!-- 我的 -->
		<image class="top-bg" src="../../../static/img/user/topBg.png"></image>
		<view class="page-content">
			<view class="user-info-box" @click="gologin" v-if="JSON.stringify(item) =='{}' ">
				<image class="user-image" src="../../../static/img/user/morentouxiang.png" mode="widthFix"></image>
				<view class="user-info">
					<view class="user-logoin-title">点击登录</view>
					<view class="user-logoin-lable">登录后享受更多权益~</view>
				</view>
				<image class="user-info-right" src="../../../static/img/user/back.png"></image>
				<view class="notice">
					<view class="messNum" v-if="useritem.notRead>0">{{useritem.notRead}}</view>
				</view>
			</view>
			<view class="user-info-box" v-else>
				<image class="user-image" @click="goinfo" v-if="useritem.headImage" :src="useritem.headImage"
					mode="widthFix" style="border-radius: 50%;"></image>
				<image class="user-image" v-else src="../../../static/img/user/morentouxiang.png" mode="widthFix">
				</image>
				<view class="user-info">
					<view class="user-logoin-title" v-if="useritem.name">{{useritem.name}}</view>
					<view class="user-logoin-title" v-else>{{infoitem.phone}}</view>
					<view class="experience flex-items" @click="goToMemberCenter">
						<label>成长值</label>
						<view class="experienceValue">{{useritem.growth}} / {{useritem.nextLevelGrowth}}</view>
					</view>
				</view>
				<view class="notice" @click="toMessage">
					<view class="messNum" v-if="useritem.notRead>0">{{useritem.notRead}}</view>
				</view>
			</view>
			<view class="order-box">
				<view class="order-item" @click="orderTap(1)">
					<image class="order-item-image" src="../../../static/img/user/daifukuan1.png" mode="widthFix">
					</image>
					<view class="order-item-text">待付款</view>
					<view class="quan" v-if="useritem.waitPayOrderCount>0">
						{{useritem.waitPayOrderCount}}
					</view>
				</view>
				<view class="order-item" @click="orderTap(2)">
					<image class="order-item-image" src="../../../static/img/user/daifahuo1.png" mode="widthFix">
					</image>
					<view class="order-item-text">待发货</view>
					<view class="quan" v-if="useritem.waitSendOrderCount>0">
						{{useritem.waitSendOrderCount}}
					</view>

				</view>
				<view class="order-item" @click="orderTap(3)">
					<image class="order-item-image" src="../../../static/img/user/daishouhuo.png" mode="widthFix">
					</image>
					<view class="order-item-text">待收货</view>
					<view class="quan" v-if="useritem.waitReceiveOrderCount>0">
						{{useritem.waitReceiveOrderCount}}
					</view>

				</view>
				<view class="order-item" @click="orderTap(0)">
					<image class="order-item-image" src="../../../static/img/user/dingdan.png" mode="widthFix"></image>
					<view class="order-item-text">全部订单</view>
				</view>
			</view>
			<!--			<view class="item-btn mt20" @click="toMessage">-->
			<!--				<image class="item-btn-icon" src="../../../static/images/mymessageIcon.png" mode="widthFix"></image>-->
			<!--				<view class="item-btn-text flex-row-plus flex-items">-->
			<!--					<label>消息中心</label>-->
			<!--					<view class="messNum" v-if="useritem.notRead>0">{{useritem.notRead}}</view>-->
			<!--				</view>-->
			<!--				<image class="item-btn-right" src="../../../static/img/user/arrow.png" mode="widthFix"></image>-->
			<!--			</view>-->
			<view class="itemBox">
				<view class="item-btn" @click="toCollection">
					<image class="item-btn-icon" src="../../../static/img/user/mycollectionIcon.png" mode="widthFix">
					</image>
					<view class="item-btn-text">我的收藏</view>
				</view>
				<view class="item-btn" @click="toQuestion">
					<image class="item-btn-icon" src="../../../static/img/user/myQuestionIcon.png" mode="widthFix">
					</image>
					<view class="item-btn-text">我的问答</view>
				</view>
				<view class="item-btn" @click="toFootprint">
					<image class="item-btn-icon" src="../../../static/img/user/myfootprintIcon.png" mode="widthFix">
					</image>
					<view class="item-btn-text">浏览足迹</view>
				</view>
				<view class="item-btn" @click="gouserEvaluate">
					<image class="item-btn-icon" src="../../../static/img/user/pingjia.png" mode="widthFix"></image>
					<view class="item-btn-text">我的评价</view>
				</view>
				<view class="item-btn" @click="memberAccountClick">
					<image class="item-btn-icon" src="../../../static/img/user/account.png" mode="widthFix"></image>
					<view class="item-btn-text">我的账户</view>
				</view>
				<view class="item-btn" @click="couponClick">
					<image class="item-btn-icon" src="../../../static/img/user/kaquan.png" mode="widthFix"></image>
					<view class="item-btn-text">我的卡券</view>
				</view>
				<view class="item-btn" @click="godistribution">
					<image class="item-btn-icon" src="../../../static/img/user/fenxiao.png" mode="widthFix"></image>
					<view class="item-btn-text">分销中心</view>
				</view>
				<view class="item-btn" @click="applySettle">
					<image class="item-btn-icon" src="../../../static/img/user/Settled.png" mode="widthFix"></image>
					<view class="item-btn-text">商家入驻</view>
				</view>
			</view>
			<view class="itemBox">
				<view class="item-btn" @click="addressClick">
					<image class="item-btn-icon" src="../../../static/img/user/dizhi1.png" mode="widthFix"></image>
					<view class="item-btn-text">地址管理</view>
				</view>
				<view class="item-btn" @click="goafterSale">
					<image class="item-btn-icon" src="../../../static/img/user/shouhou.png" mode="widthFix"></image>
					<view class="item-btn-text">我的售后</view>
				</view>
				<view class="item-btn" @click="goToMemberCenter">
					<image class="item-btn-icon" src="../../../static/img/user/VIP.png" mode="widthFix"></image>
					<view class="item-btn-text">会员中心</view>
				</view>
				<view class="item-btn" @click="goBankcard">
					<image class="item-btn-icon" src="../../../static/img/user/kaquan.png" mode="widthFix"></image>
					<view class="item-btn-text">银行卡</view>
				</view>
<!--        <view class="item-btn" @click="goWxShop">-->
<!--          <image class="item-btn-icon" src="../../../static/img/user/kaquan.png" mode="widthFix"></image>-->
<!--          <view class="item-btn-text">测试</view>-->
<!--        </view>-->
			</view>
		</view>
		<view class="copyright">
			<text>中科鑫智 版权所有</text>
			<text>粤ICP备19086489号-3</text>
		</view>
	</view>
</template>

<script>
	const NET = require('../../../utils/request')
	const API = require('../../../config/api')
	const SECRET = require('../../../utils/secret')
	export default {
		data() {
			return {
				item: {},
				infoitem: {},
				useritem: {}
			}
		},
		onLoad() {},
		onShow() {
			if (uni.getStorageSync('storage_key')) {
				this.item = uni.getStorageSync('storage_key');
			}
			this.getInfo()
			this.GetUser()
		},
		methods: {
      // goWxShop() {
      //   uni.navigateTo({
      //     url: `plugin-private://wxf0713a10bbae8732/pages/productDetail/productDetail?productId=59656518`,
      //   })
      // },
			toMessage() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/messageCenter'
					})
				}
			},
			toCollection() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/collection'
					})
				}
			},
			toQuestion() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/questionList'
					})
				}
			},
			toFootprint() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/footprintList'
					})
				}
			},
			GetUser() {
				NET.request(API.GetUser, {}, 'GET').then(res => {
					this.useritem = res.data
					uni.setStorageSync('storage_userInfo', this.useritem);
				}).catch(res => {

				})
			},
			// 获取会员信息
			getInfo() {
				NET.request(API.Info, {
					token: this.item.token,
				}, 'GET').then(res => {
					this.infoitem = res.data
				}).catch(res => {

				})
			},
			// 个人信息  登录页面
			gologin() {
				uni.navigateTo({
					url: '../../../pages_category_page2/userModule/login'
				})
			},
			goinfo() {
				uni.navigateTo({
					url: '../../../pages_category_page2/userModule/personalDetails?infoitem=' + JSON.stringify(this
						.infoitem)
				})
			},
			// 我的评论
			gouserEvaluate() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page1/goodsModule/userEvaluate'
					})
				}

			},
			// 分销中心
			godistribution() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page1/distributionModule/index'
					})
				}
			},
			goToMemberCenter() {
				uni.navigateTo({
					url: '../../../pages_category_page1/memberCenter/index'
				})
			},
			applySettle() {
				const res = uni.getStorageSync('storage_key');
				let token = SECRET.Encrypt(res.token)
				let username = this.useritem.name
				let test = SECRET.Decrypt(token)
				// #ifdef H5
				console.log('h5 test')
				window.open(API.SettledMerchantPrefix + `/#/?username=${username}&user=${token}`)
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(API.SettledMerchantPrefix + `/#/?username=${username}&user=${token}`, function(e) {
					console.log(e);
				})
				// #endif
				// #ifdef MP-WEIXIN
				console.log('wx test')
				var url = API.SettledMerchantPrefix + `/#/?username=${username}&user=${token}`
				uni.navigateTo({
					url: `../../../pages_category_page1/linkOthers/index?url=${url}`
					// 此处的链接为小程序上面新建的webview页面路径，参数url为要跳转外链的地址
					// url: '../../../pages_category_page1/linkOthers/index?url=' + encodeURIComponent(url)
					// url:'../../../pages_category_page2/userModule/coupon'
				})
				// #endif
				// #ifdef MP-ALIPAY
				var url = API.SettledMerchantPrefix + `/#/?username=${username}&user=${token}`
				uni.navigateTo({
					url: `../../../pages_category_page1/linkOthers/index?url=${url}`
					// 此处的链接为小程序上面新建的webview页面路径，参数url为要跳转外链的地址
					// url: '../../../pages_category_page1/linkOthers/index?url=' + encodeURIComponent(url)
					// url:'../../../pages_category_page2/userModule/coupon'
				})
				// #endif
			},
			//我的账户
			memberAccountClick() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/memberAccount'
					})
				}
			},
			//我的优惠券
			couponClick() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/coupon'
					})
				}
			},
			// 地址管理
			addressClick() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/address'
					})
				}

			},
			// 我的售后
			goafterSale() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page1/orderModule/afterSale'
					})
				}
			},
			// 我的银行卡
			goBankcard() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/bankcard'
					})
				}
			},
			//判断是否是分销员
			getApplyState() {
				NET.request(API.HasApply, {
					tenantCode: this.currentId
				}, 'POST').then(res => {
					uni.hideLoading()
					this.slist = res.data
				}).catch(res => {
					uni.hideLoading()
				})
			},
			orderTap(type) {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '../../../pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '../../../pages_category_page1/orderModule/index?type=' + type
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #f8f8f8;
	}

	.content {
		height: 100%;
		position: relative;
		padding-bottom: 150rpx;

		.itemBox {
			display: flex;
			flex-flow: wrap;
			padding-top: 30rpx;
			background: #FFFFFF;
			width: 690rpx;
			margin: 30rpx auto 0 auto;
		}

		/* background-color: #f8f8f8; */
		.top-bg {
			width: 100%;
			height: 400rpx;
			margin-top: -50rpx;
		}

		.page-content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			z-index: 10;
			margin-top: -320upx;

			.user-info-box {
				width: 100%;
				box-sizing: border-box;
				padding: 30upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				position: relative;

				.notice {
					width: 60rpx;
					height: 60rpx;
					position: absolute;
					top: 0;
					right: 50rpx;
					background: url("../../../static/images/notice.png") no-repeat center center;
					background-size: contain;

					.messNum {
						background: #C83732;
						border-radius: 50%;
						color: #FFFFFF;
						text-align: center;
						margin: 0rpx 0 0 30rpx;
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						font-size: 20rpx;
					}
				}

				.user-image {
					width: 126upx;
					height: 126upx;
				}

				.user-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 20upx;
					box-sizing: border-box;
					z-index: 10;

					.user-logoin-title {
						font-size: 36upx;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
					}

					.user-logoin-lable {
						font-size: 24upx;
						font-weight: 400;
						color: rgba(255, 255, 255, 1);
						margin-top: 20upx;
					}

					.experience {
						label {
							font-size: 26rpx;
							color: #FFFFFF;
							opacity: 0.7;
						}

						.experienceValue {
							width: auto;
							padding: 0 28rpx;
							height: 40rpx;
							font-weight: 400;
							color: #FFFFFF;
							border-radius: 25rpx;
							line-height: 40rpx;
							border: 2rpx solid rgba(0, 0, 0, 0);
							background: linear-gradient(88deg, #C5AA7B 0%, #F5DEB2 100%);
							font-size: 20rpx;
							margin-left: 20rpx;
						}
					}
				}

				.user-info-right {
					width: 30upx;
					height: 30upx;
				}
			}

			.order-box {
				width: 690upx;
				height: 196upx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 0px 10upx 0px rgba(51, 51, 51, 0.1);
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 30upx;
				z-index: 10;

				.order-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;

					.quan {
						position: absolute;
						right: 40upx;
						top: 10upx;
						border: 1px solid red;
						color: #FFFFFF;
						background-color: red;
						border-radius: 50%;
						font-size: 16rpx;
						width: 30upx;
						height: 30upx;
						line-height: 30upx;
						text-align: center;
					}

					.order-item-image {
						width: 90upx;
						height: 90upx;
					}

					.order-item-text {
						font-size: 28upx;
						margin-top: 10upx;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
			}

			.item-btn {
				width: 25%;
				box-sizing: border-box;
				background-color: #fff;
				text-align: center;
				margin-bottom: 40rpx;

				.item-btn-icon {
					width: 90upx;
					height: 90upx;
				}

				.item-btn-text {
					font-size: 28upx;
					font-weight: 500;
					flex: 1;
					color: rgba(102, 102, 102, 1);
				}

				.messNum {
					margin-left: 10rpx;
					font-size: 16rpx;
					background-color: red;
					color: #FFFFFF;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-top: -5rpx;
					line-height: 30rpx;
					text-align: center;
				}

				.item-btn-right {
					width: 24upx;
					height: 24upx;
				}

			}

			.mt20 {
				margin-top: 20upx;
			}

			.mt1 {
				margin-top: 1upx;
			}
		}

		.copyright {
			text-align: center;
			padding: 30rpx 0 20rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;

			text {
				display: block;
				font-size: 20rpx;
				line-height: 30rpx;
				color: #C5CACF;
			}
		}
	}
</style>
