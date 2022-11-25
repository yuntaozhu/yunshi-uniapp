<!-- 订单中心 -->
<template>
  <view class="container">
    <global-loading />
    <Skeleton
        el-color="#efefef"
        bg-color="#fff"
        :loading="loading"
        :animation="true"
    />
    <view style="padding-bottom:68upx;">
      <u-sticky
          bg-color="#fff"
      >
        <u-tabs
            class="tabs"
            :list="tabList"
            disabled
            :is-scroll="false"
            active-color="#C5AA7B !important"
            :current="tabCurrentType"
            @change="handleTabChange"
        />
      </u-sticky>
      <view class="order-list-box u-skeleton">
        <view
            class="item ske-loading u-skeleton-fillet"
            v-for="(orderItem, orderIndex) in list"
            :key="orderIndex"
        >
          <view class="order-list-top">
            <view
                class="top-l"
                @click.stop="goShop(orderItem.shopId)"
            >
              <image
                  :src="orderItem.shopLogo"
                  class="shop-img"
              />
              <text class="shop-name">{{ orderItem.shopName }}</text>
              <image
                  src="https://ceres.zkthink.com/static/images/arrowRight.png"
                  class="arrow-img"
              />
            </view>
            <view class="order-status">
              {{ getOrderStatusLabel(orderItem.state, orderItem.returnType) }}
            </view>
          </view>
          <view
              class="order-info-box"
              @click="goOrderDesc(orderItem)"
          >
            <view class="order-info">
              <view
                  class="order-info-item"
                  v-for="(skuItem, skuIndex) in orderItem.skus"
                  :key="skuIndex"
              >
                <image
                    :src="skuItem.image"
                    class="product-img default-img"
                />
                <view class="info-box">
                  <text class="product-name">{{ skuItem.productName }}</text>
                  <view class="product-sku">{{ skuItem.value }}</view>
                  <view class="price-sku-box">
                    <view class="box-h flex-items-plus">
                      <text class="product-price">
                        <text
                            class="fuhao"
                        >￥
                        </text>
                        {{ skuItem.price }}
                      </text>
                      <text class="product-num">x {{ skuItem.number }}</text>
                    </view>
                    <view
                        v-if="skuItem.commentId === 0 && orderItem.state === 4"
                        class="evaluate"
                        @click.stop="goEvaluate(skuItem,orderItem.orderId)"
                    >立即评价
                    </view>
                    <view
                        v-if="skuItem.commentId !== 0 && orderItem.state === 4 && orderItem.skus[0].ifAdd !== 1"
                        class="evaluate2"
                        @click.stop="goAdditionalEvaluation(orderIndex,skuItem.commentId)"
                    >追加评价
                    </view>
                  </view>
                </view>
              </view>
              <view class="total-price-box">
                总价¥{{
                  (orderItem.orderPrice + orderItem.logisticsPrice).toFixed(2)
                }},优惠¥{{ orderItem.discountPrice }}
                <span v-if="orderItem.price > 0">
                      ，{{ orderItem.state === 1 ? '应付¥' : '实付¥' }}{{ orderItem.price }}
                    </span>
              </view>
            </view>
            <view
                class="btnBox flex-items"
                :class="{flexSpBetween: orderItem.state===5 || orderItem.state === 9}"
            >
              <view
                  class="delIcon"
                  v-if="orderItem.state===5 || orderItem.state === 9"
                  @click.stop="handleDeleteOrder(orderItem)"
              ></view>
              <view class="order-btn-box">
                <text
                    :class="['btn',buttonItem.className] "
                    v-for="buttonItem in getOrderOptionButtonObj(orderItem)"
                    :key="buttonItem.name"
                    @click.stop="handleOrderOptionButtonEvent(buttonItem)"
                >
                  {{ buttonItem.name }}
                </text>
              </view>
            </view>
          </view>
        </view>
        <NoMore :show="!isEmpty && list.length >=listTotal" />
        <Empty
            :show="isEmpty"
            icon-url="https://ceres.zkthink.com/static/images/emptyOrderImg.png"
        >您还没有订单哦~
        </Empty>
      </view>
    </view>
    <!-- 支付 -->
    <u-popup
        v-model="payObj.showPayPopup"
        border-radius="15"
        closeable
        mode="bottom"
    >
      <view class="pay-list-content">
        <CashierList
            :total-price="payObj.totalPrice"
            @change="handleChangePayItem"
        />
        <view
            class="pay-confirm-btn"
            @click="handleGoPay"
        >确认
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import CashierList from "../../components/CashierList";
import AliHbPay from "../../components/AliHbPay";
import NoMore from "../../components/NoMore";
import Empty from "../../components/Empty";
import { orderTabList, orderTypeEnum } from "./config/orderConfig";
import { handleDoPay } from "../../utils/payUtil";
import Skeleton from "../../components/Skeleton";

const NET = require('../../utils/request')
const API = require('../../config/api')

export default {
  components: {
    AliHbPay,
    NoMore,
    Empty,
    CashierList,
    Skeleton
  },
  data() {
    return {
      loading: false,
      orderState: '',// 订单类型（params参数）
      page: 1,
      pageSize: 20,
      list: [{}, {}, {}, {}, {}, {}],
      listTotal: 0, // 用户订单总数
      isEmpty: false, // 列表是否为空
      tabList: orderTabList, // 顶部tabs
      tabCurrentType: 0,// 选中tab的索引
      // 支付相关
      payObj: {
        showPayPopup: false,
        totalPrice: 0,
        payInfo: {}
      },
    }
  },
  onLoad(options) {
    if (options.type) {
      this.tabCurrentType = options.type
      this.orderState = options.type
    }
    this.handleRefreshList()
  },
  onShow(){
    console.log("show")
    // #ifdef H5
    const pageList = getCurrentPages();//获取应用页面栈
    const {options} = pageList[pageList.length - 1];//获取当前页面信息
    if (options.type) {
      this.tabCurrentType = options.type
      this.orderState = options.type
    }
    this.handleRefreshList()
    // #endif
  },
  onReachBottom() {
    ++this.page
    this.handleGetOrderList()
  },
  onBackPress(e) {
    if (e && e.from === 'navigateBack') {
      return false;
    }
    this.goUserIndex();
    return true;
  },
  methods: {
    /**
     * 重新加载列表
     */
    async handleRefreshList() {
      this.loading = true
      this.page = 1
      this.list = [{}, {}, {}, {}, {}, {}]
      this.isEmpty = false
      await this.handleGetOrderList()
    },


    /**
     * 切换tab
     * @param tabIndex
     */
    async handleTabChange(tabIndex) {
      if(this.loading)return
      this.tabCurrentType = tabIndex;
      this.orderState = this.tabList[tabIndex].number
      await this.handleRefreshList()
    },

    /**
     * 获取列表数据
     * @return {Promise<void>}
     */
    async handleGetOrderList() {
      this.$showLoading()
      this.orderState === 0 ? this.orderState = '' : undefined
      try {
        const params = {
          state: this.orderState,
          page: this.page,
          pageSize: this.pageSize
        }
        const {data: {list, total}} = await NET.request(API.FindOrderList, params, 'GET')
        this.listTotal = total
        this.list = this.list.concat(list)
        this.list = this.list.filter(item => JSON.stringify(item) !== '{}')
        if (this.list.length === 0) {
          this.isEmpty = true
        }
      } finally {
        this.loading = false
        this.$hideLoading()
      }
    },


    /**
     * 根据订单状态获取状态label
     * @param state
     * @param returnType 是否退款1是
     * @return {string}
     */
    getOrderStatusLabel(state, returnType = 0) {
      if (returnType) return '退款中'
      return orderTypeEnum[state]
    },

    /**
     * 根据订单Item获取按钮信息
     * @param orderItem
     * @return *[]
     */
    getOrderOptionButtonObj(orderItem) {
      const {state, returnType, afterState, skus, collageId} = orderItem
      const orderNeedBtnList = [] // 订单应有的btn
      // 取消订单
      if ([1, 6].includes(state)) {
        orderNeedBtnList.push({
          name: '取消订单',
          className: 'l',
          functionName: 'handleCancelOrder',
          functionParams: [orderItem]
        })
      }
      // 立即付款
      if (state === 1) {
        orderNeedBtnList.push({
          name: '立即付款',
          className: 'r',
          functionName: 'handlePayOrder',
          functionParams: [orderItem]
        })
      }
      // 申请售后
      if ([2, 3, 4].includes(state) && [0, 6].includes(Number(afterState)) && skus[0].ifAdd !== 1) {
        orderNeedBtnList.push({
          name: '申请售后',
          className: 'l',
          functionName: 'goAfterSalesService',
          functionParams: [orderItem]
        })
      }
      // 查看物流
      if ([3, 4].includes(state)) {
        orderNeedBtnList.push({
          name: '查看物流',
          className: 'l',
          functionName: 'goLogisticsInformation',
          functionParams: [orderItem]
        })
      }
      // 确认收货
      if ([3].includes(state)) {
        orderNeedBtnList.push({
          name: '确认收货',
          className: 'r',
          functionName: 'handleConfirmReceipt',
          functionParams: [orderItem]
        })
      }
      // 退款详情
      if ([1].includes(returnType)) {
        orderNeedBtnList.push({
          name: '退款详情',
          className: 'l',
          functionName: 'goRefundDetail',
          functionParams: [orderItem]
        })
      }
      // 邀请拼单
      if ([6].includes(state)) {
        orderNeedBtnList.push({
          name: '邀请拼单',
          className: 'r',
          functionName: 'goSpellGroup',
          functionParams: [orderItem]
        })
      }
      // 再次开团 | 再次购买
      if ([5].includes(state)) {
        orderNeedBtnList.push({
          name: collageId !== 0 ? '再次开团' : '再次购买',
          className: 'r',
          functionName: 'handleBuyAgainEvent',
          functionParams: [orderItem]
        })
      }
      return orderNeedBtnList
    },

    /**
     * 处理订单btn事件
     * @param buttonItem 由getOrderOptionButtonObj生成的item项
     */
    handleOrderOptionButtonEvent(buttonItem) {
      const {functionName, functionParams} = buttonItem
      if (this[functionName]) {
        this[functionName](...functionParams)
      } else {
        throw new Error(`${ buttonItem.name }的function在本VM中不存在`)
      }
    },

    /**
     * 取消订单
     * @param orderItem
     */
    handleCancelOrder(orderItem) {
      const modalOptions = {
        title: '温馨提示',
        content: '您确定要取消该订单吗？',
        confirmText: '确定取消',
        cancelText: '点错了',
        success: ({confirm}) => {
          confirm ? this.handleDoCancel(orderItem) : undefined
        }
      }
      uni.showModal(modalOptions)
    },

    /**
     * 确定取消订单
     * @param orderItem
     * @return {Promise<void>}
     */
    async handleDoCancel(orderItem) {
      this.$showLoading()
      try {
        await NET.request(API.CancelOrder, {
          orderId: orderItem.orderId
        }, 'POST')
        await this.handleRefreshList()
        uni.showToast({
          icon: 'none',
          title: '取消成功'
        })
      } finally {
        this.$hideLoading()
      }
    },

    /**
     * 确认收货
     * @param orderItem
     */
    handleConfirmReceipt(orderItem) {
      const modalOptions = {
        title: '温馨提示',
        content: '确定您已经收到货物，否则会造成财产损失',
        confirmText: '确定收到',
        cancelText: '点错了',
        success: ({confirm}) => {
          confirm ? this.handleDoConfirmReceipt(orderItem) : undefined
        }
      }
      uni.showModal(modalOptions)
    },

    /**
     * 确定确认收货
     * @param orderItem
     * @return {Promise<void>}
     */
    async handleDoConfirmReceipt(orderItem) {
      this.$showLoading()
      const {orderId} = orderItem
      try {
        await NET.request(API.ConfirmReceive, {
          orderId: orderId
        }, 'POST')
        this.tabCurrentType = 4;
        this.orderState = 4
        await this.handleRefreshList()
        uni.showToast({
          icon: 'none',
          title: '收货成功'
        })
      } finally {
        this.$hideLoading()
      }
    },

    /**
     * 删除订单
     * @param orderItem
     */
    handleDeleteOrder(orderItem) {
      const modalOptions = {
        title: '温馨提示',
        content: '您确定要删除该订单吗？',
        confirmText: '确定删除',
        cancelText: '点错了',
        success: ({confirm}) => {
          confirm ? this.handleDoDeleteOrder(orderItem) : undefined
        }
      }
      uni.showModal(modalOptions)
    },

    /**
     * 确定删除订单
     * @param orderItem
     */
    async handleDoDeleteOrder(orderItem) {
      this.$showLoading()
      const {orderId} = orderItem
      try {
        await NET.request(API.DelOrder, {orderId}, 'POST')
        await this.handleRefreshList()
        uni.showToast({
          icon: 'none',
          title: '删除成功'
        })
      } finally {
        this.$hideLoading()
      }

    },

    /**
     * 再次购买 || 再次拼团
     * @param orderItem
     */
    handleBuyAgainEvent(orderItem) {
      const {skus, shopId, collageId} = orderItem
      // 判断拼团ID是否为0
      if (collageId !== 0) {
        // 拼团直接跳回商品详情
        const path = `../goodsModule/goodsDetails`
        const params = {
          productId: skus[0].productId,
          shopId,
          skuId: skus[0].skuId
        }
        this.$jump(path, params)
      } else {
        // 跳转详情
        this.goBuyAgain(orderItem)
      }
    },

    /**
     * 处理选择支付方式
     * @param params
     */
    handleChangePayItem(params) {
      const {payObj: {payInfo}} = this
      payInfo.paymentMode = params.paymentMode
      payInfo.huabeiPeriod = params.huabeiPeriod
    },

    /**
     * 处理下单支付
     * @param orderItem
     * @return {Promise<void>}
     */
    async handlePayOrder(orderItem) {
      const {orderPrice, collageId, orderId} = orderItem
      const {payObj} = this
      payObj.totalPrice = orderPrice
      payObj.payInfo = {
        collageId: collageId,
        money: orderPrice,
        orderId: orderId,
        type: 2
      }
      payObj.showPayPopup = true
    },

    /**
     * 处理支付（选择支付方式以后）
     */
    async handleGoPay() {
      const {payObj} = this
      await handleDoPay(this.payObj.payInfo)
      payObj.showPayPopup = false
      payObj.totalPrice = 0
      payObj.payInfo = {}
    },

    /**
     * 去物流信息
     * @param orderItem
     */
    goLogisticsInformation(orderItem) {
      const {express, deliverFormid} = orderItem
      const url = `logisticsInfo?express=${ express }&deliverFormid=${ deliverFormid }`
      this.$jump(url)
    },

    /**
     * 跳转再次购买
     * @param orderItem
     * @return {Promise<void>}
     */
    async goBuyAgain(orderItem) {
      // 循环sku，获取商品详情，并且判断库存
      const postAjax = []
      orderItem.skus.forEach(skuItem => {
        postAjax.push(this.queryProductDetail(skuItem))
      })
      // 并发执行
      const skuDetailList = await Promise.all(postAjax);
      let canNotBuyNameList = []
      // 判断库存
      skuDetailList.forEach(skuDetail => {
        for (const skuDetailSkuMapKey in skuDetail.map) {
          // 判断此SKU是否存在于传进来的item
          const orderItemSku = orderItem.skus.find(skuItem => skuItem.skuId === skuDetail.map[skuDetailSkuMapKey].skuId);
          if (!orderItemSku) continue
          const dbSku = skuDetail.map[skuDetailSkuMapKey]
          if (orderItemSku.number > dbSku.stockNumber) {
            canNotBuyNameList.push(orderItemSku.productName)
          }
        }
      })
      // 如果有库存不足
      if (canNotBuyNameList.length > 0) {
        return uni.showToast({
          icon: 'none',
          title: canNotBuyNameList.join(",") + " 库存不足"
        })
      }
      // 制造数据
      const buyInfo = [{
        ifWork: orderItem.ifWork,
        shopId: orderItem.shopId,
        shopName: orderItem.shopName,
        shopDiscountId: orderItem.shopDiscountId,
        shopSeckillId: orderItem.shopSeckillId,
        skus: orderItem.skus
      }]
      uni.setStorageSync('skuItemDTOList', buyInfo)
      uni.navigateTo({
        url: '../orderModule/orderConfirm?type=1',
      })
    },

    /**
     * 获取商品详情
     * @param orderItem
     * @return {Promise<*>}
     */
    async queryProductDetail(orderItem) {
      const {shopId, productId, skuId} = orderItem
      this.$showLoading()
      let postData = {
        shopId,
        productId,
        skuId,
        terminal: 1
      }
      try {
        const res = await NET.request(API.QueryProductDetail, postData, "GET")
        return res.data
      } catch (e) {
        throw new Error(e)
      } finally {
        this.$hideLoading()
      }
    },

    /**
     * 邀请拼单
     * @param orderItem
     */
    goSpellGroup(orderItem) {
      const {collageId, orderId, skus, shopGroupWorkId} = orderItem
      const url = `../goodsModule/inviteSpell?collageId=${ collageId }&orderId=${ orderId }&type=1&productId=${ skus[0].productId }&skuId=${ skus[0].skuId }&shopGroupWorkId=${ shopGroupWorkId }`
      this.$jump(url)
    },

    /**
     * 去用户中心
     */
    goUserIndex() {
      this.$jumpToTabbar('../../pages/tabbar/user/index')
    },

    /**
     * 去退款详情
     * @param orderItem
     */
    goRefundDetail(orderItem) {
      this.$jump(`/pages_category_page2/orderModule/refundDetails?item=${ JSON.stringify(orderItem) }`)
    },

    /**
     * 跳转订单详情
     * @param orderItem
     */
    goOrderDesc(orderItem) {
      this.$jump(`orderDetails`, orderItem)
    },

    /**
     * 跳转店铺
     * @param id
     */
    goShop(id) {
      this.$jump(`../store/index?storeId=${ id }`)
    },

    /**
     * 申请售后
     * @param orderItem
     */
    goAfterSalesService(orderItem) {
      this.$jump(`afterSaleApply?item=${ JSON.stringify(orderItem) }`)
    },

    /**
     * 立即评价
     * @param type
     * @param skuItem
     * @param orderId
     */
    goEvaluate(type, skuItem, orderId) {
      const params = {
        commentData: skuItem,
        orderId
      }
      this.$jump('../goodsModule/evaluate', params)
    },

    /**
     * 追加评价
     * @param orderIndex
     * @param commentId
     */
    goAdditionalEvaluation(orderIndex, commentId) {
      const params = {
        addCommentVOList: this.list[orderIndex],
        commentId,
        type: 1
      }
      this.$jump('../goodsModule/addEvaluate', params)
    }

  }
}
</script>

<style lang="scss">
.tabs {
  position: relative;
  z-index: 9999;
}

page {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}

.nav-box-box {
  height: 88rpx;
  background: #f6f6f6;
  white-space: nowrap;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.nav-box-box .item {
  display: inline-view;
  padding: 0 30rpx;
  box-sizing: border-box;
  height: 88rpx;
  text-align: center;
  line-height: 88rpx;
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
}

.nav-box-box .item.active text {
  display: inline-view;
  color: #ff7911;
  box-sizing: border-box;
  height: 88rpx;
  border-bottom: 2px solid #ff7911;
}

.order-list-box {
  padding: 20rpx 30rpx 0;
  box-sizing: border-box;
}

.order-list-box .item {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
}

.order-list-top {
  height: 96rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.top-l {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.shop-img {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.shop-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.arrow-img {
  margin-left: 15rpx;
  width: 25rpx;
  height: 25rpx;
}

.order-status {
  font-size: 32upx;
  color: #C5AA7B;
  font-weight: 400;
}

.order-info-box {
  padding: 0 30upx;
  box-sizing: border-box;

  .btnBox {
    width: 100%;
    justify-content: flex-end;

    .delIcon {
      width: 40rpx;
      height: 40rpx;
      background: url("https://ceres.zkthink.com/static/images/delListOrder.png") no-repeat center center;
      background-size: contain;
    }
  }

  .flexSpBetween {
    justify-content: space-between;
  }
}

.order-info {
  border-bottom: 1px solid #eee;
}

.order-info-item {
  display: flex;
  flex-direction: row;
  padding: 20upx 0;
}

.product-img {
  width: 180upx;
  height: 180upx;
  margin-right: 30upx;
}

.info-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 26upx;
  color: #333;
  height: 68upx;
  line-height: 34upx;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.price-sku-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.product-sku {
  font-size: 24upx;
  color: #999;
}

.product-price {
  font-size: 28upx;
  color: #333;
  font-weight: 400;
}

.product-price .fuhao {
  font-size: 28upx;
}

.product-num {
  display: inline-view;
  font-size: 28upx;
  margin-left: 20upx;
  color: #999;
}

.total-price-box {
  font-size: 26upx;
  color: #333;
  text-align: right;
  padding: 30upx 0;
}

.order-btn-box {
  padding: 20upx 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.order-btn-box .btn {
  display: inline-view;
  width: 150upx;
  height: 56upx;
  text-align: center;
  line-height: 56upx;
  font-size: 26upx;
  color: #333;
  margin-left: 20upx;
}

.evaluate {
  height: 56upx;
  text-align: center;
  line-height: 56upx;
  font-size: 26upx;
  padding: 0 30upx;
  color: #C5AA7B;
  background: #333333;
}

.evaluate2 {
  height: 56upx;
  text-align: center;
  line-height: 56upx;
  font-size: 26upx;
  padding: 0 30upx;
  background: #333333;
  color: #C5AA7B;
}

.order-btn-box .btn.l {
  border: 2rpx solid #333333;
  color: #333;
}

.order-btn-box .btn.r {
  border: 2rpx solid #C5AA7B;
  color: #C5AA7B;
}

.emptyOrder-box {
  margin-top: 70upx;

  .emptyOrder-img {
    margin-top: 30%;
    width: 216upx;
    height: 152upx;
  }
}

.Put-box1 {
  .btn {
    text-align: center;
    margin-top: 40rpx;
    border: 2rpx solid #333333;
    height: 80rpx;
    line-height: 80rpx;
    width: 240rpx;
    color: #333333;
  }

  .submit {
    background-color: #333333;
    color: #FFEBC4;
  }
}

.pay-list-content {
  width: 100%;
  padding: 60rpx 30rpx 20rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pay-confirm-btn {
    width: 80%;
    height: 88rpx;
    margin-top: 15rpx;
    border-radius: 15rpx;
    color: #fff;
    background-color: #c5aa7b;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
<style scoped>
.container /deep/ .u-tab-item {
  color: #999999 !important;
}
</style>
