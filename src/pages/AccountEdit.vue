<template>
  <q-page>
    <q-resize-observer @resize="onResize" />
    <div ref="account" class="account-page clearfix">
      <account-block cur-tab="tab3" :title="accountSet"></account-block>
      <q-tabs class="tabs lt-sm" v-model="tab" align="justify" switch-indicator indicator-color="accent"  active-color="black" active-bg-color="white">
        <q-tab name="userInfo" :label="editAccountInfo" />
        <q-tab name="updatePwd" :label="changePWDCheckbox" />
      </q-tabs>
      <div class="faq">
        <!--<h2>{{ editAccountInfo }}</h2>-->
        <div class="row justify-between q-col-gutter-xl">
          <div v-show="!isMobileScreen || tab === 'userInfo'" :class="['account-info col-12', isChangePWD ? 'col-md-6' : '']">
            <h2 class="account-title gt-xs">{{ editAccountInfo }}</h2>
            <div class="row container">
              <p class="title">{{ firstNameLabel }}</p>
              <div class="col-12">
                <q-input
                  ref="firstname"
                  outlined
                  square
                  dense
                  :clearable="form.firstname && clearable.firstname"
                  clear-icon="icon-close"
                  @blur="showInputClear('firstname', false)"
                  @focus="showInputClear('firstname', true)"
                  v-model="form.firstname"
                  lazy-rules
                  :rules="[ val => !!val || firstNameError]"
                />
              </div>
              <p class="title">{{ lastNameLabel }}</p>
              <div class="col-12">
                <q-input
                  ref="lastname"
                  outlined
                  square
                  dense
                  :clearable="form.lastname && clearable.lastname"
                  clear-icon="icon-close"
                  @blur="showInputClear('lastname', false)"
                  @focus="showInputClear('lastname', true)"
                  v-model="form.lastname"
                  lazy-rules
                  :rules="[ val => !!val || lastNameError]"
                />
              </div>
              <p class="title">{{ inputEmail }}</p>
              <div class="col-12">
                <q-input
                  ref="email"
                  outlined
                  square
                  dense
                  :clearable="form.email && clearable.email"
                  clear-icon="icon-close"
                  @blur="showInputClear('email', false)"
                  @focus="showInputClear('email', true)"
                  v-model="form.email"
                  lazy-rules
                  :rules="[
                     val => !!val || emailAddressRequired,
                    checkFormEmail
                  ]"
                />
              </div>
              <!-- <div class="col-12">
                <p class="title">{{ subscribeTitle }}</p>
                <q-toggle v-model="is_subscribe" val="xl" color="black" :label="is_subscribe ? txtsubscribe : txtunsubscribe" />
              </div> -->
              <!--<div class="col-12 field" >
                <q-checkbox v-model="isChangePWD" :label="changePWDCheckbox" color="primary" dense />
              </div>-->
              <div class="action">
                <link-btn-2 :extraClass="'submit'" :text="submitText" @click="save" />
              </div>
            </div>
          </div>
          <div v-show="!isMobileScreen || tab === 'updatePwd'" class="change-password col-12 col-md-6">
            <h2 class="account-title gt-xs">{{ changePWDCheckbox }}</h2>
            <div class="row container">
              <p class="title">{{ oldPWD }}</p>
              <div class="col-12">
                <q-input
                  ref="currentPassword"
                  outlined
                  square
                  dense
                  :clearable="form.current_pwd && clearable.current_pwd"
                  clear-icon="icon-close"
                  @blur="showInputClear('current_pwd', false)"
                  @focus="showInputClear('current_pwd', true)"
                  :type="isOldPwd ? 'password' : 'text'"
                  v-model="form.current_pwd"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || curPWDRequired,
                    val => val.length >= 6 || pwdErrorTips
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isOldPwd ? 'icon-visibility_off' : 'icon-visibility'"
                      class="cursor-pointer"
                      @click="isOldPwd = !isOldPwd"
                    />
                  </template>
                </q-input>
              </div>
              <p class="title">{{ newPWD }}</p>
              <div class="col-12">
                <q-input
                  ref="newPassword"
                  outlined
                  square
                  dense
                  :clearable="form.pwd && clearable.pwd"
                  clear-icon="icon-close"
                  @blur="showInputClear('pwd', false)"
                  @focus="showInputClear('pwd', true)"
                  :type="isNewPwd ? 'password' : 'text'"
                  v-model="form.pwd"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || newPWDRequired,
                    val => val.length >= 6 || pwdErrorTips
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isNewPwd ? 'icon-visibility_off' : 'icon-visibility'"
                      class="cursor-pointer"
                      @click="isNewPwd = !isNewPwd"
                    />
                  </template>
                </q-input>
              </div>
              <p class="title">{{ confirmNewPWD }}</p>
              <div class="col-12">
                <q-input
                  ref="confirmPassword"
                  outlined
                  square
                  dense
                  :clearable="form.confirmation && clearable.confirmation"
                  clear-icon="icon-close"
                  @blur="showInputClear('confirmation', false)"
                  @focus="showInputClear('confirmation', true)"
                  :type="isConfirmPwd ? 'password' : 'text'"
                  v-model="form.confirmation"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || confirmPWDRequired,
                    val => val.length >= 6 && form.pwd === form.confirmation || ensureBothPWDMatch
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
              <div class="action">
                <link-btn-2 :extraClass="'submit'" :text="confirmChange" @click="updatePassword" />
              </div>
            </div>
          </div>
        </div>
        <!--<div class="action">
          <q-btn unelevated color="primary" class="submit" :label="submitText" @click="save" />
        </div>-->
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { updateProfile, changePassword } from './../api/api'
import { checkEmail, checkLength } from './../utils/validation'
import notify from './../mixins/Notify'
import Accountblock from '../components/AccountBlock'
import linkBtn2 from './../components/ui/Button2'
import { dom } from 'quasar'
const { width } = dom

export default {
  name: 'edit',
  components: {
    'account-block': Accountblock,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      tab: 'userInfo',
      isMobileScreen: false,
      isOldPwd: true,
      isNewPwd: true,
      isConfirmPwd: true,
      form: {
        firstname: '',
        lastname: '',
        email: '',
        current_pwd: '',
        pwd: '',
        confirmation: ''
      },
      isChangePWD: true,
      metaDescription: '',
      metaKeywords: '',
      clearable: {
        firstname: false,
        lastname: false,
        email: false,
        current_pwd: false,
        pwd: false,
        confirmation: false
      },
      is_subscribe: true
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
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
    ...mapState({
      fromStoreId: state => state.lang.fromStoreId
    }),
    title: function () {
      return `${this.accountSet} - ${this.$i18n.t('$common.$labels.myAccount')}`
    },
    accountSet: function () {
      return this.$i18n.t('$common.$headings.settings')
    },
    editAccountInfo: function () {
      return this.$i18n.t('$common.$labels.accountInfo')
    },
    firstNameLabel: function () {
      return `${this.$i18n.t('$common.$labels.firstName')}*`
    },
    lastNameLabel: function () {
      return `${this.$i18n.t('$common.$labels.lastName')}*`
    },
    inputEmail: function () {
      return `${this.$i18n.t('$common.$labels.emailAddr')}*`
    },
    changePWDCheckbox: function () {
      return this.$i18n.t('$common.$buttons.changePWD')
    },
    oldPWD: function () {
      return `${this.$i18n.t('$common.$labels.oldPWD')}*`
    },
    newPWD: function () {
      return `${this.$i18n.t('$common.$labels.newPWD')}*`
    },
    confirmNewPWD: function () {
      return `${this.$i18n.t('$common.$labels.confirmNewPWD')}*`
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
    pwdErrorTips: function () {
      return this.$i18n.t('$common.$validation.pwdErrorTips')
    },
    curPWDRequired: function () {
      return this.$i18n.t('$common.$validation.curPWDRequired')
    },
    newPWDRequired: function () {
      return this.$i18n.t('$common.$validation.newPWDRequired')
    },
    confirmPWDRequired: function () {
      return this.$i18n.t('$common.$validation.confirmPWDRequired')
    },
    ensureBothPWDMatch: function () {
      return this.$i18n.t('$common.$validation.ensureBothPWDMatch')
    },
    confirmPWDError: function () {
      return this.$i18n.t('$common.$validation.confirmPWDError')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.save')
    },
    confirmChange: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    actionSuccess: function () {
      return this.$i18n.t('$common.$validation.success')
    },
    pwdSaveSuccess: function () {
      return this.$i18n.t('$common.$validation.pwdSaveSuccess')
    },
    acountSaveSuccess: function () {
      return this.$i18n.t('$common.$validation.saveSuccess')
    },
    subscribeTitle: function () {
      return this.$i18n.t('$common.$labels.emailSubscription')
    },
    subscriptionMsg: function () {
      return this.$i18n.t('$common.subscriptionMsg')
    },
    txtunsubscribe: function () {
      return this.$i18n.t('$common.$labels.txtunsubscribe')
    },
    txtsubscribe: function () {
      return this.$i18n.t('$common.$labels.txtsubscribe')
    }
  },
  mixins: [notify],
  watch: {
    is_subscribe: function (val, oldVal) {
      console.log('is_subscribe', val, oldVal)
    }
  },
  methods: {
    save () {
      this.$refs.firstname.validate()
      this.$refs.lastname.validate()
      this.$refs.email.validate()
      if (this.$refs.firstname.hasError || this.$refs.lastname.hasError || this.$refs.email.hasError) {
        return false
      }
      let formdata = {
        'subscribe': this.is_subscribe
      }
      if (this.form.firstname) {
        formdata.firstname = this.form.firstname
      }
      if (this.form.lastname) {
        formdata.lastname = this.form.lastname
      }
      if (this.form.email) {
        formdata.email = this.form.email
      }
      if (Object.keys(formdata).length > 0) {
        updateProfile(formdata).then(data => {
          console.log(data)
          if (this.form.email) {
            this.$q.cookies.set('email', this.form.email, { path: '/' })
          }
          if (this.form.firstname) {
            this.$q.cookies.set('firstname', this.form.firstname, { path: '/' })
          }
          if (this.form.lastname) {
            this.$q.cookies.set('lastname', this.form.lastname, { path: '/' })
          }
          this.$q.cookies.set('is_subscribe', this.is_subscribe, { path: '/' })
          // if (!this.isChangePWD) {
          this.success(false)
          // }
        }).catch(e => {
          console.log(e)
          let msg = this.$i18n.t('$common.$validation.failed')
          this.msgAlert(msg)
        })
      }
      /*
      if (this.isChangePWD) {
        this.updatePassword()
      }
      */
    },
    updatePassword () {
      this.$refs.currentPassword.validate()
      this.$refs.newPassword.validate()
      this.$refs.confirmPassword.validate()
      if (this.$refs.currentPassword.hasError || this.$refs.newPassword.hasError || this.$refs.confirmPassword.hasError) {
        return false
      }
      let formdata = {
        email: this.form.email,
        old_password: this.form.current_pwd,
        password: this.form.pwd
      }
      changePassword(formdata).then(data => {
        console.log(data)
        this.pwdSuccess(true)
      }).catch(e => {
        console.log(e)
        let msg = e
        if (e === 'The password doesn\'t match this account.') {
          msg = this.$i18n.t('$common.$validation.invalidCurrentPassword')
        }
        this.msgAlert(msg)
      })
    },
    pwdSuccess (needLogout) {
      let msg = this.pwdSaveSuccess
      this.msgAlert(msg)
      // 重新登录
      if (needLogout) {
        this.$router.replace({ name: 'logout' })
      }
    },
    success (needLogout) {
      let msg = this.acountSaveSuccess
      this.msgAlert(msg)
      // 重新登录
      if (needLogout) {
        this.$router.replace({ name: 'logout' })
      }
    },
    onResize () {
      let screenWidth = this.getScreenWidth()
      if (screenWidth < 660) {
        this.isMobileScreen = true
      } else {
        this.isMobileScreen = false
      }
    },
    getScreenWidth () {
      let tag = this.$refs.account
      if (tag) {
        return width(tag)
      } else {
        return 1024
      }
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    },
    checkValueLength (val, minLength, maxLength) {
      return checkLength(val) || this.pwdErrorTips
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    }
  },
  created () {
    this.form.firstname = this.$q.cookies.get('firstname') || ''
    this.form.lastname = this.$q.cookies.get('lastname') || ''
    this.is_subscribe = this.$q.cookies.get('is_subscribe') || false
    if (this.form.firstname === '*') {
      this.form.firstname = ''
    }
    if (this.form.lastname === '**') {
      this.form.lastname = ''
    }
    this.form.email = decodeURIComponent(this.$q.cookies.get('email')) || ''
  }
}
</script>

<style lang="scss" scoped>
.row {
  .container {
    padding: 3%;
    border: 1px solid $borderColor;
  }
}
.item {
  display: flex;
  > div {
    display: block;
  }
}
.account-title {
  line-height: normal;
  padding: 2%;
  background: $borderColor;
  margin-bottom: 0;
  font-size: 1em;
  font-family: $typography-main-heading;
}
.title {
  font-size: 16px;
  margin: 10px 0 8px 0;
}
.action {
  width: 100%;
  .link-btn-2 {
    float: right;
    min-width: 200px;
  }
}
// fix mobile tab no clickable bug
.faq .q-col-gutter-xl {
  @media screen and ($bp-660) {
    margin-top: 0;
    .account-info,
    .change-password {
      margin-top: 0;
      padding-top: 0;
    }
  }
}
@media screen and (#{$bp-660}) {
  h2 {
    display: none;
  }
  .tabs {
    background: #eee;
    margin-top: 20px;
    a {
      border-right: 1px solid #fff;
    }
  }
}
</style>

<style lang="scss">
.q-tab__label {
  font-size: 16px;
  font-weight: 400;
}
.q-tab__indicator {
  height: 2px;
}
.q-tab--active {
  .q-focus-helper {
    opacity: 0 !important;
  }
}
.q-toggle__inner {
  width: 66px;
}
.q-toggle__track {
  height: 25px;
  border-radius: 50px;
}
.q-toggle__thumb,
.q-toggle__thumb-container {
  left: 15px !important;
  top: 15px !important;
}
.q-toggle__inner .q-toggle__thumb,
.q-toggle__inner--truthy .q-toggle__thumb:after {
  background-color: #fff;
  border-color: #fff;
}
.q-toggle__label {
  padding-top: 10px;
}

@media screen and (#{$bp-660}) {
  .q-tab__content {
    padding: 0;
  }
  .account-page {
    .q-tab__label {
      text-transform: capitalize;
    }
  }
}
</style>
