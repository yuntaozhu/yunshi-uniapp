<!--
    * @FileDescription: index
    * @Author: kahu
    * @Date: 2023/3/7
    * @LastEditors: kahu
    * @LastEditTime: 2023/3/7
-->
<template>
  <view class="header_content">
    <!-- 头部 -->
    <view
        class="header_box"
        id="header_box"
    >
      <DefaultHead @getInfoData="handleGetSystemInfoData" />
      <!-- 和胶囊齐平nav条 -->
      <view
          :style="{
                    'padding-top':`${headerObj.menuPadding}px`,
                    'transform':`translateY(-${headerObj.menuButtonTogetherNavInfo.transformTop}px)`
                  }"
          class="logo_row"
      >
        <!-- logo -->
        <view class="logo_box">
          <image src="https://ceres.zkthink.com/static/assets/img/logo.png" />
        </view>
        <!-- 右侧搜索 -->
        <template>
          <!-- #ifndef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ -->
          <view
              class="search_box"
              @click="handleSearch"
          >
            <image src="https://ceres.zkthink.com/static/img/search.png" />
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ -->
          <view
              class="search_box"
              :style="{
              'position':'absolute',
              'left':`${headerObj.systemInfo.menuButtonInfo.left}px`,
              'transform':`translateX(-110%)`
            }"
              @click="handleSearch"
          >
            <image src="https://ceres.zkthink.com/static/img/search.png" />
          </view>
          <!-- #endif -->
        </template>
      </view>
      <!-- 其他内容 -->
      <slot />
    </view>

    <!-- 空盒子撑高 -->
    <view
        class="empty_box"
        :style="{height:headerObj.height+'px'}"
    />
  </view>
</template>

<script>
import DefaultHead from "@/components/DefaultHead";

export default {
  name: "FixedHead",
  components: {
    DefaultHead
  },
  data() {
    return {
      // 头部对象
      headerObj: {
        height: 0, // 容器总体高度
        systemInfo: {}, // 系统此乃西
        menuPadding: 0, // 胶囊距离statusBar的高度（胶囊top - statusBarHeight）
        // 胶囊配置信息
        menuButtonTogetherNavInfo: {
          height: 36,  // 跟胶囊齐平的nav高度（和CSS的nav高度一致）
          transformTop: 0 // nav要相对于menuPadding以后向上位移高度
        }
      },
    }
  },
  methods: {
    // 查询产品
    handleSearch() {
      uni.navigateTo({
        url: `/pages_category_page1/search/index/index`
      })
    },
    /**
     * 获取系统信息
     * 由DefaultHead回调
     */
    handleGetSystemInfoData(data) {
      this.headerObj.systemInfo = data
      // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
      this.headerObj.menuPadding = data.menuButtonInfo.top - data.systemInfo.statusBarHeight
      const {menuButtonTogetherNavInfo} = this.headerObj
      // 如果胶囊高度小于齐平的nav高度
      const menuButtonHeight = data.menuButtonInfo.height
      const menuButtonTogetherNavHeight = menuButtonTogetherNavInfo.height
      if (menuButtonHeight < menuButtonTogetherNavHeight) {
        // 胶囊始终在nav高度中心位置
        menuButtonTogetherNavInfo.transformTop = (menuButtonTogetherNavHeight - menuButtonHeight) / 2
      }
      // #endif
      this.$nextTick(()=>{
        let query = uni.createSelectorQuery().in(this);
        // 处理撑高逻辑
        query.select('#header_box').boundingClientRect(boxData => {
          this.headerObj.height = boxData.height
          if(boxData.height<data.menuButtonInfo.bottom){
            this.headerObj.height = data.menuButtonInfo.bottom+10
          }
        }).exec()
      })
    },
  }
}
</script>

<style
    lang="scss"
    scoped
>
.header_content {
  position: relative;
  // 头部
  .header_box {
    width: 100%;
    height: auto;
    position: fixed;
    background-color: #fff;
    z-index: 9999;

    image {
      width: 100%;
      height: 100%;
      display: inline-block;
    }

    .logo_row {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .logo_box {
        width: 286rpx;
        height: 72rpx;
      }

      .search_box {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }

  .empty_box {
    width: 100%;
    position: relative;
  }
}
</style>
