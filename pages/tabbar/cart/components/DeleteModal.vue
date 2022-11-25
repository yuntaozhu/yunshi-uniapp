<!--
    * @FileDescription: DeleteModal
    * @Author: kahu
    * @Date: 2022/11/3
    * @LastEditors: kahu
    * @LastEditTime: 2022/11/3
-->
<template>
  <div class="content">
    <TuiModal
        :show="show"
        :custom="true"
        :fadein="true"
    >
      <view class="Put-box1">
        <view class="text-align fs34 fs-bold">
          温馨提示
        </view>
        <view class="mar-top-40 text-align">
          您确定删除选中的商品吗？
        </view>
        <view class="flex-display flex-sp-between">
          <view
              class="btn"
              @click="show = false"
          >
            点错了
          </view>
          <view
              class="btn submit"
              @click="$emit('confirm')"
          >
            确认删除
          </view>
        </view>
      </view>
    </TuiModal>
  </div>
</template>

<script>
import TuiModal from "../../../../components/modal/modal";
export default {
  name: "DeleteModal",
  components:{TuiModal},
  data() {
    return {}
  },
  model:{
    prop: 'showDeleteModal',
    event: 'change'
  },
  props:{
    showDeleteModal:{
      type:Boolean,
      default:()=>false
    }
  },
  computed:{
    show:{
      get(){
        return this.showDeleteModal
      },
      set(val){
        this.$emit('change',val)
      }
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
    width: 240upx;
    color: #333333;
  }

  .submit {
    background-color: #333333;
    color: #FFEBC4;
  }
}
</style>
