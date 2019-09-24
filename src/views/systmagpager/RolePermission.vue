<template>
  <div class="role-permission" v-loading="loading">
    <header class="header">
      <el-button type="text" icon="el-icon-arrow-left" class="perm-back-btn" @click="back">返回角色管理</el-button>
      <h1>{{roleName}}-权限配置</h1>
    </header>
    <section class="base-box">
      <el-table :data="treeTableData" v-loading="loading" :row-style="showTr" class="my-table">
        <el-table-column width="55"></el-table-column>
        <el-table-column label="菜单导航" width="200">
          <template slot-scope="scope">
              <i v-for="(space, levelIndex) in scope.row._level" :key="levelIndex">&nbsp;&nbsp;</i>
              <span v-if="toggleIconShow(scope.row)" @click="toggle(scope.$index)">
                <i v-show="!scope.row._expanded" class="el-icon-caret-right"></i>
                <i v-show="scope.row._expanded" class="el-icon-caret-bottom"></i>
              </span>
              <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;</i>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="页面权限" width="300">
          <template slot-scope="scope">
            <el-checkbox-group v-model="menus" @change="authBaseSave" :disabled="!isShowFunc('rolePermissionSave')">
              <el-checkbox :label="scope.row.id" :key="scope.row.id">{{scope.row.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="功能权限">
          <template slot-scope="scope">
            <el-checkbox-group v-model="funcs" @change="authBaseSave" :disabled="!isShowFunc('rolePermissionSave')">
              <el-checkbox v-for="(item, index) in scope.row.baseFuncDOs" :label="item.id" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { reqBaseMenuList, reqAuthUser, reqAuthBaseSave } from 'api/systmanager'
import Utils from 'common/tree_utils/index'
import { isHasPermission } from 'common/js/utils'
export default {
  name: 'RolePermission',
  data () {
    return {
      roleId: '',
      roleName: '',
      tableData: [],
      loading: false,
      funcs: [1013],
      menus: [1014]
    }
  },
  computed: {
    treeTableData () {
      let data = Utils.MSDataTransfer.treeToArray(this.tableData, null, null, false, 'sonMenuVOs')
      return data
    }
  },
  created () {
    this._loadRole()
    this._loadAuthGetBaseMenus()
  },
  methods: {
    back () { // 返回操作
      this.$router.go(-1)
    },
    _loadRole () { // 加载role
      this.roleId = this.$route.query.id
      this.roleName = this.$route.query.name
      if (!this.roleId) {
        this.$message({
          duration: 1500,
          message: '该角色数据异常',
          type: 'error'
        })
        this.back()
        return
      }
      this._loadData()
    },
    _loadData () {
      this.loading = true
      reqBaseMenuList().then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data) {
          this.tableData = res.data
        }
      })
    },
    _loadAuthGetBaseMenus () {
      let params = 'roleId=' + this.roleId
      reqAuthUser(params).then(res => {
        if (res.resultCode === ERR_OK && res.data) {
          let list = res.data
          let funcs = []
          let menus = []
          list.map(item => {
            funcs = funcs.concat(item.funcIds)
            menus.push(item.menuId)
          })
          this.funcs = funcs
          this.menus = menus
        }
      })
    },
    authBaseSave () {
      let params = {
        roleId: this.roleId,
        funcs: this.funcs,
        menus: this.menus
      }
      reqAuthBaseSave(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            type: 'success',
            message: '保存成功',
            duration: 1500
          })
        }
      })
    },
    // 显示行
    showTr ({ row, rowIndex }) {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle (trIndex) {
      let record = this.treeTableData[trIndex]
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      if (index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (record) {
      if (record.sonMenuVOs && record.sonMenuVOs.length > 0) {
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

.role-permission {
  .header {
    padding: 10px 20px;
    background: $color-background;
    border-top: 1px solid $color-border;
    .perm-back-btn {
      color: $color-text;
    }
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 12px 0;
  }
}
</style>
