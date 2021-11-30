<template>
  <div class="login">
    <div class="login-block">
      <h1>{{ loginHeading }}</h1>
      <div class="row justify-between register">
        <div class="col-12">
          <div class="register-form form-left">
            <h2>{{newCustomers}}</h2>
            <div class="content">
              <p class="register-tips">{{ registerTips }}</p>
              <router-link :to="{name: 'register'}" class="link-to-register">
                <link-btn-2 :text="registerLinkText" color="white" />
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="register-form form-right">
            <h2>
              {{registeredCustomers}}
            </h2>
            <div class="content">
              <p>{{ signinTips }}</p>
              <p class="field-label">{{inputEmail}}</p>
              <div class="field">
                <q-input
                  ref="username"
                  square
                  dense
                  outlined
                  bg-color="white"
                  :clearable="form.username && clearable.username"
                  clear-icon="icon-close"
                  @blur="showInputClear('username', false)"
                  @focus="showInputClear('username', true)"
                  v-model="form.username"
                  autoComplete="off"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || emailAddressRequired,
                    checkFormEmail
                  ]"
                />
              </div>
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
                  :type="isPwd ? 'password' : 'text'"
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
                <p><router-link :to="{name: 'forgetpwd' }" class="forget-pwd">{{ forgetPWDLink }}</router-link></p>
              </div>
            </div>
            <div class="action">
              <link-btn-2 :text="signinBtn" @click="toSignin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { SessionStorage } from 'quasar'
import { signIn } from './../api/api'
import { checkEmail } from './../utils/validation'
// import linkBtn from './../components/ui/Button'
import linkBtn2 from './../components/ui/Button2'
export default {
  name: 'Login',
  components: {
    // 'link-btn': linkBtn,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      isPwd: true,
      form: {
        username: '',
        password: ''
      },
      accept: false,
      sessionId: '',
      firstName: '',
      lastName: '',
      email: '',
      metaDescription: '',
      metaKeywords: '',
      clearable: {
        username: false,
        password: false
      }
    }
  },
  meta () {
    return {
      // sets document title
      title: this.loginHeading,
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
    loginHeading: function () {
      return this.$i18n.t('$common.$headings.loginHeading')
    },
    newCustomers: function () {
      return this.$i18n.t('$common.$headings.newCustomers')
    },
    registeredCustomers: function () {
      return this.$i18n.t('$common.$headings.registeredCustomers')
    },
    registerTips: function () {
      return this.$i18n.t('$common.registerTips')
    },
    registerLinkText: function () {
      return this.$i18n.t('$common.$buttons.createAccount')
    },
    signinTips: function () {
      return this.$i18n.t('$common.signinTips')
    },
    inputEmail: function () {
      return '* ' + this.$i18n.t('$common.$labels.emailAddr')
    },
    inputPWD: function () {
      return '* ' + this.$i18n.t('$common.$labels.password')
    },
    signinBtn: function () {
      return this.$i18n.t('$common.$buttons.logIn')
    },
    forgetPWDLink: function () {
      return this.$i18n.t('$common.$buttons.forgetPWDLink')
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
    loginResponseError: function () {
      return this.$i18n.t('$common.$validation.loginResponseError')
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setHasLoginSuccess',
        'getFaviList'
      ]
    ),
    toSignin () {
      this.$refs.username.validate()
      this.$refs.password.validate()
      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        return false
      }
      this.toLogin()
    },
    toLogin () {
      let formdata = this.form
      signIn(formdata).then(data => {
        console.log(data)
        this.sessionId = data.session_id
        this.email = data.email
        this.firstName = data.firstname
        this.lastName = data.lastname
        this.loginSuccess()
      }).catch(error => {
        console.log(error)
        if (error === 'already login') {
          this.$router.push({ name: 'orderList' })
        } else {
          // this.msgAlert(error)
          let msg = this.loginResponseError
          this.msgAlert(msg)
        }
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
    loginSuccess () {
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
      this.setHasLoginSuccess(true)
      this.getFaviList()
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
  beforeRouteEnter (to, from, next) {
    let toPage = {
      name: from.name,
      params: from.params,
      query: from.query
    }
    if (from.name && from.name !== 'login' && from.name !== 'setPassword' && from.name !== 'register' && from.name !== 'forgetpwd') {
      SessionStorage.set('afterLoginToPage', JSON.stringify(toPage))
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding-top: 3%;
  padding-bottom: 72px;
}
.login-block {
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
  letter-spacing: 0.2em;
  line-height: 24px;
}
.register-form {
  &.form-left {
    padding-right: 2.5%;
    .content {
      min-height: 195px;
    }
  }
  &.form-right {
    padding-left: 2.5%;
  }
}
.content {
  padding: 3%;
  border: 1px solid $borderColor;
  margin-top: 0px;
}
.register-tips {
  margin: 0 0 1em;
  line-height: 1.1;
}
.link-to-register {
  padding: 22px 20px 22px 0;
  display: flex;
  justify-content: flex-start;
}
.field-label {
  margin: 0;
}
.action {
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  padding: 20px 0 0;
}
.forget-pwd {
  display: inline-block;
  float: right;
  font-size: 14px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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
  .login {
    padding-top: 5%;
    padding-bottom: 122px;
  }
  .login-block {
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

@media screen and (max-width: 400px) {
  .forget-pwd {
    font-size: 12px;
  }
}
</style>
