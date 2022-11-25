// import { directive, Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
import {funMixin} from '../../config/mixin'
import api from '../../config/api'

export const commonMixin = {
  name: 'productList',
  mixins: [funMixin],
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
  data () {
    return {
      productData: []
    }
  },
  watch: {
    'componentContent': {
      handler(newVal, oldVal) {
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData(true)
  },
  computed: {
    swiper() {
      if(this.$refs.mySwiper){
        return this.$refs.mySwiper.$swiper
      }
    }
  },
  methods: {
    getData(isFirst) {
      const _ = this
      this.productData = [{},{},{},{},{},{},{},{}]
      if (_.componentContent.productData.sourceType === '1') {
        if(_.componentContent.productData.productIdList && _.componentContent.productData.productIdList.length>0){
          _.sendReq({
            url: `${api.getProducts}?page=1&pageSize=99&ids=${_.componentContent.productData.productIdList}`,
            method: 'GET'
          }, (proRes) => {
            _.productData = proRes.data.list
            _.productData = _.productData.filter(item=>JSON.stringify(item) !== '{}')
            if(isFirst){
              _.componentContent.productData.imgTextData = _.productData
            }
          })
        } else {
          _.productData = []
        }
      } else if(_.componentContent.productData.sourceType === '2'){
        if(_.componentContent.productData.categoryId) {
          _.sendReq({
            url: `${api.getProducts}?page=1&pageSize=99&classifyId=${_.componentContent.productData.categoryId}`,
            method: 'GET'
          }, (proRes) => {
            _.productData = proRes.data.list
            _.productData = _.productData.filter(item=>JSON.stringify(item) !== '{}')
            if(isFirst){
              _.componentContent.productData.imgTextData = _.productData
            }
            // _.swiper.update()
          })
        } else {
          _.productData = {
            products:[]
          }
        }
      }
    },
  }
}
