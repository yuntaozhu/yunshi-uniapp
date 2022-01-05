<template>
	<view class="container">
		<view class="bankcardList">
			<view class="addBankcard-content flex-row-plus" v-for="(item, index) in bankcardList" :key="index">
				<view class="bankcard-detail" @click="itemTap(item.bankId)">
					<view class="banktype">
						<label></label>
					</view>
					<view class="cardnum">
						<label>{{encodeCardNum(item.bankCard)}}</label>
					</view>
          <view class="bankname">
            <label>{{item.bankName}}</label>
          </view>
				</view>
			</view>
		</view>
		<view v-if="ifEmpty" class="emptyBankcard-box">
			<image class="emptyBankcard" src="https://ceres.zkthink.com/static/img/bgnull.png"></image>
			<label>你还没有添加银行卡哦～</label>
		</view>
		<view class="addBankcard-box">
			<view class="addBankcard" @click="addBankcardClick">添加银行卡</view>
		</view>

	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				bankcardList:[],
				headWord:'',
				editBankcard:[],
				type:0,
				bankcardListlength:0,
				page:1,//当前页
				pageSize:20,//每页记录数
				loadingType:0,
        ifEmpty: false
			}
		},
		onLoad(options) {
			this.type = options.type
			this.getBankcardData()
		},
		onBackPress(options) {
			uni.switchTab({
				url:'../../pages/tabbar/user/index'
			});
			return true
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getBankcardData()
			}
		},
		methods: {
			addBankcardClick(){
				uni.navigateTo({
					url:'addBankcard?type=1'
				})
			},
			getBankcardData(){
        uni.showLoading({
          mask: true,
          title: '加载中...',
        })
				NET.request(API.QueryBankcardList,{
					page: this.page,
					pageSize:this.pageSize,
				},'GET').then(res => {
          uni.hideLoading()
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.bankcardList = this.bankcardList.concat(res.data.list)
					this.bankcardListlength = res.data.total
          if (this.bankcardList.length === 0) {
            this.ifEmpty = true
          }
				}).catch(res => {

				})
			},
			editAdress(id){
				uni.setStorageSync("editBankcard",JSON.stringify(this.bankcardList[id]))
				uni.navigateTo({
					url:'addBankcard?type=2'
				})
			},
			itemTap(id){
			  uni.setStorageSync('bankcardId', id)
			  uni.navigateTo({
				url:'../userModule/addBankcard?type=2'
			  })
			},
			encodeCardNum(cardNum){
				let length = cardNum.length
				if(length > 4){
					return "**** **** **** "+cardNum.substring(length-4,length)
				}
			}
		}
	}
</script>

<style lang="scss">
	.container{
		.bankcardList {
      background: url("https://ceres.zkthink.com/static/images/addBankBg.png") no-repeat left top;
      background-size: contain;
			display: block;
			padding-bottom: 85px;
      padding-top: 50rpx;
      min-height: 300rpx;
		}
		.emptyBankcard-box{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			margin-top: 55upx;
			.emptyBankcard{
				margin-top: 45%;
				width: 113upx;
				height: 98upx;
        margin-bottom: 20rpx;
			}
		}
		.addBankcard-box{
			position: fixed;
			bottom: 50upx;
			left: 30upx;
			.addBankcard{
				width: 690upx;
				height: 100upx;
				color: #FFEBC4;
				text-align: center;
				line-height: 100upx;
				background: #333333;
			}
		}
		.addBankcard-content{
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 0 30upx;
      margin-bottom: 30rpx;
			.bankcard-detail {
				width: 100%;
				height: 334rpx;
				background: url("https://ceres.zkthink.com/static/images/accountBg.png") no-repeat left top;
        background-size: contain;
        border-radius: 18rpx;
				.bankname {
					color: #71521B;
					margin-left:30rpx;
					margin-top:7px;
				}
				.banktype {
					margin-left: 15px;
					margin-top: 2px;
					font-size: 8px;
					color: #9C9C9C;
				}
				.cardnum {
					color: #71521B;
					margin: 0 auto;
					margin-top: 120rpx;
          margin-left:30rpx;
					font-size:20px;
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
				border-radius: 4rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				background:rgba(255,121,17,0.2);
				color: #FF7911;
			}
			.user-bankcard {
			  font-size: 28rpx;
			  font-weight: 500;
			  color: rgba(51, 51, 51, 1);
			  margin-left: 10rpx;

			}
			.bankcard-hesd{
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
			.right-Line{
				border-right: 2upx solid #DDDDDD;
				height: 50upx;
			}
		}
	}

</style>
