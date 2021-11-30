<template>
  <q-page class="invoice">
    <div class="account-page">
      <account-block></account-block>
      <div class="main">
        <div class="heading-has-btn">
          <h2>{{ invoiceHeading }}</h2>
          <div class="gt-xs">
            <q-btn unelevated color="primary" :to="{name: 'invoiceNew'}" :label="addNewInvoice"  v-if="invoices.length > 0" />
          </div>
        </div>
        <div v-if="invoices.length > 0">
          <invoice-list :invoices="invoices" @getInvoiceList="getInvoiceList" />
        </div>
        <div v-else class="empty">
          <p>{{ invoiceEmpty }}</p>
          <q-btn unelevated color="primary" :to="{name: 'invoiceNew'}" :label="addNewInvoice" />
        </div>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="lt-sm btn-floating">
      <q-btn round color="primary" icon="fas fa-plus" size="lg" :to="{name: 'invoiceNew'}" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { listInvoice } from './../api/api'
import Accountblock from '../components/AccountBlock'
import InvoiceList from '../components/invoice/InvoiceList'
export default {
  name: 'invoice',
  components: {
    'account-block': Accountblock,
    'invoice-list': InvoiceList
  },
  data () {
    return {
      invoices: [],
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
    invoiceHeading: function () {
      return this.$i18n.t('invoiceHeading')
    },
    invoiceEmpty: function () {
      return this.$i18n.t('invoiceEmpty')
    },
    addNewInvoice: function () {
      return this.$i18n.t('addNewInvoice')
    }
  },
  methods: {
    getInvoiceList () {
      let formdata = {}
      listInvoice(formdata).then(data => {
        console.log(data)
        this.invoices = data
      }).catch(e => {
        console.log(e)
      })
    }
  },
  created () {
    this.getInvoiceList()
  }
}
</script>

<style lang="scss" scoped>
.heading-has-btn {
   display: flex;
   justify-content: space-between;
   align-items: center;
}
.btn-floating {
   z-index: 999;
}
.empty {
   display: flex;
   justify-content: center;
   flex-direction: row;
   align-items: center;
   p {
      padding: 0 10px;
      margin: 0;
   }
}
@media screen and (max-width: 599px) {
  .empty {
    flex-direction: column;
    p {
      text-align: center;
      margin: 0 0 16px;
    }
  }
}
</style>
