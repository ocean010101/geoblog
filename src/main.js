import 'babel-polyfill'
import Vue from 'vue'
import VueFetch, { $fetch } from './plugins/fetch'
import App from './components/App'
import router from './router'
import * as filters from './filters'

for (const key in filters) {
  Vue.filter(filters[key]);
}
Vue.use(VueFetch, {
  baseUrl: 'http://localhost:3000/'
});

function main() {
  new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  })
}

main()