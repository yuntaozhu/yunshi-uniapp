<template>
  <view class="groupBuy">
    <global-loading />

    <view class="groupBuyBg">
      <image src="https://ceres.zkthink.com/static/images/groupBuyLogo.png"></image>
    </view>
    <view
        class="countdown"
        v-if="shopShowType == false"
    >
      <label v-if="groupDataList.state === 1">距结束剩余</label>
      <label v-else>即将开始</label>
      <view class="endDate"><span>{{ hou }}</span><i>:</i><span>{{ min }}</span><i>:</i><span>{{ sec }}</span></view>
    </view>
    <!--	 <view class="filterBox" v-else>-->
    <!--		 <view class="item" :class="selectIndex == 0 ? 'selected' : ''" @click="synthesize"><span>综合</span></view>-->
    <!--		 <view class="item" :class="selectIndex == 1 ? 'selected' : ''" @click="sales"><span>销量</span></view>-->
    <!--		 <view class="item" :class="selectIndex == 2 ? 'selected' : ''" @click="priceClick"><span>价格</span></view>-->
    <!--	 </view>-->
    <view class="shop-list-nav">
      <view
          class="nav-item-sort"
          @click="sortTap(1)"
      >
        <text
            class="nav-title"
            :class="{'active' : sortIndex == 1}"
        >综合
        </text>
      </view>
      <view
          class="nav-item-sort"
          @click="sortTap(2)"
      >
        <text
            class="nav-title"
            :class="{'active' : sortIndex == 2}"
        >价格
        </text>
        <view class="r">
          <view
              class="arrowUp"
              :class="{activeUp: type == 1}"
          ></view>
          <view
              class="arrowDown"
              :class="{activeDown: type == 2}"
          ></view>
        </view>
      </view>
      <view
          class="nav-item-sort"
          @click="sortTap(3)"
      >
        <text
            class="nav-title"
            :class="{'active' : sortIndex == 3}"
        >销量
        </text>
        <view class="r">
          <view
              class="arrowUp"
              :class="{activeUp: volume == 1}"
          ></view>
          <view
              class="arrowDown"
              :class="{activeDown: volume == 2}"
          ></view>
        </view>
      </view>
    </view>
    <view class="spikeList mar-top-20">
      <view
          class="listItem"
          v-for="(item,index) in groupBuy"
          :key="index"
      >
        <view class="itemBox">
          <img :src="item.image">
        </view>
        <view class="itemInfo">
          <view class="title">
            <p>{{ item.productName }}</p>
            <view class="tag-box">
              <view
                  class="number group-buy-number"
                  v-if="item.person>0"
              >{{ item.person }}人团
              </view>

              <view
                  class="number"
                  v-if="item.limitNumber"
              >限量{{ item.limitNumber }}件 / 剩余{{ item.limitStockNumber }}件
              </view>
            </view>
          </view>
          <view class="originalPrice">原价: ¥{{ item.originalPrice }}</view>
          <view class="price">
            <view class="currentPrice flex-row-plus flex-items-plus font-color-FF7800">
              <view class="iconBox">
                <image src="https://ceres.zkthink.com/static/images/groupBuyIcon.png"></image>
              </view>
              <view class="flex-row-plus flex-items priceInfo">
                <label class="fs24">￥</label>
                <label class="fs36">{{ item.price }}</label>
              </view>
            </view>
            <view
                v-if="groupDataList.state === 1"
                class="snapUpBtn"
                @click="gogoodsDetails(item.shopId,item.productId,item.skuId)"
            >
              <view class="btnText">去拼团</view>
              <view style="width: 82%;margin: 0 auto">
                <progress
                    activeColor="#FFFFFF"
                    :percent="getPercent(5, 10)"
                    active
                    stroke-width="5"
                />
              </view>
            </view>
            <view
                v-else
                class="snapUpBtn btnStyle1"
            >
              <view class="btnText">即将开始</view>
              <view style="width: 82%;margin: 0 auto">
                <progress
                    activeColor="#FFFFFF"
                    :percent="getPercent(5, 10)"
                    active
                    stroke-width="5"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
          v-if="ifEmpty"
          class="emptyOrder-box flex-items-plus flex-column"
      >
        <image
            class="emptyOrder-img"
            src="https://ceres.zkthink.com/static/img/bgnull.png"
        ></image>
        <label class="font-color-999 fs26 mar-top-30">暂无活动商品～</label>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  data() {
    return {
      pageType: true,
      groupBuy: [],
      page: 1,
      pageSize: 10,
      loadingType: 0,
      hou: "00",
      min: "00",
      sec: "00",
      shopId: 0,
      shopGroupWorkId: 0,
      type: 0,//价格
      volume: 0,//销量
      shopShowType: false,
      selectIndex: 0,
      sortIndex: 1,
      ifEmpty: false,
      groupDataList: {},
    }
  },
  onLoad(options) {
    if (options.shopId && options.shopGroupWorkId) {
      this.shopShowType = false
      this.shopId = options.shopId
      this.shopGroupWorkId = options.shopGroupWorkId
    } else {
      this.shopShowType = true
      this.shopId = 0
      this.shopGroupWorkId = 0
    }

  },
  onShow() {
    this.groupBuy = []
    this.getGroupBuylist()
  },
  onReachBottom() {
    if (this.loadingType == 1) {
      uni.stopPullDownRefresh()
    } else {
      this.page = this.page + 1
      this.getGroupBuylist()
    }
  },
  methods: {
    // synthesize(){
    // 	this.volume =1//销量
    // 	this.type = 1//价格
    // 	this.page = 1
    // 	this.selectIndex = 0
    // 	this.groupBuy = []
    // 	this.getGroupBuylist()
    // },
    // sales(){
    // 	//销量
    // 	if(this.volume == 1){
    // 		this.volume = 2
    // 	}else{
    // 		this.volume = 1
    // 	}
    // 	this.type = 1//价格
    // 	this.page = 1
    // 	this.selectIndex = 1
    // 	this.groupBuy = []
    // 	this.getGroupBuylist()
    // },
    // priceClick(){
    // 	this.volume =1//销量
    // 	//价格
    // 	if(this.type == 1){
    // 		this.type = 2
    // 	}else{
    // 		this.type = 1
    // 	}
    // 	this.page = 1
    // 	this.selectIndex = 2
    // 	this.groupBuy = []
    // 	this.getGroupBuylist()
    // },
    getPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0;
    },
    sortTap(index) {
      this.page = 1
      this.groupBuy = []
      this.sortIndex = index
      if (index == 1) {
        this.type = 0
        this.volume = 0
      } else if (index == 2) {
        this.volume = 0
        if (this.type === 0) {
          this.type = 1
        } else {
          this.type = this.type != 1 ? 1 : 2
        }
      } else if (index == 3) {
        this.type = 0
        if (this.volume === 0) {
          this.volume = 1
        } else {
          this.volume = this.volume != 1 ? 1 : 2
        }
      }
      this.getGroupBuylist()
    },
    gogoodsDetails(shopId, productId, skuId) {
      uni.navigateTo({
        url: '../goodsModule/goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' + skuId
      })
    },
    getGroupBuylist() {
      // uni.showLoading({
      //   mask: true,
      //   title: '加载中...',
      // })
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        shopId: this.shopId,
        shopGroupWorkId: this.shopGroupWorkId,
        type: this.type,
        volume: this.volume
      }
      NET.request(API.getGroupBuyList, param, 'GET').then(res => {
        uni.hideLoading()
        if (res.data.page.list.length == 0) {
          this.loadingType = 1
          this.page = this.page
        } else {
          this.groupDataList = res.data
          this.groupBuy = this.groupBuy.concat(res.data.page.list)
          if (this.groupBuy.length === 0) {
            this.ifEmpty = true
          }
        }
        if (this.shopShowType == false) {
          this.dateformat(res.data.time)
          this.countDown()
        }
      }).catch(res => {
        uni.showToast({
          title: '失败',
          icon: "none"
        })
      })
    },
    //时分秒换算
    dateformat(micro_second) {
      // 总秒数
      let second = Math.floor(micro_second / 1000);
      // 天数
      let day = Math.floor(second / 3600 / 24);
      // 小时
      let hr = Math.floor(second / 3600 % 24);
      // 分钟
      let min = Math.floor(second / 60 % 60);
      // 秒
      let sec = Math.floor(second % 60);
      this.hou = hr + day * 24
      this.min = min
      this.sec = sec
    },
    countDown() {
      let timeOut = setTimeout(() => {
        let hou = parseInt(this.hou);
        let min = parseInt(this.min);
        let sec = parseInt(this.sec);

        let netxSec = sec - 1;
        let netxMin = min
        let netxHou = hou;

        if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
          clearTimeout(timeOut)
          uni.switchTab({
            url: '../../pages/tabbar/index/index'
          })
          uni.showToast({
            title: "活动结束",
            duration: 2000,
            icon: 'none'
          })
        } else {
          if (netxSec == -1) {
            netxSec = 59
            netxMin = netxMin - 1;
          }
          if (netxMin == -1) {
            netxMin = 59
            netxHou = netxHou - 1
          }
          // if (netxHou == -1) {
          //   netxHou = 23
          // }

          this.hou = this.timeFormat(netxHou),
              this.min = this.timeFormat(netxMin),
              this.sec = this.timeFormat(netxSec),
              this.timeOut = timeOut
          this.countDown();
        }
      }, 1000)
    },
    timeFormat(param) { //小于10的格式化函数
      return param < 10 ? '0' + param : param;
    },
  }
}
</script>
<style>
page {
  background: #333333;
}
</style>
<style
    lang="scss"
    scoped
>
page {
  background: #333333;
}

.groupBuy {
  .selected {
    color: #FE6F52;
  }

  .groupBuyBg {
    text-align: center;
    margin: 50rpx auto;

    image {
      width: 262rpx;
      height: 52rpx;
    }
  }

  .countdown {
    display: flex;
    justify-content: center;
    height: 80upx;
    align-items: center;
    width: 100%;
    color: #CCCCCC;

    .endDate {
      display: flex;
      align-items: center;
      margin-left: 20upx;

      span {
        min-width: 44rpx;
        padding: 0 8rpx;
        height: 52upx;
        line-height: 52upx;
        background: #999999;
        display: block;
        font-size: 26upx;
        color: #FFEBC4;
        text-align: center;
      }

      i {
        font-size: 26upx;
        color: #999999;
        font-style: normal;
        margin: 0 8upx;
      }
    }
  }

  .spikeList {
    padding: 0upx 30upx 20upx 30upx;

    .listItem {
      display: flex;
      padding: 30upx;
      margin-bottom: 30upx;
      background: #FFFFFF;

      &:last-child {
        border-bottom: none;
      }

      .itemBox {
        width: 260upx;
        height: 260upx;
        margin-right: 30upx;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .itemInfo {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .iconBox {
          image {
            width: 58rpx;
            height: 36rpx;
          }
        }

        p {
          font-size: 26upx;
          color: #333333;
          line-height: 40upx;
          margin-bottom: 20upx;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .tilte {
          .number {
            color: #C5AA7B;
            font-size: 26rpx;
            height: 40rpx;
            background: #FFFFFF;
            border: 2rpx solid #E4E5E6;
            font-weight: 400;
            display: inline;
            padding: 0 5rpx;
          }
        }

        .originalPrice {
          font-size: 24upx;
          margin-top: 20upx;
          text-decoration: line-through;
          color: #CCCCCC;
        }

        .price {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .priceInfo {
            font-size: 40rpx;
            color: #C83732;
          }

          .snapUpBtn {
            width: 160upx;
            height: 84upx;
            text-align: center;
            background: linear-gradient(90deg, #C83732 0%, #E25C44 100%);
            box-shadow: 0rpx 6rpx 12rpx rgba(233, 0, 0, 0.3);
            opacity: 1;
            border-radius: 10rpx;

            .btnText {
              color: #FFFFFF;
              font-weight: 400;
              opacity: 0.5;
              margin: 10rpx 0;
            }

            .uni-progress {
              border-radius: 10rpx;
            }
          }

          .btnStyle1 {
            background: linear-gradient(90deg, #29C790 0%, #75D98C 100%);
            box-shadow: 0 6rpx 12rpx rgba(52, 203, 144, 0.3);
          }
        }
      }
    }
  }

  .filterBox {
    display: flex;
    height: 80upx;
    align-items: center;
    width: 100%;
    background: #FFFFFF;
    left: 0;

    .item {
      flex: 0 0 33.33%;
      text-align: center;
    }
  }
}

.shop-list-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80rpx;
  line-height: 76rpx;
}

.nav-item {
  flex: 1;
  font-size: 30rpx;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80rpx;
  line-height: 76rpx;
}

.nav-item.active {
  color: #C5AA7B;
}

.nav-item .line {
  display: inline-block;
  width: 80rpx;
  height: 4rpx;
  background: #fff;
  border-radius: 2rpx;
}

.nav-item.active .line {
  background: #C5AA7B;
}

.nav-item.padd-l {
  padding-left: 20%;
  box-sizing: border-box;
}

.active {
  color: #C5AA7B;
}

.nav-item.padd-r {
  padding-right: 20%;
  box-sizing: border-box;
}

.nav-item-sort {
  flex: 1;
  font-size: 24rpx;
  color: #999999;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  line-height: 80rpx;
}

.nav-item-sort .r {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 5rpx;

  .arrowDown {
    width: 0;
    height: 0;
    border-width: 10rpx;
    border-style: solid;
    border-color: #CCCCCC transparent transparent transparent;
    margin-top: 2rpx;
  }

  .arrowUp {
    margin-bottom: 2rpx;
    width: 0;
    height: 0;
    border-width: 10rpx;
    border-style: solid;
    border-color: transparent transparent #CCCCCC transparent;
  }

  .activeDown {
    border-color: #C5AA7B transparent transparent transparent;
  }

  .activeUp {
    border-color: transparent transparent #C5AA7B transparent;
  }
}

.emptyOrder-box {
  margin-top: 70upx;

  .emptyOrder-img {
    margin-top: 45%;
    width: 113upx;
    height: 98upx;
  }
}
.tag-box{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .number{
    display: inline-block;
    padding: 6rpx 16rpx;
    border-radius: 4rpx;
    border: 1rpx solid #E3928F;
    color: #E3928F;
    font-size: 14rpx;
  }
  .group-buy-number{
    background-color: #E3928F;
    border: none;
    color: #fff;
  }
}

</style>
<style scoped>
.snapUpBtn /deep/ .uni-progress-bar {
  border-radius: 10rpx;
  height: 8rpx;
  background-color: #deabab !important;
}

.snapUpBtn /deep/ .uni-progress-inner-bar {
  border-radius: 10rpx;
}

.spikeNav /deep/ .tabs-nav {
}
</style>
