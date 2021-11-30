<template>
  <div class="accountBlock">
    <promoBanner
      :promoIsActive="promotion.promoIsActive"
      :promoDaysLeft="promotion.promoDaysLeft"
      :promoEnds="promotion.promoEnd"
    />
    <div>
      <h1 align="left" v-if="false">{{ dashboard }}</h1>
      <div id="category-nav" class="faq-support grid-wrap">
        <router-link active-class="faq-active" :to="{name: 'orderList'}" class="icon-grid">
          {{allOrders}}
        </router-link>
        <router-link active-class="faq-active" :to="{name: 'wishlist'}" class="icon-heart">
          {{likeList}}
        </router-link>
        <router-link active-class="faq-active" :to="{name: 'edit'}" class="icon-cog">
          {{accountSet}}
        </router-link>
        <router-link active-class="faq-active" :to="{name: 'addressList'}" class="icon-book2">
          {{addressManage}}
        </router-link>
      </div>
    </div>
    <div class="lt-sm min-account-head">
      <div v-if="isShowBack" class="back" @click="goBack">
        <q-icon name="icon-left-arrow"/>
        <span>{{back}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import promoBanner from './../components/promotion/Banner'

export default {
  name: 'accountBlock',
  components: {
    promoBanner
  },
  data () {
    return {
      tabIconInline: false
    }
  },
  props: {
    isShowBack: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    curTab: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      promotion: state => state.site.promotion
    }),
    back: function () {
      return this.$i18n.t('$common.$buttons.back')
    },
    dashboard: function () {
      return this.$i18n.t('$common.$labels.myAccount')
    },
    orders: function () {
      return this.$i18n.t('$common.$labels.orders')
    },
    myInvoices: function () {
      return this.$i18n.t('$common.$headings.myInvoices')
    },
    allOrders: function () {
      return this.$i18n.t('$common.$labels.orders')
    },
    likeList: function () {
      return this.$i18n.t('$common.$labels.wishlist')
    },
    accountSet: function () {
      return this.$i18n.t('$common.$headings.settings')
    },
    addressManage: function () {
      return this.$i18n.t('$common.$labels.addresses')
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  },
  mounted () {
    try {
      document.querySelector('body').classList.add('pgaccount')
    } catch { }
  },
  beforeDestroy () {
    try {
      document.querySelector('body').classList.remove('pgaccount')
    } catch { }
  }
}
</script>
