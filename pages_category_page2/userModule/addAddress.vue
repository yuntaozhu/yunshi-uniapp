<template>
	<!-- 编辑/添加地址 -->
	<view class="container flex-center flex-column">
    <!-- #ifdef MP-WEIXIN -->
    <view class="wxAddress flex-items flex-end" v-if="type == 1">
      <view class="wxBtnBox flex-items" @click="addAddressWx">
        <image class="" src="../../static/images/withdraw.png"></image>
      </view>
    </view>
    <!-- #endif -->
		<view class="addressBack-box">
			<view class="consignee-box bor-line-F7F7F7">
				<input v-model="username" class="fs28"  placeholder-class="consignee" placeholder="收货人" />
			</view>
			<view class="iphoneNum-box bor-line-F7F7F7">
				<input type="number" v-model="phone" class="fs28" placeholder-class="iphoneNum" placeholder="手机号码" />
			</view>
			<view @click="locationClick" class="location-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
				<view class="fs28 location">所在地</view>
				<view class="locationBox">
<!--					<city-select v-model="locationShowFalg" @city-change="cityChange"></city-select>-->
          <u-picker-cere mode="region" v-model="locationShowFalg" @confirm="cityChange" :default-region='defaultRegion' title="所在地"></u-picker-cere>
					<text v-model="ssqText">{{ssqText}}</text>
					<image class="arrow mar-left-20" src="../../static/images/greyArrow.png"></image>
				</view>
			</view>
			<view class="detailAddress-box">
				<input class="fs28" v-model="address" placeholder-class="detailAddress" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等" />
			</view>
		</view>
		<view class="addressTagBack-box">
			<view @click="addressTagClick" class="addressTag-box bor-line-F7F7F7 flex-row-plus flex-sp-between flex-items">
				<view class="fs28 addressTag">地址标签</view>
				<view class="flex-items">
					<text v-model="tag">{{tag}}</text>
					<image class="arrow mar-left-20" src="../../static/images/greyArrow.png"></image>
				</view>
			</view>
			<view class="defaultState-box flex-row-plus flex-sp-between flex-items">
				<view class="fs28 defaultState">设为默认地址</view>
				<u-switch v-model="isDefault" active-color="#C5AA7B" inactive-color="#eee"></u-switch>
			</view>
		</view>
		<view class="deleteAddress-box" @click="delAddress" v-if="type == 2">
			<text class="font-color-C5AA7B">删除收货地址</text>
		</view>
		<view class="saveAddress-box">
			<view class="saveAddress" v-if="type == 1" @click="addAddressClick">保存</view>
			<view class="saveAddress" v-else @click="saveAddressClick">保存</view>
		</view>
		<!-- 所在地弹窗 -->
		<!-- <u-select v-model="locationShowFalg" safe-area-inset-bottom="true" mode="mutil-column-auto" :list="locationList" @confirm="locationConfirm" title="所在地"></u-select> -->
		<!-- 所在地弹窗 -->
<!--		<u-select v-model="addressTagShowFalg" mode="single-column" :list="addressTagList" @confirm="addressTagconfirm" title="地址标签"></u-select>-->
    <u-picker-cere mode="selector" v-model="addressTagShowFalg" :range="addressTagList" range-key="label" @confirm="addressTagconfirm" title="地址标签" :default-selector="[addressTagIndex]"></u-picker-cere>
	</view>
</template>

<script>
// import citySelect from './u-city-select.vue';
const NET = require('../../utils/request')
const API = require('../../config/api')
	export default {
    // components: {
		// 	citySelect
		// },
		data() {
			return {
				show: false,
				type: 1, // 1.添加新地址 2.编辑收货地址
				locationShowFalg:false,
				locationList: [],
				locationName:'',
				provinceName:'',
				cityName:'',
				districtName:'',
				addressTagList: [
					{
						value: '1',
						label: '家'
					},
					{
						value: '2',
						label: '公司'
					},
					{
						value: '3',
						label: '学校'
					}
				],
				addressTagShowFalg:false,
				areaList:[],
				username:'',
				phone:'',
				ssqText:'',
				address:'',
				tag:'',
				isDefault:false,
				province:'',
				city:'',
				area:'',
				id:'',
				ordertype:0,
				editAddress:{},
        addressTagIndex: 0,
        defaultRegion: []
			}
		},
		onLoad(options) {
			this.type = options.type
			if(options.ordertype == 1){
				this.ordertype = 1
			}
			let receiveId = options.receiveId
			if(this.type == 2){
        uni.showLoading({
          title: '请稍后...',
        })
        NET.request(API.receiveGetInfo,{receiveId:receiveId},"GET").then(res => {
          this.editAddress = res.data
          this.username = this.editAddress.receiveName
          this.phone = this.editAddress.receivePhone
          this.ssqText = this.editAddress.receiveAdress
          this.address = this.editAddress.address
          this.tag = this.editAddress.label
          for(let i=0;i<this.addressTagList.length;i++){
            if(this.addressTagList[i].label === this.tag){
              this.addressTagIndex = i
            }
          }
          this.isDefault = this.editAddress.defult
          this.defaultRegion = this.ssqText.split("-")
          this.province = this.defaultRegion[0]
          this.city = this.defaultRegion[1]
          this.area = this.defaultRegion[2]
          this.id = this.editAddress.receiveId
          uni.hideLoading()
        }).catch(res => {

        })
        // this.editAddress = JSON.parse(uni.getStorageSync('editAddress')) receiveGetInfo
        // if(Object.keys(this.editAddress).length > 0){
        //   this.username = this.editAddress.receiveName
        //   this.phone = this.editAddress.receivePhone
        //   this.ssqText = this.editAddress.receiveAdress
        //   this.address = this.editAddress.address
        //   this.tag = this.editAddress.label
        //   this.isDefault = this.editAddress.defult
        //   let ssqarr = this.ssqText.split("-")
        //   this.province = ssqarr[0]
        //   this.city = ssqarr[1]
        //   this.area = ssqarr[2]
        //   this.id = this.editAddress.receiveId
        // }

			}
			if(this.editAddress != ''){
				uni.removeStorageSync('editAddress')
			}
		},
		methods: {
			cityChange(e) {
				this.ssqText = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.province = e.province.label
				this.city = e.city.label
				this.area = e.area.label
			},
			locationClick(){
				this.locationShowFalg = true
			},
			locationConfirm(e) {
				this.provinceName = e[0].label
				this.cityName = e[1].label
				this.districtName = e[2].label
				this.locationDot = '·'
			},
			addressTagClick(){
				this.addressTagShowFalg = true
			},
			addressTagconfirm(index){
				this.tag = this.addressTagList[index].label
			},
			//编辑地址
			saveAddressClick(){
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if(this.username==''){
					uni.showToast({
					    title: '请输入收货人！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.phone==''){
					uni.showToast({
					    title: '请输入手机号！',
					    duration: 2000,
						icon:'none'
					});
				}else if(!phoneCodeVerification.test(this.phone)){
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon:'none'
					});
				}else if(this.province==''||this.city==''||this.city==''){
					uni.showToast({
					    title: '所在地不能为空！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.address==''){
					uni.showToast({
					    title: '请输入详细地址！',
					    duration: 2000,
						icon:'none'
					});
				}else{
					NET.request(API.AddresUpdate,{
						receiveId: this.id,
						receiveName: this.username,
						receivePhone: this.phone,
						receiveAdress: this.ssqText,
						address:this.address,
						label:this.tag,
						defult:this.isDefault
					},'POST').then(res => {
						uni.navigateBack({
							delta: 1
						});
						uni.removeStorageSync('editAddress');
					}).catch(res => {

					})
				}

			},
			//新增地址
			addAddressClick(){
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if(this.username==''){
					uni.showToast({
					    title: '请输入收货人！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.phone==''){
					uni.showToast({
					    title: '请输入手机号！',
					    duration: 2000,
						icon:'none'
					});
				}else if(!phoneCodeVerification.test(this.phone)){
				 	uni.showToast({
				 	    title: '请输入正确的手机号！',
				 	    duration: 2000,
				 		icon:'none'
				 	});
				 }else if(this.province==''||this.city==''||this.city==''){
					uni.showToast({
					    title: '所在地不能为空！',
					    duration: 2000,
						icon:'none'
					});
				}else if(this.address==''){
					uni.showToast({
					    title: '请输入详细地址！',
					    duration: 2000,
						icon:'none'
					});
				}else{
					NET.request(API.AddresAdd,
					{
						receiveName: this.username,
						receivePhone: this.phone,
						receiveAdress: this.ssqText,
						address:this.address,
						label:this.tag,
						defult:this.isDefault
					},'POST').then(res => {
						if(this.ordertype == 1){
							uni.setStorageSync('receiveItem', res.data)
							uni.navigateBack({
								delta: 2
							});
						}else{
							uni.navigateBack({
								delta: 1
							});
						}
					}).catch(res => {

					})
				}
			},
      addAddressWx() {
        let self = this
        uni.chooseAddress({
          success(res){
            self.username = res.userName
            self.phone = res.telNumber
            self.ssqText =  `${res.provinceName}-${res.cityName}-${res.countyName}`
            self.defaultRegion = self.ssqText.split("-")
            self.address = res.detailInfo
            self.province = res.provinceName
            self.city = res.cityName
          }
        })
      },
			//删除地址
			delAddress(){
				uni.showModal({
          title: '温馨提示',
          content: '是否删除此地址？',
          confirmText:'确定',
          cancelText:'取消',
          success: (res)=> {
            if (res.confirm) {
              this.subm()
            } else if (res.cancel) {
            }
          }
        })
			},
			subm(){
				NET.request(API.AddresDelete,{
					receiveId:this.id
				},'POST').then(res => {
					if(res.code === "200"){
						uni.navigateBack({
							delta: 1
						});
					}
				}).catch(res => {

				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.container{
		.addressBack-box{
			background-color: #FFFFFF;
			padding: 30upx 30upx;
			.consignee-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 20upx;
				.consignee{
					color: #999999;
					font-size: 28upx;
				}
			}
			.iphoneNum-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				.iphoneNum{
					color: #999999;
					font-size: 28upx;
				}
			}
			.location-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				.location{
					color: #999999;
					font-size: 28upx;
				}
        .locationBox {
          display: flex;
          align-items: center;
        }
			}
			.detailAddress-box{
				padding-bottom: 36upx;
				width: 690upx;
				margin-top: 36upx;
				input{
					width: 100%;
				}
				.detailAddress{
					color: #999999;
					font-size: 28upx;
				}
			}
		}
		.addressTagBack-box{
			background-color: #FFFFFF;
			padding: 30upx 30upx;
			margin-top: 20upx;
			.addressTag-box{
				padding-bottom: 36upx;
				width: 690upx;
				.addressTag{
					color: #999999;
					font-size: 28upx;
				}
			}
			.defaultState-box{
				padding-bottom: 10upx;
				width: 690upx;
				margin-top: 36upx;
				.defaultState{
					color: #999999;
					font-size: 28upx;
				}
			}
		}
		.arrow{
			width: 62upx;
			height: 62upx;
		}
		.saveAddress-box{
			position: fixed;
			bottom: 50upx;
			left: 30upx;
			.saveAddress{
				width: 690upx;
				height: 100upx;
				text-align: center;
				line-height: 100upx;
				background: #333333;
        color: #FFEBC4;
			}
		}
    .wxAddress {
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      color: #999999;
      .wxBtnBox {
        width: 100rpx;
        height: 80rpx;
        image {
          width: 80rpx;
          height: 80rpx;
        }
      }
    }
	}
	.deleteAddress-box{
		background-color: #FFFFFF;
		padding: 30upx 30upx;
		margin-top: 20upx;
	}
	.content{
		font-size: 35rpx;
		width: 500rpx;
		.btn{
			margin-bottom: 20rpx;
			 width: 200rpx;
			 background-image: linear-gradient( 135deg, #FFA100 10%, #FF7911 100%);
		}
	}
</style>
<style scoped>
.addressBack-box /deep/ .u-tab-item{
  color: #C5AA7B !important;
  font-weight: 400 !important;
}
.addressBack-box /deep/ .u-tab-bar {
  background-color: #C5AA7B !important;
}
</style>
