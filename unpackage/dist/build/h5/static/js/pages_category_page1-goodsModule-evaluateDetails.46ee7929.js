(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages_category_page1-goodsModule-evaluateDetails"],{"0010":function(e,t,a){var o=a("3bdb");"string"===typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var i=a("4f06").default;i("7dbc0232",o,!0,{sourceMap:!1,shadowMode:!1})},"29bb":function(e,t,a){"use strict";var o=a("0010"),i=a.n(o);i.a},3435:function(e,t,a){e.exports=a.p+"static/img/storeLogo.f27e5160.png"},"3bdb":function(e,t,a){var o=a("24fb");t=o(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 页面左右间距 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/*文字颜色*/\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.container[data-v-35b4eaed]{padding-bottom:%?30?%}.container .evaluate-contentbox[data-v-35b4eaed]{display:flex;justify-content:center;flex-direction:column;padding:%?30?% %?30?%;background-color:#fff}.container .evaluate-contentbox .evaluate-content[data-v-35b4eaed]{width:%?670?%;display:flex;justify-content:space-between}.container .evaluate-contentbox .evaluate-content .user-headSmallImg[data-v-35b4eaed]{width:%?46?%;height:%?46?%;border-radius:50%}.container .evaluate-contentbox .evaluateImg-box[data-v-35b4eaed]{display:flex;flex-direction:row;flex-wrap:wrap;margin-left:%?-9?%}.container .evaluate-contentbox .evaluateImg-box .evaluate-Img[data-v-35b4eaed]{width:%?224?%;height:%?224?%;border-radius:%?10?%;margin-left:%?9?%;margin-top:%?9?%}.container .evaluate-contentbox .goodsDes-box[data-v-35b4eaed]{background-color:#f7f7f7;padding:%?20?% %?44?% %?20?% %?20?%}.container .evaluate-contentbox .goodsDes-box .goodsDes-img[data-v-35b4eaed]{width:%?180?%;height:%?180?%;border-radius:%?10?%}.container .evaluate-contentbox .goodsDes-box .goodsDesText-box[data-v-35b4eaed]{width:%?416?%;margin-left:%?30?%}.container .evaluate-contentbox .goodsDes-box .addCommentsBut[data-v-35b4eaed]{width:%?150?%;height:%?56?%;border:%?1?% solid #ff7800;border-radius:%?28?%;font-size:%?26?%;line-height:%?56?%;text-align:center;color:#ff7800}.container .evaluate-contentbox .goodsDes-box .praise-box .praise-icon[data-v-35b4eaed]{width:%?36?%;height:%?36?%}.container .evaluate-contentbox .addComments-box[data-v-35b4eaed]{border-top:%?1?% solid #eee;margin-top:%?35?%}.container .butBox[data-v-35b4eaed]{padding:0 %?30?%;display:flex;justify-content:space-between}.container .butBox .addComments-box[data-v-35b4eaed]{height:%?100?%;width:%?330?%;background-color:#fff;color:#333;border:%?2?% solid #333}.container .butBox .addComments-box .addComments-cion[data-v-35b4eaed]{width:%?50?%;height:%?50?%}.container .butBox .addPraise-box[data-v-35b4eaed]{height:%?100?%;width:%?330?%;background:#333;color:#fff}.container .butBox .addPraise-box .addPraise-icon[data-v-35b4eaed]{width:%?50?%;height:%?50?%}.container .butBox .addPraise-box1[data-v-35b4eaed]{height:%?100?%;width:%?690?%;background:#333;color:#fff}.container .butBox .addPraise-box1 .addPraise-icon[data-v-35b4eaed]{width:%?50?%;height:%?50?%}.linkBox[data-v-35b4eaed]{position:absolute;bottom:%?20?%;width:100%}',""]),e.exports=t},"777b":function(e,t,a){"use strict";a("ac1f"),a("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a("7df2"),i=a("85d9"),n={data:function(){return{commentVOList:{},actionType:!0,imgDataResult:[],imageList:[]}},onLoad:function(){this.commentVOList=uni.getStorageSync("commentVOList"),uni.removeStorageSync("commentVOList"),this.commentImgData(this.commentVOList.image),this.imgDataResultData(this.commentVOList.addImage)},onBackPress:function(e){return"navigateBack"!==e.from&&(this.back(),!0)},methods:{goGoodsDetails:function(){var e=this.commentVOList.shopId,t=this.commentVOList.productId,a=this.commentVOList.skuId;uni.navigateTo({url:"goodsDetails?shopId="+e+"&productId="+t+"&skuId="+a})},back:function(){uni.navigateTo({url:"userEvaluate"})},commentImgData:function(e){this.imageList=e.split(","),console.log(this.imageList)},imgDataResultData:function(e){this.imgDataResult=e.split(","),console.log(this.imgDataResult)},zanTap:function(){var e=this;this.actionType=1==this.commentVOList.ifLike?0:1,o.request(i.LikeOrUnLikeComment,{commentId:this.commentVOList.commentId,ifLike:this.actionType},"POST").then((function(t){e.commentVOList.ifLike=!e.commentVOList.ifLike,e.commentVOList.likes=e.commentVOList.ifLike?e.commentVOList.likes+1:e.commentVOList.likes-1,1==e.actionType?uni.showToast({title:"点赞成功"}):uni.showToast({title:"已取消点赞",icon:"none"})})).catch((function(e){uni.hideLoading()}))},addCommentsClick:function(){uni.setStorageSync("addCommentVOList",this.commentVOList),uni.navigateTo({url:"addEvaluate"})},previewImg:function(e,t){var a=[];if(1===e)for(var o=0;o<this.imageList.length-1;o++)a.push(this.imageList[o]);else for(var i=0;i<this.imgDataResult.length-1;i++)a.push(this.imgDataResult[i]);console.log(a,"imgs"),uni.previewImage({current:t,urls:a})}}};t.default=n},"7df2":function(e,t,a){a("d3b7");var o=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET";return new Promise((function(o,i){var n={"Content-Type":"application/json"},s=uni.getStorageSync("storage_key"),r=s.token;r&&(n["Authorization"]=r),uni.request({url:e,data:t,method:a,header:n,success:function(e){200==e.statusCode?"200"===e.data.code||""===e.data.code?o(e.data):"20004"===e.data.code||"20005"===e.data.code?(uni.removeStorageSync("storage_key"),uni.navigateTo({url:"/pages_category_page2/userModule/login"})):uni.showToast({title:e.data.message,icon:"none"}):i(e)},fail:function(e){i(e)}})}))},i=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET";return new Promise((function(o,i){var n={"Content-Type":"application/json",tenant:"MDAwMA=="};uni.request({url:e,data:t,method:a,header:n,success:function(e){"200"===e.data.code||""===t.code?o(e.data):i(e)},fail:function(e){i(e)}})}))};e.exports={request:o,request1:i}},"85d9":function(e,t){var a="https://ceres.zkthink.com",o="/api",i=2;e.exports={terminal:i,SettledMerchantPrefix:a+"/settled-merchant",shareLink:a+"/h5",Verify:o+"/app/getCode",Login:o+"/app/login",WxLogin:o+"/app/wxLogin",AlipayLogin:o+"/app/alipayLogin",GetSessionKey:o+"/app/getSessionKey",SetWxPhone:o+"/app/setWxPhone",UpdateWxPhone:o+"/app/updateWxPhone",UpdateAliPhone:o+"/app/updateAliPhone",WxAppLogin:o+"/app/wxAppLogin",FindCategoryListByDepth:o+"/classify/getFirstClassify",SelectHotSearch:o+"/app/selectHotSearch",GetClaasifyProducts:o+"/classify/getClaasifyProducts",SearchHistory:o+"/app/getHistory",GgetSearchProducts:o+"/app/getSearchProducts",DeleteSearch:o+"/app/deleteSearch",Getindexdata:o+"/app/index",GetremenList:o+"/product/getRandomSortProduct",QueryProductDetail:o+"/product/getById",QueryProductSku:o+"/product/getProducts",getCouponProducts:o+"/coupon/getCouponProducts",QueryMemberAddres:o+"/receive/getAll",AddresAdd:o+"/receive/save",AddresDelete:o+"/receive/delete",AddresUpdate:o+"/receive/update",receiveGetInfo:o+"/receive/getById",Comment:o+"/order/addComment",AdditionalComment:o+"/order/addToComment",MyCommentList:o+"/comment/getAll",LikeOrUnLikeComment:o+"/comment/like",GetDistributor:o+"/distributor/getDistributor",FindCouponList:o+"/coupon/getCoupons",MemberAccountWithdraw:o+"/distributor/save",GetUser:o+"/user/getUser",UpdateUser:o+"/user/update",GetStore:o+"/shop/getShopProducts",GetStoreShopClassify:o+"/shop/getShopClassify",GetShopBanner:o+"/shop/getShopBanner",getShopIndex:o+"/shop/getIndex",AddBusinessBuyerUser:o+"/shop/addBusinessBuyerUser",QueryBankcardList:o+"/bank/getAll",SaveBankcard:o+"/bank/save",UpdateBankcard:o+"/bank/update",DelMemberBankcard:o+"/bank/delete",GetByIdBankcard:o+"/bank/getById",FindOrderList:o+"/order/getAll",Settlement:o+"/order/getSettlement",PlaceOrder:o+"/order/submit",GetOrderDetail:o+"/order/getById",CancelOrder:o+"/order/cancel",DelOrder:o+"/order/delete",ShippingTrace:o+"/order/getDilevery",payOrder:o+"/order/pay",gotoPay:o+"/order/gotoPay",gotoAppPay:o+"/order/gotoAppPay",gotoH5Pay:o+"/order/gotoH5Pay",ConfirmReceive:o+"/order/confirm",Orderrefund:o+"/order/refund",ReasonEnums:o+"/after/getReasonSelect",ApplyReturnMoney:o+"/after/submit",GetHuabeiConfig:o+"/order/getHuabeiConfig",ShoppingaddCart:o+"/cart/addCart",ShoppingCart:o+"/cart/getCart",UpdateNumberCart:o+"/cart/updateNumber",DeleteCart:o+"/cart/delete",SelectedCart:o+"/cart/selected",UpdateSkuCart:o+"/cart/updateSku",ReceiveCoupon:o+"/coupon/takeCoupon",FindSaleStoreList:o+"/distributor/getDistributorAll",QuerySalesMainInfo:o+"/distributor/getShopDistributor",FindSalesOrderPage:o+"/distributor/getReward",GetNotReward:o+"/distributor/getNotReward",FindSalesCustomerList:o+"/distributor/getBuyers",FindSubordinateSalesList:o+"/distributor/getDistributors",FindSalesPromConfig:o+"/distributor/getShopExtension",StoreProductList:o+"/distributor/getExtensionProduct",FindMySalesPage:o+"/distributor/getDistributorOrder",HasApply:o+"/distributor/check",BindSalesCustomer:o+"/distributor/bind",getSharePic:o+"/product/getSharePic",shopGetSharePic:o+"/shop/getSharePic",FindReturnList:o+"/after/getAll",CancelRefund:o+"/after/returnRefund",ReturnDetail:o+"/after/getById",CancelReturnGoods:o+"/after/returnGoods",ShippingCompany:o+"/order/getExpressSelect",SendReturnGoods:o+"/order/returnExpress",Apply:o+"/distributor/addDistributor",getClassify:o+"/canvas/getClassify",getProducts:o+"/canvas/getProducts",getCanvas:o+"/canvas/getCanvas",getShops:o+"/canvas/getShops",getCoupons:o+"/canvas/getCoupons",takeCoupon:o+"/coupon/takeCoupon",getShopCoupons:o+"/canvas/getShopCoupons",selectCanvasCustomList:o+"/canvas/selectCanvasCustomList",getSeckills:o+"/renovation/getSeckills",getGroupWorks:o+"/renovation/getGroupWorks",getDiscounts:o+"/renovation/getDiscounts",Query:o+"/dict/getByName",DeleteAllSearch:o+"/product/deleteAllSearch",getMessage:o+"/notice/getAll",getMessageDateils:o+"/notice/getById",readNotice:o+"/notice/readNotice",getNotice:o+"/notice/getGongGaoAll",delMessage:o+"/notice/removeById",allMessage:o+"/notice/readAll",getProductCollect:o+"/collect/getAllProduct",getStoreCollect:o+"/collect/getAllShop",cancelCollect:o+"/collect/cancel",collect:o+"/collect/collect",deleteCollect:o+"/collect/delete",addAnswer:o+"/seckill/addAnswer",addProblem:o+"/seckill/addProblem",getSeckillList:o+"/seckill/getIndex",getProblems:o+"/seckill/getProblems",getProblemDetail:o+"/seckill/getProblemDetail",getGroupSettlement:o+"/work/getSettlement",getGroupBuyList:o+"/work/getIndex",getInviteSpell:o+"/work/getInvite",getDiscountList:o+"/discount/getIndex",getFootprintList:o+"/footprint/getAll",deleteFootprint:o+"/footprint/delete",getProblemList:o+"/seckill/getProblem",getAnswerList:o+"/seckill/getAnswer",deleteProblem:o+"/seckill/deleteProblem",deleteAnswer:o+"/seckill/deleteAnswer",getShare:o+"/work/getShare",platform:o+"/after/platform",UploadUrl:o+"/file/upload",getMemberProducts:o+"/canvas/getMemberProducts",getMemberShipList:o+"/member/getMemberShipList",selectSigninHistory:o+"/member/selectSigninHistory",selectSigninRecordList:o+"/member/selectSigninRecordList",signIn:o+"/member/signIn",welfareProductList:o+"/member/welfareProductList",getMemberByMemberLevel:o+"/member/getMemberByMemberLevelId",selectCompose:o+"/product/selectCompose",queryPlatformDiscount:o+"/platform-discount/queryPlatformDiscount",queryPlatformDiscountProductList:o+"/platform-discount/queryPlatformDiscountProductList",queryProductListBySession:o+"/platform-seckill/queryProductListBySession",querySession:o+"/platform-seckill/querySession",selectByPriceId:o+"/price/selectByPriceId",selectProductListByPriceId:o+"/product/selectProductListByPriceId",getOrderPolite:o+"/order/getOrderPolite"}},ac33:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAAXNSR0IArs4c6QAAAKVQTFRFAAAAAAAAICAgKioqMDAwJiYmMzMzLCwsKioqMDAwMjIyLi4uLS0tMDAwLy8vMTExMjIyMDAwMTExMTExMTExMzMzMjIyMTExMjIyMzMzMTExMjIyMjIyMjIyMzMzMTExMjIyMzMzMjIyMjIyMjIyMjIyMzMzMjIyMjIyMzMzMjIyMjIyMzMzMzMzMjIyMjIyMzMzMzMzMjIyMjIyMzMzMjIyMzMzVYlLAwAAADV0Uk5TAAQIDBAUFBcYICQnKDA8P0hQU1RYX2BjZ293e4uPl5ufq7O3u8PDx8vT19/j5+/z9/v9/v6HLWkfAAABNklEQVRIx+3W21KDMBAG4BTQqlU8H9KqRau12qZBcff9H80NbR0TKNlc6I35rxh2viGHDSBETEzMb6Z/2Ui6LmVe/IqN7NeF6yXMBh6MW7BEgEoNvLhwsrOy+gHBowm33CVb5uKO9EEwlmb0UpCuJqGYrNa1noIKxMbmudE0+qcwXFshSH98oj4KwmtLutxcsfG3/XHFxUHWwaY3+NbGgdbCTXu7alYGbnnufHPGfLhtzFx8Q2fwxJ0vE2dLQHxOnbVi4hHgotbWOvNwomCRTUkPrT3iYQl0AlPSYO0vCycKVSLE8TuA1RssTBOVvbMXwMruKxZ+Az2c017Bo31+WbgE86Yt7w+dKgsXZNVot1Fl4Z4cXyQtVXZvi7/HxfZoL+5OF555bOcXIzu96sr5Xvz/ifkf+QKNO2Wwm1gg+wAAAABJRU5ErkJggg=="},bb31:function(e,t,a){"use strict";a.r(t);var o=a("f44a"),i=a("dcd5");for(var n in i)"default"!==n&&function(e){a.d(t,e,(function(){return i[e]}))}(n);a("29bb");var s,r=a("f0c5"),c=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,"35b4eaed",null,!1,o["a"],s);t["default"]=c.exports},dcd5:function(e,t,a){"use strict";a.r(t);var o=a("777b"),i=a.n(o);for(var n in o)"default"!==n&&function(e){a.d(t,e,(function(){return o[e]}))}(n);t["default"]=i.a},f44a:function(e,t,a){"use strict";var o;a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return o}));var i=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-uni-view",{staticClass:"container"},[o("v-uni-view",{staticClass:"evaluate-contentbox"},[o("v-uni-view",{staticClass:"evaluate-content flex-items flex-row flex-sp-between"},[o("v-uni-view",{staticClass:"flex-items"},[e.commentVOList.headImage?o("v-uni-image",{staticClass:"user-headSmallImg",attrs:{src:e.commentVOList.headImage}}):o("v-uni-image",{staticClass:"user-headSmallImg",attrs:{src:a("3435")}}),e.commentVOList.name?o("v-uni-label",{staticClass:"fs28 mar-left-20"},[e._v(e._s(e.commentVOList.name))]):o("v-uni-label",{staticClass:"fs28 mar-left-20"},[e._v("匿名")])],1),o("v-uni-label",{staticClass:"font-color-999 fs22"},[e._v(e._s(e.commentVOList.createTime))])],1),o("v-uni-view",{staticClass:"fs22 font-color-999 mar-top-10"},[e._v(e._s(e.commentVOList.value))]),o("v-uni-view",{staticClass:"fs26 pad-topbot-20"},[e._v(e._s(e.commentVOList.comment))]),e.commentVOList.image?o("v-uni-view",{staticClass:"evaluateImg-box"},e._l(e.imageList,(function(t,a){return o("v-uni-view",{key:a,on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImg(1,a)}}},[o("v-uni-image",{staticClass:"evaluate-Img",attrs:{src:t}})],1)})),1):e._e(),e.commentVOList.addComment?o("v-uni-view",{staticClass:"addComments-box flex-column-plus"},[o("v-uni-label",{staticClass:"font-color-C5AA7B mar-top-30"},[e._v("用户追评")]),o("v-uni-label",{staticClass:"mar-top-20"},[e._v(e._s(e.commentVOList.addComment))]),e.commentVOList.addImage?o("v-uni-view",{staticClass:"evaluateImg-box mar-top-20"},e._l(e.imgDataResult,(function(t,a){return o("v-uni-view",{key:a,on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImg(2,a)}}},[o("v-uni-image",{staticClass:"evaluate-Img",attrs:{src:t}})],1)})),1):e._e()],1):e._e(),o("v-uni-view",{staticClass:"goodsDes-box flex-column-plus mar-top-30"},[o("v-uni-view",{staticClass:"flex-row-plus",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.goGoodsDetails.apply(void 0,arguments)}}},[o("v-uni-image",{staticClass:"goodsDes-img",attrs:{src:e.commentVOList.productImage}}),o("v-uni-view",{staticClass:"goodsDesText-box"},[o("v-uni-label",{staticClass:"fs26 goodsDes-text"},[e._v(e._s(e.commentVOList.productName))]),o("v-uni-view",{staticClass:"mar-top-70"},[o("v-uni-label",[e._v("¥ "+e._s(e.commentVOList.productPrice))])],1)],1)],1)],1)],1),o("v-uni-view",{staticClass:"linkBox"},[""!=e.commentVOList.addComment?o("v-uni-view",{staticClass:"butBox flex-row-plus"},[o("v-uni-view",{staticClass:"addPraise-box1 flex-items-plus",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.zanTap.apply(void 0,arguments)}}},[o("v-uni-image",{staticClass:"addPraise-icon",attrs:{src:a("f877")}}),o("v-uni-label",{staticClass:"mar-left-10 font-color-FFEBC4"},[e._v("点赞")])],1)],1):o("v-uni-view",{staticClass:"butBox flex-row-plus"},[o("v-uni-view",{staticClass:"addComments-box flex-items-plus",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.addCommentsClick()}}},[o("v-uni-image",{staticClass:"addComments-cion",attrs:{src:a("ac33")}}),o("v-uni-label",{staticClass:"mar-left-10 font-color-333"},[e._v("追加评价")])],1),o("v-uni-view",{staticClass:"addPraise-box flex-items-plus",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.zanTap.apply(void 0,arguments)}}},[o("v-uni-image",{staticClass:"addPraise-icon",attrs:{src:a("f877")}}),o("v-uni-label",{staticClass:"mar-left-10 font-color-FFEBC4"},[e._v("点赞")])],1)],1)],1)],1)},n=[]},f877:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAAXNSR0IArs4c6QAAAMBQTFRFAAAAv7+/v7+/v7+/v7+/09PTysrKyMjIx8fHzc3Ny8vL0dHRzMzMy8vLycnJyMjIy8vLzMzMzs7Oy8vLy8vLycnJy8vLzs7Oy8vLzc3Ny8vLysrKzMzMysrKy8vLzc3NzMzMzMzMysrKy8vLzc3Nzc3NzMzMzMzMy8vLzc3NzMzMzMzMzMzMzMzMy8vLzMzMzMzMzMzMy8vLy8vLy8vLzMzMzMzMy8vLzMzMzMzMzMzMzMzMy8vLy8vLzMzMzMzMkdyctwAAAD90Uk5TAAQIDBAXGBwgJCcnKCw0ODs8P0BETE9TVFdYXF9gZ2dvc3R7e3+Hi4+Tl5+vs7e/w8fLz9Pb3+fn6+/z9/v7S+cfkgAAARdJREFUSMft1ttOwkAYReENeEBFkYInFBEVQU4FqqVCcb3/W3lRNMZgh/7XXZfTfMk02Wkq5eXlZezk8mbfSI/nQHxlwwEA61OLrcP0+hHGFvwCNWnKumTAM1YF6QGq2W0xZiKpBXXTK3fNuJ/ctwtnmW0hIpKkkI9CZtyGnqQqDDJbb0V8KOkeLnY150GYBDxLUhMWm6Nw1k7Hb/yU3HYv4lfpGiLf95fEo8bmpDz0v4uZOvBQkk+47eGSwIwr8GrGd9A04wGUzThIJmfCJRiZcQM6ZvwENTMe81k04yVzWXEF+mbsnEgadk4kDTsnkoLdE5Fg4nlewML7U8c5EYmUnF/g9/9tz/kBPGi2tnd7lP/q5OXt1hfAQVI1j3bZ7QAAAABJRU5ErkJggg=="}}]);