<template>
  <div :class="['row', 'justify-between', onlyOneCol ? '' : 'address-fields', addressType + '-address']">
    <!-- <p>{{gloablRegion}}</p> -->
    <!-- <h5>Update Address</h5> -->
    <div class="col-12">
      <div class="first-name-wrapper">
        <p class="title">{{ firstNameLabel }} *</p>
        <q-input
          ref="firstname"
          square
          dense
          outlined
          :clearable="firstName && clearable.firstName"
          clear-icon="icon-close"
          @blur="showInputClear('firstName', false)"
          @focus="showInputClear('firstName', true)"
          v-model="firstName"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || firstNameError ]"
          class="field"
        />
      </div>
      <div class="last-name-wrapper">
        <p class="title">{{ lastNameLabel }} *</p>
        <q-input
          ref="lastname"
          square
          dense
          outlined
          :clearable="lastName && clearable.lastName"
          clear-icon="icon-close"
          @blur="showInputClear('lastName', false)"
          @focus="showInputClear('lastName', true)"
          v-model="lastName"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || lastNameError ]"
          class="field"
        />
      </div>
      <div class="company-wrapper">
        <p class="title">{{ companyLabel }} ({{optionalLabel}})</p>
        <q-input
          ref="company"
          class="field"
          square
          dense
          outlined
          :clearable="company && clearable.company"
          clear-icon="icon-close"
          @blur="showInputClear('company', false)"
          @focus="showInputClear('company', true)"
          bg-color="white"
          standout="bg-white text-black"
          v-model="company"
        />
      </div>
      <div class="phone-wrapper">
        <p class="title">{{ telephoneLabel }} *</p>
        <q-input
          ref="telephone"
          square
          dense
          outlined
          :clearable="telephone && clearable.telephone"
          clear-icon="icon-close"
          @blur="showInputClear('telephone', false)"
          @focus="showInputClear('telephone', true)"
          v-model="telephone"
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[checkFormPhone]"
          class="field"
        />
      </div>
    </div>
    <div class="col-12">
      <div class="row-address">
        <p class="title">{{ address1Label }} *</p>
        <q-input
          ref="address1"
          square
          dense
          outlined
          :clearable="address1 && clearable.address1"
          clear-icon="icon-close"
          @blur="showInputClear('address1', false)"
          @focus="showInputClear('address1', true)"
          bg-color="white"
          standout="bg-white text-black"
          v-model="address1"
          lazy-rules
          :rules="[checkFormAddress]"
          class="field address1"
        />
      </div>
      <div class="row-address address-2">
        <p class="title">{{ address2Label }} ({{optionalLabel}})</p>
        <q-input
          ref="address2"
          class="field address2"
          square
          dense
          outlined
          :clearable="address2 && clearable.address2"
          clear-icon="icon-close"
          @blur="showInputClear('address2', false)"
          @focus="showInputClear('address2', true)"
          bg-color="white"
          standout="bg-white text-black"
          v-model="address2"
        />
      </div>
      <div class="country-region">
        <p class="title">{{ countryRegionLabel }} *</p>
        <q-select
          ref="country"
          square
          dense
          outlined
          :clearable="countrySelector && clearable.countrySelector"
          clear-icon="icon-close"
          @blur="showInputClear('countrySelector', false)"
          @focus="showInputClear('countrySelector', true)"
          @input="countryFocus"
          v-model="countrySelector"
          :options="countryOptions"
          :option-value="opt => opt === null ? null : opt.value"
          :option-label="opt => opt === null ? '- Null -' : opt.label"
          emit-value
          map-options
          bg-color="white"
          standout="bg-white text-black"
          lazy-rules
          :rules="[val => val !== null && val !== '' || countryError]"
          class="field region-field"
          popup-content-class="country-menu"
        />
      </div>
      <!-- <template v-if="countrySelector === 'CN' || countrySelector === 'HK' || countrySelector === 'JP'"> -->
      <template v-if="isShowProvinceSelector">
        <div class="region-only">
          <p class="title">{{ countrySelector === 'CN' ? provinceLabel : regionLabel }}*</p>
          <q-select
            ref="province"
            square
            dense
            outlined
            :clearable="provinceSelector && clearable.provinceSelector"
            clear-icon="icon-close"
            @blur="showInputClear('provinceSelector', false)"
            @focus="showInputClear('provinceSelector', true)"
            @input="provinceFocus"
            emit-value
            map-options
            v-model="provinceSelector"
            :options="provinceOptions"
            :option-value="opt => opt === null ? null : opt.value"
            :option-label="opt => opt === null ? '- Null -' : opt.label"
            bg-color="white"
            standout="bg-white text-black"
            lazy-rules
            :rules="[val => val !== null && val !== '' || provinceError]"
            class="field"
          />
        </div>
      </template>
      <div>
        <p class="title">{{ zipCodeLabel }}</p>
        <q-input
          ref="zipcode"
          square
          dense
          outlined
          :clearable="zipcode && clearable.zipcode"
          clear-icon="icon-close"
          @blur="showInputClear('zipcode', false)"
          @focus="showInputClear('zipcode', true)"
          bg-color="white"
          standout="bg-white text-black"
          v-model="zipcode"
          maxlength="8"
          lazy-rules
          :rules="[checkFormZipCode]"
          class="field"
        />
      </div>
      <div>
        <p class="title">{{ cityLabel }} *</p>
        <q-input
          ref="cityInput"
          square
          dense
          outlined
          :clearable="citySelector && clearable.citySelector"
          clear-icon="icon-close"
          @blur="showInputClear('citySelector', false)"
          @focus="showInputClear('citySelector', true)"
          bg-color="white"
          standout="bg-white text-black"
          v-model="citySelector"
          lazy-rules
          :rules="[val => val !== null && val !== '' || cityError]"
          class="field cityInput"
        />
      </div>
      <slot name="otherfields"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import { addressCN, addressHK, addressJP } from './../../config/china.address'
import { checkPostcode, checkPhone } from './../../utils/validation'
export default {
  data () {
    return {
      firstName: '',
      lastName: '',
      telephone: '',
      company: '',
      addressSelector: '',
      countrySelector: '',
      provinceSelector: '',
      citySelector: '',
      countySelector: '',
      address1: '',
      address2: '',
      zipcode: '',
      editInit: false,
      isShowProvinceSelector: false,
      clearable: {
        firstName: false,
        lastName: false,
        company: false,
        telephone: false,
        addressSelector: false,
        countrySelector: false,
        provinceSelector: false,
        citySelector: false,
        countySelector: false,
        address1: false,
        address2: false,
        zipcode: false
      }
    }
  },
  props: {
    addressEdit: {
      type: String
    },
    onlyOneCol: {
      type: Boolean,
      default: true
    },
    addressType: {
      type: String,
      default: 'billing'
    },
    isShowNewBillingAddressForm: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      gloablRegion: state => state.cart.region,
      defaultCountry: state => state.site.defaultCountry
    }),
    firstNameLabel: function () {
      return this.$i18n.t('$common.$labels.firstName')
    },
    lastNameLabel: function () {
      return this.$i18n.t('$common.$labels.lastName')
    },
    companyLabel: function () {
      return this.$i18n.t('$common.$labels.companyLabel')
    },
    telephoneLabel: function () {
      return this.$i18n.t('$common.$labels.telephone')
    },
    address1Label: function () {
      return this.$i18n.t('$common.$labels.addressLine1')
    },
    address2Label: function () {
      return this.$i18n.t('$common.$labels.addressLine2')
    },
    countryRegionLabel: function () {
      return this.$i18n.t('$common.$labels.countryRegion')
    },
    regionLabel: function () {
      return this.$i18n.t('$common.$labels.region')
    },
    provinceLabel: function () {
      return this.$i18n.t('$common.$labels.province')
    },
    cityLabel: function () {
      return this.$i18n.t('$common.$labels.city')
    },
    zipCodeLabel: function () {
      return this.$i18n.t('$common.$labels.zipCode')
    },
    firstNameError: function () {
      return this.$i18n.t('$common.$validation.firstNameError')
    },
    lastNameError: function () {
      return this.$i18n.t('$common.$validation.lastNameError')
    },
    telephoneError: function () {
      return this.$i18n.t('$common.$validation.telephoneError')
    },
    countryError: function () {
      return this.$i18n.t('$common.$validation.countryError')
    },
    provinceError: function () {
      return this.$i18n.t('$common.$validation.provinceError')
    },
    cityError: function () {
      return this.$i18n.t('$common.$validation.cityError')
    },
    countyError: function () {
      return this.$i18n.t('$common.$validation.countyError')
    },
    shippingStreetError: function () {
      return this.$i18n.t('$common.$validation.shippingStreetError')
    },
    billingStreetError: function () {
      return this.$i18n.t('$common.$validation.billingStreetError')
    },
    zipCodeError: function () {
      return this.$i18n.t('$common.$validation.zipCodeError')
    },
    optionalLabel: function () {
      return this.$i18n.t('$common.$labels.optional')
    },
    countryOptions: function () {
      // return this.lang === 'zh-CN' ? countryCN : country
      // console.log(country, countryCN)
      return this.gloablRegion
    },
    // provinceEN: function () {
    //   let provinceEN = []
    //   Object.keys(addressCN).forEach(v => {
    //     provinceEN.push({
    //       label: v,
    //       value: v
    //     })
    //   })
    //   return provinceEN
    // },
    // provinceCN: function () {
    //   let provinceCN = []
    //   Object.keys(addressCN).forEach(v => {
    //     provinceCN.push({
    //       label: addressCN[v].name,
    //       value: v
    //     })
    //   })
    //   return provinceCN
    // },
    // provinceHKEN: function () {
    //   let provinceHKEN = []
    //   Object.keys(addressHK).forEach(v => {
    //     provinceHKEN.push({
    //       label: v,
    //       value: v
    //     })
    //   })
    //   return provinceHKEN
    // },
    // provinceHKCN: function () {
    //   let provinceHKCN = []
    //   Object.keys(addressHK).forEach(v => {
    //     provinceHKCN.push({
    //       label: addressHK[v].name,
    //       value: v
    //     })
    //   })
    //   return provinceHKCN
    // },
    // provinceJP: function () {
    //   let provinceJP = []
    //   Object.keys(addressJP).forEach(v => {
    //     provinceJP.push({
    //       label: v,
    //       value: v
    //     })
    //   })
    //   return provinceJP
    // },
    provinceOptions: function () {
      // if (this.countrySelector === 'CN') {
      //   return this.lang === 'zh-CN' ? this.provinceCN : this.provinceEN
      // } else if (this.countrySelector === 'HK') {
      //   return this.lang === 'zh-CN' ? this.provinceHKCN : this.provinceHKEN
      // } else if (this.countrySelector === 'JP') {
      //   return this.provinceJP
      // } else {
      //   return []
      // }
      console.log('computed provinceOptions 1', this.gloablRegion, this.countrySelector)
      let regionsObj = {}
      let returnData = []
      for (let index = 0; index < this.gloablRegion.length; index++) {
        const element = this.gloablRegion[index]
        if (element.value === this.countrySelector) {
          console.log('computed provinceOptions 2', element.regions)
          // regionsArr = element.regions
          // for (let index = 0; index < regionsArr.length; index++) {
          //   const item = regionsArr[index]
          //   returnData.push({
          //     label: item.name,
          //     value: item.name
          //   })
          // }
          regionsObj = element.regions
          Object.keys(regionsObj).forEach(o => {
            const item = regionsObj[o]
            returnData.push({
              label: item.name,
              value: item.name
            })
          })
        }
      }
      return returnData
    },
    // cityOptions: function () {
    //   let province = this.provinceSelector
    //   let city = []
    //   if (province) {
    //     Object.keys(addressCN).forEach(v => {
    //       if (addressCN[v].name === province || v === province) {
    //         city = Object.keys(addressCN[v].city)
    //       }
    //     })
    //   }
    //   return city
    // },
    // countyOptions: function () {
    //   let province = this.provinceSelector
    //   let city = this.citySelector
    //   let county = []
    //   if (province && city) {
    //     Object.keys(addressCN).forEach(v => {
    //       if (addressCN[v].name === province || v === province) {
    //         Object.keys(addressCN[v].city).forEach(c => {
    //           if (c === city) {
    //             county = addressCN[v].city[c]
    //           }
    //         })
    //       }
    //     })
    //   }
    //   return county
    // },
    addressList: function () {
      let addressList = []
      return addressList.concat(this.newAddress)
    },
    address1RemoveVertical: function () {
      if (this.address1) {
        return this.address1.replace(/\|/gi, ' ')
      } else {
        return ''
      }
    },
    address2RemoveVertical: function () {
      if (this.address2) {
        return this.address2.replace(/\|/gi, ' ')
      } else {
        return ''
      }
    },
    address: function () {
      let address = {
        firstname: this.firstName,
        lastname: this.lastName,
        street: `${this.address1RemoveVertical}|${this.address2RemoveVertical}`,
        city: this.citySelector,
        company: this.company,
        country_id: this.countrySelector,
        region: this.provinceSelector,
        postcode: this.zipcode,
        telephone: this.telephone
      }
      console.log('address this address', this, address, this.address1RemoveVertical, this.address2RemoveVertical, `${this.countySelector}${this.address1RemoveVertical}|${this.address2RemoveVertical}`)
      return address
    // },
    // gloablRegion: function () {
    //   let data = this.getGloablRegion()
    //   console.log('address fields gloablRegion', data)
    //   return data
    }
  },
  watch: {
    countrySelector: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log('watch countrySelector 1', newValue, oldValue, this.gloablRegion)
        this.checkShowProvinceSelector(newValue)
        if (!this.editInit) {
          this.provinceSelector = ''
          this.citySelector = ''
          this.countySelector = ''
        }
        this.$emit('countryChange', newValue)
      }
    },
    provinceSelector: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!this.editInit) {
          this.citySelector = ''
          this.countySelector = ''
        }
        this.$emit('regionChange', newValue)
      }
    },
    isShowNewBillingAddressForm: function (newValue, oldValue) {
      if (newValue === false) {
        this.$emit('regionChange', 'getFromSaved')
      }
      this.checkShowProvinceSelector(this.countrySelector)
    },
    citySelector: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!this.editInit) {
          this.countySelector = ''
        }
      }
    },
    addressEdit: function (newValue, oldValue) {
      console.log('addressEdit', newValue, oldValue)
      this.initEditAddress(newValue)
    },
    zipcode: function (newValue, oldValue) {
      console.log('addressEdit zipcode', newValue, oldValue)
      if (newValue !== null && newValue !== oldValue && newValue !== '' && newValue.length >= 4) {
        this.$emit('zipChange', newValue)
      }
    },
    defaultCountry: function (newValue, oldValue) {
      console.log('addressEdit defaultCountry watch', newValue, oldValue)
      // if (newValue !== oldValue && newValue !== '') {
      this.countrySelector = newValue
      // }
    },
    isOpen: function (newValue, oldValue) {
      this.checkShowProvinceSelector(this.countrySelector)
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'getGloablRegion'
      ]
    ),
    countryFocus () {
      this.editInit = false
    },
    provinceFocus () {
      this.editInit = false
    },
    cityFocus () {
      this.editInit = false
    },
    initEditAddress (val) {
      // console.log('initEditAddress 1', val)
      let editAddress = JSON.parse(val)
      if (Object.keys(editAddress).length > 0) {
        this.editInit = true
        this.firstName = editAddress.firsname || editAddress.firstname
        this.lastName = editAddress.lastname
        this.telephone = editAddress.telephone
        this.company = editAddress.company || ''
        this.countrySelector = editAddress.country_id || this.defaultCountry || ''
        this.provinceSelector = editAddress.region || ''
        this.citySelector = editAddress.city || ''
        if (editAddress.street) {
          // console.log('initEditAddress 2', editAddress.street)
          if (editAddress.street instanceof Object || editAddress.street instanceof Array) {
            if (editAddress.street.length === 2) {
              // this.countySelector = editAddress.street[0] || ''
              // this.address1 = editAddress.street[1] || ''
              this.address1 = editAddress.street[0] || ''
              this.address2 = editAddress.street[1] || ''
            } else {
              this.address1 = editAddress.street[0]
            }
          } else {
            if (editAddress.street.indexOf('|') !== -1) {
              let countyArray = editAddress.street.split('|')
              // this.countySelector = countyArray[0]
              // this.address1 = countyArray[1] || ''
              this.address1 = countyArray[0]
              this.address2 = countyArray[1] || ''
            }
          }
        }
        // this.address2 = ''
        this.zipcode = editAddress.postcode
      } else {
        this.countrySelector = this.defaultCountry || ''
      }
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    resetFilds () {
      console.log('resetFilds add new')
      this.$refs.firstname.resetValidation()
      this.$refs.lastname.resetValidation()
      this.$refs.telephone.resetValidation()
      this.$refs.country.resetValidation()
      if (this.countrySelector === 'US' || this.countrySelector === 'CN' || this.countrySelector === 'HK' || this.countrySelector === 'JP') {
        if (this.$refs.province) {
          this.$refs.province.resetValidation()
        }
      }
      if (this.lang === 'zh-CN' && this.countrySelector === 'CN') {
        if (this.$refs.city) {
          this.$refs.city.resetValidation()
        }
        if (this.$refs.county) {
          this.$refs.county.resetValidation()
        }
      }
      if (this.lang !== 'zh-CN' || (this.lang === 'zh-CN' && this.countrySelector !== 'CN')) {
        if (this.$refs.cityInput) {
          this.$refs.cityInput.resetValidation()
        }
      }
      this.$refs.address1.resetValidation()
      this.$refs.zipcode.resetValidation()
      this.firstName = ''
      this.lastName = ''
      this.telephone = ''
      this.company = ''
      this.countrySelector = this.defaultCountry || ''
      this.provinceSelector = ''
      this.citySelector = ''
      this.address1 = ''
      this.address2 = ''
      this.zipcode = ''
    },
    checkFormPhone (val) {
      return checkPhone(val) || this.telephoneError
    },
    checkFormAddress () {
      return (this.address1 !== '') || (this.addressType === 'billing' ? this.billingStreetError : this.shippingStreetError)
    },
    checkFormZipCode (val) {
      return checkPostcode(val) || this.zipCodeError
    },
    checkForm () {
      console.log('addressfields', this.$refs)
      this.$refs.firstname.validate()
      this.$refs.lastname.validate()
      this.$refs.telephone.validate()
      this.$refs.country.validate()
      if (this.countrySelector === 'US' || this.countrySelector === 'CN' || this.countrySelector === 'HK' || this.countrySelector === 'JP') {
        this.$refs.province.validate()
      }
      // if (this.lang === 'zh-CN' && this.countrySelector === 'CN') {
      //   this.$refs.city.validate()
      //   this.$refs.county.validate()
      // }
      // if (this.lang !== 'zh-CN' || (this.lang === 'zh-CN' && this.countrySelector !== 'CN')) {
      //   this.$refs.cityInput.validate()
      // }
      this.$refs.cityInput.validate()
      this.$refs.address1.validate()
      // this.$refs.zipcode.validate()
      // if (this.$refs.firstname.hasError || this.$refs.lastname.hasError || this.$refs.telephone.hasError || this.$refs.country.hasError || this.$refs.address1.hasError || this.$refs.zipcode.hasError) {
      //   return false
      // } else {
      //   if (this.countrySelector === 'CN' || this.countrySelector === 'HK' || this.countrySelector === 'JP') {
      //     if (this.$refs.province.hasError) {
      //       return false
      //     }
      //   }
      //   if (this.lang === 'zh-CN' && this.countrySelector === 'CN') {
      //     if (this.$refs.city.hasError || this.$refs.county.hasError) {
      //       return false
      //     }
      //   }
      //   if (this.lang !== 'zh-CN' || (this.lang === 'zh-CN' && this.countrySelector !== 'CN')) {
      //     if (this.$refs.cityInput.hasError) {
      //       return false
      //     }
      //   }
      // }
      console.log('firstname hasError', this.$refs.firstname.hasError)
      console.log('cityInput hasError', this.$refs.cityInput.hasError)
      if (this.$refs.firstname.hasError || this.$refs.lastname.hasError || this.$refs.telephone.hasError || this.$refs.country.hasError || this.$refs.cityInput.hasError || this.$refs.address1.hasError || this.$refs.zipcode.hasError) {
        return false
      }
      // Check Provice Error
      if (this.countrySelector === 'US' || this.countrySelector === 'CN' || this.countrySelector === 'HK' || this.countrySelector === 'JP') {
        if (this.$refs.province.hasError) {
          return false
        }
      }
      console.log('addressfields 2', this.$refs)
      return true
    },
    checkShowProvinceSelector (value) {
      console.log('checkShowProvinceSelector', value)
      for (let index = 0; index < this.gloablRegion.length; index++) {
        const element = this.gloablRegion[index]
        // console.log('watch countrySelector 2', element)
        if (element.value === value) {
          if (element.regions && Object.keys(element.regions).length > 0) {
            this.isShowProvinceSelector = true
            console.log('watch countrySelector 2', element.regions)
          } else {
            this.isShowProvinceSelector = false
            console.log('watch countrySelector 3', element.regions)
          }
        }
      }
    }
  },
  created () {
    if (this.addressEdit) {
      // console.log('created editaddress', this.addressEdit)
      this.initEditAddress(this.addressEdit)
    } else {
      this.countrySelector = this.defaultCountry
    }
    this.getGloablRegion()
  }
}
</script>

<style lang="scss" scoped>
// $
@import "~src/css/europe/components/addressFieldsScoped";
</style>

<style lang="scss">
// $
@import "~src/css/europe/components/addressFields";
</style>
