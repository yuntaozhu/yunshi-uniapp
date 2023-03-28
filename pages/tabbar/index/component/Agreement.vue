<!--
    * @FileDescription: Agreement
    * @Author: kahu
    * @Date: 2023/3/7
    * @LastEditors: kahu
    * @LastEditTime: 2023/3/7
-->
<template>
  <TuiModal
      :show="privacyShow"
      :custom="true"
      :fadein="true"
  >
    <view class="Put-box1">
      <view class="text-align fs34 fs-bold">
        协议与隐私政策
      </view>
      <p class="mar-top-20">欢迎来到cereshop！我们根据最新的法律、法规、监管政策要求，更新了cereshop隐私政策。</p>
      <view class="flex-display flex-sp-between">
        <view
            class="btn submit"
            @click="privacyShow = false"
        >
          同意
        </view>
      </view>
    </view>
  </TuiModal>
</template>

<script>
import TuiModal from "@/components/modal/modal";

export default {
  name: "Agreement",
  components: {TuiModal},
  data() {
    return {
      privacyShow: false,
    }
  },
  created() {
    // this.privacyShow = true
    if (!uni.getStorageSync('storage_key')) {
      // #ifdef APP-PLUS
      this.privacyShow = true
      // #endif
    }
  },
  methods: {}
}
</script>

<style
    lang="scss"
    scoped
>
.Put-box1 {
  .btn {
    text-align: center;
    margin-top: 40rpx;
    border: 1px solid #333333;
    height: 80upx;
    line-height: 80upx;
    width: 100%;
    color: #333333;
  }

  .submit {
    background-color: #333333;
    color: #FFEBC4;
  }
}
</style>
