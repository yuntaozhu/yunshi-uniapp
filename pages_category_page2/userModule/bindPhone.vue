<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" src="https://ceres.zkthink.com/static/images/loginLogo.png"></image>
		</view>
    <view class="loginInfo fs26 font-color-999">
      <p>共建真实、安全的交易环境</p>
      <p>本平台承诺不会滥用您授权的信息</p>
    </view>
		<view class="verifyTypeBox" v-show="verifyType === 0">
			<view class="verifyItem" @click="verifyType = 1">
				短信验证码
			</view>
			<view class="verifyItem verify-checked" @click="verifyType = 2">
				小程序授权
			</view>
		</view>
		<view class="phoneVerify" v-if="verifyType == 1">
      <view class="iphoneNum-box flex-row-plus flex-items">
        <view style="margin-right: 30rpx">
          <image class="loginIcon" src="https://ceres.zkthink.com/static/images/phone.png"></image>
        </view>
        <view>
          <input v-model="phone" placeholder-class="iphoneNum-input" type="number" placeholder="请输入您的手机号" />
        </view>
      </view>
      <view class="flex-row-plus mar-top-20">
        <view class="code-box">
          <view style="margin-right: 30rpx">
            <image class="loginIcon" src="https://ceres.zkthink.com/static/images/code.png"></image>
          </view>
          <view>
            <input v-model="code" placeholder-class="codeNum-input" placeholder="请输入验证码" />
          </view>
        </view>
        <view :class="disabled === true ? 'on' : ''" :disabled="disabled" class="getcode" @click="codede">{{text}}
        </view>
      </view>

			<view class="mar-top-60">
				<view class="registerBut mar-top-100" :class="{bindCls: phone !== '' && code !== ''}" @click="bindPhone">确认</view>
			</view>
			<!--<u-popup v-model="bindPhoneShow" class="popupbind" mode="center" border-radius="14" @close="closepopupbind"
				:closeable="true" close-icon-pos="top-right" close-icon-size="20">
				<view class="popupbind-box flex-items-plus">
					<view class="flex-column flex-items-plus" style="width: 95%;">
						<view class="fa38 font-color-C5AA7B">提示</view>
						<view class="mar-top-50" style="width: 90%;">此手机号已经绑定其他微信号，暂时无法与您的微信账号进行绑定。</view>
					</view>
				</view>
			</u-popup>-->
		</view>
		<view class="mpVerify" v-if="verifyType == 2">
			<button v-if="mpAlipay" class="verifyPhone" open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError"
				scope='phoneNumber'>授权手机号验证</button>

			<button class="verifyPhone fs28 mar-top-100" open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber">微信手机号授权</button>
		</view>
    <view v-if="verifyType !== 0" class="backBtn" @click="verifyType = 0">返回</view>
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				disabled: false,
				phone: '',
				code: '',
				wechatOpenId: '',
				headImg: '',
				bindPhoneShow: false,
				verifyType: 0,
				buyerUserId: 0,
				isMp: false,
				mpAlipay: false,
				mpWechat: false
			};
		},
		onLoad(options) {
			if (options.data) {
				const bindPhoneData = JSON.parse(options.data)
				this.wechatOpenId = bindPhoneData.wechatOpenId
				this.headImg = bindPhoneData.headImg
				this.buyerUserId = bindPhoneData.buyerUserId
			}
			// #ifdef MP
			this.isMp = true
			// #endif
			// #ifdef MP-ALIPAY
			this.mpAlipay = true
			// #endif
			// #ifdef MP-WEIXIN
			this.mpWechat = true
			// #endif
		},
		mixins: [sendVerifyCode],
		methods: {
			closepopupbind() {
				this.bindPhoneShow = false
			},
			codede() {
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
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
					NET.request(API.Verify, {
						phone: this.phone,
					}, 'GET').then(res => {
						this.sendCode()
					}).catch(res => {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: 'none'
						});
					})
				}
			},
			bindPhone() {
				// #ifdef MP-ALIPAY
				this.updateAliPhone(this.phone, false)
				// #endif
				// #ifdef MP-WEIXIN
				this.updateWxPhone()
				// #endif
			},
			onGetAuthorize() {
				const that = this
				uni.showLoading({
          mask: true,
					title: '验证中...',
				})
				my.getPhoneNumber({
					success: (res) => {
						let encryptedData = res.response;
						that.updateAliPhone(encryptedData, true)
					},
					fail: (res) => {
						console.log('getPhoneNumber failed', res);
						uni.hideLoading()
						uni.showToast({
							title: '验证失败',
							icon: 'none'
						})
					}
				});
			},
			onAuthError() {
				console.log('onAuthError')
			},
			getPhoneNumber(e) {
				if (e.detail.errMsg === "getPhoneNumber:ok") {
					console.log(e)
					uni.login({
						provider: 'weixin',
						success: (res) => {
							NET.request(API.GetSessionKey, {
								code: res.code,
							}, 'POST').then(res1 => {
								NET.request(API.SetWxPhone, {
									wechatOpenId: res1.data.wechatOpenId,
									sessionKey: res1.data.sessionKey,
									encryptedData: e.detail.encryptedData,
									iv: e.detail.iv,
									headImage: this.headImg
								}, 'POST').then(res2 => {
									const item = res2.data
									uni.setStorageSync('storage_key', item);
									console.log(uni.getStorageSync('storage_key'))
									this.bindSalesCustomer()
									this.gotoHome()
								}).catch(res => {})
							}).catch(err => {
								console.log(err, 22222)
							})
						},
						fail: () => {
							uni.showToast({
								title: "微信登录授权失败",
								icon: "none"
							});
						}
					})
				} else {
					uni.showToast({
						title: "获取手机授权失败",
						icon: "none"
					});
				}

			},
			updateWxPhone() {
				NET.request(API.UpdateWxPhone, {
					phone: this.phone,
					wechatOpenId: this.wechatOpenId,
					headImage: this.headImg,
					verificationCode: this.code
				}, 'POST').then(res => {
					const item = res.data
					uni.setStorageSync('storage_key', item);
					this.bindSalesCustomer()
					uni.showToast({
						title: '绑定成功',
						duration: 2000,
						icon: 'none'
					});
					this.gotoHome()
				}).catch(res => {
					this.bindPhoneShow = true
				})
			},
			updateAliPhone(encryptedData, encrypted) {
				NET.request(API.UpdateAliPhone, {
					'phone': encryptedData,
					'buyerUserId': this.buyerUserId,
					'encrypted': encrypted
				}, 'POST').then(res => {
					console.log('UpdateAliPhone res: ', res)
					const item = res.data
					uni.setStorageSync('storage_key', item);
					this.bindSalesCustomer()
					this.phone = item.phone
					uni.showToast({
						title: '绑定成功',
						duration: 2000,
						icon: 'none'
					});
					this.gotoHome()
				}).finally(res => {
					uni.hideLoading()
				})
			},
			bindSalesCustomer() {
				const shopId = uni.getStorageSync('shopId')
				const salesId = uni.getStorageSync('salesId')
				if (shopId && salesId) {
					// 多次调用绑定方法，不提示任何信息即可
					console.log('bindPhone bindSalesCustomer')
					NET.request(API.BindSalesCustomer, {
						shopId: shopId,
						distributorId: salesId
					}, 'POST').then(res => {
						uni.removeStorageSync('salesId');
						uni.removeStorageSync('shopId');
					}).catch(res => {
						console.log('bindPhone bindSalesCustomer error')
						console.dir(res)
					})
				}
			},
			gotoHome() {
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
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		height: 100vh;
		.login-logoBox {
			margin-top: 100upx;
			.login-logo {
				width: 234upx;
				height: 193upx;
			}
		}
    .loginInfo {
      margin: 130rpx 0 50rpx 0;
      text-align: center;
    }
		.verifyTypeBox {
			width: 98%;
			.verifyItem {
				width: 80%;
				display: block;
				text-align: center;
				border: 2upx solid #F3F4F5;
				padding: 30upx;
				font-size: 34upx;
        margin: 0 auto 30rpx auto;
        color: #C5AA7B;
			}

			.verify-checked {
				color: white;
				background: #C5AA7B;
			}
		}

		.phoneVerify {
			height: 450upx;
      .iphoneNum-box {
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
        background: #F3F4F5;
        color: #999999;
        height: 100rpx;
        width: 600rpx;
        text-align: center;
        line-height: 100rpx;
        margin-top: 30rpx;
      }
      .bindCls {
        background: #333333;
        color: #F5DEB2;
      }
		}

		.mpVerify {
			height: 300upx;
			.verifyPhone {
        background: #333333;
				color: #FFEBC4;
				height: 100upx;
				width: 600upx;
				text-align: center;
				line-height: 100upx;
				margin-top: 88upx;
        border-radius: 0;
			}
		}
    .backBtn {
      color: #C5AA7B;
      text-decoration: underline;
    }
	}
</style>
