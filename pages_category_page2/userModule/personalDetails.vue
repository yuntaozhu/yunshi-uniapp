<!-- 修改个人信息 -->
<template>
	<view class="container fs28" :style="{height:screenHeight+'px'}">
		<view class="headBox">
			<view class="personalHead-box flex-sp-between flex-display flex-items">
				<label>头像</label>
				<image class="user-headImg" v-if="item.headImage" :src="item.headImage"></image>
				<image class="user-headImg" v-else src="https://ceres.zkthink.com/static/img/user/morentouxiang.png"></image>
			</view>
		</view>
		<view class="personalBack-box flex-items-plus flex-column">
			<view class="personalHead-box flex-sp-between flex-display flex-items">
				<label>昵称</label>
<!--				<label class="font-color-999" v-if="item.name">{{item.name}}</label>-->
<!--        <label class="font-color-999" v-else>{{item.phone}}</label>-->
        <!-- <input class="nameInput" v-if="name" v-model="name" type="text" placeholder="请输入内容" @blur="changeName(1)" /> -->
        <!-- <input class="nameInput" v-else type="text" v-model="phone" placeholder="请输入内容" @blur="changeName(2)" /> -->
				<input class="nameInput" v-model="name" type="text" placeholder="请输入内容" @blur="changeName" />
			</view>
			<view class="personalHead-box flex-sp-between flex-display flex-items" @click="sexShowClick">
				<label>性别</label>
				<label class="font-color-999">{{item.sex}}</label>
			</view>
			<view class="personalHead-box1 flex-sp-between flex-display flex-items" @click="changeTime">
				<label>生日</label>
				<label class="font-color-999">{{birthday | parsebirthday}}</label>
				<!-- <u-calendar v-model="birthdateShow" :mode="mode"></u-calendar> -->
			</view>
		</view>
		<view class="iphoneNumback-box  flex-items-plus">
			<view class="iphoneNum-box flex-row-plus flex-sp-between flex-items">
				<label style="width: 50%;">手机号</label>
				<label class="font-color-C5AA7B" v-if="phone">{{phone}}</label>
				<label class="font-color-C5AA7B" v-else>
					<!-- #ifdef MP-ALIPAY -->
					<button class="verifyPhone" open-type="getAuthorize" @getAuthorize="onGetAuthorize"
						@error="onAuthError" scope='phoneNumber'>去验证</button>
					<!-- #endif -->
					<!-- #ifndef MP-ALIPAY -->
					去验证
					<!-- #endif -->
				</label>
			</view>
		</view>
		<view class="flex-items-plus mar-top-50">
			<view class="exitLoginBut  flex-items-plus" @click="quit">退出登录</view>
		</view>
		<!-- 修改性别弹窗 -->
		<u-select v-model="sexShow" title="修改性别" :list="sexList" @confirm="ConfirmSex"></u-select>
		<!-- 修改生日弹窗 -->
		<u-picker v-model="timeShow" mode="time" title="修改生日" :params="params" start-year="1970" @confirm="ConfirmTime">
		</u-picker>
		<!-- <view>
			<u-popup v-model="sexShow" mode="center" close-icon-size ="20" border-radius="10" :closeable='true' close-icon-pos = "top-right">
				<view class="flex-items-plus flex-column">
					<label class="mar-top-50 fs-bold">性别</label>
					<u-radio-group class="sexRadio-box flex-items-plus flex-column" v-model="item.sex" @change="sexRadioGroupChange">
						<u-radio class="sexRadio"
							v-for="(item, index) in sexList" :key="index"
							:name="item.id"
							:disabled="item.disabled"
							active-color="#C5AA7B"
						>
							{{item.name}}
						</u-radio>
					</u-radio-group>
				</view>
			</u-popup>
		</view> -->
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				screenHeight: 0,
				birthdateShow: false,
				mode: 'date',
				birthday: '',
				// sexList: [{
				// 	id: 1,
				// 	name: '男',
				// 	disabled: false
				// }, {
				// 	id: 2,
				// 	name: '女',
				// 	disabled: false
				// }],
				sexShow: false,
				timeShow: false,
				item: {},
				UpdateInfoQuery: {
					headimg: '',
					sex: '',
					nickname: ''
				},
				code: '',
				phone: '',
        name: '',
				sexList: [{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					}
				],
				params: { // 日期
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
			}
		},
		onLoad() {
			this.GetUser()
		},
		mounted() {
			// 获取手机的屏幕高度
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight = res.screenHeight
				}
			})
		},
		methods: {
			// 修改生日
			changeTime() {
				if (this.birthday == '1970-01-01' || this.birthday == '') {
					this.timeShow = true
				}
			},
      // 修改昵称
      changeName() {
				const newName = this.name || this.phone
				if (!newName) {
					uni.showToast({
						title: '请输入新的内容',
						icon: "none"
					})
					return false
				}
				uni.showLoading({
					mask: true,
					title: "正在加载中"
				})
				NET.request(API.UpdateUser, {
					name: newName
				}, 'POST').then(res => {
					this.GetUser()
					uni.hideLoading()
					uni.showToast({
						title: '修改成功',
						icon: "success"
					})
				}).catch(res => {
					uni.hideLoading()
				})
      },
			// 提交修改生日
			ConfirmTime(content) {
				if (this.birthday == '1970-01-01' || this.birthday == '') {
					let birthday = content.year + '-' + content.month + '-' + content.day
					uni.showLoading({
            mask: true,
						title: "正在加载中"
					})
					NET.request(API.UpdateUser, {
						birthday
					}, 'POST').then(res => {
						this.GetUser()
						uni.hideLoading()
						uni.showToast({
							title: '修改成功',
							icon: "success"
						})
					}).catch(res => {
						uni.hideLoading()
					})
				}
			},
			// 点击弹窗修改性别
			sexShowClick() {
				this.sexShow = true
			},
			// 提交修改性别
			ConfirmSex(content) {
				uni.showLoading({
          mask: true,
					title: "正在加载中"
				})
				let sex = content[0].label
				NET.request(API.UpdateUser, {
					sex
				}, 'POST').then(res => {
					this.GetUser()
					uni.hideLoading()
					uni.showToast({
						title: '修改成功',
						icon: "success"
					})
				}).catch(res => {
					uni.hideLoading()
				})
			},
			// 获取用户信息
			GetUser() {
				NET.request(API.GetUser, {}, 'GET').then(res => {
					this.item = res.data
					this.phone = res.data.phone
					this.name = res.data.name
					this.birthday = res.data.birthday
				}).catch(res => {

				})
			},
			userHeadTap() {
				return
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {}
				})
			},
			//生日
			birthdateChange(e) {
				return
				this.item.birth = e.result
			},
			// 性别
			sexRadioGroupChange(e) {
				return
			},
			quit() {
				uni.showLoading({
          mask: true,
					title: '正在退出...',
					duration: 2000,
				});
				setTimeout(function() {
					uni.removeStorageSync('storage_key');
					uni.removeStorageSync('distributorId');
					uni.reLaunch({
						url: 'login',
						success() {
							uni.hideLoading()
						}
					})
				}, 1000)
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
						console.log('encryptedData:', encryptedData)
						NET.request(API.UpdateAliPhone, {
							'phone': encryptedData
						}, 'POST').then(res => {
							console.log('UpdateAliPhone res: ', res)
							const item = res.data
							uni.setStorageSync('storage_key', item);
							that.phone = item.phone
							uni.hideLoading()
						}).finally(res => {
							uni.hideLoading()
						})
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
			}
		},
		filters: {
			parsebirthday(birthday) {
				if (birthday == '') {
					return "1970-01-01"
				} else {
					return birthday
				}
			}
		}
	}
</script>

<style lang='scss'>
	.phoneWxBut {
		width: 160rpx;
		height: 60rpx;
		border: 1rpx solid #FF7800;
		border-radius: 44rpx;
		font-size: 28rpx;
		line-height: 60rpx;
	}

	.container {
		width: 100%;
		background-color: #F7F7F7;
		padding: 20rpx;

		.personalBack-box {
			width: 100%;
			background-color: #FFFFFF;

			.personalHead-box {
				width: 90%;
				border-bottom: 1upx solid #E5E5E5;
				padding-bottom: 20upx;
				margin-top: 36upx;
        .nameInput {
          text-align: right;
        }
			}

			.personalHead-box1 {
				width: 90%;
				margin-top: 36upx;
				padding-bottom: 20upx;

				.user-headImg {
					width: 120upx;
					height: 112upx;
					border-radius: 50%;
				}
			}
		}

		.iphoneNumback-box {
			width: 100%;
			background-color: #FFFFFF;
			height: 100upx;
			margin-top: 20upx;

			.iphoneNum-box {
				width: 90%;

				.verifyPhone {
					color: #C5AA7B;
					font-size: 30upx;
					border: 0;
				}
			}
		}

		.exitLoginBut {
			width: 690upx;
			height: 100upx;
			background: #333333;
			color: #FFEBC4;
		}

		.sexRadio-box {
			width: 520upx;
			height: 328upx;

			.sexRadio {
				margin-top: 30upx;
				padding-bottom: 44upx;
			}
		}

		.headBox {
			margin-bottom: 20rpx;
			background: #FFFFFF;
			padding: 25rpx 0;

			.personalHead-box {
				width: 90%;
				margin: 0 auto;
			}

			.user-headImg {
				width: 120upx;
				height: 112upx;
				border-radius: 50%;
			}
		}
	}
</style>
