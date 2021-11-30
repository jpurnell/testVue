<template>
  <div>
    <h2>{{ fapiaoHeading }} <a @click="showInvoiceTips" v-if="lang === 'zh-CN'" class="invoice-tips">(温馨提示)</a></h2>
    <div class="h2-content">
      <q-option-group
        class="gt-xs"
        v-model="panel"
        inline
        :options="invoiceOptions"
      />
      <q-list class="lt-sm">
        <template v-for="(invoiceOption, index) in invoiceOptions">
          <q-item tag="label" v-ripple :key="index">
            <q-item-section avatar>
              <q-radio v-model="panel" :val="invoiceOption.value" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{invoiceOption.label}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-option-group
            :key="index-10"
            v-if="index===1 && panel==='e-invoice'"
            inline
            v-model="epanels"
            :options="eInvoiceOptions"
            @input="changeEpanel"
            type="checkbox"
          />
        </template>
      </q-list>
      <q-tab-panels v-model="panel" animated class="invoice-panel">
        <q-tab-panel name="none" class="none-pad">
        </q-tab-panel>
        <q-tab-panel name="e-invoice" :class="epanel === 'personal' ? 'none-pad' : ''">
          <q-option-group
            class="gt-xs"
            v-model="epanels"
            inline
            :options="eInvoiceOptions"
            @input="changeEpanel"
            type="checkbox"
          />
          <div v-if="epanel === 'business'">
            <q-btn
              unelevated
              color="primary"
              class="btn-add-invoice"
              :label="addInvoiceLabel"
              @click="showNewEInvoiceForm(true)"
              v-if="isLogin && eInvoiceList.length > 0 && !showEInvoiceForm"
            />
            <q-btn
              unelevated
              color="primary"
              :label="invoiceListLabel"
              @click="showNewEInvoiceForm(false)"
              v-if="isLogin && eInvoiceList.length > 0 && showEInvoiceForm"
            />
            <q-list v-if="isLogin && eInvoiceList.length > 0 && !showEInvoiceForm">
              <q-item v-for="(item, index) in eInvoiceList" :key="index">
                <q-item-section avatar>
                  <q-radio v-model="eInvoiceSelector" :val="item.fapiao_id" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{item.fapiao_title}}</q-item-label>
                  <q-item-label caption>{{item.tax_code}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn class="delete" unelevated :label="deleteText" icon="icon-trash" @click="removeItem(item.fapiao_id)" />
                </q-item-section>
              </q-item>
            </q-list>
            <invoice-e
              ref="invoiceE"
              :show-e-invoice-form="!isLogin || eInvoiceList.length === 0 || showEInvoiceForm"
              @eBusinessNameChange="eBusinessNameChange"
              @eUSCCChange="eUSCCChange"
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="vat-invoice">
          <q-btn
            unelevated
            color="primary"
            class="btn-add-vat"
            :label="addInvoiceLabel"
            @click="showNewVatInvoiceForm(true)"
            v-if="isLogin && vatInvoiceList.length > 0 && !showVatInvoiceForm"
          />
          <q-btn
            unelevated
            color="primary"
            :label="invoiceListLabel"
            @click="showNewVatInvoiceForm(false)"
            v-if="isLogin && vatInvoiceList.length > 0 && showVatInvoiceForm"
          />
          <q-list v-if="isLogin && vatInvoiceList.length > 0 && !showVatInvoiceForm">
            <q-item v-for="(item, index) in vatInvoiceList" :key="index">
              <q-item-section avatar>
                <q-radio v-model="vatInvoiceSelector" :val="item.fapiao_id" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <div>{{item.fapiao_title}}</div>
                  <div>{{item.tax_code}}</div>
                </q-item-label>
                <q-item-label caption>
                  <div>{{item.bank}}</div>
                  <div>{{item.account}}</div>
                  <div>{{item.address}}</div>
                  <div>{{item.phone}}</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn class="delete" unelevated :label="deleteText" icon="icon-trash" @click="removeItem(item.fapiao_id)" />
              </q-item-section>
            </q-item>
          </q-list>
          <invoice-vat
            ref="invoiceVAT"
            :show-vat-invoice-form="!isLogin || vatInvoiceList.length === 0 || showVatInvoiceForm"
            @vatBusinessNameChange="vatBusinessNameChange"
            @vatTaxIdChange="vatTaxIdChange"
            @vatRegisteredAddressChange="vatRegisteredAddressChange"
            @vatRegisterPhoneChange="vatRegisterPhoneChange"
            @vatBankNameChange="vatBankNameChange"
            @vatBankAccountChange="vatBankAccountChange"
          >
            <template v-slot:otherfields>
              <div class="field">
                <q-checkbox
                  dense
                  v-model="isSameasShip"
                  :label="sameasShip"
                  color="primary"
                />
              </div>
              <addressinfo
                ref="billingAddress"
                :only-china="true"
                :only-one-col="true"
                :address-edit="JSON.stringify(addressEdit)"
                @countryChange="countryChange"
                @regionChange="regionChange"
                v-show="!isSameasShip"
              />
            </template>
          </invoice-vat>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="showTips">
      <q-card class="chinatax-tips-pop">
        <q-card-section>
          <q-btn
            icon="icon-close"
            flat
            dense
            class="close"
            v-close-popup
          />
          <img src="~assets/img/invoice.jpg" class="tips" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { listInvoice, deleteInvoice } from './../../api/api'
import invoiceE from './../invoice/InvoiceFormE'
import invoiceVAT from './../invoice/InvoiceFormVAT'
import addressinfo from './../address/AddressFields'
// import confirm from './../ui/Confirm'

export default {
  components: {
    'invoice-e': invoiceE,
    'invoice-vat': invoiceVAT,
    addressinfo
  },
  data () {
    return {
      panel: 'none',
      epanel: 'personal',
      epanels: ['personal'],
      normal: {
        title: '',
        uscc: ''
      },
      vat: {
        businessName: '',
        taxId: '',
        registeredAddress: '',
        registeredPhone: '',
        bankName: '',
        bankAccount: ''
      },
      showTips: false,
      isSameasShip: true,
      invoices: [],
      eInvoiceSelector: '',
      vatInvoiceSelector: '',
      showEInvoiceForm: false,
      showVatInvoiceForm: false,
      addressEdit: {}
    }
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    fapiaoHeading: function () {
      return this.$i18n.t('$common.$labels.FAPIAO_INFORMATION')
    },
    noNeedFapiao: function () {
      return this.$i18n.t('$common.$labels.notNeedFapiao')
    },
    eFapiao: function () {
      return this.$i18n.t('$common.$labels.eFapiao')
    },
    vatFapiao: function () {
      return this.$i18n.t('$common.$labels.vatFapiao')
    },
    fapiaoType: function () {
      return this.$i18n.t('$common.$labels.fapiaoType')
    },
    personal: function () {
      return this.$i18n.t('$common.$labels.Personal')
    },
    business: function () {
      return this.$i18n.t('$common.$labels.Business')
    },
    sameasShip: function () {
      return this.$i18n.t('$common.sameasShip')
    },
    deleteText: function () {
      return this.$i18n.t('$common.$buttons.delete')
    },
    addInvoiceLabel: function () {
      return this.$i18n.t('$common.$labels.addInvoice')
    },
    invoiceListLabel: function () {
      return this.$i18n.t('$common.$labels.invoiceList')
    },
    invoiceOptions: function () {
      let options = [
        { value: 'none', label: this.noNeedFapiao },
        { value: 'e-invoice', label: this.eFapiao },
        { value: 'vat-invoice', label: this.vatFapiao }
      ]
      return options
    },
    eInvoiceOptions: function () {
      let options = [
        { value: 'personal', label: this.personal },
        { value: 'business', label: this.business }
      ]
      return options
    },
    eInvoiceList: function () {
      return this.invoices.filter(o => {
        return o.fapiao_type === '0'
      })
    },
    vatInvoiceList: function () {
      return this.invoices.filter(o => {
        return o.fapiao_type === '1'
      })
    },
    billingAddress: function () {
      return this.$refs.billingAddress.address
    },
    needCheckEForm: function () {
      return !this.isLogin || this.eInvoiceList.length === 0 || this.showEInvoiceForm
    },
    needCheckVatForm: function () {
      return !this.isLogin || this.vatInvoiceList.length === 0 || this.showVatInvoiceForm
    }
  },
  watch: {
    panel: function (newVal, oldVal) {
      console.log(newVal)
    },
    epanel: function (newVal, oldVal) {
      console.log(newVal)
    },
    eInvoiceSelector: function (newVal, oldVal) {
      if (newVal) {
        let current = this.eInvoiceList.filter(o => {
          return o.fapiao_id === newVal
        })
        this.normal.title = current[0].fapiao_title
        this.normal.uscc = current[0].tax_code
      }
    },
    eInvoiceList: {
      handler: function (newVal, oldVal) {
        if (newVal.length > 0) {
          this.eInvoiceSelector = newVal[0].fapiao_id
          this.showEInvoiceForm = false
          this.normal.title = newVal[0].fapiao_title
          this.normal.uscc = newVal[0].tax_code
        } else {
          this.eInvoiceSelector = ''
          this.showEInvoiceForm = true
          this.normal.title = ''
          this.normal.uscc = ''
        }
      },
      deep: true
    },
    vatInvoiceSelector: function (newVal, oldVal) {
      if (newVal) {
        let current = this.vatInvoiceList.filter(o => {
          return o.fapiao_id === newVal
        })
        this.vat.businessName = current[0].fapiao_title
        this.vat.taxId = current[0].tax_code
        this.vat.registeredAddress = current[0].address
        this.vat.registeredPhone = current[0].phone
        this.vat.bankName = current[0].bank
        this.vat.bankAccount = current[0].account
      }
    },
    vatInvoiceList: {
      handler: function (newVal, oldVal) {
        if (newVal.length > 0) {
          this.vatInvoiceSelector = newVal[0].fapiao_id
          this.showVatInvoiceForm = false
          this.vat.businessName = newVal[0].fapiao_title
          this.vat.taxId = newVal[0].tax_code
          this.vat.registeredAddress = newVal[0].address
          this.vat.registeredPhone = newVal[0].phone
          this.vat.bankName = newVal[0].bank
          this.vat.bankAccount = newVal[0].account
        } else {
          this.vatInvoiceSelector = ''
          this.showVatInvoiceForm = true
          this.vat.businessName = ''
          this.vat.taxId = ''
          this.vat.registeredAddress = ''
          this.vat.registeredPhone = ''
          this.vat.bankName = ''
          this.vat.bankAccount = ''
        }
      },
      deep: true
    },
    isLogin: function (newVal, oldVal) {
      if (newVal) {
        this.getInvoiceList()
      }
    }
  },
  methods: {
    showInvoiceTips () {
      this.showTips = true
    },
    countryChange (value) {

    },
    regionChange (value) {
      // this.getShipping()
    },
    eBusinessNameChange (value) {
      this.normal.title = value
    },
    eUSCCChange (value) {
      this.normal.uscc = value
    },
    vatBusinessNameChange (value) {
      this.vat.businessName = value
    },
    vatTaxIdChange (value) {
      this.vat.taxId = value
    },
    vatRegisteredAddressChange (value) {
      this.vat.registeredAddress = value
    },
    vatRegisterPhoneChange (value) {
      this.vat.registeredPhone = value
    },
    vatBankNameChange (value) {
      this.vat.bankName = value
    },
    vatBankAccountChange (value) {
      this.vat.bankAccount = value
    },
    getInvoiceList () {
      let formdata = {}
      listInvoice(formdata).then(data => {
        console.log(data)
        this.invoices = data
      }).catch(e => {
        console.log(e)
      })
    },
    removeItem (id) {
      /*
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('$common.$validation.deleteInvoiceConfirm'),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true
      }).onOk(() => {
        this.delete(id)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
      */
      this.delete(id)
    },
    delete (id) {
      let formdata = {
        fapiao_id: id
      }
      deleteInvoice(formdata).then(data => {
        console.log(data)
        this.getInvoiceList()
      }).catch(e => {
        console.log(e)
      })
    },
    showNewEInvoiceForm (status) {
      this.showEInvoiceForm = status
      if (status) {
        this.normal.title = ''
        this.normal.uscc = ''
      } else {
        if (this.eInvoiceList.length > 0) {
          this.eInvoiceSelector = this.eInvoiceList[0].fapiao_id
          this.normal.title = this.eInvoiceList[0].fapiao_title
          this.normal.uscc = this.eInvoiceList[0].tax_code
        }
      }
    },
    showNewVatInvoiceForm (status) {
      this.showVatInvoiceForm = status
      if (status) {
        this.vat.businessName = ''
        this.vat.taxId = ''
        this.vat.registeredAddress = ''
        this.vat.registeredPhone = ''
        this.vat.bankName = ''
        this.vat.bankAccount = ''
      } else {
        if (this.vatInvoiceList.length > 0) {
          this.vatInvoiceSelector = this.vatInvoiceList[0].fapiao_id
          this.vat.businessName = this.vatInvoiceList[0].fapiao_title
          this.vat.taxId = this.vatInvoiceList[0].tax_code
          this.vat.registeredAddress = this.vatInvoiceList[0].address
          this.vat.registeredPhone = this.vatInvoiceList[0].phone
          this.vat.bankName = this.vatInvoiceList[0].bank
          this.vat.bankAccount = this.vatInvoiceList[0].account
        }
      }
    },
    initSelector () {
      if (this.$q.sessionStorage.has('checkoutInvoice')) {
        let invoice = this.$q.sessionStorage.getItem('checkoutInvoice')
        if (invoice.fapiao_type === '0') {
          this.panel = 'e-invoice'
          if (invoice.fapiao_title || invoice.tax_code) {
            this.epanel = 'business'
          }
        } else if (invoice.fapiao_type === '1') {
          this.panel = 'vat-invoice'
        } else {
          this.panel = 'none'
        }
        this.isSameasShip = invoice.isSameasShip
        if (!invoice.isSameasShip && invoice.billingAddress) {
          this.addressEdit = Object.assign({}, invoice.billingAddress)
        }
      }
    },
    changeEpanel (value) {
      // console.log(value)
      if (value.length === 2) {
        this.epanel = this.epanels[1]
      }
      this.epanels = [this.epanel]
    },
    checkEForm () {
      if (this.needCheckEForm) {
        return this.$refs.invoiceE.checkForm()
      } else {
        return true
      }
    },
    checkVatAddress () {
      if (!this.isSameasShip) {
        return this.$refs.billingAddress.checkForm()
      } else {
        return true
      }
    },
    checkVatForm () {
      if (this.needCheckVatForm) {
        if (!this.isSameasShip) {
          return this.$refs.invoiceVAT.checkForm() && this.$refs.billingAddress.checkForm()
        } else {
          return this.$refs.invoiceVAT.checkForm()
        }
      } else {
        return true
      }
    }
  },
  created () {
    if (this.isLogin) {
      this.getInvoiceList()
    }
    this.initSelector()
  }
}
</script>

<style lang="scss" scoped>
h2 {
  .invoice-tips {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-bottom: 1px solid $black;
  }
}
.h2-content {
  padding: 3%;
  margin: 0 0 1em;
}
.q-option-group {
  font-size: 16px;
    & > .q-radio__label {
      font-size: 16px;
    }
}
.q-tab-panels {
  background: transparent;
}
.tips {
  width: 300px;
}
.invoice-panel {
  background: transparent;
  .q-tab-panel {
    padding: 16px 0;
  }
  .field {
    font-size: 16px;
    margin-top: 10px;
  }
  .title {
    margin: 10px 0 8px 0;
  }
}
.q-item {
  padding: 0;
}
.btn-add-invoice {
  margin: 20px 0;
  font-weight: normal;
  border-radius: unset;
}
.btn-add-vat {
  margin: 0 0 20px;
  font-weight: normal;
  border-radius: unset;
}
.en {
  .delete {
    font-size: 12px;
  }
}
.none-pad {
  padding: 0 !important;
}
.close {
  background: $black;
  color: $white;
  position: absolute;
  right: 0;
  top: 0;
  &.q-btn--rectangle {
    border-radius: 0;
  }
}
</style>
