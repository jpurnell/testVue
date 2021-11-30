<template>
<div class="gift-card-wrap clearfix">
  <div class="branding-hero">
    <a :href="i18n('$local.$hpCopy.giftCardLink')" target="_blank">
      <div class="img-wrap-tall">
        <picture>
          <source srcset="~assets/images/banners/hp-gift-cards.jpg" media="(max-width: 768px)">
          <img data-aos="zoom-out" data-aos-delay="30" src="~assets/images/banners/hp-gift-cards.jpg" alt="Bedding">
        </picture>
      </div>
    </a>
  </div>
  <div class="outer-wrap">
    <div class="inner-wrap" data-aos="fade" data-aos-delay="30">
      <div class="title">
        <div class="inner-title">
          <h2 data-aos="fade-up" data-aos-delay="600">{{i18n('$local.$hpCopy.giftCardHeading')}}</h2>
          <p v-html="i18n('$local.$hpCopy.giftCardText')"></p>
          <a :href="i18n('$local.$hpCopy.giftCardLink')" target="_blank"><span class="btn-main">{{i18n('$local.$buttons.learnMore')}}</span></a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  methods: {
    i18n (value) {
      return this.$i18n.t(value)
    }
  }
}
</script>
