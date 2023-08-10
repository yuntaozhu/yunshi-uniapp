import api from '../../config/api'
import {
  funMixin
} from '../../config/mixin'
import {
  ref,
  onMounted,
} from 'vue';

export default function (componentContent, shopId) {
  const {
    sendReq,
    jumpProductDetail,
    jumpCombination
  } = funMixin()
  const productData = ref({
    composeProducts: [],
    rules: [{
      price: null,
      number: null,
    }],
  })

  onMounted(() => {
    getData(true)
  })

  function getData() {
    if(componentContent.value.priceId){
      const params = {
        method: 'GET',
        url: `${api.getPrices}?shopId=${shopId.value}&ids=${componentContent.value.priceId}&page=1&pageSize=10`,
      }
      this.sendReq(params, (res) => {
        if( res.data.length > 0){
          productData.value = res.data[0]
        }
      })
    } else {
      productData.value = {
        composeProducts: [],
        rules: []
      }
    }
  }

  return {
    productData,
    jumpProductDetail,
    jumpCombination
  }
}
