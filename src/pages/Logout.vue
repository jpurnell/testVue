<template>
  <q-page></q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { signOut } from './../api/api'
export default {
  data () {
    return {
      sessionId: ''
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'setCartQtyDriect',
        'setCartInfo'
      ]
    ),
    ...mapActions(
      'site',
      [
        'setHasLoginSuccess'
      ]
    ),
    logOut () {
      let formdata = {}
      signOut(formdata).then(data => {
        console.log(data)
        this.sessionId = data.session_id
        this.$q.cookies.set('PHPSESSID', this.sessionId, { path: '/' })
        this.$q.cookies.set('isLogin', '0', { path: '/' })
        this.$q.cookies.remove('email', { path: '/' })
        this.$q.cookies.remove('firstname', { path: '/' })
        this.$q.cookies.remove('lastname', { path: '/' })
        this.$q.cookies.remove('is_subscribe', { path: '/' })
        this.$q.sessionStorage.clear()
        this.setCartQtyDriect(0)
        this.setCartInfo({})
        this.setHasLoginSuccess(false)
        this.$router.replace({ name: 'home' })
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.logOut()
  }
}
</script>
