<!--
    * @FileDescription: GoodListSkeleton
    * @Author: kahu
    * @Date: 2023/3/9
    * @LastEditors: kahu
    * @LastEditTime: 2023/3/9
-->
<template>
  <view
      class="good_list_skeleton_content"
      v-if="isFirst"
  >
    <Skeleton :loading="loading && isFirst" :isFixedOnFather="false"/>
    <view class="good_list_skeleton u-skeleton">
<!--      <view class="search_row">
        <view class="input_box u-skeleton-fillet"></view>
        <view class="icon u-skeleton-fillet"></view>
      </view>-->
      <view class="good_row_box" v-for="item in 20">
        <view class="good_row_item">
          <view class="image u-skeleton-fillet"></view>
          <view class="info_box">
            <view class="name u-skeleton-fillet"></view>
            <view class="pay u-skeleton-fillet"></view>
            <view class="price_row ">
              <view class="price u-skeleton-fillet"></view>
              <view class="old_price u-skeleton-fillet"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Skeleton from "@/components/Skeleton";

export default {
  name: "GoodListSkeleton",
  components: {
    Skeleton
  },
  data() {
    return {}
  },
  props: {
    loading: {
      type: Boolean,
      default: () => true
    },
    isFirst: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {}
}
</script>

<style
    lang="scss"
    scoped
>
.good_list_skeleton_content {
  width: 100%;
  height: calc(100vh - 80px);
  background-color: #fff;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20rpx 30rpx;

  .good_list_skeleton {
    width: 100%;
    //height: 200px;
    //background-color: #000;
    .search_row {
      width: 100%;
      height: 78rpx;
      padding: 10rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input_box {
        background-color: #000;
        width: 85%;
        height: 100%;
      }

      .icon {
        background-color: #000;
        width: 10%;
        height: 100%;
      }
    }

    .good_row_box {
      width: 100%;
      padding: 10rpx 10rpx;
      box-sizing: border-box;

      .good_row_item {
        width: 100%;
        height: 240rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .image {
          width: 300rpx;
          height: 100%;
        }

        .info_box {
          height: 100%;
          flex: 1;
          padding: 5rpx 10rpx;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .name {
            width: 100%;
            height: 60rpx;
          }

          .pay {
            width: 30%;
            height: 50rpx;
          }

          .price_row {
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;

            .price {
              width: 30%;
              height: 50rpx;
            }

            .old_price {
              margin-left: 20rpx;
              width: 30%;
              height: 40rpx;
            }
          }
        }
      }
    }
  }
}
</style>
