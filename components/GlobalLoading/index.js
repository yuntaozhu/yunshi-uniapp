import Vue from 'vue'
import store from "../../store";
import GlobalLoading from "./index.vue";
export function showLoading(info=''){
    store.commit("SET_SHOW_LOADING",{flag:true,info})
}

export function hideLoading(){
    store.commit("SET_SHOW_LOADING",{flag:false,info:''})
}

export function showLoadingAuto(info='',time = 2000){
    store.commit("SET_SHOW_LOADING",{flag:true,info})
    setTimeout(()=>{
        store.commit("SET_SHOW_LOADING",{flag:false,info:''})
    },time)
}

Vue.prototype.$showLoading = showLoading
Vue.prototype.$hideLoading = hideLoading
Vue.prototype.$showLoadingAuto = showLoadingAuto
// Vue.component("globalLoading",GlobalLoading)

// export default GlobalLoading
