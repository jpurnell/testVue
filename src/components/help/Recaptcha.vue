<template>
  <div :id="nowTime" :class="['recaptcha', hasError?'hasError':'noError']">
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {

  data () {
    return {
      sitekey: '6LfcQ9kbAAAAAKbd-GwuoGZePILYsM91F3Bq_JBO',
      token: '',
      hasError: false,
      nowTime: '',
      recaptchaId: 0,
      vueRecaptchaInit: 0
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  created () {
    this.nowTime = 'grecaptcha' + this.id
    // console.log('recaptcha created', this.nowTime)
    // if (typeof window === 'undefined') return
    // console.log('recaptcha created 1', window.grecaptcha)
    // if (window.grecaptcha) return
    // const recaptchaScript = document.createElement('script')
    // const language = this.lang ? `&hl=${this.lang}` : ''
    // recaptchaScript.onloadeddata = () => {
    //   console.log('recaptcha created 3', window.grecaptcha)
    //   this.recaptchaId++
    // }
    // recaptchaScript.setAttribute('src', `https://www.google.com/recaptcha/api.js?render=explicit${language}`)
    // recaptchaScript.setAttribute('async', '')
    // recaptchaScript.setAttribute('defer', '');
    // (document.body || document.head).appendChild(recaptchaScript)
    // console.log('recaptcha created 2', window.grecaptcha)
  },
  watch: {
    recaptchaId () {
      console.log('recaptcha watch recaptchaId', window.grecaptcha)
      this.loaded()
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  },
  methods: {
    submit: function (token) {
      console.log('recaptcha submit', token)
      if (token && token !== '') {
        this.token = token
        this.hasError = false
      }
    },
    expired: function () {
      console.log('recaptcha expired')
      this.token = ''
      this.hasError = true
    },
    validate () {
      if (this.token && this.token !== '') {
        this.hasError = false
      } else {
        this.hasError = true
      }
    },
    loaded () {
      try {
        // console.log('recaptcha loaded 0', window.grecaptcha, this.nowTime)
        setTimeout(() => {
          // try {
          // console.log('recaptcha loaded 1', window.grecaptcha, window.grecaptcha.render, document.getElementById(this.nowTime))
          if (window.grecaptcha && window.grecaptcha.render && document.getElementById(this.nowTime)) {
            // console.log('recaptcha loaded 2', this.nowTime, this.recaptchaId, document.getElementById(this.nowTime).getElementsByTagName('div').length, window.grecaptcha)
            if (document.getElementById(this.nowTime) && document.getElementById(this.nowTime).getElementsByTagName('div').length > 0) return
            window.grecaptcha.render(document.getElementById(this.nowTime), {
              sitekey: this.sitekey,
              callback: this.submit,
              'expired-callback': this.expired,
              'error-callback': this.expired
            })
          } else {
            this.loaded()
          }
        }, 500)
      } catch (error) {
      }
    }
  },
  mounted () {
    this.loaded()
  }
}
</script>

<style lang="scss">
.recaptcha {
  &.hasError {
    & > div {
      border: 1px solid #c10015;
    }
  }
}
</style>>
