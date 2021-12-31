<template>
	<div>
    <!-- #ifdef MP-WEIXIN -->
    <view class="header weiXinBox" :style="{'padding-top': topHeight + 'px'}">
      <view class="topBox" :style="{'height': height + 'px'}">
        <image class="logo" src="@/static/assets/img/logo.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="wxBtnBg" :style="{'padding-top': (topHeight + height + 10) + 'px'}">
      <view class="weiXinBoxBtn" @click="searchPro">
        <image class="search-icon" src="@/static/images/searchImg.png" mode="widthFix"></image>
        <text>请输入您想要的宝贝</text>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 || APP-PLUS -->
    <view class="header">
      <view class="topBox">
        <image class="logo" src="@/static/assets/img/logo.png" mode="widthFix"></image>
        <view class="search-btn" @click="searchPro">
          <image class="search-icon" src="@/static/img/search.png" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <!-- #endif -->
    <category-list @tabChange='tabChange'></category-list>
		<canvas-page v-if="activeTab==0" :terminal="terminal" :typeId="1"></canvas-page>
		<category-show v-else :categoryid="categoryid"></category-show>
    <ad-window ref="adWindow" :triggerCondition="1"></ad-window>
		<view class="reachBottom" v-if="topLeft > 400">
			<image class="reach-icon" src="@/static/img/reachBottom.png" mode="widthFix"></image>
			<text class="reach-text">这里到底了哦~~</text>
		</view>
	</div>
</template>

<script>
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
		},
		data() {
			return {
				terminal: API.terminal,
				activeTab: 0,
				categoryid: 0,
        topHeight: 0,
        height: 0,
				topLeft: 0
			}
		},
		onShow() {
      let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.topHeight = menuButtonInfo.top + 10
      this.height = menuButtonInfo.height
            this.$refs.adWindow.getAd()
    },
		onPageScroll(e) {
			this.topLeft = e.scrollTop
		},
		methods: {
			tabChange(index, id) {
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

<style lang="scss" scoped>
.header {
	.toLive{
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

					font-weight:bold;
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
.terminal2 {}

.terminal3 {}
// 触底样式
.reachBottom{
	margin-top: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.reach-icon{
		width: 150rpx;
		height: 150rpx;
	}
	.reach-text{
		margin: 20rpx 0;
		color: #CCCCCC;
	}
}
</style>
