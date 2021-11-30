<template>
  <div class="search-form">
    <div class="search-form-field">
      <q-input
        outlined
        square
        dense
        v-on:keyup.13="toSearch"
        autocomplete="false"
        v-model="query"
        :placeholder="searchLabel"
      >
        <template v-slot:append>
          <q-icon v-if="query !== ''" name="icon-close" class="cursor-pointer" @click="query = ''" />
        </template>
      </q-input>
    </div>
    <link-btn-2 :text="searchBtn" @click="toSearch" :extraClass="'button left'" />
  </div>
</template>

<script>
import linkBtn2 from './../ui/Button2'
export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      query: ''
    }
  },
  computed: {
    searchLabel: function () {
      return this.$i18n.t('$common.$labels.search2')
    },
    searchBtn: function () {
      return this.$i18n.t('$common.$labels.search')
    }
  },
  methods: {
    toSearch () {
      if (this.query) {
        this.$router.push({ name: 'search', query: { q: this.query } })
        this.$emit('showSearch', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  .search-form-field {
    width: 350px;
  }
  .link-btn-2 {
    height: 50px;
  }
  @media screen and (max-width: 660px) {
    flex-direction: column;
    .search-form-field {
      width: 100%;
    }
  }
}
@media screen and (max-width: 480px) {
  .search-form {
    flex-direction: column;
    .search-form-field {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.search-form-field {
  .q-field {
    font-size: 13px;
    .q-field__control {
      height: 50px;
      &:before {
        border-color: $black;
      }
    }
  }
}
.search-form-field .q-field__control,
.search-form-field .q-field__marginal {
  height: 50px;
}
.search-form-field .q-field__native,
.search-form-field .q-field__prefix,
.search-form-field .q-field__suffix,
.search-form-field .q-field__input {
  padding: 10px 12px;
  color: $black;
  line-height: 50px;
  text-transform: uppercase;
}
</style>
