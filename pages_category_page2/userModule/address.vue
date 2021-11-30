<!-- 地址列表 -->
<template>
	<view class="container">
		<view v-if="addresList.total>0" class="pad-bot-140 addAddress">
			<view class="addAddress-content flex-row-plus" v-for="(item, index) in addresListlist" :key="index">
<!--				<view class="address-hesd">{{item.username1}}</view>-->
				<view class="address-detail" @click="itemTap(item)">
					<view class="userName">
						<text>{{item.receiveName}}</text>
						<text class="font-color-999 mar-left-30">{{item.receivePhone}}</text>
					</view>
					<view class="defaultAD-box">
						<text class="def" v-if="item.defult">默认</text>
						<text class="lable font-color-999" v-else-if="item.label!=''">{{item.label}}</text>
						<text class="user-address font-color-999">{{item.receiveAdress}}{{item.address}}</text>
					</view>
				</view>
				<view class="editIcon" @click="editAdress(index, item)"></view>
			</view>
		</view>
		<view v-else class="emptyAddress-box">
			<image class="emptyAddress" src="../../static/img/noAddress.png"></image>
			<text>你还没有添加地址哦～</text>
		</view>
		<view class="addAddress-box">
			<view class="addAddress" @click="addAddressClick">添加新地址</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				addresList:[],
				headWord:'',
				editAddress:[],
				type:0,
				addresListlist:[],
				page:1,//当前页
				pageSize:20,//每页记录数
				loadingType:0,
			}
		},
		onLoad(options) {
			this.type = options.type
		},
		onShow(options){
			this.addresListlist = []
			this.page = 1
			this.getAddressData()
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getAddressData()
			}
		},
		methods: {
			back(){
				if(this.type == 1){
					uni.navigateTo({
						url:'../../pages_category_page1/orderModule/orderConfirm?type=3'
					})
				}else{
					uni.switchTab({
						url:'../../pages/tabbar/user/index'
					});
				}
			},
			addAddressClick(){
				if(this.type == 1){
					uni.navigateTo({
						url:'addAddress?type=1&ordertype=1'
					})
				}else{
					uni.navigateTo({
						url:'addAddress?type=1'
					})
				}

			},
			getAddressData(){
				NET.request(API.QueryMemberAddres,{page:this.page,pageSize:this.pageSize},"GET").then(res => {
					this.addresList = res.data
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					for(let i =0;i<res.data.list.length;i++){
						this.addresList.list[i].username1 = this.addresList.list[i].receiveName.slice(0,1)
					}
					this.addresListlist = this.addresListlist.concat(res.data.list)
				}).catch(res => {

				})
			},
			editAdress(id, item){
				uni.setStorageSync("editAddress",JSON.stringify(this.addresList.list[id]))
				uni.navigateTo({
					url:'addAddress?type=2&receiveId=' + item.receiveId
				})
			},
			itemTap(item){
			    if(this.type == 1){
					uni.setStorageSync('receiveItem', item)
					uni.navigateTo({
						url:'../../pages_category_page1/orderModule/orderConfirm?type=3&receiveId=' + item.receiveId
					})
			    }
			},
		}
	}
</script>

<style lang="scss">
	.container{
    padding: 0 24rpx;
    .addAddress {
      border-top: 2rpx solid #F3F4F5;
      padding-top: 30rpx;
    }
		.emptyAddress-box{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			margin-top: 50%;
			.emptyAddress{
				width: 186upx;
				height: 150upx;
			}
			text{
				margin-top: 40upx;
				color: #999999;
			}
		}
		.addAddress-box{
			position: fixed;
			bottom: 50upx;
			left: 30upx;
			.addAddress{
				width: 690upx;
				height: 100upx;
				color: #FFEBC4;
				text-align: center;
				background: #333333;
			}
		}
		.addAddress-content{
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
			.def{
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
			.address-hesd{
				height: 70upx;
				width: 70upx;
				background-color: #BBBBBB;
				color: #FFFFFF;
				border-radius: 50%;
				line-height: 70upx;
				text-align: center;
			}
			.defaultAD-box{
				width: 455upx;
				.default-textBox{
					padding-right: 20upx;
					width: 80upx;
				}
				.default-content{
					width: 435upx;
				}
				.default-text{
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
        background: url("../../static/images/addEdit.png") no-repeat center center;
        background-size: contain;
      }
		}
	}

</style>
