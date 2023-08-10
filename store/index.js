// 引入所需模块和方法
import { createStore } from 'vuex';
import { doPointRequest } from '../config/requestApi';

const state = () => ({
    globalLoading: {
        showLoading: false,
        showInfo: '',
    },
});

const getters = {
    loadingFlag: (state) => state.globalLoading.showLoading,
    loadingInfo: (state) => state.globalLoading.showInfo,
};

const mutations = {
    SET_SHOW_LOADING(state, obj) {
        state.globalLoading.showLoading = obj.flag;
        state.globalLoading.showInfo = obj.info;
    },
};

const actions = {
    async doPointer({ commit }, data) {
        let item = {};
        if (uni.getStorageSync('storage_key')) {
            item = uni.getStorageSync('storage_key');
        }
        if (JSON.stringify(item) === '{}') {
            return;
        }

        const res = await doPointRequest(data);
        console.log('埋点----------------------------------', res);
    },
};

// 创建 Vuex.Store 实例
const store = createStore({
    state,
    getters,
    mutations,
    actions,
});

export default store;
