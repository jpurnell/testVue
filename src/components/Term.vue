<template>
  <q-dialog v-model="isCNTerm">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">网站使用协议</div>
        <q-space />
        <q-btn icon="icon-close" flat round dense  @click="agreeTerm(false)"  />
      </q-card-section>
      <q-card-section>
        <p>您在本网站注册账户或订购产品前，请点击下方链接，仔细阅读并充分理解协议中的条款内容。如您对协议有任何疑问，请联系客服咨询。</p>
        <p>您可以选择不使用本网站，但如果您使用本网站，您的使用行为将被视为对以下《销售条款》、《配送及退货政策》以及《隐私政策》的全部内容的认可。</p>
        <router-link :to="{name: 'help', params: { note: 'terms-conditions'}}">销售条款</router-link>
        <router-link :to="{name: 'help', params: { note: 'shipping-and-return'}}">配送及退货政策</router-link>
        <router-link :to="{name: 'help', params: { note: 'privacy-statement'}}">隐私政策</router-link>
        <q-btn label="同意并继续" @click="agreeTerm(true)" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      isCNTerm: false
    }
  },
  props: {
    isShowCnTerm: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    isShowCnTerm: function (newValue, oldValue) {
      this.isCNTerm = newValue
    }
  },
  methods: {
    agreeTerm (status) {
      this.$emit('agreeTerm', status)
    }
  }
}
</script>
