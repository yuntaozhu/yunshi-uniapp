<template>
	<view>
    <global-loading />

    <view v-if="FindMySalesData.total>0">
			<view  class="flex-center clientList-box" v-for="(item, index) in FindMySalesDatalist" :key="index">
				<view class="directAward-box font-color-656 fs26">
					<view class="directAward-icon flex-row-plus flex-items flex-sp-between" @click="arrowTypeChange(index)">
						<view class="flex-column-plus font-color-333 fs30">
							<label class="orderId-box">订单号：{{item.orderId}}</label>
							<view class="orderId-box mar-top-20">
								佣金：<label class="font-color-C5AA7B">¥{{item.commission}}</label>
							</view>
						</view>
            <view>
             <image v-if="item.ifOpen  == false" class="arrow-down" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-16/5533f3baf2184f86b5ef88ed6c400713_arrowDownIcon.png"></image>
              <image v-if="item.ifOpen  == true" class="arrow-down" src="https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-16/22f5f56f53ec4f558a6268e4fef7e1f5_arrowUpIcon.png"></image>
            </view>
					</view>
					<view class="upBox" v-if="item.ifOpen == true">
						<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
							<label class="orderId-box font-color-999 fs26">商品数：{{item.products}}</label>
							<label class="orderId-box font-color-999 fs26">实付金额：¥{{item.price}}</label>
						</view>
						<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
							<label class="orderId-box font-color-999 fs26">下单人：{{item.customerName}}</label>
							<label class="commission-box mar-left-70 font-color-999 fs26">状态：<text class="state" :class="{current: item.state==0}">{{item.state===0?'未结算':'已结算'}}</text></label>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="https://ceres.zkthink.com/static/images/collectEmpty.png"></image>
			<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { request } from '../../utils/request'
import API from "../../config/api";
import {onLoad, onReachBottom} from "@dcloudio/uni-app";

const shopId = ref(0);
const distributorId = ref(0);
const page = ref(1);
const pageSize = ref(20);
const FindMySalesData = ref([]);
const FindMySalesDatalist = ref([]);

onLoad((options) => {
  shopId.value = options.shopId
  distributorId.value = options.distributorId
  getSalesOrderPage()
})

onReachBottom(() => {
  if(loadingType.value == 1){
    uni.stopPullDownRefresh()
  }else{
    page.value = page.value + 1
    getSalesOrderPage()
  }
})
/**
 * 获取分销订单列表数据
 * @returns {Promise<void>}
 */
const getSalesOrderPage = async () => {
  try {
    const res = await request(API.FindMySalesPage, {
      shopId: shopId.value,
      distributorId: distributorId.value,
      page: page.value,
      pageSize: pageSize.value,
    }, 'GET')
    uni.hideLoading()
    if(res.data.list.length == 0){
      loadingType.value = 1
    }
    FindMySalesDatalist.value = FindMySalesDatalist.value.concat(res.data.list)
    FindMySalesData.value = res.data
  } catch (err) {
    uni.hideLoading()
  }
}
/**
 * 是否展开收起
 * @param arrowTypeId
 */
const arrowTypeChange = (arrowTypeId) => {
  FindMySalesDatalist[arrowTypeId].ifOpen = FindMySalesDatalist.value[arrowTypeId].ifOpen == true ? false : true
}
</script>

<style lang="scss">
page {
  background: #F8F8F8;
}
	.emptyCart-box{
		margin-top: 70upx;
    .emptyCart-img{
         margin-top: 30%;
         width: 198rpx;
         height: 183rpx;
    }
	}
	.directAward-box {
		width: 95%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		background-color: #FFFFFF;
		padding: 40upx 20upx;
		margin-top: 30upx;
		.orderId-box {
			width: 320upx;

		}

		.commission-box {
			width: 340upx;
		}
    .state {
      color: #16BB89;
    }
    .current {
      color: #C83732 !important;
    }
		.arrow-down {
			width: 24upx;
			height: 24upx;
		}

		.upBox {
			border-top: 1upx solid #EDEDED;
			margin-top: 30upx;
		}
	}
</style>
