<template>
  <div>
    <div v-show="showVatInvoiceForm">
      <div class="">
        <p class="title">{{ businessName }} *</p>
        <q-input
          ref="fapiaoName"
          square
          dense
          outlined
          :clearable="vatBusinessName && clearable.vatBusinessName"
          clear-icon="icon-close"
          @blur="showInputClear('vatBusinessName', false)"
          @focus="showInputClear('vatBusinessName', true)"
          v-model="vatBusinessName"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormFapiaoName]"
        />
      </div>
      <div class="">
        <p class="title">{{ taxId }} *</p>
        <q-input
          ref="fapiaoTaxId"
          square
          dense
          outlined
          :clearable="vatTaxId && clearable.vatTaxId"
          clear-icon="icon-close"
          @blur="showInputClear('vatTaxId', false)"
          @focus="showInputClear('vatTaxId', true)"
          v-model="vatTaxId"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormFapiaoTaxIdRequired, checkFormFapiaoTaxId]"
        />
      </div>
      <div class="">
        <p class="title">{{ registeredAddress }} *</p>
        <q-input
          ref="registeredAddress"
          square
          dense
          outlined
          :clearable="vatRegisteredAddress && clearable.vatRegisteredAddress"
          clear-icon="icon-close"
          @blur="showInputClear('vatRegisteredAddress', false)"
          @focus="showInputClear('vatRegisteredAddress', true)"
          v-model="vatRegisteredAddress"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormRegisteredAddress]"
        />
      </div>
      <div class="">
        <p class="title">{{ registeredPhone }} *</p>
        <q-input
          ref="registeredPhone"
          square
          dense
          outlined
          :clearable="vatRegisteredPhone && clearable.vatRegisteredPhone"
          clear-icon="icon-close"
          @blur="showInputClear('vatRegisteredPhone', false)"
          @focus="showInputClear('vatRegisteredPhone', true)"
          v-model="vatRegisteredPhone"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormRegisteredPhone]"
        />
      </div>
      <div class="">
        <p class="title">{{ bankName }} *</p>
        <q-input
          ref="bankName"
          square
          dense
          outlined
          :clearable="vatBankName && clearable.vatBankName"
          clear-icon="icon-close"
          @blur="showInputClear('vatBankName', false)"
          @focus="showInputClear('vatBankName', true)"
          v-model="vatBankName"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormBankNameRequired, checkFormBankName]"
        />
      </div>
      <div class="">
        <p class="title">{{ bankAccount }} *</p>
        <q-input
          ref="bankAccount"
          square
          dense
          outlined
          :clearable="vatBankAccount && clearable.vatBankAccount"
          clear-icon="icon-close"
          @blur="showInputClear('vatBankAccount', false)"
          @focus="showInputClear('vatBankAccount', true)"
          v-model="vatBankAccount"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormBankAccountRequired, checkFormBankAccount]"
        />
      </div>
    </div>
    <slot name="otherfields"></slot>
  </div>
</template>

<script>
import { removeSpace, checkInvoiceCode, checkChina, checkNumber } from './../../utils/validation'
export default {
  data () {
    return {
      vatBusinessName: '',
      vatTaxId: '',
      vatRegisteredAddress: '',
      vatRegisteredPhone: '',
      vatBankName: '',
      vatBankAccount: '',
      clearable: {
        vatBusinessName: false,
        vatTaxId: false,
        vatRegisteredAddress: false,
        vatRegisteredPhone: false,
        vatBankName: false,
        vatBankAccount: false
      }
    }
  },
  props: {
    showVatInvoiceForm: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    businessName: function () {
      return this.$i18n.t('$common.$labels.businessName')
    },
    taxId: function () {
      return this.$i18n.t('$common.$labels.taxId')
    },
    registeredAddress: function () {
      return this.$i18n.t('$common.$labels.registeredAddress')
    },
    registeredPhone: function () {
      return this.$i18n.t('$common.$labels.registeredPhone')
    },
    bankName: function () {
      return this.$i18n.t('$common.$labels.bankName')
    },
    bankAccount: function () {
      return this.$i18n.t('$common.$labels.bankAccount')
    },
    fapiaoNameError: function () {
      return this.$i18n.t('Please enter a valid company name.')
    },
    fapiaoTaxIdRequired: function () {
      return this.$i18n.t('$common.$validation.taxIdEmpty')
    },
    fapiaoTaxIdError: function () {
      return this.$i18n.t('$common.$validation.taxId')
    },
    registeredAddressError: function () {
      return this.$i18n.t('Please enter a valid registered office address.')
    },
    registeredPhoneError: function () {
      return this.$i18n.t('Please enter a valid registered phone number.')
    },
    bankNameRequired: function () {
      return this.$i18n.t('Please enter a valid bank name.')
    },
    bankNameError: function () {
      return this.$i18n.t('Please enter in Chinese.')
    },
    bankAccountRequired: function () {
      return this.$i18n.t('$common.$validation.bankAccount')
    },
    bankAccountError: function () {
      return this.$i18n.t('Please use numbers only in this field. Please avoid spaces or other characters such as dots or commas.')
    }
  },
  watch: {
    vatBusinessName: function (newVal, oldVal) {
      this.$emit('vatBusinessNameChange', newVal)
    },
    vatTaxId: function (newVal, oldVal) {
      this.$emit('vatTaxIdChange', newVal)
    },
    vatRegisteredAddress: function (newVal, oldVal) {
      this.$emit('vatRegisteredAddressChange', newVal)
    },
    vatRegisteredPhone: function (newVal, oldVal) {
      this.$emit('vatRegisterPhoneChange', newVal)
    },
    vatBankName: function (newVal, oldVal) {
      this.$emit('vatBankNameChange', newVal)
    },
    vatBankAccount: function (newVal, oldVal) {
      this.$emit('vatBankAccountChange', newVal)
    }
  },
  methods: {
    initSelector () {
      if (this.$q.sessionStorage.has('checkoutInvoice')) {
        let invoice = this.$q.sessionStorage.getItem('checkoutInvoice')
        if (invoice.fapiao_type === '1') {
          this.vatBusinessName = invoice.fapiao_title
          this.vatTaxId = invoice.tax_code
          this.vatRegisteredAddress = invoice.address
          this.vatRegisteredPhone = invoice.phone
          this.vatBankName = invoice.bank
          this.vatBankAccount = invoice.account
        }
      }
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    checkFormFapiaoName (val) {
      return removeSpace(val) !== '' || this.fapiaoNameError
    },
    checkFormFapiaoTaxIdRequired (val) {
      return removeSpace(val) !== '' || this.fapiaoTaxIdRequired
    },
    checkFormFapiaoTaxId (val) {
      return checkInvoiceCode(val) || this.fapiaoTaxIdError
    },
    checkFormRegisteredAddress (val) {
      return removeSpace(val) !== '' || this.registeredAddressError
    },
    checkFormRegisteredPhone (val) {
      return removeSpace(val) !== '' || this.registeredPhoneError
    },
    checkFormBankNameRequired (val) {
      return removeSpace(val) !== '' || this.bankNameRequired
    },
    checkFormBankName (val) {
      return checkChina(val) || this.bankNameError
    },
    checkFormBankAccountRequired (val) {
      return removeSpace(val) !== '' || this.bankAccountRequired
    },
    checkFormBankAccount (val) {
      return checkNumber(val) || this.bankAccountError
    },
    checkForm () {
      this.$refs.fapiaoName.validate()
      this.$refs.fapiaoTaxId.validate()
      this.$refs.registeredAddress.validate()
      this.$refs.registeredPhone.validate()
      this.$refs.bankName.validate()
      this.$refs.bankAccount.validate()
      if (this.$refs.fapiaoName.hasError || this.$refs.fapiaoTaxId.hasError || this.$refs.registeredAddress.hasError || this.$refs.registeredPhone.hasError || this.$refs.bankName.hasError || this.$refs.bankAccount.hasError) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.initSelector()
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  margin: 10px 0 8px 0;
  color: #51555a;
}
</style>
