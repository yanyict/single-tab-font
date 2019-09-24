<template>
  <div class="base-box interface-manager-box" v-loading="loading">
    <el-row>
      <el-col :lg="4" :md="4" :sm="4" :xs="24">
        <section class="left-box">
          <el-tree
            class="my-tree"
            highlight-current
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expand-all="true"
            @node-click="handleNodeClick">
            <span class="flex-between my-custom-tree-node" slot-scope="{ node, data }">
              <span>
                <span v-show="!data.show">{{ data.name }}</span>
                <el-input v-show="data.show" size="small" v-model="data.name" placeholder="请输入内容" autofocus @blur="handleBlur(data)" :maxlength="10" clearable></el-input>
              </span>
              <span class="my-tree-node" v-show="!data.show">
                <el-button
                  v-if="data.id === -1 && isShowFunc('interfaceAdd')"
                  type="text"
                  size="mini"
                  @click="append(data)">
                  <i class="iconfont icon-xinzeng" title="新增子目录"></i>
                </el-button>
                <el-dropdown v-else trigger="click">
                  <i class="iconfont icon-xuanxiang main-color"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleRename(data)" v-if="isShowFunc('interfaceRename')">重命名</el-dropdown-item>
                    <el-dropdown-item @click.native="handleDelNode(data)" v-if="isShowFunc('interfaceDel')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </section>
      </el-col>
      <el-col :lg="20" :md="20" :sm="20" :xs="24">
        <section class="right-box">
          <header class="header">
            <el-button @click="insertOptions" size="small" icon="el-icon-plus" type="primary" v-if="isShowFunc('interfaceAdd')">新增接口</el-button>
            <div>
              <el-input style="width: 250px;" size="small" v-model.trim="searchContent" placeholder="请输入关键字搜索">
                <i style="margin: 13px 0 0 0" class="el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
              </el-input>
            </div>
          </header>
          <el-table :data="tableData" v-loading="loading" class="my-table">
            <el-table-column width="50"></el-table-column>
            <el-table-column label="接口名称">
              <template slot-scope="scope">
                <el-input v-show="scope.row.show" size="small" v-model="scope.row.name" placeholder="请输入内容" :maxlength="50" clearable></el-input>
                <span v-show="!scope.row.show">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="URL">
              <template slot-scope="scope">
                <el-input v-show="scope.row.show" size="small" v-model.trim="scope.row.url" placeholder="请输入内容" :maxlength="50" clearable></el-input>
                <span v-show="!scope.row.show">{{scope.row.url}}</span>
              </template>
            </el-table-column>
            <el-table-column label="权限验证" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.authCheck" @change="handleSave(scope.$index, scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-show="!scope.row.show">
                  <btn v-if="isShowFunc('interfaceEdit')">
                    <el-button type="text" size="small" @click="handleEditer(scope.$index, scope.row)">编辑</el-button>
                  </btn>
                  <!-- <el-popover
                    width="200"
                    trigger="click"
                    v-model="scope.row.delViewVisible">
                    <p><i class="el-icon-question warning"></i>  确定删除 <span>{{scope.row.name}}</span> 该接口吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
                      <el-button type="primary" size="mini" >确定</el-button>
                    </div> -->
                    <el-button  type="text" size="small" @click="handleDelete(scope.$index, scope.row)" v-if="isShowFunc('interfaceDel')">删除</el-button>
                  <!-- </el-popover> -->
                </div>
                <div v-show="scope.row.show">
                  <el-button size="small" @click="handleSave(scope.$index, scope.row)">保存</el-button>
                  <el-button size="small" @click="handleCancel(scope.$index, scope.row)">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { reqInterfaceTree, reqInterfaceList, reqAddInterface, reqUpdateInterface, reqDelInterface } from 'api/systmanager'
import { isHasPermission } from 'common/js/utils'
import Btn from 'components/Btn'
export default {
  name: 'InterfaceManager',
  components: {
    Btn
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'sub',
        label: 'name'
      },
      searchContent: '',
      selectTreeItem: {},
      tableData: [],
      itemData: {},
      loading: false
    }
  },
  watch: {
    searchContent () {
      let timer
      if (timer) { // 优化搜索请求
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this._loadInterfaceList()
      }, 500)
    }
  },
  created () {
    this._loadData()
  },
  methods: {
    _loadData () { // 加载接口树
      this.loading = true
      reqInterfaceTree().then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK) {
          let data = res.data
          data.map(item => {
            item.show = false
          })
          let tempArr = []
          let tempOjb = {
            id: -1,
            name: '接口树',
            sub: data,
            baseInterfaceDOs: []
          }
          tempArr.push(tempOjb)
          this.treeData = tempArr
        }
      })
    },
    _loadInterfaceList () { // 搜索列表
      if (this.checkClickInterfaceNode()) {
        return
      }
      let params = 'parentId=' + this.selectTreeItem.id + '&keyWord=' + this.searchContent
      this.loading = true
      reqInterfaceList(params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK) {
          let tempArr = res.data
          tempArr.map(item => {
            item.show = false
            item.delViewVisible = false
            item.authCheck = Boolean(item.authCheck)
          })
          this.tableData = tempArr
        }
      })
    },
    handleNodeClick (data) { // 选中接口树节点
      this.selectTreeItem = data
      let tempArr = JSON.parse(JSON.stringify(data.baseInterfaceDOs))
      tempArr.map(item => {
        item.show = false
        item.delViewVisible = false
        item.authCheck = Boolean(item.authCheck)
      })
      this.tableData = tempArr
    },
    insertOptions () { // 新增接口
      if (this.checkClickInterfaceNode()) {
        return
      }
      let item = { parentId: this.selectTreeItem.id, name: '', url: '', authCheck: false, show: true }
      this.tableData.splice(0, 0, item)
    },
    handleEditer (index, row) { // 编辑接口
      this.itemData = JSON.parse(JSON.stringify(row))
      row.show = true
    },
    handleDelete (index, row) { // 删除接口
      let params = 'id=' + row.id
      this.$confirm('确定删除选择的接口？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqDelInterface(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
            this.tableData.splice(index, 1)
            this.selectTreeItem.baseInterfaceDOs = this.tableData
          }
        })
      })
    },
    handleSave (index, row) { // 保存
      if (!row.id) {
        let params = {
          parentId: row.parentId,
          name: row.name,
          url: row.url,
          authCheck: Number(row.authCheck)
        }
        reqAddInterface(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '新增成功!',
              duration: 1500
            })
            res.data.authCheck = Boolean(res.data.authCheck)
            Object.assign(row, res.data)
            row.show = false
            this.selectTreeItem.baseInterfaceDOs = this.tableData
          }
        })
      } else {
        let params = {
          id: row.id,
          name: row.name,
          url: row.url,
          authCheck: Number(row.authCheck)
        }
        reqUpdateInterface(params).then(res => {
          if (res.resultCode === ERR_OK && res.data) {
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 1500
            })
            res.data.authCheck = Boolean(res.data.authCheck)
            Object.assign(row, res.data)
            row.show = false
            this.selectTreeItem.baseInterfaceDOs = this.tableData
          }
        })
      }
    },
    handleCancel (index, row) { // 取消编辑
      if (!row.id) {
        this.tableData.splice(index, 1)
      }
      Object.assign(row, this.itemData)
      row.show = false
    },
    handleRename (data) { // 重命名
      data.show = true
    },
    handleBlur (data) { // 失去焦点自动保存
      if (!data.name) {
        this.$message({
          type: 'error',
          message: '名称不能为空',
          duration: 1500
        })
        return
      }
      data.show = false
      this.handleSave(-1, data)
    },
    handleDelNode (data) { // 删除树节点
      this.$confirm('永久删除' + data.name + '?无法恢复', {

        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let params = 'id=' + data.id
        reqDelInterface(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
            this._loadData()
          }
        })
      }).catch(() => { })
    },
    append (data) { // 增加子节点
      let item = { parentId: 0, name: '', url: '', authCheck: true, show: true, baseInterfaceDOs: [] }
      this.itemData = JSON.parse(JSON.stringify(item))
      data.sub.splice(0, 0, item)
    },
    handleIconSearchClick () { // 搜索接口
      this._loadInterfaceList()
    },
    checkClickInterfaceNode () { // 检查已经选中左侧节点
      if (!this.selectTreeItem.id || this.selectTreeItem.id === -1) {
        this.$message({
          type: 'error',
          message: '请先选择左侧接口树节点',
          duration: 1500
        })
        return true
      }
      return false
    },
    isShowFunc (func) { // 查看是否有功能权限
      return isHasPermission(func)
    }
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.interface-manager-box {
  .left-box {
    min-height: 65vh;
    border-right: 1px solid $color-border;
    .my-custom-tree-node {
      flex: 1;
      align-items: center;
      padding-right: 16px;
      .my-tree-node {
        display: none;
      }
    }
    .el-tree-node__content:hover {
      .my-tree-node {
        display: inline-block;
      }
    }
  }
  .right-box {
    padding-left: 20px;
  }
}
</style>
