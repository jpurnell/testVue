<template>
  <q-page class="invoice">
    <div class="account-page">
      <account-block :tab="5"></account-block>
      <div class="main">
        <h2>{{ addNewInvoice }}</h2>
        <div class="row">
          <div class="col-12 col-sm-2">
            <q-tabs
              vertical
              v-model="tab"
              class="gt-xs text-primary"
            >
              <q-tab name="eFapiao" :label="eFapiao" />
              <q-tab name="vatFapiao" :label="vatFapiao" />
            </q-tabs>
            <q-tabs
              v-model="tab"
              class="lt-sm text-primary"
            >
              <q-tab name="eFapiao" :label="eFapiao" />
              <q-tab name="vatFapiao" :label="vatFapiao" />
            </q-tabs>
          </div>
          <div class="col-12 col-sm-10">
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="eFapiao">
                <h3>{{ eFapiao }}</h3>
                <div class="field">
                  <q-input
                    square
                    dense
                    outlined
                    :label="businessName"
                    v-model="form.fapiao_business_name"
                  />
                </div>
                <div class="field">
                  <q-input filled square :label="USCC" v-model="form.fapiao_rad_tax_id" dense/>
                </div>
                <div class="action">
                  <q-btn unelevated color="primary" class="submit" :label="submitText" @click="save" />
                </div>
              </q-tab-panel>
              <q-tab-panel name="vatFapiao">
                <h3>{{ vatTips }}</h3>
                <div class="field">
                  <q-input
                    square
                    dense
                    outlined
                    :label="businessName"
                    v-model="form.fapiao_vat_business_name"
                  />
                </div>
                <div class="field">
                  <q-input
                    square
                    dense
                    outlined
                    :label="taxId"
                    v-model="form.fapiao_vat_tax_id"
                  />
                </div>
                <div class="field">
                  <q-input
                    outlined
                    square
                    dense
                    :label="registeredAddress"
                    v-model="form.fapiao_vat_registered_address"
                  />
                </div>
                <div class="field">
                  <q-input
                    outlined
                    square
                    dense
                    :label="registeredPhone"
                    v-model="form.fapiao_vat_registered_phone"
                  />
                </div>
                <div class="field">
                  <q-input
                    outlined
                    square
                    dense
                    :label="bankName"
                    v-model="form.fapiao_vat_bank_name"
                  />
                </div>
                <div class="field">
                  <q-input
                    outlined
                    square
                    dense
                    :label="bankAccount"
                    v-model="form.fapiao_vat_bank_account"
                  />
                </div>
                <div class="action">
                  <q-btn unelevated color="primary" class="submit" :label="submitText" @click="save" />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { createInvoice } from './../api/api'
import { removeSpace, checkUSCC, checkTaxId } from './../utils/validation'
import notify from './../mixins/Notify'
import Accountblock from '../components/AccountBlock'
export default {
  name: 'invoice',
  components: {
    'account-block': Accountblock
  },
  data () {
    return {
      tab: 'eFapiao',
      form: {
        fapiao_business_name: '',
        fapiao_rad_tax_id: '',
        fapiao_vat_business_name: '',
        fapiao_vat_tax_id: '',
        fapiao_vat_registered_address: '',
        fapiao_vat_registered_phone: '',
        fapiao_vat_bank_name: '',
        fapiao_vat_bank_account: ''
      },
      title: '',
      metaDescription: '',
      metaKeywords: ''
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
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
    addNewInvoice: function () {
      return this.$i18n.t('addNewInvoice')
    },
    eFapiao: function () {
      return this.$i18n.t('eFapiao')
    },
    vatFapiao: function () {
      return this.$i18n.t('vatFapiao')
    },
    businessName: function () {
      return this.$i18n.t('businessName')
    },
    USCC: function () {
      return this.$i18n.t('USCC')
    },
    vatTips: function () {
      return this.$i18n.t('vatTips')
    },
    taxId: function () {
      return this.$i18n.t('taxId')
    },
    registeredAddress: function () {
      return this.$i18n.t('registeredAddress')
    },
    registeredPhone: function () {
      return this.$i18n.t('registeredPhone')
    },
    bankName: function () {
      return this.$i18n.t('bankName')
    },
    bankAccount: function () {
      return this.$i18n.t('bankAccount')
    },
    submitText: function () {
      return this.$i18n.t('save')
    },
    UsccError: function () {
      return this.$i18n.t('UsccError')
    },
    taxIdError: function () {
      return this.$i18n.t('taxIdError')
    },
    requireError: function () {
      return this.$i18n.t('requireError')
    },
    inputRequired: function () {
      return this.$i18n.t('inputRequired')
    }
  },
  mixins: [notify],
  methods: {
    save () {
      let formdata = {
        type: '',
        title: '',
        taxt_code: '',
        address: '',
        phone: '',
        bank: '',
        bank_account: ''
      }
      let msg = ''
      if (this.tab === 'eFapiao') {
        formdata.type = '0'
        formdata.title = this.form.fapiao_business_name
        formdata.taxt_code = this.form.fapiao_rad_tax_id
        if (!removeSpace(formdata.title)) {
          msg = `${this.requireError}${this.businessName}`
          this.msgAlert(msg)
          return false
        }
        if (!checkUSCC(formdata.taxt_code)) {
          msg = this.UsccError
          this.msgAlert(msg)
          return false
        }
      }
      if (this.tab === 'vatFapiao') {
        formdata.type = '1'
        formdata.title = this.form.fapiao_vat_business_name
        formdata.taxt_code = this.form.fapiao_vat_tax_id
        formdata.address = this.form.fapiao_vat_registered_address
        formdata.phone = this.form.fapiao_vat_registered_phone
        formdata.bank = this.form.fapiao_vat_bank_name
        formdata.bank_account = this.form.fapiao_vat_bank_account
        if (!removeSpace(formdata.title)) {
          msg = `${this.requireError}${this.businessName}`
          this.msgAlert(msg)
          return false
        }
        if (!checkTaxId(formdata.taxt_code)) {
          msg = this.taxIdError
          this.msgAlert(msg)
          return false
        }
        if (!removeSpace(formdata.address)) {
          msg = `${this.requireError}${this.registeredAddress}`
          this.msgAlert(msg)
          return false
        }
        if (!removeSpace(formdata.phone)) {
          msg = `${this.requireError}${this.registeredPhone}`
          this.msgAlert(msg)
          return false
        }
        if (!removeSpace(formdata.bank)) {
          msg = `${this.requireError}${this.bankName}`
          this.msgAlert(msg)
          return false
        }
        if (!removeSpace(formdata.bank_account)) {
          msg = `${this.requireError}${this.bankAccount}`
          this.msgAlert(msg)
          return false
        }
      }
      createInvoice(formdata).then(data => {
        console.log(data)
        this.$q.notify({
          message: this.$i18n.t('添加成功'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      }).catch(e => {
        console.log(e)
        this.$q.notify({
          message: e,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.q-tab-panel {
   padding: 0 16px;
}
h3 {
   font-size: 1.1rem;
   margin: 0;
}
.action {
   display: flex;
   justify-content: flex-end;
}
.submit {
   width: 200px;
   height: 60px;
   font-size: 20px;
}
@media screen and (max-width: 599px) {
  .q-tab-panel {
    padding: 0;
  }
  .submit {
    width: 100%;
  }
}
</style>
