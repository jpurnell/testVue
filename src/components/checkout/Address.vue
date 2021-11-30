<template>
  <div>
    <p>{{selectAddressLabel}}</p>
    <div class="field user-address-field">
      <q-select
        outlined
        square
        clearable
        v-model="addressSelector"
        :options="addressOptions"
        :label="addressBook"
        fill-input
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label>{{ scope.opt.firsname }} {{ scope.opt.lastname }} </q-item-label>
              <q-item-label caption>{{ showRegion(scope.opt.region) }} {{ showStreet(scope.opt.street) }}</q-item-label>
              <q-item-label caption>{{ scope.opt.postcode }} {{ scope.opt.city}}</q-item-label>
              <q-item-label caption><span>{{ showCountry(scope.opt.country_id) }}</span></q-item-label>
              <q-item-label caption><span>{{ scope.opt.telephone}}</span></q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addressCN } from './../../config/china.address'
import { country } from './../../config/europe.address'

export default {
  data () {
    return {
      addressSelector: ''
    }
  },
  props: {
    addressList: {
      type: Array
    },
    type: {
      type: String,
      default: 'shipping_address'
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    selectShippingAddress: function () {
      return this.$i18n.t('$common.selectShippingAddress')
    },
    selectBillingAddress: function () {
      return this.$i18n.t('$common.selectBillingAddress')
    },
    selectAddressLabel: function () {
      return this.type === 'default_billing' ? this.selectBillingAddress : this.selectShippingAddress
    },
    addressBook: function () {
      return this.$i18n.t('$common.$labels.addressBook')
    },
    addressOptions: function () {
      if (this.addressList.length > 0) {
        return this.addressList.map(a => {
          a.value = a.address_id
          a.label = this.initAddressLabel(a)
          console.log(a)
          return a
        })
      } else {
        return []
      }
    },
    address: function () {
      let address = {}
      if (this.addressSelector instanceof Object) {
        address = {
          firstname: this.addressSelector.firsname,
          lastname: this.addressSelector.lastname,
          street: `${this.addressSelector.street.join('|')}`,
          city: this.addressSelector.city,
          country_id: this.addressSelector.country_id,
          region: this.addressSelector.region,
          postcode: this.addressSelector.postcode,
          telephone: this.addressSelector.telephone
        }
      } else {
        // select default form list
        let defaultNumber = 0
        for (let index = 0; index < this.addressList.length; index++) {
          const element = this.addressList[index]
          if (element[this.type]) {
            defaultNumber = index
          }
        }
        console.log('address computed', this.type, this.addressList, defaultNumber)
        address = {
          firstname: this.addressList[defaultNumber].firsname,
          lastname: this.addressList[defaultNumber].lastname,
          street: `${this.addressList[defaultNumber].street.join('|')}`,
          city: this.addressList[defaultNumber].city,
          country_id: this.addressList[defaultNumber].country_id,
          region: this.addressList[defaultNumber].region,
          postcode: this.addressList[defaultNumber].postcode,
          telephone: this.addressList[defaultNumber].telephone
        }
      }
      return address
    }
  },
  watch: {
    address: function (newValue, oldValue) {
      console.log('cccc', newValue)
      this.$emit('changeAddress', newValue)
    }
  },
  methods: {
    initAddressLabel (item) {
      let name = `${item.firsname} ${item.lastname} (${item.telephone})`
      let postcode = item.postcode ? `(${item.postcode})` : ``
      let address = `${this.showCountry(item.country_id)} ${this.showRegion(item.region)} ${item.city} ${item.street.join(' ')} ${postcode}`
      return `${name}${address}`
    },
    showCountry (val) {
      let currentCountry = ''
      country.forEach((o, index) => {
        if (o.value === val) {
          currentCountry = o.label
        }
      })
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
    showStreet (value) {
      return value.join(' ')
    }
  },
  created () {
    // console.log('address created', this)
    if (this.addressOptions.length > 0) {
      let addressSelector = 0
      for (let index = 0; index < this.addressOptions.length; index++) {
        const element = this.addressOptions[index]
        console.log('address created element', element, this.type, element[this.type])
        if (element[this.type]) {
          addressSelector = index
        }
      }
      this.addressSelector = this.addressOptions[addressSelector].label
    }
  }
}
</script>

<style lang="scss" scoped>
.q-select {
  & > .q-field__native {
    white-space: nowrap;
    span {
      width: 100%;
      overflow: hidden;
      line-height: 40px !important;
      text-overflow: ellipsis;
    }
  }
}
.user-address-field {
  margin-bottom: 1em;
}
</style>
