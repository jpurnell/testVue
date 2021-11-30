<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    recaptchaSRC () {
      if (this.lang === 'en') {
        return 'https://www.google.com/recaptcha/api.js?render=explicit&hl=en'
      } else {
        return 'https://www.google.com/recaptcha/api.js?render=explicit&hl=' + this.lang
      }
    }
  },
  render: function (createElement) {
    // console.log('render script')
    return createElement(
      'script',
      {
        attrs: {
          type: 'text/javascript',
          async: 'async',
          src: this.recaptchaSRC
        }
      }
    )
  }
}
</script>
