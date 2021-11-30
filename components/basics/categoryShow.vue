<template>
  <view class="goodRecommend">
    <view class="product-list" v-if="productList.length>0">
      <view class="product-list-box" >
        <view class="product-list-item-warp" v-for="(item,index) in productList" :key="index">
          <view class="product-list-item">
            <view class="product-list-img" @click="jumpProductDetail(item)">
              <img v-show="item.image" class="img" :src="item.image">
            </view>
            <view class="product-list-info">
              <view class="product-name">{{item.productName}}</view>
              <view>
                <view class="shop-box" @click.stop="jumpStore(item)">
                  <view class="shop-name" @click="jumpProductDetail(item)">{{item.shopName}}</view>
                  <view class="shop-logo">
                    <img :src="item.shopLogo">
                  </view>
                </view>
                <view class="buy-count">{{item.users?item.users: 0}}人付款</view>
              </view>
              <view class="price-warp">
                <view class="price">
                  ¥ {{item.price}}
                </view>
                <view class="original-price">
                  ¥ {{item.originalPrice}}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="emptyCart-box flex-items-plus flex-column">
        <image class="emptyCart-img" src="@/static/img/bgnull.png" mode="widthFix" />
        <label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
    </view>
  </view>
</template>

<script>
const NET = require('@/utils/request')
const API = require('@/config/api')
export default {
name: "categoryShow",
  props: {
    categoryid: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeTab: 0,
      page:1,
      pageSize:10,
      total: 0,
      productList: []
    }
  },
  mounted () {
    this.getData();
  },
  methods:{
    getData(){
      uni.showLoading({
        title:'加载中...'
      })
      NET.request(API.getProducts, {
        classifyId: this.categoryid,
        page:this.page,
        pageSize:this.pageSize
      }, 'GET').then(res => {
        this.productList = res.data.list
        uni.hideLoading()
      }).catch(res => {
        uni.hideLoading()
      })
    },
    // 跳转到店铺主页
    jumpStore(item){
      uni.navigateTo({
        url: `/pages_category_page1/store/index?storeId=${item.shopId}`
      })
    },
    // 跳转到商品详情
    jumpProductDetail(item){
      uni.navigateTo({
        url: '/pages_category_page1/goodsModule/goodsDetails?shopId=' + item.shopId + '&productId=' + item.productId + '&skuId=' + item
            .skuId
      })
    }
  },
  watch: {
    'categoryid': {
      handler(newVal, oldVal) {
        this.getData()
      },
      deep: true
    }
  },
}
</script>

<style lang="scss" scoped>
.goodRecommend {
  padding-top: 20rpx;
  .product-list {
    position: relative;
    padding: 0 13upx;
    &-box {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      &.swiper{
        height: 620upx;
      }
    }
    &.product-swiper .product-list-box{
      padding-left: 0;
    }
    &-item-warp{
      margin: 0 0 20upx 0;
    }
    &-item {
      width: 348upx;
      padding: 0 7upx;
      box-sizing: content-box;
    }
    &-img {
      width: 348upx;
      height: 348upx;
      background-color: #d0d0d0;
      border-radius: 10upx 10upx 0 0;
      .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &-info {
      background-color: #FFFFFF;
      //box-shadow: 0px 0px 15px 0px rgba(52, 52, 52, 0.15);
      border-radius: 0 0 10upx 10upx;
      padding: 20upx;
      label{
        font-weight: normal;
      }
      .product-name{
        font-size: 28upx;
        color: #333;
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin-bottom: 18upx;
        line-height: 40upx;
      }
      .shop-box{
        background-color: #333333;
        border-radius: 0upx 20upx 20upx 0upx;
        line-height: 40upx;
        display: inline-block;
        height: 40upx;
        margin-right: 10upx;
        float: left;
        .shop-name{
          font-size: 20upx;
          color: #FFEBC4;
          padding: 0 8upx 0 12upx;
          line-height: 40upx;
          display: inline-block;
          float: left;
        }
        .shop-logo{
          border: 2upx solid #707070;
          border-radius: 50%;
          overflow: hidden;
          float: right;
          img{
            width: 34upx;
            height: 34upx;
            display: block;
          }
        }
      }
      .buy-count{
        color: #C5AA7B;
        font-size: 20upx;
        margin-bottom: 16upx;
        border: 2upx solid #E4E5E6;
        line-height: 36upx;
        padding: 0 5upx;
        display: inline-block;

      }
      .price-warp{
        display: flex;
        align-items: baseline;
        line-height: 56upx;
        .price{
          color: #C83732;
          font-size: 40upx;
          margin-right: 20upx;
        }
        .original-price{
          font-size: 24upx;
          color: #ccc;
          text-decoration: line-through;
        }
      }
    }
  }
  .emptyCart-box {
    margin-top: 70rpx;
    .emptyCart-img {
      width: 216rpx;
      height: 156rpx;
    }
  }
}
</style>
