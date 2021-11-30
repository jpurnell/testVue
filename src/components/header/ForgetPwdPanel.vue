<template>
  <div :class="['forget-pwd-panel', lang, isMobile ? 'mobile' : 'desktop']">
    <h4>{{ forgetPWDLink }}</h4>
    <p class="name">{{ forgetPWDTips1 }}</p>
    <p class="tips">{{ forgetPWDTips2 }}</p>
    <!-- <p class="field-name"><label for="forgetPasswordEmail">{{email2}}</label></p> -->
    <div>
      <q-input
        ref="email"
        square
        outlined
        bg-color="white"
        :clearable="email && clearable.email"
        clear-icon="icon-close"
        @blur="showInputClear('email', false)"
        @focus="showInputClear('email', true)"
        v-model="email"
        name="forgetPasswordEmail"
        :label="email2"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || emailAddressRequired,
          checkFormEmail
        ]"
      />
    </div>
    <!-- <p class="field-name">{{inputCaptcha}}</p> -->
    <recaptcha ref="captcha" :id="'FrgtPwd'"/>
    <div :class="['action', lang]">
      <link-btn-2 :text="cancelButtonText" color="white" @click="closeForgetPwdDialog" />
      <link-btn-2 :text="submitText" @click="submit" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import notify from './../../mixins/Notify'
import { getPassword } from '../../api/api'
import { checkEmail } from '../../utils/validation'
import linkBtn2 from './../ui/Button2'
import recaptcha from './../help/Recaptcha'

export default {
  name: 'ForgetPwdPanel',
  components: {
    'link-btn-2': linkBtn2,
    recaptcha
  },
  data () {
    return {
      email: '',
      captcha: '',
      captchaUrl: '',
      captchaloaded: false,
      clearable: {
        email: false,
        captcha: false
      }
    }
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
    inDrawer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    email2: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    cancelButtonText: function () {
      return this.$i18n.t('$common.$buttons.cancel')
    },
    emailSendTips: function () {
      return this.$i18n.t('$common.$validation.forgetPWDSuccess', { email: this.email })
    },
    forgetPWDLink: function () {
      return this.$i18n.t('$common.$buttons.forgetPWDLink')
    },
    forgetPWDTips1: function () {
      return this.$i18n.t('$common.$validation.forgetPWDTips1')
    },
    forgetPWDTips2: function () {
      return this.$i18n.t('$common.$validation.forgetPWDTips2')
    },
    emailAddressRequired: function () {
      return this.$i18n.t('$common.$validation.emailAddressRequired')
    },
    emailErrorTips: function () {
      return this.$i18n.t('$common.$validation.emailErrorTips')
    },
    siteEmail: function () {
      return this.$i18n.t('$local.siteEmail')
    },
    isCheckoutPage () {
      return this.$route.name === 'checkout'
    },
    isShowTip () {
      return checkEmail(this.email)
    }
  },
  mixins: [notify],
  methods: {
    submit () {
      this.$refs.email.validate()
      this.$refs.captcha.validate()
      if (this.$refs.email.hasError || this.$refs.captcha.hasError) {
        return false
      }
      let formdata = {
        customer_email: this.email,
        captcha: this.$refs.captcha.token, // this.captcha,
        form_token: 'forgetpwd'
      }
      getPassword(formdata).then(data => {
        console.log('getPassword', data)
        this.$emit('closeForgetPwdDialog')
        let msg = this.$i18n.t('$common.$validation.forgetPWDSuccess', { email: this.email })
        console.log('getPassword 2', msg)
        this.msgAlert(msg)
        this.closeForgetPwdDialog()
      }).catch(e => {
        console.log('e', e)
        let msg = ''
        if (e.indexOf('No such entity with email') !== -1) {
          msg = this.$i18n.t('no such entity with email')
        } else if (e.indexOf('Too many password reset requests') !== -1) {
          msg = this.$i18n.t('$common.$validation.tooManyPasswordRequests', { email: this.siteEmail })
        } else if (e.indexOf('wrong captcha') !== -1) {
          msg = this.$i18n.t('$common.$validation.wrongCaptcha')
        } else {
          msg = this.$i18n.t(e)
        }
        this.msgAlert(msg)
        this.intiCaptcha()
      })
    },
    intiCaptcha () {
      setTimeout(() => {
        // console.log('forgetpwd panel intiCaptcha', this.$refs)
        // this.$refs.captcha.loaded()
      }, 0)
      // let formdata = {
      //   form_token: 'forgetpwd'
      // }
      // this.captchaloaded = true
      // getCaptcha(formdata).then(data => {
      //   console.log(data)
      //   this.captchaUrl = data.captcha
      //   this.captchaloaded = false
      // }).catch(e => {
      //   console.log(e)
      // })
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    },
    closeForgetPwdDialog () {
      this.$emit('closeForgetPwdDialog')
    }
  },
  created () {
    this.intiCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.forget-pwd-panel {
  width: 400px;
  padding: 0;
  border-radius: 0;
}
.tips {
  font-size: 14px;
  margin: 0;
}
.field-name {
  margin: 10px 0 0;
}
.captcha-block {
  position: relative;
  button {
    position: absolute;
    right: 20px;
  }
}
.action {
  width: 100%;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 400px) {
    flex-direction: column;
    > p,
    > div {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
.close {
  width: 36px;
  height: 36px;
  color: $white;
  background: $black;
  border-radius: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
label {
  margin: 3px 0 7px 0;
}
@media screen and (max-width: 599px) {
  .forget-pwd-panel {
    width: 100%;
    padding: 0;
  }
}
</style>
