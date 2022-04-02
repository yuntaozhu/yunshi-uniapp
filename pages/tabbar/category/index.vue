<template>
	<view>
		<view class="header">
			<image class="logo" src="https://ceres.zkthink.com//assets/img/logo.png" mode="widthFix"></image>
		</view>
		<view class="content">
			<!-- 分类中心 -->
			<scroll-view scroll-y class="left-aside">
				<view v-for="(item,index) in flist" :key="item.classifyId" class="f-item b-b" :class="{active: index === currentIndex}" @click="tabtap(item,index)">
					{{item.classifyName}}
				</view>
			</scroll-view>
			<scroll-view scroll-with-animation scroll-y class="right-aside">
				<view v-for="item in slist" :key="item.classifyId" class="s-list">
			<view class="classBox flex-items-plus">
			  <image class="emptyOrder-img" src="https://ceres.zkthink.com/static/images/classRight.png"></image>
			  <text class="s-item">{{item.classifyName}}</text>
			  <image class="emptyOrder-img" src="https://ceres.zkthink.com/static/images/classLeft.png"></image>
			</view>
					<view class="t-list">
						<view @click="navToList(item.classifyId, titem.classifyId)" class="t-item" v-for="titem in item.childs" :key="titem.classifyId">
							<image :src="titem.classifyImage" class="pic-img default-img"></image>
							<text>{{titem.classifyName}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-if="ifEmpty" class="emptyOrder-box flex-items-plus flex-column">
				<image class="emptyOrder-img" src="https://ceres.zkthink.com/static/img/bgnull.png"></image>
				<label class="font-color-999 fs26 mar-top-30">该分类没有商品～</label>
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../../utils/request')
	const API = require('../../../config/api')
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentIndex: 0,
				currentId:'',
				flist: [],
				slist: [],
        ifEmpty: false
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData(){
				uni.showLoading({
          mask: true,
					title:'加载中...'
				})
				NET.request(API.FindCategoryListByDepth, {
						classifyId: "",
					}, 'GET').then(res => {
					this.flist = res.data
					this.currentId = this.flist[0].classifyId
					uni.hideLoading()
					this.getChildCategory()
				}).catch(res => {
					uni.hideLoading()
				})
			},
			getChildCategory(){
				uni.showLoading({
          mask: true,
					title:'加载中...'
				})
				NET.request(API.FindCategoryListByDepth,{
					classifyId:this.currentId
				},'GET').then(res => {
					uni.hideLoading()
					this.slist = res.data
          if (this.slist.length === 0) {
            this.ifEmpty = true
          }
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//一级分类点击
			tabtap(item,index){
        this.ifEmpty = false
				if(this.currentIndex == index){
					return;
				}

				this.currentId = item.classifyId;

				this.currentIndex = index
				this.getChildCategory()
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `../../../pages_category_page1/goodsModule/goodsList?category3Id=${tid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		/* background-color: #f8f8f8; */
	}
	.header{
		border-bottom: 1px solid #F3F4F5FF;
	}
	.logo {
		width: 280rpx;
		height: 42rpx;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100vh;
		background-color: #F8F8F8;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
            background: #FFFFFF;
		}
	}

	.right-aside{
		flex: 1;
		padding: 20upx 0 20upx 0;
		background: #fff;
		height: 100vh;
	}
	.s-item{
		display: flex;
		align-items: center;
    justify-content: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
		image{
			width: 140rpx;
			height: 140rpx;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image{
			width: 140upx;
			height: 140upx;
		}
	}
	.emptyOrder-box{
		margin-left: 180upx;
		.emptyOrder-img{
			margin-top: -130upx;
			width: 113upx;
			height: 98upx;
		}
	}
  .classBox {
    image {
      width: 66rpx;
      height: 4rpx;
      margin-top: 10rpx;
    }
    .s-item {
      margin: 0 10rpx;
    }
  }
</style>
