import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import SlideVerify from 'vue-monoplasty-slide-verify'

axios.defaults.baseURL = 'http://127.0.0.1:9000'

Vue.use(SlideVerify)

Vue.use(ElementUI)

Vue.use(VueAxios, axios)

Vue.use(VueCookies)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
