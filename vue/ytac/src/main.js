import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'
import { firestorePlugin } from 'vuefire'
import moment from 'moment'
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '729918349272-7bntba13lunpf59h6s9hsi94cupb51nt.apps.googleusercontent.com',
  scope: 'profile email  https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly' ,
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
Vue.use(firestorePlugin)
Vue.config.productionTip = false
Vue.filter('formatDate', function (value) {
  if (!value) return ''
  return moment(value.toString()).format('MM/DD/YYYY hh:mm')
})
let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
