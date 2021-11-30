<template>
  <div class="cookienotice-container" v-if="isPopup">
    <div class="cookienotice-message">
        {{this.$i18n.t('$common.cookieText')}}
        <a :title="cookielink" class="cookienotice-page-link" :href="currentLang + '/help/privacy-statement'" target="_blank" @click="moreinfo"><br>{{cookielink}}</a>
    </div>
    <div class="cookienotice-button-container">
        <a title="Close" @click="submit" class="cookienotice-button"><strong>x</strong></a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'cookienotice',
  data () {
    return {
      email: '',
      waitingTips: false,
      isPopup: true
    }
  },
  computed: {
    ...mapState({
      currentLang: state => state.lang.lang
      // promotion: state => state.site.promotion.cookie_notice
    }),
    oldCookie: function () {
      return this.$q.cookies.get('COOKIENOTICE') || ''
    },
    cookielink: function () {
      return this.$i18n.t('$common.cookielink')
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.submitSuccess = false
    },
    oldCookie: function (newVal, oldVal) {
      console.log('oldcookie', newVal, oldVal)
    }
  },
  methods: {
    moreinfo () {
      console.log('cookie moreinfo')
    },
    submit () {
      console.log('cookie submit')
      let date = Date.parse(new Date())
      this.isPopup = false
      this.$q.cookies.set('COOKIENOTICE', date, { path: '/' })
    }
  },
  mounted () {
    let date = Date.parse(new Date())
    if (this.oldCookie) {
      let step = (date - this.oldCookie) / (1000 * 60 * 60 * 24)
      console.log('oldCookie mounted', this.oldCookie, date, step, this.promotion)
      if (step < 31) {
        this.isPopup = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cookienotice-container {
  background: rgba(215,215,215,0.9);
  padding: 15px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 7000;
  width: 100%;
  .cookienotice-message {
    font-size: 15px;
    line-height: normal;
    padding-left: 40px;
    a {
      text-decoration: underline;
    }
  }
  .cookienotice-button-container {
    position: absolute;
    width: 35px;
    height: 25px;
    margin-top: -12.5px;
    margin-left: 15px;
    top: 50%;
    cursor: pointer;
    strong {
      font-size: 20px;
      text-decoration: none;
      font-family: verdana, arial, sans-serif;
    }
  }
}
</style>
