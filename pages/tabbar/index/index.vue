<template>
  <div>
    <!-- #ifdef MP-WEIXIN -->
    <view class="header weiXinBox"
          :style="{'padding-top': topHeight + 'px'}">
      <view class="topBox"
            :style="{'height': height + 'px'}">
        <image class="logo"
               src="https://ceres.zkthink.com/static/assets/img/logo.png"
               mode="widthFix"></image>
      </view>
    </view>
    <view class="wxBtnBg"
          :style="{'padding-top': (topHeight + height + 10) + 'px'}">
      <view class="weiXinBoxBtn"
            @click="searchPro">
        <image class="search-icon"
               src="https://ceres.zkthink.com/static/images/searchImg.png"
               mode="widthFix">
        </image>
        <text>请输入您想要的宝贝</text>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 || APP-PLUS -->
    <view class="header">
      <view class="topBox topWap">
        <image class="logo"
               src="https://ceres.zkthink.com/static/assets/img/logo.png"
               mode="widthFix"></image>
        <view class="search-btn"
              @click="searchPro">
          <image class="search-icon"
                 src="https://ceres.zkthink.com/static/img/search.png"
                 mode="widthFix">
          </image>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <category-list @tabChange='tabChange'></category-list>
    <canvas-page ref="canvasPage"
                 v-if="activeTab==0"
                 :terminal="terminal"
                 :typeId="1"></canvas-page>
    <category-show ref="categoryShow"
                   v-else
                   :categoryid="categoryid"></category-show>
    <ad-window ref="adWindow"
               :triggerCondition="1"></ad-window>
    <view class="reachBottom"
          v-if="topLeft > 400">
      <image class="reach-icon"
             src="https://ceres.zkthink.com/static/img/reachBottom.png"
             mode="widthFix">
      </image>
      <text class="reach-text">这里到底了哦~~</text>
    </view>
    <tui-modal :show="privacyShow"
               :custom="true"
               :fadein="true">
      <view class="Put-box1">
        <view class="text-align fs34 fs-bold">
          协议与隐私政策
        </view>
        <p class="mar-top-20">欢迎来到cereshop！我们根据最新的法律、法规、监管政策要求，更新了cereshop隐私政策。</p>
        <view class="flex-display flex-sp-between">
          <view class="btn submit"
                @click="privacyShow = false">
            同意
          </view>
        </view>
      </view>
    </tui-modal>
  </div>
</template>

<script>
import tuiModal from "@/components/modal/modal";
import AdWindow from "@/components/adWindow";

const API = require('../../../config/api')
import CategoryList from "@/components/basics/categoryList.vue"
import CategoryShow from "@/components/basics/categoryShow.vue"
import canvasPage from '@/components/canvasShow/canvasShowPage.vue'

export default {
  components: {
    AdWindow,
    CategoryList,
    CategoryShow,
    canvasPage,
    tuiModal
  },
  data() {
    return {
      terminal: API.terminal,
      activeTab: 0,
      categoryid: 0,
      topHeight: 0,
      height: 0,
      topLeft: 0,
      privacyShow: false
    }
  },
  onReachBottom() {
    this.HandleLoadMoreProduct()
  },
  onLoad() {
    if (!uni.getStorageSync('storage_key')) {
      // #ifdef APP-PLUS
      this.privacyShow = true
      // #endif
    }
    this.$nextTick(() => {
      this.$refs.adWindow.getAd()
    })
  },
  onShow() {
    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.topHeight = menuButtonInfo.top + 10
    this.height = menuButtonInfo.height
    // #endif

  },


  onPageScroll(e) {
    this.topLeft = e.scrollTop
  },
  methods: {
    /**
     * 请求非首页的子组件的下一页
     * */
    HandleLoadMoreProduct(){
      if (this.activeTab != 0) {
        let pitchOnPage = this.$refs.categoryShow
        if (pitchOnPage.total !== 0 && pitchOnPage.productList.length < pitchOnPage.total) {
          pitchOnPage.page++
          pitchOnPage.getData()
        }
      }
    },
    /**
     * 清空非首页的子组件商品数据
     * 回滚请求参数到起始页
     * */
    HandleCleanActiveTabProduct(){
      if(this.$refs.categoryShow){
        let pitchOnPage = this.$refs.categoryShow
        pitchOnPage.total = 0
        pitchOnPage.page=1
        pitchOnPage.productList=[]
      }
    },
    tabChange(index, id) {
      this.HandleCleanActiveTabProduct()
      this.activeTab = index
      this.categoryid = id
    },
    // 查询产品
    searchPro(key, type) {
      uni.navigateTo({
        url: `/pages_category_page1/search/index/index`
      })
    }
  }
};
</script>

<style lang="scss"
       scoped>
.header {
  .toLive {
    height: 40px;
    color: #FFF;
    background-color: #333;
  }

  .topBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .logo {
    width: 280rpx;
    height: 42rpx;
    margin-top: -40rpx;
    // margin-left: 30rpx;
  }

  .search-btn {
    height: 66rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 33rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30rpx;

    .search-icon {
      width: 60rpx;
      height: 60rpx;
      // margin-left: 33rpx;
    }

    .search-word {
      font-size: 26rpx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      margin-left: 10rpx;
    }
  }

  .tabs-nav-warp {
    margin-top: 20rpx;
    padding: 0 30rpx;
  }

  .tabs-nav {
    .ul {
      display: flex;

      .li {
        flex: 1 0 auto;
        margin-left: 36rpx;
        font-size: 30rpx;
        color: #999999;
        position: relative;
        padding-bottom: 18rpx;

        &:first-child {
          margin-left: 0;
        }

        &.on {
          &:after {
            content: '';
            width: 100%;
            height: 4rpx;
            background: #C5AA7B;
            position: absolute;
            left: 0;
            bottom: 0;
          }

          font-weight: bold;
        }
      }
    }
  }
}

.weiXinBox {
  width: 100%;
  position: fixed;
  background: #FFFFFF;
  z-index: 99;
}

.wxBtnBg {
  padding: 0 20rpx;

  .weiXinBoxBtn {
    display: flex;
    align-items: center;
    padding: 10rpx 0 10rpx 15rpx;
    width: 100%;
    background: #F3F4F5;
    opacity: 1;

    .search-icon {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }

    text {
      color: #999999;
    }
  }
}

.terminal1 {
  .header {
    .topBox {
      // justify-content: left;

      .search-btn {
        .search-icon {
          margin-left: 0rpx;
        }
      }
    }
  }
}

.topTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  width: 100%;

  .topText {
    text-align: center;
    color: #000000;
    font-size: 38rpx;
    font-weight: bold;
  }
}

.topWap {
  padding-top: 60rpx;

  .logo {
    margin-top: 0 !important;
  }
}

.terminal2 {
}

.terminal3 {
}

// 触底样式
.reachBottom {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .reach-icon {
    width: 150rpx;
    height: 150rpx;
  }

  .reach-text {
    margin: 20rpx 0;
    color: #CCCCCC;
  }
}

.Put-box1 {
  .btn {
    text-align: center;
    margin-top: 40rpx;
    border: 1px solid #333333;
    height: 80upx;
    line-height: 80upx;
    width: 100%;
    color: #333333;
  }

  .submit {
    background-color: #333333;
    color: #FFEBC4;
  }
}
</style>
