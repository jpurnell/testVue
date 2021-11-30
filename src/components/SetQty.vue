<template>
  <div>
    <q-btn outline unelevated  label="-" :class="['action', currentQty <= minQty ? 'disable' : '']" @click="reduce" />
    <q-btn no-wrap outline unelevated :ripple="false" :label="currentQty" class="qty" />
    <q-btn outline unelevated label="+" :class="['action', addDisabled ? 'disable' : '']"  @click="add" />
  </div>
</template>

<script>
import notify from './../mixins/Notify'
export default {
  name: 'setQty',
  data () {
    return {
      currentQty: 1,
      currentMaxQty: 10,
      reduceDisaled: false,
      addDisabled: false
    }
  },
  props: {
    itemId: {
      type: String,
      required: true
    },
    defaultQty: {
      type: Number,
      required: true,
      default: 1
    },
    maxQty: {
      type: Number,
      required: true,
      default: 10
    },
    minQty: {
      type: Number,
      required: true,
      default: 1
    },
    waitData: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    addErrorTips: function () {
      return this.$i18n.t('$common.$validation.addErrorTips')
    },
    reduceErrorTips: function () {
      return this.$i18n.t('$common.$validation.reduceErrorTips')
    }
  },
  watch: {
    itemId: function (newValue, oldValue) {
      this.reduceDisaled = false
      this.addDisabled = false
      this.currentMaxQty = this.maxQty
    },
    currentQty: function (newValue, oldValue) {
      this.initBtn(newValue)
    }
  },
  mixins: [notify],
  methods: {
    add () {
      if (!this.waitData) {
        if (!this.addDisabled) {
          if (this.currentQty >= this.currentMaxQty) {
            this.addDisabled = true
            this.msgAlert(this.addErrorTips)
          } else {
            this.currentQty = this.currentQty + 1
            this.emitQty()
          }
        } else {
          this.msgAlert(this.addErrorTips)
        }
      }
    },
    reduce () {
      if (!this.waitData) {
        if (!this.reduceDisaled) {
          if (this.currentQty <= this.minQty) {
            this.reduceDisaled = true
            this.msgAlert(this.reduceErrorTips)
          } else {
            this.currentQty = this.currentQty - 1
            this.emitQty()
          }
        } else {
          this.msgAlert(this.reduceErrorTips)
        }
      }
    },
    emitQty () {
      this.$emit('updateQty', this.itemId, this.currentQty)
    },
    initBtn (value) {
      if (value <= this.minQty) {
        this.reduceDisaled = true
      } else {
        this.reduceDisaled = false
      }
      if (value >= this.currentMaxQty) {
        this.addDisabled = true
      } else {
        this.addDisabled = false
      }
    },
    syncQty (val) {
      if (val && this.currentQty !== val) {
        this.currentQty = val
        this.currentMaxQty = val
        this.addDisabled = true
      }
    },
    resetQty (itemId, currentQty) {
      if (this.itemId === itemId) {
        this.currentQty = currentQty
      }
    }
  },
  created () {
    this.currentQty = this.defaultQty
    this.initBtn(this.currentQty)
  }
}
</script>

<style lang="scss" scoped>
.q-btn--rectangle {
  border-radius: 0;
}
.action,
.qty {
  font-size: 14px;
}
.qty {
  width: 50px;
  border-width: 1px 0;
  margin-left: -1px;
  margin-right: -1px;
  cursor: default;
}
.disable {
  color: #ccc;
}
.qty-block {
  button {
    vertical-align: top;
  }
}
</style>
<style lang="scss">
.product {
  .qty-block {
    .qty {
      height: 44px;
      padding: 0;
      div {
        height: 44px;
        line-height: 44px;
        padding: 0;
        top: 0;
        position: relative;
      }
      .q-focus-helper {
        display: none;
      }
    }
  }
  .q-btn--outline {
    .q-btn__wrapper:before {
      border: 1px solid $borderColor !important;
    }
    .q-btn__content {
      color: #000;
    }
  }
}
</style>
