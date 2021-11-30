<template>
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <div class="search-form-panel">
        <q-toolbar class="bg-white">
          <q-btn flat icon="keyboard_arrow_left" @click="hideSearchPanel" />
          <q-toolbar-title>
            <q-input dense standout v-model="query" input-class="text-left" class="">
              <template v-slot:append>
                <q-icon v-if="query === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="query = ''" />
              </template>
            </q-input>
          </q-toolbar-title>
          <q-btn
            unelevated
            :label="searchLabel"
            color="accent"
            @click="toSearch"
          />
        </q-toolbar>
      </div>
    </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      maximizedToggle: true,
      query: ''
    }
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    searchLabel: function () {
      return this.$i18n.t('$common.$labels.search')
    },
    dialog: {
      get: function () {
        return this.isShow
      },
      set: function () {
      }
    }
  },
  methods: {
    hideSearchPanel () {
      this.dialog = false
      this.$emit('showSearch', false)
    },
    toSearch () {
      if (this.query) {
        this.hideSearchPanel()
        this.$router.push({ name: 'search', query: { q: this.query } })
      }
    }
  }
}
</script>
