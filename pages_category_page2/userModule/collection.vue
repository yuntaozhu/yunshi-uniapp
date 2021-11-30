<template>
	<view class="collection-box">
		<view class="tabsbox">
			<u-tabs :list="collectionTypeList" bar-width="60" :bold="false" active-color="#C5AA7B"
				inactive-color="#999999" :is-scroll="false" :current="collectionTypeFlag"
				@change="collectionTypeActive"></u-tabs>
		</view>
		<view v-if="collectionTypeFlag == 0">
			<view v-if="productCollect.length>0">
				<view class="wid function-box">
					<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
					<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
						<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
						<text class="mar-left-10">编辑</text>
					</view>
				</view>
				<view class="swipe-box">
					<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in productCollect"
						:key="item.collectId" @click="productClick" @open="productOpen" :options="options">
						<view class="flex-item" @click.stop="toGoodsDetails(item.productId,item.shopId,item.skuId)">
							<view class="item u-border-bottom wid flex-row-plus flex-display">
								<view class="flex-items" v-show="allCheckShow">
									<image mode="aspectFill" v-if="item.selected == 1"
										@click.stop="productItemSel(index,0)" src="../../static/images/selectActive.png"
										class="cart-select-img"></image>
									<image mode="aspectFill" v-else @click.stop="productItemSel(index,1)"
										src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
								</view>
								<image class="product-img" mode="aspectFill" :src="item.image" />
								<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
								<view class="title-wrap mar-left-20 priceBox">
									<text class="title u-line-2">{{ item.productName }}</text>
									<view class="flex-column-plus font-color-C5AA7B flex-row">
                    <image class="iconImg" v-if="item.activityType == 1" src="../../static/images/groupBuyIcon.png"></image>
                    <image class="iconImg" v-if="item.activityType == 2" src="../../static/images/spikeIcon.png"></image>
                    <image class="iconImg" v-if="item.activityType == 3" src="../../static/images/discountListIcon.png"></image>
                    <image class="iconImg" v-if="item.activityType == 4" src="../../static/images/spikeIcon.png"></image>
                    <image class="iconImg" v-if="item.activityType == 5" src="../../static/images/discountListIcon.png"></image>
										<text class="fs22">¥</text>
										<text class="fs24 mar-right-10">{{item.price}}</text>
                    <text class="font-color-999 discountsPriceLine fs24">¥{{item.originalPrice}}</text>
									</view>
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllProCheck" src="../../static/images/selectActive.png"
							class="cart-select-img" @click="allProductSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png"
							class="cart-select-img" @click="allProductSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="showCardModalPaoductDel">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-if="productCollect.length==0&&proCollectShow" class="mar-top-60 empty-box">
				<image class="collect-empty" src="../../static/images/collectEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无收藏</view>
			</view>
		</view>
		<view v-if="collectionTypeFlag == 1">
			<view v-if="storeCollect.length>0">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
					<text class="mar-left-10">编辑</text>
				</view>
				<view class="swipe-box swipeBox">
					<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in storeCollect"
						:key="item.collectId" @click="storeClick" @open="storeOpen" :options="options">
						<view class="item flex-items">
							<view class="flex-row-plus flex-sp-between flex-items-plus wid">
								<view class="flex-items-plus flex-row pad-topbot-10">
									<view v-show="allCheckShow">
										<image mode="aspectFill" v-if="item.selected == 1"
											@click.stop="storeItemSel(index,0)"
											src="../../static/images/selectActive.png" class="cart-select-img"></image>
										<image mode="aspectFill" v-else @click.stop="storeItemSel(index,1)"
											src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
									</view>
									<image class="head-img" mode="aspectFill" :src="item.shopLogo" />
									<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
									<view class="title-wrap mar-left-20">
										<text class="title u-line-2">{{ item.shopName }}</text>
										<text class="font-color-999 fs24">{{item.person}}人关注</text>
									</view>
								</view>
								<view class="toStore flex-items-plus fs24" @click="toStoreClick(item.shopId)">
									进入店铺
									<image src="../../static/images/arrowR.png"></image>
								</view>
							</view>
						</view>
            <view class="shopImgBox">
              <view class="itemImgBox" v-for="(sItem, sIndex) of item.productList" :key="sIndex" @click.stop="goodsDateils(sItem.shopId,sItem.productId,sItem.skuId)">
                <image :src="sItem.image"></image>
              </view>
            </view>
					</u-swipe-action>
				</view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllStoreCheck" src="../../static/images/selectActive.png"
							class="cart-select-img" @click="allStoreSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png"
							class="cart-select-img" @click="allStoreSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="showCardModalshopDel">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-if="storeCollect.length==0&&storeCollectShow" class="mar-top-60 empty-box">
				<image class="collect-empty" src="../../static/images/collectEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无收藏</view>
			</view>
		</view>

		<!-- 删除确认弹窗 -->
		<tui-modal :show="cardModal" :custom="true" :fadein="true">
			<view class="Put-box1">
				<view class="text-align fs34 fs-bold">
					温馨提示
				</view>
				<view v-if="paoductDelSubmit" class="mar-top-40 text-align">
					是否删除该收藏商品？
				</view>
				<view v-if="shopDelSubmit" class="mar-top-40 text-align">
					是否删除该收藏店铺？
				</view>
				<view class="flex-display flex-sp-between">
					<view class="btn submit" v-if="paoductDelSubmit" @click="paoductDel">确定</view>
					<view class="btn submit" v-if="shopDelSubmit" @click="shopDel">确定</view>
				</view>
			</view>
			<view v-if="cardModal" @click="cardModal = false" class="cancelDel">
				<image src="../../static/images/cancelClose.png" mode=""></image>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import tuiModal from "@/components/modal/modal";
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		components: {
			tuiModal
		},
		data() {
			return {
				collectionTypeList: [{
					name: '商品'
				}, {
					name: '店铺'
				}],
				collectionTypeFlag: 0,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
					text: ' ',
					style: {
						backgroundColor: '#F15C48'
					}
				}],
				isAllProCheck: false,
				isAllStoreCheck: false,
				allCheckShow: false,
				productCollect: [],
				storeCollect: [],
				productPage: 1,
				productPageSize: 10,
				proloadingType: 0,
				storePage: 1,
				storePageSize: 10,
				storeloadingType: 0,
				storeCollectShow: false,
				proCollectShow: false,
				cardModal: false,
				paoductDelSubmit: false,
				shopDelSubmit:false,
        ids: null,
        currentIndex: null,
        currentType: null
			};
		},
		onLoad() {
			this.getProductCollect()
			this.getStoreCollect()
		},
		onReachBottom() {
			if (this.collectionTypeFlag == 0) {
				if (this.proloadingType == 1) {
					uni.stopPullDownRefresh()
				} else {
					this.productPage = this.productPage + 1
					this.getProductCollect()
				}
			} else if (this.collectionTypeFlag == 1) {
				if (this.storeloadingType == 1) {
					uni.stopPullDownRefresh()
				} else {
					this.storePage = this.storePage + 1
					this.getStoreCollect()
				}
			}
		},
		methods: {
			//批量删除
			showCardModalPaoductDel() {
				let isShowProoductDelSubmit = false
				// 商品
				this.productCollect.forEach((value, index) => {
					if (value.selected == 1) {
						isShowProoductDelSubmit = true
					}
				})
				if(isShowProoductDelSubmit === true){
					this.cardModal = true
					this.paoductDelSubmit = true
					this.shopDelSubmit = false
				}else{
					this.$u.toast(`请先选择要删除的收藏宝贝！`);
				}
			},
			paoductDel() {
        if (this.currentType === 1) {
          this.cancelCollect(this.ids)
          this.productCollect.splice(this.currentIndex, 1);
        } else {
					let ids = []
					this.productCollect.forEach((value, index) => {
						if (value.selected == 1) {
							ids.push(value.collectId)
						}
					})
					NET.request(API.deleteCollect, {
						ids: ids
					}, 'POST').then(res => {
						this.productCollect = []
						this.cardModal = false
						this.$u.toast(`删除成功`);
            this.productPage = 1
						this.getProductCollect()
					}).catch(res => {
						this.cardModal = false
						this.$u.toast(`删除失败`);
					})
				}
			},
			showCardModalshopDel(){
				let isShowShopDelSubmit = false
				// 店铺
				this.storeCollect.forEach((value, index) => {
					if (value.selected == 1) {
						isShowShopDelSubmit = true
					}
				})
				if(isShowShopDelSubmit === true ){
					this.cardModal = true
					this.shopDelSubmit = true
					this.paoductDelSubmit = false
				}else{
					this.$u.toast(`请先选择要删除的收藏店铺！`);
				}
			},
			shopDel() {
        if (this.currentType === 2) {
          this.cancelCollect(this.ids)
          this.storeCollect.splice(this.currentIndex, 1);
        } else {
          console.log('删除')
          let ids = []
          this.storeCollect.forEach((value, index) => {
            if (value.selected == 1) {
              ids.push(value.collectId)
            }
          })
          NET.request(API.deleteCollect, {
            ids: ids
          }, 'POST').then(res => {
            this.storeCollect = []
            this.cardModal = false
            this.$u.toast(`删除成功`);
            this.storePage = 1
            this.getStoreCollect()
          }).catch(res => {
            this.cardModal = false
            this.$u.toast(`删除失败`);
          })
        }
			},
			//去店铺
			toStoreClick(storeId) {
				uni.navigateTo({
					url: '../../pages_category_page1/store/index?storeId=' + storeId
				})
			},
			//去商品详情
			toGoodsDetails(productId, shopId, skuId) {
				uni.navigateTo({
					url: '../../pages_category_page1/goodsModule/goodsDetails?productId=' + productId +
						'&shopId=' + shopId + '&skuId=' + skuId
				})
			},
			collectionTypeActive(index) {
				this.collectionTypeFlag = index
				if (index == 0) {
					this.productPage = 1
					this.productCollect = []
					this.proloadingType = 0
					this.getProductCollect()
				} else if (index == 1) {
					this.storePage = 1
					this.storeCollect = []
					this.storeloadingType = 0
					this.getStoreCollect()
				}
			},
			productClick(index, index1) {
				if (index1 == 0) {
          this.cardModal = true
          this.paoductDelSubmit = true
					this.ids = this.productCollect[index].collectId
          this.currentIndex = index
          this.currentType = 1
				}
			},
			storeClick(index, index1) {
				if (index1 == 0) {
          this.cardModal = true
          this.shopDelSubmit = true
					this.ids = this.storeCollect[index].collectId
          this.currentIndex = index
          this.currentType = 2
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			productOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.productCollect[index].show = true;
				this.productCollect.map((val, idx) => {
					if (index != idx) this.productCollect[idx].show = false;
				})
			},
			storeOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.storeCollect[index].show = true;
				this.storeCollect.map((val, idx) => {
					if (index != idx) this.storeCollect[idx].show = false;
				})
			},
			//商品选中
			productItemSel(index, number) {
				this.productCollect[index].selected = number
				let proSelectNum = 0
				this.productCollect.forEach((value, index) => {
					if (this.productCollect[index].selected == 0) {
						this.isAllProCheck = false
					} else {
						proSelectNum++
					}
				})
				if (this.productCollect.length == proSelectNum) {
					this.isAllProCheck = true
				}
			},
			//店铺选中
			storeItemSel(index, number) {
				this.storeCollect[index].selected = number
				let storeSelectNum = 0
				this.storeCollect.forEach((value, index) => {
					if (this.storeCollect[index].selected == 0) {
						this.isAllStoreCheck = false
					} else {
						storeSelectNum++
					}
				})
				if (this.storeCollect.length == storeSelectNum) {
					this.isAllStoreCheck = true
				}
			},
			//全选
			allProductSel(type) {
				this.isAllProCheck = !this.isAllProCheck
				this.productCollect.forEach((value, index) => {
					this.productCollect[index].selected = type
				})
			},
			allStoreSel(type) {
				this.isAllStoreCheck = !this.isAllStoreCheck
				this.storeCollect.forEach((value, index) => {
					this.storeCollect[index].selected = type
				})
			},
			editClick() {
				this.allCheckShow = true
			},
			finishClick() {
				this.allCheckShow = false
			},
			//收藏商品查询
			getProductCollect() {
				NET.request(API.getProductCollect, {
						page: this.productPage,
						pageSize: this.productPageSize
					},
					'GET').then(res => {
					if (res.data.list.length == 0) {
						this.proCollectShow = true
						this.proloadingType = 1
						this.productPage = this.productPage
					} else {
						console.log(this.productCollect, 222)
						this.productCollect = this.productCollect.concat(res.data.list)
						this.productCollect.forEach((value, index) => {
							value['show'] = false
							value['selected'] = 0
						})
					}
				}).catch(res => {
					uni.showToast({
						title: '收藏商品查询失败',
						icon: "none"
					})
				})
			},
			//收藏店铺查询
			getStoreCollect() {
				NET.request(API.getStoreCollect, {
						page: this.storePage,
						pageSize: this.storePageSize
					},
					'GET').then(res => {
					if (res.data.list.length == 0) {
						this.storeCollectShow = true
						this.storeloadingType = 1
						this.storePage = this.storePage
					}
					this.storeCollect = this.storeCollect.concat(res.data.list)
					this.storeCollect.forEach((value, index) => {
						value['show'] = false
						value['selected'] = 0
					})
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			//取消收藏
			cancelCollect(ids) {
				NET.request(API.cancelCollect, {
					ids: [ids]
				}, 'POST').then(res => {
          this.$u.toast(`删除成功`);
          this.cardModal = false
          this.currentType = null
          this.currentIndex  = null
          this.ids = null
					if (res.code == "200") {
            this.productCollect = []
            this.storeCollect = []
						this.getStoreCollect()
						this.getProductCollect()
					} else {
						this.$u.toast(res.message);
					}
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
      //商品详情
      goodsDateils(shopId,productId,skuId){
        uni.navigateTo({
          url: '../../pages_category_page1/goodsModule/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
        })
      }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.collection-box {
		.empty-box {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.tohome-box {
				color: #999999;
				margin-top: 50rpx;
			}

			.collect-empty {
				margin-top: 30%;
				width: 198rpx;
				height: 183rpx;
			}
		}

		.function-box {
			background-color: #F7F7F7;
		}

		.tabsbox {
			margin-top: 4rpx;
			background-color: #FFFFFF;
		}

		.editicon-box {
			display: flex;
			justify-content: flex-end;
			position: relative;
			left: -30rpx;
			padding: 16rpx 0;
		}

		.finishbox {
			display: flex;
			justify-content: flex-end;
			position: relative;
			left: -30rpx;
			padding: 16rpx 0;
		}

		.editicon {
			width: 50rpx;
			height: 50rpx;
		}

		.swipe-box {
			.item {
				display: flex;
				padding: 20rpx;
			}
      .shopImgBox {
        display: flex;
        justify-content: end;
        margin-right: 50rpx;
        .itemImgBox {
          margin-left: 20rpx;
          image {
            width: 120rpx;
            height: 120rpx;
            border: 2rpx solid #F3F4F5;
          }
        }
      }
			.product-img {
				width: 180rpx;
				flex: 0 0 180rpx;
				height: 180rpx;
				border-radius: 12rpx;
			}

			.head-img {
				width: 80rpx;
				flex: 0 0 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.title {
				text-align: left;
				font-size: 28rpx;
				color: $u-content-color;
        height: 138rpx;
			}

			.cart-select-img {
				width: 40upx;
				height: 40upx;
				margin: 0upx 30upx 0upx;
				box-sizing: border-box;
			}

			.toStore {
				color: #FFEBC4;
				padding: 0rpx 20rpx;
				border-radius: 5rpx;
				height: 52rpx;
				background: #333333;
				margin-right: 30rpx;

				image {
					width: 10rpx;
					height: 18rpx;
					margin-left: 10rpx;
				}
			}
		}

		.allcheck-box {
			background-color: #FFFFFF;
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
					width: 40upx;
					height: 40upx;
					margin: 30upx;
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
				width: 232upx;
				height: 104upx;
				line-height: 104upx;
				text-align: center;
				font-size: 28upx;
				color: #FFFFFF;
				background: #C83732;
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
  .priceBox {
    .iconImg {
      width: 58rpx;
      height: 36rpx;
      margin-right: 10rpx;
    }
  }
</style>
<style scoped>
	.tabsbox /deep/ #u-tab-item-0 {
		position: relative;
	}

	.tabsbox /deep/ #u-tab-item-0::before {
		content: '';
		width: 2rpx;
		height: 30rpx;
		display: block;
		background: #CCCCCC;
		position: absolute;
		right: 0;
		top: 20rpx;
	}

	.swipe-box /deep/ .u-swipe-del {
		align-items: center;
		justify-content: center;
		width: 160rpx !important;
	}

	.swipe-box /deep/ .u-btn-text {
		width: 60rpx;
		height: 60rpx;
		display: block;
		background: url("../../static/images/delIcon.png") no-repeat center center;
		background-size: contain;
	}
  .swipeBox /deep/ .u-swipe-action {
    margin: 20rpx;
    padding: 20rpx;
    margin-top: 0;
  }
</style>
