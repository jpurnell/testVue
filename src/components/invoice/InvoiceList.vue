<template>
  <div>
    <q-card v-for="(invoice, index) in invoices" :key="index" class="invoice">
      <q-card-section>
        <div>{{ type }} {{invoice.fapiao_type === '0' ? '电子' : '增值税' }}</div>
        <div>{{ businessName }} {{ invoice.fapiao_title }}</div>
        <div>{{ uscctaxId }} {{ invoice.tax_code }}</div>
      </q-card-section>
      <q-card-section v-if="invoice.fapiao_type === '1'">
        <div>{{ registeredAddress }} {{ invoice.address }}</div>
        <div>{{ registeredPhone }}{{ invoice.phone }}</div>
        <div>{{ bankName }}{{ invoice.bank }}</div>
        <div>{{ bankAccount }}{{ invoice.account }}</div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn unelevated :label="deleteText" icon="icon-trash" @click="removeItem(invoice.fapiao_id)" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { deleteInvoice } from './../../api/api'
import confirm from './../ui/Confirm'

export default {
  props: {
    invoices: {
      type: Array
    }
  },
  computed: {
    businessName: function () {
      return this.$i18n.t('$common.$labels.businessName')
    },
    uscctaxId: function () {
      return this.$i18n.t('uscctaxId')
    },
    type: function () {
      return this.$i18n.t('type')
    },
    deleteText: function () {
      return this.$i18n.t('$common.$buttons.delete')
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
    }
  },
  methods: {
    removeItem (id) {
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
    },
    delete (id) {
      let formdata = {
        fapiao_id: id
      }
      deleteInvoice(formdata).then(data => {
        console.log(data)
        // this.getInvoiceList()
        this.$emit('getInvoiceList')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.invoice {
  margin-bottom: 20px;
}
</style>
