<template>
  <div>
    <div v-show="showEInvoiceForm">
      <div class="">
        <p class="title">{{ businessName }} *</p>
        <q-input
          ref="fapiaoName"
          square
          dense
          outlined
          :clearable="fapiao_business_name && clearable.fapiao_business_name"
          clear-icon="icon-close"
          @blur="showInputClear('fapiao_business_name', false)"
          @focus="showInputClear('fapiao_business_name', true)"
          v-model="fapiao_business_name"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormFapiaoName]"
        />
      </div>
      <div class="">
        <p class="title">{{ USCC }} *</p>
        <q-input
          ref="fapiaoTaxId"
          square
          dense
          outlined
          :clearable="fapiao_rad_tax_id && clearable.fapiao_rad_tax_id"
          clear-icon="icon-close"
          @blur="showInputClear('fapiao_rad_tax_id', false)"
          @focus="showInputClear('fapiao_rad_tax_id', true)"
          v-model="fapiao_rad_tax_id"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormFapiaoTaxIdRequired, checkFormFapiaoTaxId]"
        />
      </div>
    </div>
    <slot name="otherfields"></slot>
  </div>
</template>

<script>
import { removeSpace, checkInvoiceCode } from './../../utils/validation'
export default {
  data () {
    return {
      fapiao_business_name: '',
      fapiao_rad_tax_id: '',
      clearable: {
        fapiao_business_name: false,
        fapiao_rad_tax_id: false
      }
    }
  },
  props: {
    showEInvoiceForm: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    businessName: function () {
      return this.$i18n.t('$common.$labels.businessName')
    },
    USCC: function () {
      return this.$i18n.t('USCC')
    },
    inputRequired: function () {
      return this.$i18n.t('$common.$validation.inputRequired')
    },
    fapiaoNameError: function () {
      return this.$i18n.t('Please enter a valid company name.')
    },
    fapiaoTaxIdRequired: function () {
      return this.$i18n.t('Please enter a valid Unified Social Credit Code.')
    },
    fapiaoTaxIdError: function () {
      return this.$i18n.t('$common.$validation.taxId')
    }
  },
  watch: {
    fapiao_business_name: function (newVal, oldVal) {
      this.$emit('eBusinessNameChange', newVal)
    },
    fapiao_rad_tax_id: function (newVal, oldVal) {
      this.$emit('eUSCCChange', newVal)
    }
  },
  methods: {
    initSelector () {
      if (this.$q.sessionStorage.has('checkoutInvoice')) {
        let invoice = this.$q.sessionStorage.getItem('checkoutInvoice')
        if (invoice.fapiao_type === '0') {
          if (invoice.fapiao_title || invoice.tax_code) {
            this.fapiao_business_name = invoice.fapiao_title
            this.fapiao_rad_tax_id = invoice.tax_code
          }
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
    checkForm () {
      this.$refs.fapiaoName.validate()
      this.$refs.fapiaoTaxId.validate()
      if (this.$refs.fapiaoName.hasError || this.$refs.fapiaoTaxId.hasError) {
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
