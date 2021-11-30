<template>
  <view class="spikeListBox">
<!--	<view class="countdown" v-if="shopShowType == false">-->
<!--	   距结束<view class="endDate"><span>{{hou}}</span><i>:</i><span>{{min}}</span><i>:</i><span>{{sec}}</span></view>-->
<!--	 </view>-->
    <view class="spikeBg">
      <image src="../../static/images/spikelLogo.png"></image>
    </view>
    <view class="tabs-nav-warp spikeNav">
      <scroll-view class="tabs-nav" scroll-x="true">
        <view class="ul">
          <view class="li" v-for="(item, index) in querySessionData" :key="index" :class="{active: index === active}" @click="changeTit(index, item)">
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
    <view class="spikeList mar-top-20">
      <view class="listItem" v-for="(item,index) in spikeLikeList" :key="index">
        <view class="itemBox">
          <img :src="item.productImage">
        </view>
        <view class="itemInfo">
          <p>{{item.productName}}</p>
          <view class="number">限量件 {{item.total}} / 剩余{{item.total - item.saleNumber}}件</view>
          <view class="originalPrice">原价: ¥{{item.originalPrice}}</view>
          <view class="price">
            <view class="currentPrice flex-row-plus flex-items-plus font-color-FF7800">
				<view class="iconBox">
          <image src="../../static/images/spikeIcon.png"></image>
        </view>
				<view class="flex-row-plus flex-items priceInfo">
					<label class="fs24">￥</label>
					<label class="fs36">{{item.price}}</label>
				</view>
			</view>
            <view class="snapUpBtn" v-if="currentTime > timestamp" @click="gogoodsDetails(item.shopId,item.productId,item.skuId)">
              <view class="btnText">去抢购</view>
              <view style="width: 82%;margin: 0 auto">
                <progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber, item.total)" active stroke-width="5" />
              </view>
            </view>
            <view class="snapUpBtn" :class="{btnStyle1: currentTime < timestamp}" v-if="currentTime < timestamp">
              <view class="btnText">即将开始</view>
              <view style="width: 82%;margin: 0 auto">
                <progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber, item.total)" active stroke-width="5" />
              </view>
            </view>
            <view class="snapUpBtn" :class="{btnStyle2: currentTime > endTime}" v-if="currentTime > endTime">
              <view class="btnText">已结束</view>
              <view style="width: 82%;margin: 0 auto">
                <progress activeColor="#FFFFFF" :percent="getPercent(item.saleNumber, item.total)" active stroke-width="5" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
	data(){
		return{
			spikeLikeList:[],
			spikeLikeData:{},
			page:1,
			pageSize:10,
			loadingType:0,
			hou: "00",
			min: "00",
			sec: "00",
			timeOut:undefined,
			shopId:0,
			shopSeckillId:0,
			type:1,//价格
			volume:1,//销量
			shopShowType:false,
			selectIndex:0,
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
      endTime: null
		}
	},
	onLoad(options) {
    this.currentTime = new Date().getTime();
    console.log(this.currentTime, 'current')
		if(options.shopId && options.shopSeckillId){
			this.shopShowType = false
			this.shopId = options.shopId
			this.shopSeckillId = options.shopSeckillId
		}else{
			this.shopShowType = true
			this.shopId = 0
			this.shopSeckillId = 0
		}
    this.getQuerySession()
    // this.queryProductListBySession()
	},
	// onUnload() {
	// 	if(this.timeOut){
	// 	    clearTimeout(this.timeOut)
	// 	}
	// },
  tabChange(key, value) {
    this.activeTab = key
    this.changeType = value
    this.page = 0
    if (key !== 'index') {
      this.classifyId = key === 'All' ? '' : key
      this.list = []
      // this.getBillList()
    }
  },
	onReachBottom(){
		if(this.loadingType == 1){
			uni.stopPullDownRefresh()
		}else{
			this.page = this.page+1
			this.getSpikeLike()
		}
	},
	methods:{
    changeTit(index, item) {
      if (this.active === index) {
        return false
      } else {
        this.active = index
        this.page = 1
        this.pageSize = 10
        this.session = item.time.substring(0, 16)
        this.spikeLikeList = []
        this.getSpikeLike()
        this.timestamp = item.timestamp
        this.endTime = item.endTime
      }
    },
    queryProductListBySession () {
      NET.request(API.querySession,{
        page: this.sessionPage,
        pageSize: this.sessionPage,
        session: this.session
      },'POST').then(res => {
        this.listData = res.data
      }).catch(res => {
        uni.showToast({
          title:'失败',
          icon:"none"
        })
      })
    },
    getQuerySession () {
      NET.request(API.querySession,{},'GET').then(res => {
        let arr = []
        arr = res.data
        arr.forEach(item => {
          let obj = {}
          obj["time"] = item
          let date = new Date(this.getCaption(item, 0))
          let endDate = new Date(this.getCaption(item, 1))
          console.log(date, 'date121212121')
          obj["timestamp"] = date.getTime()
          obj["endTime"] = endDate.getTime()
          obj["startTime"] = item.substring(5, 16)
          this.querySessionData.push(obj)
        })
        console.log(this.querySessionData, 'data')
        this.session = this.querySessionData[0].time.substring(0, 16)
        this.timestamp = this.querySessionData[0].timestamp
        this.endTime = this.querySessionData[0].endTime
        this.getSpikeLike()
      }).catch(res => {
        uni.showToast({
          title:'失败',
          icon:"none"
        })
      })
    },
    getCaption(obj,state) {
      var index=obj.lastIndexOf("\|");
      if(state==0){
        obj=obj.substring(0,index);
      } else {
        obj=obj.substring(index+1,obj.length);
      }
      return obj;
      },
		gogoodsDetails(shopId,productId,skuId){
			uni.navigateTo({
				url:'../goodsModule/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
			})
		},
		// progressNum(total, limitNumber){
		// 	let progress = 0
		// 	if(limitNumber>0){
		// 		progress = parseInt(users) / parseInt(limitNumber)
		// 		progress = progress.toFixed(2)
		// 	}else{
		// 		progress = 0
		// 	}
		// 	return progress
		// },
    getPercent(num, total){
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0? "0%" : Math.round((num / total) * 10000) / 100.0;
    },
		getSpikeLike(){
      uni.showLoading({
        title: 'Loading...',
      })
			let param = ''
      param = {
        page:this.page,
        pageSize:this.pageSize,
        session: this.session
      }
			NET.request(API.queryProductListBySession,param,'POST').then(res => {
        uni.hideLoading()
				this.spikeLikeData = res.data
				// if(this.shopShowType == false){
				// 	this.dateformat(this.spikeLikeData.time)
				// 	this.countDown()
				// }
				if(res.data.list.length === 0){
					this.loadingType = 1
					this.page = this.page
				}else{
					this.spikeLikeList = this.spikeLikeList.concat(res.data.list)
          console.log(this.spikeLikeList, 'list')
				}
			}).catch(res => {
				uni.showToast({
					title:'失败',
					icon:"none"
				})
			})
		},
		// //时分秒换算
		// dateformat(micro_second) {
		// 	// 总秒数
		// 	let second = Math.floor(micro_second / 1000);
		// 	// 天数
		// 	let day = Math.floor(second / 3600 / 24);
		// 	// 小时
		// 	let hr = Math.floor(second / 3600 % 24);
		// 	// 分钟
		// 	let min = Math.floor(second / 60 % 60);
		// 	// 秒
		// 	let sec = Math.floor(second % 60);
		// 	this.hou = hr+day*24
		// 	this.min = min
		// 	this.sec = sec
		// },
		// countDown(){
		//     let timeOut = setTimeout(() => {
		//       let hou = parseInt(this.hou);
		//       let min = parseInt(this.min);
		//       let sec = parseInt(this.sec);
    //
		//       let netxSec = sec - 1;
		//       let netxMin = min
		//       let netxHou = hou;
		// 		console.log(netxSec,netxMin,netxHou)
		//       if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
		//         clearTimeout(timeOut)
		// 		uni.switchTab({
		// 			url:'../../pages/tabbar/index/index'
		// 		})
		// 		uni.showToast({
		// 			title:"活动结束",
		// 			duration:2000,
		// 			icon:'none'
		// 		})
		//       } else {
		//         if (netxSec == -1) {
		//           netxSec = 59
		//           netxMin = netxMin - 1;
		//         }
		//         if (netxMin == -1) {
		//           netxMin = 59
		//           netxHou = netxHou - 1
		//         }
		//         // if (netxHou == -1) {
		//         //   netxHou = 23
		//         // }
    //
		//         this.hou = this.timeFormat(netxHou),
		//         this.min = this.timeFormat(netxMin),
		//         this.sec = this.timeFormat(netxSec),
		//         this.timeOut = timeOut
		//         this.countDown();
		//       }
		//     }, 1000)
		// },
		// timeFormat(param) { //小于10的格式化函数
		//     return param < 10 ? '0' + param : param;
		// },
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
    .spikeBg {
      text-align: center;
      margin: 50rpx auto;
      image {
        width: 262rpx;
        height: 52rpx;
      }
    }
	  .selected{
	  	color: #FE6F52;
	  }
	  .shopShowTypebox{
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
            line-height: 40upx;
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
              width: 140rpx;
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
              width: 140rpx;
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
  .spikeNav /deep/ .tabs-nav {
  }
</style>
