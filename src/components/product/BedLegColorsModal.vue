<template>
  <div class="base-colors-popup">
    <div class="scroll">
      <div class="leg_colors_container">
        <ul>
          <li class="base-gold no-display">
            <h3>{{i18n('$common.$labels.$bedLegs.roundNatural')}}</h3>
            <img src="~assets/images/lightboxes/legs/Mandarin-Oriental-Leg-Options-Light.jpg">
          </li>
          <li class="base-platinum no-display">
            <h3>{{i18n('$common.$labels.$bedLegs.squareDark')}}</h3>
            <img src="~assets/images/lightboxes/legs/Mandarin-Oriental-Leg-Options-Dark.jpg">
          </li>
        </ul>
        <span class="grid">{{i18n('$common.$labels.$bedLegs.bottomText')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bedBaseColorsModal',
  methods: {
    i18n (value) {
      return this.$i18n.t(value)
    }
  }
}
</script>

<style lang="scss">
.bed-leg-modal {
  max-width: 70vw !important;
  @media screen and ($bp-768) {
    max-width: 400px !important;
  }
}
.base-colors-popup {
  width: 100%;
  font-size: 14px;
}
.leg_colors_container {
  width: 100%;
  height: 100%;
  display: block;
  padding-bottom: 40px;
  .grid {
    display: block;
    text-align: center;
  }
  ul {
    display: flex;
    justify-content: space-between;
    align-content: bottom;
    padding: 0 40px 10px;
    margin: 0;
    @media screen and ($bp-768) {
      flex-direction: column;
    }
    li {
      width: 49.75%;
      list-style: none;
      @media screen and ($bp-768) {
        width: 100%;
      }
      img {
        width: 100%;
        height: auto;
      }
      &.head {
        // font-family: $typography-secondary-heading;
        background: $primary;
        padding: 4px 0;
        color: $white;
      }
      h3 {
        font-size: 16px;
        text-align: center;
        padding-bottom: 10px;
      }
    }
  }
}

</style>
<style lang="scss">
@media screen and (max-width: 960px) {
  .size_chart_container {
    ul {
      width: 100%;
      min-width: 260px;
      padding: 0 10px;
      li {
        background: $white;
        display: block;
        &.head {
          display: none;
        }
        em {
          width: 100%;
          display: none;
          text-align: left;
          padding: 10px;
        }
        &.active {
          em {
            display: block;
          }
        }
      }
      em {
        &:nth-child(odd) {
          background-color: $brandgrey1;
        }
        &:nth-child(even) {
          background-color: $white;
        }
      }
    }
    .grid {
      display: none;
    }
  }
}
</style>
