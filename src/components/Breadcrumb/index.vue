<template>
  <div class="breadcrumb-box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in levelList" :to="{ path: item.path }" :replace="true" :key="item.path" >{{item.meta.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>

export default {
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: []
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () { // 构建路由记录
      let routerArr = this.$router.options.routes[1].children
      let levelList = []
      let arr = this.$route.path.slice(1).split('/')
      let historyStr = ''
      let historyArr = []
      arr.map(item => {
        historyStr += '/' + item
        historyArr.push(historyStr.slice(1))
      })
      historyArr.splice(0, 1)
      historyArr.map(item => {
        routerArr.map(route => {
          if (item === route.path) {
            if (route.path.indexOf('create') > -1) {
              route.meta.name = this.$route.query.id ? '编辑' : '新增'
            }
            levelList.push(Object.assign({}, route, {
              path: `/${route.path}`
            }))
          }
        })
      })
      this.levelList = levelList
    }
  }
}
</script>

<style lang="scss">
.breadcrumb-box {
  .el-breadcrumb {
    padding-left: 54px;
    line-height: 38px;
  }
}
</style>
