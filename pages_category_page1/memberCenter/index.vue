<template>
  <view class="memberCenter" v-if="isShow">
    <view class="memberBox">
      <view class="posBox">
        <view class="memberBoxTop">
          <view class="memberTopPos">
            <view class="memberTopBg" :style="{backgroundImage:'url('+levelInfo.memberLevelBackground+')'}">
              <view class="avatarBox">
                <image :src="memberData.headImage"></image>
              </view>
              <view class="nameBox flex-display">
                <view class="name fs36">{{memberData.name}}</view>
                <view class="level">
                  <image :src="levelInfo.memberLevelIcon"></image>
                </view>
              </view>
              <view class="growing">
                <view class="growingValue flex-items">
                  <label class="fs24 font-color-71521B">会员成长值</label>
                  <label class="fs28 font-color-71521B mar-left-20">{{memberData.growth}}/{{memberData.nextLevelGrowth}}</label>
                </view>
                <view class="progressBar">
                  <view style="width: 100%">
                    <progress activeColor="#FFEBC4" :percent="getPercent(memberData.notRead, memberData.nextLevelGrowth)" active stroke-width="5" />
                  </view>
                </view>
                <view class="flex-display flex-sp-between">
                  <label class="fs24 font-color-71521B">{{memberData.memberLevelName}}</label>
                  <label class="fs24 font-color-71521B">{{memberData.nextLevelName}}</label>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="equityBox">
          <view class="equityTit">我的权益</view>
          <view class="equityList">
            <view class="equityItem" v-for="item of equityList" :key="item.memberId">
              <image :src="item.memberIcon"></image>
              <view class="fs26">{{item.memberName}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="signInList">
      <view class="signTit fs30 font-color-333">快速成长</view>
      <view class="signInBox">
        <view class="signItem flex-items flex-sp-between">
          <view class="itemLeft flex-items">
            <view class="leftIcon">
              <image src="../../static/img/member/memberList2.png"></image>
            </view>
            <view class="leftInfo">
              <label class="fs28 font-color-333">购物</label>
              <view class="fs24 font-color-999">购买商品获取相应成长值</view>
            </view>
          </view>
          <view class="rightBtn" @click="goToShopping">去购物</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  name: "index",
  data() {
    return {
      memberData: {},
      equityList: [],
      levelInfo: {},
      isShow: false
    }
  },
  onLoad() {
    this.getMemberShipList()
    this.memberData = uni.getStorageSync('storage_userInfo');
    console.log(this.memberData, 'sfsdfs')
    this.getMemberByMemberLevel()
  },
  methods: {
    getMemberShipList() {
      // 获取会员信息
      uni.showLoading({
        mask: true,
        title: '加载中...',
      })
      NET.request(API.getMemberShipList, {
      }, 'GET').then(res => {
        uni.hideLoading()
        this.isShow = true
        this.equityList = res.data
      }).catch(res => {
      })
    },
    // 去首页
    goToShopping () {
      uni.switchTab({
        url: '../../pages/tabbar/index/index'
      })
    },
    getPercent(num, total){
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0? "0%" : Math.round((num / total) * 10000) / 100.0;
    },
    // 获取会员等级
    getMemberByMemberLevel() {
      NET.request(`${API.getMemberByMemberLevel}/${this.memberData.memberLevelId}`,{}, 'GET').then(res => {
        this.levelInfo = res.data
        uni.setStorageSync('storage_levelInfo', this.levelInfo);
      }).catch(res => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background: #F8F8F8;
}
  .memberCenter {
    border-top: 2rpx solid #4b4b4b;
    background: url("../../static/images/addBankBg.png") no-repeat left top;
    background-size: contain;
    min-height: 800rpx;
    padding: 0 20rpx;
    .memberBox {
      min-height: 550rpx;
      margin-top: 180rpx;
      width: 100%;
      background: #523e3a;
      border-radius: 25rpx;
      background-size: contain;
      position: relative;
      box-sizing: border-box;
      .posBox {
        position: absolute;
        width: 100%;
        left: 0;
        top: -80rpx;
      }
      .memberBoxTop {
        padding: 0 20rpx;
        position: relative;
        .memberTopBg {
          background-size: cover;
          background-repeat: no-repeat;
          height: 302rpx;
        }
        .memberTopBg {
          padding: 0 20rpx;
        }
      }
      .avatarBox {
        position: absolute;
        top: -60rpx;
        left: 50rpx;
        image {
          width: 110rpx;
          height: 110rpx;
          border: 5rpx solid #FFFFFF;
          border-radius: 50%;
        }
      }
      .nameBox {
        padding-top: 90rpx;
        .name {
          color: #71521B;
          margin-right: 30rpx;
        }
        .level {
          image {
            width: 172rpx;
            height: 50rpx;
          }
        }
      }
      .growing {
        .progressBar {
          width: 100%;
          margin: 20rpx 0;
        }
      }
      .equityBox {
        text-align: center;
        background: #332a21;
        min-height: 326rpx;
        border-radius: 0 0 25rpx 25rpx;
        padding-top: 50rpx;
        .equityTit {
          color: #FFEBC4;
          font-size: 28rpx;
          background: url("../../static/images/quityBg.png") no-repeat center center;
          background-size: contain;
          width: 90%;
          margin: 0 auto;
        }
        .equityList {
          display: flex;
          flex-flow: wrap;
          margin-top: 30rpx;
          .equityItem {
            width: 25%;
            color: #FFEBC4;
            image {
              width: 92rpx;
              height: 92rpx;
            }
          }
        }
      }
    }
    .signInList {
      background: #FFFFFF;
      border-radius: 20rpx;
      padding: 30rpx;
      .signTit {
        font-weight: bold;
        height: 92rpx;
        line-height: 92rpx;
      }
      .signInBox {
        .signItem {
          border-top: 2rpx solid #F3F4F5;
          padding: 30rpx 0;
          .itemLeft {
            image {
              width: 92rpx;
              height: 92rpx;
              margin-right: 30rpx;
            }
          }
        }
        .rightBtn {
          width: 160rpx;
          height: 58rpx;
          line-height: 58rpx;
          background: #333333;
          border-radius: 10rpx;
          color: #FFEBC4;
          text-align: center;
        }
      }
    }
  }
</style>
<style scoped>
.progressBar /deep/ .uni-progress-bar {
  background-color: #C3A670 !important;
  height: 8rpx !important;
  border-radius: 22rpx;
}
.progressBar /deep/ .uni-progress-bar .uni-progress-inner-bar {
  border-radius: 22rpx;
}
</style>
