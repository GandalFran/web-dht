import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'


import Vuetify from 'vuetify'

Vue.use(Vuetify, {
  theme: {
    primary: "#0f1c41",
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
