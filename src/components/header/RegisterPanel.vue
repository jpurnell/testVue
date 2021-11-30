<template>
  <div :class="['register-panel', lang]">
    <!-- <q-btn class="close" icon="icon-close" flat dense v-close-popup  /> -->
      <h4>{{ registerLinkText }}</h4>
      <!-- <p class="name"><label for="createAccountEmail">{{ email2 }}*</label></p> -->
      <div class="col-12 input">
        <q-input
          ref="email"
          square
          outlined
          :clearable="form.email && clearable.email"
          clear-icon="icon-close"
          @blur="showInputClear('email', false)"
          @focus="showInputClear('email', true)"
          bg-color="white"
          type="text"
          name="createAccountEmail"
          id="createAccountEmail"
          :label="email2+'*'"
          v-model="form.email"
          autoComplete="off"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || emailAddressRequired,
            checkFormEmail
          ]"
        />
      </div>
      <!-- <p class="name"><label for="createAccountPassword">{{ inputPWD }}*</label></p> -->
      <div class="col-12 input">
        <q-input
          ref="password"
          square
          outlined
          bg-color="white"
          :clearable="form.password && clearable.password"
          clear-icon="icon-close"
          @blur="showInputClear('password', false)"
          @focus="showInputClear('password', true)"
          :type="isPwd ? 'password' : 'text'"
          name="createAccountPassword"
          id="createAccountPassword"
          :label="inputPWD+'*'"
          v-model="form.password"
          autoComplete="off"
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
      <!-- <p class="name"><label for="createAccountConfirmPwd">{{ inputConfirmPWD }}*</label></p> -->
      <div class="col-12 input">
        <q-input
          ref="confirmPassword"
          square
          outlined
          bg-color="white"
          :clearable="form.confirmpwd && clearable.confirmpwd"
          clear-icon="icon-close"
          @blur="showInputClear('confirmpwd', false)"
          @focus="showInputClear('confirmpwd', true)"
          :type="isConfirmPwd ? 'password' : 'text'"
          name="createAccountConfirmPwd"
          id="createAccountConfirmPwd"
          :label="inputConfirmPWD+'*'"
          v-model="form.confirmpwd"
          autoComplete="off"
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
      <!-- Activate for EU Only -->
      <div class="col-12">
        <recaptcha ref="captcha" :id="'HeaderReg'" />
      </div>
      <!-- Activate for CN Only -->
      <!-- <p class="name">{{ inputCaptcha }}*</p>
      <div class="col-12">
        <q-input
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
          :rules="[
            val => val.length >= 5 || captchaError
          ]"
        />
      </div> -->
      <!-- Activate for CN only -->
      <!-- <div class="col-12">
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
      <!-- End Activate for CN only -->
      <div class="checkbox">
        <input
          v-model="isAgree"
          type="checkbox"
          name="createAccountAgreeTerms"
          id="createAccountAgreeTerms"
        />
        <label for="createAccountAgreeTerms">{{ agreeTips }}
        <router-link class="link" :to="{name: 'help', params: { note: termsUrl}}" target="_blank">{{generalSalesConditions}}</router-link>
        {{and}}
        <router-link class="link" :to="{name: 'help', params: { note: privacyUrl}}" target="_blank">{{privacyPolicy}}</router-link>
        {{ agreeTips2 }}*</label>
      </div>
      <!-- Disable Email sign-up, per MO Brand request -->
      <!-- <div class="checkbox">
        <input
          v-model="form.is_subscribed"
          type="checkbox"
          name="createAccountAgreeSubscribe"
          id="createAccountAgreeSubscribe"
        /><label for="createAccountAgreeSubscribe">{{subscribeCheckbox}}</label>
      </div> -->
      <div :class="['action', lang]">
        <link-btn-2 :text="cancelButtonText" color="white" @click="closeRegisterDialog" />
        <link-btn-2 :text="registeredText" @click="toRegister" />
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import notify from './../../mixins/Notify'
import { registerUser, setSubscribe } from './../../api/api'
// import { getCaptcha } from './../../api/api' // CN Captcha Method
import { checkEmail } from './../../utils/validation'
import linkBtn2 from './../ui/Button2'
import recaptcha from './../help/Recaptcha'
export default {
  components: {
    'link-btn-2': linkBtn2,
    recaptcha
  },
  data () {
    return {
      form: {
        lastname: '**',
        firstname: '*',
        email: '',
        is_subscribed: false,
        password: '',
        confirmpwd: '',
        captcha: ''
      },
      isPwd: true,
      isConfirmPwd: true,
      isAgree: false,
      sessionId: '',
      captchaUrl: '',
      captchaloaded: false,
      clearable: {
        email: '',
        password: '',
        confirmpwd: '',
        captcha: ''
      }
    }
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      isEu: state => state.site.isEU
    }),
    subscribeCheckbox: function () {
      return this.$i18n.t('$common.subscribeCheckboxCheckout', { siteName: this.$i18n.t('$local.siteName') })
    },
    registeredText: function () {
      return this.$i18n.t('$common.$buttons.register')
    },
    cancelButtonText: function () {
      return this.$i18n.t('$common.$buttons.cancel')
    },
    inputRequired: function () {
      return this.$i18n.t('$common.$validation.inputRequired')
    },
    registerLinkText: function () {
      return this.$i18n.t('$common.$buttons.createAccount')
    },
    email2: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    inputPWD: function () {
      return this.$i18n.t('$common.$labels.password')
    },
    inputConfirmPWD: function () {
      return this.$i18n.t('$common.$labels.passwordConfirm')
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
    },
    inputCaptcha: function () {
      return this.$i18n.t('$common.$labels.inputCaptcha')
    },
    captchaError: function () {
      return this.$i18n.t('$common.$validation.captchaError')
    }
  },
  watch: {
  },
  mixins: [notify],
  methods: {
    toRegister () {
      this.$refs.email.validate()
      this.$refs.password.validate()
      this.$refs.confirmPassword.validate()
      this.$refs.captcha.validate()
      if (this.$refs.email.hasError || this.$refs.password.hasError || this.$refs.confirmPassword.hasError || this.$refs.captcha.hasError) {
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
        captcha: this.$refs.captcha.token,
        form_token: 'register'
      }
      registerUser(formdata).then(data => {
        console.log(data)
        this.sessionId = data.session_id
        this.msgAlert(this.$i18n.t('$common.$validation.registerSuccess'))
        this.loginSuccess()
        if (this.form.is_subscribed) {
          this.regSubscribe()
        }
      }).catch(error => {
        console.log(error)
        let msg
        if (error === 'wrong customer data.') {
          msg = this.$i18n.t('$common.$validation.existingAccount')
        } else {
          msg = this.$i18n.t(error)
        }
        this.msgAlert(msg)
        this.intiCaptcha()
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
    intiCaptcha () {
      setTimeout(() => {
        console.log('register panel intiCaptcha', this.$refs)
        // this.$refs.captcha.loaded()
      }, 0)
      // let formdata = {
      //   form_token: 'register'
      // }
      // this.captchaloaded = true
      // getCaptcha(formdata).then(data => {
      //   console.log(data)
      //   this.captchaUrl = data.captcha
      //   this.captchaloaded = false
      // }).catch(e => {
      //   console.log(e)
      // })
      this.form.email = this.email
      this.form.password = this.password
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
      this.$emit('checkLogin')
      this.closeRegisterDialog()
    },
    closeRegisterDialog () {
      this.$emit('closeRegisterDialog')
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
.register-panel {
  width: 400px;
  padding: 0;
  border-radius: 0;
  background: none;
  margin-bottom: 50px;
  .col-12.input {
    margin-bottom: 7px;
  }
  h4 {
    margin-bottom: 20px;
  }
}
.captcha-block {
  position: relative;
  button {
    position: absolute;
    right: 20px;
  }
}
.checkbox {
  margin-top: 1em;
  color: $textcolor;
  font-size: 14px;
}
.link {
  text-decoration: underline;
}
.action {
  width: 100%;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  @media screen and ($bp-960) {
    margin-bottom: 120px;
  }
}
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  top: 5px;
  margin-right: 10px;
}
@media screen and (max-width: 599px) {
  .register-panel {
    width: 100%;
    padding: 0;
  }
  .captcha-block {
    text-align: right;
    .refresh {
      font-size: 10px;
    }
  }
}
</style>
