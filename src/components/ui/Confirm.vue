<template>
  <q-dialog ref="dialog" :persistent="persistent" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-actions class="title">{{title}}</q-card-actions>
      <q-card-actions class="message" scroll>{{message}}</q-card-actions>
      <q-card-actions :class="['dialog-confirm-action', lang]">
        <link-btn-2 :text="cancel" :color="changeBtnStyle ? '' : 'white'" :needArrow="false" @click="onCancelClick" :class="changeBtnStyle ? 'center' : ''" />
        <link-btn-2 :text="ok" :color="changeBtnStyle ? 'white' : ''" :needArrow="!changeBtnStyle" @click="onOKClick" :class="changeBtnStyle ? 'center' : ''"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from 'vuex'
import linkBtn2 from './Button2'
export default {
  components: {
    'link-btn-2': linkBtn2
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    cancel: {
      type: String,
      default: ''
    },
    ok: {
      type: String,
      default: ''
    },
    persistent: {
      type: Boolean,
      default: false
    },
    changeBtnStyle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick () {
      this.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0 16px;
  padding: 8px 0;
  text-transform: uppercase;
  font-family: $typography-font-family;
  font-size: 1rem;
  font-weight: 400;
  border-bottom: 1px solid #ccc;
}
.message {
  padding: 20px;
  color: $textcolor;
  font-size: 1rem;
}
.dialog-confirm-action {
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
@media screen and (max-width: 599px) {
  .dialog-confirm-action {
    display: flex;
    justify-content: space-between;
  }
}
</style>
