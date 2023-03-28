<!--
    * @FileDescription: ProductSkeleton
    * @Author: kahu
    * @Date: 2023/3/8
    * @LastEditors: kahu
    * @LastEditTime: 2023/3/8
-->
<template>
  <view v-if="isFirst">
    <Skeleton
        :loading="isFirst && loading"
        :animation="true"
        bgColor="#FFF"
    />
    <view class="skeleton_content u-skeleton">
      <view class="empty_row"></view>
      <view class="product_box">
        <view
            class="product_item "
            v-for="item in 40"
        >
          <view class="image u-skeleton-fillet"></view>
          <view class="text_box ">
            <view
                class="text u-skeleton-fillet"
                v-for="item in 2"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
import Skeleton from "@/components/Skeleton";
export default {
  name: "ProductSkeleton",
  data() {
    return {}
  },
  methods: {},
  components:{Skeleton},
  props: {
    isFirst: {
      type: Boolean,
      default: () => true
    },
    loading: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style
    lang="scss"
    scoped
>
.skeleton_content {
  width: 100%;
  height: calc(100vh - 50px);
  padding: 30rpx 30rpx;
  box-sizing: border-box;

  .product_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .product_item {
      margin: 10rpx 0;
      width: 49%;
      height: 500rpx;
      //padding: 30rpx 30rpx;
      //box-sizing: border-box;
      .image {
        width: 100%;
        height: 70%;
      }

      .text_box {
        padding: 0 20rpx;

        .text {
          margin-top: 15rpx;
          width: 100%;
          height: 60rpx;
        }
      }
    }
  }
}


</style>
