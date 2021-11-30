<template>
  <div>
    <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
      <div class="account-panel" v-show="switchAccount">
        <div>
          <q-tab-panels v-model="userPanel" animated class="tab-panels">
            <q-tab-panel name="login" class="tab-panel">
              <login-panel
                @showPanel="showPanel"
                @hasLogin="hasLogin"
              />
            </q-tab-panel>
            <q-tab-panel name="forgetpwd" class="tab-panel">
              <forget-pwd-panel
                @returnLogin="showPanel"
                @closeForgetPwdDialog="closePanel"
                :inDrawer="inDrawer"
                :isMobile="true"
              />
            </q-tab-panel>
            <q-tab-panel name="register" class="tab-panel">
              <register-panel
                @returnLogin="showPanel"
                @closeRegisterDialog="closePanel"
              />
            </q-tab-panel>
          </q-tab-panels>
          <div class="close" v-if="hasClose" @click="closePanel">
            <q-icon name="icon-close" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import loginPanel from './LoginPanel'
import registerPanel from './RegisterPanel'
import forgetPwdPanel from './ForgetPwdPanel'

export default {
  name: 'AccountForm',
  components: {
    'login-panel': loginPanel,
    'register-panel': registerPanel,
    'forget-pwd-panel': forgetPwdPanel
  },
  data () {
    return {
      isLogin: false,
      userPanel: 'login'
    }
  },
  props: {
    switchAccount: {
      type: Boolean,
      default: false
    },
    hasClose: {
      type: Boolean,
      default: false
    },
    inDrawer: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    switchAccount: function (newVal, oldVal) {
      this.userPanel = 'login'
      if (newVal) {
        this.initAccount()
      }
    }
  },
  methods: {
    initAccount () {
      this.checkLogin()
    },
    checkLogin () {
      this.isLogin = parseInt(this.$q.cookies.get('isLogin'), 10) === 1 || false
    },
    showPanel (status) {
      this.userPanel = status
    },
    hasLogin () {
      this.isLogin = true
      this.$emit('hasLogin')
    },
    closePanel () {
      this.$emit('hideAccount')
    }
  }
}
</script>

<style lang="scss" scoped>
.account-panel {
  width: 50%;
  height: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, $white 0, rgba(255,255,255,0.9) 100%);
  box-shadow: -7px 0 34px -11px rgba(0,0,0,0.52);
  position: fixed;
  top: 0;
  right: 0;
  & > div {
    height: calc(97% - 140px);
    margin: 140px 15% 3%;
    overflow: auto;
  }
}
.tab-panels {
  background: transparent;
}
.tab-panel {
  padding: 0;
}
.close {
  position: absolute;
  right: 2%;
  top: 1%;
  cursor: pointer;
  .q-icon {
    font-size: 33px;
    line-height: 33px;
  }
}
@media screen and (max-width: 960px) {
  .account-panel {
    & > div {
      height: calc(97% - 80px);
      margin: 80px 4% 3%;
    }
  }
}
@media screen and (max-width: 660px) {
  .account-panel {
    width: 100%;
  }
}
</style>
