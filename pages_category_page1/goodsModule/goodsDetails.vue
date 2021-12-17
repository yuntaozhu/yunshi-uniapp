<template>
	<view class="container">
		<!-- 商品详情 -->
		<view>
			<swiper class="goodsImgswiper-box" :indicator-dots="true" :autoplay="true">
				<swiper-item v-for="(imgItem, index) in productData.images" :key="index">
					<image class="goodsImg" :src='imgItem'></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="share-box flex-items-plus" @click="clickShare">
			<image class="share-img" src="../../static/images/shareBut.png"></image>
			<label class="fs24 mar-left-5">分享</label>
		</view>
		<view class="goodgDes-box flex-start flex-column">
			<view v-if="selectedSku.activityType === 0"
				class="priceBuyNum-box flex-display flex-sp-between mar-left-30">
				<view>
					<label class="fs36 font-color-C83732">¥</label>
					<label class="fs36 fs-bold font-color-C83732 mar-left-10">{{selectedSku.price}}</label>
					<label class="fs24 font-color-999 discountsPriceLine mar-left-20">¥
						{{selectedSku.originalPrice}}</label>
				</view>
				<label class="fs24 font-color-999">{{productData.users}}人付款</label>
			</view>
			<view v-else class="seckill-box">
        <view class="flex-items flex-sp-between" v-if="selectedSku.activityType === 9">
          <view class="vipImg flex-items">
            <image class="vip-icon" src="../../static/images/vipDetail.png" mode=""></image>
          </view>
          <view class="flex-row-plus flex-items-plus mar-left-30 mar-top-10">
            <label class="fs30 font-color-FFF">¥</label>
            <label class="fs42 mar-left-5 font-color-FFF">{{selectedSku.price}}</label>
            <label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥ {{selectedSku.originalPrice}}</label>
          </view>
        </view>
				<view v-else class="flex-items flex-row flex-sp-between">
					<view class="flex-column-plus">
						<image v-if="[2,4].includes(selectedSku.activityType)" class="seckill-icon"
							src="../../static/images/seckillicon.png" mode=""></image>
						<image v-if="[3,5].includes(selectedSku.activityType)" class="discount-icon"
							src="../../static/images/discounticon.png" mode=""></image>
						<image v-if="selectedSku.activityType === 1" class="spell-icon"
							src="../../static/images/spellicon.png" mode=""></image>
						<view class="flex-row-plus flex-items mar-top-10">
							<label class="fs30 font-color-FFF">¥</label>
							<label class="fs42 mar-left-5 font-color-FFF">{{selectedSku.price}}</label>
							<label class="fs28 mar-left-10 discountsPriceLine font-color-999">¥ {{selectedSku.originalPrice}}</label>
						</view>
					</view>
					<view v-if="[1,2,3,4,5].includes(selectedSku.activityType)" class="countdown flex-column-plus">
						<view v-if="timeActivetype">
							<label class="fs28">距离结束剩余</label>
							<view class="flex-row-plus fs34 flex-items-plus mar-top-10">
								<view class="countdown-box flex-items-plus">{{hou}}</view>
                <view class="font-color-999">:</view>
								<view class="countdown-box flex-items-plus">{{min}}</view>
                <view class="font-color-999">:</view>
								<view class="countdown-box flex-items-plus">{{sec}}</view>
							</view>
						</view>
						<view v-else>
							<label class="fs28 mar-right-20">即将开始：{{selectedSku.startTime}}</label>
							<!--              <view class="fs28 mar-right-20 mar-top-20">{{productData.startTime}}</view>-->
						</view>
					</view>
				</view>
			</view>
			<view class="goodsName-box overflowNoDot mar-top-30 mar-left-30">
				<label class="goodsName fs32 mar-left-20">{{productData.productName}}</label>
			</view>
			<view v-if="markTools.length>0 || shopMarkTools.length>0" class="activity-box mar-top-10"
				@click="couponShowClick">
				<label class="fs24 font-color-999">优惠</label>
				<view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
					<view class="fs20 overflow" style="width: 500rpx;">
						{{productData.couponSplicing}}
					</view>
					<view class="flex-items">
						<label class="fs24 font-color-C5AA7B">领券</label>
						<image class="coupon-arrow" src="../../static/img/user/arrow.png"></image>
					</view>
				</view>
			</view>
			<view v-else class="activity-box mar-top-10">
				<label class="fs24 font-color-999">优惠</label>
				<view class="activity-content mar-left-30 flex-items flex-sp-between flex-row">
					<view class="fs20">
						无
					</view>
				</view>
			</view>
		</view>
		<view class="express-box flex-items flex-row fs24">
      <label class="fs24 font-color-999 mar-right-20">发货</label>
      <image src="../../static/images/mapIcon.png" v-if="productData.receive && productData.receive.receiveAdress"></image>
      <label class="mar-left-10 mapName mar-right-30" v-if="productData.receive && productData.receive.receiveAdress">{{productData.receive.receiveAdress}}</label>
			<label>快递：¥ {{productData.logisticsPrice}}</label>
		</view>
		<view class="fs24 chooseSize-box flex-start" @click="goodsDetailShowClick">
			<view class="chooseSize-content flex-items flex-row flex-sp-between">
				<view class="flex-row-plus">
					<label class="fs26 mar-left-30 font-color-999">选择</label>
          <view class="valueBox mar-left-20 flex-items">
            <view class="mar-right-10" v-for="(item, index) of currentSuk" :key="index">{{item.skuText}}</view>
          </view>
				</view>
				<image class="arrow-icon" src="../../static/img/user/arrow.png"></image>
			</view>
		</view>
    <!--结合销售-->
    <combined-sales :pid="productId" :productData="productData"></combined-sales>
    <!--拼团-->
		<view v-if="selectedSku.activityType === 1" class="borRig-line-20"></view>
		<view v-if="selectedSku.activityType === 1" class="goodsDiscount">
			<view class="questionTit mar-left-30 flex-items flex-row flex-sp-between">
				<label class="">这些人正在拼单</label>
				<view class="allMoreBox">
					<view v-if="topThreeCollageOrders.length > 0" class="allMore" @click="openAllBuy">查看全部</view>
					<view v-else class="allMore" @click="openAllBuyTwo">查看全部</view>
					<image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>
				</view>
			</view>
			<view class="groupBuy" v-for="(Gitem, index) in topThreeCollageOrders" :key="index">
				<view class="groupBuyList" v-if="Gitem.time > 0">
					<view class="groupBuyItem">
						<view class="leftAvatar">
							<img :src="Gitem.headImage" alt="">
							<span>{{Gitem.name}}</span>
						</view>
						<view class="rightInfo">
							<view class="groupBuyTime" style="width: 70%;">
								<view class="needPeople flex-row-plus">还差<b>{{Gitem.person}}人</b>拼成</view>
								<view class="endDate">剩余{{timeChange(Gitem.time)}}</view>
							</view>
							<view class="groupBuyBtn" @click="getGroupShow(Gitem.collageId)">和Ta拼
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--    组合支付-->
		<view class=""></view>
		<view class="borRig-line-20"></view>
		<view class="evaQaTab flex-items flex-sp-around">
			<view :class="{active: activeTab === 1}" class="evaBtn" @click="changeTabs( 1)">
				<view class="tabTit">宝贝评价 ({{commentListLength}})</view>
			</view>
			<view :class="{active: activeTab === 2}" class="qaBtn" @click="changeTabs( 2)">
				<view class="tabTit">商品问答（{{problemsListLength}}）</view>
			</view>
		</view>
		<view class="evaluate-box flex-start flex-column" v-show="activeTab === 1">
			<view class="evaluateTag-box" v-if="commentListLength>0">
				<view class="evaluateTag-text">
					全部({{commentListLength}})
				</view>
			</view>
			<view class="evaluate-contentbox mar-top-30" v-for="(commentItem, index) in commentList" :key="index">
				<view class="evaluate-content flex-items flex-row flex-sp-between">
					<view class="flex-items">
						<image class="user-headSmallImg" :src="commentItem.headImage"></image>
						<label class="fs28 mar-left-20">{{commentItem.name}}</label>
					</view>
					<label class="font-color-999 fs22">{{commentItem.createTime}}</label>
				</view>
				<view class="evaluateDes-box">
					<label class="evaluateDes">{{commentItem.comment}}</label>
				</view>
				<view class="item-image-box" v-if="commentItem.image">
					<view v-for="(ItemImg, cindex) in commentImgData(commentItem.image)" :key="cindex">
						<image @click='previewImg(index,cindex)' class="img-item" :src="ItemImg"></image>
					</view>
				</view>
				<view class="item-line"></view>
				<view class="item-like-box" v-if="commentItem.addComment !== ''">
					<view class="addEvaluate">
						<view>追加评价：{{commentItem.addComment}}</view>
						<view class="item-image-box" v-if="commentItem.addImages">
							<view v-for="(itemAddImg, imgIndex) in commentItem.addImages" :key="imgIndex">
								<image @click='previewAddImg(index,imgIndex)' class="img-item" :src="itemAddImg">
								</image>
							</view>
						</view>
					</view>
				</view>
				<view class="like-box">
					<image class="like-img" @click="zanTap(index, commentItem.commentId,0)"
						src="../../static/images/praiseActiveIcon.png" v-if="commentItem.ifLike === 1"></image>
					<image class="like-img" @click="zanTap(index, commentItem.commentId,1)"
						src="../../static/images/praiseIcon.png" v-else></image>
					<view class="like-num">{{commentItem.likes}}</view>
				</view>
			</view>
			<view class="moreBox" v-if="commentListLength>0" @click="commentAll">
				<label class="fs24">查看全部</label>
				<image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>
			</view>
		</view>
		<!--    评价END-->
		<!--    问答-->
		<view class="borRig-line-20"></view>
		<view class="questions" v-show="activeTab === 2">
			<!--			<view class="questionTit mar-left-30 flex-items flex-row flex-sp-between">-->
			<!--				<label class="">商品问答（{{problemsListLength}}）</label>-->
			<!--				<view class="allMoreBox">-->
			<!--					<view class="allMore" @click="seeAllQa">查看全部</view>-->
			<!--					<image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>-->
			<!--				</view>-->
			<!--			</view>-->
			<view class="questionInfo flex-items flex-row flex-sp-between">
				<view class="infoTit">宝贝好不好，问问已买过的人</view>
				<view class="putQuestion" @click="goToQuestions">去提问</view>
			</view>
			<view class="listBox">
				<view class="itemBox" v-for="(pitem,index) in getProblemsList" :key="index">
					<view class="itemAsk">
						<i>问</i><span>{{pitem.problem}}</span>
					</view>
					<view v-if="pitem.answers.length>0">
						<view class="answer" v-for="(witem,index) in twonumansers(pitem.answers)" :key="index">
							<view class="answerBox">
								<i>答</i><span>{{witem.answer}}</span>
							</view>
							<view class="answerBtn" v-if="pitem.ifAnswer === 1" @click="seeAllFn(pitem.problemId)">立即回答
							</view>
						</view>
					</view>
					<view v-else>
						<view class="answer">
							<view class="answerBox">
								<i>答</i><span>暂无答复</span>
							</view>
							<view class="answerBtn" v-if="pitem.ifAnswer === 1" @click="seeAllFn(pitem.problemId)">立即回答
							</view>
						</view>
					</view>
					<view v-if="pitem.answers.length>1" class="seeAll" @click="seeAllFn(pitem.problemId)">查看全部答复</view>
				</view>
        <view class="moreBox" v-if="problemsListLength>0" @click="seeAllQa">
          <label class="fs24">查看全部</label>
          <image class="evaluateAllArrow-icon mar-left-10" src="../../static/img/user/arrow.png"></image>
        </view>
			</view>
		</view>
		<view class="inStore-box flex-items flex-row flex-sp-between">
			<view class="flex-display flex-row">
				<view>
					<image @click="goStore" class="inStore-logo" :src="productData.shopLogo"></image>
				</view>
				<view class="flex-display flex-column mar-left-20">
					<label @click="goStore">{{productData.shopName}}</label>
					<view class="flex-display flex-row fs24 font-color-999 mar-top-5">
						<label>商品总类：{{productData.classifyNumber}}</label>
						<label class="mar-left-30">已售：{{productData.number}}件</label>
					</view>
				</view>
			</view>
			<view class="inStore-but" @click="goStore">去逛逛</view>
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
			<view class="buygoodsBut-box flex-row-plus" :style="{'height':(isIphone === true? 160:130)+'rpx'}">
				<view class="flex-column-plus" @click="goStore">
					<image class="store-icon" src="../../static/images/storeIcon.png"></image>
					<label class="fs22">店铺</label>
				</view>
				<view class="flex-column-plus mar-left-30 flex-items Cart" @click="goshopCart">
					<view class="cartAllNum" v-if="allCartNum>0">{{allCartNum}}</view>
					<image class="store-icon" src="../../static/images/gouwuche.png"></image>
					<label class="fs22">购物车</label>
				</view>
				<view class="flex-column-plus mar-left-30" @click="collectProduct">
					<image v-if="productData.ifCollect === 1" class="store-icon"
						src="../../static/images/shoucangActive1.png"></image>
					<image v-else class="store-icon" src="../../static/images/shoucang2x.png"></image>
					<label class="fs22">收藏</label>
				</view>
				<view class="flex-row-plus offShelf" v-if="productData.shelveState === 0">
					商品已下架
				</view>
				<view class="flex-row-plus" v-else-if="selectedSku.activityType === 1">
					<view class="joinShopCartBut" @click="goodsDetailShowClick(4)">单独购买</view>
					<view class="buyNowBut" @click="goodsDetailShowClick(3)">我要开团</view>
				</view>
				<view class="flex-row-plus" v-else>
					<view class="joinShopCartBut" @click="goodsDetailShowClick(1)">加入购物车</view>
					<view class="buyNowBut" @click="goodsDetailShowClick(2)">立即购买</view>
				</view>
			</view>
		</view>
		<view class="returnTopService-box">
			<view class="returnTop-box flex-items-plus flex-column" @click="top"
				:style="{'display':(returnTopFlag===true? 'flex':'none')}">
				<image class="returnTopImg" src="../../static/images/returnTopImg.png"></image>
				<label class="fs16">顶部</label>
			</view>
			<!--      #ifdef MP-WEIXIN-->
			<button open-type="contact" class="serviceImg-box flex-items-plus flex-column mar-top-20">
				<view class="serviceImg">
					<image src="../../static/images/serviceImg.png"></image>
				</view>
				<view class="fs16">客服</view>
			</button>
			<!--      #endif-->
		</view>
		<!-- 商品详情 -->
		<u-popup v-model="goodsDetailShowFlag" mode="bottom" border-radius="14">
			<view class="goosDetailshow-box">
				<view class="detailImg-box flex-row-plus">
					<image class="detailImg" :src="selectedSku.image"></image>
					<view class="flex-column-plus mar-left-40">
						<view class="font-color-C5AA7B">
							<label class="fs24">¥</label>
							<label class="fs36 mar-left-10"
								v-text="selectedSku.activityType === 1 && btnType === 4 ? selectedSku.originalPrice : selectedSku.price"></label>
						</view>
						<label class="fs24 font-color-999 mar-top-20">库存 {{selectedSku.stockNumber}} 件</label>
						<label class="fs24 mar-top-20">已选</label>
					</view>
				</view>
				<view class="color-box flex-column-plus">
					<view v-for="(attritem,index) in productData.names" :key="index">
						<label class="fs24 font-color-999">{{attritem.skuName}}</label>
						<view class="colorName-box">
							<view class="pad-bot-30" v-for="(attrRes, resIndex) in attritem.values" :key="resIndex">
								<view class="colorName"
									:class="{'colorName-on' : selectedAttr[attritem.nameCode] == attrRes.valueCode}"
									@click="nameCodeValueCodeClick(attritem.nameCode, attrRes.valueCode, true)">
									{{attrRes.skuValue}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="goodsNum-box flex-row-plus flex-sp-between" :class="{'bottom-line' :supportHuabei}">
					<label class="font-color-999 fs24">数量</label>
					<view class="goodsNum">
						<text class="subtract" @click="numSub()">-</text>
						<text class="goodsNumber" v-model="buyNum">{{buyNum}}</text>
						<text class="add" @click.stop="numAdd()">+</text>
					</view>
				</view>
				<view class="huabei-box flex-column-plus" v-if="supportHuabei">
					<label class="font-color-999 fs24">花呗分期</label>
					<scroll-view class="fenqi-box" scroll-x="true">
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex === 0},{'disabled' :disableFenqiList[0]}]"
							@click="selectFenqi(0)">
							<label class="huabei-period">分3期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[0]}}/期</label>
						</view>
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex === 1},{'disabled' :disableFenqiList[1]}]"
							@click="selectFenqi(1)">
							<label class="huabei-period">分6期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[1]}}/期</label>
						</view>
						<view class="huabei-item"
							:class="[{'fenqi-on' :fenqiIndex === 2},{'disabled' :disableFenqiList[2]}]"
							@click="selectFenqi(2)">
							<label class="huabei-period">分12期(含手续费)</label>
							<label class="huabei-money">￥{{fenqiMoneyList[2]}}/期</label>
						</view>
					</scroll-view>
				</view>
				<view v-if="selectedSku.activityType === 1 && collageId !== 0" class="goosDetailbut-box flex-items-plus"
					:style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}">
					<view class="joinbuyBut" @click="getGroupSettlement(2)">确定</view>
				</view>
				<view v-else-if="selectedSku.activityType === 1 && btnType === 3"
					class="goosDetailbut-box flex-row-plus"
					:style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}">
					<view class="buyNowBut" @click="getGroupSettlement(1)">去拼团</view>
				</view>
				<view v-else class="goosDetailbut-box flex-row-plus"
					:style="{'padding-bottom':(isIphone === true? 60:20)+'rpx'}">
					<view v-if="btnType === 1" class="buyNowBut" @click="addCart">确认</view>
					<view v-else class="buyNowBut" @click="addFast(2)">确认</view>
				</view>
			</view>
		</u-popup>
		<!-- 优惠券弹框 -->
		<u-popup v-model="showActivity" mode="bottom" border-radius="14" close-icon-pos="top-right"
			close-icon-size="20">
			<view class="couponShow-box">
				<view class="tabsbox">
					<u-tabs :list="activeTypeList" bar-width="60" :bold="false" active-color="#C5AA7B"
						inactive-color="#999999" :is-scroll="false" :current="activeTypeFlag"
						@change="activeTypeActive"></u-tabs>
				</view>
				<view v-if="activeTypeFlag === 0" class="couponShow">
					<view class="title-box">
						<image class="close-btn" @click="onActivityClose" src="../../static/images/close.png"></image>
					</view>
					<view class="shopCouponBox">
						<view class="list" v-if="markTools.length > 0">
							<view class="item" :class="{received: item.state === 1}" v-for="(item, index) in markTools"
								:key="index">
								<view class="info-box">
									<view class="discoun" v-if="item.couponType == 1"><text style="font-size: 28rpx">￥</text>{{item.reduceMoney}}</view>
									<view class="discoun" v-if="item.couponType == 2">{{item.reduceMoney}}折</view>
									<view class="info-date">{{getDate(item.startTime)}}-{{getDate(item.endTime)}}</view>
									<view class="info-condition mar-top-30">{{item.content}}</view>
									<!--                  <view class="info-condition" v-if="item.couponType == 2">{{item.reduceMoney}}折优惠</view>-->
									<view class="use-btn mar-top-10" @click="receiveTap(item,0)"
										v-if="item.state === 3">
										立即领取</view>
									<view class="use-btn mar-top-10" v-if="item.state === 0">已领取</view>
									<view class="use-btn mar-top-10" v-if="item.state === 1">已使用</view>
								</view>
							</view>
							<view v-if="markTools.length === 0" class="emptyOrder-box flex-items-plus flex-column">
								<image class="emptyOrder-img" src="../../static/img/bgnull.png"></image>
								<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
							</view>
						</view>
						<view v-else class="emptyOrder-box flex-items-plus flex-column">
							<image class="emptyOrder-img" src="../../static/img/bgnull.png"></image>
							<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
						</view>
					</view>
				</view>
				<view v-if="activeTypeFlag === 1" class="couponShow">
					<view class="title-box">
						<image class="close-btn" @click="onActivityClose" src="../../static/images/close.png"></image>
					</view>
					<view class="shopCouponBox">
						<view class="list" v-if="shopMarkTools.length > 0">
							<view class="item" :class="{received: item.state === 1}"
								v-for="(item, index) in shopMarkTools" :key="index">
								<view class="info-box">
									<view class="discoun" v-if="item.couponType === 1"><text
											style="font-size: 28rpx">￥</text>{{item.reduceMoney}}</view>
									<view class="discoun" v-if="item.couponType === 2">{{item.reduceMoney}}折</view>
									<view class="info-date">{{getDate(item.startTime)}}-{{getDate(item.endTime)}}</view>
									<view class="info-condition" v-if="item.couponType === 1">
										满{{item.fullMoney}}元减{{item.reduceMoney}}元</view>
									<view class="info-condition" v-if="item.couponType === 2">{{item.reduceMoney}}折优惠
									</view>
									<view class="use-btn" @click="receiveTap(item,1)" v-if="item.state === 3">立即领取
									</view>
									<view class="use-btn" v-if="item.state === 0">已领取</view>
								</view>
							</view>
							<view v-if="shopMarkTools.length === 0" class="emptyOrder-box flex-items-plus flex-column">
								<image class="emptyOrder-img" src="../../static/img/bgnull.png"></image>
								<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
							</view>
						</view>
						<view v-else class="emptyOrder-box flex-items-plus flex-column">
							<image class="emptyOrder-img" src="../../static/img/bgnull.png"></image>
							<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
						</view>
					</view>
				</view>
				<view class="receive-success" v-if="isShowSuccess">
					<view class="success-box">
						<image class="success-img" src="../../static/images/success_tu.png"></image>
						<view class="text">领取成功</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup class="popupDiscount" v-model="showGroupBuyList" mode="center" border-radius="14"
			close-icon-pos="top-right" close-icon-size="20">
			<view class="popupDiscountTit">这些人正在拼单</view>
			<view class="groupBuy">
				<view class="groupBuyList">
					<scroll-view style="height: 480upx;" scroll-y>
						<view class="groupBuyItem1" v-for="aitem in selectedSku.collageOrders">
							<view class="leftAvatar" v-if="aitem.time > 0">
								<img :src="aitem.headImage" alt="">
								<view class="groupBuyTime">
									<view class="needPeople"><span>{{aitem.name}}</span>还差<b>{{aitem.person}}人</b>
									</view>
									<view class="endDate">剩余{{timeChange(aitem.time)}}</view>
								</view>
							</view>
							<view class="rightInfo" v-if="aitem.time > 0">
								<view class="groupBuyBtn" @click="getGroupShow(aitem.collageId)">和Ta拼</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import UButton from "../../uview-ui/components/u-button/u-button";
  import CombinedSales from "@/components/activities/combinedSales";

	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		components: {
      CombinedSales,
			UButton
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
				paramSkuId: '',
				productData: {},
				productCommentTotal: 0,
				commentKeywordVOList: [],
				buyNum: 1,
				storeDTO: {}, //店铺信息
				storeId: '',
				id: '',
				storeName: '',
				selectedSku: {},
				commentList: [],
				commentListLength: 0,
				sellDescList: '',
				couponListLength: 0,
				showActivity: false,
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
				markTools: [], //平台优惠券
				shopMarkTools: [], //店铺优惠券
				activeTypeList: [{
					name: '平台活动'
				}, {
					name: '店铺活动'
				}],
				activeTypeFlag: 0,
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
				allCartNum:0,
        currentSuk: []
			}
		},
		computed:{
			getcarNum(){
				this.allCartNum = uni.getStorageSync('allCartNum')
			}
		},
		onLoad(options) {
			this.isIphone = getApp().globalData.isIphone;
			if (getApp().globalData.productShareItem) {
				const item = getApp().globalData.productShareItem
				this.shopId = parseInt(item.shopId)
				this.productId = item.productId
				this.paramSkuId = item.skuId
				this.salesId = parseInt(item.salesId)
				getApp().globalData.productShareItem = undefined
			} else {
				this.shopId = parseInt(options.shopId)
				this.productId = options.productId
				this.paramSkuId = options.skuId
				this.salesId = parseInt(options.salesId)
			}
			this.queryProductDetail()
			this.bindSalesCustomer(this.salesId, this.shopId)
			this.getProblems()
			this.allCartNum = uni.getStorageSync('allCartNum')
		},
		onUnload() {
			if (this.countdownInterval) {
				clearInterval(this.countdownInterval)
			}
			if (this.ticker) { //这一段是防止进入页面出去后再进来计时器重复启动
				clearInterval(this.ticker);
			}
			if (this.funtimeOut) {
				clearTimeout(this.funtimeOut)
			}
		},
		onShow() {

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
			if(this.allCartNum > 99){
				this.allCartNum = '...'
			}
		},
		methods: {
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
			activeTypeActive(index) {
				this.activeTypeFlag = index
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
				this.showActivity = true
			},
			//领取成功
			succeedShowClick() {
				this.succeedShowFlag = true
				if (this.succeedShowFlag === true) {
					setTimeout(() => {
						this.succeedShowFlag = false
					}, 1500);
				}
			},
			selectBySkuId(skuId) {
				if (skuId) {
					let mapinfo = this.productData.map
          console.log(mapinfo,'mapinfo',skuId)
					for (var key in mapinfo) {
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
                    if (attr.values[index].skuValue === '单款项') {
                      obj.skuText = '单款项'
                      this.currentSuk.push(obj)
                      break
                    } else {
                      obj.skuText = `${attr.values[index].skuName}:${attr.values[index].skuValue}`
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
                    if (attr.values[index].skuValue === '单款项') {
                      obj.skuText = '单款项'
                      this.currentSuk.push(obj)
                      break
                    } else {
                      obj.skuText = `${attr.values[index].skuName}:${attr.values[index].skuValue}`
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
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.QueryProductDetail, {
						shopId: this.shopId,
						productId: this.productId,
						skuId: this.paramSkuId,
						terminal: 1
					},
					"GET").then(res => {
					uni.hideLoading()
					this.productData = res.data

					this.markTools = res.data.markTools //平台优惠券
					this.shopMarkTools = res.data.shopMarkTools //店铺优惠券

					//如果是单款式商品，需要特殊处理productData.names
					const mapKeys = Object.keys(this.productData.map)
					if (mapKeys.length === 1 && mapKeys[0] === '单款项') {
						this.productData.names[0].values.push({
							skuValue: '单款项',
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

					//渲染商详之后，如果参数传了skuId，则选中该skuId，否则选中第一个规格
					if (this.paramSkuId) {
						this.selectBySkuId(this.paramSkuId)
					} else {
						for (var attr in this.productData.names) {
							this.nameCodeValueCodeClick(attr.nameCode, attr.values[0].valueCode, true)
						}
					}

					this.beginTimer();
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
						wx.showLoading({
							title: '添加中...',
						})
						NET.request(API.ShoppingaddCart, {
							skuId: this.selectedSku.skuId,
							number: this.buyNum,
						}, 'POST').then(res => {
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
				uni.showLoading({
					title: '提交中...',
				})
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
			//关闭优惠券弹窗
			onActivityClose() {
				this.showActivity = false
			},
			getDate(time) {
				if (!time) return '';
				return time.split(' ')[0].split('-').join('.');
			},
			receiveTap(couponItemInfo, type) {
				console.log(couponItemInfo,'couponItemInfo')
				console.log(this.shopId,'this.shopId')
				uni.showLoading({
					title: '领取中...',
				})
				let ReceiveCoupon
				if (type === 0) {
					ReceiveCoupon = {
						couponId: couponItemInfo.couponId,
						shopId:this.shopId
					}
				} else {
					ReceiveCoupon = {
						shopCouponId: couponItemInfo.shopCouponId,
						shopId:this.shopId
					}
				}
				NET.request(API.ReceiveCoupon, ReceiveCoupon, 'POST').then(res => {
					uni.hideLoading()
					this.isShowSuccess = true
					setTimeout(() => {
						this.isShowSuccess = false
						this.queryProductDetail()
					}, 1500);
					setTimeout(() => {
						this.showActivity = false
					}, 3000);
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
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
				uni.showLoading({
					title: '请稍候...'
				})
				console.log(system, 'system')
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
			}
		},
		mounted() {
			// 获取手机的屏幕高度
			uni.getSystemInfo({
				success: (res) => {
					this.screenHeight = res.screenHeight
				}
			})
		},
		onPageScroll: function(e) {
			this.returnTopFlag = e.scrollTop > 600;
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F7F7F7;
	}

	.couponItemimg {
		width: 150upx;
		height: 60upx;
	}

	.tabsbox {
		width: 100%;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.joinbuyBut {
		width: 190upx;
		height: 80upx;
		background: #333333;
		color: #FFEBC4;
		font-size: 28upx;
		line-height: 80upx;
		text-align: center;
		margin-left: 30upx;
	}

	.checkimg {
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
	}

	.container {
		padding-bottom: 180upx;

		.arrow-icon {
			width: 16upx;
			height: 24upx;
		}

		.goodsImgswiper-box {
			width: 750upx;
			height: 750upx;

			.goodsImg {
				width: 750upx;
				height: 750upx;
			}
		}

		.share-box {
			width: 200upx;
			height: 60upx;
			background-color: #FFFFFF;
			border-radius: 30upx 0 0 30upx;
			position: absolute;
			top: 30upx;
			right: 0;
			z-index: 99;

			.share-img {
				width: 36upx;
				height: 36upx;
			}
		}

		.goodgDes-box {
			background-color: #FFFFFF;
			width: 100%;
			padding-bottom: 25upx;

			.priceBuyNum-box {
				width: 677upx;
				margin-top: 30upx;
			}

			.goodsName-box {
				width: 677upx;
				height: 85upx;

				.img618-cion {
					width: 70upx;
					height: 36upx;
				}
			}

			.discounts-box {
				margin-top: 20upx;

				.discounts-text {
					margin-left: 10upx;
					color: #FF7800;
					background-color: #FFE4CC;
					padding: 6upx 12upx;
					border-radius: 4upx;
				}
			}

			.activity-box {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-end;
				border-top: 1upx solid #EDEDED;

				.activity-content {
					width: 614upx;
					padding-top: 20upx;

					.activity-text {
						color: #FF7700;
						border: 1upx solid #FF7700;
						padding: 6upx 23upx;
					}

					.coupon-arrow {
						width: 16upx;
						height: 24upx;
						margin-left: 15upx;
					}
				}
			}
		}

		.express-box {
			height: 100upx;
			background-color: #FFFFFF;
      padding-left: 30rpx;
      border-top: 12rpx solid #F8F8F8;
      border-bottom: 12rpx solid #F8F8F8;
      image {
        width: 21rpx;
        height: 27rpx;
      }
			.expressSite-icon {
				width: 30upx;
				height: 30upx;
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
			height: 90upx;
			background-color: #FFFFFF;

			.chooseSize-content {
				width: 720upx;
			}
		}

		.evaluate-box {
			background-color: #FFFFFF;
			margin-top: 20upx;

			.evaluate {
				width: 690upx;
				padding: 20upx 0;
				border-bottom: 1upx solid #EDEDED;
			}

			.evaluateTitle-box {
				width: 690upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
			}

			.evaluateAllArrow-icon {
				width: 18upx;
				height: 24upx;
			}

			.evaluateTag-box {
				margin-top: 10upx;
				margin-left: 10upx;
				padding-bottom: 10upx;
				display: flex;
				flex-wrap: wrap;

				.evaluateTag-text {
					background-color: #F4F4F4;
					border-radius: 6upx;
					padding: 16upx 14upx;
					color: #656565;
					margin-left: 20upx;
					margin-top: 20upx;
				}
			}

			.evaluate-contentbox {
				display: flex;
				justify-content: center;
				flex-direction: column;
				margin-left: 30upx;
				// border-bottom: 1upx solid #EDEDED;
				padding-bottom: 50upx;

				.evaluate-content {
					width: 670upx;
					display: flex;
					justify-content: space-between;

					.user-headSmallImg {
						width: 46upx;
						height: 46upx;
						border-radius: 50%;
					}
				}

				.evaluateDes-box {
					width: 670upx;
					margin-top: 30upx;

					.evaluateDes {
						width: 670upx;
					}
				}

				.addEvaluate {
					padding-top: 30upx;
				}
			}
		}

		.questions {
			.questionInfo {
				padding: 0 30upx;
				min-height: 150upx;

				.infoTit {
					font-size: 28upx;
				}

				.putQuestion {
					width: 164upx;
					height: 60upx;
					background: #333333;
					line-height: 60upx;
					font-size: 24upx;
					color: #FFEBC4;
					padding-left: 20rpx;
					position: relative;

					&:before {
						content: '';
						width: 60rpx;
						height: 60rpx;
						background: url("../../static/images/arrow.png") no-repeat center center;
						background-size: contain;
						display: block;
						position: absolute;
						right: 10rpx;
					}
				}
			}

			.listBox {
				padding: 0 30upx;
				border-bottom: 20upx solid #EEEEEE;

				.itemBox {
					padding-bottom: 30upx;
					border-bottom: 1upx solid #EEEEEE;
					margin-bottom: 30upx;

					&:last-child {
						border-bottom: none;
					}

					.itemAsk {
						display: flex;
						align-items: center;
						margin-bottom: 42upx;

						i {
							font-style: normal;
							width: 38upx;
							height: 38upx;
							line-height: 38upx;
							background: #C5AA7B;
							display: block;
							margin-right: 30upx;
							font-size: 24upx;
							color: #FFFFFF;
							text-align: center;
						}

						span {
							font-size: 28upx;
							color: #333333;
						}
					}

					.answer {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 30upx;

						.answerBox {
							display: flex;
							align-items: center;

							i {
								font-style: normal;
								width: 38upx;
								height: 38upx;
								line-height: 38upx;
								background: #C5AA7B;
								display: block;
								text-align: center;
								margin-right: 30upx;
								font-size: 24rpx;
								color: #FFFFFF;
							}

							span {
								font-size: 26upx;
								color: #666666;
							}
						}

						.answerBtn {
							width: 130upx;
							height: 50upx;
							line-height: 50upx;
							border: #333333 2rpx solid;
							text-align: center;
							color: #333;
							font-size: 24upx;
						}
					}

					.seeAll {
						margin-left: 68upx;
						font-size: 28upx;
						color: #C5AA7B;
					}
				}
			}
		}

		.questionTit {
			height: 90upx;
			border-bottom: 1upx solid #EEEEEE;
			margin-right: 35upx;
			color: #333333;
			font-size: 30upx;

			.allMoreBox {
				display: flex;
				align-items: center;
				color: #999999;
				font-size: 24upx;

				.evaluateAllArrow-icon {
					width: 18upx;
					height: 24upx;
				}
			}
		}

		.shopEvaList {
			display: flex;
			padding: 30upx;
			flex-wrap: wrap;
			border-bottom: 20upx solid #EEEEEE;

			.shopEvaItem {
				padding: 0 14upx;
				height: 60upx;
				background: #ffe4cc;
				border-radius: 6upx;
				line-height: 60upx;
				text-align: center;
				font-size: 28upx;
				color: #666666;
				margin: 0 20upx 20upx 0;
			}
		}

		.storeEvaluate-box {
			background-color: #FFFFFF;
			margin-top: 20upx;

			.storeEvaluate {
				width: 690upx;
				padding: 20upx 0;
				border-bottom: 1upx solid #EDEDED;
			}

			.storeEvaluateTag-box {
				margin-top: 10upx;
				margin-left: 10upx;
				padding-bottom: 30upx;
				display: flex;
				flex-wrap: wrap;

				.storeEvaluateTag-text {
					background-color: #FFE4CC;
					border-radius: 6upx;
					padding: 16upx 14upx;
					color: #656565;
					margin-left: 20upx;
					margin-top: 20upx;
				}
			}
		}

		.inStore-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.inStore-logo {
				width: 70upx;
				height: 70upx;
			}

			.inStore-but {
				width: 164upx;
				height: 60upx;
				line-height: 60upx;
				text-align: left;
				font-size: 24upx;
				color: #FFEBC4;
				background: #333333;
				padding-left: 20rpx;
				position: relative;

				&:before {
					content: '';
					width: 60rpx;
					height: 60rpx;
					background: url("../../static/images/arrow.png") no-repeat center center;
					background-size: contain;
					display: block;
					position: absolute;
					right: 10rpx;
				}
			}
		}

		.goodsDetails-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.goodsDetails-title {
				display: flex;
				flex-direction: row;
				align-items: center;

				.goodsDetails-Line {
					width: 265upx;
					border-bottom: 1upx solid #EDEDED;
				}

				.goodsDetails-text {
					padding: 0 22upx;
				}
			}

			.goodsDetailsimg-box {}
		}

		.priceExplain-box {
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 20upx 30upx;

			.priceExplain-title {
				display: flex;
				flex-direction: row;
				align-items: center;

				.priceExplain-Line {
					width: 265upx;
					border-bottom: 1upx solid #EDEDED;
				}

				.priceExplain-text {
					padding: 0 22upx;
				}
			}

			.priceExplain-dot {
				width: 9upx;
				height: 9upx;
				border: 1upx solid #FF7700;
				border-radius: 50%;
				background-color: #FF7700;
			}
		}

		.buygoods-box {
			position: fixed;
			bottom: 0upx;
			box-sizing: border-box;

			.buygoodsBut-box {
				background-color: #FFFFFF;
				width: 750upx;
				padding: 20upx 32upx;
				box-shadow: 0upx 0upx 10upx 1upx #EDEDED;
				box-sizing: border-box;

				.Cart{
					position: relative;
					.cartAllNum{
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
          .cartAllNum{
            right: -6rpx;
            top: -6rpx;
          }
          // #endif
					/* #ifdef H5 */
					.cartAllNum{
						right: -10rpx;
						top: -6rpx;
					}
					/* #endif */
					/* #ifdef MP-WEIXIN */
					.cartAllNum{
						right: -3rpx;
						top: 0;
					}
					/* #endif */
				}

				.store-icon {
					width: 48upx;
					height: 48upx;
				}

				.joinShopCartBut {
					width: 190upx;
					height: 80upx;
					background-color: #FFFFFF;
					color: #333333;
					font-size: 28upx;
					line-height: 80upx;
					border: 2rpx solid #333333;
					text-align: center;
					margin-left: 40upx;
					box-sizing: border-box;
				}

				.buyNowBut {
					width: 190upx;
					height: 80upx;
					background: #333333;
					color: #FFEBC4;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					margin-left: 30upx;
				}

				.offShelf {
					background: #b7b7b7;
					border-radius: 50upx;
					width: 360upx;
					margin-left: 50upx;
					line-height: 80upx;
					height: 80upx;
					justify-content: center;
					color: #333333;
				}
			}
		}

		.returnTopService-box {
			position: fixed;
			bottom: 160upx;
			right: 30upx;

			.fs16 {
				font-size: 16upx;
			}

			.returnTop-box {
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				background-color: #FFFFFF;
				box-shadow: 0upx 0upx 5upx 3upx #999999;

				.returnTopImg {
					width: 36upx;
					height: 36upx;
				}
			}

			.serviceImg-box {
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				background-color: #FFFFFF;
				box-shadow: 0upx 0upx 5upx 3upx #999999;

				.serviceImg {
					width: 36upx;
					height: 36upx;
					display: block;
					background: url("../../static/images/serviceImg.png") no-repeat center center;
					background-size: contain;
				}
			}
		}

		.goosDetailshow-box {
			.detailImg-box {
				margin-top: 30upx;
				margin-left: 30upx;
				border-radius: 10upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
				width: 690upx;

				.detailImg {
					width: 180upx;
					height: 180upx;
				}
			}

			.color-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.colorName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.colorName {
						background-color: #FFFFFF;
						margin-left: 30upx;
						padding: 10upx 32upx;
						font-size: 26upx;
						border: 2rpx solid #E4E5E6;
						z-index: 2;
						color: #333333;
					}

					.colorName-on {
						box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
						color: #C5AA7B;
						margin-left: 30upx;
						padding: 10upx 32upx;
						font-size: 26upx;
						text-align: center;
						z-index: 1;
						border: none;
					}
				}

			}

			.modelNum-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.modelNumName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.modelNumName-on {
						background-color: #FFE4D0;
						color: #FF7800;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #FF7800;
						font-size: 26upx;
						text-align: center;
					}

					.modelNumName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
					}
				}
			}

			.goodsNum-box {
				padding: 30upx 30upx;
				width: 690upx;
				padding-bottom: 268upx;

				.goodsNum {
					height: 50upx;

					text {
						display: inline-block;
						width: 50upx;
						height: 50upx;
						border: 1upx solid #999999;
						text-align: center;
						line-height: 50upx;
					}

					.subtract {
						border-right: 0upx;
					}

					.add {
						border-left: 0upx;
					}
				}
			}

			.bottom-line {
				border-bottom: 1upx solid #EDEDED;
			}

			.huabei-box {
				padding: 30upx 30upx;
				width: 690upx;

				.fenqi-box {
					margin-top: 15upx;
					width: 120%;

					.huabei-item {
						display: inline-block;
						background: #f3f3f3;
						padding: 16upx 24upx;
						margin: 5upx 10upx;
						border-radius: 15upx;
						text-align: center;
						font-size: 7upx;

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
					width: 343upx;
					height: 80upx;
					border-radius: 40upx 0 0 40upx;
					background-color: #FFC300;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					margin-left: 30upx;
				}

				.buyNowBut {
					width: 343upx;
					height: 80upx;
					background-color: #333333;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					color: #FFEBC4;
				}
			}
		}

		.parameterShow-box {
			.parameter-title {
				width: 100%;
				text-align: center;
				padding-bottom: 36upx;
			}

			.parameter-modle {
				width: 690upx;
				padding-bottom: 36upx;
				font-size: 26upx;
			}

			.parameterTruebut-box {
				background-color: #FFFFFF;
				padding: 20upx 0;

				.parameterTruebut {
					width: 690upx;
					height: 80upx;
					background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
					color: #FFFFFF;
					border-radius: 40upx;
					line-height: 80upx;
					text-align: center;
					font-size: 26upx;
				}
			}
		}

		.couponShow-box {

			.couponShow {
				z-index: 333;
				height: 1000upx;

				.couponTitle-box {
					width: 100%;
				}

				.coupon-title-active {
					color: #FF7700;
					border-bottom: 2upx solid #FF7700;
					padding-bottom: 30upx;
				}

				.usableCoupon-content {
					padding: 30upx 0;

					.usableCoupon-box {
						width: 690upx;
						height: 140upx;
						border-radius: 10upx;
						background-color: #FFE9D8;

						.immediateUse-but {
							color: #FF7800;
							border-radius: 30upx;
							padding: 0 40upx;
							border-left: 3upx solid #EBD7C7;
							height: 140upx;
							border-radius: 60upx;
							line-height: 140upx;
							font-weight: bold;
						}
					}
				}
			}

		}

		.succeedShow-box {
			position: absolute;
			top: 220upx;
			left: 185upx;

			.succeedShow {
				background-color: #7F7F7F;
				width: 380upx;
				height: 280upx;
				border-radius: 10upx;
				opacity: 0.8;

				.couponSucceedImg {
					width: 200upx;
					height: 130upx;
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
		height: 100upx;
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

	.title-box .close-btn {
		width: 100upx;
		height: 100upx;
		box-sizing: border-box;
		padding: 30upx;
		position: absolute;
		top: 0;
		right: 0;
	}

	// #ifdef MP-ALIPAY
	.title-box .close-btn {
		width: 30upx;
		height: 30upx;
		top: 10upx;
		right: 10upx;
	}

	// #endif

	.content-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30upx;
	}

	.tag-box {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #FF7911;
	}

	.label-lingqu {
		width: 100%;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item {
		width: 690upx;
		height: 120upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20upx;
		flex-shrink: 0;
		background-color: #FFE9D8;
	}

	.money-box {
		width: 160upx;
		box-sizing: border-box;
		padding-left: 30upx;
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
		width: 200upx;
		height: 120upx;
		background: rgba(255, 233, 216, 1);
		box-shadow: 0px 0px 5upx 0px rgba(102, 102, 102, 0.35);
		line-height: 120upx;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		color: rgba(255, 121, 17, 1);
		border-bottom-right-radius: 10upx;
		border-top-right-radius: 10upx;
		border-top-left-radius: 120upx;
		border-bottom-left-radius: 120upx;
	}

	.received {
		background: #f1f1f1;
		color: #999;
	}

	.receive-success {
		width: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 8888;
	}

	.item-image-box {
		width: 700upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.img-item {
		width: 223upx;
		height: 223upx;
		border-radius: 10upx;
		margin-right: 10upx;
		margin-top: 10upx;
	}

	.item-line {
		width: 690upx;
		height: 1px;
		background: rgba(238, 238, 238, 1);
		margin-top: 20upx;
	}

	.item-like-box {
		display: flex;
		flex-direction: row;
		width: 690upx;
		align-items: center;
		justify-content: space-between;
	}

	.like-box {
		display: flex;
		flex-direction: row;
		padding-top: 30upx;
		align-items: center;
		justify-content: flex-end;
		margin-right: 50upx;
	}

	.like-img {
		width: 48upx;
		height: 48upx;
	}

	.like-num {
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-left: 30upx;
	}

	.success-box {
		width: 380upx;
		height: 280upx;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.success-box .success-img {
		width: 200upx;
		height: 130upx;
	}

	.success-box .text {
		font-size: 28upx;
		margin-top: 50upx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.seckill-box {
		width: 100%;
		background: url("../../static/images/storeTop_Img.png") no-repeat left top;
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
					padding: 0 30upx;
					height: 116upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1upx solid #EEEEEE;

					.leftAvatar {
						display: flex;
						align-items: center;
						width: 50%;

						img {
							width: 72upx;
							height: 72upx;
							margin-right: 10upx;
							border-radius: 50%;
						}
					}

					.rightInfo {
						display: flex;
						align-items: center;
						width: 50%;

						.groupBuyTime {
							.needPeople {
								font-size: 28upx;
								color: #333333;
								margin-bottom: 10upx;
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
							width: 140upx;
							height: 60upx;
							line-height: 60upx;
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
		padding-bottom: 70upx;

		.popupDiscountTit {
			font-size: 36upx;
			color: #333333;
			height: 105upx;
			line-height: 105upx;
			text-align: center;
			border-bottom: 1upx solid #EEEEEE;
		}

		.groupBuy {
			padding-bottom: 80upx;

			.groupBuyList {
				.groupBuyItem1 {
					padding: 0 30upx;
					height: 116upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1upx solid #EEEEEE;

					.leftAvatar {
						display: flex;
						align-items: center;

						img {
							width: 72upx;
							height: 72upx;
							margin-right: 10upx;
							border-radius: 50%;
						}

						.groupBuyTime {
							margin-right: 80upx;
							margin-bottom: 10upx;
							width: 320upx;

							.needPeople {
								font-size: 26upx;
								color: #333333;

								span {
									color: #333333;
									padding-right: 10upx;
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
							width: 140upx;
							height: 70upx;
							line-height: 70upx;
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

	.shopCouponBox {
		.emptyOrder-box {
			margin-top: 70upx;

			.emptyOrder-img {
				width: 270upx;
				height: 270upx;
			}
		}

		.list {
			display: flex;
			flex-wrap: wrap;
		}

		.item {
			width: 50%;
			height: 291rpx;
			background: url("../../static/images/couponsIcon.png") no-repeat center top;
			border-radius: 10rpx;
			margin-top: 20rpx;
			display: flex;
			flex-direction: row;
			position: relative;
			background-size: contain;
			padding: 0 50rpx;
			margin-bottom: 30rpx;
		}

		.received {
			background: url("../../static/images/couponsIcon1.png") no-repeat center top;
			background-size: contain;

			.discoun {
				color: #999999;
        padding-top: 35rpx;
			}

			.use-btn {
				height: 48rpx;
				border: 2rpx solid #CCCCCC;
				line-height: 48rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				background-color: #CCCCCC;
				color: #FFFFFF;
				margin: 50rpx auto 0 auto;
				padding: 0 10rpx;
			}
		}

		.item:last-child {
			margin-bottom: 100rpx;
		}

		.discoun {
			display: flex;
			flex-direction: row;
			align-items: baseline;
			font-size: 40rpx;
			color: #C5AA7B;
			margin: 0 auto;
      padding-top: 40rpx;
		}

		.discoun text {
			display: inline-block;
		}

		.info-box {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}

		.info-condition {
			font-size: 20rpx;
			font-weight: 400;
			color: #999999;
			margin:0 auto;
		}

		.info-date {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
			margin: 10rpx auto;
      line-height: 20rpx;
		}

		.use-btn {
			height: 48rpx;
			border: 2rpx solid #C5AA7B;
			line-height: 48rpx;
			text-align: center;
			font-size: 24rpx;
			font-weight: 400;
			background-color: #C5AA7B;
			color: #FFFFFF;
			margin: 50rpx auto 0 auto;
			padding: 0 10rpx;
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
