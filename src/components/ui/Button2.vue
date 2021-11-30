<template>
  <p :class="['btn-' + btnColor, 'link-btn-2', extraClass]" @click="clickEvent">
    <span>{{buttonText}}</span>
  </p>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'accent'
    },
    disable: {
      type: Boolean,
      default: false
    },
    extraClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    toViewText: function () {
      return this.$i18n.t('$common.$buttons.shopNow')
    },
    buttonText: function () {
      return this.text || this.toViewText
    },
    btnColor: function () {
      if (this.disable) {
        return 'disable'
      }
      if (this.color) {
        if (this.color === 'primary' || this.color === 'accent') {
          return 'main'
        } else if (this.color === 'white') {
          return 'plain'
        } else {
          return this.color
        }
      } else {
        return 'white'
      }
    }
  },
  methods: {
    clickEvent () {
      if (this.disable) {
        return false
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.link-btn-2 {
  &.primary {
    color: $black;
    background: $primary;
    border: 1px solid $primary;
  }
  &.accent {
    color: $black;
    background: $accent;
    border: 1px solid $accent;
  }
  &.black {
    background: $black;
    border: 1px solid $black;
    color: $white;
  }
  &.white,
  &.btn-white {
    background: $white;
    border: 1px solid transparent;
    color: $black;
  }
}
</style>
