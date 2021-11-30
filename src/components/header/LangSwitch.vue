<template>
  <q-menu
    transition-show="jump-down"
    transition-hide="jump-up"
    anchor="bottom right"
    self="top right"
    ref="langSwicth"
    content-class="lang-menu"
    square
    :offset="[0, 10]"
    v-model="showLang"
  >
    <q-list style="min-width: 245px">
      <lang-list />
    </q-list>
  </q-menu>
</template>

<script>
import langList from './LangListEU'
export default {
  data () {
    return {
      showLang: false
    }
  },
  name: 'lang-switch',
  components: {
    'lang-list': langList
  },
  props: {
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isHidden: function (newVal, oldVal) {
      if (newVal) {
        this.$refs.langSwicth.hide()
      }
    },
    showLang: function (val) {
      this.$emit('showLang', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.lang-menu {
  box-shadow: none;
  .q-list {
    padding: 10px 0;
    background: $white;
  }
}
</style>
