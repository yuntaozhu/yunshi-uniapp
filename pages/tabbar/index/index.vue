<template>
	<div class="" :class="'terminal' + terminal">
		<view class="header">
			<view class="topBox">
				<image class="logo" src="@/static/assets/img/logo.png" mode="widthFix"></image>
				<view class="search-btn" @click="searchPro">
					<image class="search-icon" src="@/static/img/search.png" mode="widthFix"></image>
				</view>
			</view>
			<category-list @tabChange='tabChange'></category-list>
		</view>
		<canvas-page v-if="activeTab==0" :terminal="terminal" :typeId="1"></canvas-page>
		<category-show v-else :categoryid="categoryid"></category-show>
	</div>
</template>

<script>
	const API = require('../../../config/api')
	import CategoryList from "@/components/basics/categoryList.vue"
	import CategoryShow from "@/components/basics/categoryShow.vue"
	import canvasPage from '@/components/canvasShow/canvasShowPage.vue'
	export default {
		components: {
			CategoryList,
			CategoryShow,
			canvasPage
		},
		data() {
			return {
				terminal: API.terminal,
				activeTab: 0,
				categoryid: 0
			}
		},
		methods: {
			tabChange(index, id) {
				this.activeTab = index
				this.categoryid = id
				console.log(index, id)
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
		.topBox {
			padding-top: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}
		.logo {
			width: 280rpx;
			height: 42rpx;
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

	.terminal1 {
		padding-top: 80upx;

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
</style>
