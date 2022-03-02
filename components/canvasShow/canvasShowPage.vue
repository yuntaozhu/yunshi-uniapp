<template>
  <div class="layout hom-layout">
    <div class="list-group-item"
         v-for="(item,index) in componentsData"
         :key="index">
      <!--        <component :is="componentMap[terminal-1].get(item.type)" :componentContent="item.componentContent" :terminal="terminal" :typeId="typeId" :shopId="shopId"></component>-->
      <com-banner v-if="item.type==='banner'"
                  :componentContent="item.componentContent"
                  :terminal="terminal"
                  :typeId="typeId"
                  :shopId="shopId"></com-banner>
      <com-text v-if="item.type==='text'"
                :componentContent="item.componentContent"
                :terminal="terminal"
                :typeId="typeId"
                :shopId="shopId"></com-text>
      <com-image-text v-if="item.type==='imageText'"
                      :componentContent="item.componentContent"
                      :terminal="terminal"
                      :typeId="typeId"
                      :shopId="shopId"></com-image-text>
      <com-brand-list v-if="item.type==='brandList'"
                      :componentContent="item.componentContent"
                      :terminal="terminal"
                      :typeId="typeId"
                      :shopId="shopId"></com-brand-list>
      <com-category-list v-if="item.type==='categoryList'"
                         :componentContent="item.componentContent"
                         :terminal="terminal"
                         :typeId="typeId"
                         :shopId="shopId"></com-category-list>
      <com-image-text-list v-if="item.type==='imageTextList'"
                           :componentContent="item.componentContent"
                           :terminal="terminal"
                           :typeId="typeId"
                           :shopId="shopId"></com-image-text-list>
      <com-assist-div v-if="item.type==='assistDiv'"
                      :componentContent="item.componentContent"
                      :terminal="terminal"
                      :typeId="typeId"
                      :shopId="shopId"></com-assist-div>
      <com-image-text-nav v-if="item.type==='imageTextNav'"
                          :componentContent="item.componentContent"
                          :terminal="terminal"
                          :typeId="typeId"
                          :shopId="shopId"></com-image-text-nav>
      <com-product v-if="item.type==='productList'"
                   :componentContent="item.componentContent"
                   :terminal="terminal"
                   :typeId="typeId"
                   :shopId="shopId"></com-product>
      <com-video-box v-if="item.type==='videoBox'"
                     :componentContent="item.componentContent"
                     :terminal="terminal"
                     :typeId="typeId"
                     :shopId="shopId"></com-video-box>
      <com-coupon v-if="item.type==='coupon'"
                  :componentContent="item.componentContent"
                  :terminal="terminal"
                  :typeId="typeId"
                  :shopId="shopId"></com-coupon>
      <com-custom v-if="item.type==='custom'"
                  :componentContent="item.componentContent"
                  :terminal="terminal"
                  :typeId="typeId"
                  :shopId="shopId"></com-custom>
      <com-notice v-if="item.type==='notice'"
                  :componentContent="item.componentContent"
                  :terminal="terminal"
                  :typeId="typeId"
                  :shopId="shopId"></com-notice>
      <com-vip v-if="item.type==='vip'"
               :componentContent="item.componentContent"
               :terminal="terminal"
               :typeId="typeId"
               :shopId="shopId"></com-vip>
      <com-group v-if="item.type==='groupList'"
                 :componentContent="item.componentContent"
                 :terminal="terminal"
                 :typeId="typeId"
                 :shopId="shopId"></com-group>
      <com-discount v-if="item.type==='discountList'"
                    :componentContent="item.componentContent"
                    :terminal="terminal"
                    :typeId="typeId"
                    :shopId="shopId"></com-discount>
      <com-spike v-if="item.type==='spikeList'"
                 :componentContent="item.componentContent"
                 :terminal="terminal"
                 :typeId="typeId"
                 :shopId="shopId"></com-spike>
      <com-price v-if="item.type==='priceList'"
                 :componentContent="item.componentContent"
                 :terminal="terminal"
                 :typeId="typeId"
                 :shopId="shopId"></com-price>
      <com-new-product v-if="item.type==='newProduct'"
                       :componentContent="item.componentContent"
                       :terminal="terminal"
                       :typeId="typeId"
                       :shopId="shopId"></com-new-product>
      <com-shop v-if="item.type==='shop'"
                :componentContent="item.componentContent"
                :terminal="terminal"
                :typeId="typeId"
                :shopId="shopId"></com-shop>
      <com-live v-if="item.type==='live'"
                :componentContent="item.componentContent"
                :terminal="terminal"
                :typeId="typeId"
                :shopId="shopId"></com-live>
    </div>
  </div>
</template>

<script>
// import comComponentMap from './componentMap'
import comBanner from '@/components/canvasShow/basics/banner'
import comText from '@/components/canvasShow/basics/text'
import comImageText from '@/components/canvasShow/basics/imageText'
import comBrandList from '@/components/canvasShow/basics/brandList'
import comCategoryList from '@/components/canvasShow/basics/categoryList'
import comImageTextList from '@/components/canvasShow/basics/imageTextList'
import comAssistDiv from '@/components/canvasShow/basics/assistDiv'
import comImageTextNav from '@/components/canvasShow/basics/imageTextNav'
import comProduct from '@/components/canvasShow/basics/product/app/index'
import comVideoBox from '@/components/canvasShow/basics/video'
import comCoupon from '@/components/canvasShow/basics/coupon/app'
import comCustom from '@/components/canvasShow/basics/custom'
import comNotice from '@/components/canvasShow/basics/notice'
import comVip from '@/components/canvasShow/basics/vip/app'
import comGroup from '@/components/canvasShow/basics/group/app/index'
import comDiscount from '@/components/canvasShow/basics/discount/app'
import comSpike from '@/components/canvasShow/basics/spike/app'
import comPrice from '@/components/canvasShow/basics/price/app'
import comNewProduct from '@/components/canvasShow/basics/newProduct/app'
import comShop from '@/components/canvasShow/basics/shop'
import comLive from '@/components/canvasShow/basics/live/app'
import api from './config/api'
import {sendReqMixin} from './config/mixin'

export default {
  name: 'canvasPage',
  mixins: [sendReqMixin],
  data() {
    return {
      // terminal: 4, // 画布设备 1 小程序，2 H5，3 App 4 电脑
      // typeId: 3, // 画布类型 1 平台画布，2 自定义页面，3 商家店铺装修
      // shopId: 0, // 店铺id
      componentsData: [],
      activeComponent: -1,
      // componentMap: componentMap
    }
  },
  components: {
    comBanner,
    comText,
    comImageText,
    comBrandList,
    comCategoryList,
    comImageTextList,
    comAssistDiv,
    comImageTextNav,
    comProduct,
    comVideoBox,
    comCoupon,
    comCustom,
    comGroup,
    comDiscount,
    comSpike,
    comPrice,
    comNotice,
    comVip,
    comNewProduct,
    comShop,
    comLive
  },
  props: {
    terminal: {
      type: Number,
      default: 4
    },
    typeId: {
      type: Number,
      default: 1
    },
    shopId: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    // this.shopId = Cookies.get('cereShopId')
    this.canvasGet()
  },
  methods: {
    // 读取画布
    canvasGet() {
      var _this = this
      var apiUrl = api.getCanvas + '?terminal=' + this.terminal + '&type=' + this.typeId
      if (this.shopId) {
        apiUrl += '&shopId=' + this.shopId
      }
      let params = {
        url: apiUrl,
        method: 'GET'
      }
      this.sendReq(params, (res) => {
        if (JSON.stringify(res.data) !== '{}') {
          _this.canvasId = res.data.canvasId
          var componentsData = JSON.parse(res.data.json)
          _this.componentsData = componentsData
        } else {
          _this.canvasId = ''
        }
        // console.log(JSON.parse(res.data.json))
      })
    }
  }
}
</script>

<style lang="scss"
       scoped>
.hom-layout {
  background-color: #ffffff;
  width: 100%;
  overflow: hidden;
}
</style>

<style lang="scss">
.warp {
  width: 710upx;
  margin: 0 auto;
  max-width: 100%;

  &.terminal4 {
    width: 1200px;
    max-width: 100%;
  }
}

.flex-box {
  display: flex;
}
</style>
