<template>
  <div class="footer-wrap-bottom" ref="footerFixedBlock">
    <div class="footer" id="footer-bottom">
      <copyright >
        <promotion v-if="ready" />
      </copyright>
      <div class="brand-logo-footer"></div>
    </div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script>
import copyright from './CopyRight'
import promotion from '../promotion/Terms'

export default {
  components: {
    copyright: copyright,
    promotion
  },
  data () {
    return {
      marginBottom: '',
      ready: false
    }
  },
  methods: {
    getFooterHeight () {
      // console.log(this.$refs.footerFixedBlock.offsetHeight)
      this.marginBottom = Math.ceil(this.$refs.footerFixedBlock.offsetHeight)
      this.$emit('initFooterHeight', this.marginBottom)
    },
    onResize (size) {
      // console.log(size)
      this.getFooterHeight()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getFooterHeight()
      this.ready = true
    })
  }
}
</script>
