<template>
  <div :class="['luckydraw-form' , formPosition]">
    <div class="field">
      <q-input
        filled
        square
        :clearable="firstName && clearable.firstName"
        clear-icon="icon-close"
        @blur="showInputClear('firstName', false)"
        @focus="showInputClear('firstName', true)"
        dense
        v-model="firstName"
        :label="firstNameLabel"
      />
    </div>
    <div class="field">
      <q-input
        filled
        square
        :clearable="lastName && clearable.lastName"
        clear-icon="icon-close"
        @blur="showInputClear('lastName', false)"
        @focus="showInputClear('lastName', true)"
        dense
        v-model="lastName"
        :label="lastNameLabel"
      />
    </div>
    <div class="field">
      <q-input
        filled
        square
        :clearable="email && clearable.email"
        clear-icon="icon-close"
        @blur="showInputClear('email', false)"
        @focus="showInputClear('email', true)"
        dense
        v-model="email"
        :label="emailLabel"
      />
    </div>
    <div class="action">
      <q-btn unelevated color="primary" class="submit" :label="submitText" @click="toSubmit" />
    </div>
  </div>
</template>

<script>
import { luckyDraw } from './../../api/api'
import { checkLength, checkEmail } from './../../utils/validation'
export default {
  data () {
    return {
      code: '',
      firstName: '',
      lastName: '',
      email: '',
      clearable: {
        firstName: false,
        lastName: false,
        email: false
      }
    }
  },
  props: {
    position: {
      type: String,
      default: 'right'
    }
  },
  computed: {
    firstNameLabel: function () {
      return this.$i18n.t('$common.$labels.firstName')
    },
    lastNameLabel: function () {
      return this.$i18n.t('$common.$labels.lastName')
    },
    emailLabel: function () {
      return this.$i18n.t('$common.$labels.emailAddr')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    successInfo: function () {
      return this.$i18n.t('luckydrawSuccess')
    },
    errorInfo: function () {
      return this.$i18n.t('luckydrawError')
    },
    firstNameError: function () {
      return this.$i18n.t('$common.$validation.firstNameError')
    },
    lastNameError: function () {
      return this.$i18n.t('$common.$validation.lastNameError')
    },
    emailError: function () {
      return this.$i18n.t('$common.$validation.emailErrorTips')
    },
    formPosition: function () {
      if (this.position) {
        if (this.position === 'left') {
          return 'form-left'
        } else if (this.position === 'right') {
          return 'form-right'
        } else {
          return 'normal'
        }
      } else {
        return 'normal'
      }
    }
  },
  methods: {
    toSubmit () {
      if (!checkLength(this.firstName, 1, 20)) {
        let msg = this.firstNameError
        this.returnMsg(msg)
        return false
      }
      if (!checkLength(this.lastName, 1, 20)) {
        let msg = this.lastNameError
        this.returnMsg(msg)
        return false
      }
      if (!checkEmail(this.email)) {
        let msg = this.emailError
        this.returnMsg(msg)
        return false
      }
      if (!this.code) {
        return false
      }
      let formdata = {
        firstname: this.firstName,
        lastname: this.lastName,
        email: this.email,
        code: this.code
      }
      luckyDraw(formdata).then(data => {
        console.log(data)
        let msg = this.successInfo
        this.returnMsg(msg)
        this.resetForm()
      }).catch(error => {
        console.log(error)
        let msg = this.errorInfo
        this.returnMsg(msg)
      })
    },
    returnMsg (msg) {
      this.$q.notify({
        message: msg,
        position: 'center',
        timeout: '3000',
        classes: 'notify'
      })
    },
    resetForm () {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    }
  },
  created () {
    this.code = this.$route.params.code || this.code
  }
}
</script>

<style lang="scss" scoped>
.luckydraw-form {
  min-width: 320px;
  padding: 16px;
  background: rgba(255,255,255,0.8);
}
.action {
  display: flex;
  justify-content: flex-end;
}
.form-left,
.form-right {
  position: absolute;
  top: 10%;
}
.form-left {
  left: 5%;
}
.form-right {
  right: 5%;
}
</style>
