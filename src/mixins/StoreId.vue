<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      currency: state => state.lang.currency
    })
  }
}
</script>
