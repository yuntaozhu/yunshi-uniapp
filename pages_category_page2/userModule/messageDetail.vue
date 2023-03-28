<template>
	<view class="messageDetail">
    <global-loading />
		<h3 class="detailTit">{{messageDateils.noticeTitle}}</h3>
		<view class="detailTime" v-if="messageDateils.createTime">时间：{{messageDateils.createTime}}</view>
		<view class="detailInfo">
			<rich-text :nodes="htmlData"></rich-text>
			<img :src="messageDateils.image" alt="">
		</view>
	</view>
</template>

<script>
	import parse from 'mini-html-parser2';
  import GlobalLoading from "../../components/diyLoading";
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		name: "messageDetail",
    components: {GlobalLoading},
    data() {
			return {
				onlyid: 0,
				messageDateils: {},
				htmlData: []
			}
		},
		onShow() {
			this.getNotice()
		},
		onLoad(options) {
			this.onlyid = options.noticeId
			this.getNotice()
		},
		methods: {
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
				return newContent;
			},
			gitMassageDateils() {
				NET.request(API.getMessageDateils, {
					noticeId: this.onlyid
				}, 'GET').then(res => {
					this.messageDateils = res.data
					this.messageDateils.noticeContent = this.formatRichText(this.messageDateils.noticeContent)
					parse(this.messageDateils.noticeContent, (err, htmlData) => {
						this.htmlData = htmlData
					})
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			},
			getNotice() {
				// uni.showLoading({
				// 	title: '加载中...',
				// })
				NET.request(API.readNotice, {
					noticeId: this.onlyid
				}, 'POST').then(res => {
					uni.hideLoading()
					this.gitMassageDateils()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.messageDetail {
		padding: 30upx;

		h3 {
			font-size: 36upx;
			color: #333333;
			margin-bottom: 40upx;
		}

		.detailTime {
			font-size: 28upx;
			color: #666666;
			margin-bottom: 50upx;
		}

		.detailInfo {
			word-wrap: break-word;

			p {
				font-size: 28upx;
				color: #333333;
				line-height: 48upx;
				text-indent: 1em;
				margin-bottom: 50upx;
			}

			img {
				width: 100%;
			}
		}
	}
</style>
