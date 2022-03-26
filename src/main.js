import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "@/store";
import toast from "components/common/toast"
import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false

//创建一个事件总线,用来记录图片加载事件,也可以用vuex状态管理来记录
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)
// 解决移动端300ms延迟
FastClick.attach(document.body)
//图片懒加载
Vue.use(VueLazyload, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
