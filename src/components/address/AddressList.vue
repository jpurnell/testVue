<template>
  <div>
    <div class="head flex col-12 row gt-xs">
        <div class="column col-2"></div>
        <div class="column col-2">
          {{shipName}}
        </div>
        <div class="column col-2">
          {{phone}}
        </div>
        <div class="column col-4">
          {{address}}
        </div>
    </div>
    <q-list bordered separator class="address-list">
      <q-item v-for="(address, index) in addresses" :key="address.address_id" :class="[address.default_billing || address.default_shipping ? 'default' : 'not-default']">
        <div class="address-item row col-12">
          <div class="col-sm-2">
            <div v-if="address.default_shipping" class="default-status">[{{defaultShippingAddress}}] </div>
            <div v-if="address.default_billing" class="default-status">[{{defaultBillingAddress}}] </div>
          </div>
          <div class="ship-name col-6 col-sm-2">
            <strong>{{ address.firsname }} {{ address.lastname }}</strong>
          </div>
          <div class="customer-phone col-6 col-sm-2">
            <span>{{ address.telephone }}</span>
          </div>
          <div class="customer-addr col-6 col-sm-3">
            <div>{{ address.street.join(' ') }} <span>{{ showRegion(address.region) }} {{ address.city }}<span v-if="address.postcode">, {{ address.postcode }}</span><span class="current-country">, {{ showCountry(address.country_id) }}</span></span></div>
          </div>
          <div align="end" class="action column col-12 col-sm-3">
              <q-btn unelevated outline class="self-end edit-btn" :label="edit" icon="icon-pencil" @click="editItem(address, index)" />
              <q-btn unelevated outline class="self-end del-btn" :label="deleteText" icon="icon-trash" @click="deleteItem(address.address_id)" />
          </div>
          <address-form v-show="editIndex === index" :address="address" pageType="addressEdit" :isDefault="index === 0" @hideEdit="hideEdit" :is-open="editIndex === index"/>
        </div>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateAddress, deleteAddress } from './../../api/api'
import { addressCN } from './../../config/china.address'
import { country } from './../../config/europe.address'
import AddressForm from './AddressForm'
import confirm from './../ui/Confirm'
// import linkBtn2 from './../ui/Button2'

export default {
  components: {
    'address-form': AddressForm
    // 'link-btn-2': linkBtn2
  },
  props: {
    addresses: {
      type: Array
    },
    openNew: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultIndex: 0,
      editIndex: -1
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    setDefaultShippingLabel: function () {
      return this.$i18n.t('$common.$labels.defaultShippingAddress')
    },
    setDefaultBillingLabel: function () {
      return this.$i18n.t('$common.$inputs.setDefaultBilling')
    },
    edit: function () {
      return this.$i18n.t('$common.$labels.edit')
    },
    defaultShippingAddress: function () {
      return this.$i18n.t('$common.$labels.defaultShippingAddress')
    },
    defaultBillingAddress: function () {
      return this.$i18n.t('$common.$labels.defaultBillingAddress')
    },
    change: function () {
      return this.$i18n.t('change')
    },
    deleteText: function () {
      return this.$i18n.t('$common.$buttons.delete')
    },
    shipName: function () {
      return this.$i18n.t('$common.$labels.shipName')
    },
    phone: function () {
      return this.$i18n.t('$common.$labels.telephone')
    },
    address: function () {
      return this.$i18n.t('$common.$labels.address')
    }
  },
  watch: {
    openNew: function (newVal, oldVal) {
      if (newVal) {
        this.editIndex = -1
      }
    }
  },
  methods: {
    showCountry (val) {
      let currentCountry = ''
      country.forEach((o, index) => {
        if (o.value === val) {
          currentCountry = o.label
        }
      })
      // console.log('showCountry val', val)
      // console.log('showCountry currentCountry', currentCountry)
      return currentCountry
    },
    showRegion (val) {
      let region = ''
      Object.keys(addressCN).forEach(o => {
        if (o === val) {
          if (this.lang === 'zh-CN') {
            region = addressCN[o].name
          } else {
            region = val
          }
        }
      })
      return region
    },
    getCurrentItemIndex (id) {
      let index = this.addresses.findIndex(o => {
        return o.address_id === id
      })
      return index
    },
    setDefault (address) {
      let formdata = {
        address_id: address.address_id,
        firstname: address.firsname,
        lastname: address.lastname,
        street: address.street.join('|'),
        city: address.city,
        country_id: address.country_id,
        region: address.region,
        postcode: address.postcode,
        telephone: address.telephone,
        is_default: '1'
      }
      updateAddress(formdata).then(data => {
        // this.getAddressList()
        this.$emit('getAddressList')
        this.defaultIndex = 0
      }).catch(e => {
        console.log(e)
      })
    },
    /*
    editItem (address, index) {
      if (index === 0) {
        address.is_default = '1'
      }
      this.$q.sessionStorage.set('setAddress', JSON.stringify(address))
      this.$router.push({ name: 'addressEdit', query: { aid: address.address_id } })
    },
    */
    editItem (address, index) {
      if (this.editIndex === index) {
        this.editIndex = -1
        this.$emit('openEdit', false)
      } else {
        this.editIndex = index
        this.$emit('openEdit', true)
      }
    },
    hideEdit () {
      this.editIndex = -1
      this.$emit('getAddressList')
    },
    deleteItem (id) {
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('$common.$validation.deleteAddressItem'),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true
      }).onOk(() => {
        let index = this.getCurrentItemIndex(id)
        this.addresses.splice(index, 1)
        this.deleteAddressConfirm(id)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
    },
    deleteAddressConfirm (id) {
      let formdata = {
        address_id: id
      }
      deleteAddress(formdata).then(data => {
        // console.log(data)
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  padding: 16px 16px 10px 16px;
  text-transform: uppercase;
}
.q-item {
  padding: 0;
  border-left: 5px solid $brandgrey1;
  &.default {
    border-left: 5px solid $accent;
  }
}
.address-item {
  position: relative;
  padding: 25px 16px;
  div {
    @media screen and (max-width: 800px) {
      font-size: .9em;
    }
    @media screen and (max-width: 660px) {
      width: 100%;
    }
    > span {
      display: block;
      width: 100%;
    }
  }
}
.mobile-action {
  margin-top: 10px;
  .link-btn-2 {
    display: inline-block;
    margin-right: 10px;
  }
}
.default-status {
  font-size: 12px;
  line-height: 16px;
}

@media screen and (#{$bp-660}) {
  .item {
    flex-direction: column;
    & > div {
      padding-bottom: 5px;
    }
  }
  .min-address-info {
    margin-left: 40px;
    line-height: normal;
    font-size: 16px;
    strong {
      font-size: 18px;
    }
  }
}
</style>

<style lang="scss">
.address-list .q-item {
  .q-btn {
    font-size: 13px;
    border-radius: 0;
    min-width: 140px;
    @media screen and (#{$bp-660}) {
      width: 100%;
      div {
        text-align: left;
      }
    }
  }
  .q-btn {
    &.edit-btn {
      margin-bottom: 10px;
    }
    .q-icon {
      font-size: 18px;
    }
  }
  .q-btn__content {
    div {
      min-width: 47px;
    }
  }
  .q-btn__wrapper {
    padding: 5px 10px;
  }
}
</style>
