<template>
  <div class="loading-spinner" :class="type" :style="[height ? {minHeight: height} : '']">
    <img src="~assets/images/misc/ajax-loader.gif" alt="loading">
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'component'
    },
    height: {
      type: String,
      default: ''
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  &.page {
    min-height: 63vh;
  }
  &.component {
    min-height: 50px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  img {
    width: 100px;
    height: 100px;
  }
}
</style>
