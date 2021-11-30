<template>
  <div class="customer">
    <h2>{{ customerHeading }}</h2>
    <div class="h2-content">
      <div class="login" @click="goLogin">{{ toSigninTips }}
        <span class="link">{{ toLogin }}</span>
      </div>
      <div>
        <div class="field login">
          <q-input
            ref="email"
            square
            outlined
            :clearable="email && clearable.email"
            clear-icon="icon-close"
            @blur="showInputClear('email', false)"
            @focus="showInputClear('email', true)"
            bg-color="white"
            standout="bg-white text-black"
            v-model="email"
            :label="emailPlaceholder"
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || emailAddressRequired,
              checkFormEmail
            ]"
          />
        </div>
        <template v-if="isEu">
          <div class="field checkbox">
            <q-checkbox v-model="needRegister" />{{ toRegisterEu }}
          </div>
          <!-- Enable Email sign-up on checkout only -->
          <div class="field checkbox">
            <q-checkbox v-model="is_subscribed"/><span>{{subscribeCheckbox}}<span class="link" @click="showSubscribeTerms = true" @mouseover="showSubscribeTerms = true">{{subscribeCheckbox_2}}</span></span>
          </div>
        </template>
        <template v-else>
          <div class="field checkbox cn-register-checkbox">
            <q-checkbox dense v-model="needRegister" />
            <div>
              {{ toRegister }}
              <router-link class="link" :to="{name: 'help', params: { note: 'sales-conditions'}}" target="_blank">{{conditions}}</router-link>
              {{and}}
              <router-link class="link" :to="{name: 'help', params: { note: 'privacy-statement'}}" target="_blank">{{privacyPolicy}}</router-link>*
            </div>
          </div>
        </template>
        <div v-show="showRegister" class="register-area">
          <div class="field">
            <q-input
              ref="password"
              outlined
              square
              dense
              :clearable="password && clearable.password"
              clear-icon="icon-close"
              @blur="showInputClear('password', false)"
              @focus="showInputClear('password', true)"
              bg-color="white"
              standout="bg-white text-black"
              :type="isPwd ? 'password' : 'text'"
              v-model="password"
              :label="inputPWD"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || pwdErrorTips,
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
          <div class="field">
            <q-input
              ref="confirmPassword"
              outlined
              square
              dense
              :clearable="confirmPassword && clearable.confirmPassword"
              clear-icon="icon-close"
              @blur="showInputClear('confirmPassword', false)"
              @focus="showInputClear('confirmPassword', true)"
              bg-color="white"
              standout="bg-white text-black"
              :type="isConfirmPwd ? 'password' : 'text'"
              v-model="confirmPassword"
              :label="inputConfirmPWD"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || confirmPWDRequired,
                val => val.length >= 6 && password === confirmPassword || ensureBothPWDMatch
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
        </div>
      </div>
    </div>
    <q-dialog seamless v-model="showSubscribeTerms" id="subscribeTermsDialog">
      <q-card>
        <q-btn class="close" icon="icon-close" flat dense v-close-popup  />
        <q-card-section>
          <p>{{mohgSubscriptionTerms_1}}</p>
          <p v-html="mohgSubscriptionTerms_2"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkEmail } from './../../utils/validation'
export default {
  name: 'customer',
  data () {
    return {
      email: '',
      needRegister: false,
      agree: false,
      password: '',
      confirmPassword: '',
      isPwd: true,
      isConfirmPwd: true,
      is_subscribed: false,
      clearable: {
        email: false,
        password: false,
        confirmPassword: false
      },
      showSubscribeTerms: false
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
    subscribeCheckbox_2: function () {
      return this.$i18n.t('$common.subscribeCheckboxCheckout_2', { siteName: this.$i18n.t('$local.siteName') })
    },
    mohgSubscriptionTerms_1: function () {
      return this.$i18n.t('$local.mohgSubscriptionTerms_1')
    },
    mohgSubscriptionTerms_2: function () {
      return this.$i18n.t('$local.mohgSubscriptionTerms_2')
    },
    customerHeading: function () {
      return this.$i18n.t('$common.$headings.customerInfo')
    },
    toSigninTips: function () {
      return this.$i18n.t('$common.toSignin')
    },
    toLogin: function () {
      return this.$i18n.t('$common.$buttons.logIn')
    },
    emailPlaceholder: function () {
      return `${this.$i18n.t('$common.$labels.emailAddr')} *`
    },
    brand: function () {
      return this.$i18n.t('$local.siteName')
    },
    toRegister: function () {
      return this.$i18n.t('$common.toRegister2')
    },
    and: function () {
      return this.$i18n.t('$common.and')
    },
    conditions: function () {
      return this.$i18n.t('$common.$labels.termsAndConditions')
    },
    privacyPolicy: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    toRegisterEu: function () {
      return this.$i18n.t('$common.$labels.createAccountCheckbox')
    },
    inputPWD: function () {
      return this.$i18n.t('$common.$labels.password')
    },
    inputConfirmPWD: function () {
      return this.$i18n.t('$common.$labels.passwordConfirm')
    },
    showRegister: function () {
      return this.needRegister
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
    }
  },
  watch: {
    needRegister: function (newValue, oldValue) {
      // console.log(newValue, this.agree, this.lang)
      this.$emit('checkNeedRegister', newValue)
    },
    email: function (newVal, oldVal) {
      this.$emit('changeEmail', newVal)
    }
  },
  methods: {
    agreeTerm (status) {
      this.agree = status
      if (!status) {
        this.needRegister = false
      }
    },
    goLogin () {
      this.$emit('showLogin', true)
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    },
    checkForm () {
      this.$refs.email.validate()
      if (this.$refs.email.hasError) {
        return false
      } else {
        if (this.showRegister) {
          this.$refs.password.validate()
          this.$refs.confirmPassword.validate()
          if (this.$refs.password.hasError || this.$refs.confirmPassword.hasError) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      }
    }
  },
  created () {
    if (this.$q.sessionStorage.has('checkoutEmail')) {
      this.email = this.$q.sessionStorage.getItem('checkoutEmail')
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  &.login {
    margin: 0;
  }
  &.checkbox {
    margin-bottom: 0;
    line-height: 33px;
  }
  &.cn-register-checkbox {
    display: flex;
    .q-checkbox {
      margin: 5px 7px 0 0;
      align-items: start;
    }
  }
}
.h2-content {
  padding: 3%;
  background: $white;
  margin: 0 0 1em;
  border: 1px solid $borderColor;
}
.login {
  cursor: pointer;
  margin-bottom: 10px;
  // padding: 10px;
}
.link {
  text-decoration: underline;
  cursor: pointer;
}
.checkbox {
  font-size: 14px;
}
.register-area {
  margin-top: 1em;
}
#subscribeTermsDialog {
  .close {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 9;
  }
  .q-card__section {
    font-size: 16px;
    padding-top: 35px;
  }
}
</style>
