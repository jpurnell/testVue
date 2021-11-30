<template>
  <div class="promotion-block" v-show="false">
    <div class="promotion gt-xs" v-if="banner">{{ banner }}</div>
    <div class="promotion lt-sm" v-if="bannerMobile">{{ bannerMobile }}</div>
  </div>
</template>

<script>
export default {
  props: {
    banner: {
      type: String,
      default: ''
    },
    bannerMobile: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.promotion-block {
   width: 100%;
}
.promotion {
   width: 100%;
   color: #fff;
   font-size: 32px;
   text-align: center;
   background: #2b2e35;
   text-transform: uppercase;
   line-height: 62px;
}
@media screen and (max-width:1200px) {
  .promotion {
    font-size: 1.43em;
  }
}
@media screen and (max-width:960px) {
  .promotion {
    font-size: 19px;
  }
}
@media screen and (max-width:660px) {
  .promotion {
    line-height: 22px;
    font-size: 16px;
    padding: 5px;
  }
}
</style>
