import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
    theme: {
        themes: {
          light: {
            primary: '#e91e63',
            darkPink: '#6c000a'
          }
        }
      }
}

export default new Vuetify(opts)