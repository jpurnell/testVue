<template>
  <div class="mobile-banner">
    <a :href="url">
      <div class="thumbnail">
        <img :src="bannerUrl" />
      </div>
      <div class="mobile-promotions" v-if="promotionLeft || promotionRight">
        <span>{{promotionLeft}}</span>
        <span>{{promotionRight}}</span>
      </div>
      <div v-if="linkText && !promotionLeft && !promotionRight" class="btn">
        <link-btn-2 :text="linkText" />
      </div>
      <div :class="['title', lang]">
        <h2>{{title}}</h2>
      </div>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import linkBtn2 from './../ui/Button2'

export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: 'Dream Up Tomorrow\'s Mischief'
    },
    url: {
      type: String,
      default: '#'
    },
    bannerUrl: {
      type: String,
      default: 'statics/img/home/hp-hero_mob.jpg'
    },
    linkText: {
      type: String,
      default: ''
    },
    promotionLeft: {
      type: String,
      default: ''
    },
    promotionRight: {
      type: String,
      default: ''
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
.mobile-banner {
  a {
    position: relative;
    display: block;
    width: 100%;
  }
  img {
    display: block;
    width: 100%;
  }
}
.title {
  padding: 0 70px 25px 20px;
  background: $white;
  position: relative;
  &:before {
    content: '';
    width: 100%;
    border-width: 0 0 30px 15px;
    border-style: solid;
    border-color: transparent transparent $white;
    position: absolute;
    left: 0;
    top: -30px;
  }
  h2 {
    margin: 0;
    font-size: 34px;
    line-height: 30px;
    color: $black;
  }
  &.zh-CN {
    h2 {
      line-height: 32px;
      font-weight: 400;
    }
  }
}
.mobile-promotions {
  width: 100%;
  position: absolute;
  top: 36%;
  right: 2%;
  padding: 12px 26px;
  font-size: 16px;
  font-family: $typography-font-family;
  background: $white;
  text-align: left;
  text-transform: uppercase;
  line-height: 22px;
  & > span {
    &:first-child {
      color: $primary;
    }
    &:last-child {
      color: $black;
    }
  }
}
.btn {
  position: absolute;
  top: 45%;
  right: 2%;
  .link-btn-2 {
    padding: 12px 26px;
    font-size: 13px;
  }
}
</style>
