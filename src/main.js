import Vue from 'vue'
import { store } from './_store';
import App from './App.vue'
import router from './router/router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueVisible from 'vue-visible';
import VueObserveVisibility from 'vue-observe-visibility'
import vueHeadful from 'vue-headful';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueVisible);
Vue.use(VueObserveVisibility);
Vue.component('vue-headful', vueHeadful);

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
