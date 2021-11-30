<template>
  <div class="register-page">
    <div class="register-block">
      <h1>{{ registerLinkText }}</h1>

      <div class="row justify-between register">
        <div class="col-12">
          <div class="register-form form-left">
            <h2>{{personalInfo}}</h2>
            <div class="content">
              <p class="field-label">{{firstName}}</p>
              <div class="field">
                <q-input
                  ref="firstname"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.firstname && clearable.firstname"
                  clear-icon="icon-close"
                  @blur="showInputClear('firstname', false)"
                  @focus="showInputClear('firstname', true)"
                  v-model="form.firstname"
                  lazy-rules
                  :rules="[ val => val.length >= 1 || firstNameError]"
                />
              </div>
              <p class="field-label">{{lastName}}</p>
              <div class="field">
                <q-input
                  ref="lastname"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.lastname && clearable.lastname"
                  clear-icon="icon-close"
                  @blur="showInputClear('lastname', false)"
                  @focus="showInputClear('lastname', true)"
                  v-model="form.lastname"
                  lazy-rules
                  :rules="[ val => val.length >= 1 || lastNameError]"
                />
              </div>
              <p class="field-label">{{inputEmail}}</p>
              <div class="field">
                <q-input
                  ref="email"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.email && clearable.email"
                  clear-icon="icon-close"
                  @blur="showInputClear('email', false)"
                  @focus="showInputClear('email', true)"
                  v-model="form.email"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || emailAddressRequired,
                    checkFormEmail
                  ]"
                />
              </div>
              <div class="field">
                <div>
                  <q-checkbox v-model="isAgree" color="primary"/>
                  <span class="term">
                    {{ agreeTips }}
                    <router-link class="link" :to="{name: 'help', params: { note: termsUrl}}" target="_blank">{{generalSalesConditions}}</router-link>
                    {{and}}
                    <router-link class="link" :to="{name: 'help', params: { note: privacyUrl}}" target="_blank">{{privacyPolicy}}</router-link>
                    {{ agreeTips2 }}*
                  </span>
                </div>
                <!-- Disable Email sign-up, per MO Brand request -->
                <!-- <div>
                  <q-checkbox v-model="form.is_subscribed" :label="subscribeCheckbox" color="primary"/>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="register-form form-right">
            <h2>{{loginInfo}}</h2>
            <div class="content">
              <p class="field-label">{{inputPWD}}</p>
              <div class="field">
                <q-input
                  ref="password"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.password && clearable.password"
                  clear-icon="icon-close"
                  @blur="showInputClear('password', false)"
                  @focus="showInputClear('password', true)"
                  v-model="form.password"
                  :type="isPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || curPWDRequired,
                    val => val.length >= 6 || pwdErrorTips
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'icon-visibility_off' : 'icon-visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <p class="field-label">{{inputConfirmPWD}}</p>
              <div class="field">
                <q-input
                  ref="confirmPassword"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.confirmpwd && clearable.confirmpwd"
                  clear-icon="icon-close"
                  @blur="showInputClear('confirmpwd', false)"
                  @focus="showInputClear('confirmpwd', true)"
                  v-model="form.confirmpwd"
                  :type="isConfirmPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || confirmPWDRequired,
                    val => val.length >= 6 && form.password === form.confirmpwd || ensureBothPWDMatch
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isConfirmPwd ? 'icon-visibility_off' : 'icon-visibility'"
                      class="cursor-pointer"
                      @click="isConfirmPwd = !isConfirmPwd"
                    />
                  </template>
                </q-input>
              </div>
              <!-- <p class="field-label">{{inputCaptcha}}</p> -->
              <div class="field">
                <recaptcha ref="captcha" />
                <!-- <q-input
                  ref="captcha"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.captcha && clearable.captcha"
                  clear-icon="icon-close"
                  @blur="showInputClear('captcha', false)"
                  @focus="showInputClear('captcha', true)"
                  v-model="form.captcha"
                  lazy-rules
                  :rules="[ val => val.length >= 5 || captchaError]"
                /> -->
              </div>
              <!-- <div>
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
          </div>
        </div>
      </div>
      <div class="action">
        <router-link :to="{name: 'login'}" class="back">
          <span>{{backToLogin}}</span>
        </router-link>
        <link-btn-2 :text="submitText" @click="toRegister"/>
      </div>

    </div>
  </div>
</template>

<script>
import { registerUser, setSubscribe } from './../api/api'
import { checkEmail } from './../utils/validation'
import linkBtn2 from './../components/ui/Button2'
import recaptcha from './../components/help/RecaptchaSt'

export default {
  name: 'create',
  components: {
    'link-btn-2': linkBtn2,
    recaptcha
  },
  data () {
    return {
      form: {
        lastname: '',
        firstname: '',
        email: '',
        is_subscribed: false,
        password: '',
        confirmpwd: '',
        captcha: ''
      },
      captchaUrl: '',
      sessionId: '',
      captchaloaded: false,
      isPwd: true,
      isConfirmPwd: true,
      metaDescription: '',
      metaKeywords: '',
      isAgree: false,
      clearable: {
        lastname: false,
        firstname: false,
        email: false,
        password: false,
        confirmpwd: false,
        captcha: false
      }
    }
  },
  meta () {
    return {
      // sets document title
      title: this.registerLinkText,
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
    registerLinkText: function () {
      return this.$i18n.t('$common.$buttons.createAccount')
    },
    firstName: function () {
      return `*${this.$i18n.t('$common.$labels.firstName')}`
    },
    lastName: function () {
      return `*${this.$i18n.t('$common.$labels.lastName')}`
    },
    inputEmail: function () {
      return `*${this.$i18n.t('$common.$labels.emailAddr')}`
    },
    subscribeCheckbox: function () {
      return this.$i18n.t('$common.subscribeCheckboxCheckout', { siteName: this.$i18n.t('$local.siteName') })
    },
    inputPWD: function () {
      return `*${this.$i18n.t('$common.$labels.password')}`
    },
    inputConfirmPWD: function () {
      return `*${this.$i18n.t('$common.$labels.passwordConfirm')}`
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    agreeTips: function () {
      return this.$i18n.t('$common.agreeWith_1')
    },
    agreeTips2: function () {
      return this.$i18n.t('$common.agreeWith_2', { siteName: this.$i18n.t('$local.siteName') })
    },
    generalSalesConditions: function () {
      return this.$i18n.t('$common.$labels.termsAndConditions')
    },
    and: function () {
      return this.$i18n.t('$common.and')
    },
    privacyPolicy: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    personalInfo: function () {
      return this.$i18n.t('$common.$labels.personalInfo')
    },
    loginInfo: function () {
      return this.$i18n.t('$common.$headings.loginInfo')
    },
    backToLogin: function () {
      return this.$i18n.t('$common.$buttons.backToLogin')
    },
    firstNameError: function () {
      return this.$i18n.t('$common.$validation.firstNameError')
    },
    lastNameError: function () {
      return this.$i18n.t('$common.$validation.lastNameError')
    },
    emailAddressRequired: function () {
      return this.$i18n.t('$common.$validation.emailAddressRequired')
    },
    emailErrorTips: function () {
      return this.$i18n.t('$common.$validation.emailErrorTips')
    },
    curPWDRequired: function () {
      return this.$i18n.t('$common.$validation.curPWDRequired')
    },
    pwdErrorTips: function () {
      return this.$i18n.t('$common.$validation.pwdErrorTips')
    },
    confirmPWDRequired: function () {
      return this.$i18n.t('$common.$validation.confirmPWDRequired')
    },
    ensureBothPWDMatch: function () {
      return this.$i18n.t('$common.$validation.ensureBothPWDMatch')
    },
    readAndAgree: function () {
      return this.$i18n.t('$common.readAndAgree', { siteName: this.$i18n.t('$local.siteName') })
    },
    termsUrl: function () {
      return this.$i18n.t('$common.$urls.terms')
    },
    privacyUrl: function () {
      return this.$i18n.t('$common.$urls.privacy')
    }
  },
  methods: {
    toRegister () {
      this.$refs.firstname.validate()
      this.$refs.lastname.validate()
      this.$refs.email.validate()
      this.$refs.password.validate()
      this.$refs.confirmPassword.validate()
      this.$refs.captcha.validate()
      if (this.$refs.firstname.hasError || this.$refs.lastname.hasError || this.$refs.email.hasError || this.$refs.password.hasError || this.$refs.confirmPassword.hasError || this.$refs.captcha.hasError) {
        return false
      }
      if (!this.isAgree) {
        let msg = this.readAndAgree
        this.msgAlert(msg)
        return false
      }
      this.register()
    },
    register () {
      let formdata = {
        firstname: this.form.firstname,
        lastname: this.form.lastname,
        email: this.form.email,
        password: this.form.password,
        // captcha: this.captcha,
        captcha: this.$refs.captcha.token,
        form_token: 'register'
      }
      registerUser(formdata).then(data => {
        console.log(data)
        this.sessionId = data.session_id
        this.loginSuccess()
        if (this.form.is_subscribed) {
          this.regSubscribe()
        }
      }).catch(error => {
        console.log(error)
        let msg = this.$i18n.t(error)
        this.msgAlert(msg)
      })
    },
    regSubscribe () {
      let formdata = {
        email: this.form.email,
        source: 'footer'
      }
      setSubscribe(formdata).then(data => {
        this.$q.notify({
          message: this.$i18n.t('$local.subscriptionSuccess'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      }).catch(e => {
        console.log(e)
      })
    },
    msgAlert (msg) {
      this.$q.notify({
        message: msg,
        position: 'center',
        timeout: '3000',
        classes: 'notify'
      })
    },
    intiCaptcha () {
      setTimeout(() => {
        console.log('register intiCaptcha', this.$refs)
        // this.$refs.captcha.loaded()
      }, 1000)
    //   let formdata = {
    //     form_token: 'register'
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
    loginSuccess () {
      if (this.sessionId) {
        this.$q.cookies.set('PHPSESSID', this.sessionId, { path: '/' })
      }
      if (this.form.email) {
        this.$q.cookies.set('email', this.form.email, { path: '/' })
      }
      if (this.form.firstname) {
        this.$q.cookies.set('firstname', this.form.firstname, { path: '/' })
      }
      if (this.form.lastname) {
        this.$q.cookies.set('lastname', this.form.lastname, { path: '/' })
      }
      this.$q.cookies.set('isLogin', '1', { path: '/' })
      if (this.$q.sessionStorage.has('afterLoginToPage')) {
        let toPage = this.$q.sessionStorage.getItem('afterLoginToPage')
        let toPageRouter = JSON.parse(toPage)
        if (toPageRouter.name) {
          this.$router.push(toPageRouter)
        } else {
          this.$router.push({ name: 'orderList' })
        }
      } else {
        this.$router.push({ name: 'orderList' })
      }
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
.register-page {
  padding-top: 3%;
  padding-bottom: 72px;
}
.register-block {
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
  padding: 2%;
  margin: 0;
  background: $borderColor;
  letter-spacing: 0;
  font-size: 1em;
  text-transform: uppercase;
  font-family: $typography-main-heading;
}
.register-form {
  &.form-left {
    padding-right: 2.5%;
  }
  &.form-right {
    padding-left: 2.5%;
  }
}
.content {
  padding: 3%;
  border: 1px solid $borderColor;
  margin-top: 0;
}
.field-label {
  margin: 0;
}
.captcha-block {
  margin-bottom: 20px;
  position: relative;
  .refresh {
    position: absolute;
    right: 0;
    bottom: 0;
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
.term {
  font-size: 14px;
}
.link {
  text-decoration: underline;
}

@media screen and (min-width: 661px) {
  .row {
    &.register {
      & > .col-12 {
        width: 50% !important;
      }
    }
  }
}

@media screen and (max-width: 660px) {
  .register-page {
    padding-top: 5%;
    padding-bottom: 122px;
  }
  .register-block {
    padding: 3% 3% 0;
  }
  h1 {
    font-size: 34px;
    line-height: 30px;
    letter-spacing: 0.1px;
  }
  .register-form {
    padding-top: 3%;
    &.form-left {
      padding-right: 0;
    }
    &.form-right {
      padding-left: 0;
    }
  }
}

@media screen and (max-width: 599px) {
  .captcha-block {
    width: 100%;
  }
}
</style>
