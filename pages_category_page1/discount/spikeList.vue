<template>
	<view class="spikeListBox">
    <global-loading />

    <view v-if="!shopSeckillId">
			<view class="spikeBg">
				<image src="https://ceres.zkthink.com/static/images/spikelLogo.png"></image>
			</view>
			<view class="tabs-nav-warp spikeNav">
				<scroll-view class="tabs-nav" scroll-x="true">
					<view class="ul">
						<view class="li" v-for="(item, index) in querySessionData" :key="index"
							:class="{active: index === active}" @click="changeTit(index, item)">
							<view class="timeItem">
								<view class="date" :class="{endCls: currentTime > item.endTime}">{{item.startTime}}</view>
								<view class="state fs24" v-if="currentTime > item.timestamp">抢购中</view>
								<view class="state" v-if="currentTime < item.timestamp">即将开始</view>
								<view class="state" v-if="currentTime > item.endTime">已结束</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-else class="shopStopTime">
			<view class="TimeBigBox" v-if="spikeLikeData.state === 1">
				<label>距离结束：</label>
				<view class="flex-row-plus fs34 flex-items-plus mar-top-10">
				  <view class="countdown-box flex-items-plus">{{ hou }}</view>
				  <view class="font-color-999">:</view>
				  <view class="countdown-box flex-items-plus">{{ min }}</view>
				  <view class="font-color-999">:</view>
				  <view class="countdown-box flex-items-plus">{{ sec }}</view>
				</view>
				<!-- <u-count-down :timestamp="spikeLikeData.time" fontSize="24rpx" separatorColor="#C83732"
				separatorSize="24rpx" bgColor="#C83732" color="#ffffff" height="200rpx"></u-count-down> -->
			</view>
			<view  v-else class="TimeBigBox">
				<label>距离开始：</label>
				<view class="flex-row-plus fs34 flex-items-plus mar-top-10">
				  <view class="countdown-box flex-items-plus">{{ hou }}</view>
				  <view class="font-color-999">:</view>
				  <view class="countdown-box flex-items-plus">{{ min }}</view>
				  <view class="font-color-999">:</view>
				  <view class="countdown-box flex-items-plus">{{ sec }}</view>
				</view>
				<!-- <u-count-down :timestamp="spikeLikeData.enableTime" fontSize="24rpx" separatorColor="#C83732"
				separatorSize="24rpx" bgColor="#C83732" color="#ffffff" height="200rpx"></u-count-down> -->
			</view>
		</view>
		<view class="spikeList mar-top-20">
			<view class="listItem" v-for="(item,index) in spikeLikeList" :key="index">
				<view class="itemBox">
					<img :src="item.productImage || item.image" class="pic-img default-img">
				</view>
				<view class="itemInfo">
					<p>{{item.productName}}</p>
					<view v-if="shopId" class="number">限量件 {{item.discount}} / 剩余{{item.stockNumber}}件</view>
					<view v-else class="number">限量件 {{item.discount}} / 剩余{{item.stockNumber}}件</view>
					<view class="originalPrice">原价: ¥{{item.originalPrice}}</view>
					<view class="price">
						<view class="currentPrice flex-items font-color-FF7800">
							<view class="iconBox flex-items">
								<image src="https://ceres.zkthink.com/static/images/spikeIcon.png"></image>
							</view>
							<view class="flex-row-plus flex-items priceInfo">
								<label class="fs24">￥</label>
								<label class="fs36">{{item.price}}</label>
							</view>
						</view>
						<view v-if="spikeLikeData.state === 1  || (platformSeckillList[platformIndex] && platformSeckillList[platformIndex].state === 3)"
						  class="snapUpBtn"
							@click="gogoodsDetails(item.shopId,item.productId,item.skuId)">
							<view class="btnText">去抢购</view>
							<view class="progressBox">
								<progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber||item.stockNumber, item.total)"
									active stroke-width="5" />
							</view>
						</view>
						<view v-if="spikeLikeData.state === 0 || (platformSeckillList[platformIndex] && platformSeckillList[platformIndex].state === 2)"
						  class="snapUpBtn" :class="{btnStyle1: spikeLikeData.state === 0 || (platformSeckillList[platformIndex] && platformSeckillList[platformIndex].state === 2) }">
							<view class="btnText">即将开始</view>
							<view class="progressBox">
								<progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber || item.stockNumber, item.total)"
									active stroke-width="5" />
							</view>
						</view>
						<!-- <view class="snapUpBtn" v-if="spikeLikeData.state === 0 || spikeLikeData.ifEnable === 2 || platformSeckillList[platformIndex].state===2" :class="{btnStyle1: spikeLikeData.state === 0 || spikeLikeData.ifEnable === 2 || platformSeckillList[platformIndex].state===2}">
							<view class="btnText">即将开始</view>
							<view class="progressBox">
								<progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber || item.stockNumber, item.total)"
									active stroke-width="5" />
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import UCountDown from "../../uview-ui/components/u-count-down/u-count-down";
	export default {
		components:{
			UCountDown
		},
		data() {
			return {
				spikeLikeList: [],
				spikeLikeData: {},
				page: 1,
				pageSize: 10,
				loadingType: 0,
				hou: "00",
				min: "00",
				sec: "00",
				timeOut: undefined,
				shopId: 0,
				shopSeckillId: 0,
				type: 1, //价格
				volume: 1, //销量
				selectIndex: 0,
				list: [],
				classList: [],
				size: 10,
				nothing: false,
				changeType: 0,
				querySessionData: [],
				sessionPage: 1,
				sessionPageSize: 10,
				session: '',
				listData: [],
				currentTime: '',
				active: 0,
				timestamp: null,
				endTime: null,
				platformSeckillId: 0,
				platformSeckillList:[],
				platformIndex:0,
				ticker: null, //定时器
			}
		},
		onLoad(options) {
			console.log(options,'options有没有999')
			this.currentTime = new Date().getTime();
			console.log(this.currentTime, 'current')
			if (options.shopId && options.shopSeckillId) {
				this.shopId = options.shopId
				this.shopSeckillId = options.shopSeckillId
			} else {
				this.shopId = 0
				this.shopSeckillId = 0
			}
		},
		onShow() {
			this.page = 1,
			this.pageSize= 10,
			this.querySessionData = []
			this.spikeLikeList = []
			if(!this.shopId){
				this.getQuerySession()
				this.getQueryPlatformSeckillData()
			}else{
				this.getShopSeckillList()
				console.log('店铺')
			}
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				if(this.shopId){
					this.page = this.page + 1
					this.getShopSeckillList()
				}
			}
		},
		beforeDestroy(){
			// 销毁前清楚定时器
			clearInterval(this.ticker)
			console.log('销毁前清楚定时器')
		},
		methods: {
			changeTit(index, item) {
				if (this.active === index) {
					return false
				} else {
					this.active = index
					this.page = 1
					this.pageSize = 10
					this.session = item.time.substring(0, 16)
					this.spikeLikeList = []
					this.platformSeckillId = this.platformSeckillList[index].seckillId
					this.platformIndex = index
					this.getPlatformSeckillsData(index)
					this.timestamp = item.timestamp
					this.endTime = item.endTime
				}
			},
			// 查询秒杀列表
			getQueryPlatformSeckillData(){
				NET.request(API.getQueryPlatformSeckillList,'GET').then(res => {
					this.platformSeckillList = res.data
					this.platformSeckillId = res.data[0].seckillId
					this.getPlatformSeckillsData(0)
				}).catch(err => {
					uni.showToast({
						title:'失败',
						icon:'none'
					})
				})
			},
			// 平台首页根据seckillId查询对应的秒杀商品列表
			getPlatformSeckillsData(index){
				// uni.showLoading({
				// 	mask: true,
				// 	title: '数据加载中...',
				// })
				NET.request(API.getPlatformSeckills,{ seckillId:this.platformSeckillId },'GET').then(res => {
				 uni.hideLoading()
			   if(res.data[0].products === 0){
					 this.loadingType = 1
					 this.page = this.page
				 }else{
					 this.spikeLikeList = res.data[index].products
				 }
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title:'失败',
						icon:'none'
					})
				})
			},

			// // 根据时间查询
			// queryProductListBySession() {
			// 	NET.request(API.querySession, {
			// 		page: this.sessionPage,
			// 		pageSize: this.sessionPage,
			// 		session: this.session
			// 	}, 'POST').then(res => {
			// 		this.listData = res.data
			// 	}).catch(res => {
			// 		uni.showToast({
			// 			title: '失败',
			// 			icon: "none"
			// 		})
			// 	})
			// },
			// 平台秒杀头部时间
			getQuerySession() {
				NET.request(API.querySession, {}, 'GET').then(res => {
					let arr = []
					arr = res.data
					arr.forEach(item => {
						let obj = {}
						obj["time"] = item
						let date = new Date(this.getCaption(item, 0).replace(/-/g, '/'))
						let endDate = new Date(this.getCaption(item, 1).replace(/-/g, '/'))
						console.log(date, 'date121212121')
						obj["timestamp"] = date.getTime()
						obj["endTime"] = endDate.getTime()
						obj["startTime"] = item.substring(5, 16)
						console.log(obj)
						this.querySessionData.push(obj)
					})
					console.log(this.querySessionData, 'data')
					this.session = this.querySessionData[0].time.substring(0, 16)
					this.timestamp = this.querySessionData[0].timestamp
					this.endTime = this.querySessionData[0].endTime
					// if(this.shopSeckillId){
					// 	this.getShopSeckillList()
					// }else{
					// 	this.getSpikeLike()
					// }

				}).catch(res => {
					uni.showToast({
						title: '失败1111',
						icon: "none"
					})
				})
			},
			// 时间处理
			getCaption(obj, state) {
				var index = obj.lastIndexOf("\|");
				if (state == 0) {
					obj = obj.substring(0, index);
				} else {
					obj = obj.substring(index + 1, obj.length);
				}
				return obj;
			},
			// 跳转商品详情页
			gogoodsDetails(shopId, productId, skuId) {
				uni.navigateTo({
					url: '../goodsModule/goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' +
						skuId
				})
			},
			// 按钮进度条
			getPercent(num, total) {
				num = parseFloat(num);
				total = parseFloat(total);
				if (isNaN(num) || isNaN(total)) {
					return "-";
				}
				return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0;
			},
			// // 获取首页更多秒杀
			// getSpikeLike() {
			// 	uni.showLoading({
			// 		mask: true,
			// 		title: '数据加载中...',
			// 	})
			// 	let param = ''
			// 	param = {
			// 		page: this.page,
			// 		pageSize: this.pageSize,
			// 		session: this.session
			// 	}
			// 	NET.request(API.queryProductListBySession, param, 'POST').then(res => {
			// 		uni.hideLoading()
			// 		this.spikeLikeData = res.data
			// 		if (res.data.list.length === 0) {
			// 			this.loadingType = 1
			// 			this.page = this.page
			// 		} else {
			// 			this.spikeLikeList = this.spikeLikeList.concat(res.data.list)
			// 			console.log(this.spikeLikeList, 'list')
			// 		}
			// 	}).catch(res => {
			// 		uni.showToast({
			// 			title: '失败',
			// 			icon: "none"
			// 		})
			// 	})
			// },
			// 获取店铺更多秒杀
			getShopSeckillList(){
				// uni.showLoading({
				// 	mask: true,
				// 	title: '数据加载中...',
				// })
				let param = ''
				param = {
					page: this.page,
					pageSize: this.pageSize,
					shopId: this.shopId,
					shopSeckillId: this.shopSeckillId,
				}
				NET.request(API.getShopSeckillIndex, param, 'GET').then(res => {
					uni.hideLoading()
					this.spikeLikeData = res.data
					if (this.ticker) { //这一段是防止进入页面出去后再进来计时器重复启动
					  clearInterval(this.ticker);
					}
					this.ticker = setInterval(()=>{
						if(this.spikeLikeData.time > 0){
							this.shopCountDown(this.spikeLikeData.time)
							this.spikeLikeData.time -= 1000
						}
						if(this.spikeLikeData.enableTime > 0){
							this.shopCountDown(this.spikeLikeData.enableTime)
							this.spikeLikeData.enableTime -= 1000
						}
					},1000)
					if (res.data.page.list.length === 0) {
						this.loadingType = 1
						this.page = this.page
					} else {
						this.spikeLikeList = this.spikeLikeList.concat(res.data.page.list)
						console.log(this.spikeLikeList, 'classifies')
					}
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			// 处理店铺秒杀倒计时
			shopCountDown(timeAll){
				let msec = timeAll
				let hou = parseInt(msec / 3600000)
				let min = parseInt((msec % 3600000) / 60000)
				let sec = parseInt(((msec % 3600000) % 60000) / 1000)
				if(hou < 10){
					hou = '0' + hou
				}
				if(min < 10){
					min = '0' + min
				}
				if(sec < 10){
					sec = '0' + sec
				}
				this.hou = hou
				this.min = min
				this.sec = sec
			}
		}
	}
</script>
<style>
	page {
		background: #333333;
	}
</style>
<style lang="scss" scoped>
	page {
		background: #333333;
	}

	.spikeListBox {
		padding: 20rpx;
        .shopStopTime{
					text-align: center;
					color: #FFFFFF;
					.TimeBigBox{
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.countdown-box {
					    padding: 0 8rpx;
					    height: 48rpx;
					    color: #FFFFFF;
					    background: linear-gradient(90deg, #C83732 0%, #E25C44 100%);
					    margin: 10rpx;
				  }
				}
		.spikeBg {
			text-align: center;
			margin: 50rpx auto;

			image {
				width: 262rpx;
				height: 52rpx;
			}
		}

		.selected {
			color: #FE6F52;
		}

		.shopShowTypebox {
			height: 80rpx;
			background-color: #FFFFFF;
			z-index: 9999;
		}

		.countdown {
			display: flex;
			justify-content: center;
			height: 80upx;
			align-items: center;
			background: #F7F7F7;
			width: 100%;
			z-index: 999;

			.endDate {
				display: flex;
				align-items: center;
				margin-left: 20upx;

				span {
					min-width: 48upx;
					height: 36upx;
					padding: 0upx 8upx;
					background: linear-gradient(90deg, #C83732 0%, #E25C44 100%);
					box-shadow: 0rpx 6rpx 12rpx rgba(233, 0, 0, 0.3);
					display: block;
					font-size: 28rpx;
					color: #FFFFFF;
					text-align: center;
				}

				// #ifdef MP-ALIPAY
				span {
					height: min-48upx;
				}

				// #endif
				i {
					font-size: 28upx;
					color: #FF736C;
					font-style: normal;
					margin: 0 8upx;
				}
			}
		}

		.spikeList {
			.listItem {
				display: flex;
				padding: 20upx;
				margin-bottom: 20upx;
				background: #FFFFFF;

				&:last-child {
					border-bottom: none;
				}

				.itemBox {
					width: 260upx;
					height: 260upx;
					margin-right: 30upx;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.itemInfo {
					flex: 1;

					.iconBox {
						image {
							width: 58rpx;
							height: 36rpx;
						}
					}

					p {
						font-size: 26upx;
						color: #333333;
						line-height: 35upx;
						height: 70rpx;
						margin-bottom: 20upx;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.number {
						color: #C5AA7B;
						font-size: 26rpx;
						height: 40rpx;
						background: #FFFFFF;
						border: 2rpx solid #E4E5E6;
						font-weight: 400;
						display: inline;
						padding: 0 5rpx;
					}

					.originalPrice {
						font-size: 24upx;
						margin-top: 20upx;
						text-decoration: line-through;
						color: #CCCCCC;
					}

					.price {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.priceInfo {
							font-size: 40rpx;
							color: #C83732;
						}

						.snapUpBtn {
							width: 160upx;
							height: 84upx;
							text-align: center;
							background: linear-gradient(90deg, #C83732 0%, #E25C44 100%);
							box-shadow: 0rpx 6rpx 12rpx rgba(233, 0, 0, 0.3);
							opacity: 1;
							border-radius: 10rpx;

							.progressBox {
								width: 82%;
								margin: 0 auto;
								border-radius: 10rpx;
								overflow: hidden
							}

							.btnText {
								color: #FFFFFF;
								font-weight: 400;
								opacity: 0.5;
								margin: 10rpx 0;
							}

							.uni-progress {
								border-radius: 10rpx;
							}
						}

						.btnStyle1 {
							background: linear-gradient(90deg, #29C790 0%, #75D98C 100%);
							box-shadow: 0 6rpx 12rpx rgba(52, 203, 144, 0.3);
						}

						.btnStyle2 {
							background: #999999;

							.btnText {
								opacity: 0.8;
							}
						}
					}
				}
			}
		}

		.filterBox {
			display: flex;
			height: 80upx;
			align-items: center;
			width: 100%;
			background: #FFFFFF;
			left: 0;

			.item {
				flex: 0 0 33.33%;
				text-align: center;
			}
		}

		.tabs-nav {
			margin-top: 20rpx;

			.ul {
				white-space: nowrap;

				.li {
					display: inline-block;
					margin-left: 60rpx;
					font-size: 32rpx;
					color: #9499a8;
					position: relative;
					padding-bottom: 18rpx;

					.timeItem {
						text-align: center;

						.date {
							font-size: 24rpx;
							color: #FFFFFF;
							width: 150rpx;
							white-space: normal;
						}

						.state {
							font-size: 24rpx;
							color: #999999;
							display: inline-block;
						}

						.endCls {
							color: #999999;
						}
					}

					//&.on {
					//  color: #FFFFFF;
					//  &:after {
					//    content: '';
					//    width: 100%;
					//    height: 4rpx;
					//    position: absolute;
					//    left: 0;
					//    bottom: 0;
					//    background: #0F6AFB;
					//  }
					//  font-weight:bold;
					//}
				}

				.active {
					.timeItem {
						.date {
							color: #C83732;
							width: 150rpx;
							white-space: normal;
						}

						.state {
							display: inline-block;
							padding: 0 10rpx;
							color: #FFFFFF;
							background: #C83732;
						}
					}
				}
			}
		}
	}
</style>
<style scoped>
	.snapUpBtn /deep/ .uni-progress-bar {
		border-radius: 10rpx;
		height: 8rpx;
		background-color: #deabab !important;
	}

	.btnStyle1 /deep/ .uni-progress-bar {
		background-color: #ace8c5 !important;
	}

	.btnStyle2 /deep/ .uni-progress-bar {
		background-color: #cccccc !important;
	}

	.snapUpBtn /deep/ .uni-progress-inner-bar {
		border-radius: 10rpx;
	}

	.spikeNav /deep/ .tabs-nav {}
</style>
