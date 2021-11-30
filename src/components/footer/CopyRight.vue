<template>
  <div class="links copyright clearfix clear">
    <p v-if="isEu">
      <!-- <span id="ccpacontainer" v-show="isMar"></span> -->
      <router-link :to="{name: 'help', params: { note: shippingUrl}}">{{ shippingRule }}</router-link>
      <router-link :to="{name: 'help', params: { note: privacyUrl}}">{{ term }}</router-link>
      <router-link :to="{name: 'help', params: { note: termsUrl}}">{{ termsOfUse }}</router-link>
      <router-link :to="{name: 'help', hash: '#cookiePolicy', params: { note: privacyUrl}}">{{cookiePolicy}}</router-link>
      <!-- <router-link :to="{name: 'help', params: { note: shippingUrl}}">{{ terms }}</router-link> -->
      <!-- <span id="teconsent" v-show="isMar"></span> -->
    </p>
    <slot />
    <p class="copyright" v-html="copyright"></p>
    <p class="icp" v-if="!isEu">
        <a href="https://beian.miit.gov.cn/" target="_blank" class="external" rel="nofollow">沪ICP备13005069号-15</a>
        <span class="space">|</span>
        <a href="http://218.242.124.22:8081/businessCheck/verifKey.do?showType=extShow&serial=9031000020180727094212000002729781-SAIC_SHOW_310000-20150921184605774098&signData=MEQCIHXDPUoaDEY/xnOUb+p/MZh7FKMinJ0mP+RNxbhzYxTIAiALsdt7oseEuhWdPqdGdOqj/yETo9/uzqv2iWwtTXU5iA==" target="_blank" class="gongshang external" ref="nofollow">上海工商</a>
        <span class="space lf">|</span>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010502004134" target="_blank" class="gongan external" rel="nofollow">沪公网安备 31010502004134号</a>
    </p>
    <!-- <p class="icon-hotel-logo"><span>Mandarin Oriental</span></p> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      isMar: state => state.site.isMar,
      isEu: state => state.site.isEU
    }),
    shippingRule: function () {
      return this.$i18n.t('$common.$labels.shippingPolicy')
    },
    term: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    termsOfUse: function () {
      return this.$i18n.t('$common.$labels.termsOfUse')
    },
    cookiePolicy: function () {
      return this.$i18n.t('$common.$labels.cookiePolicy')
    },
    shippingUrl: function () {
      if (this.isEu) {
        return this.$i18n.t('$common.$urls.shipping')
      } else {
        return this.$i18n.t('$common.$urls.shippingCN')
      }
    },
    privacyUrl: function () {
      return this.$i18n.t('$common.$urls.privacy')
    },
    termsUrl: function () {
      return this.$i18n.t('$common.$urls.terms')
    },
    terms: function () {
      return this.$i18n.t('$common.$labels.generalSalesConditions')
    },
    copyright () {
      let date = new Date()
      let currentYear = date.getFullYear()
      return this.$i18n.t('$local.copyright', { year: currentYear })
    }
  }
}
</script>
