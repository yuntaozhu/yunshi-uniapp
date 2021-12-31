<template>
  <view class="content">
    <!-- 购物车 -->
    <view v-if="dataList.length !== 0">
      <view class="cart-bg">
        <view class="cart-num-box">
          <image src="../../../static/images/logoTop.png"></image>
          <text class="btn-box" @click="btnTypeClick(1)" v-if="btnType == 0">管理</text>
          <text class="btn-box" @click="btnTypeClick(0)" v-if="btnType == 1">完成</text>
        </view>
        <view>
          <text class="num-box">共<text class="num">{{allNum}}</text>件宝贝</text>
        </view>
      </view>
      <view class="cart-list-box">
        <view class="itemBox" v-for="(item, index) in dataList" :key="item.shopId">
          <view class="item" v-if="item.skus.length !== 0">
            <view class="shop-box">
              <image mode="aspectFill" v-if="item.selected === 1" src="../../../static/images/selectActive.png" class="cart-select-img" @click.stop="updateShopSel(index,0)"></image>
              <image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png" class="cart-select-img" @click.stop="updateShopSel(index,1)"></image>
              <view class="shop-name-box" @click="goStore(index)">
                <image src="../../../static/images/orderStoreIcon.png" class="shop-img"></image>
                <text class="shop-name">{{item.shopName}}</text>
                <image src="../../../static/images/arrowRight.png" class="arrow-right-img"></image>
              </view>
            </view>
            <view class="rulesBox flex-items" v-if="item.currentRules.number">
              <image class="mar-right-20" src="../../../static/images/zuheIcon.png"></image>
              <view class="fs24 font-color-C83732">已满足【{{item.currentRules.price}}元任选{{item.currentRules.number}}件】！</view>
            </view>
            <view v-for="(skuItem, cIndex) in dataList[index].skus" class="product-list-box">
              <view class="pro-item" @click="goodsDateils(item.shopId,skuItem.productId,skuItem.skuId)">
                <image mode="aspectFill" v-if="skuItem.selected == 1"
                       src="../../../static/images/selectActive.png"
                       @click.stop="cartItemSel(index,cIndex,0)" class="cart-select-img"></image>
                <image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png"
                       @click.stop="cartItemSel(index,cIndex,1)" class="cart-select-img"></image>
                <view class="pro-r">
                  <image :src="skuItem.image" class="pro-img"></image>
                  <view class="pro-r-r">
                    <view class="pro-name">{{skuItem.productName}}</view>
                    <view class="sku-box">
                      <text v-if="skuItem.value">{{skuItem.value}}</text>
                      <text v-else>默认规格</text>
                      <!-- <text></text> -->
                    </view>
                    <view class="pro-price-num-box">
                      <view class="pro-price-box">
                        <text class="fuhao">￥</text>
                        <text>{{skuItem.price}}</text>
                      </view>
                      <view class="pro-num-box">
                        <text class="num-btn r" @click.stop="numSub(index,cIndex)">-</text>
                        <text class="num">{{skuItem.number}}</text>
                        <text class="num-btn l" @click.stop="numAdd(index,cIndex)">+</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <u-popup v-model="goodsDetailShowFlag" mode="bottom" border-radius="14">
        <view class="goosDetailshow-box">
          <view class="detailImg-box flex-row-plus">
            <image class="detailImg" :src="selectedSku.image"></image>
            <view class="flex-column-plus mar-left-40">
              <view class="font-color-C5AA7B">
                <label class="fs24">¥</label>
                <label class="fs36 mar-left-10"
                       v-text="selectedSku.activityType === 1 && btnType === 4 ? selectedSku.originalPrice : selectedSku.price"></label>
              </view>
              <label class="fs24 font-color-999 mar-top-20">库存 {{selectedSku.stockNumber}} 件</label>
              <label class="fs24 mar-top-20">已选</label>
            </view>
          </view>
          <view class="color-box flex-column-plus">
            <view v-for="(attritem,index) in productData.names" :key="index" class="skuStyle">
              <label class="fs24 font-color-999">{{attritem.skuName}}</label>
              <view class="colorName-box">
                <view class="pad-bot-30" v-for="(attrRes, resIndex) in attritem.values" :key="resIndex">
                  <view class="colorName"
                        :class="{'colorName-on' : selectedAttr[attritem.nameCode] == attrRes.valueCode}"
                        @click="nameCodeValueCodeClick(attritem.nameCode, attrRes.valueCode, true)">
                    {{attrRes.skuValue}}
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="goodsNum-box flex-row-plus flex-sp-between" :class="{'bottom-line' :supportHuabei}">
            <label class="font-color-999 fs24">数量</label>
            <view class="goodsNum">
              <text class="subtract" @click="updateNumSub()">-</text>
              <text class="goodsNumber" v-model="buyNum">{{buyNum}}</text>
              <text class="add" @click.stop="updateNumAdd()">+</text>
            </view>
          </view>
          <view class="goosDetailbut-box flex-items-plus">
            <button type="default" @click="goodsDateils(shopId,productId,skuId)" >查看详情</button>
            <button type="default" class="submitBtn" @click="submitBtn()">确认</button>
          </view>
        </view>
      </u-popup>

      <!-- #ifdef H5 -->
      <view class="cart-bottom-box-h5">
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <view class="cart-bottom-box-app">
          <!-- #endif -->
          <view class="cart-bottom">
            <view class="left">
              <image mode="aspectFill" v-if="isAllCheck" src="../../../static/images/selectActive.png"
                     class="cart-select-img" @click="allSel(0)"></image>
              <image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png"
                     class="cart-select-img" @click="allSel(1)"></image>
              <text>全选</text>
            </view>
            <view class="right" v-if="btnType == 0">
              <view class="price-box">
                <text>合计：</text>
                <text class="price">¥{{checkMoney}}</text>
              </view>
              <view class="btn-confirm" @click="settlementTap">结算（{{checkNum}}）</view>
            </view>
            <view class="right" v-if="btnType == 1">
              <view class="btn-delete" @click="cartDel">删除</view>
            </view>
          </view>
        </view>
      </view>
    <!-- 购物车为空 -->
    <view v-if="isEmpty" class="emptyCart-box flex-items-plus flex-column">
      <image class="emptyCart-img" src="../../../static/images/cartEmpty.png"></image>
      <label class="font-color-999 fs26 mar-top-30">你的购物车还没有宝贝哦</label>
      <label class="font-color-999 fs26 mar-top-10">快去首页选一个吧～</label>
      <view class="goToShopping" @click="goToShopping">去购物</view>
    </view>

    <!-- 热门推荐 -->
    <HotTemplate />

    <!-- 删除确认弹窗 -->
    <tui-modal :show="cardModal" :custom="true" :fadein="true">
      <view class="Put-box1">
        <view class="text-align fs34 fs-bold">
          温馨提示
        </view>
        <view class="mar-top-40 text-align">
          您确定删除选中的商品吗？
        </view>
        <view class="flex-display flex-sp-between">
          <view class="btn" @click="cardModal = false">
            点错了
          </view>
          <view class="btn submit" @click="doDelete">
            确认删除
          </view>
        </view>
      </view>
    </tui-modal>
  </view>
</template>

<script>
import tuiModal from "@/components/modal/modal";
import HotTemplate from '@/components/hoteRecommed/index.vue'
import api from "../../../components/canvasShow/config/api";
const NET = require('../../../utils/request')
const API = require('../../../config/api')
export default {
	components: {
		tuiModal,
    HotTemplate
	},
	data() {
		return {
			goodsDetailShowFlag: false,
			OriginalSelectedSku: {},
			selectedSku: {},
			productData: [],
			shopId: 0,
			productId: 0,
			skuId: 0,
			selectedAttr: {},
			supportHuabei: false,

			title: 'Hello',
			btnType: 0,
			dataList: [],
			goosDetailshowFlag: false,
			colorActiveId: 1,
			colorList: [{
				id: 1,
				color: '复古蓝色'
			}, {
				id: 2,
				color: '马卡龙粉色'
			}],
			modelNumActiveId: 1,
			modelNumList: [{
				id: 1,
				modelNum: '小号'
			}, {
				id: 2,
				modelNum: '中号'
			}, {
				id: 3,
				modelNum: '大号'
			}],
			skuItemList: [],
			buyNum: 1,
			allNum: 0,
			checkNum: 0,
			checkMoney: 0,
			isAllCheck: true,
			skuProdList: {},
			item: {},
			cardModal: false,
      isEmpty: false
		}
	},
	computed: {
		// 计算显示tabBar购物车数量
		getCartNum() {
			let cartNum = 0
			this.updateMoneyAndNum()
			cartNum = this.allNum
			if (cartNum > 0) {
				uni.setTabBarBadge({
					index: 2,
					text: cartNum.toString()
				})
			} else {
				uni.removeTabBarBadge({
					index: 2
				})
			}
			uni.setStorageSync('allCartNum', cartNum)
			console.log(uni.getStorageSync('allCartNum'), '1111')
		}
	},
	onLoad() {

	},
	onShow() {
		//判断是否登录
		/* let item = {}
		if(uni.getStorageSync('storage_key')){
			item = uni.getStorageSync('storage_key');
		}
		console.dir(item) */
		/* if(JSON.stringify(item) == '{}'){
			uni.navigateTo({
				url:'../../../pages_category_page2/userModule/login'
			})
		}else{ */
    this.isEmpty = false
    this.dataList = []
		this.getDataList()
		/* } */
	},
	methods: {

		// 提交更换商品规格
		submitBtn() {
			console.log(this.selectedSku.skuId,'this.selectedSku.skuId')
			console.log(this.skuId,'this.skuId')
			NET.request(API.UpdateSkuCart, {
					skuId: this.skuId,
					newSkuId: this.selectedSku.skuId,
					number: this.buyNum
				},
				"POST").then(res => {
				this.goodsDetailShowFlag = false
				this.getDataList()
			})
		},

		// 购物车修改属性样式时:数量减
		updateNumSub() {
			if (this.buyNum > 1) {
				this.buyNum = this.buyNum - 1
			} else {
				uni.showToast({
					title: '亲！至少一件哦！',
					icon: "none"
				})
			}
		},
    // 获取匹配组合定价价格
    getData(item, index) {
      if (item.ids) {
        console.log(item.ids, 'ids')
        NET.request(api.getPrices, {
          shopId: item.shopId,
          ids: item.ids,
          page: 1,
          pageSize: 10
        }, 'GET').then(res => {
          let rules = []
          rules = res.data
          this.dataList[index].rules = rules[0].rules
          for (let i = 0; i < this.dataList[index].rules.length; i++) {
            // console.log(this.dataList[index].rules[i].number, this.dataList[index].priceNumber, 'fsdfsdfsdfs')
            if (this.dataList[index].rules[i].number === this.dataList[index].priceNumber) {
              this.dataList[index].currentRules = this.dataList[index].rules[i]
              console.log(this.dataList[index].currentRules, '==', this.dataList[index].rules[i])
              this.$forceUpdate()
              break
            } else if (this.dataList[index].rules[this.dataList[index].rules.length - 1].number < this.dataList[index].priceNumber) {
              this.dataList[index].currentRules = this.dataList[index].rules[this.dataList[index].rules.length - 1]
              this.$forceUpdate()
              break
            }
          }
        }).catch(res => {
        })
      }
    },
		// 购物车修改属性样式时:数量加
		updateNumAdd() {
			if (this.buyNum < this.selectedSku.stockNumber) {
				this.buyNum = this.buyNum + 1
			} else {
				uni.showToast({
					title: '库存不足！',
					icon: "none"
				})
			}
		},
		//获取商品详情
		queryProductDetail() {
			uni.showLoading({
        mask: true,
				title: '加载中...'
			})
			NET.request(API.QueryProductDetail, {
					shopId: this.shopId,
					productId: this.productId,
					skuId: this.skuId,
					terminal: 1
				},
				"GET").then(res => {
				uni.hideLoading()
				this.productData = res.data

				this.markTools = res.data.markTools //平台优惠券
				this.shopMarkTools = res.data.shopMarkTools //店铺优惠券

				//如果是单款式商品，需要特殊处理productData.names
				const mapKeys = Object.keys(this.productData.map)
				if (mapKeys.length === 1 && mapKeys[0] === '单款项') {
					this.productData.names[0].values.push({
						skuValue: '单款项',
						valueCode: '单款项'
					})
				}

				//如果sku的图像为空，设置为商品的图像
				for (var key in this.productData.map) {
					let skuImage = this.productData.map[key].image
					if (!skuImage) {
						this.productData.map[key].image = this.productData.images[0]
					}
				}

				//评价
				this.commentList = res.data.comments
				this.commentListLength = this.commentList.length
				this.sellDescList = res.data.text.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto" ')
				this.couponListLength = res.data.couponImages.length
				this.showVOList = res.data.couponImages
				this.couponList = res.data.markTools

				//渲染商详之后，如果参数传了skuId，则选中该skuId，否则选中第一个规格
				if (this.skuId) {
					this.selectBySkuId(this.skuId)
					console.log(this.skuId, 'this.skuId2222')
				} else {
					for (var attr in this.productData.names) {
						this.nameCodeValueCodeClick(attr.nameCode, attr.values[0].valueCode, true)
					}
				}

				this.beginTimer();
			}).catch(res => {
				uni.hideLoading()
			})

		},

		selectBySkuId(skuId) {
			if (skuId) {
				let mapinfo = this.productData.map
				for (var key in mapinfo) {
					if (parseInt(mapinfo[key].skuId) === parseInt(skuId)) {
						this.selectedSku = mapinfo[key]
						// 选中sku对应的规格
						const valueCodeList = key.split(',')
						this.productData.names.forEach(attr => {
							for (var index in attr.values) {
								let valueCode = attr.values[index].valueCode
								if (valueCodeList.includes(valueCode)) {
									this.nameCodeValueCodeClick(attr.nameCode, valueCode, false)
									break
								}
							}
						})
						break
					}
				}
			}
		},

		nameCodeValueCodeClick(nameCode, valueCode, reSelectSku) {
			this.selectedAttr[nameCode] = valueCode
			if (reSelectSku) {
				let attrList = []
				for (var key in this.selectedAttr) {
					attrList.push(this.selectedAttr[key])
				}
				const attrkey = attrList.join(',')
				let mapinfo = this.productData.map
				for (var key in mapinfo) {
					if (attrkey === key) {
						this.selectedSku = mapinfo[key]
					}
				}
			}

			// 选中sku之后，做一些相应的操作
			// this.selectSkuPostProcessor()

			this.$forceUpdate(); // 重绘
		},

		selectSkuPostProcessor() {
			const ifEnable = this.selectedSku.ifEnable
			if (this.selectedSku.activityType === 1 && ifEnable === 0) {
				this.topThreeCollageOrders = this.selectedSku.collageOrders.slice(0, 3)
			}
			if ([1, 2, 3, 4, 5].includes(this.selectedSku.activityType) && ifEnable === 0) {
				this.dateformat(this.selectedSku.endTime)
				this.countDown();
			}
			this.timeActivetype = ifEnable === 0;
			this.shopDiscountId = this.selectedSku.shopDiscountId
			this.shopSeckillId = this.selectedSku.shopSeckillId
		},

		// 更换商品样式
		changeSkuItemValue(skuItem, shopId) {
			this.OriginalSelectedSku = skuItem
			this.shopId = shopId
			this.productId = skuItem.productId
			this.skuId = skuItem.skuId
			this.buyNum = this.OriginalSelectedSku.number
			this.queryProductDetail()
			setTimeout(() => {
				this.goodsDetailShowFlag = true
			}, 1000)
		},
		//逛店铺
		goStore(index) {
			uni.navigateTo({
				url: '../../../pages_category_page1/store/index?storeId=' + this.dataList[index].shopId
			})
		},
		//商品详情
		goodsDateils(shopId, productId, skuId) {
			uni.navigateTo({
				url: '../../../pages_category_page1/goodsModule/goodsDetails?shopId=' + shopId +
					'&productId=' + productId + '&skuId=' + skuId
			})
		},
		// 去首页
		goToShopping() {
			uni.switchTab({
				url: '../../../pages/tabbar/index/index'
			})
		},
		btnTypeClick(type) {
			this.btnType = type
		},
		getDataList() {
			uni.showLoading({
        mask: true,
				title: '加载中...',
			})
			NET.request(API.ShoppingCart, {}, 'GET').then(res => {
        uni.hideLoading()
				this.dataList = res.data
        this.updateMoneyAndNum()
        this.allNum = this.dataList.length
        if (this.dataList.length === 0) {
          this.isEmpty = true
        }
        let recheck = false
				this.dataList.forEach((item, index) => {
          item['currentIds'] = []
          item['priceNumber'] = 0
          item['rules'] = []
          item['currentRules'] = {}
          item['ids'] = 0
					for (let i = item.skus.length-1; i >= 0; i--) {
						if (item.skus[i].shelveState === 0) {
							item.skus.splice(i, 1)
              if(item.skus.length === 0){
                recheck = true
              }
						} else {
              if (item.skus[i].activityType === 6 && item.skus[i].selected === 1){
                item.currentIds.push(item.skus[i].priceId)
                item.priceNumber += item.skus[i].number
              }
            }
					}
          for (let i = 0; i < item.skus.length; i++) {
            if (item.skus[i].activityType === 6) {
              item.ids = item.skus[i].priceId
              break
            }
          }
          this.getData(item, index)
				})
        // 重新检查是不是全为空
        if(recheck){
          let isEmpty = true
          this.dataList.forEach((item, index) => {
            if(item.skus.length !== 0){
              isEmpty = false
            }
          })
          this.isEmpty = isEmpty
        }
			}).catch(res => {
        uni.hideLoading()
			})
		},
		// 数量减
		numSub(index, cIndex) {
      this.dataList[index].priceNumber = 0
      if (this.dataList[index].skus[cIndex].number > 1) {
				this.dataList[index].skus[cIndex].number = this.dataList[index].skus[cIndex].number - 1
        this.dataList[index].priceNumber = 0
        this.priceFn(index)
				this.updateCart(this.dataList[index].skus[cIndex].skuId, this.dataList[index].skus[cIndex].number)
			} else {
				uni.showToast({
					title: '亲！至少一件哦！',
					icon: "none"
				})
			}
		},
		// 数量加
		numAdd(index, cIndex) {
			console.log('点击')
      this.dataList[index].priceNumber = 0
			if (this.dataList[index].skus[cIndex].number <= 100) {
				this.dataList[index].skus[cIndex].number = this.dataList[index].skus[cIndex].number + 1
        this.dataList[index].priceNumber = 0
        this.priceFn(index)
				this.updateCart(this.dataList[index].skus[cIndex].skuId, this.dataList[index].skus[cIndex].number)
			} else {
				wx.showToast({
					title: '库存不足！',
					icon: 'none'
				})
			}
		},
		updateMoneyAndNum() {
      console.log('test111')
			this.isAllCheck = true
			this.allNum = 0
			this.checkNum = 0
			this.checkMoney = 0
			let len = this.dataList.length
			for (let i = 0; i < len; i++) {
				let len2 = this.dataList[i].skus.length
				for (let j = 0; j < len2; j++) {
					let item = this.dataList[i].skus[j]
					this.allNum += item.number
					if (item.selected == 1) {
						this.checkNum++
						this.checkMoney += parseFloat(item.price * item.number)
					} else {
						if (this.isAllCheck) {
							this.isAllCheck = false
						}
					}
				}
			}
			this.checkMoney = parseFloat(this.checkMoney.toFixed(10))
			uni.setStorageSync('allCartNum', this.allNum)
			if (this.allNum > 0) {
				uni.setTabBarBadge({
					index: 2,
					text: (this.allNum).toString()
				})
			} else {
				uni.removeTabBarBadge({
					index: 2
				})
			}
		},
		updateShopSel(index, type) {
      this.dataList[index].currentRules = {}
      this.dataList[index].priceNumber = null
      console.log(index, 'index', type, 'type')
			let shopCarts = [{
				shopId: '',
				skus: []
			}]
			this.dataList[index].selected = type
			let len = this.dataList[index].skus.length
			for (let i = 0; i < len; i++) {
				this.dataList[index].skus[i].selected = type
				var skusobj = {};
				skusobj["skuId"] = this.dataList[index].skus[i].skuId;
				skusobj["selected"] = this.dataList[index].skus[i].selected
				shopCarts[0].skus.push(skusobj);
			}
			shopCarts[0].shopId = this.dataList[index].shopId
      this.priceFn(index)
			this.updateSelected(shopCarts)
      this.$forceUpdate()
		},
		//选中商品
		updateSelected(shopCarts) {
			this.updateMoneyAndNum()
			NET.request(API.SelectedCart, {
				shopCarts
			}, 'POST').then(res => {}).catch(res => {

			})
		},
		updateCart(skuId, number) {
			NET.request(API.UpdateNumberCart, {
				skuId: skuId,
				number: number
			}, 'POST').then(res => {
				this.updateMoneyAndNum()
			}).catch(res => {

			})
		},
		cartItemSel(index, cIndex, type) {
      this.dataList[index].currentRules = {}
      this.dataList[index].priceNumber = 0
			let shopCarts = [{
				shopId: 0,
				skus: []
			}]
			this.dataList[index].skus[cIndex].selected = type
			if (type == 1) {
				let len = this.dataList[index].skus.length
				let shopType = 1
				for (let i = 0; i < len; i++) {
					if (this.dataList[index].skus[i].selected == 0) {
						shopType = 0
						break
					}
				}
				this.dataList[index].selected = shopType
			} else {
				this.dataList[index].selected = type
			}
      this.priceFn(index)
			shopCarts[0].shopId = this.dataList[index].shopId
			var skusobj = {};
			skusobj["skuId"] = this.dataList[index].skus[cIndex].skuId;
			skusobj["selected"] = this.dataList[index].skus[cIndex].selected;
			shopCarts[0].skus.push(skusobj);
			this.updateSelected(shopCarts)
		},
    // 组合定价
    priceFn(shopIndex) {
      this.dataList[shopIndex].currentRules = {}
      this.dataList[shopIndex].skus.forEach((item) => {
        if (item.activityType === 6 && item.selected === 1) {
          this.dataList[shopIndex].priceNumber += item.number
        }
      })
      for (let i = 0; i < this.dataList[shopIndex].rules.length; i++) {
        if (this.dataList[shopIndex].rules[i].number === this.dataList[shopIndex].priceNumber) {
          this.dataList[shopIndex].currentRules = this.dataList[shopIndex].rules[i]
          console.log(this.dataList[shopIndex].currentRules, '==', this.dataList[shopIndex].rules[i])
          this.$forceUpdate()
          break
        } else if (this.dataList[shopIndex].rules[this.dataList[shopIndex].rules.length - 1].number < this.dataList[shopIndex].priceNumber) {
          this.dataList[shopIndex].currentRules = this.dataList[shopIndex].rules[this.dataList[shopIndex].rules.length - 1]
          this.$forceUpdate()
          break
        }
      }
    },
		//全选
		allSel(type) {
			this.updateAllSel(type)
		},
		updateAllSel(type) {
      console.log(type, 'type')
			let len = this.dataList.length
			for (let i = 0; i < len; i++) {
				let len2 = this.dataList[i].skus.length
				this.dataList[i].selected = type
        let priceNum = 0
				for (let j = 0; j < len2; j++) {
					this.dataList[i].skus[j].selected = type
          if (this.dataList[i].skus[j].selected === 1 && this.dataList[i].skus[j].activityType === 6) {
            priceNum += this.dataList[i].skus[j].number
          }
				}
        this.dataList[i].priceNumber = priceNum
        this.dataList[i].rules.forEach((item => {
          if (item.number <= this.dataList[i].priceNumber) {
            this.dataList[i].currentRules = item
            console.log(this.dataList[i].currentRules, 'currentRules')
          }
        }))
			}
      if (type === 0) {
        this.dataList.forEach((item) => {
          item.currentRules = {}
        })
      }
			let shopCarts = []
			this.updateSelected(shopCarts)
		},
		//点击删除
		cartDel() {
			if (!this.checkNum) {
				uni.showToast({
					title: '请先选择对应商品',
					icon: 'none'
				})
				return;
			}
			this.cardModal = true
		},
		//删除购物车
		doDelete() {
			this.cardModal = false
			let cartList = []
			let n = 0
			let skus = []
			let len = this.dataList.length
			for (let i = 0; i < len; i++) {
				let item = {}
				let len2 = this.dataList[i].skus.length

				for (let j = 0; j < len2; j++) {
					let itemGoods = this.dataList[i].skus[j]
					if (itemGoods.selected == 1) {
						skus[n] = itemGoods.skuId
						n = n + 1
					}
				}
			}
			NET.request(API.DeleteCart, {
				ids: skus
			}, 'POST').then(res => {
				this.getDataList()

			}).catch(res => {

			})

		},
		//结算购物车
		settlementTap() {
			if (!this.checkNum) {
				wx.showToast({
					title: '请先选择对应商品',
					icon: 'none'
				})
				return;
			}
			let addCart = []
			let len = this.dataList.length
			for (let i = 0; i < len; i++) {
				let shopObj = {}
				shopObj["shopId"] = this.dataList[i].shopId
				shopObj["skus"] = []
				let len2 = this.dataList[i].skus.length
				for (let j = 0; j < len2; j++) {
					let skusObj = {}
					skusObj["ifLogistics"] = this.dataList[i].skus[j].ifLogistics
					skusObj["number"] = this.dataList[i].skus[j].number
					skusObj["selected"] = this.dataList[i].skus[j].selected
					skusObj["skuId"] = this.dataList[i].skus[j].skuId
					shopObj.skus.push(skusObj)
				}
				addCart.push(shopObj)
			}
			let newArray = []
			addCart.forEach((item, index) => {
				newArray[index] = item
				newArray[index].skus = item.skus.filter((item) => {
					return item.selected == 1
				})
				if (item.skus.length == 0) {
					newArray.splice(index, 1);
				}
			})
			newArray = newArray.filter(d => d)
			uni.setStorageSync('skuItemDTOList', newArray)
			uni.navigateTo({
				url: '../../../pages_category_page1/orderModule/orderConfirm?type=2'
			})
		},
		//商品尺寸弹窗
		goosDetailshowClick(storeId, skuItemId) {
			this.goosDetailshowFlag = true
			this.colorActiveClick(storeId, skuItemId)
		},
		//颜色选中事件
		colorActiveClick(storeId, attrItemId) {
			this.colorActiveId = attrItemId
			NET.request(API.QueryProductSku, {
				productId: storeId,
				skuValueIdList: [attrItemId]
			}, 'POST').then(res => {
				if (res.code === 0) {
					this.skuProdList = res.data
					this.skuProdId = res.data.id
					this.skuImg = res.data.skuImg
					this.skuNameStr = res.data.skuNameStr
					this.skuPrice = res.data.skuPrice
				}

			}).catch(res => {

			})
		},
	}
}
</script>

<style lang="scss" scoped>
	page {
		// background: #f7f7f7;
	}

	.content {
		padding: 0 0 110rpx;
		overflow: hidden;

		.goosDetailshow-box {
			.detailImg-box {
				margin-top: 30upx;
				margin-left: 30upx;
				border-radius: 10upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
				width: 690upx;

				.detailImg {
					width: 180upx;
					height: 180upx;
				}
			}

			.color-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.colorName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.colorName {
						background-color: #FFFFFF;
						margin-left: 30upx;
						padding: 10upx 32upx;
						font-size: 26upx;
						border: 2rpx solid #E4E5E6;
						z-index: 2;
						color: #333333;
					}

					.colorName-on {
						box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
						color: #C5AA7B;
						margin-left: 30upx;
						padding: 10upx 32upx;
						font-size: 26upx;
						text-align: center;
						z-index: 1;
						border: none;
					}
				}

			}

			.modelNum-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.modelNumName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.modelNumName-on {
						background-color: #FFE4D0;
						color: #FF7800;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #FF7800;
						font-size: 26upx;
						text-align: center;
					}

					.modelNumName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
					}
				}
			}

			.goodsNum-box {
				padding: 30upx 30upx;
				width: 100%;
				padding-bottom: 140upx;
				.goodsNum {
					height: 50upx;

					text {
						display: inline-block;
						width: 50upx;
						height: 50upx;
						border: 1upx solid #999999;
						text-align: center;
						// line-height: 50upx;
					}

					.subtract {
						border-right: 0upx;
					}

					.add {
						border-left: 0upx;
					}
				}
			}

			.bottom-line {
				border-bottom: 1upx solid #EDEDED;
			}

			.huabei-box {
				padding: 30upx 30upx;
				width: 690upx;

				.fenqi-box {
					margin-top: 15upx;
					width: 120%;

					.huabei-item {
						display: inline-block;
						background: #f3f3f3;
						padding: 16upx 24upx;
						margin: 5upx 10upx;
						border-radius: 15upx;
						text-align: center;
						font-size: 7upx;

						.huabei-period {
							display: block;
						}
					}

					.fenqi-on {
						border: 1px solid #EF7F93;
						color: #EF7F93;
					}

					.disabled {
						color: #cacaca;
					}
				}
			}

			.goosDetailbut-box {
				justify-content: center;
				margin-bottom: 48rpx;

				button {
					width: 342rpx;
					height: 100rpx;
					line-height: 100rpx;
					font-size: 28rpx;
					border: 1px solid;
					border-radius: 0;
				}

				.submitBtn {
					color: #FFEBC4;
					background: #333333;
				}


			}
		}

		.Put-box1 {
			.btn {
				text-align: center;
				margin-top: 40rpx;
				border: 1px solid #333333;
				height: 80upx;
				line-height: 80upx;
				width: 240upx;
				color: #333333;
			}

			.submit {
				background-color: #333333;
				color: #FFEBC4;
			}
		}

		.cart-bg {
			width: 100%;
			height: 180rpx;

			.cart-num-box {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				image {
					width: 286rpx;
					height: 72rpx;
				}

				.btn-box {
					font-size: 30rpx;
					color: #333333;
					padding: 30rpx;
					box-sizing: border-box;
					display: inline-block;
				}
			}

			.num-box {
				padding: 30rpx 0 30rpx 30rpx;
				box-sizing: border-box;
				font-size: 30rpx;
				color: #C5CACF;
			}
		}

		.cart-list-box {
			box-sizing: border-box;
      .itemBox {
        .item {
          background: #fff;
          border-bottom: 16rpx solid #F8F9FA;
          .shop-box {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #eee;
            position: relative;
            .cart-select-img {
              width: 40rpx;
              height: 40rpx;
              margin: 30rpx;
              box-sizing: border-box;
            }

            .shop-name-box {
              display: flex;
              flex-direction: row;
              align-items: center;

              .shop-img {
                width: 36rpx;
                height: 36rpx;
                margin-right: 10rpx;
              }

              .shop-name {
                font-size: 30rpx;
                color: #333;
                font-weight: bold;
                display: inline-block;
                margin-left: 10rpx;
              }

              .arrow-right-img {
                width: 30rpx;
                height: 30rpx;
                box-sizing: border-box;
                margin-left: 30rpx;
                position: absolute;
                right: 30rpx;
              }
            }
          }
          .rulesBox {
            height: 86rpx;
            background: #F9F6F1;
            padding: 0 20rpx;
            image {
              width: 126rpx;
              height: 46rpx;
            }
          }
          .product-list-box {
            .pro-item {
              display: flex;
              flex-direction: row;
              align-items: center;

              .cart-select-img {
                width: 40rpx;
                height: 40rpx;
                margin: 30rpx;
                box-sizing: border-box;
              }

              .pro-r {
                flex: 1;
                border-bottom: 1px solid #eee;
                display: flex;
                flex-direction: row;
                padding: 30rpx 30rpx 30rpx 0;
                box-sizing: border-box;
                overflow: hidden;

                .pro-img {
                  width: 180rpx;
                  height: 180rpx;
                  border-radius: 10rpx;
                  margin-right: 30rpx;
                }

                .pro-r-r {
                  flex: 1;
                  font-size: 26rpx;
                  color: #333;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;

                  .pro-name {
                    height: 66rpx;
                    line-height: 33rpx;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                  }

                  .sku-box {
                    width: auto;
                    display: inline;
                    height: 40rpx;
                    border-radius: 4rpx;
                    padding: 0 0 0 10rpx;
                    box-sizing: border-box;
                    font-size: 24rpx;
                    color: #999;

                    text {
                      border: 2rpx solid #E4E5E6;
                      padding: 2rpx 10rpx;
                    }
                  }

                  .pro-price-num-box {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;

                    .pro-price-box {
                      font-size: 36rpx;
                      color: #333333;
                      font-weight: 400;

                      .fuhao {
                        font-size: 24rpx;
                      }
                    }

                    .pro-num-box {
                      width: 140rpx;
                      height: 40rpx;
                      border: 1px solid #ddd;
                      border-radius: 4rpx;
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      overflow: hidden;
                      .num-btn {
                        font-size: 34rpx;
                        color: #999999;
                        display: inline-block;
                        width: 40rpx;
                        text-align: center;
                        line-height: 32rpx;
                        height: 40rpx;
                      }

                      .num-btn.r {
                        border-right: 1px solid #ddd;
                      }

                      .num-btn.l {
                        border-left: 1px solid #ddd;
                      }

                      .num {
                        font-size: 26rpx;
                        color: #333;
                      }
                    }
                  }
                }
              }
            }

            .pro-item:last-of-type .pro-r {
              border-bottom: none;
            }
          }
        }
      }
      .itemBox:first-child {
        .shop-box {
          border-top: 2rpx solid #eee;
        }
      }
      .itemBox:last-child {
        .item {
          border-bottom: none;
        }
      }
		}

		.emptyCart-box {
			margin: 100rpx 0;

			.emptyCart-img {
				width: 216rpx;
				height: 156rpx;
			}

			.goToShopping {
				width: 282rpx;
				height: 84rpx;
				line-height: 84rpx;
				text-align: center;
				background: #333333;
				margin-top: 40rpx;
				color: #FFEBC4;
				font-size: 28rpx;
			}
		}

		.cart-bottom-box-h5 {
			position: fixed;
			bottom: 100rpx;
			width: 100%;
		}

		.cart-bottom-box-app {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
		}

		.cart-bottom {
			height: 120rpx;
			background: #fff;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-top: 1rpx solid #eee;
		}

		.left {
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 28rpx;
			color: #666;

			.cart-select-img {
				width: 40rpx;
				height: 40rpx;
				margin: 30rpx;
				box-sizing: border-box;
			}
		}

		.right {
			display: flex;
			flex-direction: row;
			align-items: center;
			box-sizing: border-box;

			.price-box {
				font-size: 30rpx;
				color: #333;

				.price {
					font-size: 40rpx;
					color: #C83732;
					font-weight: bold;
				}
			}

			.btn-confirm {
				width: 232rpx;
				height: 120rpx;
				background: #333333;
				margin-left: 18rpx;
				text-align: center;
				line-height: 120rpx;
				font-size: 28rpx;
				color: #FFEBC4;
			}

			.btn-delete {
				width: 232rpx;
				height: 120rpx;
				line-height: 120rpx;
				text-align: center;
				font-size: 28rpx;
				color: #FFFFFF;
				background: #C83732;
			}
		}

		.goosDetailshow-box {
			.detailImg-box {
				margin-top: 30rpx;
				margin-left: 30rpx;
				border-radius: 10rpx;
				border-bottom: 1rpx solid #EDEDED;
				padding-bottom: 20rpx;
				width: 690rpx;

				.detailImg {
					width: 180rpx;
					height: 180rpx;
				}
			}

			.color-box {
				padding: 30rpx 30rpx;
				border-bottom: 1rpx solid #EDEDED;
				width: 690rpx;
				.skuStyle{
					padding: 20rpx 0;
				}

				.skuStyle:nth-child(2) {
					border-top: 1px solid #F3F4F5;
				}

				.colorName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30rpx;
					margin-left: -30rpx;

					.colorName-on {
						background-color: #FFE5D0;
						color: #C5AA7B;
						margin-left: 30rpx;
						padding: 10rpx 32rpx;
						border-radius: 28rpx;
						border: 1rpx solid #C5AA7B;
						font-size: 26rpx;
						text-align: center;
						z-index: 1;
					}

					.colorName {
						background-color: #F5F5F5;
						margin-left: 30rpx;
						padding: 10rpx 32rpx;
						border-radius: 28rpx;
						font-size: 26rpx;
						z-index: 2;
					}
				}

			}

			.modelNum-box {
				padding: 30rpx 30rpx;
				border-bottom: 1rpx solid #EDEDED;
				width: 690rpx;

				.modelNumName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30rpx;
					margin-left: -30rpx;

					.modelNumName-on {
						background-color: #FFE4D0;
						color: #C5AA7B;
						margin-left: 30rpx;
						padding: 10rpx 32rpx;
						border-radius: 28rpx;
						border: 1rpx solid #C5AA7B;
						font-size: 26rpx;
						text-align: center;
					}

					.modelNumName {
						background-color: #F5F5F5;
						margin-left: 30rpx;
						padding: 10rpx 32rpx;
						border-radius: 28rpx;
						font-size: 26rpx;
					}
				}
			}

			.goodsNum-box {
				padding: 30rpx 30rpx;
				width: 690rpx;
				padding-bottom: 140rpx;

				.goodsNumber {
					text-align: center;
					border: 1rpx solid #999999;
					padding: 3rpx 20rpx;
				}

				.subtract {
					border: 1rpx solid #999999;
					padding: 3rpx 20rpx;
					margin-right: -1rpx;
				}

				.add {
					border: 1rpx solid #999999;
					padding: 3rpx 20rpx;
					margin-left: -1rpx;
				}
			}

			.goosDetailbut-box {
				.joinShopCartBut {
					width: 343rpx;
					height: 80rpx;
					background-color: #FFC300;
					color: #FFFEFE;
					font-size: 28rpx;
					line-height: 80rpx;
					text-align: center;
					margin-left: 30rpx;
				}

				.buyNowBut {
					width: 343rpx;
					height: 80rpx;
					border-radius: 0 40rpx 40rpx 0;
					background-color: #FF6F00;
					color: #FFFEFE;
					font-size: 28rpx;
					line-height: 80rpx;
					text-align: center;
				}
			}
		}
	}
</style>
