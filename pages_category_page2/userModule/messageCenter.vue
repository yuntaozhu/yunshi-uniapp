<template>
	<view class="messageCenter">
		<view>
			<view class="flex-items flex-sp-between fs26 topTitBox">
				<view>
					未读消息{{num}}条
				</view>
				<view v-if="num!=0" class="allRead" @click="allMessage">
					全部已读
				</view>
			</view>
			<u-swipe-action class="u-swipe-action" :show="item.show" :index="index" v-for="(item, index) in messageList"
				:key="item.noticeId" @click="productClick(item)" :options="options">
				<view class="messageItem" @click="goToMesDetail(item.noticeId,item.only,item.jump)">
					<view class="messageBox">
						<view class="messageType">
							<view v-if="item.noticeType == 1" class="messageTypeL">
								<view class="iconBox">
									<image src="https://ceres.zkthink.com/static/images/notice.png" alt=""></image>
									<view class="redBox" v-if="item.ifRead ===0"></view>
								</view>
								<span>订单消息</span>
							</view>
							<view v-else class="messageTypeL">
								<view class="iconBox">
									<image src="https://ceres.zkthink.com/static/images/notice.png" alt=""></image>
								</view>
								<span>系统公告</span>
							</view>
							<view class="messageTypeR">{{item.createTime}}</view>
						</view>
						<view>
							<rich-text class="messageInfo" :nodes="item.htmlData"></rich-text>
						</view>
					</view>
					<!--					<view class="messageBtn">-->
					<!--						<span class="viewDetail">查看详情</span>-->
					<!--						<span class="arrow"></span>-->
					<!--					</view>-->
				</view>
			</u-swipe-action>
		</view>
		<view v-if="ifEmpty" class="mar-top-60 empty-box">
			<image class="question-empty" src="https://ceres.zkthink.com/static/img/bgnull.png"></image>
			<view class="tohome-box flex-items-plus">暂无消息</view>
		</view>
	</view>
</template>

<script>
	import parse from 'mini-html-parser2';
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				list: 3,
				messageList: [],
				page: 1,
				pageSize: 10,
				loadingType: 0,
				num: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#F15C48'
					}
				}],
        ifEmpty: false
			}
		},
		onShow() {
			this.page = 1
			this.messageList = []
			this.getAllMessage()
			this.GetUser()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getAllMessage()
			}
		},
		methods: {
			GetUser() {
				NET.request(API.GetUser, {}, 'GET').then(res => {
					this.num = res.data.notRead
				}).catch(res => {
			
				})
			},
			parseText(html) {
				parse(html, (err, htmlData) => {
					console.log(htmlData)
					return htmlData
				})
			},
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
				return newContent;
			},
			getAllMessage() {
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				NET.request(API.getMessage, {
					'page': this.page,
					'pageSize': this.pageSize
				}, 'GET').then(res => {

					uni.hideLoading()
					if (res.data.length == 0) {
						this.loadingType = 1
						this.page = this.page
					} else {
						let _messageList = this.messageList.concat(res.data.list)
						this.messageList = _messageList.map((item) => {
							let newContent = item.noticeContent.replace(/<img[^>]*>/gi, function(match,
								capture) {
								match = match.replace(/style="[^"]+"/gi, '').replace(
									/style='[^']+'/gi, '');
								match = match.replace(/width="[^"]+"/gi, '').replace(
									/width='[^']+'/gi, '');
								match = match.replace(/height="[^"]+"/gi, '').replace(
									/height='[^']+'/gi, '');
								return match;
							});
							newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
								match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(
									/width:[^;]+;/gi,
									'max-width:100%;');
								return match;
							});
							newContent = newContent.replace(/<br[^>]*\/>/gi, '');
							newContent = newContent.replace(/\<img/gi,
								'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
							);
							// return newContent;
							parse(newContent, (err, htmlData) => {
								item.htmlData = htmlData
							})
							return item
						})
            if (this.messageList.length === 0) {
              this.ifEmpty = true
            }
						// let unReadList = []
						// unReadList = this.messageList.filter(el => el.ifRead == 0)
						// this.num = unReadList.length
					}
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			// 删除消息
			productClick(item) {
				uni.showLoading({
					mask: true,
					title: '正在删除...'
				})
				NET.request(API.delMessage, {
					noticeId: item.noticeId
				}, 'post').then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						console.log(res)
						this.page = 1
						this.messageList = []
						this.getAllMessage()
						this.GetUser()
					} else {
						uni.showToast({
							title: res.errMsg,
							icon: 'none'
						})
					}

				})
			},
			allMessage() {
				NET.request(API.allMessage, {}, "post").then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '全部已读',
							icon: 'none'
						})
						this.page = 1
						this.messageList = []
						this.getAllMessage()
						this.GetUser()
					} else {
						uni.showToast({
							title: res.errMsg,
							icon: 'none'
						})
					}
				})
			},
			goToMesDetail(noticeId, only, jump) {
				NET.request(API.readNotice, {
					noticeId: noticeId
				}, "post").then(res => {
					if (res.code == 200) {
						if (jump == 2) {
							uni.navigateTo({
								url: "../../pages_category_page1/orderModule/orderDetails?orderId=" +
									only + '&noticeId=' +
									noticeId
							})
						} else {
							uni.navigateTo({
								url: 'messageDetail?noticeId=' + noticeId
							})
						}
					} else {
						uni.showToast({
							title: res.errMsg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #FFFFFF;
	}

	.messageCenter {
		height: 100%;
		width: 100%;

		.topTitBox {
			height: 100rpx;
			padding: 0 20rpx;
			background: #f7f7f7;

			.allRead {
				width: 144rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				color: #333333;
				background: #FFFFFF;
			}
		}
		.empty-box {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			.tohome-box {
				color: #999999;
				margin-top: 50rpx;
			}
			.question-empty {
				width: 113rpx;
				height: 98rpx;
			}
		}
		.u-swipe-action {
			margin-bottom: 20upx !important;
		}
		.messageItem {
			width: 100%;
			background: #FFFFFF;
			border-bottom: 2rpx solid #F8F8F8;
			.messageBox {
				.messageType {
					padding: 30upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.iconBox {
						border-radius: 50%;
						background: #C5AA7B;
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20upx;
						position: relative;
						.redBox {
							width: 20upx;
							height: 20upx;
							background-color: red;
							border-radius: 50%;
							position: absolute;
							right: 0upx;
							top: 0upx;
						}
					}
					.messageTypeL {
						display: flex;
						align-items: center;
						image {
							width: 50upx;
							height: 50upx;
							border-radius: 50%;
						}
						span {
							font-size: 32upx;
							color: #333333;
						}
					}
					.messageTypeR {
						color: #CCCCCC;
						font-size: 24upx;
					}
				}
				.messageInfo {
					width: 670upx;
					display: block;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					margin: 20upx 40upx 20upx;
					img {
						width: 100%;
						margin-bottom: 25upx;
					}
					p {
						padding: 0 40upx;
						color: #999999;
						font-size: 28upx;
					}
				}
			}
			.messageBtn {
				margin-top: 20upx;
				border-top: 1upx solid #EEEEEE;
				height: 88upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 40upx;
				.viewDetail {
					color: #333333;
					font-size: 28upx;
				}
				.arrow {
					display: block;
					width: 28upx;
					height: 28upx;
					background: url("https://ceres.zkthink.com/static/images/arrowRight.png") no-repeat center center;
					background-size: contain;
				}
			}
		}
	}
</style>
