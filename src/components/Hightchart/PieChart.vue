<template>
  <div style="height:400px;" class="chart-box">
    <h-chart v-show="data.length" ref="chart" :id='id' :option='option'></h-chart>
    <div v-show="!data.length" class="empty-data">
      <img src="../../assets/img/img-empty.png">
      <span>暂无数据</span>
    </div>
  </div>
</template>
<script>
import HChart from './Chart'
export default {
  components: {
    HChart
  },
  data () {
    return {
      option: {
        chart: {
          type: 'pie'
        },
        title: {
          text: ''
        },
        series: [{
          name: '资产类型占比',
          data: []
        }],
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        legend: {
          itemStyle: {
            fontWeight: '500'
          }
        },
        colors: ['#3aa0ff', '#36cbcb', '#4ecb73', '#fad337', '#f2637b']
      }
    }
  },
  props: {
    id: {
      type: String,
      default: 'hchart2'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data (val, oldval) {
      if (val.length !== 0) {
        this.option.series[0].data = []
        val.forEach(function (element) {
          this.option.series[0].data.push(element)
        }, this)
        this.$refs.chart.refresh()
      } else {
        this.option.series[0].data = []
        this.$refs.chart.refresh()
      }
    }
  },
  mounted () {
    // console.info('in pie chart:' + JSON.stringify(this.$props.data))
    this.$props.data.forEach(function (element) {
      this.option.series[0].data.push(element)
    }, this)
    // console.info('in pie chart:' + JSON.stringify(this.option))
    this.$refs.chart.refresh()
  },
  methods: {
    getSVG () {
      return this.$refs.chart.getSVG()
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-box {
  .empty-data {
    text-align: center;
    img {
      margin-top: 150px;
    }
    span {
      display: block;
      color: #c8c8c8;
    }
  }
}
</style>
