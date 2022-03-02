<template>
	<view class="footprint-box">
		<view v-if="!tipsShow">
			<view class="wid function-box">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="https://ceres.zkthink.com/static/images/collectionEditicon.png"></image>
					<label class="mar-left-10">编辑</label>
				</view>
			</view>
			<view class="swipe-box" v-for="(ditem, findex) in footprintList" :key="findex" >
				<view class="daytime">
					<label class="mar-left-30">{{ditem.createTime}}</label>
				</view>
        <view class="listItem" :index="index" v-for="(item, index) in ditem.products" :key="item.footprintId" @click="click(index,findex)">
          <u-swipe-action :show="item.show" @open="open(index,findex)" @click="delFootProduction(index,findex)" :options="options">
            <view class="itemBox">
              <view @click.stop="toGoodsDetails(item.productId,item.shopId,item.skuId)" class="item wid flex-display">
                <view v-if="allCheckShow" class="selectIconBox">
                  <image v-if="item.selected == 1" @click.stop="footItemSel(index,findex,0)" src="https://ceres.zkthink.com/static/images/selectActive.png" class="cart-select-img"></image>
                  <image v-else @click.stop="footItemSel(index,findex,1)" src="https://ceres.zkthink.com/static/images/selectEmpty.png" class="cart-select-img"></image>
                </view>
                <image class="product-img" mode="aspectFill" :src="item.image" />
                <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
                <view class="title-wrap mar-left-20">
                  <text class="title u-line-2 fs28">{{ item.productName }}</text>
                  <view class="flex-items">
                    <label class="fs40 mar-right-20 font-color-C83732">¥{{item.price}}</label>
                    <label class="font-color-CCC discountsPriceLine fs24">¥{{item.originalPrice}}</label>
                  </view>
                </view>
              </view>
            </view>
          </u-swipe-action>
        </view>
			</view>
			<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
				<view class="left">
					<image v-if="isAllCheck" src="https://ceres.zkthink.com/static/images/selectActive.png" class="cart-select-img" @click="allSel(0)"></image>
					<image v-else src="https://ceres.zkthink.com/static/images/selectEmpty.png" class="cart-select-img" @click="allSel(1)"></image>
					<text>全选</text>
				</view>
				<view class="right">
					<view class="btn-delete" @click="showCardModal">删除</view>
				</view>
			</view>
			<view v-if="allCheckShow" class="pad-bot-140"></view>
		</view>
		<view v-else class="mar-top-100 empty-box" @click="goToIndex">
			<image class="footprint-empty" src="https://datumstar.oss-cn-shenzhen.aliyuncs.com/dkyaemtmfwfxbvtuyyhi.png"></image>
			<view class="tohome-box flex-items-plus">去首页逛逛</view>
		</view>
		
		<!-- 删除确认弹窗 -->
		<tui-modal :show="cardModal" :custom="true" :fadein="true">
			<view class="Put-box1">
				<view class="text-align fs34 fs-bold">
					温馨提示
				</view>
				<view class="mar-top-40 text-align">
					是否删除该浏览足迹？
				</view>
				<view class="btn submit" @click="footprintDel">确定</view>
			</view>
			<view v-if="cardModal" @click="cardModal = false" class="cancelDel">
				<image src="https://ceres.zkthink.com/static/images/cancelClose.png" mode=""></image>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import tuiModal from "@/components/modal/modal";
	export default {
		components: {
			tuiModal
		},
		data() {
			return {
				allCheckShow:false,
				isAllCheck:false,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [
					{
						text: ' ',
						style: {
							backgroundColor: '#C83732',
              color: '#FFEBC4'
						}
					}
				],
				page:1,
				pageSize:5,
				loadingType:0,
				footprintList:[],
				footEmpty:false,
				newTimeArr:[],
                tipsShow: false,
				cardModal:false, //删除弹窗显示
				ids: []
			};
		},
		onLoad() {
			this.getFootprintList()
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getFootprintList()
			}
		},
		methods:{
			//去商品详情
			toGoodsDetails(productId,shopId,skuId){
				uni.navigateTo({
					url:'../../pages_category_page1/goodsModule/goodsDetails?productId='+productId+'&shopId='+shopId+'&skuId='+skuId
				})
			},
			// 点击编辑底下删除按钮
			showCardModal(){
				this.footprintList.forEach((value,index)=>{
					value.products.forEach((value1,index1)=>{
						if(value1.selected == 1){
							this.ids.push(value1.productId)
						}
						if(!this.ids.length){
							uni.showToast({
								title:'请选择要删除的足迹商品！',
								icon:'none'
							})
						}else{
							this.cardModal = true
						}
					})
				})
			},
			// 滑动删除单个商品足迹
			delFootProduction(index,findex){
				let dataArr = this.footprintList[findex]
				this.newTimeArr.push(dataArr.createTime)
				this.ids.push(dataArr.products[index].productId)
				this.footprintDel()
			},
			// 删除方法
			footprintDel(){
				this.isAllCheck = false
				NET.request(API.deleteFootprint,{
					ids:this.ids,
					times:this.newTimeArr
				}, 'POST').then(res => {
					this.footEmpty = true
					this.page = 1
					this.pageSize = 5
					this.getFootprintList()
					this.cardModal = false
					this.newTimeArr = []
					this.ids = []
					setTimeout(function(){
						uni.showToast({
							title: "删除成功",
							duration: 2000,
							icon: 'none',
						});
					},1000)
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			footItemSel(index,findex,number){
				this.footprintList[findex].products[index].selected = number
				let footSelectNum = 0
				let footprintListlen = 0
				let footDataTime = []
				this.footprintList.forEach((value,index1)=>{
					value.products.forEach((value, index) => {
						if(value.selected == 0){
							this.isAllCheck = false
						}else{
							footSelectNum++
							footDataTime[index1] = this.footprintList[index1].createTime
						}
					})
				})
				this.newTimeArr = footDataTime.filter(d=>d)
				this.footprintList.forEach((value,index)=>{
					value.products.forEach((value , index) => {
						footprintListlen++
					})
				})
				if(footprintListlen == footSelectNum){
					this.isAllCheck = true
				}
			},
			getFootprintList(){
				if(this.footEmpty == true){
					this.footprintList = []
					this.footEmpty = false
				}
				uni.showLoading({
            mask: true,
					  title: '加载中...',
				})
				NET.request(API.getFootprintList,
				{
					page:this.page,
					pageSize:this.pageSize
				},
				'GET').then(res => {
					if(res.data.length == 0){
						this.loadingType = 1
						this.page = this.page
					}else{
						this.footprintList = this.footprintList.concat(res.data.list)
					}
					if(this.footprintList.length === 0) {
					  this.tipsShow = true
          }
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title:'浏览足迹查询失败',
						icon:"none"
					})
				})
			},
			click(index,findex) {
				let ids = this.footprintList[findex].products[index].productId
				let times = this.footprintList[findex].createTime
				this.cancelFootprin(ids,times)
				this.footprintList[findex].products.splice(index, 1);
				this.$u.toast(`删除成功`);
			},
			cancelFootprin(ids,times){
				NET.request(API.deleteFootprint,{
					ids:[ids],
					times:[times]
				}, 'POST').then(res => {
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index,findex) {
				console.log('打开')
				this.footprintList[findex].products[index].show = true;
				this.footprintList[findex].products.map((val, idx) => {
					if(index != idx) this.footprintList[findex].products[idx].show = false;
				})
			},
			//全选
			allSel(type) {
				this.isAllCheck = !this.isAllCheck
				this.footprintList.forEach((value,index1)=>{
					value.products.forEach((value , index) => {
						value.selected = type
						if(type == 1){
							this.newTimeArr[index1] = this.footprintList[index1].createTime
						}
					})
				})
			},
			editClick(){
				this.allCheckShow = true
			},
			finishClick(){
				this.allCheckShow = false
			},
			
      goToIndex() {
        uni.switchTab({
          url:'/pages/tabbar/index/index'
        })
      }
		}
	}
</script>

<style lang="scss">
page {
  background: #f7f7f7;
}
.footprint-box{
	.function-box{
		background-color: #FFFFFF;
	}
	.editicon-box{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.finishbox{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.editicon{
		width: 50rpx;
		height: 50rpx;
	}
	.swipe-box{
    .listItem {
      padding: 0 24rpx;
      background: #F8F8F8;
      margin-bottom: 20rpx;
    }
		.daytime{
			width: 100%;
			height: 80rpx;
			background-color: #F7F7F7;
			line-height: 80rpx;
		}
		.item {
			display: flex;
			padding: 20rpx;
      background: #FFFFFF;
      .selectIconBox {
        margin-right: 14upx;
        display: flex;
        align-items: center;
      }
		}
		.product-img{
			width: 200rpx;
			flex: 0 0 200rpx;
			height: 200rpx;
		}
		.head-img{
			width: 80rpx;
			flex: 0 0 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.title {
			text-align: left;
			color: #333333;
      height: 150rpx;
		}
		.cart-select-img {
		  width: 98upx;
		  height: 98upx;
		  padding: 30upx;
		  box-sizing: border-box;
		}
    // #ifdef MP-ALIPAY
    .cart-select-img {
      width: 49upx;
      height: 49upx;
      padding: 15upx;
      box-sizing: border-box;
    }
    // #endif
		.toStore{
			border: 1rpx #C5AA7B solid;
			color: #C5AA7B;
			padding: 0rpx 20rpx;
			border-radius: 5rpx;
			height: 52rpx;
		}
	}
	.allcheck-box{
		background-color: #FFFFFF;
		padding: 10rpx 0;
		width: 100%;
		position: fixed;
		bottom: 0upx;
		.left {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  font-size: 28upx;
		  color: #666;
		  .cart-select-img {
		    width: 98upx;
		    height: 98upx;
		    padding: 30upx;
		    box-sizing: border-box;
		  }
		}
		.right {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  box-sizing: border-box;
		}
		.btn-delete {
      width: 232rpx;
      height: 100rpx;
      background: #C83732;
		  line-height: 100rpx;
		  text-align: center;
		  font-size: 28upx;
		  color: #FFFFFF;
		}
	}
	.footprint-empty{
		width: 270rpx;
		height: 270rpx;
	}
	.empty-box{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.tohome-box{
			color: #FF7800;
			border: 1rpx solid #FF7800;
			width: 240rpx;
			height: 70rpx;
			margin-top: 50rpx;
		}
	}
	.Put-box1 {
		.btn {
			text-align: center;
			margin-top: 40rpx;
			border: 1px solid #333333;
			height: 80upx;
			line-height: 80upx;
			width: 100%;
			color: #333333;
		}
	
		.submit {
			background-color: #333333;
			color: #FFEBC4;
		}
	}
	
	.cancelDel {
		position: absolute;
		bottom: -50px;
		left: 45%;
	
		image {
			width: 60upx;
			height: 60upx;
		}
	}
}
</style>
<style scoped>
 .swipe-box /deep/ .u-swipe-del {
   align-items: center;
   justify-content: center;
   width: 160rpx !important;
 }
 .swipe-box /deep/ .u-btn-text {
   width: 60rpx;
   height: 60rpx;
   display: block;
   background: url("https://ceres.zkthink.com/static/images/delIcon.png") no-repeat center center;
   background-size: contain;
 }
</style>
