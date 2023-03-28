import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

import store from './store'
import _ from 'lodash'

import {jump,jumpToTabbar,goBack,getJumpParam} from './utils/jumpUtil'

Vue.prototype.$store = store
Vue.prototype.$lodash = _
Vue.prototype.$jump = jump
Vue.prototype.$jumpToTabbar = jumpToTabbar
Vue.prototype.$goBack = goBack
Vue.prototype.$getJumpParam = getJumpParam
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
