<template>
  <view
      class="qaBox"
      v-if="ifShow"
  >
    <view class="qaTopInfo">
      <view
          class="qaTopInfoBox"
          @click="goGoodsDetails"
      >
        <image :src="detailList.image"></image>
        <view class="qaInfoText">
          <h3>{{ detailList.productName }}</h3>
          <span>共{{ detailList.count }}个问题</span>
        </view>
      </view>
      <view class="qaTitBox">
        <view class="qaTit"><i>问</i>
          <h3>{{ detailList.problem }}</h3></view>
        <view class="qaTitTime"><img :src="detailList.headImage" />
          <span class="qaName">{{ detailList.name }}</span>
          <span class="qaTimeInfo">{{ detailList.createTime }}</span></view>
      </view>
    </view>
    <view class="answerListBox">
      <view class="answerNum">共{{ answerslength }}条回答</view>
      <view
          class="answerList"
          v-for="item in detailList.answers"
          :key="item.answerId"
      >
        <view class="answerItem">
          <view class="itemTit">
            <view class="itemAvatarBox">
              <img
                  :src="item.headImage"
                  alt=""
              >
              <span class="answerName">{{ item.name }}</span>
            </view>
            <view class="answerTime">{{ item.createTime }}</view>
          </view>
          <view class="answerInfo">{{ item.answer }}</view>
        </view>
      </view>
    </view>
    <view
        v-if="detailList.ifExhibition==1"
        class="pad-bot-100"
    ></view>
    <view
        class="answerBtn"
        v-if="detailList.ifExhibition==1"
        :style="{'padding-bottom':(isIphone==true? 50:0)+'rpx'}"
    >
      <view class="uni-form-item uni-column answerBtnBox">
        <input
            class="uni-input"
            v-model="answerText"
            focus
            placeholder="被邀请的用户才能回答"
        />
        <view
            class="answerButton"
            @click="answer"
        >回答
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
    import { onLoad } from "@dcloudio/uni-app";
    import API from "@/config/api";
    import { ref,inject } from "vue";
    import { request } from "@/utils/request";

    const detailList=ref( {})//商品问答详情
    const productId=ref( '')
    const images=ref( '')
    const productName=ref( '')
    const problemsData=ref( {})
    const answerText=ref( "")
    const answerslength=ref( 0)
    const num=ref( 0)
    const isIphone=ref( false)
    const ifShow=ref( false)
    const $getJumpParam = inject('$getJumpParam')
    onLoad((options)=>{
      isIphone.value = getApp().globalData.isIphone;
      problemsData.value = $getJumpParam(options)
      getProblems()
    })

    function goGoodsDetails() {
      let shopId = detailList.value.shopId
      let productId = detailList.value.productId
      let skuId = detailList.value.skuId
      uni.navigateTo({
        url: 'goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' + skuId
      })
    }
    //商品问答数据
    function getProblems() {
      request(API.getProblemDetail, {
        problemId: problemsData.value.problemId,
        productId: problemsData.value.productId,
      }, 'GET').then(res => {
        detailList.value = res.data
        ifShow.value = true
        answerslength.value = detailList.value.answers.length
        uni.removeStorageSync('seeAllFnData')
      }).catch(res => {
        uni.showToast({
          title: '失败',
          icon: "none"
        })
      })
    }
    //回答
    function answer() {
      request(API.addAnswer, {
        productId: problemsData.value.productId,
        answer: answerText.value,
        problemId: problemsData.value.problemId
      }, 'POST').then(res => {
        getProblems()
        answerText.value = ""
        uni.showToast({
          title: '回答成功',
          icon: "success"
        })
      }).catch(res => {
        uni.showToast({
          title: '失败',
          icon: "none"
        })
      })
    }
</script>
<style
    lang="scss"
    scoped
>
.qaBox {
  padding: 0 30upx;

  .qaTopInfo {
    margin-top: 20upx;

    .qaTopInfoBox {
      border-radius: 10upx;
      display: flex;
      align-items: center;
      padding: 15upx 20upx;
      margin-bottom: 55upx;

      image {
        border: 2px solid #E4E5E6;
        width: 120upx;
        height: 120upx;
        margin-right: 20upx;
      }

      .qaInfoText {
        h3 {
          font-size: 30upx;
          font-weight: 500;
          color: #333333;
          margin-bottom: 20rpx;
        }

        span {
          font-size: 24upx;
          color: #999999;
        }
      }
    }

    .qaTitBox {
      padding-bottom: 30upx;
      border-bottom: 1upx solid #EEEEEE;

      .qaTit {
        display: flex;
        align-items: center;
        margin-bottom: 35upx;

        i {
          width: 38upx;
          height: 38upx;
          background: #C83732;
          font-style: normal;
          text-align: center;
          color: #FFFFFF;
          font-size: 20upx;
          margin-right: 30upx;
        }

        h3 {
          font-size: 28upx;
          font-weight: 500;
          color: #333333;
        }
      }

      .qaTitTime {
        display: flex;
        align-items: center;

        img {
          width: 44upx;
          height: 44upx;
          margin-right: 20upx;
        }

        .qaName {
          font-size: 28upx;
          color: #666666;
          margin-right: 35upx;
        }

        .qaTimeInfo {
          color: #CCCCCC;
          font-size: 22upx;
        }
      }
    }
  }

  .answerListBox {
    .answerNum {
      font-size: 24upx;
      color: #CCCCCC;
      margin-bottom: 40upx;
      margin-top: 30upx;
    }

    .answerList {
      padding-bottom: 50upx;

      .answerItem {
        margin-bottom: 10upx;

        .itemTit {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .itemAvatarBox {
            display: flex;

            img {
              width: 46upx;
              height: 46upx;
              margin-right: 20upx;
            }

            .answerName {
              font-size: 26upx;
              color: #333333;
              font-weight: bold;
            }
          }

          .answerTime {
            color: #CCCCCC;
            font-size: 20upx;
          }
        }

        .answerInfo {
          color: #333333;
          font-size: 28upx;
          margin-top: 20upx;
          font-weight: 400;
        }
      }
    }
  }

  .answerBtn {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;

    .answerBtnBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 30upx;
      background: #FFFFFF;

      input {
        margin-right: 30upx;
        width: 530upx;
        background: #F1F1F1;
        min-height: 84upx;
        padding-left: 30upx;
        font-size: 28upx;
        color: #999999;
      }

      .input-placeholder {
        font-size: 24upx;
        color: #999999;
      }

      .answerButton {
        width: 152upx;
        height: 84upx;
        background: #333333;
        text-align: center;
        line-height: 84upx;
        font-size: 30upx;
        color: #FFEBC4;
      }
    }
  }
}
</style>
