import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'amfe-flexible/index.js'
import 'vant/lib/index.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "amfe-flexible";
import 'lib-flexible'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.chinatmsproviders'
// import "@geoman-io/leaflet-geoman-free";
// import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// import "./utils/@geoman-io/leaflet-geoman-free";
import "./utils/geoman/L.PM"
// import "./utils/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import * as turf from '@turf/turf'

import "leaflet-polylinedecorator";

import "leaflet-measure-path";
import "leaflet-measure-path/leaflet-measure-path.css";

import videojs from 'video.js';
import "video.js/dist/video-js.css";
import hls from 'videojs-contrib-hls';

import iconfont from '@/assets/font/iconfont.css'
import './assets/css/icon.css';
import './assets/css/maphome.less';

// 配置axios
import axios from 'axios'
// 把axios绑定到vue的原型链上，就可以通过this.的方式全局使用
// axiso是为了给数据服务所以端口是服务器的端口号

Vue.prototype.axios = axios

Vue.config.productionTip = false

Vue.prototype.turf = turf;
Vue.prototype.$video = videojs; 
// Vue.prototype.pm = {};
Vue.prototype.$EventBus = new Vue()

Vue.use(ElementUI);
Vue.use(Vant);
Vue.use(ElementUI);
Vue.use(hls); // 要播放hls流, 这哥们就要上场

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  if (to.fullPath == "/login") {
    next()
    return
  }
  const nextRoute = ['home'];
  let isLogin = store.state.isLogin;//global.isLogin;  // 是否登录
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  //if (nextRoute.indexOf(to.name) >= 0) {  
  if (!isLogin) {
    console.log('未登录，跳转登录页面');
    next('login')
    return
  }
  //}
  // 已登录状态；当路由到login时，跳转至home 
  if (to.name === 'login') {
    if (isLogin) {
      next('home');
      return
    }
  }
  next();
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
