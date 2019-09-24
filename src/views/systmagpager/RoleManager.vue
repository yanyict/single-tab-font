<!-- 角色管理 -->
<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <el-button v-if="isShowFunc('roleAdd')" size="small" @click="insertOptions" icon="el-icon-plus" type="primary">新增角色</el-button>
      <div>
        <el-input style="width: 250px;" size="small" v-model.trim="searchContent" placeholder="请输入内容">
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
      <el-table-column label="角色名称" width="180">
        <template slot-scope="scope">
          <el-input v-show="scope.row.show" size="small" v-model="scope.row.name" placeholder="请输入角色名称" :maxlength="20"></el-input>
          <span v-show="!scope.row.show">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <el-input v-show="scope.row.show" size="small" v-model="scope.row.describe" placeholder="请输入描述内容" :maxlength="50"></el-input>
          <span v-show="!scope.row.show">{{scope.row.describe}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          <span>{{scope.row.userCreate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div v-show="!scope.row.show">
            <btn>
              <el-button v-if="isShowFunc('rolePermission')" type="text" size="small" @click="configManager(scope.row)">权限配置</el-button>
            </btn>
            <btn>
              <el-button v-if="isShowFunc('roleEdit')" type="text" size="small" @click="handleEditer(scope.$index, scope.row)">编辑</el-button>
            </btn>
            <el-popover
              width="200"
              trigger="click"
              v-model="scope.row.delViewVisible">
              <p><i class="el-icon-question warning"></i>  确定删除 {{scope.row.name}} 该角色吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
              </div>
              <el-button v-if="isShowFunc('roleDel')" slot="reference" type="text" size="small" @click="scope.row.delViewVisible = true">删除</el-button>
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
import { formatDate, isHasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqRoleList, reqAddRole, reqDelRole, reqUpdateRole } from 'api/systmanager'
import Btn from 'components/Btn'
import { mapGetters } from 'vuex'

export default {
  name: 'RoleManager',
  components: {
    Btn
  },
  data () {
    return {
      tableData: [],
      itemData: {},
      searchContent: '',
      params: {
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
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
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
    configManager (row) {
      this.$router.push({ path: '/sys/rolemanager/rolepermission', query: { id: row.id, name: row.name } })
    },
    _loadData (name = '用户') { // 加载列表
      this.loading = true
      reqRoleList(this.params).then(res => {
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
      let date = Date.parse(new Date())
      let accessUser = this.user
      let userCreate = accessUser.account
      let item = { No: '', id: '', name: '', userCreate: userCreate, describe: '', gmtCreate: date, show: true }
      this.tableData.splice(0, 0, item)
    },
    handleEditer (index, row) { // 编辑
      this.itemData = JSON.parse(JSON.stringify(row))
      row.show = !row.show
    },
    handleDelete (index, row) { // 删除
      let params = 'id=' + row.id
      reqDelRole(params).then(res => {
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
      Object(row, this.itemData)
      row.show = false
    },
    handleSave (index, row) { // 保存
      if (row.rule) {
        return
      }
      let params = {
        id: row.id,
        name: row.name,
        tag: row.tag,
        describe: row.describe
      }
      if (!row.id) {
        reqAddRole(params).then(res => {
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
        reqUpdateRole(params).then(res => {
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
    handleIconSearchClick () {
      this.params.name = this.searchContent
      this.params.pageIndex = 1
      this._loadData()
    },
    handleSizeChange (val) { // 改变显示条数
      this.params.pageIndex = 1
      this.params.pageSize = val
      this._loadData()
    },
    handleCurrentChange (val) { // 切换页面
      this.params.pageIndex = val
      this._loadData()
    },
    isShowFunc (func) { // 查看是否有功能权限
      return isHasPermission(func)
    }
  }
}
</script>

<style lang="scss">
.role-manager-box {
}
</style>
