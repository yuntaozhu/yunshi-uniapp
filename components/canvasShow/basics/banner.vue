<template>
  <div class="banner" :class="'terminal' + terminal">
    <swiper class="swiper" :indicator-dots="true" :autoplay="true" :style="{'height':bannerHeight + 'rpx'}">
      <swiper-item class="banner-item" v-for="(item,index) in bannerList" :key="index" :style="{backgroundImage: 'url('+ item.bannerUrl +')','height':bannerHeight + 'rpx'}">
        <div class="a-link" @click="jumpLink(item.linkObj)"><img class="img" :src="item.bannerUrl" v-show="item.bannerUrl" mode="widthFix"></div>
      </swiper-item>
    </swiper>
    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>

<script>
// import { directive, Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
  import {funMixin} from '../config/mixin'
  export default {
    name: 'cereBanner',
    mixins: [funMixin],
    data () {
      return {
        bannerHeight: 0
        // swiperOption: {
        //   autoplay: false, // 可选选项，自动滑动
        //   loop: true,
        //   pagination: {
        //     el: '.swiper-pagination'
        //   }
        // }
      }
    },
    props: {
      terminal: {
        type: Number,
        default: 4
      },
      componentContent: {
        type: Object
      }
    },
    // components: {
    //   Swiper,
    //   SwiperSlide
    // },
    // directives: {
    //   swiper: directive
    // },
    mounted() {
      this.bannerHeight = this.componentContent.height
      // #ifdef APP-PLUS
      this.bannerHeight = this.bannerHeight / 2
      // #endif
      this.$forceUpdate() // 刷新轮播图
    },
    computed: {
      bannerList: function () {
        console.log(this.componentContent)
        return this.componentContent.bannerData.filter(function (item) {
          return item.bannerUrl
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.banner{
  .banner-item {
    width: 100%;
    img {
      width: 100%;
    }
  }
  &.terminal4{
    ::v-deep .el-carousel{
      height: 100%;
      .el-carousel__container{
        height: 100%;
      }
    }
    .banner-item{
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto 100%;
      img{
        display: none;
      }
    }
  }
  ::v-deep .uni-swiper-dots{
      display: flex;
      justify-content: center;
      bottom: 20upx;
      width: 100%;
     .uni-swiper-dot{
        width: 30upx;
        height: 4upx;
        background: #fff;
        opacity: 0.5;
        border-radius: 2upx;
        margin: 0 7.5upx;
       .uni-swiper-dot-active{
          opacity: 1;
          width: 58upx;
        }
      }
  }

  /* wx-swiper-dots wx-swiper-dots-horizontal */
  wx-swiper .wx-swiper-dot-active{
    width: 40rpx;
    border-radius: 10rpx;
    background: #eb544d;
  }

  //.swiper-pagination{
  //  display: flex;
  //  justify-content: center;
  //  bottom: 20upx;
  //  width: 100%;
  //  ::v-deep .swiper-pagination-bullet{
  //    width: 30upx;
  //    height: 4upx;
  //    background: #fff;
  //    opacity: 0.5;
  //    border-radius: 2upx;
  //    margin: 0 7.5upx;
  //  }
  //  ::v-deep .swiper-pagination-bullet-active{
  //    opacity: 1;
  //    width: 58upx;
  //  }
  //}
}
</style>
