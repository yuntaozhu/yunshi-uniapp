<template>
  <div class="group-list">
    <div class="group-warp">
      <div class="title">
        <label>
          <!-- #ifdef MP-WEIXIN -->
          <img class="title-img" src="../../../static/images/group/img-title.png" alt="拼团专区" mode="widthFix"/>
          <!-- #endif -->
          <!-- #ifdef H5 || APP-PLUS -->
          <image class="title-img" src="../../../static/images/group/img-title.png" alt="拼团专区" mode="widthFix"/>
          <!-- #endif -->
         </label>
         <a v-show="componentContent.showMore" class="btn-all a-link" @click="jumpGroupWorks(productData)">更多<i class="iconfont icon-arrow-right"></i></a>
       </div>
       <div>
       <swiper class="swiper pro-box" :indicator-dots="productData.show" :autoplay="true" :display-multiple-items="3">
         <swiper-item class="swiper-slide pro-item-warp" v-for="(item,index) in productData.products" :key="index" @click="jumpProductDetail(item)">
          <div class="pro-item-inner">
            <div class="pro-item">
              <div class="pro-item-img">
                <img v-show="item.image" class="img" :src="item.image">
              </div>
              <div class="pro-item-info">
                <label class="name">{{item.productName}}</label>
                <div class="price">
                  <label class="unit">¥ </label>
                  <label class="val"> {{item.price}}</label>
                </div>
                <label class="buyCount">{{item.workUsers?item.workUsers:0}}人已拼</label>
              </div>
            </div>
          </div>
         </swiper-item>
         <swiper-item v-if="productData.products.length" class="swiper-slide pro-item-warp" v-for="item in (3 - productData.products.length)">
         </swiper-item>
       </swiper>
 <!--      <div class="pagination group-pagination"></div>-->
      </div>
    </div>
  </div>
</template>

<script>
import {commonMixin} from '../mixin'
export default {
  mixins: [commonMixin],
  data () {
    return {
      // swiperOption: {
      //   slidesPerView: 3, // 显示数量
      //   spaceBetween: 0, // 间隔
      //   autoplay: false, // 可选选项，自动滑动
      //   loop: true,
      //   pagination: {
      //     el: '.group-pagination'
      //   },
      //   navigation: {
      //     nextEl: '.swiper-button-next',
      //     prevEl: '.swiper-button-prev'
      //   }
      // }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .group-list{
    padding: 30upx 20upx 60upx;
    .group-warp{
      width: 710upx;
      height: 528upx;
      padding: 0 2upx;
      background: #333333;
      box-shadow: 0px 20upx 30upx rgba(0, 0, 0, 0.3);
      opacity: 1;
      border-radius: 20upx;
    }
    .title{
      display: flex;
      align-items:center;
      position: relative;
      padding: 40upx 0 25upx 20upx;
      .title-img{
        width: 189upx;
      }
      .btn-all{
        position: absolute;
        right: 8upx;
        top: 40upx;
        line-height: 33upx;
        padding-right: 25upx;
        font-size: 24upx;
        color: #FFEBC4;
        .iconfont{
          content: '';
          font-size: 26upx;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .pro-box{
      height: 432upx;
      display: flex;
      &.swiper-disabled{
        .uni-swiper-wrapper{
          position: static;
        }
      }
      .pro-item-warp{
        width: 236px;
      }
      .pro-item{
        width: 220upx;
        height: 382upx;
        background: #FFFFFF;
        .pro-item-img{
          .img{
            width: 100%;
            height: 220upx;
          }
        }
        &-inner{
          padding: 0 8upx;
        }
        .pro-item-info{
          text-align: center;
          padding: 0px 10upx 20upx;
          .name{
            font-size: 24upx;
            font-weight: normal;
            color: #FFEBC4;
            line-height: 50upx;
            background-color: #333333;
            text-align: center;
            margin-bottom: 18upx;
            padding: 0 5px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .price{
            color: #C83732;
            font-size: 28upx;
            font-weight: bold;
            line-height: 40upx;
          }
          .buyCount{
            font-size: 24upx;
            color: #ccc;
            line-height: 34upx;
            font-weight: normal;
          }
        }
      }
    }
    ::v-deep .uni-swiper-dots{
      display: flex;
      justify-content: center;
      bottom: 27px;
      .uni-swiper-dot{
        width: 24upx;
        height: 4upx;
        background: #fff;
        opacity: 0.5;
        border-radius: 2upx;
        margin: 0 5upx;
        &-active{
          opacity: 1;
        }
      }
    }

    //.pagination{
    //  display: flex;
    //  justify-content: center;
    //  ::v-deep .swiper-pagination-bullet{
    //    width: 24upx;
    //    height: 4upx;
    //    background: #fff;
    //    opacity: 0.5;
    //    border-radius: 2upx;
    //    margin: 0 5upx;
    //  }
    //  ::v-deep .swiper-pagination-bullet-active{
    //    opacity: 1;
    //  }
    //}
  }
</style>
