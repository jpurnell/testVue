<template>
  <div class="footer-wrap-top shell-bg">
        <div class="footer clear clearfix" id="footer-top">
          <!-- Disable Email sign-up, per MO Brand request -->
          <!-- <subscribe /> -->
          <footer-nav />
        </div>
    </div>
</template>

<script>
// import subscribe from '../Subscribe'
import footerNav from './FooterNav'

export default {
  name: 'footerPC',
  components: {
    // subscribe,
    'footer-nav': footerNav
  }
}
</script>
