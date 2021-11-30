<template>
  <swiper ref="mySwiper" @ready="handleSwiperReadied" :options="swiperOption" class="gallery" @click-slide="openFullScreen">
    <swiper-slide class="kv" v-for="(kv, index) in currentGallery" :key="index" :name="index">
      <div class="slide-content">
        <img :src="kv" />
      </div>
    </swiper-slide>
    <div class="swiper-button-prev" slot="button-prev" v-show="currentGallery.length > 1"></div>
    <div class="swiper-button-next" slot="button-next" v-show="currentGallery.length > 1"></div>
  </swiper>
</template>

<script>
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
  props: {
    currentGallery: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    currentGallery: function (newVal, oldVal) {
      this.swiper.slideTo(1, 1000, false)
    }
  },
  computed: {
    swiper: function () {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    openFullScreen () {
      this.$emit('openFullScreen', this.swiper.realIndex)
    },
    handleSwiperReadied () {
      console.log('swiper ready')
    }
  }
}
</script>

<style lang="scss" scoped>
.kv {
   width: 100%;
}
.slide-content {
   img {
      display: block;
      width: 100%;
   }
}
</style>

<style lang="scss">
.gallery .swiper-button-prev,
.gallery .swiper-button-next {
   color: $primary;
}
</style>
