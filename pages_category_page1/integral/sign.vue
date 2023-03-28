<template>
  <view>
    <global-loading />
    <view class="signBox" v-if="ifShow">
      <view class="signBg">
        <view class="signDayNumBox flex-center" v-if="continuousNum">
          <view class="signDayNum fs28">
            当前周期已连续签到
            <text class="fs40">{{ continuousNum || '0' }}</text>
            天
          </view>
        </view>
        <view v-if="currentDay == lastDay" class="signState flex-center mar-top-30">
          <view class="signStateBg flex-items flex-center noSign">
            <text class="fs48">已签到</text>
          </view>
        </view>
        <view v-if="currentDay != lastDay" class="signState flex-center mar-top-30" @click="signInFn" >
          <view class="signStateBg flex-items flex-center">
            <text class="fs48">未签到</text>
          </view>
        </view>
        <view class="calendarBox">
          <view class="calendarBg">
            <view class="calendar-box">
              <view class="month">
                <view class="u-arrow u-arrow-left" @click="lastMonth"></view>
                <view>{{year}}年{{month}}月</view>
                <view class="u-arrow u-arrow-right" @click="nextMonth"></view>
                <picker v-if="checkDate" class="picker" mode="date" fields="month" @change="changeDate" />
              </view>
              <view class="week">
                <view :style="'color:'+(weeks==weeked?bgweek:'')+';'" v-for="weeks in weekArr">{{weeks}}</view>
              </view>
              <view class="day">
                <view
                    class="dayItem"
                    v-for="(days,index) in dayArr"
                    :key="index"
                    @click="signToday(days,index)"
                >
                  <view
                      :class="[
                    {'checkday':days.date==''},
                    {'choose':days.date==currentDay},
                    {'select': days.select === 1}
                  ]"
                      class="dayValue"
                  >{{days.day}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="redEnvelope mar-top-20">
        <view class="redEnvelopeBg flex-items flex-end">
          <view>
            <view class="fs32 font-color-333">积分兑换红包优惠券</view>
            <view class="fs24 font-color-999 mar-top-10">各种大额红包等你兑换哦</view>
            <view class="fs24 font-color-FFF exchangeBtn mar-top-20" @click="goToexchange">马上兑换</view>
          </view>
        </view>
      </view>
      <!-- 签到弹窗 -->
      <tui-modal :show="signTips" :custom="true" :fadein="true">
        <view class="Put-box1">
          <view class="text-align fs34 fs-bold">
            签到成功
          </view>
          <view class="mar-top-40 text-align">
            今日签到成功，签到积分可以在我的积分内兑换商品
          </view>
          <view class="flex-display flex-sp-between">
            <view class="btn" @click="signTips = false">
              取消
            </view>
            <view class="btn submit" @click="signTips = false">
              确定
            </view>
          </view>
        </view>
      </tui-modal>
    </view>
  </view>
</template>

<script>
import tuiModal from "@/components/modal/modal";
import dateUtil from "@/utils/dateUtil"
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  components: {
    tuiModal
  },
  name: "sign",
  data() {
    return {
      signList: [],
      year: new Date().getFullYear(), // 当前年
      month: new Date().getMonth() + 1, // 当前月
      continuousNum: '', // 连续签到天数
      currentDay: dateUtil.formatDate(),
      currentMonth: dateUtil.formatMonth(),
      lastDay: '',
      weeked: '', // 今天周几
      dayArr: [], // 当前月每日
      day: new Date().getDate(), // 当前日
      weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 每周
      type: 'sign',
      checkDate: true,
      bgweek: '#C5AA7B',
      bgday: '#C5AA7B',
      signTips: false,
      ifShow: false
    }
  },
  onLoad() {
    this.getSignData()
  },
  methods: {
    getSignData() {
      // uni.showLoading({
      //   mask: true,
      //   title: '请稍等...',
      // })
      let selectMonth = this.year + '-' + this.formatNum(this.month)
      const that = this
      NET.request(API.selectByMonth,
        {
          month: `${this.year}-${this.formatNum(this.month)}`
        },
        'POST')
        .then(res => {
          // uni.hideLoading()
          that.ifShow = true
          that.signList = res.data

          // 初始日期
          that.initDate()

          // 今天日期
          if (that.currentMonth === selectMonth) {
            that.continuousNum = that.signList[that.signList.length - 1].continueDay || 0;
            that.lastDay = that.signList[that.signList.length - 1].createTime.substring(0,10);
          }

          // 今天周几
          that.weeked = that.weekArr[new Date().getDay()];
          // 签到功能
          if (that.type !== 'calendar') {
            for (let i in that.dayArr) {
              that.$set(this.dayArr[i], 'flag', false);
            }
          }

          that.signList.forEach((item) => {
            item['day'] = parseInt(item.createTime.slice(8, 10))
          })

          for (let i = 0; i < that.signList.length; i++) {
            for (let j = 0; j < that.dayArr.length; j++) {
              if (that.signList[i].day === that.dayArr[j].day && that.dayArr[j].date !== '') {
                that.dayArr[j].select = 1
              }
            }
          }
      }).catch(res => {})
    },
    signDate(event) {
    },
    // 签到
    signInFn() {
      // uni.showLoading({
      //   mask: true,
      //   title: '请稍等...',
      // })
      NET.request(API.creditSignIn, {}, 'POST').then(res => {
        // uni.hideLoading()
        this.getSignData()
        this.signTips = true
      }).catch(res => {})
    },
    // 格式化日期位数
    formatNum(num) {
      return num < 10 ? ('0' + num) : num;
    },
    // 选择年月
    changeDate(e) {
      let that = this;
      that.year = parseInt(e.detail.value.split('-')[0]);
      that.month = parseInt(e.detail.value.split('-')[1]);
      this.getSignData()
    },
    // 点击签到
    signToday(obj, index) {
    },
    // 初始化日期
    initDate() {
      let that = this;
      that.dayArr = [];
      // 当前月总天数
      let totalDay = new Date(that.year, that.month, 0).getDate();
      // 遍历总天数将日期逐个添加至数组
      for (let i = 1; i <= totalDay; i++) {
        // 得到需补充天数
        let value = (new Date(that.year, that.month - 1, i)).getDay();
        // 补充前面空白日期
        if (i === 1 && value !== 0) that.addBefore(value);
        // 添加本月日期
        let obj = {};
        obj.date = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(i);
        obj.day = i;
        obj.select = 0
        that.dayArr.push(obj);
        // 补充后面空白日期
        if (i === totalDay && value !== 6) that.addAfter(value);
      }
    },
    // 补充前面空白日期
    addBefore(value) {
      let that = this;
      let totalDay = new Date(that.year, that.month - 1, 0).getDate();
      for (let i = 0; i < value; i++) {
        let obj = {};
        obj.date = '';
        obj.day = totalDay - (value - i) + 1;
        that.dayArr.push(obj);
      }
    },
    // 补充后空白日期
    addAfter(value) {
      let that = this;
      for (let i = 0; i < (6 - value); i++) {
        let obj = {};
        obj.date = '';
        obj.day = i + 1;
        that.dayArr.push(obj);
      }
    },
    // 上一个月
    lastMonth() {
      let that = this;
      if (that.month === 1) {
        that.year -= 1;
        that.month = 12;
      } else {
        that.month -= 1;
      }
      that.getSignData();
    },
    // 下一个月
    nextMonth() {
      let that = this;
      if (that.month === 12) {
        that.year += 1;
        that.month = 1;
      } else {
        that.month += 1;
      }
      that.getSignData();
    },
    goToexchange() {
      uni.navigateTo({
        url: '../../pages_category_page1/integral/index?tabActive=2'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background: #F8F8F8;
}
.signBox {
  padding-bottom: 50rpx;
  .signBg {
    background: url("https://ceres.zkthink.com/static/images/signBg.png") no-repeat left top;
    background-size: contain;
    min-height: 702rpx;
    padding-top: 160rpx;
    .signDayNumBox {
      width: 100%;
      .signDayNum {
        color: #93866F;
        text {
          color: #FDF3D0;
          margin: 0 10rpx;
        }
      }
    }
    .signState {
      .signStateBg {
        width: 300rpx;
        height: 300rpx;
        background: url("https://ceres.zkthink.com/static/images/signState.png") no-repeat left top;
        background-size: contain;
        text {
          color: #C83732;
        }
      }
      .noSign {
        background: url("https://ceres.zkthink.com/static/images/signState1.png") no-repeat left top;
        background-size: contain;
        text {
          color: #FFFFFF;
        }
      }
    }
    .checked {
      .signStateBg {
        text {
          color: #FFFFFF;
        }
      }
    }
    .calendarBox {
      padding: 0 20rpx;
      min-height: 300rpx;
      .calendarBg {
        border-radius: 16rpx;
        background: #FFFFFF;
        box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
    }
  }
  .redEnvelope {
    padding: 0 20rpx;
    .redEnvelopeBg {
      height: 230rpx;
      background: url("https://ceres.zkthink.com/static/images/redEnvelopeBg.png") no-repeat left top;
      background-size: contain;
      padding-right: 50rpx;
      .exchangeBtn {
        width: 160rpx;
        height: 56rpx;
        line-height: 56rpx;
        background: #C83732;
        border-radius: 8rpx;
        text-align: center;
      }
    }
  }
}
.calendar-box {
  width: 100%;
  flex-direction: column;
  justify-content: center;
}

.calendar-box,
.month,
.week,
.day {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.month,
.week,
.day {
  width: 100%;
}

.month {
  height: 96rpx;
  padding: 0 50rpx;
  position: relative;
  background: #FAF6ED;
  .u-arrow {
    border-top: 4rpx solid #666;
    border-right: 4rpx solid #666;
  }
}

.picker {
  width: 160rpx;
  height: 40rpx;
  position: absolute;
  top: 20rpx;
  left: 50%;
  transform: translate(-50%, -50%);
}

.day {
  flex-wrap: wrap;
  .dayValue {

  }
}

.week>view,
.day>view.dayItem {
  width: 100rpx;
  height: 100rpx;
  position: relative;
  line-height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dayValue {
  width: 60rpx;
  height: 60rpx;
  text-align: center;
  position: relative;
  line-height: 60rpx;
}
.checkday {
  color: #999;
}

.select {
  background: #FAF6ED;
  color: #C5AA7B;
  border-radius: 50%;
}

.choose {
  color: #FFFFFF;
  background: #C5AA7B;
  border-radius: 50%;
}

.circle {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sign {
  background-color: #0089fe;
}

.repair {
  background-color: #f4a01a;
}
.Put-box1 {
  .btn {
    text-align: center;
    margin-top: 40rpx;
    border: 2rpx solid #333333;
    height: 80upx;
    line-height: 80upx;
    width: 240upx;
    color: #333333;
  }

  .submit {
    background-color: #333333;
    color: #FFEBC4;
  }
}
</style>
