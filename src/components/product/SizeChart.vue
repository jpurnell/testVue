<template>
  <div class="size-chart">
    <div class="scroll">
      <!-- <div v-html="sizeChart"></div> -->
      <div class="size_chart_container">
        <ul>
          <li class="head">
            <em class="title" v-for="(item, index) in sizeChartHtml.title" :key="index">{{item}}</em>
          </li>
          <li :class="['size', index === showIndex ? 'active' : '']" v-for="(col, index) in sizeChartHtml.data" :key="index">
            <em :class="['em', key2 === 0 ? 'subTitle' : '']" v-for="(item, key2) in col" :key="key2" @click="showSize(index)">
              <span class="bs-label">{{sizeChartHtml.title[key2]}}</span>{{item}}
            </em>
          </li>
        </ul>
        <span class="grid">{{sizeChartHtml.desc}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sizeChart',
  data () {
    return {
      showIndex: 0
    }
  },
  props: {
    sizeChartHtml: {
      type: Object,
      default: function () {}
    }
  },
  computed: {
    sizeChart: function () {
      // console.log('sizechart computed sizeChartHtml',  this.sizeChartHtml)
      return this.sizeChartHtml
    }
  },
  methods: {
    showSize: function (index) {
      this.showIndex = index
    }
  }
}
</script>

<style lang="scss">
.size-chart {
  width: 100%;
  font-size: 14px;
}
.size_chart_container {
  width: 100%;
  height: 100%;
  display: block;
  padding-bottom: 40px;
  .grid {
    display: block;
    text-align: center;
  }
  ul {
    display: table;
    padding: 0 40px 10px;
    margin: 0;
    li {
      display: table-row;
      em {
        display: table-cell;
        padding: 10px;
        line-height: 1.3em;
        font-style: normal;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        font-weight: 100;
        &.subTitle {
          text-align: left;
          // font-family: $typography-secondary-heading;
        }
      }
      &.head {
        // font-family: $typography-secondary-heading;
        background: $secondary;
        padding: 4px 0;
        color: $white;
      }
      &.size {
        color: $black;
        &:nth-child(odd) {
          background-color: $borderColor;
        }
      }
    }
    .title {
      width: 12%;
    }
    .bs-label {
      display: none;
      font-weight: 600;
    }
    em {
      padding: 20px 10px 10px;
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
          .bs-label {
            display: block;
          }
          &.subTitle {
            background: $primary;
            color: $white;
            cursor: pointer;
            display: block;
            border-bottom: 2px solid $white;
          }
        }
        &.active {
          em {
            display: block;
          }
        }
      }
      em {
        &:nth-child(odd) {
          background-color: $borderColor;
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
