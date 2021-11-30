<template>
  <q-page class="">
    <div class="account-page clearfix">
      <account-block cur-tab="tab4" :title="addressManage"></account-block>
      <div class="faq" v-if="ready">
        <div v-if="addresses && addresses.length > 0">
          <address-list :addresses="addresses" :open-new="newAddress" @getAddressList="getAddressList" @openEdit="openEdit" />
        </div>
        <div v-else class="empty">
          <p>{{ addressEmpty }}</p>
          <div class="action" @click="newAddress=!newAddress">
            <link-btn-2 :text="addNewAddress" />
          </div>
        </div>
        <div class="row">
          <div class="address-new" @click="newAddress=!newAddress" v-if="addresses && addresses.length > 0">
            <link-btn-2 :text="newAddress ? 'X' : addNewAddress" :color="newAddress ? 'white' : 'main'" />
          </div>
        </div>
        <address-form class="new-address" v-show="newAddress" pageType="addressNew" @hideEdit="hideEdit"/>
      </div>
    </div>
    <q-page-sticky v-show="false" position="bottom-right" :offset="[30, 30]" class="lt-sm btn-floating">
      <q-btn round color="primary" size="lg" :to="{name: 'addressNew'}" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { listAddress } from './../api/api'
import Accountblock from './../components/AccountBlock'
import linkBtn2 from './../components/ui/Button2'
import AddressList from './../components/address/AddressList'
import AddressForm from './../components/address/AddressForm'

export default {
  components: {
    'account-block': Accountblock,
    'address-list': AddressList,
    'address-form': AddressForm,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      addresses: [],
      metaDescription: '',
      metaKeywords: '',
      newAddress: false,
      ready: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website",  useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      defaultCountry: state => state.site.defaultCountry
    }),
    title: function () {
      return `${this.addressManage} - ${this.$i18n.t('$common.$labels.myAccount')}`
    },
    addressManage: function () {
      return this.$i18n.t('$common.$labels.addresses')
    },
    addNewAddress: function () {
      return this.$i18n.t('$common.$buttons.newAddress')
    },
    addressEmpty: function () {
      return this.$i18n.t('$common.addressEmpty')
    },
    cancel: function () {
      return this.$i18n.t('$common.$buttons.cancel')
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setDefaultCountry'
      ]
    ),
    getAddressList () {
      let formdata = {}
      listAddress(formdata).then(data => {
        console.log(data)
        this.addresses = data.address_list
        this.setDefaultCountry(data.default_country)
        console.log('getAddressList', data.default_country)
        this.ready = true
        if (typeof window !== 'undefined') {
          window.scroll(0, 0)
        }
      }).catch(e => {
        console.log(e)
        this.ready = true
      })
    },
    hideEdit () {
      this.newAddress = false
      this.getAddressList()
    },
    openEdit (status) {
      if (status) {
        this.newAddress = false
      }
    }
  },
  created () {
    this.getAddressList()
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
  flex-direction: column;
  align-items: center;
}
.item {
  margin: 0 0 20px;
  background: #f5f5f5;
}
.action {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.new-address {
  padding-right: 20%;
  @media screen and (#{$bp-660}) {
    padding-right: 3%;
  }
}
.addresses {
  display: flex;
  justify-content: flex-start;
  span {
    margin-left: 20px;
  }
}
.address-new {
  margin: 10px 0;
}
@media screen and (max-width: 599px) {
  .empty {
    flex-direction: column;
    p {
      text-align: center;
      margin: 0 0 16px;
    }
  }
  .addresses {
    justify-content: space-between;
  }
}
</style>
