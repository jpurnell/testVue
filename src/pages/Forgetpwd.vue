<template>
  <div class="forgetpwd-page">
    <div class="forgetpwd-block">
      <h1>{{ forgetPWDLink }}</h1>
      <div class="forgetpwd-form">
        <h2>{{forgetPWDFormHeading}}</h2>
        <div class="content">
          <p class="text-body1">{{ forgetPWDTips }}</p>
          <p class="field-label">{{inputEmail}}</p>
          <div class="field">
            <q-input
              ref="email"
              square
              dense
              outlined
              bg-color="white"
              :clearable="email && clearable.email"
              clear-icon="icon-close"
              @blur="showInputClear('email', false)"
              @focus="showInputClear('email', true)"
              v-model="email"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || emailAddressRequired,
                checkFormEmail
              ]"
            />
          </div>
          <p class="field-label"><!--{{inputCaptcha}}--></p>
          <div class="field">
            <recaptcha ref="captcha" :id="'FrgtPwdpage'"/>
            <!-- <q-input
              ref="captcha"
              square
              dense
              outlined
              bg-color="white"
              :clearable="captcha && clearable.captcha"
              clear-icon="icon-close"
              @blur="showInputClear('captcha', false)"
              @focus="showInputClear('captcha', true)"
              v-model="captcha"
              lazy-rules
              :rules="[ val => val.length >= 5 || captchaError]"
            /> -->
          </div>
          <!-- <div class="field">
            <div class="captcha-block">
              <q-img :src="captchaUrl" @click="intiCaptcha" />
              <q-btn
                :loading="captchaloaded"
                round
                icon="icon-update"
                text-color="white"
                color="primary"
                class="refresh"
                @click="intiCaptcha"
              >
                <template v-slot:loading>
                  <q-spinner color="white" />
                </template>
              </q-btn>
            </div>
          </div> -->
        </div>
        <div class="action">
          <router-link :to="{name: 'login'}" class="back">
            <span>{{backToLogin}}</span>
          </router-link>
          <link-btn-2 :text="submitText" @click="submit"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPassword } from './../api/api'
import { checkEmail } from './../utils/validation'
import linkBtn2 from './../components/ui/Button2'
import recaptcha from './../components/help/Recaptcha'
export default {
  name: 'forgetpwd',
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
      metaDescription: '',
      metaKeywords: '',
      clearable: {
        email: false,
        captcha: false
      }
    }
  },
  meta () {
    return {
      // sets document title
      title: this.forgetPWDLink,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  computed: {
    forgetPWDLink: function () {
      return this.$i18n.t('$common.$buttons.forgetPWDLink')
    },
    forgetPWDFormHeading: function () {
      return this.$i18n.t('$common.$headings.forgetPWDFormHeading')
    },
    forgetPWDTips: function () {
      return this.$i18n.t('$common.$validation.forgetPWDTips')
    },
    inputEmail: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    emailSendTips: function () {
      return this.$i18n.t('$common.$validation.forgetPWDSuccess', { email: this.email })
    },
    backToLogin: function () {
      return this.$i18n.t('$common.$buttons.backToLogin')
    },
    emailAddressRequired: function () {
      return this.$i18n.t('$common.$validation.emailAddressRequired')
    },
    emailErrorTips: function () {
      return this.$i18n.t('$common.$validation.emailErrorTips')
    }
  },
  methods: {
    submit () {
      this.$refs.email.validate()
      this.$refs.captcha.validate()
      if (this.$refs.email.hasError || this.$refs.captcha.hasError) {
        return false
      }
      let formdata = {
        customer_email: this.email,
        // captcha: this.captcha,
        captcha: this.$refs.captcha.token,
        form_token: 'forgetpwd'
      }
      getPassword(formdata).then(data => {
        console.log(data)
        let msg = this.emailSendTips
        this.msgAlert(msg)
        if (this.$q.sessionStorage.has('afterLoginToPage')) {
          let toPage = this.$q.sessionStorage.getItem('afterLoginToPage')
          let toPageRouter = JSON.parse(toPage)
          if (toPageRouter.name) {
            this.$router.push(toPageRouter)
          } else {
            this.$router.push({ name: 'home' })
          }
        } else {
          this.$router.push({ name: 'home' })
        }
      }).catch(e => {
        console.log(e)
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
        // console.log('forgetpwd intiCaptcha', this.$refs)
        // this.$refs.captcha.loaded()
      }, 0)
    //   let formdata = {
    //     form_token: 'forgetpwd'
    //   }
    //   this.captchaloaded = true
    //   getCaptcha(formdata).then(data => {
    //     console.log(data)
    //     this.captchaUrl = data.captcha
    //     this.captchaloaded = false
    //   }).catch(e => {
    //     console.log(e)
    //   })
    },
    msgAlert (msg) {
      this.$q.notify({
        message: msg,
        position: 'center',
        timeout: '3000',
        classes: 'notify'
      })
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    }
  },
  created () {
    this.intiCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.forgetpwd-page {
  padding-top: 3%;
  padding-bottom: 72px;
}
.forgetpwd-block {
  min-height: 300px;
  padding: 0 5%;
}
h1 {
  margin: 1em 0 0.5em;
  padding: 0;
  font-size: 50px;
  line-height: 47.6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
h2 {
  line-height: 1;
  padding: 2%;
  margin: 0;
  color: $white;
  background: $primary;
  font-size: 1em;
  font-family: $typography-font-family;
  text-transform: uppercase;
}
.content {
  padding: 3%;
  background: $brandgrey1;
  margin-top: 0;
}
.field-label {
  margin: 0;
}
.captcha-block {
  width: 30%;
  position: relative;
  .refresh {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.action {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  padding: 20px 0 0;
}
.back {
  padding: 24px 22px 24px 0;
  font-size: 0.875em;
  line-height: 1.857em;
  letter-spacing: 0.1px;
  text-transform: uppercase;
  &:before {
    display: inline-block;
    content: '';
    width: 0;
    transform: rotate(135deg);
    transform-origin: 75% 75%;
    transition: transform 0.5s ease;
    border-width: 0 0.8px 0.8px 0;
    border-style: solid;
    border-color: $primary;
    padding: 4px;
    position: relative;
    top: -3px;
    left: 0;
  }
  span {
    padding-left: 15px;
    font-size: 0.875em;
  }
}
@media screen and (max-width: 660px) {
  .forgetpwd-page {
    padding-top: 5%;
    padding-bottom: 122px;
  }
  .forgetpwd-block {
    padding: 3% 5% 0;
  }
  h1 {
    font-size: 34px;
    line-height: 30px;
    letter-spacing: 0.1px;
  }
}
@media screen and (max-width: 599px) {
  .captcha-block {
    width: 100%;
  }
}
</style>
