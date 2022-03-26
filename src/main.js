import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "@/store";
import toast from "components/common/toast"

Vue.config.productionTip = false

//创建一个事件总线,用来记录图片加载事件,也可以用vuex状态管理来记录
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
