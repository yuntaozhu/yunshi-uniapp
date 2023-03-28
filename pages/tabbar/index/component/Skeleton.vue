<!--
    * @FileDescription: Skeleton
    * @Author: kahu
    * @Date: 2023/3/8
    * @LastEditors: kahu
    * @LastEditTime: 2023/3/8
-->
<template>
  <view  v-if="isFirst">
    <Skeletons
        :loading="loading && isFirst"
        :animation="true"
        bgColor="#FFF"
    />
    <div class="skeleton_content u-skeleton">
      <div class="empty_box u-skeleton-fillet"></div>
      <div class="banner_box u-skeleton-fillet"></div>
      <div class="icon_box ">
        <div class="icon_item" v-for="item in 4">
          <div class="img u-skeleton-fillet"></div>
          <div class="text u-skeleton-fillet"></div>
        </div>
      </div>
      <div class="hot_box ">
        <div class="left u-skeleton-fillet"></div>
        <div class="right ">
          <div class="top u-skeleton-fillet"></div>
          <div class="bottom u-skeleton-fillet"></div>
        </div>
      </div>
      <div class="new_box ">
        <div class="item u-skeleton-fillet" v-for="item in 3"></div>
      </div>
      <div class="hot_box ">
        <div class="left u-skeleton-fillet"></div>
        <div class="right ">
          <div class="top u-skeleton-fillet"></div>
          <div class="bottom u-skeleton-fillet"></div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import Skeletons from "@/components/Skeleton";
export default {
  name: "Skeleton",
  components:{Skeletons},
  data() {
    return {}
  },
  props:{
    loading:{
      type:Boolean,
      default:true
    },
    isFirst:{
      type:Boolean,
      default:true
    }
  },
  methods: {}
}
</script>

<style
    lang="scss"
    scoped
>
.skeleton_content {
  width: 100%;
  height: calc(100vh - 50px);
  overflow-y: hidden;
  box-sizing: border-box;

  .empty_box{
    width: 100%;
    height: 140rpx;
  }

  .banner_box {
    width: 100%;
    height: 320rpx;
  }

  .icon_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 60rpx;
    box-sizing: border-box;

    .icon_item {
      width: 80rpx;

      .img {
        width: 100%;
        height: 80rpx;
      }

      .text {
        margin-top: 20rpx;
        width: 100%;
        height: 30rpx;
      }
    }
  }

  .hot_box {
    width: 100%;
    height: 390rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    .left {
      width: 49%;
      height: 100%;
    }

    .right {
      width: 49%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .top, .bottom {
        width: 100%;
        height: 49%;
      }
    }
  }

  .new_box {
    width: 100%;
    height: 390rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-sizing: border-box;

    .item {
      width: 30%;
      height: 100%;
    }
  }
}
</style>
