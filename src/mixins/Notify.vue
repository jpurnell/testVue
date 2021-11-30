<script>
export default {
  methods: {
    msgAlert (msg) {
      this.$q.notify({
        group: 'my-group',
        message: msg,
        position: 'center',
        timeout: '3000',
        classes: 'notify'
      })
    }
  }
}
</script>
