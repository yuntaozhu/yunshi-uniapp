<template>
	<!-- 登录 -->
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="https://ceres.zkthink.com/static/images/loginLogo.png"></image>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style="margin-right: 30rpx">
				<image class="loginIcon" src="https://ceres.zkthink.com/static/images/phone.png"></image>
			</view>
			<view>
				<input v-model="loginQuery.account" placeholder-class="iphoneNum-input" type="number"
					maxlength='11' placeholder="请输入您的手机号" />
			</view>
		</view>
		<view class="flex-row-plus mar-top-20">
			<view class="code-box">
				<view style="margin-right: 30rpx">
					<image class="loginIcon" src="https://ceres.zkthink.com/static/images/code.png"></image>
				</view>
				<view>
					<input v-model="loginQuery.code" placeholder-class="codeNum-input" placeholder="请输入验证码" />
				</view>
			</view>
			<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">{{text}}
			</view>
		</view>
		<view class="mar-top-60">
			<view class="registerBut mar-top-100" @click="login">登录</view>
		</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				loginQuery: {
					account: '',
					code: '',
					salesId: '',
				},
				// 获取验证码
				VerifyQuery: {
					phone: ""
				},
				inviteSpell: {},
				inviteSpelltype: false,
				beforePage: undefined,
				doubleBeforePage: undefined
			}
		},
		mixins: [sendVerifyCode],
		onLoad(options) {
			if (options.inviteSpell == 1) {
				this.inviteSpelltype = true
				this.inviteSpell = uni.getStorageSync('inviteSpell');
			}
			this.loginQuery.salesId = uni.getStorageSync('salesId');
			var pages = getCurrentPages()
			if (pages.length >= 2) {
				this.beforePage = pages[pages.length - 2]
			}
			if (pages.length >= 3) {
				this.doubleBeforePage = pages[pages.length - 3]
			}
		},
		methods: {
			login() {
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.loginQuery.account == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.loginQuery.account)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					const that = this
					uni.showLoading({
						mask: true,
						title: '正在登录...',
						duration: 2000,
					});
					NET.request(API.Login, {
						type: 2,
						phone: this.loginQuery.account,
						verificationCode: this.loginQuery.code
					}, 'POST').then(res => {
						uni.hideLoading()
						const item = res.data
						uni.setStorageSync('storage_key', item);
						if (uni.getStorageSync("salesId")) {
							let salesId = uni.getStorageSync("salesId")
							let shopId = uni.getStorageSync("shopId")
							this.bindSalesCustomer(salesId, shopId)
							uni.removeStorageSync('salesId');
							uni.removeStorageSync('shopId');
						}
						if (this.inviteSpelltype == true) {
							setTimeout(function() {
								uni.reLaunch({
									url: '../../pages_category_page1/goodsModule/inviteSpell?collageId=' +
										this.inviteSpell.collageId + '&orderId=' + this.inviteSpell
										.orderId + '&type=0' + '&productId=' + this.inviteSpell
										.productId + '&skuId=' + this.inviteSpell.skuId
								})
								uni.removeStorageSync('inviteSpell');
							}, 2000)
						} else {
							if (that.beforePage && that.beforePage.route !==
								'pages_category_page2/userModule/accountLogin' &&
								that.beforePage.route !== 'pages_category_page2/userModule/login' &&
								that.beforePage.route !== 'pages_category_page2/userModule/register') {
								console.log(19)
								uni.navigateBack({
									delta: 1
								})
							} else if (that.doubleBeforePage && that.doubleBeforePage.route !==
								'pages_category_page2/userModule/accountLogin' &&
								that.doubleBeforePage.route !== 'pages_category_page2/userModule/login' &&
								that.doubleBeforePage.route !== 'pages_category_page2/userModule/register') {
								uni.navigateBack({
									delta: 2
								})
							} else {
								setTimeout(function() {
									uni.switchTab({
										url: '../../pages/tabbar/user/index'
									})
								}, 600)
							}
						}
					}).catch(res => {
						console.log('Login failed')
						console.dir(res)
						uni.hideLoading()
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: 'none',
						});
					})
				}

			},
			// 获取验证码
			codede() {
				this.getVerify()
			},
			getVerify() {
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.loginQuery.account == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.loginQuery.account)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					this.VerifyQuery.phone = this.loginQuery.account

					NET.request(API.Verify, {
						phone: this.VerifyQuery.phone,
					}, 'GET').then(res => {
						this.sendCode()
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							duration: 1000,
							icon: 'none'
						});
					})
				}

			},
			//绑定关系
			bindSalesCustomer(salesId, storeId) {
				if (salesId && storeId) {
					//如果已登录，静默绑定客户关系，否则跳转到登录页面
					NET.request(API.BindSalesCustomer, {
						shopId: storeId,
						distributorId: salesId
					}, 'POST').then(res => {
						uni.showToast({
							title: "绑定成功",
							icon: "none"
						})
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					})

				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: -300rpx;

			.login-logo {
				width: 234rpx;
				height: 193rpx;
			}
		}

		.iphoneNum-box {
			margin-top: 100rpx;
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 600rpx;

			.loginIcon {
				width: 40rpx;
				height: 53rpx;
			}

			.iphoneNum-input {
				color: #999999;
				font-size: 28rpx;
				font-weight: 400;
			}
		}

		.passwordNum-box {
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 600rpx;

			.passwordNum-input {
				color: #999999;
				font-size: 28rpx;
				font-weight: 400;
				width: 346rpx;
			}
		}

		.code-box {
			border-bottom: 1rpx solid #DDDDDD;
			height: 100rpx;
			width: 360rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.loginIcon {
				width: 44rpx;
				height: 50rpx;
			}

			.code-lab {
				width: 200rpx;
			}

			.codeNum-input {
				color: #999999;
				font-size: 28rpx;
				font-weight: 400;
			}
		}

		.getcode {
			background-color: #C5AA7B;
			height: 100rpx;
			width: 230rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-left: 20rpx;
			color: #FFFFFF;
		}

		.registerBut {
			background: #333333;
			color: #FFEBC4;
			height: 100rpx;
			width: 600rpx;
			text-align: center;
			line-height: 100rpx;
			margin-top: 30rpx;
		}
	}
</style>
