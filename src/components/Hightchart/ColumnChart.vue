<template>
  <div style="height:400px;">
    <h-chart ref="chart" :id='id' :option='option'></h-chart>
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
      databox1: [],
      option: {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              allowOverlap: true // 允许数据标签重叠
            }
          }
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        series: [],
        xAxis: {
          categories: []
        },
        legend: {
          itemStyle: {
            fontWeight: '400'
          },
          enabled: true
        },
        colors: ['#3aa0ff', '#36cbcb', '#4ecb73', '#fad337', '#f2637b']
      }
    }
  },
  props: {
    id: {
      type: String,
      default: 'hchart1'
    },
    data: {
      type: Array,
      default: () => { }
    }
  },
  watch: {
    data (val, oldval) {
      this.option.xAxis.categories = []
      this.option.series = []
      if (val.length !== 0) {
        this.option.xAxis.categories = val[0].name
        val.forEach(function (element) {
          this.option.series = element.data2
        }, this)
        this.$refs.chart.refresh()
      } else {
        this.option.xAxis.categories = []
        this.option.series = []
        this.$refs.chart.refresh()
      }
    }
  },
  mounted () {
    // console.info('in columb chart:' + JSON.stringify(this.$props.data))
    this.option.xAxis.categories = (this.$props.data[0] && this.$props.data[0].name) || ''
    this.$props.data.forEach(function (element) {
      this.option.series = element.data2
    }, this)
    // console.info('in columb chart:' + JSON.stringify(this.option))
    this.$refs.chart.refresh()
  },
  methods: {
    // datach () {
    //   this.option.series[0].data = []
    //   this.$props.data.forEach(function (element) {
    //   // console.info('...' + element.row + '.....' + element.column)
    //     this.option.xAxis.categories.push(element.row)
    //     this.option.series[0].data.push(element.column)
    //   }, this)
    // // console.info('in columb chart:' + JSON.stringify(this.option))
    //   this.$refs.chart.refresh()
    //   return this.$props.data
    // },
    getSVG () {
      return this.$refs.chart.getSVG()
    }
  }
}
</script>
