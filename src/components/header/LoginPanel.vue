<template>
  <div>
    <h2 class="title">{{ loginHeading }}</h2>
    <p>{{ signinTips }}</p>
    <p class="name">{{ email2 }}*</p>
    <div class="field">
      <q-input
        ref="username"
        square
        outlined
        :clearable="loginForm.username && clearable.username"
        clear-icon="icon-close"
        @blur="showInputClear('username', false)"
        @focus="showInputClear('username', true)"
        bg-color="grey-1"
        standout="bg-grey-2"
        type="text"
        v-model="loginForm.username"
        autoComplete="off"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || emailAddressRequired,
          checkFormEmail
        ]"
      />
    </div>
    <p class="name">{{ inputPWD }}*</p>
    <div class="field">
      <q-input
        ref="password"
        square
        outlined
        :clearable="loginForm.password && clearable.password"
        clear-icon="icon-close"
        @blur="showInputClear('password', false)"
        @focus="showInputClear('password', true)"
        bg-color="grey-1"
        standout="bg-grey-2"
        :type="isPwd ? 'password' : 'text'"
        v-model="loginForm.password"
        autoComplete="off"
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
    <div class="row rf">
      <q-space />
      <span @click="showForgetPwd" class="show-forget-pwd">{{ forgetPWDLink }}</span>
    </div>
    <div class="action">
      <link-btn-2 :extraClass="'loginBtn'" :text="signinBtn" @click="toSignin" />
      <link-btn-2 :text="registerLinkText" color="white" @click="showRegister" class="show-register" />
    </div>
  </div>
</template>

<script>
import { signIn } from './../../api/api'
import { checkEmail } from './../../utils/validation'
import notify from './../../mixins/Notify'
import linkBtn2 from './../ui/Button2'
import { mapActions } from 'vuex'

export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      isLogin: false,
      isPwd: true,
      userPanel: 'login',
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
      }
    }
  },
  computed: {
    forgetPWDLink: function () {
      return this.$i18n.t('$common.$buttons.forgetPWDLink')
    },
    signinBtn: function () {
      return this.$i18n.t('$common.$buttons.logIn')
    },
    signinTips: function () {
      return this.$i18n.t('$common.signinTips')
    },
    registerLinkText: function () {
      return this.$i18n.t('$common.$buttons.createAccount')
    },
    loginResponseError: function () {
      return this.$i18n.t('$common.$validation.loginResponseError')
    },
    loginHeading: function () {
      return this.$i18n.t('$common.$headings.loginHeading')
    },
    email2: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    inputPWD: function () {
      return this.$i18n.t('$common.$labels.password')
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
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.loginForm = {
        username: '',
        password: '',
        remember: false
      }
      if (this.$refs.username) {
        this.$refs.username.resetValidation()
      }
      if (this.$refs.password) {
        this.$refs.password.resetValidation()
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
    showRegister () {
      this.$emit('showPanel', 'register')
    },
    showForgetPwd () {
      this.$emit('showPanel', 'forgetpwd')
    },
    toSignin () {
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
        this.loginSuccess()
      }).catch(error => {
        console.log(error)
        if (error === 'already login') {
          this.loginSuccess()
        } else {
          let msg = this.loginResponseError
          this.msgAlert(msg)
        }
      })
    },
    loginSuccess () {
      this.msgAlert(this.$i18n.t('$common.$validation.loginSuccess'))
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
      this.$q.cookies.set('isLogin', '1', { path: '/' })
      this.isLogin = true
      this.getFaviList()
      this.$emit('hasLogin')
      this.$emit('hideRightDrawer')
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    }
  }
}
</script>

<style lang="scss" scoped>
.rf {
  margin-bottom: 1em;
}
.name {
  margin: 0;
}
.show-forget-pwd {
  border-bottom: 1px solid;
  cursor: pointer;
}
.action {
  display: flex;
  flex-direction: column;
  .link-btn {
    width: 100%;
    margin-bottom: 1em;
  }
}
.loginBtn {
  margin-bottom: 20px;
}
</style>
