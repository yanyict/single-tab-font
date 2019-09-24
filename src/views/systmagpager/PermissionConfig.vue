<!-- 权限配置 -->
<template>
  <div class="permission-config-box">
    <div class="header">
        <div class="header-left">
            <el-button type="text" icon="el-icon-arrow-left" class="perm-back-btn" @click="back">返回角色管理</el-button>
            <div>
              <el-menu :default-active="activeIndex" active-text-color="#1890f1" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">菜单权限</el-menu-item>
                <el-menu-item index="2">URL权限</el-menu-item>
                <el-menu-item index="3">功能权限</el-menu-item>
              </el-menu>
            </div>
        </div>
        <div class="header-right">
          <el-button v-if="_hasPermission('btnSave')"  type="primary" @click="handleSave">保存</el-button>
        </div>
    </div>
    <div class="base-box content" v-loading="loading">
      <div class="conetnt-wrapper">
        <div v-if="activeIndex == 1" class="menu-box">
          <div class="content-top">
            <strong>[{{role.name}}]权限配置</strong>
            <el-input v-model="searchContent" size="small" style="width: 200px;" placeholder="请输入关键字搜索">
              <i style="margin: 10px 0 0 0" class="el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
            </el-input>
          </div>
          <el-tree
            :data="menuTree"
            show-checkbox
            :default-expanded-keys="rolePremission.menus"
            :default-checked-keys="rolePremission.menus"
            node-key="id"
            ref="roleMenuTree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </div>
        <div v-if="activeIndex == 2" class="url-box">
          <div class="content-top">
            <strong>[{{role.name}}]权限配置</strong>
          </div>
          <el-transfer
            v-model="rolePremission.urls"
            filterable
            :titles="['未选项', '已选项']"
            :button-texts="['到左边', '到右边']"
            :data="urlData">
          </el-transfer>
        </div>
        <div v-if="activeIndex == 3" class="func-box">
          <div class="content-top">
            <strong>[{{role.name}}]权限配置</strong>
          </div>
          <el-transfer
            v-model="rolePremission.funcs"
            filterable
            :titles="['未选项', '已选项']"
            :button-texts="['到左边', '到右边']"
            :data="funcData">
          </el-transfer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqAuthPermission, reqMenuList, reqFuncListAll, reqUrlListAll, reqAuthPermissionSave, reqGetFunPeofession } from 'api/systmanager'
export default {
  data () {
    return {
      funRoleData: [],
      activeIndex: '1',
      searchContent: '',
      role: {},
      menuTree: [],
      defaultProps: {
        children: 'subs',
        label: 'name'
      },
      rolePremission: {
        roleId: '',
        menus: [],
        funcs: [],
        urls: []
      },
      urlData: [],
      funcData: [],
      loading: false
    }
  },
  created () {
    this._loadRole()
    this._loadData()
    this._getfunRoleData()
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
    back () { // 返回操作
      this.$router.go(-1)
    },
    _loadRole () { // 加载role
      this.role.id = this.$route.query.id
      this.role.name = this.$route.query.name
      if (!this.role.id) {
        this.$message({
          duration: 1500,
          message: '该角色数据异常',
          type: 'error'
        })
        this.back()
        return
      }
      this.rolePremission.roleId = this.role.id
    },
    _loadMenu (name = '') {
      let params = {
        name: name
      }
      reqMenuList(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.menuTree = res.data
        }
      })
    },
    _loadData () { // 加载角色权限
      let params = 'roleId=' + this.role.id
      this.loading = true
      reqAuthPermission(params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK) {
          Object.assign(this.rolePremission, res.data)
          this.rolePremission.roleId = this.role.id
        }
      })
      if (this.activeIndex === '1') {
        this._loadMenu()
      }
      if (this.activeIndex === '2') {
        reqUrlListAll({}).then(res => {
          if (res.resultCode === ERR_OK) {
            let data = []
            res.data.forEach((item) => {
              data.push({
                label: `${item.name}=>${item.url}`,
                key: item.id
              })
            })
            this.urlData = data
          }
        })
      }
      if (this.activeIndex === '3') {
        reqFuncListAll({}).then(res => {
          if (res.resultCode === ERR_OK) {
            let data = []
            res.data.forEach((item) => {
              data.push({
                label: `${item.name}=>${item.tag}`,
                key: item.id
              })
            })
            this.funcData = data
          }
        })
      }
    },
    handleSelect (key, keyPath) {
      this.activeIndex = key
      this._loadData()
    },
    handleSave () {
      if (this.activeIndex === '1') {
        this.rolePremission.menus = this.$refs.roleMenuTree.getCheckedKeys()
      }
      reqAuthPermissionSave(this.rolePremission).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            type: 'success',
            message: '保存成功!',
            duration: 1500
          })
          this._loadData()
        }
      })
    },
    handleIconSearchClick () {
      this._loadMenu(this.searchContent)
    }
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.permission-config-box {
  color: $color-text;
  font-size: 14px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    background: $color-background;
    border-top: 1px solid $color-border;
    .perm-back-btn {
      color: $color-text;
    }
    .header-right {
      padding-top: 25px;
    }
    .el-submenu .el-menu-item.is-active,
    .el-menu-item.is-active,
    .el-submenu .el-menu-item.is-active:hover,
    .el-menu-item.is-active:hover {
      background-color: $color-background;
    }
  }
  .content {
    .content-top {
      margin: 5px;
      display: flex;
      justify-content: space-between;
    }
    .menu-box {
      .el-tree-node__content {
        height: 40px;
        border-bottom: 1px solid $color-border;
      }
    }
    .el-transfer {
      display: flex;
      justify-content: space-around;
      .el-transfer-panel {
        width: 45%;
      }
      .el-transfer__buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .el-transfer-panel__body {
        height: 350px;
      }
      .el-transfer-panel__list.is-filterable {
        height: 298px;
      }
    }
  }
}
</style>
