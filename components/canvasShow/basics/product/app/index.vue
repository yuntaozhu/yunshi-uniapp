<template>
  <div class="hom-pro-list">
    <div class="title">
      <!-- #ifdef MP-WEIXIN -->
      <img class="title-img" src="../../../static/images/product/img-title.png" alt="商品推荐" mode="widthFix"/>
      <!-- #endif -->
      <!-- #ifdef H5 || APP-PLUS -->
      <image class="title-img" src="../../../static/images/product/img-title.png" alt="商品推荐" mode="widthFix"/>
      <!-- #endif -->
    </div>
    <div v-if="componentContent.arrangeType == '横向滑动' && productData.length > 2" class="product-list">
      <swiper ref="mySwiper" class="swiper product-list-box" :circular="true" :indicator-dots="false" :autoplay="true" :display-multiple-items="2" @change="swiperChange">
        <swiper-item class="product-list-item-warp" v-for="(item,index) in productData" :key="index" @click="jumpProductDetail(item)">
          <div class="product-list-item">
            <div class="product-list-img">
              <img class="img pic-img default-img" :src="item.image">
            </div>
            <div class="product-list-info">
              <label class="product-name">{{item.productName}}</label>
              <div class="flex">
                <div class="shop-box" v-if="typeId == 1" @click.stop="jumpStore(item)">
                  <label class="shop-name">{{item.shopName}}</label>
                  <div class="shop-logo">
                    <img :src="item.shopLogo">
                  </div>
                </div>
                <label class="buy-count">{{item.users?item.users: 0}}人付款</label>
              </div>
              <div class="price-warp">
                <!-- #ifdef MP-WEIXIN -->
                <img class="iconImg" v-if="item.activityType == 1" src="../../../static/images/groupBuyIcon.png">
                <img class="iconImg" v-if="item.activityType == 2" src="../../../static/images/spikeIcon.png">
                <img class="iconImg" v-if="item.activityType == 4" src="../../../static/images/spikeIcon.png">
                <img class="iconImg" v-if="item.activityType == 3" src="../../../static/images/discountListIcon.png">
                <img class="iconImg" v-if="item.activityType == 5" src="../../../static/images/discountListIcon.png">
                <img class="iconImg" v-if="item.activityType == 9" src="../../../static/images/memberCenterIcon.png">
				<img class="iconImg" v-if="item.activityType == 8" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/d0d8d96f28904167b271de4ae924d1a8_sceneMarketing.png">
                <!-- #endif -->
                <!-- #ifdef H5 || APP-PLUS -->
                <image class="iconImg" v-if="item.activityType == 1" src="../../../static/images/groupBuyIcon.png">
                <image class="iconImg" v-if="item.activityType == 2" src="../../../static/images/spikeIcon.png">
                <image class="iconImg" v-if="item.activityType == 4" src="../../../static/images/spikeIcon.png">
                <image class="iconImg" v-if="item.activityType == 3" src="../../../static/images/discountListIcon.png">
                <image class="iconImg" v-if="item.activityType == 5" src="../../../static/images/discountListIcon.png">
                <image class="iconImg" v-if="item.activityType == 9" src="../../../static/images/memberCenterIcon.png">
				<image class="iconImg" v-if="item.activityType == 8" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/d0d8d96f28904167b271de4ae924d1a8_sceneMarketing.png">
                <!-- #endif -->
                <div class="price">
                  ¥ {{item.price}}
                </div>
                <div class="original-price">
                  ¥ {{item.originalPrice}}
                </div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <view class="swiper-dots" v-if="productData && productData.length > 2">
        <text class="dot" :class="index - swiperCurrent <= 1 && index - swiperCurrent >=0  && 'dot-active'" v-for="(dot, index) in productData.length"
              :key="index"></text>
      </view>
    </div>
    <div v-else class="product-list">
      <div class="product-list-box" >
        <div class="product-list-item-warp" v-for="(item,index) in productData" :key="index" @click="jumpProductDetail(item)">
          <div class="product-list-item">
            <div class="product-list-img">
              <img class="img pic-img default-img" :src="item.image">
            </div>
            <div class="product-list-info">
              <label class="product-name">{{item.productName}}</label>
              <div class="flex">
                <div class="shop-box" v-if="typeId == 1" @click.stop="jumpStore(item)">
                  <label class="shop-name">{{item.shopName}}</label>
                  <div class="shop-logo">
                    <img :src="item.shopLogo">
                  </div>
                </div>
                <label class="buy-count">{{item.users?item.users: 0}}人付款</label>
              </div>
              <div class="price-warp">
                <!-- #ifdef MP-WEIXIN -->
                <img class="iconImg" v-if="item.activityType == 1" src="../../../static/images/groupBuyIcon.png">
                <img class="iconImg" v-if="item.activityType == 2" src="../../../static/images/spikeIcon.png">
                <img class="iconImg" v-if="item.activityType == 4" src="../../../static/images/spikeIcon.png">
                <img class="iconImg" v-if="item.activityType == 3" src="../../../static/images/discountListIcon.png">
                <img class="iconImg" v-if="item.activityType == 5" src="../../../static/images/discountListIcon.png">
                <img class="iconImg" v-if="item.activityType == 9" src="../../../static/images/memberCenterIcon.png">
				<img class="iconImg" v-if="item.activityType == 8" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/d0d8d96f28904167b271de4ae924d1a8_sceneMarketing.png">
                <!-- #endif -->
                <!-- #ifdef H5 || APP-PLUS -->
                <image class="iconImg" v-if="item.activityType == 1" src="../../../static/images/groupBuyIcon.png">
                <image class="iconImg" v-if="item.activityType == 2" src="../../../static/images/spikeIcon.png">
                <image class="iconImg" v-if="item.activityType == 4" src="../../../static/images/spikeIcon.png">
                <image class="iconImg" v-if="item.activityType == 3" src="../../../static/images/discountListIcon.png">
                <image class="iconImg" v-if="item.activityType == 5" src="../../../static/images/discountListIcon.png">
                <image class="iconImg" v-if="item.activityType == 9" src="../../../static/images/memberCenterIcon.png">
				<image class="iconImg" v-if="item.activityType == 8" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/d0d8d96f28904167b271de4ae924d1a8_sceneMarketing.png">
                <!-- #endif -->
                <div class="price">
                  ¥ {{item.price}}
                </div>
                <div class="original-price">
                  ¥ {{item.originalPrice}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button v-show="componentContent.showMore" class="btn-more" @click="jumpProList(componentContent.productData)">查看全部 <span class="icon iconfont icon-arrow-right"></span></button>
  </div>
</template>

<script>
import {commonMixin} from '../mixin'
export default {
  mixins: [commonMixin],
  data () {
    return {
      swiperCurrent: 0,
    }
  },
  methods:{
    swiperChange(e) {
      this.swiperCurrent = e.detail.current;
    }
  }
}
</script>

<style lang="scss" scoped>
.hom-pro-list{
  padding: 20upx 13upx;
  .title{
    text-align: center;
    margin-bottom: 20upx;
    .title-img{
      width: 211upx;
    }
  }
  /**多行多列**/
  .product-list {
    position: relative;
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
      background-color: #f5f5f5;
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
      .flex{
        display: flex;
        align-items: center;
      }
      .shop-box{
        background-color: #333333;
        border-radius: 0upx 20upx 20upx 0upx;
        line-height: 40upx;
        display: flex;
        align-items: center;
        height: 40upx;
        margin-right: 10upx;
        .shop-name{
          font-size: 20upx;
          color: #FFEBC4;
          padding: 0 8upx 0 12upx;
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
        border: 2upx solid #E4E5E6;
        line-height: 40upx;
        padding: 0 5upx;
      }
      .price-warp{
        display: flex;
        align-items: baseline;
        line-height: 56upx;
        .iconImg {
          width: 58rpx;
          height: 36rpx;
          margin-right: 10rpx;
        }
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
    //::v-deep .swiper-pagination-bullet{
    //  display: none;
    //}
  }
}
//::v-deep .uni-swiper-dots{
//  display: flex;
//  justify-content: center;
//  padding: 10upx 0;
//  .uni-swiper-dot{
//    width: 10upx;
//    height: 10upx;
//    background: #333333;
//    opacity: 0.3;
//    border-radius: 5upx;
//    margin: 0 5upx;
//    &-active{
//      width: 20upx;
//      height: 10upx;
//      opacity: 1;
//    }
//  }
//}
.swiper-dots {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 15rpx;
  z-index: 66;
  .dot {
    width: 10upx;
    height: 10upx;
    background: #333333;
    opacity: 0.3;
    border-radius: 5upx;
    margin: 0 10upx;
  }

  .dot-active {
    width: 20upx;
    opacity: 1;
  }
}
//.pagination{
//  display: flex;
//  justify-content: center;
//  padding: 20upx 0;
//  ::v-deep .swiper-pagination-bullet{
//    width: 10upx;
//    height: 10upx;
//    background: #333333;
//    opacity: 0.3;
//    border-radius: 5upx;
//    margin: 0 5upx;
//  }
//  ::v-deep .swiper-pagination-bullet-active{
//    width: 20upx;
//    height: 10upx;
//    opacity: 1;
//  }
//}

.btn-more {
  width: 170upx;
  height: 54upx;
  line-height: 54upx;
  border: 2upx solid #C5AA7B;
  color: #C5AA7B;
  font-size: 24upx;
  background-color: transparent;
  margin: 20upx auto 0;
  display: flex;
  align-items: center;
}

</style>
