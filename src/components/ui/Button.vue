<template>
  <div :class="['link-btn', btnColor, needArrow ? '' : '']" @click="clickEvent">
    <span>{{buttonText}}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    needArrow: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'plain'
    },
    fontColor: {
      type: String,
      default: 'white'
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
      if (this.color) {
        return this.color
      } else {
        return 'primary'
      }
    }
  },
  methods: {
    clickEvent () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.link-btn {
  font-family: $typography-secondary-heading;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.1px;
  position: relative;
  span {
    display: inline-block;
  }
}
.arrow {
  padding-right: 12px;
  &:after {
    display: inline-block;
    content: '';
    width: 0;
    transform: rotate(-45deg);
    transform-origin: 75% 75%;
    transition: transform 0.5s ease;
    border-width: 0 0.8px 0.8px 0;
    border-style: solid;
    border-color: $primary;
    padding: 6px;
    position: relative;
    top: -5px;
    right: -8px;
  }
}
.plain {
  color: $textcolor;
}
.black {
  background: $black;
  border: 1px solid $black;
  color: #fff;
}
.white {
  background: $white;
  border: 1px solid $white;
  color: #000;
}
</style>
