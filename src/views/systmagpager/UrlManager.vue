<!-- URL管理 -->
<template>
  <div class="base-box url-manager-box">
    <div class="header">
      <el-button v-if="_hasPermission('btnAdd')" @click="insertOptions" icon="el-icon-plus" type="primary">新增URL</el-button>
      <div>
        <el-input style="width: 250px;" v-model.trim="searchContent" placeholder="请输入关键字搜索">
          <i style="margin: 13px 0 0 0" class="el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.No}}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL">
        <template slot-scope="scope">
          <el-input v-show="scope.row.show" size="small" v-model.trim="scope.row.url" placeholder="请输入内容" :maxlength="50" clearable></el-input>
          <span v-show="!scope.row.show">{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <el-input v-show="scope.row.show" size="small" v-model="scope.row.name" placeholder="请输入内容" :maxlength="50" clearable></el-input>
          <span v-show="!scope.row.show">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div v-show="!scope.row.show">
            <el-button v-if="_hasPermission('btnEdit')" type="text" size="small" @click="handleEditer(scope.$index, scope.row)">编辑</el-button>
            <div class="my-line"></div>
            <el-popover
              width="200"
              trigger="click"
              v-model="scope.row.delViewVisible">
              <p><i class="el-icon-question warning"></i>  确定删除 {{scope.row.name}} 该URL吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button v-if="_hasPermission('btnDel')" slot="reference" type="text" size="small" @click="scope.row.delViewVisible = true">删除</el-button>
            </el-popover>
          </div>
          <div v-show="scope.row.show">
            <el-button size="small" @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button size="small" @click="handleCancel(scope.$index, scope.row)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { hasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqUrlList, reqAddUrl, reqDelUrl, reqUpdateUrl, reqGetFunPeofession } from 'api/systmanager'
export default {
  name: 'UrlManager',
  data () {
    return {
      funRoleData: [],
      tableData: [],
      itemData: {},
      searchContent: '',
      params: {
        keyWord: '',
        pageIndex: 1,
        pageSize: 10
      },
      currentIndex: 1,
      total: 0,
      loading: false
    }
  },
  created () {
    this._loadData()
    this._getfunRoleData()
  },
  mounted () {
  },
  watch: {
    searchContent () {
      let timer
      if (timer) { // 优化搜索请求
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.handleIconSearchClick()
      }, 500)
    }
  },
  methods: {
    _hasPermission (tag) {
      return hasPermission(this.funRoleData, tag)
    },
    _getfunRoleData () { // 获取用户功能权限
      reqGetFunPeofession(this.$route.path).then(res => {
        if (res.resultCode === ERR_OK) {
          this.funRoleData = res.data
        }
      })
    },
    _loadData () { // 加载列表
      this.loading = true
      reqUrlList(this.params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data.data) {
          let tableData = res.data.data
          let No = (res.data.pageIndex - 1) * res.data.pageSize
          tableData.map(item => {
            item.show = false
            item.delViewVisible = false
            item.No = ++No
          })
          this.tableData = tableData
          this.pageSize = res.data.pageSize
          this.total = res.data.count
        }
      })
    },
    insertOptions () { // 新增
      let item = { No: '', id: '', name: '', url: '', show: true }
      this.tableData.splice(0, 0, item)
    },
    handleEditer (index, row) { // 编辑
      this.itemData = JSON.parse(JSON.stringify(row))
      row.show = !row.show
    },
    handleDelete (index, row) { // 删除
      let params = 'id=' + row.id
      reqDelUrl(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1500
          })
          this._loadData()
        }
      })
    },
    handleCancel (index, row) { // 取消
      if (!row.id) {
        this.tableData.splice(index, 1)
      }
      Object.assign(row, this.itemData)
      row.show = false
    },
    handleSave (index, row) { // 保存
      if (row.rule) {
        return
      }
      let params = {
        id: row.id,
        name: row.name,
        url: row.url
      }
      if (!row.id) {
        reqAddUrl(params).then(res => { // 新增
          if (res.resultCode === ERR_OK) {
            this._loadData()
            this.$message({
              type: 'success',
              message: '新增成功!',
              duration: 1500
            })
          }
        })
      } else {
        reqUpdateUrl(params).then(res => { // 更新
          if (res.resultCode === ERR_OK) {
            row.show = false
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 1500
            })
          }
        })
      }
    },
    handleIconSearchClick () { // 搜索
      this.params.keyWord = this.searchContent
      this.params.pageIndex = 1
      this._loadData()
    },
    change (index, row) { // 表单验证
      if (row.rule === undefined || row.rule === null) {
        this.$set(row, 'rule', false)
      }
      if (row.name.length > 50 || row.url.length > 50) { // 判断长度
        row.rule = true
        this.$message({
          type: 'error',
          message: '长度不能超过20',
          duration: 1500
        })
      } else {
        row.rule = false
      }
      if (!row.name || !row.url) {
        row.rule = true
      }
    },
    handleSizeChange (val) { // 改变显示条数
      this.params.pageIndex = 1
      this.params.pageSize = val
      this._loadData()
    },
    handleCurrentChange (val) { // 切换页面
      this.params.pageIndex = val
      this._loadData()
    }
  }
}
</script>

<style lang="scss">
.url-manager-box {
}
</style>
