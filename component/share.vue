<template>
	<div>
		<u-popup v-model="shareShow" :round="10" mode="bottom" @close="cancel(1)">
			<view class="share">
				<!-- <u-mask :show="true" class="flex-items-plus flex-row"> -->
				<text class="h3">邀请好友</text>
				<view class="share-list">
					<view class="ul">
						<!-- #ifndef MP -->
						<!-- #ifndef APP -->
						<view class="li" @click="share('weixin')">
							<image class="icon" src="../static/images/weixin2x.png"></image>
							<label class="label">微信</label>
						</view>
						<view class="li" @click="share('qq')">
							<image class="icon" src="../static/images/qq2x.png"></image>
							<label class="label">QQ</label>
						</view>
						<view class="li" @click="share('weibo')">
							<image class="icon" src="../static/images/weibo2x.png"></image>
							<label class="label">微博</label>
						</view>
						<!-- #endif -->
						<view class="li" @click="share('lianjie')">
							<image class="icon" src="../static/images/lianjie.png"></image>
							<label class="label">链接</label>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button class="li" open-type="share">
							<image class="icon" src="../static/images/forward.png"></image>
							<label class="label">转发</label>
						</button>
						<!-- #endif -->
					</view>
				</view>
				<view class="btn-close" @click="cancel(1)">取消</view>

			</view>
		</u-popup>
		<u-popup v-model="wapShow" :round="10" mode="bottom" :border-radius="10" @close="cancel(2)">
			<view class="share-h5">
				<view class="text">
					点击浏览器下方<view class="icon"><u-icon name="list" color="#fff" size="28"></u-icon></view>即可进行分享
				</view>
			</view>
		</u-popup>
	</div>
</template>

<script>
	import ClipboardJS from "clipboard"
  import UImage from "../uview-ui/components/u-image/u-image";
	const API = require('../config/api')
	export default {
    components: {UImage},
    props:{
			url:{
				type:String,
				dafault:''
			}
		},
		name:"share",
		data() {
			return {
				shareShow: false,
				wapShow: false,
				longUrl: ''
			};
		},
		mounted () {
    	this.longUrl = API.shareLink + '/#' + this.url
			console.log(this.longUrl,this.url)
		},
		methods:{
			cancel(key){
				if(key === 1){
					this.shareShow = false
					this.$emit('shareCancel')
				} else if(key === 2) {
					this.wapShow = false
				}

			},
			share(key){
				var desc = `推荐好文：看到一篇不错的文章，值得一看，推荐给大家。`
				console.log(this.url)
				// #ifdef H5
				this.shareShow = false
				this.wapShow = true
				// #endif
				// #ifdef APP
				switch (key) {
					case 'weixin':
						break
					case 'qq':

						break
					case 'weibo':

						break
					case 'lianjie':
						uni.setClipboardData({
							data: this.longUrl,
							success: () => {
								uni.showToast({
									title: '复制成功'
								})
							}
						})
						break
				}
				// #endif
			},
			//重写分享方法
			overShare: function () {
				//监听路由切换
				//间接实现全局设置分享内容
				wx.onAppRoute(function (res) {
					//获取加载的页面
					let pages = getCurrentPages(),
							//获取当前页面的对象
							view = pages[pages.length - 1],
							data;
					if (view) {
						data = view.data;
						console.log('是否重写分享方法', data.isOverShare);
						if (!data.isOverShare) {
							data.isOverShare = true;
							view.onShareAppMessage = function () {
								//你的分享配置
								return {
									title: '标题',
									path: '/pages/nearby/index'
								};
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.share{
		background-color: #F8F8F8;
		text-align: center;
		.h3{
			font-size: 30rpx;
			color: #333333;
			line-height: 42rpx;
			padding: 30rpx 0;
			border-bottom: 2px solid #F0F0F0;
			display: block;
		}
		.share-list{
			padding: 40rpx 0 54rpx;
			.ul{
				display: flex;
				justify-content: space-around;
				.li{
					&::after {
						border: none;
					}
					.icon{
						display: block;
						width: 92rpx;
						height: 92rpx;
					}
					.label{
						padding-top: 22rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #333333;
						display: block;
					}
				}
			}
		}
		.btn-close{
			background-color: #fff;
			padding: 30rpx 0;
			font-size: 26px;
			color: #333;
		}
	}

	.share-h5{
		padding:0 20rpx;
		display: flex;
		justify-content: center;
		.text{
			line-height: 100rpx;
			font-size: 30px;
			.icon{
				background-color: #333;
				border-radius: 50%;
				display: inline-block;
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				line-height: 40rpx;
				margin: 0 10rpx;
			}
		}
	}
</style>
