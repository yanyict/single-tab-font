<!-- 用户管理 -->
<template>
<div class="base-box user-manager-box">
  <el-row>
         <section class="left-box3" v-if="false">
          <el-tree node-key="id"
            class="my-tree"
            highlight-current
            :data="permissionsTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedKeysArr"
            @node-click="handleNodeClick">
            <span class="flex-between my-custom-tree-node" slot-scope="{ node, data }">
                <p v-if="data.lev ===1" class="txt-hidden" :title="data.name" style="max-width:150px" v-show="!data.show">{{ data.name }}</p>
                <p v-else-if="data.lev ===2" class="txt-hidden" :title="data.name" style="max-width:100px" v-show="!data.show">{{ data.name }}</p>
                <p v-else class="txt-hidden" :title="data.name" style="max-width:100px" v-show="!data.show">{{ data.name }}</p>
                <!-- <el-input v-show="data.show" size="small" v-model="data.name" placeholder="请输入内容" autofocus @blur="handleBlur(data)" :maxlength="10" clearable></el-input> -->
              <!-- <span class="my-tree-node" v-show="!data.show"> -->
                <!-- <el-button
                  v-if="data.hasChild && isShowFunc('menuAdd')"
                  type="text"
                  size="mini"
                  @click="append(data)">
                  <i class="iconfont icon-xinzeng" title="新增子目录"></i>
                </el-button> -->
                <!-- <el-dropdown trigger="click" v-if="data.id !== -1 && (isShowFunc('menuEdit') || isShowFunc('menuRename') || isShowFunc('menuDel'))">
                  <i class="iconfont icon-xuanxiang main-color"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="menuHandleEdit(data)" v-if="isShowFunc('menuEdit')">编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="menuHandleRename(data)" v-if="isShowFunc('menuRename')">重命名</el-dropdown-item>
                    <el-dropdown-item @click.native="menuHandleDelNode(data)" v-if="isShowFunc('menuDel')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              <!-- </span> -->
            </span>
          </el-tree>
        </section>
        <section class="right-box3">
          <div class="header">
          <el-button v-if="isShowFunc('userAdd')" @click="insertOptions" size="small" icon="el-icon-plus" type="primary">新增用户</el-button>
          <el-input style="width: 250px;" size="small" placeholder="请输入关键字搜索" v-model.trim="searchContent">
            <i style="margin: 10px 0 0 0" class="el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
          </el-input>
        </div>
      <el-table :data="tableData" v-loading="loading" class="my-table">
        <!-- <el-table-column label="序号" prop="No" width="180" align="center">
        </el-table-column> -->
        <!-- <el-table-column label="账号" prop="account"  >
        </el-table-column> -->
        <el-table-column label="昵称" prop="name">
          <template slot-scope="scope">
              <p class="txt-hidden" :title="scope.row.name">{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="telephone">
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            <span class="font_cont" >{{scope.row.dept.name ? scope.row.dept.name : ""}}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" prop="position">
        </el-table-column>
        <el-table-column label="角色" prop="roleName">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span class="font_cont" v-if="scope.row.status==0"><i class="is-dot false"></i>  停用</span>
            <span class="font_cont" v-else><i class="is-dot"></i> 启用</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="comment">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <btn>
              <el-button v-if="isShowFunc('userEdit')" type="text" size="small" @click="handleEditer(scope.$index, scope.row)">编辑</el-button>
            </btn>
            <el-dropdown trigger="click">
              <el-button type="text" size="small" class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="isShowFunc('userList')">
                 <el-button  type="text" size="small" @click="handleResetPassword(scope.$index, scope.row)">重置密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="isShowFunc('userList')">
                  <el-button v-if="scope.row.status==0" type="text" size="small" @click="handleSwitch(1, scope.row)">启用</el-button>
                  <el-button v-else type="text" size="small" @click="handleSwitch(0, scope.row)">停用</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="isShowFunc('userDel')">
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        </section>
  </el-row>
  <!-- 弹窗部分 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleCancel" width="520px" :close-on-click-modal="false">
      <div class="content">
        <el-form ref="userForm" :rules="userFormRules" :model="selectUser" size="small" label-width="90px">
          <el-form-item label="账号：" prop="account">
            <el-input v-model="selectUser.account" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="selectUser.password" type="password" placeholder="请输入密码" clearable></el-input>
          </el-form-item>
           <el-form-item label="昵称：" prop="name">
            <el-input v-model="selectUser.name" placeholder="请输入昵称" clearable></el-input>
          </el-form-item>
           <el-form-item label="手机号：" prop="telephone">
            <el-input v-model="selectUser.telephone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
           <el-form-item label="所属部门：">
            <select-tree2 v-model="permissionsIds" :options="permissionsTreeData" :props="defaultProps2" />
          </el-form-item>
          <el-form-item label="职位：" prop="position">
            <el-input v-model="selectUser.position" type="text" placeholder="请输入职位" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="roleName">
            <el-select v-model="selectUser.roleName" filterable placeholder="请选择角色"  @change="handleSelectRole">
              <el-option
                v-for="item in roleTreeData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" style="line-height: 40px;">
            <el-radio-group v-model="selectUser.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：" prop="comment">
            <el-input type="textarea" resize="none" placeholder="请填写备注" v-model="selectUser.comment"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer" style="text-align:right">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" @click="handleSave" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogChangePwd" width="420px" class="change-pwd-dialog">
      <div class="content">
        <el-form :model="passwords" :rules="rulespass" label-width="96px" ref="passwords" size="small">
          <el-form-item  label="新密码：" prop="newpwd">
              <el-input v-model="passwords.newpwd" placeholder="长度需要8-30个由数字、字母、字符组合"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="againpwd">
              <el-input v-model="passwords.againpwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button  size="small" @click="dialogChangePwd = false">取消</el-button>
        <el-button  size="small" @click="handleRest" type="primary">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { isHasPermission } from 'common/js/utils'
import { passwordValidate, phoneValidate } from 'common/js/validate'
import { ERR_OK } from 'api/config'
import { reqUserList, reqRestPass, reqChangeStatus, reqDelUser, reqGetRoleListAll, reqAddUser, reqUpdateUser, reqGetTree } from 'api/systmanager'
import Btn from 'components/Btn'

export default {
  name: 'UserManager',
  components: {
    Btn
  },
  data () {
    return {
      defaultProps2: {
        parent: 'id', // 父级唯一标识
        value: 'id', // 唯一标识
        label: 'name', // 标签显示
        children: 'children' // 子级
      },
      treeData: [],
      tableData: [],
      selectUser: {
        status: '1'
      },
      itemData: {},
      roleTreeData: [],
      permissionsIds: 1000,
      permissionsTreeData: [],
      searchContent: '',
      params: {
        keyWord: '',
        pageIndex: 1,
        pageSize: 10
      },
      passwords: {
        newpwd: '',
        againpwd: '',
        id: ''
      },
      currentIndex: 1,
      total: 0,
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      rulespass: {
        newpwd: [
          { required: true, validator: passwordValidate, trigger: 'blur' }
        ],
        againpwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
      },
      userFormRules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { max: 20, message: '账号长度在20字符内', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { max: 20, message: '昵称长度在20字符内', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: passwordValidate, trigger: 'blur' }
        ],
        position: [
          { required: true, message: '职位不能为空', trigger: 'blur' },
          { max: 20, message: '职位长度在20字符内', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '手机不能为空', trigger: 'blur' },
          { validator: phoneValidate }
        ],
        roleName: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        comment: [
          { max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        label: 'name'
      },
      dialogChangePwd: false,
      expandedKeysArr: [1000]
    }
  },
  created () {
    this._loadData()
    this._loadOnceData()
    // this._loadtreeData()
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
    handleNodeClick (data) { // 选中接口树节点
      this.params.deptId = data.id
      this._loadData()
    },
    _loadOnceData () { // 请求一次数据
      reqGetRoleListAll({}).then(res => { // 请求角色数据
        if (res.resultCode === ERR_OK) {
          this.roleTreeData = res.data
        }
      })
      reqGetTree().then(res => { // 请求部门树
        if (res.resultCode === ERR_OK) {
          this.permissionsTreeData.push(res.data)
          // this.permissionsName = this.permissionsTreeData[0].name
          // this.permissionsIds.push(this.permissionsTreeData[0].id)
        }
      })
    },
    _loadData () {
      this.loading = true
      reqUserList(this.params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data.data) {
          let tableData = res.data.data
          let No = (res.data.pageIndex - 1) * res.data.pageSize
          tableData.map(item => {
            item.No = ++No
            item.delViewVisible = false
            item.password = ''
            if (item.roles.length > 0) {
              item.roleName = item.roles[0].name
              item.roleIds = [item.roles[0].id]
            }
            item.permissionsName = ''
            item.permissionsIds = []
            if (item.dataPermissions.length > 0) {
              let tempPermisionsArr = []
              let tempPermissionArr = []
              item.dataPermissions.map(permission => {
                tempPermisionsArr.push(permission.name)
                tempPermissionArr.push(permission.id)
              })
              item.permissionsName = tempPermisionsArr.join(',')
              item.permissionsIds = tempPermissionArr
            }
          })
          this.tableData = tableData
          this.pageSize = res.data.pageSize
          this.total = res.data.count
        }
      })
    },
    insertOptions () { // 新增教师
      let item = {
        No: '',
        account: '',
        password: '',
        name: '',
        telephone: '',
        dataPermissions: [],
        roleIds: [],
        position: '',
        status: '1',
        comment: ''
      }
      this.selectUser = item
      this.itemData = {}
      this.dialogTitle = '新增用户'
      this.treeData = this.permissionsTreeData
      this.dialogVisible = true
    },
    handleEditer (index, row) { // 修改用户
      Object.assign(this.itemData, row)
      // row.status = ''
      this.permissionsIds = ''
      row.status = row.status.toString()
      this.permissionsIds = row.dept.id
      this.selectUser = row
      this.dialogTitle = '修改用户'
      this.dialogVisible = true
    },
    handleCancel () { // 取消修改
      this.$refs.userForm.resetFields()
      Object.assign(this.selectUser, this.itemData)
      this.dialogVisible = false
    },
    handleDelete (index, row) { // 删除
      let params = 'id=' + row.id
      this.$confirm('确定删除选择的用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqDelUser(params).then(res => {
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
    handleSave () { // 保存
      let isSave = false
      this.$refs.userForm.validate((val) => {
        if (val) {
          isSave = true
        }
      })
      if (!isSave) {
        return
      }
      if (!this.selectUser.id) {
        let params = {
          account: this.selectUser.account,
          name: this.selectUser.name,
          password: this.selectUser.password,
          deptId: this.permissionsIds,
          roleIds: this.selectUser.roleIds,
          position: this.selectUser.position,
          comment: this.selectUser.comment,
          status: this.selectUser.status,
          telephone: this.selectUser.telephone,
          dataPermissions: []
        }
        reqAddUser(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.dialogVisible = false
            this._loadData()
            this.$message({
              type: 'success',
              message: '新增成功!',
              duration: 1500
            })
          }
        })
      } else {
        let params = {
          id: this.selectUser.id,
          account: this.selectUser.account,
          name: this.selectUser.name,
          password: this.selectUser.password,
          deptId: this.permissionsIds,
          roleIds: this.selectUser.roleIds,
          position: this.selectUser.position,
          comment: this.selectUser.comment,
          status: this.selectUser.status,
          telephone: this.selectUser.telephone,
          dataPermissions: []
        }
        // if (this.selectUser.password === 'admin123') {
        //   params.password = null
        // } else {
        //   params.password = this.selectUser.password
        // }
        reqUpdateUser(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.dialogVisible = false
            this._loadData()
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
      this.params.keyWord = this.searchContent
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
    handleSelectRole (data) {
      this.selectUser.roleIds = [data]
    },
    isShowFunc (func) { // 查看是否有功能权限
//      return isHasPermission(func)
      return true
    },
    handleResetPassword (index, row) {
      this.passwords.id = row.id
      this.dialogChangePwd = true
    },
    handleRest () {
      if (this.passwords.newpwd !== this.passwords.againpwd) {
        this.$message.error('密码与确认密码不一致')
      } else {
        let params = {
          password: this.passwords.againpwd,
          id: this.passwords.id
        }
        reqRestPass(params).then(res => {
          this.dialogChangePwd = false
          if (res.resultCode === ERR_OK) {
            this.$message({
              message: res.resultMessage,
              type: 'success',
              duration: 1500
            })
          }
        })
      }
    },
    handleSwitch (index, row) {
      let params = 'userId=' + row.id + '&status=' + index
      reqChangeStatus(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            message: res.resultMessage,
            type: 'success',
            duration: 1500
          })
          this._loadData()
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";
.user-manager-box {
  .el-dialog__body {
    .content {
      .el-select {
        width: 100%;
      }
    }
  }
}
.left-box3 {
    min-height: 65vh;
    float: left;
    overflow: hidden;
    width: 200px;
    min-width: 200px;
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
   .right-box3 {
    padding-left: 20px;
    float: left;
    /*width: calc(100% - 200px);*/
    width: calc(100%);
    .is-dot{
      height: 8px;
      width: 3px;
      padding: 0;
      right: 0;
      border-radius: 50%;
      background-color: #136cae;
      border-radius: 10px;
      color: #fff;
      display: inline-block;
      font-size: 8px;
      height: 10px;
      line-height: 9px;
      padding: 0 4px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #fff;
    }
    .is-dot.false{
      background-color: #ccc;
    }
  }
  .el-form-item__content{
    line-height: 40px;
  }
.user-manager-box{
  min-height: 65vh;
  overflow-y: auto;
  margin: 16px;
  margin-bottom: 100px;
  padding: 10px;
  border-radius: 5px;
  background: #fff;
}

</style>
