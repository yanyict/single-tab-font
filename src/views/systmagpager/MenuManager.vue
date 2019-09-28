<!-- 菜单管理 -->
<template>
<div class="base-box menu-manager-box">
    <el-row style="width: 100%; height: 100%">
      <el-col :span="4">
        <div class="left-box">
          <el-input placeholder="输入关键字进行搜索" v-model.trim="searchContent">
              <i style="margin-top: 13px" class="el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
          </el-input>
          <el-tree
            class="my-tree"
            highlight-current
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
          <el-popover
            ref="menuPopover"
            width="250"
            trigger="hover">
              <el-button icon="el-icon-plus" class="menu-add-btn" @click="addPeerMenu">新增同级菜单</el-button>
              <el-button icon="el-icon-plus" class="menu-add-btn" @click="addSubMenu">新增子级菜单</el-button>
          </el-popover>
          <el-button v-popover:menuPopover icon="el-icon-plus" class="left-box-button">新增菜单</el-button>
        </div>
      </el-col>
      <el-col :span="20" class="right-box">
        <div>
            <el-form label-position="right" :model="selectedMenu" :rules="rules" ref="menuForm" label-width="120px">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="selectedMenu.name" placeholder="请输入菜单名称" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="菜单标签" prop="tag">
                <el-input v-model="selectedMenu.tag" placeholder="请输入标签" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="菜单URL" prop="url">
                <el-input v-model.trim="selectedMenu.url" placeholder="请输入URL" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="菜单备注" prop="comment">
                <el-input v-model="selectedMenu.comment" placeholder="请输入备注" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="selectedMenu.icon" placeholder="请输入图标" :maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="菜单次序" prop="ranktemp">
                <el-input v-model.number="selectedMenu.ranktemp" placeholder="请输入次序" type="number"></el-input>
              </el-form-item>
              <el-form-item label="是否可见">
                <el-radio label="1" v-model="selectedMenu.showMenu">可见</el-radio>
                <el-radio label="0" v-model="selectedMenu.showMenu">不可见</el-radio>
              </el-form-item>
              <el-form-item label="是否包含子菜单">
                <el-radio label="1" v-model="selectedMenu.hasChild">包含</el-radio>
                <el-radio label="0" v-model="selectedMenu.hasChild">不包含</el-radio>
              </el-form-item>
              <el-form-item label=" ">
                <el-button v-if="_hasPermission('btnSave')" type="primary" @click="handleSave">保存</el-button>
                <el-button v-if="_hasPermission('btnDel')" @click="handleDelete">删除</el-button>
              </el-form-item>
            </el-form>
        </div>
      </el-col>
    </el-row>
</div>
</template>

<script>
import { hasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqMenuList, reqAddMenu, reqDelMenu, reqUpdateMenu, reqGetFunPeofession } from 'api/systmanager'
export default {
  name: 'MenuManager',
  data () {
    return {
      funRoleData: [],
      searchContent: '',
      treeData: [],
      defaultProps: {
        children: 'subs',
        label: 'name'
      },
      selectedMenu: {
        id: '',
        name: '',
        tag: '',
        url: '',
        hasChild: '',
        showMenu: '',
        icon: '',
        ranktemp: '',
        comment: '',
        parent: '',
        subs: []
      },
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { max: 20, message: '菜单名称不能超过20个字', trigger: 'blur' }
        ],
        tag: [
          { max: 20, message: '菜单标签不能超过20个字', trigger: 'blur' }
        ],
        url: [
          { max: 50, message: '菜单URL不能超过50个字', trigger: 'blur' }
        ],
        comment: [
          { max: 50, message: '菜单URL不能超过50个字', trigger: 'blur' }
        ],
        icon: [
          { max: 50, message: '菜单图标不能超过50个字', trigger: 'blur' }
        ],
        ranktemp: [
          { required: true, type: 'integer', message: '菜单次序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this._loadData()
    this._getfunRoleData()
  },
  watch: {
    selectedMenu () { // 解决ElementUI单选框对数值无效
      this.selectedMenu.hasChild = this.selectedMenu.hasChild.toString()
      this.selectedMenu.showMenu = this.selectedMenu.showMenu.toString()
    },
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
//      return hasPermission(this.funRoleData, tag)
      return true
    },
    _getfunRoleData () { // 获取用户功能权限
      reqGetFunPeofession(this.$route.path).then(res => {
        if (res.resultCode === ERR_OK) {
          this.funRoleData = res.data
        }
      })
    },
    _loadData (params = {}) { // 加载菜单列表
      reqMenuList(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.treeData = res.data
          if (this.treeData.length) {
            this.selectedMenu = res.data[0]
          } else {
            this.selectedMenu = {}
          }
        }
      })
    },
    handleIconSearchClick () { // 搜索
      let params = 'name=' + this.searchContent
      this._loadData(params)
    },
    handleNodeClick (data) { // 选择菜单
      this.selectedMenu = data
    },
    handleSave () { // 保存菜单
      let isSave = true
      this.$refs.menuForm.validate((valid) => {
        if (!valid) {
          isSave = false
        }
      })
      if (!isSave) {
        return
      }
      if (!this.selectedMenu.id) {
        reqAddMenu(this.selectedMenu).then(res => { // 新增
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '新增成功!',
              duration: 1500
            })
            this._loadData()
          }
        })
      } else {
        reqUpdateMenu(this.selectedMenu).then(res => { // 更新
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 1500
            })
          }
        })
      }
    },
    handleDelete () { // 删除菜单
      this.$confirm('永久删除 ' + this.selectedMenu.name + '? 无法恢复', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = 'id=' + this.selectedMenu.id
        reqDelMenu(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1500
            })
            this._loadData()
          }
        })
      }).catch(() => { })
    },
    addPeerMenu () {
      let parent = this.selectedMenu.parent || 0
      this.handleAddMenu(parent)
    },
    addSubMenu () {
      let parent = this.selectedMenu.id
      this.handleAddMenu(parent)
    },
    handleAddMenu (parent) { // 添加菜单
      let newMenu = {
        id: '',
        name: '',
        tag: '',
        url: '',
        hasChild: '0',
        showMenu: '1',
        icon: '',
        ranktemp: '',
        comment: '',
        parent: parent,
        subs: []
      }
      this.selectedMenu = newMenu
    }
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.menu-manager-box {
  .left-box {
    .el-input__inner {
      width: 95%;
    }
    .el-input__suffix {
      right: 25px;
    }
    .left-box-button {
      width: 95%;
      margin-top: 10px;
      color: $color-text-ll;
      border: 1px dashed #dcdfe6;
    }
  }

  .right-box {
    padding-top: 45px;
    border-left: 1px solid $color-border;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
}
.el-popover {
  .menu-add-btn {
    display: block;
    width: 100%;
    border: 0;
    margin: 0;
    padding: 12px 0;
    color: $color-text-ll;
    text-align: center;
  }
  .menu-add-btn + .menu-add-btn {
    margin: 0;
  }
}
</style>
