<template>
  <!-- 提交订单 -->
  <view v-if="ifShow">
    <view class="content">
      <view class="address-box"
            @click="addAddressTap">
        <image src="https://ceres.zkthink.com/static/images/orderAddress.png"
               class="address-img"></image>
        <!-- 有地址的 -->
        <view class="address-r"
              v-if="userAddressInfo.receiveName">
          <view class="address-name-box">
            <text>{{ userAddressInfo.receiveName }}</text>
            <text class="phone">{{ userAddressInfo.receivePhone }}</text>
          </view>
          <view class="address-info">
            <text>{{ userAddressInfo.receiveAdress }} {{ userAddressInfo.address }}</text>
          </view>
        </view>
        <!-- 没有地址的 -->
        <view class="address-r"
              v-else>
          <text>你还没有收货地址哦，点击这里添加</text>
        </view>
        <image src="https://ceres.zkthink.com/static/images/greyArrow.png"
               class="arrow-right-img"></image>
      </view>
      <view class="order-list-box">
        <view class="item"
              v-for="(item, sIndex) in settlement.shops"
              :key="item.shopId">
          <view class="order-list-top">
            <view class="top-l">
              <image src="https://ceres.zkthink.com/static/images/orderStoreIcon.png"
                     class="shop-img"></image>
              <text class="shop-name">{{ item.shopName }}</text>
            </view>
          </view>
          <view class="order-info-box">
            <view class="order-info">
              <view class="order-info-item"
                    v-for="(cItem, index) in item.skus"
                    :key="cItem.productId">
                <image :src="cItem.image"
                       class="product-img"></image>
                <view class="info-box">
                  <text class="product-name">{{ cItem.productName }}</text>
                  <view class="product-sku">
                    <view v-for="(vItem, index) in cItem.values">
                      <label class="mar-left-20">{{ vItem }}</label>
                    </view>
                  </view>
                  <view class="price-sku-box flex-display flex-sp-between">
                    <view class="product-price">
                      <text class="fuhao">￥</text>
                      {{ cItem.price }}
                    </view>
                    <view class="product-num">x {{ cItem.number }}</view>
                  </view>
                </view>
              </view>
							<view v-if="item.receiveNotMatch" class="adressTips">当前地址不支持配送，可更换其他地址试试</view>
              <view class="delivery-way-box">
                <view>
                  <view class="item">
                    <view class="flex-items">
                      <text>配送方式</text>
                    </view>
                    <view class="flex-row-plus flex-items">
                      <text v-if="item.distribution.distributionPrice > 0">快递 ¥
                                                                           {{ item.distribution.distributionPrice }}
                      </text>
                      <text v-else>快递 免邮</text>
                    </view>
                  </view>
                  <view class="flex-item">
                    <text class="font-color-666 fs24"
                          v-for="(hItem, hIndex) of item.skuDiscountInfoMap">{{ hItem[0] }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
            <view class="discount-item1"
                  v-if="item.shopCoupons.length>0"
                  @click="showShopCoupons(item,sIndex)">
              <view class="discount-label">店铺优惠</view>
              <view class="discount-info-box flex-items">
                <view class="discount-info2"
                      v-if="item.currentCoupon && item.currentCoupon.couponType === 1">
                  -￥{{ item.currentCoupon.reduceMoney }}
                </view>
                <view class="discount-info2"
                      v-if="item.currentCoupon && item.currentCoupon.couponType === 2">
                  {{ item.currentCoupon.reduceMoney }}折券
                </view>
                <image class="discount-img"
                       src="https://ceres.zkthink.com/static/images/arrowRight.png"></image>
              </view>
              <!--							<view class="discount-info-box flex-items" v-else>-->
              <!--								<view class="discount-info1"></view>-->
              <!--								<image class="discount-img" src="https://ceres.zkthink.com/static/images/arrowRight.png"></image>-->
              <!--							</view>-->
            </view>
            <view class="order-total-box">
              <text class="total-num">共{{ item.number }}件</text>
              <text class="total-num ml10">总计</text>
              <text class="total-price ml10"
                    v-if="item.totalNum > 0">
                ¥{{ (parseFloat(item.totalNum) + parseFloat(item.distribution.distributionPrice || 0)).toFixed(2) }}
              </text>
              <text class="total-price ml10"
                    v-else>¥0.00
              </text>
            </view>
          </view>
        </view>

      </view>
      <view class="discount-item"
            @click="showDiscount">
        <view class="discount-label">平台优惠</view>
        <view class="discount-info-box flex-items">
          <view class="discount-info2"
                v-if="promotionInfoDTO.couponId">
            <text v-if="promotionInfoDTO.couponType === 2">{{ promotionInfoDTO.reduceMoney }}折</text>
            <text v-else> -￥{{ promotionInfoDTO.reduceMoney | clip2Decimal }}</text>
          </view>
          <view class="discount-info1"
                v-else-if="couponsList.length<1">无
          </view>
          <view class="discount-info1"
                v-else>不使用
          </view>
          <image class="discount-img"
                 src="https://ceres.zkthink.com/static/images/arrowRight.png"></image>
        </view>
      </view>
      <!--      积分支付-->
      <view class="integralPayBox"
            v-if="integralShow">
        <view class="integralBg">
          <view class="integralTit fs26">可用{{ integralNum }}积分抵扣{{ integralPrice.toFixed(2) }}元</view>
          <view class="maxIntegral">
            <checkbox-group @change="changeIntegral"
                            style="width: 50rpx">
              <checkbox style="transform:scale(0.7);"
                        class="integralCheckbox"
                        color="#C5AA7B"
                        value="1"
                        :checked="selectIntegral"/>
            </checkbox-group>
          </view>
        </view>
      </view>
      <view class="pay-type-item">
        <radio-group @change="payTypeChange">
          <view class="pay-type-radio"
                v-if="showWechatPayType">
            <view class="pay-type-img">
              <image class="pay-type-img-inner"
                     src="https://ceres.zkthink.com/static/images/wechat_pay.png"
                     mode="widthFix"/>
            </view>
            <label class="pay-type-label">微信支付</label>
            <radio class="pay-type-radio-item"
                   style="transform:scale(0.7)"
                   value="1"
                   :checked="paymentMode == 1"/>
          </view>
          <view class="pay-type-radio"
                v-if="showAlipayPayType">
            <view class="pay-type-img">
              <image class="pay-type-img-inner"
                     src="https://ceres.zkthink.com/static/images/alipay.png"
                     mode="widthFix"/>
            </view>
            <label class="pay-type-label">支付宝支付</label>
            <radio class="pay-type-radio-item"
                   style="transform:scale(0.7)"
                   value="2"
                   :checked="paymentMode == 2"/>
          </view>
          <view class="pay-type-radio"
                v-if="showHuabeiPayType">
            <view class="pay-type-img">
              <image class="pay-type-img-inner"
                     src="https://ceres.zkthink.com/static/images/huabei.png"
                     mode="widthFix"/>
            </view>
            <label class="pay-type-label">花呗分期</label>
            <radio class="pay-type-radio-item"
                   style="transform:scale(0.7)"
                   value="3"
                   :checked="paymentMode == 3"/>
            <view class="huabei-detail"
                  v-if="huabeiDetail"
                  @click="showHuabeiDetail">
              <view>
                <label class="fenqi-wenzi">花呗分期</label>
                <label class="fenqi-charge-fee">手续费 ￥{{ chargeFee|clip2Decimal }}</label>
              </view>
              <label class="fenqi-amount">分期总额 ￥{{ totalPrice | clip2Decimal }}</label>
              <img class="fenqi-modal"
                   src="https://ceres.zkthink.com/static/images/arrowRight.png"/>
            </view>
          </view>
        </radio-group>
      </view>
      <view class="order-flow-box">
        <view class="flow-word">交易流程：</view>
        <view class="flow-word mt25">
          <text>1、填写收货信息并完成支付</text>
          <text>2、双方根据物品的交易方式进行交易</text>
          <text>3、拿到物品，交易结束</text>
        </view>
        <!--        实付款不含邮费，涉及邮寄双方协定好费用，提醒发起人修改价格再完成支付；-->
        <view class="flow-word mt50">注：应国家邮政总局的要求，即日起涉及到个人快递包裹必须收件人实名制，否则将影响到收寄配送。请避免使用「先生，男士，小姐，女士，昵称」等模糊称谓。</view>
      </view>
    </view>
    <view class="order-confirm-box"
          style="padding-bottom:30upx;">
      <view class="flex-items flex-sp-between">
        <text class="num-box">共{{ totalCount }}件</text>
        <view>
          <text class="total">合计：</text>
          <text v-if="totalPrice>0"
                class="price">¥{{ totalPrice.toFixed(2) }}
          </text>
          <text v-else
                class="price">¥0.00
          </text>
        </view>
      </view>
      <!-- active 当有地址时按钮加上active选中的样式-->
			<button v-if="isRegionalScope" class="btn unActive" type="default" :disabled="false">提交订单</button>
      <button v-else :class="[submitActive ? 'btn active' : 'btn']"
            @click="submitOrder">提交订单
      </button>
      <!-- <text class="btn" v-else>提交订单</text> -->

    </view>
    <!-- 活动弹框 -->
    <u-popup class="activity-con"
             v-model="isShowDiscount"
             mode="bottom"
             border-radius="14"
             close-icon-pos="top-right"
             close-icon-size="20">
      <view class="activity-box"
            style="height: 1000rpx;">
        <view class="title-box">
          <image class="close-btn"
                 @click="onDiscountClose"
                 src="https://ceres.zkthink.com/static/images/close.png"></image>
        </view>
        <view class="activity-coupon-box">
          <scroll-view scroll-y="true"
                       style="height: 900rpx;">
            <view class="content-box">
              <view v-if="usableListLength">
                <view class="label-lingqu">可用优惠券列表</view>
                <view class="couponBox">
                  <view class="coupon-item"
                        v-for="(usableItem, index) in settlement.coupons"
                        :key="index"
                        @click="couponItemTap(index,usableItem)"
                  >
                    <view class="money-box"
                          v-if="usableItem.couponType === 1">￥{{ usableItem.reduceMoney }}
                    </view>
                    <view class="money-box"
                          v-else>{{ usableItem.reduceMoney }}折券
                    </view>
                    <view class="info-box">
                      <view class="date font-color-999"
                            style="font-size:22upx;  margin-top: 20upx;">
                        {{ getDate(usableItem.startTime.replace(/-/g, '.'))
                        }}-{{ getDate(usableItem.endTime.replace(/-/g, '.')) }}
                      </view>
                      <view class="info font-color-999">满{{ usableItem.fullMoney }}元可用</view>
                    </view>
                    <image class="check-img"
                           src="https://ceres.zkthink.com/static/images/selectActive.png"
                           v-if="usableItem.checked"></image>
                    <image class="check-img"
                           src="https://ceres.zkthink.com/static/images/selectEmpty.png"
                           v-else></image>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>
    <u-popup class="activity-con"
             v-model="isShopCoupons"
             mode="bottom"
             border-radius="14"
             close-icon-pos="top-right"
             close-icon-size="20">
      <view class="activity-box">
        <view class="title-box">
          <image class="close-btn"
                 @click="onshopClose"
                 src="https://ceres.zkthink.com/static/images/close.png"></image>
        </view>
        <view class="activity-coupon-box">
          <scroll-view scroll-y="true"
                       style="height: 900rpx;">
            <view class="content-box">
              <view v-if="shopCouponsLength">
                <view class="label-lingqu">可用优惠券列表</view>
                <view class="couponBox">
                  <view class="coupon-item"
                        v-for="(sItem, index) in shopCouponslist.shopCoupons"
                        :key="sItem.id"
                        @click="shopCouponItemTap(index,sItem)">
                    <view class="money-box"
                          v-if="sItem.couponType === 1">￥{{ sItem.reduceMoney }}
                    </view>
                    <view class="money-box"
                          v-else>{{ sItem.reduceMoney }}折券
                    </view>
                    <view class="date font-color-999"
                          style="font-size:22upx;  margin-top: 10upx;">
                      {{ getDate(sItem.startTime.replace(/-/g, '.')) }}-{{ getDate(sItem.endTime.replace(/-/g, '.')) }}
                    </view>
                    <view class="info-box">
                      <view class="info font-color-999">满{{ sItem.fullMoney }}元可用</view>
                    </view>
                    <image class="check-img"
                           src="https://ceres.zkthink.com/static/images/selectActive.png"
                           v-if="sItem.checked"></image>
                    <image class="check-img"
                           src="https://ceres.zkthink.com/static/images/selectEmpty.png"
                           v-else></image>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>
    <u-popup class="huabei-popup"
             v-model="showHuabeiPopup"
             mode="bottom"
             border-radius="14"
             close-icon-pos="top-right"
             close-icon-size="20">
      <view class="huabei-box">
        <radio-group @change="huabeiPeriodChange"
                     v-model="huabeiPeriod">
          <view class="period-radio">
            <view class="period-amount">
              <label class="period-each">￥ {{ fenqiFeeList[0]|clip2Decimal }}x3期</label>
              <label class="period-each-charge">手续费￥{{ chargeFeeList[0]|clip2Decimal }}/期</label>
            </view>
            <radio class="period-type-radio-item"
                   style="transform:scale(0.7)"
                   :checked="huabeiPeriod == 3"
                   value="3"/>
          </view>
          <view class="period-radio">
            <view class="period-amount">
              <label class="period-each">￥ {{ fenqiFeeList[1]|clip2Decimal }}x6期</label>
              <label class="period-each-charge">手续费￥{{ chargeFeeList[1]|clip2Decimal }}/期</label>
            </view>
            <radio class="period-type-radio-item"
                   style="transform:scale(0.7)"
                   :checked="huabeiPeriod == 6"
                   value="6"/>
          </view>
          <view class="period-radio">
            <view class="period-amount">
              <label class="period-each">￥ {{ fenqiFeeList[2]|clip2Decimal }}x12期</label>
              <label class="period-each-charge">手续费￥{{ chargeFeeList[2]|clip2Decimal }}/期</label>
            </view>
            <radio class="period-type-radio-item"
                   style="transform:scale(0.7)"
                   :checked="huabeiPeriod == 12"
                   value="12"/>
          </view>
        </radio-group>
      </view>
      <view class="huabei-confirm">
        <view class="fenqi-total-amount">
          <label class="fenqi-all">分期总额 ￥{{ (totalPrice - reduceMoney)|clip2Decimal }}</label>
          <label class="charge-fee-all">手续费 ￥{{ chargeFee|clip2Decimal }}</label>
        </view>
        <view class="fenqi-confirm">
          <text class="btn active"
                @click="showHuabeiPopup=false">确认
          </text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {hidden} from "../../utils/hidden";

const NET = require('../../utils/request')
const API = require('../../config/api')
// #ifdef H5
var jweixin = require('jweixin-module')
// #endif
export default {
  data() {
    return {
      couponActiveShowFalg: false,
      settlement: {},
      type: 0,
      skuItemDTOList: [],
      userAddressInfo: {},
      isShowDiscount: false,
      isShopCoupons: false,
      usableListLength: 0,
      shopCouponsLength: 0,
      shopCouponslist: [],
      promotionInfoDTO: {
        couponId: 0,
        ifAdd: 1,
        reduceMoney: 0
      },
      shopInfoDTO: {},
      reduceMoney: 0,
      submitActive: true,
      distributionPrice: 0, //运费
      totalPrice: 0, //合计
      receiveId: '',
      totalCount: 0,
      skuItemList: {},
      shopGroupWorkId: 0,
      sumitType: '',
      collageId: null,
      couponIfAdd: true,
      couponsList: [],
      shopCouIndex: 0, //优惠券index
      shopIndex: 0,
      shopCheckedType: true,
      discountPrice: 0,
      selectShopCoupon: [], // 已选择店铺优惠券
      chargeFee: 0,  //花呗分期手续费，如果是商户支付手续费，则为0，否则默认计算3期手续费
      huabeiDetail: true,
      showHuabeiPopup: false,
      huabeiChargeType: 0,
      huabeiFeerateList: [],
      paymentMode: 0, //支付方式 1-微信支付 2-支付宝支付 3-花呗分期
      huabeiPeriod: 3, //选择的花呗分期数 有 3 6 12 3种选项，默认是3
      chargeFeeList: [], //花呗每期的手续费
      fenqiFeeList: [], //花呗每期的支付额
      showWechatPayType: false,
      showAlipayPayType: false,
      showHuabeiPayType: false,
      orderId: null,
      couponType: 0,
      selectIntegral: true,
      integralNum: 0,
      ifShow: false,
      integralRatio: 0, // 积分兑换比例
      integralPrice: 0, // 总积分可减多少元
      orderCreditThreshold: 0, // 满多少元可以抵扣
      integralShow: false, // 显示隐藏积分
      checkedPlatformCoupon: undefined,
      oneClickSubmit: true, //只提交订单一次
			isRegionalScope: false, //是否在商家配置范围内地址
    }
  },
  onLoad(options) {
    this.getQuery()
		console.log(options,'options')
    this.type = options.type
    if (options.receiveId) {
      this.receiveId = options.receiveId
    }
    this.decidePayType()
  },
  onShow() {
    if (uni.getStorageSync("receiveItem")) {
      this.receiveId = uni.getStorageSync("receiveItem").receiveId
    }
    if (uni.getStorageSync("skuItemDTOList") != "") {
      this.skuItemDTOList = uni.getStorageSync('skuItemDTOList')
      console.log(this.skuItemDTOList, '66666')
      if (this.skuItemDTOList[0].shopDiscountId > 0) {
        this.sumitType = 4
      } else if (this.skuItemDTOList[0].shopSeckillId > 0) {
        this.sumitType = 3
      }
      this.getSettlement(false)
    } else if (uni.getStorageSync("skuItemList") != "") {
      this.skuItemList = uni.getStorageSync("skuItemList")
      //console.log(this.skuItemList, 999)
      this.shopGroupWorkId = this.skuItemList.shopGroupWorkId
      this.sumitType = this.skuItemList.type
      this.collageId = this.skuItemList.collageId
      this.getSettlement(true)
    }
  },
  onBackPress(e) {
    if (e.from === 'navigateBack') {
      return false;
    }
    this.back();
    return true
  },
  filters: {
    clip2Decimal(value) {
      if (value === undefined || value === null) {
        return "0.00"
      }
      return (parseInt(value * 100) / 100).toFixed(2)
    }
  },
  methods: {
    getQuery() {
      NET.request(API.Query, {
        name: 'credit_exchange_rate'
      }, 'GET').then(res => {
        this.integralRatio = parseFloat(res.data.dictDescribe)
      }).catch(res => {
        console.log('平台端未配置积分兑换比例(1积分抵扣多少金额)')
      })
    },
    // 积分价格计算
    changeIntegral() {
      this.selectIntegral = !this.selectIntegral
      if (this.selectIntegral) {
        this.totalPrice = this.totalPrice - this.integralPrice
      } else {
        this.totalPrice = this.totalPrice + this.integralPrice
      }
    },
    back() {
      if (this.type == 2 || this.type) {
        uni.switchTab({
          url: '../../pages/tabbar/cart/index'
        })
      } else {
        uni.navigateBack({
          delta: 1
        });
      }
    },
    // 获取订单信息
    getSettlement(isGroup) {
      uni.showLoading({
        title: '加载中...',
      })
      this.ifShow = true
      let _url = '',
          _data = ''
      // 是否是拼团
      if (isGroup) {
        _url = API.getGroupSettlement
        _data = this.skuItemList
      } else {
        _url = API.Settlement
        _data = {
          type: this.type,
          shops: this.skuItemDTOList,
          receiveId: this.receiveId
        }
				// composeId: 68
				console.log(this.skuItemDTOList,'this.skuItemDTOList')
      }
      NET.request(_url, _data, 'POST').then(res => {
        uni.hideLoading()
        this.settlement = res.data
        this.couponsList = res.data.coupons
        this.huabeiChargeType = res.data.huabeiChargeType
        if (this.huabeiChargeType === 2) {
          this.huabeiFeerateList = res.data.huabeiFeerateList
        } else {
          this.huabeiFeerateList = [0, 0, 0]
        }
        let shopLen = this.settlement.shops.length
        this.settlement.shops.forEach((value) => {
          value['totalNum'] = value.total
          value['pricing'] = 0
        })
        // 如果没有地址时进入购买宝贝页面对下面的商品件数和总计进行赋值
        if (!this.settlement.receive.receiveAdress) {
          this.settlement.shops.map(item => {
            this.totalCount += item.number
            this.totalPrice += item.total || item.totalNum
          })
        }
        // 初始化平台券选中状态
        if (this.settlement.coupons.length > 0) {
          this.settlement.coupons.forEach((item) => {
            item.checked = false
          })
        }
        // 默认选中商家的第一张优惠券
        for (let s = 0; s < shopLen; s++) {
          const curShop = this.settlement.shops[s]
          curShop.skus.forEach((item) => {
            item['skuTotalNum'] = item.total
          })
          if (curShop.shopCoupons.length > 0) {
            curShop.shopCoupons.forEach((item) => {
              item.checked = false
            })
            const firstShopCoupon = curShop.shopCoupons[0];
            let useCoupon = this.useShopCoupon(s, 0)
            if (useCoupon) {
              firstShopCoupon.checked = true
              this.selectShopCoupon.push(firstShopCoupon)
              curShop['currentCoupon'] = firstShopCoupon
            } else {
              curShop.totalNum = curShop.total
            }
          }
        }
        if (uni.getStorageSync('receiveItem')) {
          let receiveItem = uni.getStorageSync('receiveItem')
          this.userAddressInfo = receiveItem
          this.receiveId = receiveItem.receiveId
          this.userAddressInfo.receivePhone = hidden(this.userAddressInfo.receivePhone, 3, 4)
        } else if (res.data.receive) {
          this.receiveId = res.data.receive.receiveId
          this.userAddressInfo = res.data.receive
          this.userAddressInfo.receivePhone = hidden(this.userAddressInfo.receivePhone, 3, 4)
        }
        uni.removeStorageSync('receiveItem')
        this.usableListLength = res.data.coupons.length
        this.getTotal()
				this.isReceiveCan()

      }).catch(res => {
        uni.hideLoading()
      })
    },
		// 根据地址判断是否能下单
		isReceiveCan(){
			this.settlement.shops.map(item=>{
				if(item.receiveNotMatch){
					this.isRegionalScope = item.receiveNotMatch
				}
				if(this.isRegionalScope){
					uni.showToast({
						title: '当前地址不支持配送，请参与红色字提示',
						icon: 'none'
					})
				}
			})
		},
		
    addAddressTap() {
			console.log(this.type, 'this.type')
      uni.navigateTo({
        url: '../../pages_category_page2/userModule/address?type='+ this.type,
      })
    },
    getDate(time) {
      if (!time) return '';
      return time.split(' ')[0]
    },
    // 平台优惠券选择
    couponItemTap(index, usableItem) {
      if (!usableItem.checked && this.selectShopCoupon.length) { // 判断商家券情况
        uni.showToast({
          title: '不可与商家券券叠加使用！',
          icon: 'none'
        })
        return false
      }
      // 已选中的情况下取消选中
      if (usableItem.checked) {
        let promotionInfoDTO = {}
        if (usableItem.couponId) {
          promotionInfoDTO['couponId'] = 0
          promotionInfoDTO['ifAdd'] = 1
          promotionInfoDTO['reduceMoney'] = 0
        }
        this.promotionInfoDTO = promotionInfoDTO
        usableItem.checked = false
        this.isShowDiscount = false
        this.checkedPlatformCoupon = undefined
        this.getTotal()
      } else {
        // 先把所有已选中的平台优惠券改为未选中
        this.settlement.coupons.forEach((item) => {
          item.checked = false
        })
        let shopSumPrice = 0 // 订单总价
        let shopsLen = this.settlement.shops.length // 结算页店铺数量
        for (let i = 0; i < shopsLen; i++) {
          shopSumPrice += this.settlement.shops[i].totalNum
        }
        if (usableItem.couponType === 1 && usableItem.reduceMoney >= shopSumPrice) {
          uni.showToast({
            title: '不可使用大于等于合计金额的优惠劵！',
            icon: 'none'
          })
          return false
        }
        let promotionInfoDTO = {}
        if (usableItem.couponId) {
          promotionInfoDTO['couponId'] = usableItem.couponId
          promotionInfoDTO['ifAdd'] = usableItem.ifAdd
          promotionInfoDTO['couponType'] = usableItem.couponType
          promotionInfoDTO['reduceMoney'] = usableItem.reduceMoney
        }
        this.promotionInfoDTO = promotionInfoDTO
        this.isShowDiscount = false
        this.checkedPlatformCoupon = usableItem
        this.getTotal()
        // 选中优惠券
        usableItem.checked = true
      }
    },
    // 店铺优惠券选择
    shopCouponItemTap(index, sItem) {
      // 取消选择优惠券
      if (sItem.checked) {
        sItem.checked = false
        this.settlement.shops[this.shopIndex].totalNum = this.settlement.shops[this.shopIndex].total
        this.settlement.shops[this.shopIndex].currentCoupon = {}
        this.isShopCoupons = false
        this.selectShopCoupon = []
        this.getTotal()
        return false
      }
      if (sItem.couponType === 1 && this.settlement.shops[this.shopIndex].total < sItem.reduceMoney) {
        uni.showToast({
          title: '不可使用大于商品金额的优惠劵！',
          icon: 'none'
        })
      } else {
        // 选择优惠券
        if (this.promotionInfoDTO.couponId !== 0) {
          uni.showToast({
            title: '此券不可与平台券叠加！',
            icon: 'none'
          })
          return false
        }
        if (sItem.couponType === 1) {
          if (sItem.reduceMoney >= this.settlement.shops[this.shopIndex].total) {
            uni.showToast({
              title: '优惠券优惠金额不能大于等于合计金额！',
              icon: 'none'
            })
            return false
          }
        }

        this.isShopCoupons = false
        this.shopCouIndex = index
        let useCoupon = this.useShopCoupon(this.shopIndex, this.shopCouIndex)
        if (useCoupon) {
          // 确认使用当前点击的商家券，先将所有的商家券取消选中
          for (let i = 0; i < this.selectShopCoupon.length; i++) {
            this.selectShopCoupon[i].checked = false
          }
          this.selectShopCoupon = []

          sItem.checked = true
          this.settlement.shops[this.shopIndex].currentCoupon = sItem
          this.selectShopCoupon.push(sItem)
        } else {
          this.settlement.shops[this.shopIndex].totalNum = this.settlement.shops[this.shopIndex].total
        }
        this.getTotal()
      }
    },
    useShopCoupon(shopIndex, couponIndex) {
      const curShop = this.settlement.shops[shopIndex]
      curShop.totalNum = 0
      let curCoupon = undefined
      if (curShop.shopCoupons && curShop.shopCoupons.length > 0) {
        curCoupon = curShop.shopCoupons[couponIndex]
      }
      if (!curCoupon) {
        return false
      }
      let useCoupon = false
      if (curCoupon.couponType === 1) {
        if (curShop.total > curCoupon.reduceMoney) {
          curShop.totalNum = curShop.total - curCoupon.reduceMoney
          useCoupon = true
        }
      } else {
        let shopTotal = 0
        let skuLen = curShop.skus.length
        let priceCount = 0
        let couponMatchPriceCount = 0
        for (let k = 0; k < skuLen; k++) {
          let idsLen = curCoupon.ids.length
          // 定价捆绑的优惠额外处理
          let priceId = curShop.skus[k].priceId
          for (let i = 0; i < idsLen; i++) {
            if (curShop.skus[k].productId === curCoupon.ids[i]) {
              if (priceId > 0) {
                couponMatchPriceCount++
              } else {
                curShop.skus[k].skuTotalNum = curShop.skus[k].total * (curCoupon.reduceMoney / 10)
                useCoupon = true
              }
            }
          }
          if (priceId > 0) {
            priceCount++;
          } else {
            shopTotal += curShop.skus[k].skuTotalNum
            curShop.totalNum = parseFloat(shopTotal.toFixed(2))
          }
        }
        if (couponMatchPriceCount >= priceCount && curShop.priceAfterDiscount >= curCoupon.fullMoney) {
          let priceTotal = curShop.priceAfterDiscount * (curCoupon.reduceMoney / 10)
          curShop.totalNum += priceTotal
          useCoupon = true
        }
      }
      return useCoupon
    },
    /**
     * 计算总价，商家券的优惠计算，在调用本方法之前已经计算好在shops[].totalNum
     */
    getTotal() {
      this.totalPrice = 0
      this.totalCount = 0
      this.integralPrice = 0
      this.integralNum = 0
      let shopSumPrice = 0
      let shopsLen = this.settlement.shops.length

      for (let i = 0; i < shopsLen; i++) {
        this.totalPrice += parseFloat(this.settlement.shops[i].totalNum)
        shopSumPrice += parseFloat(this.settlement.shops[i].totalNum)
        this.totalCount += this.settlement.shops[i].number
      }
      console.log(this.settlement.shops, this.totalPrice)

      if (this.checkedPlatformCoupon) {
        if (this.checkedPlatformCoupon.couponType === 1 && this.totalPrice - this.checkedPlatformCoupon.reduceMoney > 0) { // 满减
          this.totalPrice = shopSumPrice - this.checkedPlatformCoupon.reduceMoney
        } else if (this.checkedPlatformCoupon.couponType === 2 && this.checkedPlatformCoupon.reduceMoney > 0) { // 折扣
          this.totalPrice = shopSumPrice * this.checkedPlatformCoupon.reduceMoney / 10
        }
      }
      // 积分支付计算
      this.calcCredit()
      // 加上每个商家的运费
      this.settlement.shops.forEach((item) => {
        this.totalPrice = this.totalPrice + (item.distribution.distributionPrice || 0)
      })
      this.recalcHuabei()
    },
    calcCredit() {
      let shopsLen = this.settlement.shops.length
      const skuRemainMap = this.calcSkuRemainMap()
      const skuCreditMap = this.settlement.skuCreditMap;
      if (skuCreditMap && this.integralRatio > 0) {
        this.orderCreditThreshold = this.settlement.orderCreditThreshold
        let remainUserCredit = this.settlement.userTotalCredit
        let remainTotalPrice = Math.round((this.totalPrice + Number.EPSILON) * 100) / 100
        let remainDeductLimit = this.settlement.creditDeductLimit
        // 只有订单金额达到阈值，并且用户还有剩余的积分，才能进行积分抵扣
        if (this.totalPrice >= this.orderCreditThreshold && remainUserCredit > 0 && remainDeductLimit > 0) {
          for (let i = 0; i < shopsLen; i++) {
            const curShop = this.settlement.shops[i]
            let skuLen = curShop.skus.length
            for (let j = 0; j < skuLen; j++) {
              const curSku = curShop.skus[j]
              const skuId = curSku.skuId
              if (skuCreditMap[skuId] > 0 && skuRemainMap[skuId] > 0 && remainUserCredit > 0 && remainTotalPrice > 0) {
                // 抵扣之后，必须保证整个订单至少还有0.01元，可用于支付
                if (remainTotalPrice - skuRemainMap[skuId] < 0.01) {
                  skuRemainMap[skuId] -= 0.01
                }
                // 按照比例换算成需要多少积分抵扣(取整)
                let finalSkuCredit = parseInt((skuRemainMap[skuId] / this.integralRatio).toString());
                // 优先以商家配置的商品可抵扣积分为准
                if (skuCreditMap[skuId] < finalSkuCredit) {
                  finalSkuCredit = skuCreditMap[skuId]
                }
                // 不能超过用户剩余积分
                if (remainUserCredit < finalSkuCredit) {
                  finalSkuCredit = remainUserCredit
                }
                // 不能超过整个订单可抵扣积分
                if (remainDeductLimit < finalSkuCredit) {
                  finalSkuCredit = remainDeductLimit
                }
                curSku.cachedCredit = finalSkuCredit
                this.integralNum += finalSkuCredit
                remainUserCredit -= finalSkuCredit
                remainDeductLimit -= finalSkuCredit
                remainTotalPrice -= finalSkuCredit
              }
            }
          }
        }
        //计算抵扣价格
        if (this.integralNum !== 0) {
          this.integralNum = parseInt(this.integralNum)
          this.integralPrice = this.integralNum * this.integralRatio
          if (this.integralNum !== 0) {
            this.integralShow = true
          }
          if (this.selectIntegral) {
            this.totalPrice = this.totalPrice - this.integralPrice
          }
        } else {
          this.integralShow = false
        }
      }
    },
    /**
     * 计算sku在整个运单价格中的剩余价值 1元的订单，打1折优惠之后，剩余价值就是0.1元
     */
    calcSkuRemainMap() {
      let skuRemainMap = {}
      let shopsLen = this.settlement.shops.length
      const skuCreditMap = this.settlement.skuCreditMap
      for (let i = 0; i < shopsLen; i++) {
        const curShop = this.settlement.shops[i]
        let skuLen = curShop.skus.length
        let checkedShopCoupon = undefined
        curShop.shopCoupons.forEach((item) => {
          if (item.checked) {
            checkedShopCoupon = item
          }
        })
        for (let j = 0; j < skuLen; j++) {
          const curSku = curShop.skus[j]
          const skuId = curSku.skuId
          // 不是定价捆绑，并且有配置可抵扣的积分，才有必要计算比例
          if (!curSku.priceId > 0 && skuCreditMap[skuId] > 0) {
            let remainSkuMoney = curSku.price * curSku.number
            if (checkedShopCoupon) {
              let skuShopPercent = remainSkuMoney / curShop.total
              let curReduceMoney = 0
              if (checkedShopCoupon.couponType === 1) {
                curReduceMoney = checkedShopCoupon.reduceMoney * skuShopPercent
              } else {
                curReduceMoney = remainSkuMoney * (10 - checkedShopCoupon.reduceMoney) / 10
              }
              remainSkuMoney = remainSkuMoney - curReduceMoney
            }
            // 使用平台券
            if (this.checkedPlatformCoupon && remainSkuMoney > 0) {
              // 满减
              if (this.checkedPlatformCoupon.couponType === 1) {
                let skuTotalPercent = remainSkuMoney / this.totalPrice
                remainSkuMoney -= this.checkedPlatformCoupon.reduceMoney * skuTotalPercent
              }
              // 折扣
              else {
                remainSkuMoney = remainSkuMoney * this.checkedPlatformCoupon.reduceMoney / 10
              }
            }
            skuRemainMap[skuId] = remainSkuMoney
          }
        }
      }
      return skuRemainMap
    },
    recalcHuabei() {
      if (this.paymentMode === 3) {
        this.fenqiFeeList[0] = this.totalPrice * (1 + this.huabeiFeerateList[0] / 100) / 3
        this.fenqiFeeList[1] = this.totalPrice * (1 + this.huabeiFeerateList[1] / 100) / 6
        this.fenqiFeeList[2] = this.totalPrice * (1 + this.huabeiFeerateList[2] / 100) / 12

        this.chargeFeeList[0] = this.totalPrice * (this.huabeiFeerateList[0] / 100) / 3
        this.chargeFeeList[1] = this.totalPrice * (this.huabeiFeerateList[1] / 100) / 6
        this.chargeFeeList[2] = this.totalPrice * (this.huabeiFeerateList[2] / 100) / 12

        var index = 0;
        if (this.huabeiPeriod === 6) {
          index = 1
        } else if (this.huabeiPeriod === 12) {
          index = 2
        }
        this.chargeFee = (this.totalPrice * (this.huabeiFeerateList[index] / 100)).toFixed(2)
      }
    },
    // 展示平台端优惠券
    showDiscount() {
      // let shopifAdd = 1
      // if(this.settlement.shops[this.shopIndex].shopCoupons.length>0){
      // 	shopifAdd = this.settlement.shops[this.shopIndex].shopCoupons[this.shopCouIndex].ifAdd
      // }
      if (this.settlement.coupons.length > 0) {
        for (let i = 0; i < this.selectShopCoupon.length; i++) {
          if (this.selectShopCoupon[i].ifAdd == 0) {
            uni.showToast({
              title: '不可叠加已选择的店铺券',
              icon: 'none'
            })
            return false
          }
        }
        this.isShowDiscount = true
      } else {
        uni.showToast({
          title: '暂无可用优惠券',
          icon: 'none'
        })
      }
    },
    // 显示店铺优惠券
    showShopCoupons(item, sIndex) {
      if (item.shopCoupons.length > 0) {
        this.isShopCoupons = true
        this.shopCouponslist = item
        this.shopCouponsLength = item.shopCoupons.length
        this.shopIndex = sIndex
      } else {
        uni.showToast({
          title: '暂无可用优惠券',
          icon: 'none'
        })
      }
    },
    onDiscountClose() {
      this.isShowDiscount = false
    },
    onshopClose() {
      this.isShopCoupons = false
    },
    payTypeChange(event) {
      this.paymentMode = event.target.value;
      if (this.paymentMode === 3) {
        this.huabeiDetail = true
      } else {
        this.huabeiDetail = false
      }
      this.recalcHuabei()
    },
    huabeiPeriodChange(event) {
      this.huabeiPeriod = event.target.value
      var feeRate = this.huabeiFeerateList[2]
      if (this.huabeiPeriod === 3) {
        feeRate = this.huabeiFeerateList[0]
      } else if (this.huabeiPeriod === 6) {
        feeRate = this.huabeiFeerateList[1]
      }
      this.chargeFee = (this.totalPrice * feeRate / 100).toFixed(2)
    },
    showHuabeiDetail() {
      this.showHuabeiPopup = true
    },
		// submitOrder() {
		// 	console.log('确认订单')
		// },
    submitOrder() {
      const that = this
      if (this.paymentMode === 0) {
        uni.showToast({
          title: '请选择支付方式',
          icon: 'none'
        })
      } else {

        if (this.oneClickSubmit) {
          this.oneClickSubmit = false
          if (this.userAddressInfo.receiveName) {
            uni.showLoading({
              mask: true,
              title: '订单提交中...',
            })
            let couponIdinfo = 0
            if (this.promotionInfoDTO.couponId) {
              couponIdinfo = this.promotionInfoDTO.couponId
            }
            let data = {
              shopDiscountId: null,
              collageId: this.collageId,
              type: this.sumitType,
              shopGroupWorkId: null,
              receiveId: this.receiveId,
              couponId: couponIdinfo,
              price: this.totalPrice,
              remark: "",
              shops: [],
              discountPrice: this.discountPrice,
              shopSeckillId: null
            }
            if (this.shopGroupWorkId > 0) {
              data.shopGroupWorkId = this.shopGroupWorkId
            }
            if (this.skuItemDTOList != '') {
              if (this.skuItemDTOList[0].shopDiscountId > 0) {
                data.shopDiscountId = this.skuItemDTOList[0].shopDiscountId
              } else if (this.skuItemDTOList[0].shopSeckillId > 0) {
                data.shopSeckillId = this.skuItemDTOList[0].shopSeckillId
              }
            }
            let datashopslen = this.settlement.shops.length
            for (let n = 0; n < datashopslen; n++) {
              let shopsobj = {}
              shopsobj["shopId"] = this.settlement.shops[n].shopId
              shopsobj["sceneId"] = this.settlement.shops[n].sceneId
              shopsobj["distribution"] = {}
              shopsobj["skus"] = []
              if (this.settlement.shops[n].currentCoupon) {
                shopsobj["id"] = this.settlement.shops[n].currentCoupon.id
              }
              data.shops.push(shopsobj)
              data.shops[n].distribution.distributionPrice = this.settlement.shops[n].distribution.distributionPrice
              data.shops[n].distribution.distributionName = this.settlement.shops[n].distribution.distributionName
              let dataskuslen = this.settlement.shops[n].skus.length
              for (let m = 0; m < dataskuslen; m++) {
                let skusobj = {}
                const curSku = this.settlement.shops[n].skus[m]
                skusobj["skuId"] = curSku.skuId
                skusobj["number"] = curSku.number
                skusobj["ifLogistics"] = curSku.ifLogistics
                skusobj["selected"] = curSku.selected
                skusobj["platformSeckillId"] = curSku.platformSeckillId
                skusobj["platformDiscountId"] = curSku.platformDiscountId
                skusobj["shopSeckillId"] = curSku.shopSeckillId
                skusobj["shopDiscountId"] = curSku.shopDiscountId
                skusobj["sceneId"] = curSku.sceneId
                skusobj["priceId"] = curSku.priceId
                skusobj["useMember"] = curSku.useMember
                skusobj["composeId"] = curSku.composeId
                // 积分传参
                if (this.selectIntegral && curSku.cachedCredit) {
                  skusobj["useCredit"] = curSku.cachedCredit
                  skusobj["useCreditAmount"] = (curSku.cachedCredit * this.integralRatio).toFixed(2)
                }
                data.shops[n].skus.push(skusobj)
              }
            }
            // #ifdef H5
            data.paymentMode = 1
            data.subPaymentMode = 3
            // #endif

            // #ifdef MP-WEIXIN
            data.paymentMode = 1
            data.subPaymentMode = 1
            // #endif

            // #ifdef APP-PLUS
            data.paymentMode = 1
            // #endif

            // #ifdef MP-ALIPAY
            data.paymentMode = 2
            data.subPaymentMode = 1
            // #endif

            uni.hideLoading()
            uni.showLoading({
              mask: true,
              title: '结算中...',
            })
            NET.request(API.PlaceOrder, data, 'POST').then(res => {
              uni.hideLoading()
              if (this.type == 2) {
                let carSkusData = data.shops
                let skusArr = []
                for (let i = 0; i < carSkusData.length; i++) {
                  carSkusData[i].skus.map(item => {
                    skusArr.push(item.skuId)
                  })
                }
                // 从购物车中点击结算时删除对应购物车商品
                NET.request(API.DeleteCart, {
                  ids: skusArr
                }, 'POST').then(res => {
                  console.log(res, '删除对应购物车商品')
                }).catch(res => {
                })
              }
              let submitResult = res.data
              that.orderId = res.data.orderId
              //console.log(submitResult, '测试')
              submitResult.type = 1
              submitResult.paymentMode = data.paymentMode
              // #ifdef H5
              let ua = navigator.userAgent.toLowerCase();
              if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.payRequest(submitResult)
              } else {
                NET.request(API.gotoH5Pay, submitResult, 'POST').then(res => {
                  //console.dir(res)
                  location.replace(res.data.mwebUrl)
                  // window.location.replace(url)
                }).catch(err => {
                  this.submitActive = true
                  uni.hideLoading()
                  uni.showToast({
                    title: '支付失败',
                    icon: 'none'
                  })
                  uni.navigateTo({
                    url: '../orderModule/index?type=1'
                  })
                })

              }
              // #endif
              // #ifdef MP-ALIPAY
              submitResult.huabeiPeriod = this.huabeiPeriod
              submitResult.paymentMode = this.paymentMode
              this.aliPay(submitResult)
              // #endif

              // #ifdef MP-WEIXIN
              uni.showLoading({
                mask: true,
                title: '支付中...',
              })
              NET.request(API.gotoPay, submitResult, 'POST').then(res => {
                uni.hideLoading()
                console.dir(res, 'API.gotoPay')
                let param = {
                  orderId: submitResult.orderId,
                  collageId: submitResult.collageId
                }
                uni.requestPayment({
                  provider: 'wxpay',
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: res.data.signType,
                  paySign: res.data.paySign,
                  success: function (payRes) {
                    // 拼团微信支付成功回调
                    if (param.collageId) {
                      console.log(param, ' param999999')
                      NET.request(API.paySuccess, param, 'POST').then(res => {
                        console.log(res, '支付成功')
                      })
                    }
                    uni.showToast({
                      icon: 'none',
                      title: '支付成功'
                    })
                    //console.log(submitResult.orderId, 'order Id')
                    uni.navigateTo({
                      url: 'paySuccessful?orderId=' + submitResult.orderId
                    })
                  },
                  fail: function (err) {
                    uni.showToast({
                      icon: 'none',
                      title: '支付取消'
                    })
                    uni.navigateTo({
                      url: '../orderModule/index?type=1'
                    })
                  }
                })
              }).catch(err => {
                uni.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
                uni.navigateTo({
                  url: '../orderModule/index?type=1'
                })
              })
              // #endif
              // #ifdef APP-PLUS
              uni.showLoading({
                mask: true,
                title: '支付中...',
              })
              //console.log(submitResult, 'app-submitResult')
              NET.request(API.gotoAppPay, submitResult, 'POST').then(res => {
                uni.hideLoading()
                let str = res.data.package
                var index = str.lastIndexOf("\=");
                str = str.substring(index + 1, str.length);
                var obj = {
                  appid: res.data.appId,
                  noncestr: res.data.nonceStr,
                  package: 'Sign=WXPay',
                  prepayid: str,
                  timestamp: res.data.timeStamp,
                  sign: 'MD5',
                  partnerid: res.data.partnerId
                }
                //console.log(res.data, '111')
                //console.log(obj, '111')
                uni.requestPayment({
                  provider: 'wxpay',
                  orderInfo: obj,
                  success: function (payRes) {
                    uni.showToast({
                      icon: 'none',
                      title: '支付成功'
                    })
                    uni.navigateTo({
                      url: 'paySuccessful?orderId=' + that.orderId
                    })
                  },
                  fail: function (err) {
                    //console.log(err)
                    uni.showToast({
                      icon: 'none',
                      title: '支付取消'
                    })
                    uni.navigateTo({
                      url: '../orderModule/index?type=1'
                    })
                  }
                })
              }).catch(err => {
                uni.hideLoading()
                uni.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
                uni.navigateTo({
                  url: '../orderModule/index?type=1'
                })
              })
              // #endif
            }).catch(res => {
              uni.hideLoading()
              this.oneClickSubmit = true
              uni.showToast({
                title: '提交失败',
                icon: 'none'
              })
            })
          } else {
            uni.showToast({
              icon: 'none',
              title: '请选择收货地址'
            })
          }
        } else {
          uni.showToast({
            title: "已提交，请勿重新操作！",
            icon: 'none'
          })
        }
      }
    },
    // H5支付微信内置浏览器支付
    // #ifdef H5
    payRequest(payInfo) {
      payInfo.paymentMode = 1
      const that = this
      NET.request(API.gotoPay, payInfo, 'POST').then(res => {
        jweixin.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.paySign, // 必填，签名，见附录1
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        jweixin.ready(function () {
          jweixin.checkJsApi({
            jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
              // console.log('checkjsapi Success')
              // console.log(res);
            },
            fail: function (res) {
              // console.log('res')
              // console.log(res);
            }
          });
          jweixin.chooseWXPay({
            timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              uni.showToast({
                icon: 'none',
                title: '支付成功'
              })
              uni.navigateTo({
                url: 'paySuccessful?orderId=' + that.orderId
              })
            },
            cancel: function (r) {
              uni.showToast({
                icon: 'none',
                title: '取消支付'
              })
              uni.navigateTo({
                url: '../orderModule/index?type=1'
              })
            },
            fail: function (res) {
              uni.showToast({
                icon: 'none',
                title: '支付失败'
              })
              uni.navigateTo({
                url: '../orderModule/index?type=1'
              })
            }
          });
        });
        jweixin.error(function (res) {
          console.log('error')
          console.log(res)
          uni.showToast({
            icon: 'none',
            title: '支付失败了',
            duration: 3000
          });
          uni.navigateTo({
            url: '../orderModule/index?type=1'
          })
        });
      }).catch(err => {
      })
    },
    // #endif
    aliPay(payInfo) {
      const that = this
      NET.request(API.gotoPay, payInfo, 'POST').then(res => {
        console.log('alipay gotoPay-----------')
        console.dir(res)
        uni.requestPayment({
          provider: 'alipay',
          orderInfo: res.data.tradeNo,
          success: function (payRes) {
            if (payRes.resultCode == '6001') {
              uni.showToast({
                icon: 'none',
                title: '取消支付'
              })
              uni.navigateTo({
                url: '../orderModule/index?type=1'
              })
            }
            if (payRes.resultCode == '9000') {
              uni.showToast({
                icon: 'none',
                title: '支付成功'
              })
              uni.navigateTo({
                url: 'paySuccessful?orderId=' + that.orderId
              })
            }
          },
          fail: function (err) {
            uni.showToast({
              icon: 'none',
              title: '支付取消'
            })
            uni.navigateTo({
              url: '../orderModule/index?type=1'
            })
          }
        });
      }).catch(err => {
        uni.hideLoading()
        uni.showToast({
          title: '支付失败',
          icon: 'none'
        })
        uni.navigateTo({
          url: '../orderModule/index?type=1'
        })
      })
    },
    decidePayType() {
      // #ifdef H5 || MP-WEIXIN || APP-PLUS
      this.showWechatPayType = true
      this.paymentMode = 1
      // #endif

      // #ifdef MP-ALIPAY
      this.showAlipayPayType = true
      this.showHuabeiPayType = true
      this.paymentMode = 2
      // #endif
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #F7F7F7;
}

.content {
  padding: 0 30upx 198upx;
  box-sizing: border-box;
}

.address-box {
  margin-top: 20upx;
  background: #fff;
  border-radius: 10upx;
  width: 100%;
  padding: 30upx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

.address-box .address-img {
  width: 71upx;
  height: 57upx;
  margin-right: 20upx;
}

.address-box .address-r {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 28upx;
  color: #333;
}

.arrow-right-img {
  width: 62upx;
  height: 62upx;
  margin-left: 20upx;
}

.address-name-box {
  font-size: 30upx;
  color: #333;
}

.phone {
  font-size: 24upx;
  color: #999;
  margin-left: 20upx;
}

.address-info {
  font-size: 28upx;
  color: #333;
  margin-top: 15upx;
}

.order-list-box .item {
  background: #fff;
  border-radius: 10upx;
}

.order-list-top {
  height: 96upx;
  padding: 0 30upx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid #eee;
}

.top-l {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.shop-img {
  width: 34upx;
  height: 34upx;
  margin-right: 10upx;
}

.shop-name {
  font-size: 30upx;
  color: #333;
  font-weight: bold;
}

.arrow-img {
  margin-left: 15upx;
  width: 62upx;
  height: 62upx;
}

.order-info-box {
  padding: 0 30upx;
  box-sizing: border-box;
}

.order-info-item {
  display: flex;
  flex-direction: row;
  padding: 20upx 0;
}

.product-img {
  width: 180upx;
  height: 180upx;
  border-radius: 10upx;
  margin-right: 30upx;
}

.info-box {
  flex: 1;
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.product-sku {
  font-size: 24upx;
  font-weight: 500;
  color: #999;
  margin-left: -20upx;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.product-price {
  font-size: 32upx;
  color: #C83732;
  font-weight: 400;
}

.product-price .fuhao {
  font-size: 28upx;
}

.product-num {
  font-size: 28upx;
  color: #999;
  font-weight: 400;
}
.adressTips{
	margin-bottom: 19rpx;
	color: #D53912;
}

.delivery-way-box {
  display: flex;
  flex-direction: column;
  border: 2rpx solid #E4E5E6;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-sizing: content-box;
}

.delivery-way-box .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 26upx;
  color: #333;
}

.delivery-way-box .item .way {
  color: #999;
  margin-left: 30upx;
}

.order-total-box {
  padding: 20upx 0;
  text-align: right;
}

.total-num {
  font-size: 26upx;
  color: #333;
}

.total-price {
  font-size: 46rpx;
  color: #333333;
}

.ml10 {
  margin-left: 10upx;
}

.order-flow-box {
  display: flex;
  flex-direction: column;
}

.flow-word {
  font-size: 24upx;
  color: #999;
  display: flex;
  flex-direction: column;
}

.mt25 {
  margin-top: 20upx;
}

.mt50 {
  margin-top: 30upx;
  margin-bottom: 20upx;
}

.order-confirm-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 30upx;
}

.num-box {
  font-size: 30upx;
  color: #999;
}

.num-box .total {
  color: #333;
}

.num-box .price {
  color: #ff7911;
  font-weight: bold;
}

.order-confirm-box .btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #eee;
  font-size: 28rpx;
  color: #FFEBC4;
  text-align: center;
  margin-top: 20rpx;
}

.order-confirm-box .btn.active {
  background: #333333;
  color: #FFEBC4;
}
.order-confirm-box .btn.unActive {
	background: #333333;
	color: #FFEBC4;
	opacity: 0.7;
}

.discount-item1 {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 20rpx;
  border: 2rpx solid #E4E5E6;
}

.discount-item {
  width: 100%;
  height: 98upx;
  box-sizing: border-box;
  margin: 30upx 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20upx;
  background: white;
}

.pay-type-item {
  .pay-type-radio {
    background-color: white;
    border-bottom: 1upx solid #EDEDED;
    margin-bottom: 20upx;
    padding: 24upx 20upx 24upx 20upx;

    .pay-type-img {
      display: inline-block;

      .pay-type-img-inner {
        width: 50upx;
        height: 50upx;
        vertical-align: middle;
      }
    }

    .pay-type-label {
      vertical-align: middle;
      margin-left: 30upx;
    }

    .pay-type-radio-item {
      float: right;
      width: 50upx;
      height: 50upx;
    }

    .huabei-detail {
      margin-top: 20upx;

      .fenqi-wenzi {
        display: inline-block;
        margin-left: 64upx;
      }

      .fenqi-amount {
        display: block;
        margin-left: 64upx;
        margin-top: 14upx;
        color: #BABBBC;
      }

      .fenqi-charge-fee {
        float: right;
        margin-right: 68upx;
        color: #BABBBC;
      }

      .fenqi-modal {
        width: 40upx;
        height: 40upx;
        margin-left: 20upx;
        float: right;
        position: relative;
        top: -80upx;
      }
    }
  }
}

.period-radio {
  margin: 30upx;
  width: 95%;
  border-bottom: 1px solid #EFEFEF;

  .period-amount {
    display: inline-block;

    .period-each-charge {
      display: inline-block;
      margin-top: 12upx;
      margin-left: 6upx;
      font-size: 26upx;
      color: #b7b7b7;
      margin-bottom: 13upx;
    }
  }

  .period-each {
    display: block;
  }

  .period-type-radio-item {
    float: right;
  }
}

.huabei-confirm {
  height: 120upx;
  padding: 0upx 108upx 0upx 32upx;

  .fenqi-all {
    display: inline-block;
    width: 100%;
  }

  .fenqi-total-amount {
    float: left;
  }

  .fenqi-confirm {
    float: right;
    width: 160upx;
    padding: 0upx 20upx;

    .btn {
      width: 216upx;
      height: 80upx;
      line-height: 80upx;
      border-radius: 40upx;
      font-size: 28upx;
      text-align: center;
      background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
      color: #fff;
      display: inline-block;
      margin-right: 66upx;
    }
  }
}

.discount-info-box {
  display: flex;
  flex-direction: row;
}

.discount-label,
.discount-info1 {
  font-size: 26upx;
  color: #333;
}

.discount-info2 {
  color: #C5AA7B;
}

.discount-img {
  width: 30upx;
  height: 30upx;
  margin-left: 20upx;
}

.activity-con {
  .activity-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 1000upx;
  }

}

.activity-box .title-box {
  width: 100%;
  height: 100upx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: solid 1px #EEEEEE;
}

.activity-coupon-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  flex: 1;
}

.title-box .close-btn {
  width: 100upx;
  height: 100upx;
  box-sizing: border-box;
  padding: 30upx;
  position: absolute;
  top: 0;
  right: 0;
}

.content-box {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 30upx;
}

.tag-box {
  width: 100%;
  box-sizing: border-box;
  height: 80upx;
  line-height: 80upx;
  font-size: 28upx;
  font-weight: 500;
  color: #FF7911;
}

.label-lingqu {
  width: 100%;
  font-size: 28upx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.coupon-item1 {
  width: 690upx;
  height: 120upx;
  margin-top: 20upx;
  color: #FFFFFF;
  flex-shrink: 0;
}

.coupon-item2 {
  width: 690upx;
  height: 120upx;
  background-size: 690upx 120upx;
  margin-top: 20upx;
  color: rgba(255, 121, 17, 1);
  flex-shrink: 0
}

.un-coupon-item {
  color: #bbb;
}

.money-box {
  font-size: 40upx;
  font-weight: 500;

}

.info-box {
  font-size: 24upx;
  font-weight: 400;
  margin: 10rpx;
}


.receive-success {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.success-box {
  width: 380upx;
  height: 280upx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10upx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.success-box .success-img {
  width: 200upx;
  height: 130upx;
}

.success-box .text {
  font-size: 28upx;
  margin-top: 50upx;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.check-img {
  width: 40upx;
  height: 40upx;
  margin-top: 40rpx;
}

.mt30 {
  margin-top: 30upx;
}

.activity-con {
  .activity-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 1000upx;
  }

}

.activity-box .title-box {
  width: 100%;
  height: 100upx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: solid 1px #EEEEEE;
}

.activity-coupon-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  flex: 1;
}

.title-box .close-btn {
  width: 100upx;
  height: 100upx;
  box-sizing: border-box;
  padding: 30upx;
  position: absolute;
  top: 0;
  right: 0;
}

.content-box {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 30upx;
}

.tag-box {
  width: 100%;
  box-sizing: border-box;
  height: 80upx;
  line-height: 80upx;
  font-size: 28upx;
  font-weight: 500;
  color: #FF7911;
}

.label-lingqu {
  width: 100%;
  font-size: 28upx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.couponBox {
  display: flex;
  flex-flow: wrap;
  margin-top: 30rpx;
  justify-content: space-between;
}

.coupon-item {
  width: 48%;
  height: 291rpx;
  background: url("https://ceres.zkthink.com/static/images/couponsIcon.png") no-repeat center top;
  margin-top: 20upx;
  color: #C5AA7B;
  flex-shrink: 0;
  text-align: center;
  padding-top: 1rpx;
  background-size: contain;
}

.un-coupon-item {
  color: #bbb;
}

.money-box {
  font-size: 40upx;
  font-weight: 500;
  margin-top: 30rpx;
}

.integralPayBox {
  margin: 20rpx 0;

  .integralBg {
    height: 98rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    padding: 0 20rpx;

    .maxDeduction {
      margin-right: 15rpx;
    }
  }
}
</style>
<style>
.pay-type-item /deep/ .uni-radio-input-checked {
  background-color: #C5AA7B !important;
  border-color: #C5AA7B !important;
}

.maxIntegral /deep/ .uni-checkbox-input {
  width: 30rpx;
  height: 30rpx;
}

.maxIntegral /deep/ .uni-checkbox-input-checked:before {
  font-size: 30rpx;
}

.maxIntegral /deep/ .uni-checkbox-input-checked {
  border: 2rpx solid #C5AA7B !important;
}
</style>
