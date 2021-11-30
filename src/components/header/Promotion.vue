<template>
  <div v-if="promotionList.length > 0">
    <div class="promotions">
      <swiper ref="mySwiper" @ready="handleSwiperReadied" :options="swiperOption" class="promotion-slider">
        <swiper-slide class="kv" v-for="(item, index) in promotionList" :key="index" :name="index">
          <div class="slide-content">
            {{item}}
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev" v-show="promotionList.length > 1"></div>
        <div class="swiper-button-next" slot="button-next" v-show="promotionList.length > 1"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 1,
        autoplay: true,
        delay: 1000,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        spaceBetween: 0,
        loop: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      promotion: state => state.site.promotion.top_text
    }),
    promotionList: function () {
      if (this.promotion && this.promotion.indexOf('*') !== -1) {
        let lists = this.promotion.split('*')
        return lists
      } else {
        if (this.promotion) {
          return [this.promotion]
        } else {
          return []
        }
      }
    }
  },
  watch: {
    swiper: function () {
      return this.$refs.mySwiper.$swiper
    },
    lang: function (newVal, oldVal) {
      this.initData()
    },
    promotion: function (newVal, oldVal) {
      this.initData()
    }
  },
  methods: {
    initData () {
      console.log('top_text promotion', this.promotion)
    },
    handleSwiperReadied () {
      console.log('swiper ready')
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="stylus" scoped>
.promotions
  max-width: 480px;
  margin: 0 auto;
.slide-content
  padding: 0;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
@media screen and (max-width: 699px)
  .slide-content
    line-height: 50px;
    letter-spacing: 0.05em;
    font-size: 14px;
</style>

<style lang="stylus">
.promotion-slider
  .swiper-button-prev
  .swiper-button-next
    color: $grey;
    transform: scale(0.5);
</style>
