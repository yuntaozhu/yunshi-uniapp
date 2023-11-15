import { createApp } from 'vue'
import App from './App.vue'
import uView from './uni_modules/vk-uview-ui';
import store from './store'
import { jump, jumpToTabbar, goBack, getJumpParam } from './utils/jumpUtil'
import loadingPlugin from './utils/plugIn/globalLoading'
import GlobalLoading from "@/components/diyLoading/index.vue";
import UvSkeleton from "@/components/uv-skeleton/uv-skeleton.vue";
const app = createApp(App)

app.use(uView)
app.use(store)
app.use(loadingPlugin)
app.component('GlobalLoading',GlobalLoading)
app.component('UvSkeleton',UvSkeleton)
app.config.productionTip = false

app.provide('$store', store)
app.provide('$jump', jump)
app.provide('$jumpToTabbar', jumpToTabbar)
app.provide('$goBack', goBack)
app.provide('$getJumpParam', getJumpParam)

console.log(store)

app.mount('#app')
