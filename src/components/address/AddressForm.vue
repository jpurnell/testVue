<template>
  <div class="addressInfor col-12 col-sm-12 cold-md-8">
    <addressfield
      ref="address"
      :address-edit="JSON.stringify(address)"
      :is-open="isOpen"
      @countryChange="countryChange"
      @regionChange="regionChange"
    >
      <template v-slot:otherfields>
        <div class="field">
          <q-checkbox v-model="isDefaultBilling" :label="setDefaultBilling" color="primary" dense />
        </div>
        <div class="field">
          <q-checkbox v-model="isDefaultShipping" :label="setDefaultShipping" color="primary" dense />
        </div>
      </template>
    </addressfield>
    <div class="action">
      <link-btn-2 :extraClass="'cancel'" color="black" :text="cancelLabel" @click="$emit('hideEdit')"/>
      <link-btn-2 :extraClass="'submit'" :text="saveAddress" @click="submitAddress"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { createAddress, updateAddress } from './../../api/api'
import notify from './../../mixins/Notify'
import linkBtn2 from './../../components/ui/Button2'
import addressfield from './../../components/address/AddressFields'

export default {
  props: {
    address: {
      type: Object
    },
    pageType: {
      type: String
    },
    isDefaultShipping: {
      type: Boolean,
      default: false
    },
    isDefaultBilling: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  components: {
    addressfield,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      addressId: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    setDefaultShipping: function () {
      return this.$i18n.t('$common.$labels.defaultShippingAddress')
    },
    setDefaultBilling: function () {
      return this.$i18n.t('$common.$inputs.setDefaultBilling')
    },
    saveAddress: function () {
      return this.$i18n.t('$common.$buttons.save')
    },
    currentAddress: function () {
      return this.$refs.address.address || ''
    },
    cancelLabel: function () {
      return this.$i18n.t('$common.$buttons.cancel')
    }
  },
  mixins: [notify],
  methods: {
    countryChange () {},
    regionChange () {},
    submitAddress () {
      let formdata = this.$refs.address.address
      console.log('submitAddress', formdata)
      let type = this.pageType
      let checkAddress = this.validation()
      if (checkAddress) {
        if (this.isDefaultShipping) {
          formdata.default_shipping = '1'
        }
        if (this.isDefaultBilling) {
          formdata.default_billing = '1'
        }
        if (type === 'addressNew') {
          this.add(formdata)
        } else if (type === 'addressEdit') {
          formdata.address_id = this.address.address_id
          console.log('submitAddress addressEdit', formdata)
          this.modify(formdata)
        }
      }
    },
    validation () {
      return this.$refs.address.checkForm()
    },
    add (formdata) {
      createAddress(formdata).then(data => {
        console.log(data)
        this.addressId = data.address_id
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.saveSuccess'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        this.$refs.address.resetFilds()
        this.$emit('hideEdit')
      }).catch(error => {
        if (error === 'postcode is a required field.') {
          this.msgAlert(this.$i18n.t('$common.$validation.$required.postCode'))
        } else if (error === 'regionId is a required field.') {
          this.msgAlert(this.$i18n.t('$common.$validation.$required.region'))
        }
        console.log(error)
      })
    },
    modify (formdata) {
      console.log('modify pre updateAddress', formdata)
      updateAddress(formdata).then(data => {
        console.log('updateAddress', data)
        this.addressId = data.address_id
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.saveSuccess'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        this.$emit('hideEdit')
      }).catch(error => {
        console.log('updateAddress', error)
      })
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.addressInfor {
  border: 1px solid #000;
  padding: 2% 3%;
  margin: 15px 0 0 auto;
}
.action {
  display: flex;
  justify-content: space-between;
  width: calc(50% + 165px);
  margin-top: 20px;
}

@media screen and (#{$bp-660}) {
  .action {
    width: 100%;
  }
}
</style>
