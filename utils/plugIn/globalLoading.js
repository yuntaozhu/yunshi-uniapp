import { getCurrentInstance } from 'vue';
import store from '../../store';

export function showLoading(info = '') {
    store.commit('SET_SHOW_LOADING', { flag: true, info });
}

export function hideLoading() {
    store.commit('SET_SHOW_LOADING', { flag: false, info: '' });
}

export function showLoadingAuto(info = '', time = 2000) {
    store.commit('SET_SHOW_LOADING', { flag: true, info });
    setTimeout(() => {
        store.commit('SET_SHOW_LOADING', { flag: false, info: '' });
    }, time);
}

function install(app) {
    app.config.globalProperties.$showLoading = showLoading;
    app.config.globalProperties.$hideLoading = hideLoading;
    app.config.globalProperties.$showLoadingAuto = showLoadingAuto;
}

// 导出为 Vue 3 插件
export default { install };
