import 'babel-polyfill'
import Vue from 'vue'
import VueFetch, { $fetch } from './plugins/fetch'
import App from './components/App.vue'
import router from './router'
import * as filters from './filters'
import store from './store'
import { sync } from 'vuex-router-sync'

for (const key in filters) {
  Vue.filter(filters[key]);
}
Vue.use(VueFetch, {
  baseUrl: 'http://localhost:3000/'
});

sync(store, router)
async function main() {
  await store.dispatch('init');
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
main()