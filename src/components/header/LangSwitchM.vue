<template>
  <div>
    <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
      <div class="lang-panel" v-show="isShow">
        <div>
          <lang-list :is-show="isShow" @hideRightDrawer="closePanel" />
          <q-btn flat icon="icon-close" class="close-btn" v-if="hasClose" @click="closePanel" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import langList from './LangListEU'
export default {
  name: 'lang-switch',
  components: {
    'lang-list': langList
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    hasClose: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closePanel () {
      this.$emit('hideLang')
    }
  }
}
</script>

<style lang="scss" scoped>
.lang-panel {
  width: 50%;
  height: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, $white 0, rgba(255,255,255,0.9) 100%);
  box-shadow: -7px 0 34px -11px rgba(0,0,0,0.52);
  position: fixed;
  top: 0;
  right: 0;
  font-size: 1.5em;
  & > div {
    height: calc(97% - 140px);
    margin: 140px 2% 3% 20%;
    overflow: auto;
  }
}
.close {
  position: absolute;
  right: 3%;
  top: 3%;
  cursor: pointer;
  .q-icon {
    font-size: 33px;
    line-height: 33px;
  }
}
@media screen and (max-width: 960px) {
  .lang-panel {
    & > div {
      height: calc(97% - 80px);
      margin: 80px 15% 3% 15%;
    }
  }
}

@media screen and (max-width: 660px) {
  .lang-panel {
    width: 100%;
  }
}
</style>
