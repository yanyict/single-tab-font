<template>
  <div class="x-bar">
    <div :id="id" :option="option"></div>
  </div>
</template>
<script>

// import HighCharts from 'highcharts'
var HighCharts = require('highcharts')
// require('highcharts/highcharts-more')(HighCharts)
// require('highcharts/modules/drilldown')(HighCharts)
// require('highcharts/modules/solid-gauge')(HighCharts)
// require('highcharts/modules/exporting')(HighCharts)
// require('highcharts/modules/offline-exporting')(HighCharts)

// require('highcharts/modules/export-data')(HighCharts)
// HighCharts.setOptions({
//   // fixed Chinese lang options
//   lang: {
//     printChart: '打印图表',
//     downloadJPEG: '导出JPEG图片',
//     downloadPDF: '导出PDF文档',
//     downloadPNG: '导出PNG图片',
//     downloadSVG: '导出SVG图片',
//     downloadCSV: '导出CSV文档',
//     downloadXLS: '导出XLS文档',
//     viewData: '查看数据'
//   }
// })
// import 'highcharts/highcharts-more'
// require('highcharts-solid-gauge')(HighCharts)
// import HighchartsNoData from 'highcharts/modules/solid-gauge'
// HighchartsNoData(HighCharts)
export default {
  // 验证类型
  data () {
    return {
      chart: null
    }
  },
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  watch: {
    option (val) {
      // console.info('option...change....')
      this.chart = new HighCharts.Chart(this.id, this.option)
    }
  },
  methods: {
    refresh () {
      // console.info('sdsdgfg111sfgsdfgdf')
      // console.info(JSON.stringify(this.$props['option']))
      this.chart = new HighCharts.Chart(this.id, this.option)
      // let strSvg = this.chart.getSVG()
      // console.info(strSvg)
    },
    drilldown (point, series) {
      // console.info('drill down....' + JSON.stringify(point))
      this.chart.addSeriesAsDrilldown(point, series)
    },
    getSVG () {
      // console.info('....' + this.chart.getSVG())
      return this.chart.getSVG()
    }
  },
  mounted () {
    // console.info('...in h chart')
    // let temp = this
    // let dafaultMenuItem = HighCharts.getOptions().exporting.buttons.contextButton.menuItems
    this.option.credits = { enabled: false }
    this.option.exporting = {
      sourceWidth: 600,
      sourceHeight: 400,
      scale: 2
      // ,
      // buttons: {
      //   contextButton: {
      //     // 自定义导出菜单项目及顺序
      //     menuItems: [
      //       dafaultMenuItem[2],
      //       dafaultMenuItem[3],
      //       dafaultMenuItem[4],
      //       dafaultMenuItem[5],
      //       dafaultMenuItem[1],
      //       dafaultMenuItem[7],
      //       dafaultMenuItem[8]
      //     ]
      //   }
      // }
    }
    setTimeout(function () {
      // temp.chart = new HighCharts.Chart(temp.id, temp.option)
    }, 30)
  }
}
</script>
