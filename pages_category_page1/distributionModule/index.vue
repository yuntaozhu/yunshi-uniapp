<template>
  <view class="container flex-center flex-column">
    <global-loading />
    <view
        class="inStoreBackImg flex-items-plus"
        v-if="StoreListData.length>0"
    >
      <label>选择进入的店铺</label>
    </view>
    <view>
      <view
          class="flex-items-plus flex-column"
          v-for="(item,index) in StoreListData"
          :key="index"
          @click="getStore(item)"
      >
        <view class="store-box flex-items-plus flex-sp-between mar-top-30 bor-line-E5E5E5 pad-bot-30">
          <view class="flex-items-plus">
            <image
                class="storeLogoImg"
                :src="item.shopLogo"
            ></image>
            <view class="font-color-656 fs24 mar-left-20">
              <label class="fs30 font-color-333">{{ item.shopName }}</label>
              <view class="flex-row-plus mar-top-20">
                <label>等级：{{ item.levelName }} </label>
              </view>
              <view class="mar-top-10">关系：<label>{{ item.state == 1 ? '有效' : '被清退' }}</label></view>
            </view>
          </view>
          <view class="income">
            <view class="font-color-333 fs30">总收益</view>
            <view class="font-color-C5AA7B fs30">{{ item.price }}元</view>
          </view>
        </view>
      </view>
    </view>
    <view
        v-if="ifEmpty"
        class="emptyCart-box flex-items-plus flex-column"
    >
      <image
          class="emptyCart-img"
          src="https://ceres.zkthink.com/static/img/bgnull.png"
      ></image>
      <label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { request } from '../../utils/request'
import API from "../../config/api";
import { onLoad, onReachBottom, onBackPress } from "@dcloudio/uni-app";

const currentId = ref('')
const StoreListData = ref([])
const StoreListQuery = ref({
  id: ''
})
const page = ref(1)
const pageSize = ref(20)
const loadingType = ref(0)
const ifEmpty = ref(false)

onLoad(() => {
  getStoreList()
})

const back = () => {
  uni.switchTab({
    url: '../../pages/tabbar/user/index'
  });
}
/**
 * 获取店铺列表数据
 * @returns {Promise<void>}
 */
const getStoreList = async () => {
  try {
    const res = await request(API.FindSaleStoreList, {
      page: page.value,
      pageSize: pageSize.value
    }, 'GET')
    uni.hideLoading()
    if (res.data.list.length == 0) {
      loadingType.value = 1
      page.value = page.value
    }
    StoreListData.value = StoreListData.value.concat(res.data.list)
    if (StoreListData.value.length === 0) {
      ifEmpty.value = true
    }
  } catch (err) {
    uni.hideLoading()
  }
}
/**
 * 跳转店铺详情
 * @param item
 */
const getStore = (item) => {
  uni.navigateTo({
    url: 'salesIndex?distributeInfo=' + JSON.stringify(item)
  });
}
</script>

<style lang="scss">
page {
  background: #F8F8F8;
}

.emptyCart-box {
  margin-top: 70upx;

  .emptyCart-img {
    width: 113upx;
    height: 98upx;
  }
}

.container {
  .inStoreBackImg {
    width: 100%;
    height: 100upx;
    background: #333333;
    color: #FFFFFF;
  }

  .store-box {
    width: 690upx;
    background: #FFFFFF;
    padding: 22rpx;

    .storeLogoImg {
      width: 140upx;
      height: 140upx;
    }

    .income {
      width: 200rpx;
      text-align: center;
      border-left: 2rpx solid #F3F4F5;
    }
  }
}
</style>
