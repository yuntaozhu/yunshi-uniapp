<template>
	<view class="container">
		<!-- 商品列表 -->
<!--		<view class="flex-items-plus flex-row search">-->
<!--      <view class="searchBg">-->
<!--        <view class="searchImg-box flex-items-plus">-->
<!--          <image class="searchImg" src="../../static/img/searchImg.png"></image>-->
<!--          <input class="search-box" v-model="keyWord" placeholder-class="searchboxPlace" placeholder="请输入您想要的宝贝" />-->
<!--&lt;!&ndash;          <image class="searchClose-icon" @click="searchTextDel" src="../../static/img/index/searchClose_icon.png"></image>&ndash;&gt;-->
<!--        </view>-->
<!--        <label class="mar-left-40 fs28" @click="searchList(1)">搜索</label>-->
<!--      </view>-->
<!--		</view>-->
<!--    <view class="shop-list-nav">-->
<!--      <view class="nav-item-sort" @click="sortTap(1)">-->
<!--        <text class="nav-title" :class="{'active' : sortIndex == 1}">默认</text>-->
<!--      </view>-->
<!--      <view class="nav-item-sort" @click="sortTap(2)">-->
<!--        <text class="nav-title" :class="{'active' : sortIndex == 2}">价格</text>-->
<!--        <view class="r">-->
<!--          <view class="arrowUp" :class="{activeUp: type == 1}"></view>-->
<!--          <view class="arrowDown" :class="{activeDown: type == 2}"></view>-->
<!--          &lt;!&ndash;          <image src="../../static/images/arrowSortUp.png" v-if="type == 1" class="arrow-img padd-t"></image>&ndash;&gt;-->
<!--          &lt;!&ndash;          <image src="../../static/images/arrowSortDown.png" v-if="type == 2" class="arrow-img padd-b"></image>&ndash;&gt;-->
<!--        </view>-->
<!--      </view>-->
<!--      <view class="nav-item-sort" @click="sortTap(3)">-->
<!--        <text class="nav-title" :class="{'active' : sortIndex == 3}">销量</text>-->
<!--        <view class="r">-->
<!--          <view class="arrowUp" :class="{activeUp: volume == 1}"></view>-->
<!--          <view class="arrowDown" :class="{activeDown: volume == 2}"></view>-->
<!--          &lt;!&ndash;          <image src="../../static/images/arrowSortUp.png" v-if="volume == 1" class="arrow-img padd-t"></image>&ndash;&gt;-->
<!--          &lt;!&ndash;          <image src="../../static/images/arrowSortDown.png" v-if="volume == 2" class="arrow-img padd-b"></image>&ndash;&gt;-->
<!--        </view>-->
<!--      </view>-->
<!--    </view>-->
		<view v-if="list.length>0" class="listBox">
			<view v-for="(item, index) in list" :key="index" class="goodsDetails-box flex-display flex-column" @click="goodsDateils(item.shopId,item.productId,item.skuId)">
				<view v-if="item.activityType === 0" class="goodsDetails flex-items-plus flex-row">
					<image class="goodsImg" :src="item.image"></image>
					<view class="mar-left-30">
						<view class="goodsName-box overflowNoDot">
							<label class="goodsName fs26">{{item.productName}}</label>
						</view>
            <view class="usersBox">
              <label class="fs24 font-color-C5AA7B" v-if="item.users != null">{{item.users}}人付款</label>
              <label class="fs24 font-color-C5AA7B" v-else>0人付款</label>
            </view>
						<view class="priceBuyNum-box flex-items mar-top-20">
							<view>
								<label class="fs30 font-color-C83732">¥</label>
							    <label class="fs36 font-color-C83732 mar-left-10">{{item.price}}</label>
							</view>
							<view style="margin-left: 20upx; color: #CCCCCC; text-decoration:line-through">
								<label class="fs24">¥{{item.originalPrice}}</label>
							</view>
						</view>
						<view class="flex-display flex-sp-between flex-row mar-top-10 flex-items shopName">
							<label class="fs22 font-color-FFEBC4">{{item.shopName}}</label>
<!--							<image class="arrowImg" src="../../static/img/user/arrow.png"></image>-->
						</view>
					</view>
				</view>
				<view v-else class="spikeList goodsDetails">
				  <view class="listItem">
				    <view class="itemBox">
				      <img :src="item.image">
				    </view>
				    <view class="itemInfo mar-top-30">
				      <p>{{item.productName}}</p>
				      <view class="number" v-if="item.users != null">
                <view class="numText">{{item.users}}人付款</view>
                <view class="numText" v-if="item.total !=0">限量{{item.total}}件</view>
              </view>
					  <view class="flex-row-plus flex-item mar-top-30">
              <image class="iconImg" v-if="item.activityType == 1" src="../../static/images/groupBuyIcon.png"></image>
              <image class="iconImg" v-if="item.activityType == 2" src="../../static/images/spikeIcon.png"></image>
              <image class="iconImg" v-if="item.activityType == 4" src="../../static/images/spikeIcon.png"></image>
              <image class="iconImg" v-if="item.activityType == 3" src="../../static/images/discountListIcon.png"></image>
              <image class="iconImg" v-if="item.activityType == 5" src="../../static/images/discountListIcon.png"></image>
              <image class="iconImg" v-if="item.activityType == 8" src="../../static/images/memberCenterIcon.png"></image>
							<view class="font-color-C83732 flex-row-plus">
								<b>￥</b>
								<label class="fs28">{{item.price}}</label>
							</view>
              <view class="mar-left-30 discountsPriceLine font-color-999">¥{{item.originalPrice}}</view>
					  </view>
					  <view class="flex-display flex-sp-between flex-row mar-top-10 flex-items shopName">
					  	<label class="fs22 font-color-FFEBC4">{{item.shopName}}</label>
<!--					  	<image class="arrowImg" src="../../static/img/user/arrow.png"></image>-->
					  </view>
				    </view>
				  </view>
				</view>
			</view>
		</view>

		<!-- 搜索为空 -->
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="../../static/images/searchEmpty.png"></image>
			<label class="font-color-999 fs26 mar-top-30">搜索不到你要找的宝贝呢</label>
			<label class="font-color-999 fs26 mar-top-10">换个词试试吧～</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				keyWord:'',
				category3Id:'',
				page: 1,
				pageSize: 20,
				source:2,
				list:[],
				loadingType:0,
        sortIndex: 0,
        ifNew:0,//是否新品
        type:1,//价格排序条件
        volume:1,//销量排序条件
        sourceType: '',
        ids: [],
        classifyId: 0
			}
		},
		onLoad(option) {
			if(option.sourceType){
        this.sourceType = option.sourceType
        if(option.sourceType === '1'){
          this.ids = option.ids
        } else if(option.sourceType === '2'){
          this.classifyId = option.classifyId
        }
			}
			this.searchList(1)
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.searchList(0)
			}
		},
		methods: {
      // sortTap(index){
      //   this.page = 1
      //   this.list = []
      //   if(index == 1){
      //     this.type = 1
      //     this.volume = 1
      //     this.sortIndex = index
      //   }else if(index == 2){
      //     this.type = this.type != 1 ? 1:2
      //     this.sortIndex = index
      //   }else if(index == 3){
      //     this.volume = this.volume != 1 ? 1:2
      //     this.sortIndex = index
      //   }
      //   this.searchList()
      // },
			// searchTextDel(){
			// 	this.keyWord = ''
			// },
			searchList(type){
				wx.showLoading({
				      title: '加载中...',
				})
				if(type == 1){
					this.list = []
					this.page = 1
				}
        var params = {
          page: this.page,
          pageSize: this.pageSize
        }
        if (this.sourceType === '1') {
          if(this.ids && this.ids.length>0){
            params.ids = this.ids
          } else {
            this.list = []
          }
        } else if(this.sourceType === '2'){
          if(this.classifyId) {
            params.classifyId = this.classifyId
          } else {
            this.list = []
          }
        }
        if(params.ids || params.classifyId){
          NET.request(API.getProducts, params, 'GET').then(res => {
            uni.hideLoading()
            this.list = this.list.concat(res.data.list)
          }).catch(res => {
            uni.hideLoading()
          })
        }
			},
			//商品详情
			goodsDateils(shopId,productId,skuId){
				uni.navigateTo({
					url: 'goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
				})
			}
		}
	}
</script>

<style lang="scss">
page {
  background: #f8f8f8;
}
	input{padding-left: 80upx;}
	.container{
		height: 100%;
    background: #f8f8f8;
    .search {
      padding: 20rpx;
      background: #FFFFFF;
      border-top: 2rpx solid #F3F4F5;
    }
    .searchImg-box {
      position: relative;
    }
		.emptyCart-box{
			margin-top: 70upx;
			.emptyCart-img{
				width: 113upx;
				height: 98upx;
			}
		}
    .searchBg {
      width: 100%;
      display: flex;
      background-color: #F7F7F7;
      align-items: center;
      height: 78rpx;
      justify-content: space-between;
      padding: 0 20rpx;
      label {
        font-weight: 400;
        color: #333333;
      }
    }
		.searchImg{
			width: 50upx;
			height: 50upx;
			position: absolute;
			left: 0upx;
		}
		.search-box{
			width: 400upx;
			height: 66upx;
		}
		.searchboxPlace{
			font-size: 26upx;
			color: #A9A9A9;
			padding-right: 30upx;
		}
		.searchClose-icon{
			z-index: 999;
			width: 40upx;
			height: 40upx;
			margin-left: -50upx;
		}
		.promotion618{
			width: 130upx;
			height: 30upx;
		}
		.goodsDetails-box{
      background: #FFFFFF;
      margin-top: 20rpx;
      box-sizing: border-box;
			.goodsDetails{
				border-bottom: 1upx solid #EDEDED;
        padding-top: 30rpx;
				padding-bottom: 30upx;
        position: relative;
				.goodsName-box{
					width: 389upx;
					height: 85upx;
					.img618-cion{
						width:70upx;
						height:36upx;
					}
				}
        .shopName {
          position: absolute;
          left: 0;
          top: 0;
          height: 50rpx;
          background: #333333;
          opacity: 1;
          border-radius: 0 20rpx 20rpx 0;
          padding: 10rpx 15rpx;
        }
				.goodsImg{
					width: 260upx;
					height: 260upx;
				}
				.discounts-box{
					margin-left: -10upx;
					margin-top: 20upx;
					.discounts-text{
						margin-left: 10upx;
						color: #C5AA7B;
						background-color: #FFE4CC;
						padding: 6upx 12upx;
						border-radius: 4upx;
					}
				}
				.arrowImg{
					width: 20upx;
					height: 20upx;
				}
			}


		}
		.spikeList {
			.arrowImg{
				width: 20upx;
				height: 20upx;
			}
		  // padding: 108upx 30upx 20upx 30upx;
		  padding-top: 30rpx;
		  border-bottom: 1upx solid #EDEDED;
		  .listItem {
		    display: flex;
		    // padding-bottom: 10upx;
		    border-bottom: 1upx solid #EEEEEE;
		    margin-bottom: 30upx;
        .iconImg {
          width: 58rpx;
          height: 36rpx;
        }
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
		        color: #999999;
		        font-size: 26upx;
            display: flex;
            align-items: center;
            .numText {
              padding: 0 10rpx;
              height: 40rpx;
              line-height: 40rpx;
              border: 2rpx solid #E4E5E6;
              color: #C5AA7B;
              font-size: 20rpx;
              margin-right: 10rpx;
            }
		      }
		    }
		  }
		}
    .listBox {
      padding: 0 24rpx;
      box-sizing: border-box;
      .usersBox {
        margin-top: 20rpx;
        label {
          padding: 10rpx;
          border: 2rpx solid #E4E5E6;
        }
      }
    }
	}
  .shop-list-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80rpx;
    line-height: 76rpx;
    background: #fff;
  }

  .nav-item {
    flex: 1;
    font-size: 30rpx;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80rpx;
    line-height: 76rpx;
  }

  .nav-title {
  }

  .nav-item.active {
    color: #C5AA7B;
  }

  .nav-item .line {
    display: inline-block;
    width: 80rpx;
    height: 4rpx;
    background: #fff;
    border-radius: 2rpx;
  }

  .nav-item.active .line {
    background: #C5AA7B;
  }

  .nav-item.padd-l {
    padding-left: 20%;
    box-sizing: border-box;
  }
  .active{
    color: #C5AA7B;
  }
  .nav-item.padd-r {
    padding-right: 20%;
    box-sizing: border-box;
  }

  .nav-item-sort {
    flex: 1;
    font-size: 24rpx;
    color: #222;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    line-height: 80rpx;
  }

  .nav-item-sort .r {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 5rpx;
    .arrowDown {
      width: 0;
      height: 0;
      border-width: 10rpx;
      border-style: solid;
      border-color: #CCCCCC transparent transparent transparent;
      margin-top: 2rpx;
    }
    .arrowUp {
      margin-bottom: 2rpx;
      width: 0;
      height: 0;
      border-width: 10rpx;
      border-style: solid;
      border-color: transparent transparent #CCCCCC transparent;
    }
    .activeDown {
      border-color: #C5AA7B transparent transparent transparent;
    }
    .activeUp {
      border-color: transparent transparent #C5AA7B transparent;
    }
  }

  //.nav-item-sort .r .arrow-img {
  //  width: 32rpx;
  //  height: 32rpx;
  //  padding: 7rpx;
  //  box-sizing: border-box;
  //}
  //// #ifdef MP-ALIPAY
  //.nav-item-sort .r .arrow-img {
  //  width: 16rpx;
  //  height: 16rpx;
  //  padding: 4rpx;
  //  box-sizing: border-box;
  //}
  .search {
    padding-top: 20rpx;
  }
  // #endif
</style>
