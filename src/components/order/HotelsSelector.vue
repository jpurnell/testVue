<template>
  <div class="hotels-selector">
    <h2>{{hotelsTitle}}</h2>
    <div class="container">
      <div v-if="!submited">
        <div class="field">
          <label class="filter">{{filtersLabel}}</label>
          <q-select
            square
            dense
            outlined
            :clearable="countrySelector && clearable.countrySelector"
            v-model="countrySelector"
            :options="countryOptions"
            :option-value="opt => opt === null ? null : opt.value"
            :option-label="opt => countryOptionLabel(opt)"
            emit-value
            map-options
            @blur="showInputClear('countrySelector', false)"
            @focus="showInputClear('countrySelector', true)"
            bg-color="white"
            standout="bg-white text-black"
            lazy-rules
            class="field"
          />
        </div>
        <div class="field">
          <label>{{hotelsLabel}}</label>
          <q-select
            square
            dense
            outlined
            :clearable="hotelSelector && clearable.hotelSelector"
            v-model="hotelSelector"
            :options="hotelOptions"
            :option-value="opt => Object(opt) === opt && 'hotel_id' in opt ? opt.hotel_id : null"
            :option-label="opt => hotelOptionLabel(opt)"
            emit-value
            map-options
            @blur="showInputClear('hotelSelector', false)"
            @focus="showInputClear('hotelSelector', true)"
            bg-color="white"
            standout="bg-white text-black"
            lazy-rules
            class="field"
          />
        </div>
        <div class="action" v-show="hotelSelector">
          <link-btn-2 :text="submitText" @click="toSaveHotel" />
        </div>
      </div>
      <div v-if="submited">
        <div>
          <p>{{thankSurveyText}}</p>
        </div>
        <div>
          <p>{{yourSelectText}}: {{selectedName}}</p>
        </div>
        <div class="action">
          <link-btn-2 :text="startOverText" @click="showSurvey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { countryHotelsEN } from './../../config/china.address'
import { hotelsList, saveHotel } from './../../api/api'
import linkBtn2 from './../ui/Button2'

export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      orderId: '',
      countrySelector: '',
      hotelSelector: '',
      hotelOptions: [],
      clearable: {
        countrySelector: false,
        hotelSelector: false
      },
      submited: false,
      selectedName: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    countryRegionLabel: function () {
      return this.$i18n.t('$common.$labels.countryRegion')
    },
    countryOptions: function () {
      return countryHotelsEN
    },
    hotelsTitle: function () {
      return this.$i18n.t('$common.$headings.hotelsTitle')
    },
    filtersLabel: function () {
      return this.$i18n.t('$common.$labels.countryRegion') + ':'
    },
    hotelsLabel: function () {
      return this.$i18n.t('$common.$labels.hotelsLabel')
    },
    hotelsSelectDefault: function () {
      return this.$i18n.t('$common.$labels.selectHotel')
    },
    submitText: function () {
      return this.$i18n.t('$common.$buttons.submit')
    },
    thankSurveyText: function () {
      return this.$i18n.t('$common.$validation.thankForSurvey')
    },
    yourSelectText: function () {
      return this.$i18n.t('$common.youSelected')
    },
    startOverText: function () {
      return this.$i18n.t('$common.$buttons.startOver')
    }
  },
  watch: {
    countrySelector: function (newVal, oldVal) {
      if (newVal) {
        this.initHotels()
      } else {
        this.hotelOptions = []
      }
    }
  },
  methods: {
    initHotels () {
      this.hotelSelector = ''
      let formdata = {
        country: this.countrySelector
      }
      hotelsList(formdata).then(data => {
        console.log(data)
        this.hotelOptions = data
      }).catch(error => {
        console.log(error)
      })
    },
    countryOptionLabel (opt) {
      console.log('label', opt)
      if (opt) {
        return opt.label
      } else {
        return this.countryRegionLabel
      }
    },
    hotelOptionLabel (opt) {
      console.log(opt)
      if (Object(opt) === opt && 'hotel_name' in opt && 'chinese_name' in opt) {
        if (this.lang !== 'en' && opt.chinese_name && opt.chinese_name.toLowerCase() !== 'null') {
          this.selectedName = opt.chinese_name
          return opt.chinese_name
        } else {
          this.selectedName = opt.hotel_name.toUpperCase()
          return opt.hotel_name.toUpperCase()
        }
      } else {
        return this.hotelsSelectDefault
      }
    },
    toSaveHotel () {
      let formdata = {
        order_id: this.orderId,
        hotel_id: this.hotelSelector
      }
      if (this.orderId && this.hotelSelector) {
        saveHotel(formdata).then(data => {
          console.log(data)
          // this.$q.notify({
          //   message: this.$i18n.t('$common.$validation.success'),
          //   position: 'center',
          //   timeout: '3000',
          //   classes: 'notify'
          // })
          this.submited = true
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.selectOption'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      }
    },
    showInputClear (key, val) {
      this.clearable[key] = val
    },
    showSurvey () {
      this.submited = false
    }
  },
  mounted () {
    this.orderId = this.$q.sessionStorage.getItem('createdOrderId')
  }
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 0 0 3%;
}
.container {
  padding: 3%;
  border: 1px solid $borderColor;
}
.field {
  margin: 0 0 3%;
  label {
    display: block;
    margin-bottom: 10px;
  }
}
.field {
  display: inline-block;
  min-width: 250px;
  width: 100%;
  @media screen and (#{$bp-660}) {
    display: block;
    width: 100%;
    margin-bottom: 0;
    padding-bottom: 7px;
  }
}
@media screen and (max-width: 768px) {
  .action {
    .link-btn-2 {
      width: 100%;
    }
  }
}
</style>
