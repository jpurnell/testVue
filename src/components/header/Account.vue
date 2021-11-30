<template>
  <div :class="['account-panel', isLogin ? 'has-login-panel' : '']">
    <span class="icon-close" :class="[showSecondClose ? '' : 'mob-only']" @click="toggleAccountMenu"></span>
    <!-- If Login Area -->
    <div v-show="!isShowRegisterDialog && !isShowForgetPwdDialog">
      <div v-if="isLogin" @click="toggleAccountMenu">
        <h4>{{ dashboard }}</h4>
        <p><router-link :to="{name: 'orderList'}" class="account_li">{{ allOrders }}</router-link></p>
        <p><router-link :to="{name: 'wishlist'}" class="account_li">{{ likeList }}</router-link></p>
        <p><router-link :to="{name: 'edit'}" class="account_li">{{ accountSet }}</router-link></p>
        <p><router-link :to="{name: 'addressList'}" class="account_li">{{ addressManage }}</router-link></p>
        <p><router-link :to="{name: 'logout'}" class="account_li logout">{{ loginOut }}</router-link></p>
      </div>
      <div v-else>
        <h4 class="login-heading">{{ loginHeading }}</h4>
        <!-- <p class="name">{{ email2 }}*</p> -->
        <div class="col-12">
          <q-input
            ref="username"
            square
            outlined
            bg-color="white"
            :clearable="loginForm.username && clearable.username"
            clear-icon="icon-close"
            @blur="showInputClear('username', false)"
            @focus="showInputClear('username', true)"
            type="email"
            name="emailLogin"
            :label="email2+'*'"
            v-model="loginForm.username"
            autoComplete="username"
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || emailAddressRequired,
              checkFormEmail
            ]"
          />
        </div>
        <!-- <p class="name"><label for="passwordLogin">{{ inputPWD }}*</label></p> -->
        <div class="col-12">
          <q-input
            ref="password"
            square
            outlined
            bg-color="white"
            :clearable="loginForm.password && clearable.password"
            clear-icon="icon-close"
            @blur="showInputClear('password', false)"
            @focus="showInputClear('password', true)"
            :type="isPwd ? 'password' : 'text'"
            v-model="loginForm.password"
            name="passwordLogin"
            :label="inputPWD+'*'"
            autoComplete="current-password"
            @keyup.enter="toSignin"
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
        <div class="col-12 required-fields">
          <span>* {{requiredFields}}</span>
        </div>
        <div class="error" v-if="isShowLoginResponseError">{{loginResponseError}}</div>
        <div class="row rf">
          <q-space />
          <span @click="showForgetPwdDialog(true)" class="show-forget-pwd">{{ forgetPWDLink }}</span>
        </div>
        <div class="action">
          <link-btn-2 :extraClass="'btn-login'" :text="signinBtn" @click="toSignin" />
          <div v-show="!isCheckoutPage" @click="showRegisterDialog(true)" class="show-register">{{ registerLinkText }}</div>
        </div>
      </div>
    </div>
    <!-- If Register Panel -->
    <div class="register-panel-wrapper" v-show="isShowRegisterDialog">
        <register-panel
          :isMobile="isMobile"
          :email="loginForm.username"
          :password="loginForm.password"
          @closeRegisterDialog="closeRegisterDialog"
          @checkLogin="checkLogin"
        />
    </div>
    <div class="register-panel-wrapper" v-show="isShowForgetPwdDialog">
      <forget-pwd-panel
        :isMobile="isMobile"
        @closeForgetPwdDialog="closeForgetPwdDialog"/>
    </div>
  </div>
</template>

<script>
import { signIn } from './../../api/api'
import { checkEmail } from './../../utils/validation'
import notify from './../../mixins/Notify'
import registerPanel from './RegisterPanel'
import forgetPwdPanel from './ForgetPwdPanel'
import linkBtn2 from './../ui/Button2'
import { mapActions } from 'vuex'
export default {
  name: 'Account',
  components: {
    'register-panel': registerPanel,
    'forget-pwd-panel': forgetPwdPanel,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      isLogin: false,
      isPwd: true,
      isShowRegisterDialog: false,
      isShowForgetPwdDialog: false,
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      sessionId: '',
      firstName: '',
      lastName: '',
      email: '',
      clearable: {
        username: false,
        password: false
      },
      isShowLoginResponseError: false,
      showSecondClose: false
    }
  },
  props: {
    switchAccount: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    forgetPWDLink: function () {
      return this.$i18n.t('$common.$buttons.forgetPWDLink')
    },
    signinBtn: function () {
      return this.$i18n.t('$common.$buttons.logIn')
    },
    registerLinkText: function () {
      return this.$i18n.t('$common.$buttons.createAccount')
    },
    loginResponseError: function () {
      return this.$i18n.t('$common.$validation.loginResponseError')
    },
    loginHeading: function () {
      if (this.isMobile || this.isCheckoutPage) {
        return this.$i18n.t('$common.$buttons.logIn')
      } else {
        return this.$i18n.t('$common.$headings.loginHeading')
      }
    },
    isCheckoutPage: function () {
      return this.$route.name === 'checkout'
    },
    email2: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    inputPWD: function () {
      return this.$i18n.t('$common.$labels.password')
    },
    rememberMe: function () {
      return this.$i18n.t('$common.$labels.rememberMe')
    },
    dashboard: function () {
      return this.$i18n.t('$common.$labels.myAccount')
    },
    allOrders: function () {
      return this.$i18n.t('$common.$labels.orders')
    },
    likeList: function () {
      return this.$i18n.t('$common.$labels.wishlist')
    },
    accountSet: function () {
      return this.$i18n.t('$common.$headings.settings')
    },
    addressManage: function () {
      return this.$i18n.t('$common.$labels.addresses')
    },
    loginOut: function () {
      return this.$i18n.t('$common.$buttons.logOut')
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
    loginSuccessText: function () {
      return this.$i18n.t('$common.$validation.loginSuccess')
    },
    requiredFields: function () {
      return this.$i18n.t('$common.$labels.requiredFields')
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.loginForm = {
        username: '',
        password: '',
        remember: false
      }
    },
    switchAccount: function (newVal, oldVal) {
      if (newVal) {
        this.initAccount()
        this.headerNotInViewport()
      }
    },
    // Update 'persistent' state of Account dialog (fixes recaptcha issue)
    isShowRegisterDialog: function (newVal, oldVal) {
      if (newVal) {
        this.$emit('setSecondaryAcctDialogOpen', true)
      } else {
        this.$emit('setSecondaryAcctDialogOpen', false)
      }
    },
    isShowForgetPwdDialog: function (newVal, oldVal) {
      if (newVal) {
        this.$emit('setSecondaryAcctDialogOpen', true)
      } else {
        this.$emit('setSecondaryAcctDialogOpen', false)
      }
    }
  },
  mixins: [notify],
  methods: {
    ...mapActions(
      'site',
      [
        'getFaviList'
      ]
    ),
    initAccount () {
      this.checkLogin()
    },
    checkLogin () {
      this.isLogin = parseInt(this.$q.cookies.get('isLogin'), 10) === 1 || false
    },
    showRegisterDialog (status) {
      this.isShowRegisterDialog = status
    },
    showForgetPwdDialog (status) {
      this.isShowForgetPwdDialog = status
    },
    toSignin () {
      this.isShowLoginResponseError = false
      this.$refs.username.validate()
      this.$refs.password.validate()
      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        return false
      }
      this.toLogin()
    },
    toLogin () {
      let formdata = this.loginForm
      signIn(formdata).then(data => {
        // console.log(data)
        this.sessionId = data.session_id
        this.email = data.email
        this.firstName = data.firstname
        this.lastName = data.lastname
        this.is_subscribe = data.is_subscribe
        this.loginSuccess()
      }).catch(error => {
        console.log(error)
        if (error === 'already login') {
          this.loginSuccess()
        } else {
          // let msg = this.loginResponseError
          // this.msgAlert(msg)
          this.isShowLoginResponseError = true
        }
      })
    },
    loginSuccess () {
      this.msgAlert(this.loginSuccessText)
      if (this.sessionId) {
        this.$q.cookies.set('PHPSESSID', this.sessionId, { path: '/' })
      }
      if (this.email) {
        this.$q.cookies.set('email', this.email, { path: '/' })
      }
      if (this.firstName) {
        this.$q.cookies.set('firstname', this.firstName, { path: '/' })
      }
      if (this.lastName) {
        this.$q.cookies.set('lastname', this.lastName, { path: '/' })
      }
      if (this.is_subscribe) {
        this.$q.cookies.set('is_subscribe', this.is_subscribe, { path: '/' })
      }
      this.$q.cookies.set('isLogin', '1', { path: '/' })
      this.isLogin = true
      this.getFaviList()
      this.$emit('hasLogin')
    },
    closeRegisterDialog () {
      this.isShowRegisterDialog = false
    },
    closeForgetPwdDialog () {
      this.isShowForgetPwdDialog = false
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    },
    toggleAccountMenu () {
      // console.log('toggleAccountMenu')
      this.closeRegisterDialog()
      this.closeForgetPwdDialog()
      this.$emit('toggleAccountMenu')
    },
    headerNotInViewport () {
      try {
        const header = document.querySelector('header')
        const position = Math.abs(header.getBoundingClientRect().top)
        const headerHeight = header.offsetHeight
        // console.log('headerNotInViewport', position, headerHeight, position > headerHeight)
        if (position > headerHeight) {
          // this.showSecondClose = true
          this.showSecondClose = false
        } else {
          this.showSecondClose = false
        }
      } catch { }
    }
  },
  created () {
    this.initAccount()
  }
}
</script>

<style lang="scss" scoped>
.rf {
  margin-top: 10px;
  .show-forget-pwd {
    font-size: 14px;
    padding-bottom: 0;
  }
}
.action {
  margin: 1em 0 0;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 400px) {
    flex-direction: column;
    > p,
    > div {
      width: 100%;
    }
  }
}
.account_li {
  &:hover {
    text-decoration: underline;
  }
}
.error {
  line-height: 1.2em;
  color: #c10015;
}
.show-forget-pwd,
.show-register {
  cursor: pointer;
  text-transform: uppercase;
}
.show-register {
  font-size: 0.875em;
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  &:after {
    display: inline-block;
    content: '';
    width: 0;
    transform: rotate(-45deg);
    transform-origin: 75% 75%;
    transition: transform 0.5s ease;
    border-width: 0 0.8px 0.8px 0;
    border-style: solid;
    padding: 4px;
    position: relative;
    top: -4px;
    right: -4px;
  }
}
.dialog-backdrop {
  position: fixed;
  background: rgba(30,30,30,0.85);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 100vw;
  max-height: 100vh;
  z-index: 0;
}
.required-fields {
  text-align: right;
  font-size: 12px;
  margin-bottom: 15px;
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
}
.checkout-login > div {
  @media screen and (min-width: 660px) {
    max-width: 500px;
    margin: 0 auto;
  }
}
.login-heading {
  margin-bottom: 20px;
}
.col-12 {
  margin-bottom: 7px;
}
@media screen and ($bp-768) {
  .submit {
    width: 100%;
    margin-top: 30px;
  }
  .show-register {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.pgcheckout .show-register {
  display: none;
}
</style>
