<template>
  <div class="homepage-box">
    <section v-loading="loading">
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in headerList"
          :key="item.title"
          :xl="6"
          :lg="6"
          :md="12"
          :sm="12"
          :xs="24"
          class="mar-bottom-space"
        >
          <section :class="['grid-content', `grid-content-bg-img${index + 1}`]">
            <p class="icon" :style="{background: item.bgColor}">
              <i :class="['iconfont', item.iconfont]"></i>
            </p>
            <div>
              <div class="title">{{item.title}}</div>
              <strong class="num">{{item.num}}</strong>
            </div>
          </section>
        </el-col>
      </el-row>
      <el-card class="homepage-middle-card mar-bottom-space">
        <div slot="header" class="flex-between homepage-flex">
          <span class="header-title">项目金额统计</span>
          <section>
            <el-select v-model="moneyModel" clearable  placeholder="请选择金额额度" @change="moneyChange">
              <el-option
                v-for="item in moneyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="dateModel"
              type="daterange"
              format="yyyy-MM-dd"
              :clearable="false"
              range-separator="~"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="dateChange"
            ></el-date-picker>
          </section>
        </div>
        <el-row :gutter="20">
          <el-col :lg="18" :md="16" :sm="24" :xs="24">
            <p>金额</p>
            <h-column-chart :data="columnChartData"></h-column-chart>
          </el-col>
          <el-col :lg="6" :md="8" :sm="24" :xs="24">
            <el-tabs v-model="tabActiveName">
              <el-tab-pane label="项目金额排名" name="first">
                <ul class="card-right" v-if="projectCostRankVOList.length">
                  <li
                    class="flex-between card-item card-item"
                    v-for="(item, index) in projectCostRankVOList"
                    :key="item.id"
                  >
                    <span class="font_cont">
                      <span class="card-item-no">{{index + 1}}</span>
                      {{item.name}}
                    </span>
                    <span>{{item.cost}}</span>
                  </li>
                </ul>
                <div v-else class="empty-data">
                  <img src="../../assets/img/img-empty.png">
                  <span>暂无数据</span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-card>
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xs="24" class="mar-bottom-space">
          <el-card class="homepage-middle-card">
            <div slot="header" class="flex-between homepage-flex">
              <span class="header-title">系统未解决问题统计</span>
            </div>
            <el-table
              stripe
              :data="tableData"
              class="my-table min-height-400"
            >
              <el-table-column
                v-for="(item, index) in tableHeaderList"
                :key="item.id"
                :label="item.name"
                :prop="item.name"
              >
                <template slot-scope="scope">
                  <p
                    :class="[index === 0 && (scope.$index !== tableData.length - 1) ? 'btn-active' : '' ]"
                    size="small"
                  >{{scope.row[item.name]}}</p>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xs="24" class="mar-bottom-space">
          <el-card class="homepage-middle-card">
            <div slot="header" class="flex-between homepage-flex">
              <span class="header-title">资产类型统计</span>
            </div>
            <h-pie-chart ref="hPieChart" :data="pieChartData"></h-pie-chart>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { reqStats, reqStatsProjectCost, reqStatsEquipment, reqStatsProblem } from 'api/homepager'
import { transformDate, shuffle } from 'common/js/utils'
import hColumnChart from 'components/Hightchart/SimpleColumnChart'
import hPieChart from 'components/Hightchart/PieChart'
export default {
  components: {
    hColumnChart,
    hPieChart
  },
  data () {
    return {
      loading: false,
      dateModel: [transformDate('week'), transformDate('yesterday')],
      params: {
        startCost: null,
        endCost: null,
        startDate: transformDate('week'),
        endDate: transformDate('yesterday')
      },
      tabActiveName: 'first',
      columnChartData: [],
      projectCostRankVOList: [],
      tableHeaderList: [],
      tableData: [],
      pieChartData: [],
      moneyList: [{
        value: 1,
        label: '10万元以下'
      }, {
        value: 2,
        label: '10万元到30万元'
      }, {
        value: 3,
        label: '30万元到50万元'
      }, {
        value: 4,
        label: '50万元以上'
      }],
      moneyModel: '',
      headerList: [
        {
          title: '项目数量',
          num: 0,
          iconfont: 'icon-xiangmu',
          bgColor: '#078ce7'
        },
        {
          title: '制度数量',
          num: 0,
          iconfont: 'icon-zhidufenleidingyi',
          bgColor: '#e7a007'
        },
        {
          title: '软件数量',
          num: 0,
          iconfont: 'icon-ruanjianfuwu',
          bgColor: '#13c2c2'
        },
        {
          title: '硬件数量',
          num: 0,
          iconfont: 'icon-yingjian',
          bgColor: '#c872ff'
        }
      ]
    }
  },
  methods: {
    loadStats () { // 获取基本统计信息
      this.loading = true
      reqStats().then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data) {
          this.headerList[0].num = res.data.projectCount
          this.headerList[1].num = res.data.regulationCount
          this.headerList[2].num = res.data.softwareCount
          this.headerList[3].num = res.data.hardwareCount
        }
      })
    },
    loadStatsProjectCost () { // 获取项目金额统计信息
      this.loading = true
      reqStatsProjectCost(this.params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data) {
          let projectCostRankVOList = res.data.projectCostRankVOList
          projectCostRankVOList.map(item => {
            item.count = item.cost
          })
          let tempArr = projectCostRankVOList.slice(0, 10)
          this.columnChartData = shuffle(tempArr)
          this.projectCostRankVOList = projectCostRankVOList
        }
      })
    },
    loadStatsProblem () { // 获取系统未解决问题统计信息
      reqStatsProblem().then(res => {
        if (res.resultCode === ERR_OK && res.data) {
          let tableHeaderList = [{ id: -1, name: '系统/设备' }, ...res.data.problemLevelVOList, { id: -2, name: '合计' }]
          this.tableHeaderList = tableHeaderList
          let tableData = res.data.statsVOList
          tableData.map(item => {
            let total = 0
            item.problemLevelVOList.map(problem => {
              item[problem.name] = problem.count
              total += problem.count
            })
            item['系统/设备'] = item.softwareName
            item['合计'] = total
          })
          this.tableData = tableData
        }
      })
    },
    loadStatsEquipment () { // 获取资产类型统计信息
      reqStatsEquipment().then(res => {
        if (res.resultCode === ERR_OK && res.data) {
          res.data.map(item => {
            item.y = item.count
          })
          this.pieChartData = res.data
        }
      })
    },
    dateChange (data) { // 选中日期
      if (!data.length) {
        return
      }
      this.params.startDate = data[0]
      this.params.endDate = data[1]
      this.loadStatsProjectCost()
    },
    moneyChange (value) { // 选中金额额度
      // 自定义金额额度
      if (value !== '') {
        const selectedMoneyAction = new Map([
          [1, [null, 10]],
          [2, [10, 30]],
          [3, [30, 50]],
          [4, [50, null]]
        ])
        let actions = selectedMoneyAction.get(value)
        this.params.startCost = actions[0]
        this.params.endCost = actions[1]
      } else {
        this.params.startCost = null
        this.params.endCost = null
      }
      this.loadStatsProjectCost()
    }
  },
  created () {
    this.loadStats()
    this.loadStatsProjectCost()
    this.loadStatsEquipment()
    this.loadStatsProblem()
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.homepage-box {
  padding: 20px;
  margin-bottom: 60px;
  .grid-content {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 100px;
    padding: 20px;
    background-color: $color-background;
    background-image: url("../../assets/img/index-icon1.png");
    background-repeat: no-repeat;
    background-position: right bottom;
    .icon {
      display: inline-block;
      width: 60px;
      height: 60px;
      margin-right: 10px;
      text-align: center;
      line-height: 60px;
      color: $color-text-l;
      border-radius: 50%;
      background: $color-theme;
      i {
        font-size: 36px;
      }
    }
    .num {
      color: $color-text-d;
      font-weight: 600;
      font-size: 30px;
    }
  }
  .grid-content-bg-img1 {
    background-image: url("../../assets/img/index-icon1.png");
  }

  .grid-content-bg-img2 {
    background-image: url("../../assets/img/index-icon2.png");
  }

  .grid-content-bg-img3 {
    background-image: url("../../assets/img/index-icon3.png");
  }

  .grid-content-bg-img4 {
    background-image: url("../../assets/img/index-icon4.png");
  }

  .mar-bottom-space {
    margin-bottom: 20px;
  }

  .homepage-middle-card {
    .homepage-flex {
      align-items: center;
      .header-title {
        font-size: $font-size-medium-x;
        align-items: center;
      }
    }
    .card-right {
      height: 375px;
      overflow: auto;
      padding-right: 20px;
      .card-item {
        margin-top: 16px;
        cursor: pointer;
        .card-item-no {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 20px;
          text-align: center;
        }
        &:nth-child(-n + 3) {
          .card-item-no {
            background-color: #314659;
            border-radius: 50%;
            color: #fff;
          }
        }
      }
    }
    .empty-data {
      text-align: center;
      img {
        margin-top: calc(50% - 65px);
      }
      span {
        display: block;
        color: #c8c8c8;
      }
    }
  }
}
</style>
