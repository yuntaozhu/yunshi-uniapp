import Vue from 'vue'
import Vuex from 'vuex'
import {doPointRequest} from '../config/requestApi'

Vue.use(Vuex);//vue的插件机制

const state = {
    globalLoading: {
        showLoading: false,
        showInfo: ''
    }

}
const getters = {
    loadingFlag: (state) => state.globalLoading.showLoading,
    loadingInfo: (state) => state.globalLoading.showInfo
}
const mutations = {
    ["SET_SHOW_LOADING"](state, obj) {
        state.globalLoading.showLoading = obj.flag
        state.globalLoading.showInfo = obj.info
    }
}
const actions = {
    /**
     *
     * @param context
     * @param data {{eventType:1-浏览商品 2-添加购物车 3-提交订单,productIds:字符串逗号分割}}
     * @returns {Promise<void>}
     */
    async doPointer(context, data) {
        //判断是否登录
        let item = {}
        if (uni.getStorageSync('storage_key')) {
            item = uni.getStorageSync('storage_key');
        }
        if (JSON.stringify(item) === '{}') {
            return
        }
        const res = await doPointRequest(data)
        // const res = await NET.request(API.doPointer, data, 'post')
        console.log("埋点----------------------------------", res)
    }
}

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})
export default store
