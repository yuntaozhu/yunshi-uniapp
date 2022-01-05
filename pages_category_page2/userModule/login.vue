<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="https://ceres.zkthink.com/static/images/loginLogo.png"></image>
		</view>
		<view class="loginTitle-text flex-column-plus flex-items font-color-666 fs26">
			<text>为了给您提供更好的服务</text>
			<text>我们需要您的授权哦~</text>
		</view>
		<view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="loginWxBut fs28" @click="GetUserInfo">微信登录</button>
			<button class="goToHome fs28" @click="goToHome">去首页逛逛</button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button class="loginWxBut fs28" @click="GetAliPayUserInfo">支付宝登录</button>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<view class="loginBut" v-if="noMp" @click="goLogin">手机号登录</view>
			<!-- #endif -->
		</view>
		<view class="flex-row-plus mar-top-30" v-if="noMp">
			<text class="font-color-C5AA7B">还没有账号，</text>
			<view class="register-text" @click="goRegister">去注册</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				WXloginQuery: {
					"code": "",
					"salesId": 0,
					"headImg": ''
				},
				noMp: false,
				// beforePage: undefined,
				// doubleBeforePage: undefined
			}
		},
		onLoad(options) {
			// #ifndef MP
			this.noMp = true
			// #endif
			const pages = getCurrentPages()
			uni.setStorageSync('last_page', pages[pages.length - 2].route);
			if (pages[pages.length - 2].options) {
				uni.setStorageSync('last_page_options', pages[pages.length - 2].options);
			}
		},
    onBackPress(){
      uni.switchTab({
        url: '../../pages/tabbar/index/index'
      })
      return true;
    },
		methods: {
			back() {
				uni.switchTab({
					url: '../../pages/tabbar/index/index'
				});
			},
			goLogin() {
				uni.navigateTo({
					url: 'accountLogin'
				})
			},
			goRegister() {
				uni.navigateTo({
					url: 'register'
				})
			},
			// 微信登录
			GetUserInfo() {
				const that = this
				// // #ifdef APP-PLUS
				// uni.login({
				// 	provider: 'weixin',
				// 	success: function(loginRes) {
				// 		// 获取用户信息
				// 		uni.getUserInfo({
				// 			provider: 'weixin',
				// 			success: function(infoRes) {
				// 				let wechatOpenId = infoRes.userInfo.openId
				// 				let avatarUrl = infoRes.userInfo.avatarUrl
				// 				NET.request(API.WxAppLogin, {
				// 					'wechatOpenId': wechatOpenId
				// 				}, 'POST').then(res => {
				// 					let data = {
				// 						wechatOpenId: wechatOpenId,
				// 						headImg: avatarUrl
				// 					}
				// 					that.loginSuc(res.data, data)
				// 				}).catch(res => {
				// 					console.log('WxAppLogin failed: ', res)
				// 				})
				// 			},
				// 			fail: () => {
				// 				uni.showToast({
				// 					title: "微信登录授权失败",
				// 					icon: "none"
				// 				});
				// 			}
				// 		});
				// 	}
				// });
				// // #endif

				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success: (res2) => {
						that.WXloginQuery.code = res2.code
					},
					fail: () => {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				})

				uni.getUserProfile({
					desc: '正在获取', //不写不弹提示框
					success: function(res) {
						that.WXloginQuery.headImg = res.userInfo.avatarUrl
						NET.request(API.WxLogin, that.WXloginQuery, 'POST').then(res => {
							let data = {
								wechatOpenId: res.data.wechatOpenId,
								headImg: res.data.headImage
							}
							that.loginSuc(res.data, data)
						}).catch(err => {
							console.log('wxLogin failed', err)
						})
					},
					fail: function(err) {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					},
				});
				/* uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
					},
					fail: () => {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				}); */
				/* uni.getUserProfile({
					desc: '正在获取', //不写不弹提示框
					success: function(res) {
						console.dir(res)
						that.WXloginQuery.headImg = res.userInfo.avatarUrl
						// that.loginSuc({'ifFirst': 1}, {'headImg': res.userInfo.avatarUrl})
					},
					fail: function(err) {
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					}
				}) */
				// #endif
			},
			GetAliPayUserInfo() {
				const that = this
				uni.login({
					provider: 'alipay',
					scopes: 'auth_user',
					success: function(loginRes) {
						that.alipayLogin(loginRes.authCode)
					}
				});
			},
			alipayLogin(authCode) {
				NET.request(API.AlipayLogin, {
					'code': authCode
				}, 'POST').then(res => {
					this.loginSuc(res.data, {
						'buyerUserId': res.data.buyerUserId
					})
				}).catch(err => {
					console.log('alipayLogin failed', err)
				})
			},
			goToHome() {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				});
			},
			loginSuc(buyerUser, data) {
				if (buyerUser.ifFirst == 0) {
					uni.setStorageSync('storage_key', buyerUser);
					this.bindSalesCustomer()
					/* uni.switchTab({
						url: '/pages/tabbar/user/index',
						success() {
							uni.hideLoading()
						}
					}) */

					const last_page = uni.getStorageSync('last_page') || ''
					if (last_page) {
						const last_page_options = uni.getStorageSync('last_page_options') || ''
						const str = JSON.stringify(last_page_options).replaceAll('{', '').replaceAll('}', '').replaceAll('"', '').replaceAll(':', '=').replaceAll(',', '&')
						// 保留其他路由，需跳转2下 到最后登录页面
						// uni.navigateBack({
						//     delta: 1
						// })
						// uni.redirectTo({
						// 	url: `/${last_page}?${str}`,
						// 	// url: `/${last_page}?` + str
						// })

						// 清空其他路由，直接跳转最后登录页面
						uni.reLaunch({
							url: `/${last_page}?${str}`,
							// url: `/${last_page}?` + str
						})
						return
					} else {
						// #ifdef MP-ALIPAY
						uni.navigateTo({
							url: '/pages/tabbar/user/index'
						})
						// #endif
						// #ifndef MP-ALIPAY
						uni.switchTab({
							url: '/pages/tabbar/user/index'
						})
						// #endif
					}
				} else { // 第一次登录，绑定手机号
					uni.redirectTo({
						url: 'bindPhone?data=' + JSON.stringify(data)
					})
				}
			},
			bindSalesCustomer() {
				const shopId = uni.getStorageSync('shopId')
				const salesId = uni.getStorageSync('salesId')
				if (shopId && salesId && shopId !== '' && salesId !== '') {
					// 多次调用绑定方法，不提示任何信息即可
					NET.request(API.BindSalesCustomer, {
					  shopId: shopId,
					  distributorId: salesId
					}, 'POST').then(res => {
					  uni.removeStorageSync('salesId');
					  uni.removeStorageSync('shopId');
					}).catch(err => {
					  console.log('login bindSalesCustomer error')
					  console.dir(err)
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
			margin-top: -200rpx;

			.login-logo {
				width: 200rpx;
				height: 167rpx;
			}
		}

		.loginTitle-text {
			margin-top: 100rpx;
		}

		.goToHome {
			background: none;
			border: none;
			width: auto;
			margin-top: 50rpx;
			color: #999999;
			text-decoration: underline;

			&:after {
				display: none;
			}
		}

		.loginWxBut {
			background: #333333;
			color: #FFEBC4;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 49rpx;
		}

		.loginBut {
			background-color: #333333;
			color: #FFEBC4;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 30rpx;
		}

		.register-text {
			color: #C5AA7B;
		}
	}
</style>
<style scoped>
.loginWxBut::after {
  border-radius: 0 !important;
}
</style>
