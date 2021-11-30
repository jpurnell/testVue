<template>
  <div v-if="promoIsActive" class="promo-parent-wrapper">
    <Banner :promoDaysLeft="promoDaysLeft" :banner="banner" :prodName="prodName" :promoEnds="promoEnds"/>
    <!-- Display Countdown Banners on Dev Environments -->
    <template v-if="isDev">
      <Banner :promoDaysLeft="2" :banner="banner" :prodName="prodName" :promoEnds="promoEnds" :categoryId="categoryId" :replacementName="replacementName" />
      <Banner :promoDaysLeft="1" :banner="banner" :prodName="prodName" :promoEnds="promoEnds" :categoryId="categoryId" :replacementName="replacementName" />
      <Banner :promoDaysLeft="0" :banner="banner" :prodName="prodName" :promoEnds="promoEnds" :categoryId="categoryId" :replacementName="replacementName" />
    </template>
  </div>
</template>

<script>
import Banner from './BannerMarkup'
export default {
  props: {
    banner: {
      type: String,
      default: ''
    },
    promoIsActive: {
      type: Boolean,
      default: false
    },
    promoDaysLeft: {
      type: Number,
      default: 0
    },
    prodName: {
      type: String,
      default: ''
    },
    promoEnds: {
      type: String,
      default: ''
    },
    categoryId: {
      type: String,
      default: ''
    },
    replacementName: {
      type: String,
      default: ''
    }
  },
  components: {
    Banner
  },
  data () {
    return {
      langView: '',
      currency: '',
      isDev: false
    }
  },
  mounted () {
    // this.isDev = process.env.NODE_ENV === 'development'
    this.isDev = false
  }
}
</script>
