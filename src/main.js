// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/styles/index.scss'
import ElementUI from 'element-ui'
import store from './store'
import selectTree from 'components/selecttree/SelectTree'
import Permit from 'components/Permit/Permit'

Vue.use(ElementUI)
Vue.use(selectTree)
Vue.use(Permit)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
