<template>
  <div class="container clearfix faq">
    <h1>{{heading}}</h1>
    <!-- <div v-if="isDialogShow" class="lt-sm row items-center title">
      <div class="text-h6 q-pl-sm">{{ fillEmail }}</div>
      <q-space />
      <q-btn class="close" icon="icon-close" flat :round="false" dense v-close-popup  />
    </div> -->
    <template v-if="!posted">
      <p class="tips" v-html="tips"></p>
      <div class="form">
        <div class="field-line">
          <p class="name">{{ firstNameLabel }}*</p>
          <div class="field-box">
            <q-input
              ref="firstname"
              name="contactUsName"
              :label="firstNameLabel+'*'"
              square
              dense
              outlined
              :clearable="firstName && clearable.firstName"
              clear-icon="icon-close"
              @blur="showInputClear('firstName', false)"
              @focus="showInputClear('firstName', true)"
              v-model="firstName"
              lazy-rules
              :rules="[ val => !!val || firstNameError]"
            />
          </div>
        </div>
        <div class="field-line">
          <p class="name">{{ lastNameLabel }}*</p>
          <div class="field-box">
            <q-input
              ref="lastname"
              name="contactUsLastName"
              :label="lastNameLabel+'*'"
              square
              dense
              outlined
              :clearable="lastName && clearable.lastName"
              clear-icon="icon-close"
              @blur="showInputClear('lastName', false)"
              @focus="showInputClear('lastName', true)"
              v-model="lastName"
              lazy-rules
              :rules="[ val => !!val || lastNameError]"
            />
          </div>
        </div>
        <div class="field-line">
          <p class="name">{{ emailLabel }}*</p>
          <div class="field-box">
            <q-input
              ref="email"
              name="contactUsEmail"
              :label="emailLabel+'*'"
              square
              dense
              outlined
              :clearable="email && clearable.email"
              clear-icon="icon-close"
              @blur="showInputClear('email', false)"
              @focus="showInputClear('email', true)"
              v-model="email"
              lazy-rules
              :rules="[
                val => !!val || emailAddressRequired,
                checkFormEmail
              ]"
            />
          </div>
        </div>
        <div class="field-line">
          <p class="name">{{ telephoneLabel }}*</p>
          <div class="field-box">
            <q-input
              ref="phone"
              name="contactUsPhone"
              :label="telephoneLabel+'*'"
              square
              dense
              outlined
              :clearable="phone && clearable.phone"
              clear-icon="icon-close"
              @blur="showInputClear('phone', false)"
              @focus="showInputClear('phone', true)"
              v-model="phone"
              lazy-rules
              :rules="[checkFormPhone]"
            />
          </div>
        </div>
        <div class="field-line">
          <p class="name">{{subjectLabel}}*</p>
          <div class="field-box">
            <q-select
              ref="subject"
              name="contactUsSubject"
              class="contactUsSubject"
              use-input
              square
              dense
              outlined
              v-model="subject"
              :options="subjectOptions"
              option-value="value"
              :option-label="opt => opt.value"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => !!val || subjectError]"
              :label="optionsLabel"
            />
          </div>
        </div>
        <div class="field-line comment-block">
          <p class="name">{{ commentLabel }}*</p>
          <div class="field-box">
            <q-input
              ref="comment"
              name="contactUsComment"
              :label="commentLabel+'*'"
              square
              dense
              outlined
              :clearable="comment && clearable.comment"
              clear-icon="icon-close"
              @blur="showInputClear('comment', false)"
              @focus="showInputClear('comment', true)"
              v-model="comment"
              type="textarea"
              class="no-border"
              maxlength="500"
              lazy-rules
              :rules="[ val => !!val.replace(/ /g, '') || commentError]"
            />
          </div>
        </div>
        <div class="field-line">
          <p class="name"></p>
          <div class="field-box captcha-box">
            <recaptcha ref="captcha" />
          </div>
        </div>
        <div class="action">
          <link-btn-2 :text="submitText" color="black" @click="submitContent" />
        </div>
        <div class="disclaimer"><p>{{disclaimer}}</p></div>
      </div>
    </template>
    <template v-else>
      <p>{{contactusPostedTips}}</p>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { contactUs } from './../../api/api'
import { checkEmail, checkPhone } from './../../utils/validation'
import linkBtn2 from './../ui/Button2'
import recaptcha from './RecaptchaSt'
export default {
  components: {
    'link-btn-2': linkBtn2,
    recaptcha
  },
  props: {
    isDialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      subjectOptions: [
        {
          value: this.$i18n.t('$common.$labels.$contactOptions.information')
        },
        {
          value: this.$i18n.t('$common.$labels.$contactOptions.help')
        },
        {
          value: this.$i18n.t('$common.$labels.$contactOptions.returns')
        },
        {
          value: this.$i18n.t('$common.$labels.$contactOptions.feedback')
        },
        {
          value: this.$i18n.t('$common.$labels.$contactOptions.other')
        }
      ],
      comment: '',
      captcha: '',
      form_token: '',
      captchaUrl: '',
      captchaloaded: false,
      clearable: {
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        subject: false,
        comment: false,
        captcha: false
      },
      posted: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.heading,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    heading: function () {
      return this.$i18n.t('$common.$headings.contactus')
    },
    tips: function () {
      return this.$i18n.t('$common.contactusTips', { siteName: this.$i18n.t('$local.siteName') })
    },
    firstNameLabel: function () {
      return this.$i18n.t('$common.$labels.firstName')
    },
    lastNameLabel: function () {
      return this.$i18n.t('$common.$labels.lastName')
    },
    emailLabel: function () {
      return this.$i18n.t('$common.$labels.email')
    },
    telephoneLabel: function () {
      return this.$i18n.t('$common.$labels.telephone')
    },
    subjectLabel: function () {
      return this.$i18n.t('$common.$labels.subject')
    },
    commentLabel: function () {
      return this.$i18n.t('$common.$labels.comment')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    customerName: function () {
      return `${this.firstName} ${this.lastName}`
    },
    contactusPostedTips: function () {
      return this.$i18n.t('$common.$validation.contactusPostedTips')
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
    phoneError: function () {
      return this.$i18n.t('$common.$validation.telephoneError')
    },
    subjectError: function () {
      return this.$i18n.t('$common.$validation.selectOption')
    },
    commentError: function () {
      return this.$i18n.t('$common.$validation.emptyMessage')
    },
    disclaimer: function () {
      return this.$i18n.t('$common.contactUsDisclaimer', { siteName: this.$i18n.t('$local.siteName') })
    },
    optionsLabel: function () {
      return this.$i18n.t('$common.$labels.$contactOptions.label')
    }
  },
  methods: {
    submitContent () {
      this.$refs.firstname.validate()
      this.$refs.lastname.validate()
      this.$refs.email.validate()
      this.$refs.phone.validate()
      this.$refs.subject.validate()
      this.$refs.comment.validate()
      this.$refs.captcha.validate()
      if (this.$refs.firstname.hasError || this.$refs.lastname.hasError || this.$refs.email.hasError || this.$refs.phone.hasError || this.$refs.subject.hasError || this.$refs.comment.hasError || this.$refs.captcha.hasError) {
        return false
      }
      let formdata = {
        customer_name: this.customerName,
        customer_phone: this.phone,
        subject: this.subject,
        customer_email: this.email,
        customer_comment: this.comment,
        // captcha: this.captcha,
        captcha: this.$refs.captcha.token,
        form_token: 'contactus'
      }
      contactUs(formdata).then(data => {
        // this.msgAlert(this.$i18n.t('$common.$validation.success'))
        let _this = this
        setTimeout(() => {
          _this.$emit('afterSubmit')
        }, 8000)
        this.posted = true
        if (typeof window !== 'undefined') {
          window.scroll(0, 0)
        }
      }).catch(e => {
        console.log(e)
        this.msgAlert(this.$i18n.t('$common.$validation.wrongCaptcha'))
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
    // intiCaptcha () {
    //   let formdata = {
    //     form_token: 'contactus'
    //   }
    //   this.captchaloaded = true
    //   getCaptcha(formdata).then(data => {
    //     console.log(data)
    //     this.captchaUrl = data.captcha
    //     this.captchaloaded = false
    //   }).catch(e => {
    //     console.log(e)
    //   })
    // },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormEmail (val) {
      return checkEmail(val) || this.emailErrorTips
    },
    checkFormPhone (val) {
      return checkPhone(val) || this.phoneError
    }
  },
  created () {
    this.posted = false
    // this.intiCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 3% 0;
}
.field-line {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  overflow: hidden;
}
.name {
  width: 200px;
  padding: 11px 8px 0 0;
  margin: 0;
  font-size: 16px;
}
.field-box {
  width: 400px;
}
.comment-block {
  margin-bottom: 20px;
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
.captcha-box {
  padding-bottom: 20px;
}
.action {
  width: 300px;
  margin: 8px 0 0 200px;
  width: 400px;
  .link-btn-2 {
    width: 100%;
  }
}
.disclaimer {
  padding: 50px 40px 0 0;
}
@media screen and (max-width: 960px) {
  .field-line {
    flex-direction: column;
  }
  .field-box {
    width: 100%;
  }
  .name {
    width: 100%;
    padding: 0;
  }
  .action {
    width: 100%;
    margin: 8px 0;
  }
}
@media screen and (max-width: 599px) {
  .close {
    position: absolute;
    top: 0;
    right: 0;
    background: #242323;
    color: #fff;
  }
}
</style>

<style lang="scss">
.tips {
  br {
    content: '';
    margin-bottom: 10px;
    display: block;
  }
}
.faq .field-box {
  .q-field--outlined {
    .q-field__control {
      &:before {
        border: 1px solid #000;
      }
    }
  }
  .q-field__bottom--animated {
    @media screen and (min-width: 960px) {
      width: 200%;
    }
  }
  .q-textarea.q-field--dense .q-field__native:focus {
    border: 0;
  }
  .q-field {
    .q-field__label {
      display: none;
    }
  }
  .q-field--labeled.q-field--dense .q-field__native, .q-field--labeled.q-field--dense .q-field__prefix, .q-field--labeled.q-field--dense .q-field__suffix {
    padding-top: 7px;
  }
  .q-field.q-select {
    .q-field__label {
      display: block;
    }
    .q-field__control-container {
      cursor: pointer;
    }
    .q-field__control-container input[type="text"], .q-field__control-container input[type="textarea"], .q-field__control-container input[type="search"], .q-field__control-container input[type="tel"], .q-field__control-container input[type="email"] {
      display: none;
    }
  }
}
</style>
