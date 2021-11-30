<template>
  <div class="banner-block">
    <a :href="linkUrl">
      <q-img :src="bannerUrl" :ratio="1440/1031" class="banner" />
      <q-img :src="bannerIpadUrl" :ratio="960/1026" class="banner-ipad" />
      <div class="slogan">
        <div class="mini-title">
          <span>{{heading1}}</span>
          <span>{{heading2}}</span>
        </div>
        <h2 :class="[lang]">
          <span v-for="(t, tindex) in title" :key="'title-' + tindex">{{t}}</span>
        </h2>
        <div class="content">{{content}}</div>
        <h5 class="link"><span>{{ btnText }}</span></h5>
      </div>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  props: {
    title: {
      type: Array,
      default: function () {
        return ['Dream Up Tomorrow\'s Mischief']
      }
    },
    heading1: {
      type: String,
      default: 'Complimentary Gift '
    },
    heading2: {
      type: String,
      default: 'With Purchase'
    },
    content: {
      type: String,
      default: 'Sleep becomes its own event when you knock-out on the coveted W Hotels Bed and bedding.'
    },
    btnText: {
      type: String,
      default: 'Shop Now'
    },
    linkUrl: {
      type: String,
      default: '#'
    },
    bannerUrl: {
      type: String,
      default: 'statics/img/home/hp-hero.jpg'
    },
    bannerIpadUrl: {
      type: String,
      default: 'statics/img/home/hp-hero-mob.jpg'
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  }
}
</script>

<style lang="scss" scoped>
.banner-block {
  position: relative;
}
.banner {
  display: block;
  width: 100%;
}
.slogan {
  width: 495px;
  position: absolute;
  left: 6.18%;
  top: 230px;
  background: rgba(255,255,255,0.85);
  padding: 35px 35px 3em 35px;
}
.mini-title {
  font-size: 24px;
  text-transform: uppercase;
  padding: 10px 0;
  line-height: 1;
  & > span {
    line-height: 1;
    color: $black;
    &:first-child {
      color: $accent;
    }
  }
}
h2 {
  font-size: 50px;
  line-height: 48px;
  margin-top: 14px;
  margin-bottom: 30px;
  color: $black;
  letter-spacing: 0.1px;
  padding: 0;
  span {
    display: block;
  }
  &.zh-CN {
    font-weight: 400;
  }
}
.content {
  color: $black;
  font-size: 16px;
  line-height: 20px;
  padding-bottom: 12px;
}
.link {
  display: block;
  margin: 0.75em 0 0;
  color: $accent;
  font-size: 22px;
  text-transform: uppercase;
  line-height: 16px;
  letter-spacing: 0.1px;
  position: relative;
  &:after {
    position: relative;
    display: inline-block;
    width: 0;
    padding: 6px;
    content: '';
    transition: transform 0.5s ease;
    transform: rotate(-45deg);
    transform-origin: 75% 75%;
    border: solid $accent;
    border-width: 0 0.8px 0.8px 0;
    right: -8px;
    top: -5px;
  }
}
@media screen and (min-width: 961px) {
  .banner {
    display: block;
  }
  .banner-ipad {
    display: none;
  }
}

@media screen and (max-width: 960px) {
  .banner {
    display: none;
  }
  .banner-ipad {
    display: block;
  }
}
</style>
