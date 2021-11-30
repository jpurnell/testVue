<template>
  <div class="setnewpwd-page">
    <div class="setnewpwd-block">
      <h1>{{ setNewPassword }}</h1>
      <div class="setnewpwd-form">
        <div class="content">
          <p class="field-label">{{newPWD}}</p>
          <div class="field">
            <q-input
              ref="password"
              square
              dense
              outlined
              bg-color="white"
              :clearable="newPwd && clearable.newPwd"
              clear-icon="icon-close"
              @blur="showInputClear('newPwd', false)"
              @focus="showInputClear('newPwd', true)"
              :type="isPwd ? 'password' : 'text'"
              v-model="newPwd"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || curPWDRequired,
                val => val.length >= 6 || pwdErrorTips
              ]"
              autocomplete="off"
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
              :clearable="confirmPwd && clearable.confirmPwd"
              clear-icon="icon-close"
              @blur="showInputClear('confirmPwd', false)"
              @focus="showInputClear('confirmPwd', true)"
              :type="isConfirmPwd ? 'password' : 'text'"
              v-model="confirmPwd"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || confirmPWDRequired,
                val => val.length >= 6 && newPwd === confirmPwd || ensureBothPWDMatch
              ]"
              autocomplete="off"
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
        </div>
        <div class="action">
          <link-btn-2 :text="submitText" @click="submit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setPassword } from './../api/api'
import linkBtn2 from './../components/ui/Button2'
export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      isPwd: true,
      isConfirmPwd: true,
      newPwd: '',
      confirmPwd: '',
      id: '',
      token: '',
      metaDescription: '',
      metaKeywords: '',
      clearable: {
        newPwd: false,
        confirmPwd: false
      }
    }
  },
  meta () {
    return {
      // sets document title
      title: this.setNewPassword,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('siteTitle')}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  computed: {
    newPWD: function () {
      return this.$i18n.t('$common.$labels.newPWD')
    },
    inputConfirmPWD: function () {
      return this.$i18n.t('$common.$labels.passwordConfirm')
    },
    curPWDRequired: function () {
      return this.$i18n.t('$common.$validation.newPWDRequired')
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
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    setNewPassword: function () {
      return this.$i18n.t('$common.$buttons.changePWD')
    },
    setNewPasswordSuccess: function () {
      return this.$i18n.t('$common.$validation.pwdSaveSuccess')
    }
  },
  methods: {
    checkToken () {
      let formdata = {
        customer_id: this.id,
        token: this.token,
        new_password: ''
      }
      this.resetPassword(formdata)
    },
    submit () {
      this.$refs.password.validate()
      this.$refs.confirmPassword.validate()
      if (this.$refs.password.hasError || this.$refs.confirmPassword.hasError) {
        return false
      }
      let formdata = {
        customer_id: this.id,
        token: this.token,
        new_password: this.newPwd
      }
      this.resetPassword(formdata)
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
    resetPassword (formdata) {
      setPassword(formdata).then(data => {
        console.log(data)
        this.msgAlert(this.setNewPasswordSuccess)
        this.$router.replace({ name: 'login' })
      }).catch(e => {
        console.log(e)
        if (e === 'wrong customer data') {

        } else {
          if (e === 'Reset password token mismatch.' || e === 'Your password reset link has expired.') {
            this.msgAlert(this.$i18n.t('$common.$validation.passwordResetLinkExpired'))
            this.$router.replace({ name: 'forgetpwd' })
          } else {
            this.msgAlert(this.$i18n.t(e))
          }
        }
      })
    }
  },
  created () {
    this.id = this.$route.query.id || ''
    this.token = this.$route.query.token || ''
    if (!this.id || !this.token) {
      this.$router.replace({ name: 'login' })
    } else {
      this.checkToken()
    }
  }
}
</script>

<style lang="scss" scoped>
// $
.setnewpwd-page {
  padding-top: 3%;
  padding-bottom: 72px;
}
.setnewpwd-block {
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
.content {
  padding: 3%;
  margin-top: 0;
  background: $brandgrey1;
}
.field-label {
  margin: 0;
}
.action {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  padding: 20px 0 0;
}

@media screen and (max-width: 660px) {
  .setnewpwd-page {
    padding-top: 5%;
    padding-bottom: 122px;
  }
  .setnewpwd-block {
    padding: 3% 5% 0;
  }
  h1 {
    font-size: 34px;
    line-height: 30px;
    letter-spacing: 0.1px;
  }
}
</style>
