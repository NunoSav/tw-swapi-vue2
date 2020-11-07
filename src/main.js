import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCloudSunRain,
  faRulerCombined,
  faSpinner,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCloudSunRain, faRulerCombined, faSpinner, faUserFriends);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://swapi.dev/api';
Vue.prototype.axios = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
