<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  },
  render: function (createElement) {
    console.log('render script')
    if (this.lang === 'en') {
      return createElement(
        'script',
        {
          attrs: {
            type: 'text/javascript',
            async: 'async',
            src: 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=f2f21030-0159-11ec-8e20-09217415292a&autoShow=false&language=EN'
          }
        }
      )
    } else {
      return createElement(
        'script',
        {
          attrs: {
            type: 'text/javascript',
            async: 'async',
            src: 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=f2f21030-0159-11ec-8e20-09217415292a&autoShow=false&language=ZHCN'
          }
        }
      )
    }
  }
}
</script>
