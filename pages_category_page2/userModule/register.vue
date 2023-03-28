<!-- 注册 -->
<template>
	<view class="container flex-items flex-column">
    <global-loading />
		<view class="login-logoBox">
			<image class="login-logo" src="https://ceres.zkthink.com/static/images/loginLogo.png"></image>
		</view>
		<view>
			<view class="iphoneNum-box flex-row-plus flex-items">
				<view>
					<image class="loginIcon" src="https://ceres.zkthink.com/static/images/phone.png"></image>
				</view>
				<view style="margin-left: 40rpx;">
					<input v-model="phone" class="iphoneNum-inputbox" placeholder-class="iphoneNum-input" type="number"
						maxlength="11" placeholder="请输入您的手机号" />
				</view>
			</view>
			<view class="flex-row-plus mar-top-20">
				<view class="code-box">
					<view>
						<image class="loginIcon" src="https://ceres.zkthink.com/static/images/code.png"></image>
					</view>
					<view style="margin-left: 40rpx;">
						<input v-model="RegisterQuery.code" :maxlength="4" class="codeNum-inputbox" placeholder-class="codeNum-input"
							placeholder="请输入验证码" />
					</view>
				</view>
				<view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">
					{{text}}
				</view>
			</view>
		</view>
		<view class="registerBut" @click="onregister">注册</view>
		<view class="flex-row-plus mar-top-30">
			<text class="font-color-C5AA7B">已有账号，</text>
			<view class="font-color-C5AA7B" @click="gologin">去登录</view>
		</view>
		<view class="agreement">
			<image v-if="!agreement" src="https://ceres.zkthink.com/static/root/none.png" mode="" @click="agreement=true"></image>
			<image v-else src="https://ceres.zkthink.com/static/root/solid.png" mode="" @click="agreement=false"></image>
			<text class="font-color-999">注册即代表同意</text>
			<text class="font-color-C5AA7B" @click="protocol('app_user_agreement')">《APP用户服务协议》</text>和
			<text class="font-color-C5AA7B" @click="protocol('app_privacy_agreement')">《APP个人隐私协议》</text>
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
				getCodeisWaiting: false,
				// 注册
				phone: '',
				RegisterQuery: {
					account: "",
					code: "",
				},
				// 获取验证码
				VerifyQuery: {
					phone: "",
					type: ""
				},
				agreement: false
			}
		},
		mixins: [sendVerifyCode],
		onLoad() {

		},
		methods: {
			// 注册账号
			getRegister() {
				let phoneCodeVerification = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (this.RegisterQuery.code == '') {
					uni.showToast({
						title: '请获取验证码！',
						duration: 2000,
						icon: 'none'
					});
				} else if(!this.agreement){
					uni.showToast({
						title: '请先阅读并同意《用户服务协议和个人隐私协议》',
						duration: 2000,
						icon: 'none'
					});
				} else {
					// uni.showLoading({
					// 	mask: true,
					// 	title: '正在注册...',
					// 	duration: 2000,
					// })
					NET.request(API.Login, {
						type: 1,
						phone: this.phone,
						verificationCode: this.RegisterQuery.code,
					}, 'POST').then(res => {
						uni.hideLoading()
						uni.showToast({
							title: '注册成功！',
							duration: 2000,
							icon: 'none'
						});
						const item = res.data
						uni.setStorageSync('storage_key', item);
						setTimeout(function() {
							uni.switchTab({
								url: '../../pages/tabbar/user/index'
							})
						}, 600)
						// uni.navigateTo({
						// 	url: 'accountLogin'
						// })
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: 'none',
						});
					})
				}
			},
			// 获取验证码
			getVerify() {
				let phoneCodeVerification = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else if (!phoneCodeVerification.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon: 'none'
					});
				} else {
					this.VerifyQuery.phone = this.phone
					NET.request(API.Verify, {
						phone: this.VerifyQuery.phone,
					}, 'GET').then(res => {
						this.sendCode()
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 1000
						});
					})
				}

			},
			// 注册
			onregister() {
				this.getRegister()
			},
			// 获取验证码
			codede() {
				this.getVerify()
			},

			getCode() {
				uni.hideKeyboard()
				if (this.getCodeisWaiting) {
					return;
				}
				if (this.phone == "" || this.phone == null) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return false;
				} else if (!(/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(this.phone))) {
					uni.showToast({
						title: '输入的手机号错误',
						icon: 'none'
					})
					return false;
				}
				this.getCodeisWaiting = true;

			},
			// 跳转登录
			gologin() {
				uni.navigateTo({
					url: 'login'
				})
			},
			// 多商户用户协议
			protocol(type) {
				uni.navigateTo({
					url: 'protocol?type=' + type
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		background-color: #FFFFFF;

		.login-logoBox {
			margin: 100rpx 0;

			.login-logo {
				width: 200rpx;
				height: 166rpx;
			}
		}

		.iphoneNum-box {
			border-bottom: 1rpx solid #F3F4F5;
			height: 100rpx;
			width: 600rpx;

			.loginIcon {
				width: 40rpx;
				height: 53rpx;
			}

			input {
				font-size: 28rpx;
			}

			.iphoneNum-input {
				color: #999999;
				font-size: 28rpx;
				font-weight: 400;
			}

			.iphoneNum-inputbox {
				width: 400rpx;
			}
		}

		.code-box {
			border-bottom: 1rpx solid #F3F4F5;
			height: 100rpx;
			width: 350rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.loginIcon {
				width: 44rpx;
				height: 50rpx;
			}

			input {
				font-size: 28rpx;
			}

			.code-lab {
				width: 200rpx;
			}

			.codeNum-input {
				color: #999999;
				font-size: 28rpx;
				font-weight: 400;
				width: 300rpx;
			}

			.codeNum-inputbox {
				width: 300rpx;
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

		.getcodeActive {
			background-color: #DDDDDD;
			height: 100rpx;
			width: 220rpx;
			border-radius: 44rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-left: 20rpx;
			color: #333333;
		}

		.registerBut {
			background: #333333;
			color: #FFFFFF;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 140rpx;
		}

		.agreement {
			margin: 100rpx 50rpx;
			line-height: 50rpx;
			image{
				width: 34rpx;
				height: 34rpx;
				margin-right: 15upx;
			}
		}
	}
</style>
