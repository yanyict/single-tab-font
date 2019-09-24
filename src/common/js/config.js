// 日期选择题配置
export const pickerOptions = {
  shortcuts: [{
    text: '今天',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '近一周',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '近一个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '近三个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}

// 缓存的页面数组
export const keepAliveArr = ['RepositoryManager', 'DemandPage', 'TaskManager', 'EducationManager', 'SafePage', 'ProjectManagr', 'InstituTionManeger', 'AttendanceManager', 'ProblemManager', 'StuManager', 'TeaManager', 'BuildingManager', 'ClasstimeManager', 'CourseSelectManager', 'DepartmentManager', 'RoleManager', 'MenuManager', 'UrlManager', 'FunManager']
// export const keepAliveArr = []

// 背景颜色数组
export const bgColorList = ['#1890ff', '#ff8718', '#12c2c2', '#c872ff', '#f04864', '#2fc25b', '#f5c507', '#90b1db', '#e672ff', '#42c2fd']

export const fieldFormula = [
  {
    name: '求和', type: 'SUM', show: 'number'
  },
  {
    name: '平均值', type: 'AVG', show: 'number'
  },
  {
    name: '计数', type: 'COUNT', show: 'all'
  },
  {
    name: '去重计数', type: 'COUNT_DISTINCT', show: 'all'
  }
]
export const chartTipMap = {
  'onlyOne': '一个维度',
  '0orOne': '0个或一个',
  '0orMore': '0个或多个',
  'OneOrTwo': '1个或2个',
  'OneorMore': '1个或多个',
  'NoMoreThanTwo': '2个以内',
  'TwoorMore': '2个或多个',
  'OneDOneV': '1个维度 1个数值',
  '0DMoreV': '0个维度 多个数值',
  'OneOrTwoDOneV': '1个或2个维度 1个数值'
}
export const chartTypes = [
  {
    cate: 'table',
    type: 'icon-biaoge',
    name: '表格',
    dimension: '0orMore',
    metric: '0orMore',
    combination: [],
    status: false
  }, {
    cate: 'column',
    type: 'icon-zhuzhuangtu',
    name: '柱状图',
    dimension: 'OneorMore',
    metric: 'OneorMore',
    combination: [],
    status: false
  }, {
    cate: 'line',
    type: 'icon-zhexiantu',
    name: '折线图',
    dimension: 'onlyOne',
    metric: 'OneorMore',
    combination: [],
    status: false
  }, {
    cate: 'bar',
    type: 'icon-tiaoxingtu',
    name: '条形图',
    dimension: 'onlyOne',
    metric: 'OneorMore',
    combination: [],
    status: false
  }, {
    cate: 'pie',
    type: 'icon-tubiao08',
    name: '饼图',
    dimension: '',
    metric: '',
    combination: ['OneDOneV', '0DMoreV'],
    status: false
  }
]
