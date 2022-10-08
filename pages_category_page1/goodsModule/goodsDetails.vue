<template>
  <view>
    <global-loading/>

    <view
        class="container"
        v-if="ifShow"
        @scroll="onDetailScroll"
    >
      <!-- 商品详情 -->
      <view>
        <swiper
            class="goodsImgswiper-box"
            :indicator-dots="true"
            :autoplay="true"
        >
          <swiper-item
              v-for="(imgItem, index) in productData.images"
              :key="index"
          >
            <image
                class="goodsImg default-img"
                :src='imgItem'
            ></image>
          </swiper-item>
        </swiper>
      </view>
      <view
          class="share-box flex-items-plus"
          @click="clickShare"
      >
        <image
            class="share-img"
            src="https://ceres.zkthink.com/static/images/shareBut.png"
        ></image>
        <label class="fs24 mar-left-5">分享</label>
      </view>
      <view class="goodgDes-box flex-start flex-column">
        <view
            v-if="selectedSku.activityType === 0"
            class="priceBuyNum-box flex-display flex-sp-between mar-left-30"
        >
          <view>
            <label class="fs36 font-color-C83732">¥</label>
            <label class="fs36 fs-bold font-color-C83732 mar-left-10">{{ selectedSku.price || 0 }}</label>
            <label class="fs24 font-color-999 discountsPriceLine mar-left-20">¥
              {{ selectedSku.originalPrice || 0 }}</label>
          </view>
          <label class="fs24 font-color-999">{{ productData.users || 0 }}人付款</label>
        </view>
        <view
            v-else-if="selectedSku.activityType === 8"
            class="sceneMarketingBox"
        >
          <view class="flex-row-plus flex-items-plus mar-left-30 mar-top-10">
            <label class="fs30 font-color-FFF">¥</label>
            <label class="fs42 mar-left-5 font-color-FFF">{{ selectedSku.price || 0 }}</label>
            <label class="fs28 mar-left-10 discountsPriceLine font-color-CCC">¥
              {{ selectedSku.originalPrice || 0 }}</label>
          </view>
          <view class="sceneNameBox">{{ productData.sceneName }}</view>
        </view>
        <view
            v-else
            class="seckill-box"
        >
          <view
              class="flex-items flex-sp-between"
              v-if="selectedSku.activityType === 9 "
          >
            <view class="vipImg flex-items">
              <image
                  class="vip-icon"
                  src="https://ceres.zkthink.com/static/images/vipDetail.png"
                  mode=""
              >
              </image>
            </view>
            <view class="flex-row-plus flex-items-plus mar-left-30 mar-top-10">
              <label class="fs30 font-color-FFF">¥</label>
              <label class="fs42 mar-left-5 font-color-FFF">{{ selectedSku.price || 0 }}</label>
              <label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥
                {{
                  selectedSku.originalPrice || 0
                }}</label>
            </view>
          </view>
          <view
              v-else
              class="flex-items flex-row flex-sp-between"
          >
            <view class="flex-column-plus">
              <image
                  v-if="[2,4].includes(selectedSku.activityType)"
                  class="seckill-icon"
                  src="https://ceres.zkthink.com/static/images/seckillicon.png"
                  mode=""
              ></image>
              <image
                  v-if="[3,5].includes(selectedSku.activityType)"
                  class="discount-icon"
                  src="https://ceres.zkthink.com/static/images/discounticon.png"
                  mode=""
              ></image>
              <image
                  v-if="selectedSku.activityType === 1"
                  class="spell-icon"
                  src="https://ceres.zkthink.com/static/images/spellicon.png"
                  mode=""
              ></image>
              <view class="flex-row-plus flex-items mar-top-10">
                <label class="fs30 font-color-FFF">¥</label>
                <label class="fs42 mar-left-5 font-color-FFF">{{ selectedSku.price || 0 }}</label>
                <label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥
                  {{
                    selectedSku.originalPrice || 0
                  }}</label>
              </view>
            </view>
            <view
                v-if="[1,2,3,4,5].includes(selectedSku.activityType)"
                class="countdown flex-column-plus"
            >
              <view v-if="timeActivetype">
                <label class="fs28">距离结束剩余</label>
                <view class="flex-row-plus fs34 flex-items-plus mar-top-10">
                  <view class="countdown-box flex-items-plus">{{ hou }}</view>
                  <view class="font-color-999">:</view>
                  <view class="countdown-box flex-items-plus">{{ min }}</view>
                  <view class="font-color-999">:</view>
                  <view class="countdown-box flex-items-plus">{{ sec }}</view>
                </view>
              </view>
              <view v-else>
                <label class="fs28 mar-right-20">即将开始：{{ selectedSku.startTime }}</label>
                <!--              <view class="fs28 mar-right-20 mar-top-20">{{productData.startTime}}</view>-->
              </view>
            </view>
          </view>
        </view>
        <view class="nameContainer">
          <view class="goodsName-box overflowNoDot mar-top-30 mar-left-30">
            <label class="goodsName fs32 mar-left-20">{{ productData.productName }}</label>
          </view>
          <view
              class="collectBox"
              @click="collectProduct"
          >
            <image
                v-if="productData.ifCollect === 1"
                class="store-icon"
                src="https://ceres.zkthink.com/static/images/shoucangActive1.png"
            ></image>
            <image
                v-else
                class="store-icon"
                src="https://ceres.zkthink.com/static/images/shoucang2x.png"
            >
            </image>
            <label class="fs22">收藏</label>
          </view>
        </view>
        <view
            v-if="markTools.length>0 || shopMarkTools.length>0"
            class="activity-box mar-top-10"
            @click="couponShowClick"
        >
          <label class="fs24 font-color-999">优惠</label>
          <view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
            <view
                class="fs20 overflow"
                style="width: 500rpx;"
            >
              {{ productData.couponSplicing }}
            </view>
            <view class="flex-items">
              <label class="fs24 font-color-C5AA7B">领券</label>
              <image
                  class="coupon-arrow"
                  src="https://ceres.zkthink.com/static/img/user/arrow.png"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view class="express-box flex-items flex-row fs24">
        <label class="fs24 font-color-999 mar-right-20">发货</label>
        <image
            src="https://ceres.zkthink.com/static/images/mapIcon.png"
            v-if="productData.receive && productData.receive.receiveAdress"
        ></image>
        <label
            class="mar-left-10 mapName mar-right-30"
            v-if="productData.receive && productData.receive.receiveAdress"
        >{{
            productData.receive.receiveAdress
          }}</label>
        <label>快递：¥ {{ productData.logisticsPrice || 0 }}</label>
      </view>
      <view
          class="fs24 chooseSize-box flex-start"
          @click="goodsDetailShowClick(6)"
      >
        <view class="chooseSize-content flex-items flex-row flex-sp-between">
          <view class="flex-row-plus">
            <label class="fs26 mar-left-30 font-color-999">选择</label>
            <view class="valueBox mar-left-20 flex-items">
              <view
                  class="mar-right-10"
                  v-for="(item, index) of currentSuk"
                  :key="index"
              >{{ item.skuText }}
              </view>
            </view>
          </view>
          <image
              class="arrow-icon"
              src="https://ceres.zkthink.com/static/img/user/arrow.png"
          ></image>
        </view>
      </view>
      <!--结合销售-->
      <combined-sales
          :pid="productId"
          :productData="productData"
      ></combined-sales>
      <!--拼团-->
      <view
          v-if="selectedSku.activityType === 1"
          class="borRig-line-20"
      ></view>
      <view
          v-if="selectedSku.activityType === 1&&topThreeCollageOrders.length > 0"
          class="goodsDiscount"
      >
        <view class="questionTit mar-left-30 flex-items flex-row flex-sp-between">
          <label class="">这些人正在拼单</label>
          <view class="allMoreBox">
            <view
                v-if="topThreeCollageOrders.length > 0"
                class="allMore"
                @click="openAllBuy"
            >查看全部
            </view>
            <view
                v-else
                class="allMore"
                @click="openAllBuyTwo"
            >查看全部
            </view>
            <image
                class="evaluateAllArrow-icon mar-left-10"
                src="https://ceres.zkthink.com/static/img/user/arrow.png"
            ></image>
          </view>
        </view>
        <view
            class="groupBuy"
            v-for="(Gitem, index) in topThreeCollageOrders"
            :key="index"
        >
          <view
              class="groupBuyList"
              v-if="Gitem.time > 0"
          >
            <view class="groupBuyItem">
              <view class="leftAvatar">
                <img
                    :src="Gitem.headImage"
                    alt=""
                >
                <span>{{ Gitem.name }}</span>
              </view>
              <view class="rightInfo">
                <view
                    class="groupBuyTime"
                    style="width: 70%;"
                >
                  <view class="needPeople flex-row-plus">还差<b>{{ Gitem.person }}人</b>拼成</view>
                  <view class="endDate">剩余{{ timeChange(Gitem.time) }}</view>
                </view>
                <view
                    class="groupBuyBtn"
                    @click="getGroupShow(Gitem.collageId)"
                >和Ta拼
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--    组合支付-->
      <view class="borRig-line-20"></view>
      <view class="evaQaTab flex-items flex-sp-around">
        <view
            :class="{active: activeTab === 1}"
            class="evaBtn"
            @click="changeTabs(1)"
        >
          <view class="tabTit">宝贝评价（{{ commentListLength }}）</view>
        </view>
        <view
            :class="{active: activeTab === 2}"
            class="qaBtn"
            @click="changeTabs(2)"
        >
          <view class="tabTit">商品问答（{{ problemsListLength }}）</view>
        </view>
      </view>
      <view
          class="evaluate-box flex-start flex-column"
          v-show="activeTab === 1"
      >
        <view
            class="evaluateTag-box"
            v-if="commentListLength>0"
        >
          <view class="evaluateTag-text">
            全部({{ commentListLength }})
          </view>
        </view>
        <view
            class="evaluate-contentbox mar-top-30"
            v-for="(commentItem, index) in commentList"
            :key="index"
        >
          <view class="evaluate-content flex-items flex-row flex-sp-between">
            <view class="flex-items">
              <image
                  class="user-headSmallImg"
                  :src="commentItem.headImage"
              ></image>
              <label class="fs28 mar-left-20">{{ commentItem.name }}</label>
            </view>
            <label class="font-color-999 fs22">{{ commentItem.createTime }}</label>
          </view>
          <view class="evaluateDes-box">
            <label class="evaluateDes">{{ commentItem.comment }}</label>
          </view>
          <view
              class="item-image-box"
              v-if="commentItem.image"
          >
            <view
                v-for="(ItemImg, cindex) in commentImgData(commentItem.image)"
                :key="cindex"
            >
              <image
                  @click='previewImg(index,cindex)'
                  class="img-item"
                  :src="ItemImg"
              ></image>
            </view>
          </view>
          <view class="item-line"></view>
          <view
              class="item-like-box"
              v-if="commentItem.addComment !== ''"
          >
            <view class="addEvaluate">
              <view>追加评价：{{ commentItem.addComment }}</view>
              <view
                  class="item-image-box"
                  v-if="commentItem.addImages"
              >
                <view
                    v-for="(itemAddImg, imgIndex) in commentItem.addImages"
                    :key="imgIndex"
                >
                  <image
                      @click='previewAddImg(index,imgIndex)'
                      class="img-item"
                      :src="itemAddImg"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
          <view class="like-box">
            <image
                class="like-img"
                @click="zanTap(index, commentItem.commentId,0)"
                src="https://ceres.zkthink.com/static/images/praiseActiveIcon.png"
                v-if="commentItem.ifLike === 1"
            ></image>
            <image
                class="like-img"
                @click="zanTap(index, commentItem.commentId,1)"
                src="https://ceres.zkthink.com/static/images/praiseIcon.png"
                v-else
            ></image>
            <view class="like-num">{{ commentItem.likes }}</view>
          </view>
        </view>
        <view
            class="moreBox"
            v-if="commentListLength>0"
            @click="commentAll"
        >
          <label class="fs24">查看全部</label>
          <image
              class="evaluateAllArrow-icon mar-left-10"
              src="https://ceres.zkthink.com/static/img/user/arrow.png"
          ></image>
        </view>
      </view>
      <!--    评价END-->
      <!--    问答-->
      <view class="borRig-line-20"></view>
      <view
          class="questions"
          v-show="activeTab === 2"
      >
        <view class="questionInfo flex-items flex-row flex-sp-between">
          <view class="infoTit">宝贝好不好，问问已买过的人</view>
          <view
              class="putQuestion"
              @click="goToQuestions"
          >去提问
          </view>
        </view>
        <view class="listBox">
          <view
              class="itemBox"
              v-for="(pitem,index) in getProblemsList"
              :key="index"
          >
            <view class="itemAsk">
              <i>问</i><span>{{ pitem.problem }}</span>
            </view>
            <view v-if="pitem.answers.length>0">
              <view
                  class="answer"
                  v-for="(witem,index) in twonumansers(pitem.answers)"
                  :key="index"
              >
                <view class="answerBox">
                  <i>答</i><span>{{ witem.answer }}</span>
                </view>
                <view
                    class="answerBtn"
                    v-if="pitem.ifAnswer === 1"
                    @click="seeAllFn(pitem.problemId)"
                >立即回答
                </view>
              </view>
            </view>
            <view v-else>
              <view class="answer">
                <view class="answerBox">
                  <i>答</i><span>暂无答复</span>
                </view>
                <view
                    class="answerBtn"
                    v-if="pitem.ifAnswer === 1"
                    @click="seeAllFn(pitem.problemId)"
                >立即回答
                </view>
              </view>
            </view>
            <view
                v-if="pitem.answers.length>1"
                class="seeAll"
                @click="seeAllFn(pitem.problemId)"
            >查看全部答复
            </view>
          </view>
          <view
              class="moreBox"
              v-if="problemsListLength>0"
              @click="seeAllQa"
          >
            <label class="fs24">查看全部</label>
            <image
                class="evaluateAllArrow-icon mar-left-10"
                src="https://ceres.zkthink.com/static/img/user/arrow.png"
            ></image>
          </view>
        </view>
      </view>
      <view class="inStore-box flex-items flex-row flex-sp-between">
        <view class="flex-display flex-row">
          <view>
            <image
                @click="goStore"
                class="inStore-logo default-img"
                :src="productData.shopLogo"
            ></image>
          </view>
          <view class="flex-display flex-column mar-left-20">
            <label @click="goStore">{{ productData.shopName }}</label>
            <view class="flex-display flex-row fs24 font-color-999 mar-top-5">
              <label>商品总类：{{ productData.classifyNumber }}</label>
              <label class="mar-left-30">已售：{{ productData.number }}件</label>
            </view>
          </view>
        </view>
        <view
            class="inStore-but"
            @click="goStore"
        >去逛逛
        </view>
      </view>
      <view class="goodsDetails-box">
        <view class="goodsDetails-title">
          <view class="goodsDetails-Line"></view>
          <label class="goodsDetails-text">宝贝详情</label>
          <view class="goodsDetails-Line"></view>
        </view>
        <view class="goodsDetailsimg-box">
          <view class="">
            <rich-text :nodes="sellDescList"></rich-text>
          </view>
        </view>
      </view>
      <view class="buygoods-box">
        <view
            class="buygoodsBut-box flex-row-plus"
            :style="{'height':(isIphone === true? 160:130)+'rpx'}"
        >
          <view class="btns_container">
            <view
                class="btns flex-column-plus"
                @click="goStore"
            >
              <image
                  class="store-icon"
                  src="https://ceres.zkthink.com/static/images/storeIcon.png"
              ></image>
              <label class="fs22">店铺</label>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <view
                v-if="hasService"
                class="btns flex-column-plus mar-left-10"
                @click="flyToService"
            >
              <image
                  class="store-icon"
                  src="https://ceres.zkthink.com/static/images/service-product-detail.png"
              ></image>
              <label class="fs22">客服</label>
            </view>
            <!-- #endif -->
            <view
                class="btns flex-column-plus mar-left-10 flex-items Cart"
                @click="goshopCart"
            >
              <view
                  class="cartAllNum"
                  v-if="allCartNum>0"
              >{{ allCartNum }}
              </view>
              <image
                  class="store-icon"
                  src="https://ceres.zkthink.com/static/images/gouwuche.png"
              ></image>
              <label class="fs22">购物车</label>
            </view>
          </view>
          <view class="btns_container">
            <view
                class="flex-row-plus offShelf"
                v-if="productData.shelveState === 0"
            >
              商品已下架
            </view>
            <view
                class="flex-row-plus flex-items"
                v-else-if="selectedSku.activityType === 1"
            >
              <view
                  class="joinShopCartBut"
                  @click="goodsDetailShowClick(4)"
              >单独购买
              </view>
              <view
                  class="buyNowBut"
                  @click="goodsDetailShowClick(3)"
              >我要开团
              </view>
            </view>
            <view
                class="flex-row-plus flex-items"
                v-else
            >
              <view
                  class="joinShopCartBut"
                  @click="goodsDetailShowClick(1)"
              >加入购物车
              </view>
              <view
                  class="buyNowBut"
                  @click="goodsDetailShowClick(2)"
              >立即购买
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="returnTopService-box">
        <view
            class="returnTop-box flex-items-plus flex-column"
            @click="top"
            :style="{'display':(returnTopFlag===true? 'flex':'none')}"
        >
          <image
              class="returnTopImg"
              src="https://ceres.zkthink.com/static/images/backTop.png"
          ></image>
        </view>
      </view>
      <!-- 商品详情 -->
      <u-popup
          v-model="goodsDetailShowFlag"
          mode="bottom"
          border-radius="14"
      >
        <view class="goosDetailshow-box">
          <view class="detailImg-box flex-row-plus">
            <image
                class="detailImg"
                :src="selectedSku.image"
            ></image>
            <view class="flex-column-plus mar-left-40">
              <view class="font-color-C5AA7B">
                <label class="fs24">¥</label>
                <label
                    class="fs36 mar-left-10"
                    v-text="selectedSku.activityType === 1 && btnType === 4 ? selectedSku.originalPrice : selectedSku.price"
                ></label>
              </view>
              <label class="fs24 font-color-999 mar-top-20">库存 {{ selectedSku.stockNumber }} 件</label>
              <label class="fs24 mar-top-20">已选</label>
            </view>
          </view>
          <view class="color-box flex-column-plus">
            <view
                v-for="(attritem,index) in productData.names"
                :key="index"
            >
              <label
                  class="fs26 font-color-333"
                  v-if="attritem.nameCode"
              >{{ attritem.skuName }}</label>
              <view class="colorName-box">
                <view
                    class="pad-bot-30"
                    v-for="(attrRes, resIndex) in attritem.values"
                    :key="resIndex"
                >
                  <view
                      class="colorName"
                      :class="{'colorName-on' : selectedAttr[attritem.nameCode] == attrRes.valueCode}"
                      @click="nameCodeValueCodeClick(attritem.nameCode, attrRes.valueCode, true)"
                  >
                    {{ attrRes.skuValue }}
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="goodsNumCent">
            <view
                class="goodsNum-box flex-row-plus flex-sp-between"
                :class="{'bottom-line' :supportHuabei}"
            >
              <label class="font-color-333 fs26">数量</label>
              <view class="goodsNum">
                <view
                    class="item subtract"
                    @click="numSub()"
                >-
                </view>
                <view
                    class="item goodsNumber"
                    v-model="buyNum"
                >{{ buyNum }}
                </view>
                <view
                    class="item add"
                    @click="numAdd()"
                >+
                </view>
              </view>
            </view>
          </view>
          <view
              class="huabei-box flex-column-plus"
              v-if="supportHuabei"
          >
            <label class="font-color-999 fs24">花呗分期</label>
            <scroll-view
                class="fenqi-box"
                scroll-x="true"
            >
              <view
                  class="huabei-item"
                  :class="[{'fenqi-on' :fenqiIndex === 0},{'disabled' :disableFenqiList[0]}]"
                  @click="selectFenqi(0)"
              >
                <label class="huabei-period">分3期(含手续费)</label>
                <label class="huabei-money">￥{{ fenqiMoneyList[0] }}/期</label>
              </view>
              <view
                  class="huabei-item"
                  :class="[{'fenqi-on' :fenqiIndex === 1},{'disabled' :disableFenqiList[1]}]"
                  @click="selectFenqi(1)"
              >
                <label class="huabei-period">分6期(含手续费)</label>
                <label class="huabei-money">￥{{ fenqiMoneyList[1] }}/期</label>
              </view>
              <view
                  class="huabei-item"
                  :class="[{'fenqi-on' :fenqiIndex === 2},{'disabled' :disableFenqiList[2]}]"
                  @click="selectFenqi(2)"
              >
                <label class="huabei-period">分12期(含手续费)</label>
                <label class="huabei-money">￥{{ fenqiMoneyList[2] }}/期</label>
              </view>
            </scroll-view>
          </view>
          <view
              v-if="ifSkuSelect"
              class="skuSelectBtn"
          >
            <view
                class="flex-row-plus offShelf"
                v-if="productData.shelveState === 0"
            >
              商品已下架
            </view>
            <view
                class="flex-row-plus flex-items flex-sp-around"
                v-else-if="selectedSku.activityType === 1"
            >
              <view
                  class="selectJoinShop selectBtn font-color-333"
                  @click="addFast(2)"
              >单独购买
              </view>
              <view
                  class="selectBuyNow selectBtn font-color-FFEBC4"
                  @click="getGroupSettlement(1)"
              >我要开团
              </view>
            </view>
            <view
                class="flex-row-plus flex-items flex-sp-around"
                v-else
            >
              <view
                  class="selectJoinShop selectBtn font-color-333"
                  @click="addCart"
              >加入购物车
              </view>
              <view
                  class="selectBuyNow selectBtn font-color-FFEBC4"
                  @click="addFast(2)"
              >立即购买
              </view>
            </view>
          </view>
          <view v-else>
            <view
                v-if="selectedSku.activityType === 1 && collageId !== 0"
                class="goosDetailbut-box flex-items-plus"
                :style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}"
            >
              <view
                  class="joinbuyBut"
                  @click="getGroupSettlement(2)"
              >确定
              </view>
            </view>
            <view
                v-else-if="selectedSku.activityType === 1 && btnType === 3"
                class="goosDetailbut-box flex-row-plus"
                :style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}"
            >
              <view
                  class="buyNowBut"
                  @click="getGroupSettlement(1)"
              >去拼团
              </view>
            </view>
            <view
                v-else
                class="goosDetailbut-box flex-row-plus"
                :style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}"
            >
              <view
                  v-if="btnType === 1"
                  class="buyNowBut"
                  @click="addCart"
              >确认
              </view>
              <view
                  v-else
                  class="buyNowBut"
                  @click="addFast(2)"
              >确认
              </view>
            </view>
          </view>
        </view>
      </u-popup>
      <!-- 优惠券弹框 -->
      <coupon-popup
          ref="couponPopup"
          :markTools="markTools"
          :shopMarkTools="shopMarkTools"
          :setTop="topLeft"
          :currentActive="currentActive"
      ></coupon-popup>
      <!-- 拼单弹框 -->
      <u-popup
          class="popupDiscount"
          v-model="showGroupBuyList"
          mode="center"
          border-radius="14"
          close-icon-pos="top-right"
          close-icon-size="20"
      >
        <view class="popupDiscountTit">这些人正在拼单</view>
        <view class="groupBuy">
          <view class="groupBuyList">
            <scroll-view
                style="height: 480upx;"
                scroll-y
            >
              <view
                  class="groupBuyItem1"
                  v-for="(aitem,index) in selectedSku.collageOrders"
                  :key="index"
              >
                <view
                    class="leftAvatar"
                    v-if="aitem.time > 0"
                >
                  <img
                      :src="aitem.headImage"
                      alt=""
                  >
                  <view class="groupBuyTime">
                    <view class="needPeople"><span>{{ aitem.name }}</span>还差<b>{{ aitem.person }}人</b>
                    </view>
                    <view class="endDate">剩余{{ timeChange(aitem.time) }}</view>
                  </view>
                </view>
                <view
                    class="rightInfo"
                    v-if="aitem.time > 0"
                >
                  <view
                      class="groupBuyBtn"
                      @click="getGroupShow(aitem.collageId)"
                  >和Ta拼
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import UButton from "../../uview-ui/components/u-button/u-button";
import CombinedSales from "@/components/activities/combinedSales";
import CouponPopup from "../../components/goodsDetalils/coupon-popup";

const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  components: {
    CouponPopup,
    CombinedSales,
    UButton,
  },
  data() {
    return {
      screenHeight: 0,
      isIphone: "",
      returnTopFlag: false,
      goodsDetailShowFlag: false,
      colorActiveId: 1,
      modelNumActiveId: 1,
      parameterShowFlag: false,
      couponShowFlag: false,
      couponActiveFlag: 1,
      succeedShowFlag: false,
      productId: '',
      shopGroupWorkId: null,
      paramSkuId: '',
      productData: {
        logisticsPrice: 0
      },
      productCommentTotal: 0,
      commentKeywordVOList: [],
      buyNum: 1,
      storeDTO: {}, //店铺信息
      storeId: '',
      id: '',
      storeName: '',
      selectedSku: {
        originalPrice: 0
      },
      commentList: [],
      commentListLength: 0,
      sellDescList: '',
      couponListLength: 0,

      promotionType: 1,
      commentImgList: [],
      showVOList: [],
      promotionIds: '',
      couponList: [],
      isShowSuccess: false,
      selectedAttr: {},
      showGroupBuyList: false,
      topThreeCollageOrders: {}, //拼单数据
      getProblemsList: [], //商品问答数据
      problemsPage: 1,
      problemsPageSize: 2,
      timeActivetype: true,
      hou: "00",
      min: "00",
      sec: "00",
      countdownInterval: undefined,
      funtimeOut: undefined,
      collageId: 0,
      problemsListLength: 0,
      ticker: null,
      ifWork: 0, //是否拼团商品单独购买
      shopDiscountId: 0,
      shopSeckillId: 0,
      btnType: 1,
      fenqiIndex: -1,
      disableFenqiList: [false, false, false],
      fenqiMoneyList: ["0.00", "0.00", "0.00"],
      supportHuabei: false,
      salesId: 0, //分销员id
      activeTab: 1,
      // 组合支付
      swiperOption: {
        slidesPerView: 3, // 显示数量
        spaceBetween: 0, // 间隔
        autoplay: false, // 可选选项，自动滑动
        loop: true,
        pagination: {
          el: '.group-pagination'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      allCartNum: 0,
      currentSuk: [],
      isLoading: false,
      hasService: false,
      corpId: null, // 企业ID
      serviceURL: null, // 客服链接
      ifSkuSelect: false,
      markTools: [], //平台优惠券
      shopMarkTools: [], //店铺优惠券
      ifShow: false,
      topLeft: 0,
      currentActive: 0,
      // 埋点对象
      pointOption: {
        inTime: null,
        data: {
          eventType: 1,
          productIds: '',
        }
      }
    }
  },
  computed: {
    getcarNum() {
      this.allCartNum = uni.getStorageSync('allCartNum')
    }
  },
  created() {

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
    if (this.ticker) { //这一段是防止进入页面出去后再进来计时器重复启动
      clearInterval(this.ticker);
    }
    if (this.funtimeOut) {
      clearTimeout(this.funtimeOut)
    }
    if (this.allCartNum > 99) {
      this.allCartNum = '...'
    }
  },
  beforeDestroy() {

  },
  onShow() {
    this.getProblems()
  },
  onLoad(options) {
    this.pointOption.inTime = new Date().getTime()
    this.isIphone = getApp().globalData.isIphone;
    if (getApp().globalData.productShareItem) {
      const item = getApp().globalData.productShareItem
      this.shopId = parseInt(item.shopId)
      this.productId = item.productId
      this.paramSkuId = item.skuId
      this.salesId = parseInt(item.salesId)
      getApp().globalData.productShareItem = undefined
    } else {
      console.log(options, '001001')
      this.shopId = parseInt(options.shopId)
      this.productId = options.productId
      this.paramSkuId = options.skuId
      this.salesId = parseInt(options.salesId)
    }
    // 判断是否是拼团
    if (options.shopGroupWorkId) {
      this.shopGroupWorkId = options.shopGroupWorkId
    }
    this.queryProductDetail()
    this.bindSalesCustomer(this.salesId, this.shopId)
    this.getProblems()
    this.allCartNum = uni.getStorageSync('allCartNum')
    this.getServiceUrl()
  },
  onUnload() {
    // 判断是否要埋点
    const nowTime = new Date().getTime()
    if (nowTime - this.pointOption.inTime >= 5000) {
      // 埋点
      this.pointOption.data.productIds = this.productId
      this.$store.dispatch('doPointer', this.pointOption.data)
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
    if (this.ticker) { //这一段是防止进入页面出去后再进来计时器重复启动
      clearInterval(this.ticker);
    }
    if (this.funtimeOut) {
      clearTimeout(this.funtimeOut)
    }
    console.log('onUnload')
  },
  mounted() {
    // 获取手机的屏幕高度
    uni.getSystemInfo({
      success: (res) => {
        this.screenHeight = res.screenHeight
      }
    })
  },
  onPageScroll(e) {
    this.returnTopFlag = e.scrollTop > 600;
    this.topLeft = e.scrollTop
  },
  methods: {
    onDetailScroll(e) {
      console.log(e)
      this.topLeft = e.scrollTop
      console.log(this.topLeft)
    },
    previewImg(index, cindex) {
      let img = this.commentList[index].images[cindex]
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
      })
    },
    previewAddImg(index, cindex) {
      let img = this.commentList[index].images[cindex]
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表 previewAddImg
      })
    },

    //收藏
    collectProduct() {
      if (this.productData.ifCollect === 0) {
        this.collectPro()
      } else {
        this.cancelCollectPro()
      }
    },
    //收藏
    collectPro() {
      NET.request(API.collect, {
        productId: parseInt(this.productId)
      }, 'POST').then(res => {
        this.productData.ifCollect = 1
        uni.showToast({
          title: '收藏成功',
          icon: "success"
        })
      }).catch(res => {
        uni.showToast({
          title: '请先登录',
          icon: "none"
        })
      })
    },
    //取消收藏
    cancelCollectPro() {
      NET.request(API.cancelCollect, {
        ids: [this.productId]
      }, 'PUT').then(res => {
        this.productData.ifCollect = 0
        uni.showToast({
          title: '取消收藏成功',
          icon: "success"
        })
      }).catch(res => {
        uni.showToast({
          title: '失败',
          icon: "none"
        })
      })
    },
    //去拼单
    getGroupShow(collageId) {
      this.showGroupBuyList = false
      this.goodsDetailShowFlag = true
      this.collageId = collageId
    },
    //拼团下单
    getGroupSettlement(type) {
      //判断是否登录
      let item = {}
      if (uni.getStorageSync('storage_key')) {
        item = uni.getStorageSync('storage_key');
      }
      if (JSON.stringify(item) === '{}') {
        uni.navigateTo({
          url: '../../pages_category_page2/userModule/login'
        })
      } else if (this.selectedSku.stockNumber < 1) {
        uni.showToast({
          title: '库存不足',
          icon: "none"
        })
      } else {
        let data = {}
        if (type === 1) {
          data = {
            number: this.buyNum,
            productId: this.productId,
            shopId: this.shopId,
            skuId: this.selectedSku.skuId,
            shopGroupWorkId: this.selectedSku.shopGroupWorkId,
            type: type
          }
        } else {
          data = {
            collageId: this.collageId,
            number: this.buyNum,
            productId: this.productId,
            shopId: this.shopId,
            skuId: this.selectedSku.skuId,
            shopGroupWorkId: this.selectedSku.shopGroupWorkId,
            type: type
          }
        }
        uni.removeStorageSync("skuItemDTOList")
        uni.setStorageSync('skuItemList', data)
        //console.log(uni.getStorageSync("skuItemList"),44444)
        this.goodsDetailShowFlag = false
        this.buyNum = 1
        uni.navigateTo({
          url: '../orderModule/orderConfirm?type=1',
        })
      }
    },
    beginTimer() { //这个计时器是每秒减去数组中指定字段的时间
      var haveCollageOrders = false
      for (var key in this.productData.map) {
        let collageOrders = this.productData.map[key].collageOrders
        if (collageOrders && collageOrders.length > 0) {
          haveCollageOrders = true
        }
      }
      if (haveCollageOrders) {
        this.ticker = setInterval(() => {
          for (var key in this.productData.map) {
            let collageOrders = this.productData.map[key].collageOrders
            if (collageOrders && collageOrders.length > 0) {
              for (let i = 0, len = this.productData.map[key].collageOrders.length; i <
              len; i++) {
                const item = this.productData.map[key].collageOrders[i]
                if (item.time > 0) {
                  item.time = item.time - 1000;
                }
              }
            }
          }
        }, 1000);
      }
    },
    timeChange(remainMillSecs) {
      var $that = this;
      if (remainMillSecs < 0) {
        // clearInterval(setInterval(this.timeChange(countDown), 1000)); //当无剩余时间了，就停止执行timeChange函数
      }
      //求天时分秒 remainMillSecs是毫秒
      let remainSecs = remainMillSecs / 1000
      let leftSecond = $that.fillNumber(remainSecs % 60)
      let leftMinute = $that.fillNumber((remainSecs / 60) % 60)
      let leftHours = $that.fillNumber((remainSecs / (60 * 60)) % 24)
      let leftDay = $that.fillNumber(remainSecs / (60 * 60) / 24)
      if (leftHours === "00" && leftMinute === "00" && leftSecond === "-1") {
        if (this.ticker) {
          clearInterval(this.ticker)
        }
        this.queryProductDetail()
      }
      return leftHours + ":" + leftMinute + ":" + leftSecond;
    },
    fillNumber(num) {
      let number = Math.floor(num); //向下取整
      return number > 9 ? number : "0" + number;
    },
    getfuntime(micro_second) {
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
      let outtime = ""
      outtime = hr + ':' + min + ':' + sec
      return outtime
    },
    //时分秒换算
    dateformat(endTime) {
      endTime = endTime.substring(0, 19);
      endTime = endTime.replace(/-/g, '/');

      const micro_second = new Date(endTime).getTime() - new Date().getTime();

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
      if (this.countdownInterval) {
        return
      }
      let _that = this
      this.countdownInterval = setInterval(() => {
        let hou = parseInt(this.hou)
        let min = parseInt(this.min)
        let sec = parseInt(this.sec)

        let netxSec = sec - 1
        let netxMin = min
        let netxHou = hou
        if (netxHou === 0 && netxMin === 0 && netxSec === -1) {
          clearInterval(_that.countdownInterval)
          /* uni.switchTab({
							url: '../../pages/tabbar/index/index'
						}) */
          uni.showToast({
            title: "活动结束",
            duration: 2000,
            icon: 'none'
          })
          this.selectedSku.activityType = 0
          location.reload()
        } else {
          if (netxSec === -1) {
            netxSec = 59
            netxMin = netxMin - 1;
          }
          if (netxMin === -1) {
            netxMin = 59
            netxHou = netxHou - 1
          }

          this.hou = this.timeFormat(netxHou)
          this.min = this.timeFormat(netxMin)
          this.sec = this.timeFormat(netxSec)
        }
      }, 1000)
    },
    timeFormat(param) { //小于10的格式化函数
      return param < 10 ? '0' + param : param;
    },
    goshopCart() {
      uni.switchTab({
        url: '../../pages/tabbar/cart/index'
      })
    },
    twonumansers(answers) {
      return answers.slice(0, 2)
    },
    //商品问答数据
    getProblems() {
      NET.request(API.getProblems, {
        productId: this.productId,
        page: this.problemsPage,
        pageSize: this.problemsPageSize
      }, 'GET').then(res => {
        this.getProblemsList = res.data.list
        this.problemsListLength = res.data.total
      }).catch(res => {
        uni.showToast({
          title: '失败',
          icon: "none"
        })
      })
    },
    moveHandle() {
      return
    },
    changeTabs(type) {
      this.activeTab = type
    },
    //查看所有评论
    commentAll() {
      uni.navigateTo({
        url: 'evaluateList?commentList=' + JSON.stringify(this.commentList)
      })
    },
    commentImgData(imgData) {
      let imgDataResult = []
      imgDataResult = imgData.split(",");
      return imgDataResult
    },
    top() { //回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    //商品尺寸弹窗
    goodsDetailShowClick(type) {
      if (type === 6) {
        this.ifSkuSelect = true
      } else {
        this.ifSkuSelect = false
      }
      this.btnType = type
      this.collageId = 0
      this.goodsDetailShowFlag = true
    },
    //商品参数弹窗
    parameterTruebut() {
      this.parameterShowFlag = false
    },
    parameterShowClick() {
      this.parameterShowFlag = true
    },
    //优惠券
    couponActive(type) {
      this.couponActiveFlag = type
    },
    //优惠券弹窗
    couponShowClick() {
      this.$refs.couponPopup.showActivity = true
    },
    //领取成功
    succeedShowClick() {
      this.succeedShowFlag = true
      if (this.succeedShowFlag === true) {
        setTimeout(() => {
          this.succeedShowFlag = false
          // this.$refs.couponPopup.showActivity = false
        }, 1500);
      }
    },
    selectBySkuId(skuId) {
      if (skuId) {
        let mapinfo = this.productData.map
        for (var key in mapinfo) {
          console.log(skuId, mapinfo[key].skuId, 'test')
          if (parseInt(mapinfo[key].skuId) === parseInt(skuId)) {
            this.selectedSku = mapinfo[key]
            // 选中sku对应的规格
            const valueCodeList = key.split(',')
            this.productData.names.forEach(attr => {
              for (var index in attr.values) {
                let valueCode = attr.values[index].valueCode
                if (valueCodeList.includes(valueCode)) {
                  this.nameCodeValueCodeClick(attr.nameCode, valueCode, false)
                  let obj = {
                    skuText: ''
                  }
                  if (attr.values[index].valueCode === '单款项') {
                    obj.skuText = attr.values[index].skuValue
                    this.currentSuk.push(obj)
                    break
                  } else {
                    obj.skuText =
                        `${attr.values[index].skuName}:${attr.values[index].skuValue}`
                    this.currentSuk.push(obj)
                    break
                  }
                }
              }
            })
            break
          }
        }
      }
    },
    nameCodeValueCodeClick(nameCode, valueCode, reSelectSku) {
      this.selectedAttr[nameCode] = valueCode
      if (reSelectSku) {
        let attrList = []
        for (var key in this.selectedAttr) {
          attrList.push(this.selectedAttr[key])
        }
        const attrkey = attrList.join(',')
        let mapinfo = this.productData.map
        for (var key in mapinfo) {
          if (attrkey === key) {
            this.selectedSku = mapinfo[key]
            const valueCodeList = mapinfo[key].valueCodes.split(',')
            this.productData.names.forEach(attr => {
              for (var index in attr.values) {
                let valueCode = attr.values[index].valueCode
                if (valueCodeList.includes(valueCode)) {
                  this.nameCodeValueCodeClick(attr.nameCode, valueCode, false)
                  let obj = {
                    skuText: ''
                  }
                  if (attr.values[index].valueCode === '单款项') {
                    obj.skuText = attr.values[index].skuValue
                    this.currentSuk.push(obj)
                    break
                  } else {
                    obj.skuText =
                        `${attr.values[index].skuName}:${attr.values[index].skuValue}`
                    this.currentSuk.push(obj)
                    break
                  }
                }
              }
              this.currentSuk.shift()
            })
          }
          // this.productData.names.forEach(attr => {
          //   for (var index in attr.values) {
          //     let valueCode = attr.values[index].valueCode
          //     if (valueCodeList.includes(valueCode)) {
          //       this.nameCodeValueCodeClick(attr.nameCode, valueCode, false)
          //       this.currentSuk += `${attr.values[index].skuName}:${attr.values[index].skuValue} `
          //       console.log(this.currentSuk, 'currentSuk')
          //       break
          //     }
          //   }
          // })
        }
      }
      // 选中sku之后，做一些相应的操作
      this.selectSkuPostProcessor()

      this.$forceUpdate(); // 重绘
    },
    selectSkuPostProcessor() {
      console.log('selectSkuPostProcessor')
      const ifEnable = this.selectedSku.ifEnable
      if (this.selectedSku.activityType === 1 && ifEnable === 0) {
        this.topThreeCollageOrders = this.selectedSku.collageOrders.slice(0, 3)
      }
      if ([1, 2, 3, 4, 5].includes(this.selectedSku.activityType) && ifEnable === 0) {
        this.dateformat(this.selectedSku.endTime)
        this.countDown();
      }
      this.timeActivetype = ifEnable === 0;
      this.shopDiscountId = this.selectedSku.shopDiscountId
      this.shopSeckillId = this.selectedSku.shopSeckillId
    },
    //分期选中事件
    selectFenqi(index) {
      if (this.fenqiIndex !== index && !this.disableFenqiList[index]) {
        this.fenqiIndex = index;
      } else {
        this.fenqiIndex = -1;
      }
    },
    renderHuabei(skuPrice) {
      //console.log('renderHuabei: ', skuPrice, this.productData.ifHuabei)
      if (this.productData.ifHuabei === 1) {
        if (skuPrice && skuPrice >= 0.03) {
          this.supportHuabei = true
          this.disableFenqiList[0] = false;
          this.fenqiMoneyList[0] = (parseInt(skuPrice / 3 * 100) / 100).toFixed(2) + ""
        }
        if (skuPrice && skuPrice >= 0.06) {
          this.disableFenqiList[1] = false;
          this.fenqiMoneyList[1] = (parseInt(skuPrice / 6 * 100) / 100).toFixed(2) + ""
        }
        if (skuPrice && skuPrice >= 0.12) {
          this.disableFenqiList[2] = false;
          this.fenqiMoneyList[2] = (parseInt(skuPrice / 12 * 100) / 100).toFixed(2) + ""
        }
      }
    },
    //大小尺寸选中事件
    modelNumActiveClick(type) {
      this.modelNumActiveId = type
    },
    //获取商品详情
    queryProductDetail() {
      // uni.showLoading({
      //   title: '加载中...',
      //   mask: true
      // })
      let postData = {
        shopId: this.shopId,
        productId: this.productId,
        skuId: this.paramSkuId,
        terminal: 1
      }
      NET.request(API.QueryProductDetail, postData,
          "GET").then(res => {
        uni.hideLoading()
        this.productData = res.data

        this.markTools = res.data.markTools //平台优惠券
        this.shopMarkTools = res.data.shopMarkTools //店铺优惠券
        this.currentActive = this.markTools.length === 0 && this.shopMarkTools.length > 0 ? 1 : 0
        //如果是单款式商品，需要特殊处理productData.names
        const mapKeys = Object.keys(this.productData.map)
        if (mapKeys.length === 1 && mapKeys[0] === '单款项') {
          this.productData.names[0].values.push({
            skuValue: this.productData.names[0].skuName,
            valueCode: '单款项'
          })
        }

        //如果sku的图像为空，设置为商品的图像
        for (var key in this.productData.map) {
          let skuImage = this.productData.map[key].image
          if (!skuImage) {
            this.productData.map[key].image = this.productData.images[0]
          }
        }

        //评价
        this.commentList = res.data.comments
        this.commentListLength = this.commentList.length
        this.sellDescList = res.data.text.replace(/\<img/gi,
            '<img style="max-width:100%;height:auto" ')
        this.couponListLength = res.data.couponImages.length
        this.showVOList = res.data.couponImages
        this.couponList = res.data.markTools
        const ids = this.couponList.map(item => {
          return item.couponId
        })
        //渲染商详之后，如果参数传了skuId，则选中该skuId，否则选中第一个规格
        if (this.paramSkuId) {
          this.selectBySkuId(this.paramSkuId)
        } else {
          for (var attr in this.productData.names) {
            this.nameCodeValueCodeClick(attr.nameCode, attr.values[0].valueCode, true)
          }
        }

        this.beginTimer();
        this.ifShow = true
      }).catch(res => {
        uni.hideLoading()
      })
    },
    // 查看全部问答
    seeAllFn(problemId) {
      let data = {
        productId: this.productId,
        img: this.productData.images[0],
        productName: this.productData.productName,
        questionlength: this.problemsListLength,
        problemId: problemId
      }
      uni.setStorageSync("seeAllFnData", data)
      uni.navigateTo({
        url: 'qADetail'
      })
    },
    // 查看当前全部回答
    seeAllQa() {
      uni.navigateTo({
        url: 'answerList?productId=' + this.productId + "&img=" + this.productData.images[0] +
            '&productName=' + this.productData.productName
      })
    },
    // 提问
    goToQuestions() {
      let data = {
        productId: this.productId,
        images: this.productData.images[0],
        productName: this.productData.productName,
        questionNumber: this.getProblemsList.length
      }
      uni.navigateTo({
        url: 'putQuestions?data=' + JSON.stringify(data)
      })
    },
    // 数量减
    numSub() {
      if (this.buyNum > 1) {
        this.buyNum = this.buyNum - 1
      } else {
        uni.showToast({
          title: '亲！至少一件哦！',
          icon: "none"
        })
      }
    },
    // 数量加
    numAdd() {
      if (this.buyNum < this.selectedSku.stockNumber) {
        this.buyNum = this.buyNum + 1
      } else {
        uni.showToast({
          title: '库存不足！',
          icon: "none"
        })
      }
    },
    //加入购物车
    addCart() {
      //判断是否登录
      let item = {}
      if (uni.getStorageSync('storage_key')) {
        item = uni.getStorageSync('storage_key');
      }
      if (JSON.stringify(item) === '{}') {
        uni.navigateTo({
          url: '../../pages_category_page2/userModule/login'
        })
      } else {
        if (this.selectedSku.stockNumber < 1) {
          uni.showToast({
            title: '库存不足',
            icon: "none"
          })
        } else {
          // uni.showLoading({
          //   mask: true,
          //   title: '添加中...',
          // })
          NET.request(API.ShoppingaddCart, {
            skuId: this.selectedSku.skuId,
            number: this.buyNum,
          }, 'POST').then(res => {
            // 埋点
            this.$store.dispatch('doPointer', {
              eventType: 2,
              productIds: this.productId
            })
            // 给购物车小图标赋值数量
            let newallCartNum = uni.getStorageSync('allCartNum') + this.buyNum
            uni.setStorageSync('allCartNum', newallCartNum)
            this.allCartNum = uni.getStorageSync('allCartNum')

            uni.hideLoading()
            uni.showToast({
              title: '添加成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.goodsDetailShowFlag = false
            }, 1500);
            this.buyNum = 1
          }).catch(res => {
            uni.hideLoading()
            if (res.data.code === 40005) {
              uni.navigateTo({
                url: '../../pages_category_page2/userModule/login'
              })
            }
          })
        }
      }
    },
    //逛店铺
    goStore() {
      uni.navigateTo({
        url: '../store/index?storeId=' + this.shopId
      })
    },
    //点赞
    zanTap(index, likeId, actionType) {
      // uni.showLoading({
      //   mask: true,
      //   title: '提交中...',
      // })
      NET.request(API.LikeOrUnLikeComment, {
        commentId: likeId,
        ifLike: actionType
      }, 'POST').then(res => {
        uni.hideLoading()
        // this.commentVOList[index].ifLike = !this.commentVOList[index].ifLike
        // this.commentVOList[index].likes = this.commentVOList[index].ifLike ? this.commentVOList[index].likes + 1 :
        //     this.commentVOList[index].likes - 1
        if (this.commentList[index].ifLike === 1) {
          this.commentList[index].ifLike = 0
          this.commentList[index].likes = this.commentList[index].likes - 1
        } else {
          uni.showToast({
            title: "点赞成功",
            icon: 'none'
          })
          this.commentList[index].likes = this.commentList[index].likes + 1
          //console.log(this.commentList[index].likes, 'num')
          this.commentList[index].ifLike = 1
        }
      }).catch(res => {
        uni.hideLoading()
      })
    },
    // 点击分享
    clickShare() {
      // #ifdef APP-PLUS
      var system = 1
      // #endif

      // #ifdef H5
      var system = 3
      // #endif

      // #ifdef MP-WEIXIN
      var system = 2
      // #endif

      // #ifdef MP-ALIPAY
      var system = 4
      // #endif
      // uni.showLoading({
      //   mask: true,
      //   title: '请稍候...'
      // })
      NET.request(API.getSharePic, {
        productId: this.productData.productId,
        shopId: this.productData.shopId,
        skuId: this.paramSkuId,
        terminal: system
      }, 'GET').then(res => {
        uni.hideLoading()
        // 推广商品
        uni.navigateTo({
          url: `../../pages_category_page1/distributionModule/shareProduct?shareImg=${res.data}&shopId=${this.productData.shopId}&productId=${this.productData.productId}&skuId=${this.paramSkuId}`
        });
      }).catch(res => {
        uni.hideLoading()
      })
    },
    //立即购买
    addFast(type) {
      //判断是否登录
      let item = {}
      if (uni.getStorageSync('storage_key')) {
        item = uni.getStorageSync('storage_key');
      }
      if (JSON.stringify(item) === '{}') {
        uni.navigateTo({
          url: '../../pages_category_page2/userModule/login'
        })
      } else {
        if (type === 1) {
          this.ifWork = 1
        } else {
          this.ifWork = 0
        }
        if (this.selectedSku.stockNumber < 1) {
          uni.showToast({
            title: '库存不足',
            icon: "none"
          })
        } else if (this.buyNum > this.selectedSku.stockNumber && this.selectedSku.stockNumber !== 0) {
          uni.showToast({
            title: '已超出最大数量限制',
            icon: "none"
          })
        } else {
          let list = [{
            ifWork: this.ifWork,
            shopId: '',
            shopName: '',
            shopDiscountId: null,
            shopSeckillId: null,
            skus: [ //商品明细
              {
                productId: 0,
                skuId: 0,
                productName: "",
                image: "",
                price: 0,
                weight: 0,
                number: 0,
                SKU: "",
                total: 0,
                ifLogistics: 1
              }
            ]
          }]
          list[0].shopId = this.productData.shopId
          list[0].shopName = this.productData.shopName
          list[0].skus[0].productId = this.productData.productId
          list[0].skus[0].skuId = this.selectedSku.skuId
          list[0].skus[0].productName = this.productData.productName
          list[0].skus[0].image = this.selectedSku.image
          list[0].skus[0].number = this.buyNum
          if (type === 1) {
            list[0].skus[0].price = this.selectedSku.originalPrice
            list[0].skus[0].total = this.selectedSku.originalPrice * this.buyNum
          } else {
            list[0].skus[0].price = this.selectedSku.price
            list[0].skus[0].total = this.selectedSku.price * this.buyNum
          }

          //list[0].skus[0].ifLogistics = this.skuProdList.ifLogistics
          if (this.shopSeckillId > 0) {
            list[0].shopSeckillId = this.shopSeckillId
          }
          //console.log(this.shopDiscountId,555)
          if (this.shopDiscountId > 0) {
            list[0].shopDiscountId = this.shopDiscountId
          }
          uni.setStorageSync('skuItemDTOList', list)
          this.goodsDetailShowFlag = false
          uni.navigateTo({
            url: '../orderModule/orderConfirm?type=1',
          })
          this.buyNum = 1
        }
      }
    },
    bindSalesCustomer(salesId, storeId) {
      if (salesId && storeId) {
        //如果已登录，静默绑定客户关系，否则跳转到登录页面
        if (uni.getStorageSync('storage_key')) {
          NET.request(API.BindSalesCustomer, {
            shopId: storeId,
            distributorId: salesId
          }, 'POST').then(res => {
            uni.showToast({
              title: "绑定成功",
              icon: "none"
            })
          }).catch(res => {
            uni.showToast({
              title: res.data.msg,
              icon: "none"
            })
          })
        } else {
          uni.setStorageSync('salesId', salesId)
          uni.setStorageSync("shopId", storeId)
          uni.navigateTo({
            url: '../../pages_category_page2/userModule/login'
          })
        }
      }
    },
    openAllBuy() {
      this.showGroupBuyList = true
    },
    openAllBuyTwo() {
      uni.showToast({
        title: "还没有人拼单，快去拼单吧！",
        icon: "none"
      })
    },
    getServiceUrl() {
      if (this.isLoading || !this.shopId || this.shopId === 'null') {
        return
      }
      const shopids = uni.getStorageSync('service_shopids') || []
      const corpIds = uni.getStorageSync('service_corpIds') || []
      const urls = uni.getStorageSync('service_urls') || []

      const index = shopids.indexOf(this.shopId)
      if (index === -1) {
        this.isLoading = true
        const id = this.shopId || null
        NET.request(API.CustomerService, {
          id
        }, 'get').then(res => {
          if (res.code === '' && res.data.corpId && res.data.url) {
            shopids.push(this.shopId)
            corpIds.push(res.data.corpId)
            urls.push(res.data.url)

            uni.setStorageSync('service_shopids', shopids);
            uni.setStorageSync('service_corpIds', corpIds);
            uni.setStorageSync('service_urls', urls);

            this.corpId = res.data.corpId
            this.serviceURL = res.data.url
            if (this.serviceURL) {
              this.hasService = true
            }
          }
          this.isLoading = false
        }).catch(err => {
          console.log(err)
          this.isLoading = false
        })
      } else {
        this.corpId = corpIds[index]
        this.serviceURL = urls[index]
        if (this.serviceURL) {
          this.hasService = true
        }
      }
    },
    flyToService() {
      let self = this
      console.log(self.serviceURL, self.corpId)
      if (!self.serviceURL || !self.corpId) {
        self.hasService = false
        return
      }
      wx.openCustomerServiceChat({
        extInfo: {
          url: self.serviceURL
        },
        corpId: self.corpId, // 企业ID
        success(res) {
        },
        fail(err) {
        }
      })
    },
  }
}
</script>

<style lang="scss">
.page {
  background-color: #F7F7F7;
}

.skuSelectBtn {
  padding-bottom: 30rpx;

  .selectBtn {
    width: 342rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    border: 2rpx solid #333333;
    font-size: 28rpx;
  }

  .selectBuyNow {
    background: #333333;
  }
}

.couponItemimg {
  width: 150rpx;
  height: 60rpx;
}

.tabsbox {
  width: 100%;
  margin-top: 20rpx;
  background-color: #FFFFFF;
}

.joinbuyBut {
  width: 190rpx;
  height: 80rpx;
  background: #333333;
  color: #FFEBC4;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: center;
  margin-left: 30rpx;
}

.checkimg {
  width: 40rpx;
  height: 40rpx;
  margin-right: 30rpx;
}

.container {
  padding-bottom: 180rpx;

  .arrow-icon {
    width: 16rpx;
    height: 24rpx;
  }

  .goodsImgswiper-box {
    width: 750rpx;
    height: 750rpx;

    .goodsImg {
      width: 750rpx;
      height: 750rpx;
    }
  }

  .share-box {
    width: 200rpx;
    height: 60rpx;
    background-color: #FFFFFF;
    border-radius: 30rpx 0 0 30rpx;
    position: absolute;
    top: 30rpx;
    right: 0;
    z-index: 99;

    .share-img {
      width: 36rpx;
      height: 36rpx;
    }
  }

  .goodgDes-box {
    background-color: #FFFFFF;
    width: 100%;
    padding-bottom: 25rpx;

    .priceBuyNum-box {
      width: 677rpx;
      margin-top: 30rpx;
    }

    .nameContainer {
      display: flex;

      .goodsName-box {
        width: 677rpx;
        height: 85rpx;

        .img618-cion {
          width: 70rpx;
          height: 36rpx;
        }
      }

      .collectBox {
        width: 80rpx;
        margin: 0 30rpx 0 15rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .store-icon {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .discounts-box {
      margin-top: 20rpx;

      .discounts-text {
        margin-left: 10rpx;
        color: #FF7800;
        background-color: #FFE4CC;
        padding: 6rpx 12rpx;
        border-radius: 4rpx;
      }
    }

    .activity-box {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-end;
      border-top: 1rpx solid #EDEDED;

      .activity-content {
        width: 614rpx;
        padding-top: 20rpx;

        .activity-text {
          color: #FF7700;
          border: 1rpx solid #FF7700;
          padding: 6rpx 23rpx;
        }

        .coupon-arrow {
          width: 16rpx;
          height: 24rpx;
          margin-left: 15rpx;
        }
      }
    }
  }

  .express-box {
    height: 100rpx;
    background-color: #FFFFFF;
    padding-left: 30rpx;
    border-top: 12rpx solid #F8F8F8;
    border-bottom: 12rpx solid #F8F8F8;

    image {
      width: 21rpx;
      height: 27rpx;
    }

    .expressSite-icon {
      width: 30rpx;
      height: 30rpx;
    }

    .mapName {
      position: relative;

      &:before {
        content: '';
        width: 2rpx;
        height: 30rpx;
        background: #CCCCCC;
        display: block;
        position: absolute;
        right: -16rpx;
        top: 5rpx;
      }
    }
  }

  .chooseSize-box {
    height: 90rpx;
    background-color: #FFFFFF;

    .chooseSize-content {
      width: 720rpx;
    }
  }

  .evaluate-box {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .evaluate {
      width: 690rpx;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #EDEDED;
    }

    .evaluateTitle-box {
      width: 690rpx;
      border-bottom: 1rpx solid #EDEDED;
      padding-bottom: 20rpx;
    }

    .evaluateAllArrow-icon {
      width: 18rpx;
      height: 24rpx;
    }

    .evaluateTag-box {
      margin-top: 10rpx;
      margin-left: 10rpx;
      padding-bottom: 10rpx;
      display: flex;
      flex-wrap: wrap;

      .evaluateTag-text {
        background-color: #F4F4F4;
        border-radius: 6rpx;
        padding: 16rpx 14rpx;
        color: #656565;
        margin-left: 20rpx;
        margin-top: 20rpx;
      }
    }

    .evaluate-contentbox {
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-left: 30rpx;
      // border-bottom: 1upx solid #EDEDED;
      padding-bottom: 50rpx;

      .evaluate-content {
        width: 670rpx;
        display: flex;
        justify-content: space-between;

        .user-headSmallImg {
          width: 46rpx;
          height: 46rpx;
          border-radius: 50%;
        }
      }

      .evaluateDes-box {
        width: 670rpx;
        margin-top: 30rpx;

        .evaluateDes {
          width: 670rpx;
        }
      }

      .addEvaluate {
        padding-top: 30rpx;
      }
    }
  }

  .questions {
    .questionInfo {
      padding: 0 30rpx;
      min-height: 150rpx;

      .infoTit {
        font-size: 28rpx;
      }

      .putQuestion {
        width: 140rpx;
        height: 60rpx;
        background: #333333;
        line-height: 60rpx;
        font-size: 24rpx;
        color: #FFEBC4;
        padding-left: 20rpx;
        position: relative;

        &:before {
          content: '';
          width: 60rpx;
          height: 60rpx;
          background: url("https://ceres.zkthink.com/static/images/arrow.png") no-repeat center center;
          background-size: contain;
          display: block;
          position: absolute;
          right: 0;
        }
      }
    }

    .listBox {
      padding: 0 30rpx;
      border-bottom: 20rpx solid #EEEEEE;

      .itemBox {
        padding-bottom: 30rpx;
        border-bottom: 1rpx solid #EEEEEE;
        margin-bottom: 30rpx;

        &:last-child {
          border-bottom: none;
        }

        .itemAsk {
          display: flex;
          align-items: center;
          margin-bottom: 42rpx;

          i {
            font-style: normal;
            width: 38rpx;
            height: 38rpx;
            line-height: 38rpx;
            background: #C5AA7B;
            display: block;
            margin-right: 30rpx;
            font-size: 24rpx;
            color: #FFFFFF;
            text-align: center;
          }

          span {
            font-size: 28rpx;
            color: #333333;
          }
        }

        .answer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30rpx;

          .answerBox {
            display: flex;
            align-items: center;

            i {
              font-style: normal;
              width: 38rpx;
              height: 38rpx;
              line-height: 38rpx;
              background: #C5AA7B;
              display: block;
              text-align: center;
              margin-right: 30rpx;
              font-size: 24rpx;
              color: #FFFFFF;
            }

            span {
              font-size: 26rpx;
              color: #666666;
            }
          }

          .answerBtn {
            width: 130rpx;
            height: 50rpx;
            line-height: 50rpx;
            border: #333333 2rpx solid;
            text-align: center;
            color: #333;
            font-size: 24rpx;
          }
        }

        .seeAll {
          margin-left: 68rpx;
          font-size: 28rpx;
          color: #C5AA7B;
        }
      }
    }
  }

  .questionTit {
    height: 90rpx;
    border-bottom: 1rpx solid #EEEEEE;
    margin-right: 35rpx;
    color: #333333;
    font-size: 30rpx;

    .allMoreBox {
      display: flex;
      align-items: center;
      color: #999999;
      font-size: 24rpx;

      .evaluateAllArrow-icon {
        width: 18rpx;
        height: 24rpx;
      }
    }
  }

  .shopEvaList {
    display: flex;
    padding: 30rpx;
    flex-wrap: wrap;
    border-bottom: 20rpx solid #EEEEEE;

    .shopEvaItem {
      padding: 0 14rpx;
      height: 60rpx;
      background: #ffe4cc;
      border-radius: 6rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666666;
      margin: 0 20rpx 20rpx 0;
    }
  }

  .storeEvaluate-box {
    background-color: #FFFFFF;
    margin-top: 20rpx;

    .storeEvaluate {
      width: 690rpx;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #EDEDED;
    }

    .storeEvaluateTag-box {
      margin-top: 10rpx;
      margin-left: 10rpx;
      padding-bottom: 30rpx;
      display: flex;
      flex-wrap: wrap;

      .storeEvaluateTag-text {
        background-color: #FFE4CC;
        border-radius: 6rpx;
        padding: 16rpx 14rpx;
        color: #656565;
        margin-left: 20rpx;
        margin-top: 20rpx;
      }
    }
  }

  .inStore-box {
    background-color: #FFFFFF;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;

    .inStore-logo {
      width: 70rpx;
      height: 70rpx;
    }

    .inStore-but {
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: left;
      font-size: 24rpx;
      color: #FFEBC4;
      background: #333333;
      padding-left: 20rpx;
      position: relative;

      &:before {
        content: '';
        width: 60rpx;
        height: 60rpx;
        background: url("https://ceres.zkthink.com/static/images/arrow.png") no-repeat center center;
        background-size: contain;
        display: block;
        position: absolute;
        right: 0;
      }
    }
  }

  .goodsDetails-box {
    background-color: #FFFFFF;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;

    .goodsDetails-title {
      display: flex;
      flex-direction: row;
      align-items: center;

      .goodsDetails-Line {
        width: 265rpx;
        border-bottom: 1rpx solid #EDEDED;
      }

      .goodsDetails-text {
        padding: 0 22rpx;
      }
    }

    .goodsDetailsimg-box {
    }
  }

  .priceExplain-box {
    background-color: #FFFFFF;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;

    .priceExplain-title {
      display: flex;
      flex-direction: row;
      align-items: center;

      .priceExplain-Line {
        width: 265rpx;
        border-bottom: 1rpx solid #EDEDED;
      }

      .priceExplain-text {
        padding: 0 22rpx;
      }
    }

    .priceExplain-dot {
      width: 9rpx;
      height: 9rpx;
      border: 1rpx solid #FF7700;
      border-radius: 50%;
      background-color: #FF7700;
    }
  }

  .buygoods-box {
    position: fixed;
    bottom: 0rpx;
    box-sizing: border-box;

    .buygoodsBut-box {
      background-color: #FFFFFF;
      width: 750rpx;
      padding: 20rpx 32rpx;
      box-shadow: 0rpx 0rpx 10rpx 1rpx #EDEDED;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .btns_container {
        display: flex;
        align-items: center;
      }

      .btns {
        width: 80rpx;
      }

      .Cart {
        position: relative;

        .cartAllNum {
          position: absolute;
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
          font-size: 17rpx;
          color: #FFFFFF;
          background: #C5AA7B;
          border-radius: 50%;
          opacity: 1;
          z-index: 999;
        }

        // #ifdef APP-PLUS
        .cartAllNum {
          right: -6rpx;
          top: -6rpx;
        }

        // #endif
        /* #ifdef H5 */
        .cartAllNum {
          right: -10rpx;
          top: -6rpx;
        }

        /* #endif */
        /* #ifdef MP-WEIXIN */
        .cartAllNum {
          right: -3rpx;
          top: 0;
        }

        /* #endif */
      }

      .store-icon {
        width: 48rpx;
        height: 48rpx;
      }

      .joinShopCartBut {
        width: 190rpx;
        height: 80rpx;
        background-color: #FFFFFF;
        color: #333333;
        font-size: 28rpx;
        line-height: 80rpx;
        border: 2rpx solid #333333;
        text-align: center;
        margin-left: 40rpx;
        box-sizing: border-box;
      }

      .buyNowBut {
        width: 190rpx;
        height: 80rpx;
        background: #333333;
        color: #FFEBC4;
        font-size: 28rpx;
        line-height: 80rpx;
        text-align: center;
        margin-left: 16rpx;
      }

      .offShelf {
        background: #b7b7b7;
        border-radius: 50rpx;
        width: 360rpx;
        margin-left: 50rpx;
        line-height: 80rpx;
        height: 80rpx;
        justify-content: center;
        color: #333333;
      }
    }
  }

  .returnTopService-box {
    position: fixed;
    bottom: 160rpx;
    right: 30rpx;

    .fs16 {
      font-size: 16rpx;
    }

    .returnTop-box {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      background: #FFFFFF;
      opacity: 0.8;

      .returnTopImg {
        width: 58rpx;
        height: 58rpx;
      }
    }

    .serviceImg-box {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      background-color: #FFFFFF;
      box-shadow: 0rpx 0rpx 5rpx 3rpx #999999;

      .serviceImg {
        width: 36rpx;
        height: 36rpx;
        display: block;
        background: url("https://ceres.zkthink.com/static/images/serviceImg.png") no-repeat center center;
        background-size: contain;
      }
    }
  }

  .goosDetailshow-box {
    margin-bottom: -5upx;

    .detailImg-box {
      margin-top: 30rpx;
      margin-left: 30rpx;
      border-bottom: 1rpx solid #EDEDED;
      padding-bottom: 20rpx;
      width: 690rpx;

      .detailImg {
        width: 180rpx;
        height: 180rpx;
      }
    }

    .color-box {
      padding: 30rpx 30rpx;
      width: 690rpx;

      .colorName-box {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 30rpx;
        margin-left: -30upx;

        .colorName {
          background-color: #FFFFFF;
          margin-left: 30rpx;
          padding: 10rpx 32rpx;
          font-size: 26rpx;
          border: 2rpx solid #E4E5E6;
          z-index: 2;
          color: #333333;
        }

        .colorName-on {
          box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
          color: #C5AA7B;
          margin-left: 30rpx;
          padding: 10rpx 32rpx;
          font-size: 26rpx;
          text-align: center;
          z-index: 1;
          border: none;
        }
      }

    }

    .modelNum-box {
      padding: 30rpx 30rpx;
      border-bottom: 1rpx solid #EDEDED;
      width: 690rpx;

      .modelNumName-box {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 30rpx;
        margin-left: -30upx;

        .modelNumName-on {
          background-color: #FFE4D0;
          color: #FF7800;
          margin-left: 30rpx;
          padding: 10rpx 32rpx;
          border-radius: 28rpx;
          border: 1rpx solid #FF7800;
          font-size: 26rpx;
          text-align: center;
        }

        .modelNumName {
          background-color: #F5F5F5;
          margin-left: 30rpx;
          padding: 10rpx 32rpx;
          border-radius: 28rpx;
          font-size: 26rpx;
        }
      }
    }

    .goodsNumCent {
      padding: 0 30rpx;

      .goodsNum-box {
        width: 100%;
        padding: 30rpx 0 180rpx 0;
        border-top: 2rpx solid #EDEDED;

        .goodsNum {
          height: 50rpx;
          display: flex;
          align-items: center;

          .item {
            width: 50rpx;
            height: 50rpx;
            line-height: 48rpx;
            border: 1rpx solid #999999;
            text-align: center;
          }

          .subtract {
            border-right: 0rpx;
          }

          .goodsNumber {
            line-height: 50rpx;
          }

          .add {
            border-left: 0rpx;
          }
        }
      }
    }

    .bottom-line {
      border-bottom: 1rpx solid #EDEDED;
    }

    .huabei-box {
      padding: 30rpx 30rpx;
      width: 690rpx;

      .fenqi-box {
        margin-top: 15rpx;
        width: 120%;

        .huabei-item {
          display: inline-block;
          background: #f3f3f3;
          padding: 16rpx 24rpx;
          margin: 5rpx 10rpx;
          border-radius: 15rpx;
          text-align: center;
          font-size: 7rpx;

          .huabei-period {
            display: block;
          }
        }

        .fenqi-on {
          border: 1px solid #EF7F93;
          color: #EF7F93;
        }

        .disabled {
          color: #cacaca;
        }
      }
    }

    .goosDetailbut-box {
      justify-content: center;

      .joinShopCartBut {
        width: 343rpx;
        height: 80rpx;
        border-radius: 40rpx 0 0 40rpx;
        background-color: #FFC300;
        color: #FFFEFE;
        font-size: 28rpx;
        line-height: 80rpx;
        text-align: center;
        margin-left: 30rpx;
      }

      .buyNowBut {
        width: 90%;
        height: 90rpx;
        background-color: #333333;
        font-size: 28rpx;
        line-height: 90rpx;
        text-align: center;
        color: #FFEBC4;
      }
    }
  }

  .parameterShow-box {
    .parameter-title {
      width: 100%;
      text-align: center;
      padding-bottom: 36rpx;
    }

    .parameter-modle {
      width: 690rpx;
      padding-bottom: 36rpx;
      font-size: 26rpx;
    }

    .parameterTruebut-box {
      background-color: #FFFFFF;
      padding: 20rpx 0;

      .parameterTruebut {
        width: 690rpx;
        height: 80rpx;
        background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
        color: #FFFFFF;
        border-radius: 40rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 26rpx;
      }
    }
  }

  .couponShow-box {
    .couponShow {
      z-index: 333;
      height: 1000rpx;

      .couponTitle-box {
        width: 100%;
      }

      .coupon-title-active {
        color: #FF7700;
        border-bottom: 2rpx solid #FF7700;
        padding-bottom: 30rpx;
      }

      .usableCoupon-content {
        padding: 30rpx 0;

        .usableCoupon-box {
          width: 690rpx;
          height: 140rpx;
          border-radius: 10rpx;
          background-color: #FFE9D8;

          .immediateUse-but {
            color: #FF7800;
            border-radius: 30rpx;
            padding: 0 40rpx;
            border-left: 3rpx solid #EBD7C7;
            height: 140rpx;
            border-radius: 60rpx;
            line-height: 140rpx;
            font-weight: bold;
          }
        }
      }
    }
  }

  .succeedShow-box {
    position: absolute;
    top: 220rpx;
    left: 185rpx;

    .succeedShow {
      background-color: #7F7F7F;
      width: 380rpx;
      height: 280rpx;
      border-radius: 10rpx;
      opacity: 0.8;

      .couponSucceedImg {
        width: 200rpx;
        height: 130rpx;
      }
    }
  }

  .evaQaTab {
    height: 82rpx;
    line-height: 82rpx;
    border-bottom: #F3F4F5 solid 2rpx;
    font-size: 30rpx;
    color: #CCCCCC;

    .evaBtn {
      width: 50%;
      position: relative;
      text-align: center;

      &:before {
        content: '';
        width: 2rpx;
        height: 30rpx;
        background: #CCCCCC;
        display: block;
        position: absolute;
        right: 0;
        top: 20rpx;
      }
    }

    .qaBtn {
      width: 50%;
      text-align: center;
    }

    .tabTit {
      display: inline-block;
      height: 82rpx;
      line-height: 82rpx;
    }

    .active {
      color: #333333;

      .tabTit {
        border-bottom: 4rpx solid #444444;
      }
    }
  }

  .moreBox {
    width: 170rpx;
    height: 54rpx;
    line-height: 54rpx;
    margin: 0 auto 50rpx auto;
    border: 2rpx solid #C5AA7B;
    color: #C5AA7B;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 10rpx;
      height: 20rpx;
    }
  }
}

.activity-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.activity-box .title-box {
  width: 100%;
  height: 100rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: solid 1px #EEEEEE;
}

.activity-coupon-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  flex: 1;
}

.content-box {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
}

.tag-box {
  width: 100%;
  box-sizing: border-box;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #FF7911;
}

.label-lingqu {
  width: 100%;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.coupon-item {
  width: 690rpx;
  height: 120rpx;
  border-radius: 10rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  flex-shrink: 0;
  background-color: #FFE9D8;
}

.money-box {
  width: 160rpx;
  box-sizing: border-box;
  padding-left: 30rpx;
  font-weight: 500;
  color: #FF7911;
}

.info-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: rgba(255, 121, 17, 1);
}

.receive-btn {
  width: 200rpx;
  height: 120rpx;
  background: rgba(255, 233, 216, 1);
  box-shadow: 0px 0px 5rpx 0px rgba(102, 102, 102, 0.35);
  line-height: 120rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  color: rgba(255, 121, 17, 1);
  border-bottom-right-radius: 10rpx;
  border-top-right-radius: 10rpx;
  border-top-left-radius: 120rpx;
  border-bottom-left-radius: 120rpx;
}

.received {
  background: #f1f1f1;
  color: #999;
}


.item-image-box {
  width: 700rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.img-item {
  width: 223rpx;
  height: 223rpx;
  border-radius: 10rpx;
  margin-right: 10rpx;
  margin-top: 10rpx;
}

.item-line {
  width: 690rpx;
  height: 1px;
  background: rgba(238, 238, 238, 1);
  margin-top: 20rpx;
}

.item-like-box {
  display: flex;
  flex-direction: row;
  width: 690rpx;
  align-items: center;
  justify-content: space-between;
}

.like-box {
  display: flex;
  flex-direction: row;
  padding-top: 30rpx;
  align-items: center;
  justify-content: flex-end;
  margin-right: 50rpx;
}

.like-img {
  width: 48rpx;
  height: 48rpx;
}

.like-num {
  font-size: 28rpx;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 30rpx;
}

.sceneMarketingBox {
  width: 100%;
  background: url("https://zk-cereshop.oss-cn-shenzhen.aliyuncs.com/zkthink/2022-02-15/5f85fe4782e34c10b15b04f76c571d12_sceneMarketingDetailsIcon.png"
  ) no-repeat center;
  padding: 20rpx 30rpx;
  background-size: cover;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sceneNameBox {
    width: 220rpx;
    text-align: center;
    color: #C83732;
    font-size: 20rpx;
  }
}

.seckill-box {
  width: 100%;
  background: url("https://ceres.zkthink.com/static/images/storeTop_Img.png") no-repeat left top;
  padding: 35rpx 30rpx;

  .seckill-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .vip-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .discount-icon {
    width: 187rpx;
    height: 41rpx;
    background-size: contain;
  }

  .spell-icon {
    width: 182rpx;
    height: 37rpx;
    background-size: contain;
    margin-bottom: 20rpx;
  }

  .countdown {
    text-align: center;

    label {
      text-align: center;
      color: #CCCCCC;
    }
  }

  .countdown-box {
    padding: 0 8rpx;
    height: 48rpx;
    color: #FFEBC4;
    background-color: #525252;
    margin: 10rpx;
  }
}

.goodsDiscount {
  .groupBuy {
    .groupBuyList {
      .groupBuyItem {
        padding: 0 30rpx;
        height: 116rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #EEEEEE;

        .leftAvatar {
          display: flex;
          align-items: center;
          width: 50%;

          img {
            width: 72rpx;
            height: 72rpx;
            margin-right: 10rpx;
            border-radius: 50%;
          }
        }

        .rightInfo {
          display: flex;
          align-items: center;
          width: 50%;

          .groupBuyTime {
            .needPeople {
              font-size: 28rpx;
              color: #333333;
              margin-bottom: 10rpx;
              font-weight: 400;

              b {
                color: #C5AA7B;
                font-weight: 400;
              }
            }

            .endDate {
              color: #666666;
            }
          }

          .groupBuyBtn {
            width: 140rpx;
            height: 60rpx;
            line-height: 60rpx;
            background: #333333;
            text-align: center;
            color: #FFEBC4;
            font-size: 24rpx;
          }
        }
      }
    }
  }
}

.popupDiscount {
  padding-bottom: 70rpx;

  .popupDiscountTit {
    font-size: 36rpx;
    color: #333333;
    height: 105rpx;
    line-height: 105rpx;
    text-align: center;
    border-bottom: 1rpx solid #EEEEEE;
  }

  .groupBuy {
    padding-bottom: 80rpx;

    .groupBuyList {
      .groupBuyItem1 {
        padding: 0 30rpx;
        height: 116rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #EEEEEE;

        .leftAvatar {
          display: flex;
          align-items: center;

          img {
            width: 72rpx;
            height: 72rpx;
            margin-right: 10rpx;
            border-radius: 50%;
          }

          .groupBuyTime {
            margin-right: 80rpx;
            margin-bottom: 10rpx;
            width: 320rpx;

            .needPeople {
              font-size: 26rpx;
              color: #333333;

              span {
                color: #333333;
                padding-right: 10rpx;
              }

              b {
                color: #C5AA7B;
                font-weight: 400;
              }
            }

            .endDate {
              color: #333333;
              opacity: 0.7;
              font-size: 24rpx;
            }
          }
        }

        .rightInfo {
          display: flex;
          align-items: center;

          .groupBuyBtn {
            width: 140rpx;
            height: 70rpx;
            line-height: 70rpx;
            background: #333333;
            text-align: center;
            color: #FFEBC4;
            font-weight: 400;
          }
        }
      }
    }
  }
}

.combination {
  padding: 0 20rpx;

  .combinationList {
    width: 100%;
    height: 680rpx;
    background: #333333;
    box-shadow: 0 20rpx 30rpx rgba(0, 0, 0, 0.3);
    border-radius: 20rpx;

    .combinationTitle {
      padding: 32rpx 20rpx 0 30rpx;

      image {
        width: 211rpx;
        height: 33rpx;
      }

      .combinationPrice {
        padding: 0 20px;
        height: 50rpx;
        background: linear-gradient(90deg, #C83732 0%, #E25C44 100%);
        box-shadow: 0 6rpx 12rpx rgba(233, 0, 0, 0.3);
        border-radius: 26rpx;
        line-height: 50rpx;
        text-align: center;
        color: #FFFFFF;
        opacity: 0.8;
      }
    }

    .buyBtn {
      width: 96%;
      height: 84rpx;
      line-height: 84rpx;
      border: 2rpx solid rgba(0, 0, 0, 0);
      background: linear-gradient(88deg, #C5AA7B 0%, #FFEBC4 100%);
      text-align: center;
      color: #333333;
      margin: 0 auto;
    }
  }

  //.group-list{
  //  padding: 30upx 20upx 60upx;
  //  .group-warp{
  //    width: 710upx;
  //    height: 528upx;
  //    padding: 0 2upx;
  //    background: #333333;
  //    box-shadow: 0px 20upx 30upx rgba(0, 0, 0, 0.3);
  //    opacity: 1;
  //    border-radius: 20upx;
  //  }
  //  .title{
  //    display: flex;
  //    align-items:center;
  //    position: relative;
  //    padding: 40upx 0 30upx 20upx;
  //    .title-img{
  //      height: 33upx;
  //    }
  //    .btn-all{
  //      position: absolute;
  //      right: 8upx;
  //      top: 40upx;
  //      line-height: 33upx;
  //      padding-right: 25upx;
  //      font-size: 24upx;
  //      color: #FFEBC4;
  //      .iconfont{
  //        content: '';
  //        font-size: 26upx;
  //        position: absolute;
  //        right: 0;
  //        top: 0;
  //      }
  //    }
  //  }
  //  .pro-box{
  //    padding-bottom: 20upx;
  //    .pro-item{
  //      width: 220upx;
  //      height: 382upx;
  //      background: #FFFFFF;
  //      .pro-item-img{
  //        .img{
  //          width: 100%;
  //          height: 220upx;
  //        }
  //      }
  //      &-inner{
  //        padding: 0 8upx;
  //      }
  //      .pro-item-info{
  //        text-align: center;
  //        padding: 0px 10upx 20upx;
  //        .name{
  //          font-size: 24upx;
  //          font-weight: normal;
  //          color: #FFEBC4;
  //          line-height: 50upx;
  //          background-color: #333333;
  //          text-align: center;
  //          margin-bottom: 18upx;
  //          display: block;
  //        }
  //        .price{
  //          color: #C83732;
  //          font-size: 28upx;
  //          font-weight: bold;
  //          line-height: 40upx;
  //        }
  //        .buyCount{
  //          font-size: 24upx;
  //          color: #ccc;
  //          line-height: 34upx;
  //          font-weight: normal;
  //        }
  //      }
  //    }
  //  }
  //  .pagination{
  //    display: flex;
  //    justify-content: center;
  //    ::v-deep .swiper-pagination-bullet{
  //      width: 24upx;
  //      height: 4upx;
  //      background: #fff;
  //      opacity: 0.5;
  //      border-radius: 2upx;
  //      margin: 0 5upx;
  //    }
  //    ::v-deep .swiper-pagination-bullet-active{
  //      opacity: 1;
  //    }
  //  }
  //}
}
</style>
