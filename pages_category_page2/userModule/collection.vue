<template>
	<view class="collection-box">
    <global-loading />
		<view class="tabsbox">
			<u-tabs :list="collectionTypeList" bar-width="60" :bold="false" active-color="#333333"
				inactive-color="#CCCCCC" :is-scroll="false" :current="collectionTypeFlag"
				@change="collectionTypeActive"></u-tabs>
		</view>
		<view v-if="collectionTypeFlag == 0">
			<view v-if="productCollect.length>0">
				<view class="wid function-box">
					<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
					<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
						<image class="editicon" src="https://ceres.zkthink.com/static/images/collectionEditicon.png">
						</image>
						<text class="mar-left-10">编辑</text>
					</view>
				</view>
				<view class="swipe-box">
					<view class="actionBox" v-for="(item, index) in productCollect" :key="item.collectId"
						:index="index">
						<u-swipe-action :disabled="allCheckShow" :ref="getActionSwipeRefs" :show="item.show" :autoClose="false" @open="productOpen(index)"
							@click="productActionClick" :options="options">
							<!-- :disabled="allCheckShow" -->
							<view class="flex-item" @click.stop="toGoodsDetails(item.productId,item.shopId,item.skuId)">
								<view class="item wid flex-row-plus flex-display">
									<view class="flex-items selctBtn" v-show="allCheckShow">
										<image mode="aspectFill" v-if="item.selected == 1"
											@click.stop="productItemSel(index,0)"
											src="https://ceres.zkthink.com/static/images/selectActive.png"
											class="cart-select-img"></image>
										<image mode="aspectFill" v-else @click.stop="productItemSel(index,1)"
											src="https://ceres.zkthink.com/static/images/selectEmpty.png"
											class="cart-select-img"></image>
									</view>
									<view class="infoCent flex-items">
										<image class="product-img default-img" mode="aspectFill" :src="item.image" />
										<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
										<view class="title-wrap mar-left-20 priceBox">
											<text
												class="title u-line-2 fs28 font-color-333">{{ item.productName }}</text>
											<view class="flex-items">
												<!-- <image v-if="item.activityType" class="iconImg mar-right-10"
													:src="imgs[item.activityType]"></image> -->
													<image v-if="item.activityType===1" class="iconImg" src="https://ceres.zkthink.com/static/images/groupBuyIcon.png" alt="拼团icon"></image>
													<image v-if="item.activityType === 2" class="iconImg"  src="https://ceres.zkthink.com/static/images/spikeIcon.png" alt="秒杀活动"></image>
													<image v-if="item.activityType === 3" class="iconImg discountIcon" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-03-14/38184785db4b4fbca767ada611097ae9_discount.png" alt="限时折扣活动"></image>
													<image v-if="item.activityType === 4" class="iconImg" src="https://ceres.zkthink.com/static/images/spikeIcon.png" alt="平台秒杀"></image>
													<image v-if="item.activityType===5" class="iconImg" src="https://ceres.zkthink.com/static/images/discountListIcon.png" alt="平台折扣"></image>
													<image v-if="item.activityType===9" class="iconImg" src="https://ceres.zkthink.com/static/images/memberCenterIcon.png" alt="会员价"></image>
													<image v-if="item.activityType === 8" class="iconImg" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/d0d8d96f28904167b271de4ae924d1a8_sceneMarketing.png" alt="场景营销"></image>
												<text class="fs40 font-color-C83732">¥</text>
												<text class="fs40 font-color-C83732 mar-right-20">{{item.price}}</text>
												<text
													class="font-color-CCC discountsPriceLine fs24">¥{{item.originalPrice}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</u-swipe-action>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllProCheck"
							src="https://ceres.zkthink.com/static/images/selectActive.png" class="cart-select-img"
							@click="allProductSel(0)"></image>
						<image mode="aspectFill" v-else src="https://ceres.zkthink.com/static/images/selectEmpty.png"
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
				<image class="collect-empty" src="https://ceres.zkthink.com/static/images/collectEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无收藏</view>
			</view>
		</view>
		<view v-if="collectionTypeFlag == 1">
			<view v-if="storeCollect.length>0">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="https://ceres.zkthink.com/static/images/collectionEditicon.png">
					</image>
					<text class="mar-left-10">编辑</text>
				</view>
				<view class="swipe-box swipeBox">
					<view class="shopBox" v-for="(item, index) in storeCollect" :key="item.collectId" :index="index">
						<u-swipe-action :ref="getShopActionSwipeRefs" :disabled="allCheckShow" :show="item.show" :options="options" @click="storeActionClick(index)"
							@open="storeOpen(index)">
							<view class="item wid flex-row-plus flex-display">
								<view v-show="allCheckShow" class="selctBtn flex-items">
									<image mode="aspectFill" v-if="item.selected == 1"
										@click.stop="storeItemSel(index,0)"
										src="https://ceres.zkthink.com/static/images/selectActive.png"
										class="cart-select-img"></image>
									<image mode="aspectFill" v-else @click.stop="storeItemSel(index,1)"
										src="https://ceres.zkthink.com/static/images/selectEmpty.png"
										class="cart-select-img"></image>
								</view>
								<view class="infoCent">
									<view class="flex-row-plus flex-sp-between flex-items-plus wid">
										<view class="flex-items-plus flex-row pad-topbot-10">
											<image class="head-img" mode="aspectFill" :src="item.shopLogo" />
											<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
											<view class="title-wrap mar-left-20">
												<text class="title u-line-2 shopName">{{ item.shopName }}</text>
												<text class="font-color-CCC fs24">{{item.person}}人关注</text>
											</view>
										</view>
										<view class="toStore flex-items-plus fs24" @click="toStoreClick(item.shopId)">
											进入店铺
											<image src="https://ceres.zkthink.com/static/images/arrowR.png"></image>
										</view>
									</view>
									<view class="shopImgBox"  v-if="item.productList.length>0">
										<view class="itemImgBox" v-for="(sItem, sIndex) of item.productList"
											:key="sIndex"
											@click.stop="goodsDateils(sItem.shopId,sItem.productId,sItem.skuId)">
											<image :src="sItem.image" class="pic-img default-img"></image>
										</view>
									</view>
								</view>
							</view>
						</u-swipe-action>
					</view>
				</view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllStoreCheck"
							src="https://ceres.zkthink.com/static/images/selectActive.png" class="cart-select-img"
							@click="allStoreSel(0)"></image>
						<image mode="aspectFill" v-else src="https://ceres.zkthink.com/static/images/selectEmpty.png"
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
				<image class="collect-empty" src="https://ceres.zkthink.com/static/images/collectEmpty.png"></image>
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
					是否删除该商品？
				</view>
				<view v-if="shopDelSubmit" class="mar-top-40 text-align">
					是否删除该店铺？
				</view>
				<view class="flex-display flex-sp-between">
					<view class="btn submit" v-if="paoductDelSubmit" @click="paoductDel">确定</view>
					<view class="btn submit" v-if="shopDelSubmit" @click="shopDel">确定</view>
				</view>
			</view>
			<view v-if="cardModal" @click="cardModal = false" class="cancelDel">
				<image src="https://ceres.zkthink.com/static/images/cancelClose.png" mode=""></image>
			</view>
		</tui-modal>
	</view>
</template>

<script setup>
import tuiModal from "@/components/modal/modal";
import { request } from "@/utils/request";
import API from "@/config/api";
import { ref } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";

const imgs = ref([
  'https://ceres.zkthink.com/static/images/groupBuyIcon.png',
  'https://ceres.zkthink.com/static/images/spikeIcon.png',
  'https://ceres.zkthink.com/static/images/discountListIcon.png',
  'https://ceres.zkthink.com/static/images/spikeIcon.png',
  'https://ceres.zkthink.com/static/images/discountListIcon.png',
])
    const collectionTypeList = ref([{
  name: '商品'
}, {
  name: '店铺'
}])
    const collectionTypeFlag=ref(0)
    const disabled = ref(false)
    const btnWidth = ref(180)
    const show = ref(false)
    const options = ref([{
  text: ' ',
  style: {
    backgroundColor: '#F15C48'
  }
}])

    const isAllProCheck=ref(false);
    const isAllStoreCheck=ref(false);
    const allCheckShow=ref(false);
    const productCollect=ref([]);
    const storeCollect=ref([]);
    const productPage=ref(1);
    const productPageSize=ref(10);
    const proloadingType=ref(0);
    const storePage=ref(1);
    const storePageSize=ref(10);
    const storeloadingType=ref(0);
    const storeCollectShow=ref(false);
    const proCollectShow=ref(false);
    const cardModal=ref(false);
    const paoductDelSubmit=ref(false);
    const shopDelSubmit=ref(false);
    const ids=ref(null);
    const currentIndex=ref(null);
    const currentType=ref(null)

onLoad(()=>{
  getProductCollect()
})
onReachBottom(()=>{
  if (collectionTypeFlag.value == 0) {
    if (proloadingType.value == 1) {
      uni.stopPullDownRefresh()
    } else {
      productPage.value = productPage.value + 1
      getProductCollect()
    }
  } else if (collectionTypeFlag.value == 1) {
    if (storeloadingType.value == 1) {
      uni.stopPullDownRefresh()
    } else {
      storePage.value = storePage.value + 1
      getStoreCollect()
    }
  }
})


//批量删除
function showCardModalPaoductDel() {
  let isShowProoductDelSubmit = false
  // 商品
  productCollect.value.forEach((value, index) => {
    if (value.selected == 1) {
      isShowProoductDelSubmit = true
    }
  })
  if (isShowProoductDelSubmit === true) {
    cardModal.value = true
    paoductDelSubmit.value = true
    shopDelSubmit.value = false
  } else {
    uni.showToast({
      title:`请先选择要删除的收藏宝贝！`,
      icon:'none'
    })
  }
}

function paoductDel() {
  if (currentType.value === 1) {
    cancelCollect(ids.value)
    productCollect.value.splice(currentIndex.value, 1);
  } else {
    let ids = []
    productCollect.value.forEach((value, index) => {
      if (value.selected == 1) {
        ids.push(value.collectId)
      }
    })
    request(API.deleteCollect, {
      ids: ids
    }, 'POST').then(res => {
      productCollect.value = []
      cardModal.value = false
      uni.showToast({
        title:`删除成功`,
        icon:'none'
      })
      productPage.value = 1
      getProductCollect()
    }).catch(res => {
      cardModal.value = false
      uni.showToast({
        title:`删除失败`,
        icon:'none'
      })
      throw Error(res)
    })
  }
}

function showCardModalshopDel() {
  let isShowShopDelSubmit = false
  // 店铺
  storeCollect.value.forEach((value, index) => {
    if (value.selected == 1) {
      isShowShopDelSubmit = true
    }
  })
  if (isShowShopDelSubmit === true) {
    cardModal.value = true
    shopDelSubmit.value = true
    paoductDelSubmit.value = false
  } else {
    uni.showToast({
      title:`请先选择要删除的收藏店铺`,
      icon:'none'
    })
  }
}

function shopDel() {
  if (currentType.value === 2) {
    cancelCollect(ids.value)
    storeCollect.value.splice(currentIndex, 1);
  } else {
    console.log('删除')
    let ids = []
    storeCollect.value.forEach((value, index) => {
      if (value.selected == 1) {
        ids.push(value.collectId)
      }
    })
    request(API.deleteCollect, {
      ids: ids
    }, 'POST').then(res => {
      storeCollect.value = []
      cardModal.value = false
      uni.showToast({
        title:`删除成功`,
        icon:'none'
      })
      storePage.value = 1
      getStoreCollect()
    }).catch(res => {
      cardModal.value = false
      uni.showToast({
        title:`删除失败`,
        icon:'none'
      })
      throw Error(res)
    })
  }
}

//去店铺
function toStoreClick(storeId) {
  uni.navigateTo({
    url: '../../pages_category_page1/store/index?storeId=' + storeId
  })
}

//去商品详情
function toGoodsDetails(productId, shopId, skuId) {
  uni.navigateTo({
    url: '../../pages_category_page1/goodsModule/goodsDetails?productId=' + productId +
        '&shopId=' + shopId + '&skuId=' + skuId
  })
}

function collectionTypeActive(index) {
  collectionTypeFlag.value = index
  if (index == 0) {
    productPage.value = 1
    productCollect.value = []
    proloadingType.value = 0
    getProductCollect()
  } else if (index == 1) {
    storePage.value = 1
    storeCollect.value = []
    storeloadingType.value = 0
    getStoreCollect()
  }
}
function storeClick(index, index1) {
  if (index1 == 0) {
    cardModal.value = true
    shopDelSubmit.value= true
    ids.value = storeCollect.value[index].collectId
    currentIndex.value = index
    currentType.value = 2
  }
}

// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
function productOpen(index) {
  // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
  // 原本为'false'，再次设置为'false'会无效
  productCollect.value[index].show = true;
  // console.log(productCollect,index)

  productCollect.value.map((val, idx) => {
    if (index != idx) productCollect.value[idx].show = false;
  })
  // 商品删除参数
  ids.value = productCollect.value[index].collectId
  currentIndex.value = index
  currentType.value = 1
}
// 打开删除层
function productActionClick() {
  console.log('打开')
  cardModal.value = true
  paoductDelSubmit.value = true
  shopDelSubmit.value = false
}

function storeOpen(index) {
  // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
  // 原本为'false'，再次设置为'false'会无效
  storeCollect.value[index].show = true;
  storeCollect.value.map((val, idx) => {
    if (index != idx) storeCollect.value[idx].show = false;
  })

  // 店铺删除参数
  ids.value = storeCollect.value[index].collectId
  currentIndex.value = index
  currentType.value = 2
}
// 打开删除层
function storeActionClick() {
  cardModal.value = true
  paoductDelSubmit.value = false
  shopDelSubmit.value = true
}
//商品选中
function productItemSel(index, number) {
  productCollect.value[index].selected = number
  let proSelectNum = 0
  productCollect.value.forEach((value, index) => {
    if (productCollect.value[index].selected == 0) {
      isAllProCheck.value = false
    } else {
      proSelectNum++
    }
  })
  if (productCollect.value.length == proSelectNum) {
    isAllProCheck.value = true
  }
}

//店铺选中
function storeItemSel(index, number) {
  storeCollect.value[index].selected = number
  let storeSelectNum = 0
  storeCollect.value.forEach((value, index) => {
    if (storeCollect.value[index].selected == 0) {
      isAllStoreCheck.value = false
    } else {
      storeSelectNum++
    }
  })
  if (storeCollect.value.length == storeSelectNum) {
    isAllStoreCheck.value = true
  }
}
//全选
function allProductSel(type) {
  isAllProCheck.value = !isAllProCheck.value
  productCollect.value.forEach((value, index) => {
    productCollect.value[index].selected = type
  })
}
function allStoreSel(type) {
  isAllStoreCheck.value = !isAllStoreCheck.value
  storeCollect.value.forEach((value, index) => {
    storeCollect.value[index].selected = type
  })
}

const actionSwipe = ref([])
const getActionSwipeRefs = (e)=>{
  actionSwipe.value.push(e)
}

const shopActionSwipe = ref([])
const getShopActionSwipeRefs = (e)=>{
  shopActionSwipe.value.push(e)
}
function editClick() {
  allCheckShow.value = true
  let ActionSwipe = actionSwipe.value;
  let ShopActionSwipe = shopActionSwipe.value;
  if(ActionSwipe.length>0){
    ActionSwipe.forEach(item=>item.close())
  }
  if(ShopActionSwipe.length>0){
    ShopActionSwipe.forEach(item=>item.close())
  }
}
function finishClick() {
  allCheckShow.value = false
}
//收藏商品查询
function getProductCollect() {
  // uni.showLoading({
  // 	mask: true,
  // 	title: '加载中...'
  // })
  request(API.getProductCollect, {
        page: productPage.value,
        pageSize: productPageSize.value
      },
      'GET').then(res => {
    if (res.data.list.length == 0) {
      proCollectShow.value = true
      proloadingType.value = 1
    } else {
      productCollect.value = productCollect.value.concat(res.data.list)
      productCollect.value.forEach((value, index) => {
        value['show'] = false
        value['selected'] = 0
      })
    }
  }).catch(res => {
    uni.showToast({
      title: '收藏商品查询失败',
      icon: "none"
    })
    throw Error(res)
  })
}

//收藏店铺查询
function getStoreCollect() {
  request(API.getStoreCollect, {
        page: storePage.value,
        pageSize: storePageSize.value
      },
      'GET').then(res => {
    if (res.data.list.length == 0) {
      storeCollectShow.value = true
      storeloadingType.value = 1
    }
    storeCollect.value = storeCollect.value.concat(res.data.list)
    storeCollect.value.forEach((value, index) => {
      value['show'] = false
      value['selected'] = 0
    })
  }).catch(res => {
    uni.showToast({
      title: '失败',
      icon: "none"
    })
    throw Error(res)
  })
}
//取消收藏
function cancelCollect(idss) {
  request(API.cancelCollect, {
    ids: [idss]
  }, 'POST').then(res => {
    uni.showToast({
      title: '删除成功',
      icon: "none"
    })
    cardModal.value = false
    currentType.value = null
    currentIndex.value = null
    ids.value = null
    if (res.code == "200") {
      productCollect.value = []
      storeCollect.value = []
      getStoreCollect()
      getProductCollect()
    } else {
      uni.showToast({
        title: res.message,
        icon: "none"
      })
    }
  }).catch(res => {
    uni.showToast({
      title: '失败',
      icon: "none"
    })
    throw new Error(res)
  })
}
//商品详情
function goodsDateils(shopId, productId, skuId) {
  uni.navigateTo({
    url: '/pages_category_page1/goodsModule/goodsDetails?shopId=' + shopId + '&productId=' +
        productId + '&skuId=' + skuId
  })
}

</script>

<style lang="scss" scoped>
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
			padding: 0 20rpx;

			.actionBox {
				margin-bottom: 20rpx;
			}

			.item {
				display: flex;

				.infoCent {
					padding: 20rpx;
				}

				.selctBtn {
					background: #F7F7F7;
				}
			}

			.shopImgBox {
				display: flex;
				justify-content: flex-end;
				margin-left: 90rpx;
				padding-bottom: 20rpx;
				margin-top: 20rpx;

				.itemImgBox {
					margin-right: 15rpx;
					margin-left: 5rpx;

					image {
						width: 120rpx;
						height: 120rpx;
						border: 2rpx solid #F3F4F5;
					}
				}
			}

			.product-img {
				width: 220rpx;
				flex: 0 0 220rpx;
				height: 220rpx;
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
				height: 165rpx;
				padding-right: 20rpx;
			}

			.shopName {
				height: auto;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				width: 340rpx;
			}

			.cart-select-img {
				width: 40upx;
				height: 40upx;
				margin: 0upx 30upx 0upx;
				box-sizing: border-box;
			}

			.toStore {
				width: 100px;
				color: #FFEBC4;
				padding: 0rpx 20rpx;
				height: 52rpx;
				background: #333333;
				margin-right: 15rpx;

				image {
					width: 10rpx;
					height: 18rpx;
					margin-left: 10rpx;
				}
			}

			.shopBox {
				margin-bottom: 20rpx;
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
		.discountIcon{
			width: 100rpx;
		}
	}
</style>
<style scoped>
	.tabsbox /deep/ #u-tab-item-0 {
		position: relative;
	}

	.tabsbox /deep/ .u-tab-bar {
		background-color: #c5aa7b !important;
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
		background: url("https://ceres.zkthink.com/static/images/delIcon.png") no-repeat center center;
		background-size: contain;
	}
</style>
<style>
	page {
		background-color: #F7F7F7;
	}
</style>
