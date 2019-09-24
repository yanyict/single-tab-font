<template>
  <div style="height:400px;" class="chart-box">
    <h-chart v-show="data.length" ref="chart" :id="id" :option="option"></h-chart>
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
        series: [{
          data: []
        }],
        xAxis: {
          categories: []
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
                  '总量: ' + this.y
          }
        },
        legend: {
          itemStyle: {
            fontWeight: '400'
          },
          enabled: false
        },
        colors: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', '#3436C7', '#F04864']
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
      default: () => []
    }
  },
  watch: {
    data (val, oldval) {
      this.option.xAxis.categories = []
      this.option.series[0].data = []
      val.forEach(function (element) {
        this.option.xAxis.categories.push(element.name)
        this.option.series[0].data.push(element.count)
      }, this)
      this.$refs.chart.refresh()
    }
  },
  mounted () {
    this.$props.data.forEach(function (element) {
      this.option.xAxis.categories.push(element.name)
      this.option.series[0].data.push(element.count)
    }, this)
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
