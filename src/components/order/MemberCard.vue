<template>
  <div class="membership-card">
    <h3>{{ memberCardTitle }}</h3>
    <div class="container">
      <div class="field">
        <template v-show="!submitted">
          <label>{{memberCardLabel}}</label>
          <q-input
            outlined
            square
            clearable
            clear-icon="icon-close"
            @blur="showInputClear('memberCard', false)"
            @focus="showInputClear('memberCard', true)"
            dense
            bg-color="white"
            standout="bg-white text-black"
            v-model="memberCard" />
          <link-btn-2 :text="btnText" @click="submit" />
        </template>
      </div>
      <div class="action">
        <p class="member-card-tips">{{ memberCardTips }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { saveMemberCard } from './../../api/api'
import linkBtn2 from './../ui/Button2'

export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      orderId: '',
      memberCard: '',
      clearable: {
        memberCard: false
      },
      submitted: false
    }
  },
  computed: {
    memberCardTitle: function () {
      return this.$i18n.t('$mar-common.memberCardTitle')
    },
    memberCardLabel: function () {
      return this.$i18n.t('$mar-common.memberCardLabel')
    },
    memberCardTips: function () {
      return this.$i18n.t('$mar-common.memberCardTips')
    },
    btnText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    memberCardRequired: function () {
      return this.$i18n.t('$mar-common.memberCardRequired')
    },
    memberCardValidation: function () {
      return this.$i18n.t('$mar-common.memberCardValidation')
    },
    memberCardSuccess: function () {
      return this.$i18n.t('$mar-common.memberCardSuccess')
    },
    memberCardError: function () {
      return this.$i18n.t('$mar-common.memberCardError')
    }
  },
  methods: {
    submit () {
      let formdata = {
        increment_id: this.orderId,
        member_card_no: this.memberCard
      }
      if (this.memberCard === null || this.memberCard === '') {
        this.$q.notify({
          message: this.memberCardRequired,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        return
      }
      if (isNaN(this.memberCard)) {
        this.$q.notify({
          message: this.memberCardValidation,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        return
      }
      console.log('after return')
      if (this.orderId && !isNaN(this.memberCard)) {
        saveMemberCard(formdata).then(data => {
          this.$q.notify({
            message: this.memberCardSuccess,
            position: 'center',
            timeout: '3000',
            classes: 'notify'
          })
        }).catch(error => {
          console.log(error)
          this.$q.notify({
            message: this.memberCardError,
            position: 'center',
            timeout: '3000',
            classes: 'notify'
          })
        })
      }
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    }
  },
  mounted () {
    this.orderId = this.$q.sessionStorage.getItem('createdOrderId')
  }
}
</script>

<style lang="scss">
.membership-card {
  h3 {
    padding: 0 3%;
    margin: 0;
  }
  .container {
    padding: 3%;
  }
  .field {
    margin: 0 0 3%;
    display: flex;
    align-items: center;
    & > label {
      padding-right: 7px;
    }
  }
  .member-card-tips {
    margin: 1em 0;
    font-size: 0.8em;
  }
  @media screen and (max-width: 660px) {
    .field {
      flex-direction: column;
      align-items: flex-start;
      & > label {
        width: 100%;
        margin-bottom: 10px;
      }
      & > div {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
.membership-card .field .q-field--dense .q-field__control,
.membership-card .field .q-field--dense .q-field__marginal {
  height: 45px;
}
</style>
