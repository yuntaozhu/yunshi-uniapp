<template>
	<!-- 登录 -->
	<view class="container flex-items-plus flex-column">
    <global-loading />
    <view class="login-logoBox">
			<image class="login-logo" src="https://ceres.zkthink.com/static/images/loginLogo.png"></image>
		</view>
		<view class="iphoneNum-box flex-row-plus flex-items">
			<view style="margin-right: 30rpx">
				<image class="loginIcon" src="https://ceres.zkthink.com/static/images/phone.png"></image>
			</view>
			<view>
				<input v-model="userInfo.phone" maxlength="11" placeholder-class="iphoneNum-input" type="number" disabled
					placeholder="请输入您的手机号" />
			</view>
		</view>
		<view class="flex-row-plus mar-top-20">
			<view class="code-box">
				<view style="margin-right: 30rpx">
					<image class="loginIcon" src="https://ceres.zkthink.com/static/images/code.png"></image>
				</view>
				<view>
					<input v-model="code" maxlength="6" placeholder-class="codeNum-input" placeholder="请输入验证码" />
				</view>
			</view>
			<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">{{text}}
			</view>
		</view>
		<view class="mar-top-60">
			<view class="registerBut mar-top-100" @click="unsubscribe">立即注销</view>
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
				code: '',
				userInfo: {}
			}
		},
		mixins: [sendVerifyCode],
		onLoad() {
			this.userInfo = uni.getStorageSync('storage_userInfo')
		},
		methods: {

			// 获取验证码
			codede() {
				this.getVerify()
			},
			getVerify() {
				NET.request(API.Verify, {
					phone: this.userInfo.phone,
				}, 'GET').then(res => {
					this.sendCode()
				}).catch(res => {
					uni.showToast({
						title: res.data.message,
						duration: 1000,
						icon: 'none'
					});
				})
			},
			// 账户注销
			unsubscribe() {
				NET.request(API.delUser + this.code, {}, "delete").then(res => {
					if (res.code == '200') {
						// uni.showLoading({
						// 	mask: true,
						// 	title: '注销成功，正在退出...',
						// 	duration: 2000,
						// });
						setTimeout(function() {
							uni.removeStorageSync('storage_key');
							uni.removeStorageSync('distributorId');
							uni.reLaunch({
								url: 'login',
								success() {
									// uni.hideLoading()
								}
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 1000,
							icon: 'none'
						});
					}
				})
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
