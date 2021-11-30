<template>
  <div id="category-nav" class="faq-support grid-wrap">
    <router-link active-class="faq-active" :to="{name: 'help', params: { note: 'faq'}}" class="icon-faq">
      {{faqsLabel}}
    </router-link>
    <router-link active-class="faq-active" :to="{name: 'help', params: { note: shippingUrl}}" class="icon-truck">
      {{shippingPolicy}}
    </router-link>
    <router-link active-class="faq-active" :to="{name: 'help', params: { note: privacyUrl}}" class="icon-padlock">
      {{privacyPolicy}}
    </router-link>
    <router-link active-class="faq-active" :to="{name: 'help', params: { note: termsUrl}}" class="icon-gavel">
      {{isEu ? termsAndConditions : generalSalesConditions}}
    </router-link>
    <router-link active-class="faq-active" :to="{name: 'help', params: { note: 'contact-us'}}" class="icon-envelope">
      {{contactUs}}
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      isEu: state => state.site.isEU
    }),
    faqsLabel: function () {
      return this.$i18n.t('$common.$labels.faqTab')
    },
    shippingPolicy: function () {
      return this.$i18n.t('$common.$labels.shippingAndReturns')
    },
    termsAndConditions: function () {
      return this.$i18n.t('$common.$labels.termsAndConditions')
    },
    generalSalesConditions: function () {
      return this.$i18n.t('$common.$labels.generalSalesConditions')
    },
    privacyPolicy: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    termsOfUse: function () {
      return this.$i18n.t('$common.$labels.termsOfUse')
    },
    contactUs: function () {
      return this.$i18n.t('$common.$headings.contactus')
    },
    shippingUrl: function () {
      // if (this.isEu) {
      return this.$i18n.t('$common.$urls.shipping')
      // } else {
      //   return this.$i18n.t('$common.$urls.shippingCN')
      // }
    },
    privacyUrl: function () {
      return this.$i18n.t('$common.$urls.privacy')
    },
    termsUrl: function () {
      return this.$i18n.t('$common.$urls.terms')
    }
  }
}
</script>
