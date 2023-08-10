<!-- 地址列表 -->
<template>
	<view class="container">
    <global-loading />
		<view v-if="addresListlist.length" class="pad-bot-140 addAddress">
			<view class="addAddress-content flex-row-plus" v-for="(item, index) in addresListlist" :key="index">
				<!--				<view class="address-hesd">{{item.username1}}</view>-->
				<view class="address-detail" @click="itemTap(item)">
					<view class="userName">
						<text>{{item.receiveName}}</text>
						<text class="font-color-999 mar-left-30">{{item.receivePhone}}</text>
					</view>
					<view class="defaultAD-box">
						<text class="def" v-if="item.ifDefault">默认</text>
						<text class="lable font-color-999" v-else-if="item.label!=''">{{item.label}}</text>
						<text class="user-address font-color-999">{{item.receiveAdress}}{{item.address}}</text>
					</view>
				</view>
				<view class="editIcon" @click="editAdress(index, item)"></view>
			</view>
		</view>
		<view v-else class="emptyAddress-box">
			<image class="emptyAddress" src="https://ceres.zkthink.com/static/img/noAddress.png"></image>
			<text>你还没有添加地址哦～</text>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="wxAddressNBox">
			<view class="flex-items btnBox flex-sp-between">
				<view class="wxAddress btn flex-items flex-center" @click="wxAddFn">
					<image src="https://ceres.zkthink.com/static/images/weixin2x.png"></image>
					<text>微信导入</text>
				</view>
				<view class="addAddressBtn btn" @click="addAddressClick">添加新地址</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 || APP-PLUS || MP-ALIPAY -->
		<view class="addAddress-box">
			<view class="addAddress" @click="addAddressClick">添加新地址</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script setup>
import { ref } from "vue";
import { hidden } from "../../utils/hidden";
import { request } from "../../utils/request";
import API from "../../config/api";
import {onLoad, onReachBottom, onShow} from "@dcloudio/uni-app";

const addresList = ref([]);
const headWord = ref('');
const editAddress = ref([]);
const type = ref(0);
const addresListlist = ref([]);
const page = ref(1);
const pageSize = ref(20);
const loadingType = ref(0);
const addData = ref({});

onLoad((options) => {
  type.value = options.type
})

onShow(() => {
  addresListlist.value = []
  page.value = 1
  getAddressData()
})

onReachBottom((e) => {
  if (e.from === 'navigateBack') {
    return false;
  }
  back();
  return true;
})

const back = () => {
  console.log(type.value,'type')
  if (type.value == 1 || type.value == 2 ) {
    uni.navigateTo({
      url: '../../pages_category_page1/orderModule/orderConfirm?type=' + type.value
    })
  } else {
    uni.switchTab({
      url: '../../pages/tabbar/user/index'
    });
  }
}
const addAddressClick = () => {
  if (type.value ==  1 || type.value == 2) {
    uni.navigateTo({
      url: 'addAddress?type=1&ordertype=1'
    })
  } else {
    uni.navigateTo({
      url: 'addAddress?type=1'
    })
  }
}

const getAddressData = () => {
  request(API.QueryMemberAddres, {
    page: page.value,
    pageSize: pageSize.value
  }, "GET").then(res => {
    addresList.value = res.data
    if (res.data.list.length == 0) {
      loadingType.value = 1
    }
    for (let i = 0; i < res.data.list.length; i++) {
      addresList.value.list[i].username1 = addresList.value.list[i].receiveName.slice(0, 1)
    }
    addresListlist.value = addresListlist.value.concat(res.data.list)
    addresListlist.value.forEach((item) => {
      item.receivePhone = hidden(item.receivePhone, 3, 4)
    })
    console.log(addresListlist.value.length,'this.addresListlist')
    uni.hideLoading();
  }).catch(err => {
    console.log(err)
    uni.hideLoading();
  })
}

const editAdress = (id, item) => {
  uni.setStorageSync("editAddress", JSON.stringify(addresList.value.list[id]))
  uni.navigateTo({
    url: 'addAddress?type=2&receiveId=' + item.receiveId
  })
}
const itemTap = (item) => {
  if (type.value == 1 || type.value == 2) {
    uni.setStorageSync('receiveItem', item)
    uni.navigateTo({
      url: '../../pages_category_page1/orderModule/orderConfirm?receiveId=' + item
          .receiveId +'&type='+ type.value
    })
  }
}

// 微信导入
const wxAddFn = () => {
  uni.chooseAddress({
    success(res) {
      addData.value['username'] = res.userName
      addData.value['phone'] = res.telNumber
      addData.value['ssqText'] = `${res.provinceName}-${res.cityName}-${res.countyName}`
      addData.value['defaultRegion'] = self.addData.ssqText.split("-")
      addData.value['address'] = res.detailInfo
      addData.value['province'] = res.provinceName
      addData.value['city'] = res.cityName
      // uni.showLoading({
      // 	mask: true,
      // 	title: '导入中...',
      // })
      setTimeout(() => {
        uni.hideLoading();
        uni.navigateTo({
          url: 'addAddress?type=3&wxAddressData=' + JSON.stringify(addData.value)
        })
      }, 500);
    },
    fail:(res)=>{
      console.log('err---选择地址',res)
    }
  })
}

	// export default {
	// 	data() {
	// 		return {
	// 			addresList: [],
	// 			headWord: '',
	// 			editAddress: [],
	// 			type: 0,
	// 			addresListlist: [],
	// 			page: 1, //当前页
	// 			pageSize: 20, //每页记录数
	// 			loadingType: 0,
	// 			addData: {},
	// 		}
	// 	},
	// 	onLoad(options) {
	// 		this.type = options.type
	// 	},
	// 	onShow() {
	// 		this.addresListlist = []
	// 		this.page = 1
	// 		this.getAddressData()
	// 	},
	// 	onBackPress(e) {
	// 		if (e.from === 'navigateBack') {
	// 			return false;
	// 		}
	// 		this.back();
	// 		return true;
	// 	},
	// 	onReachBottom() {
	// 		if (this.loadingType == 1) {
	// 			uni.stopPullDownRefresh()
	// 		} else {
	// 			this.page = this.page + 1
	// 			this.getAddressData()
	// 		}
	// 	},
	// 	methods: {
	// 		back() {
	// 			console.log(this.type,'type')
	// 			if (this.type == 1 || this.type == 2 ) {
	// 				uni.navigateTo({
	// 					url: '../../pages_category_page1/orderModule/orderConfirm?type=' + this.type
	// 				})
	// 			} else {
	// 				uni.switchTab({
	// 					url: '../../pages/tabbar/user/index'
	// 				});
	// 			}
	// 		},
	// 		addAddressClick() {
	// 			if (this.type ==  1 || this.type == 2) {
	// 				uni.navigateTo({
	// 					url: 'addAddress?type=1&ordertype=1'
	// 				})
	// 			} else {
	// 				uni.navigateTo({
	// 					url: 'addAddress?type=1'
	// 				})
	// 			}
  //
	// 		},
	// 		getAddressData() {
	// 			// uni.showLoading({
	// 			// 	mask: true,
	// 			// 	title: '加载中...',
	// 			// })
	// 			request(API.QueryMemberAddres, {
	// 				page: this.page,
	// 				pageSize: this.pageSize
	// 			}, "GET").then(res => {
	// 				this.addresList = res.data
	// 				console.log(this.addresList,'this.addresList')
	// 				if (res.data.list.length == 0) {
	// 					this.loadingType = 1
	// 					this.page = this.page
	// 				}
	// 				for (let i = 0; i < res.data.list.length; i++) {
	// 					this.addresList.list[i].username1 = this.addresList.list[i].receiveName.slice(0, 1)
	// 				}
	// 				this.addresListlist = this.addresListlist.concat(res.data.list)
	// 				this.addresListlist.forEach((item) => {
	// 					item.receivePhone = hidden(item.receivePhone, 3, 4)
	// 				})
	// 				console.log(this.addresListlist.length,'this.addresListlist')
	// 				uni.hideLoading();
	// 			}).catch(err => {
	// 				console.log(err)
	// 				uni.hideLoading();
	// 			})
	// 		},
	// 		editAdress(id, item) {
	// 			uni.setStorageSync("editAddress", JSON.stringify(this.addresList.list[id]))
	// 			uni.navigateTo({
	// 				url: 'addAddress?type=2&receiveId=' + item.receiveId
	// 			})
	// 		},
	// 		itemTap(item) {
	// 			if (this.type == 1 ||  this.type == 2) {
	// 				uni.setStorageSync('receiveItem', item)
	// 				uni.navigateTo({
	// 					url: '../../pages_category_page1/orderModule/orderConfirm?receiveId=' + item
	// 						.receiveId +'&type='+ this.type
	// 				})
	// 			}
	// 		},
	// 		// 微信导入
	// 		wxAddFn() {
	// 			let self = this
	// 			uni.chooseAddress({
	// 				success(res) {
	// 					console.log(res, 'fsfsdfs')
	// 					self.addData['username'] = res.userName
	// 					self.addData['phone'] = res.telNumber
	// 					self.addData['ssqText'] = `${res.provinceName}-${res.cityName}-${res.countyName}`
	// 					self.addData['defaultRegion'] = self.addData.ssqText.split("-")
	// 					self.addData['address'] = res.detailInfo
	// 					self.addData['province'] = res.provinceName
	// 					self.addData['city'] = res.cityName
	// 					// uni.showLoading({
	// 					// 	mask: true,
	// 					// 	title: '导入中...',
	// 					// })
	// 					setTimeout(() => {
	// 						uni.hideLoading();
	// 						uni.navigateTo({
	// 							url: 'addAddress?type=3&wxAddressData=' + JSON.stringify(self
	// 								.addData)
	// 						})
	// 					}, 500);
	// 				},
  //         fail:(res)=>{
  //           console.log('err---选择地址',res)
  //         }
	// 			})
	// 		}
	// 	}
	// }
</script>

<style lang="scss">
	.container {
		padding: 0 24rpx;

		.addAddress {
			border-top: 2rpx solid #F3F4F5;
			padding-top: 30rpx;
		}

		.emptyAddress-box {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			margin-top: 50%;

			.emptyAddress {
				width: 186upx;
				height: 150upx;
			}

			text {
				margin-top: 40upx;
				color: #999999;
			}
		}

		.addAddress-box {
			position: fixed;
			bottom: 50upx;
			left: 30upx;

			.addAddress {
				width: 690upx;
				height: 100upx;
				color: #FFEBC4;
				text-align: center;
				background: #333333;
			}
		}

		.wxAddressNBox {
			position: fixed;
			bottom: 50upx;
			width: 100%;
			left: 0;

			.btnBox {
				width: 100%;
				background: #FFFFFF;
				height: 120rpx;
				padding: 0 50rpx;

				.btn {
					width: 300rpx;
					background: #FFFFFF;
					height: 90rpx;
					line-height: 90rpx;
					border: 2rpx solid #E4E5E6;
					text-align: center;
				}

				.addAddressBtn {
					color: #FFEBC4;
					background: #333333;
					border: 2rpx solid #333333;
				}

				.wxAddress {
					image {
						width: 45rpx;
						height: 37rpx;
						margin-right: 20rpx;
					}
				}
			}
		}

		.addAddress-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 40rpx;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #F3F4F5;

			.address-detail {
				.userName {
					margin-bottom: 15rpx;
				}
			}

			.lable {
				padding: 3rpx 10rpx;
				background: rgba(153, 153, 153, 0.2);
				border-radius: 4rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.def {
				padding: 3rpx 10rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #C5AA7B !important;
				background: rgba(197, 170, 123, 0.2) !important;
			}

			.user-address {
				font-size: 28rpx;
				margin-left: 10rpx;

			}

			.address-hesd {
				height: 70upx;
				width: 70upx;
				background-color: #BBBBBB;
				color: #FFFFFF;
				border-radius: 50%;
				line-height: 70upx;
				text-align: center;
			}

			.defaultAD-box {
				width: 455upx;

				.default-textBox {
					padding-right: 20upx;
					width: 80upx;
				}

				.default-content {
					width: 435upx;
				}

				.default-text {
					color: #C5AA7B;
					background-color: #FFE4CC;
					height: 36upx;
					width: 60upx;
					font-size: 26upx;
					border-radius: 4upx;
					align-items: center;
					line-height: 36upx;
				}
			}

			.editIcon {
				width: 50rpx;
				height: 50rpx;
				display: block;
				background: url("https://ceres.zkthink.com/static/images/addEdit.png") no-repeat center center;
				background-size: contain;
			}
		}
	}
</style>
