<template>
<div>
    <el-row>
      <el-col :lg="4" :md="6" :sm="6" :xs="6">
        <div class="left-box">
          <ul class="result_list">
              <li class="item" :class="isActive ? 'active': ''" @click="onClickAllShare">全部数据共享</li>
          </ul>
          <el-tree ref="tree" node-key="id" class="my-tree" style="margin-top: 0;" highlight-current :data="treeData" :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
            <span class="flex-between my-custom-tree-node" slot-scope="{ node, data }">
              <span :title=data.name>{{ data.name }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :lg="20" :md="18" :sm="18" :xs="18">
        <section class="right-box">
          <div>
            共享范围：<permit ref="premissionsTree" style="width:300px" :data="branchData" :user="userdata" :role="roledata"
               :clearable="true" v-model="sharedrange" :defaultProps="defaultProps2"
              @valChange="handleSharedRange" placeholder="请选择数据权限">
              </permit>
            <!-- <el-button v-if="isShowFunc('shareAdd')" size="small" @click="onAddShare" type="primary" icon="el-icon-plus">新增共享规则</el-button> -->
            <el-button  size="small" @click="onAddShare" type="primary" icon="el-icon-plus">新增共享规则</el-button>
          </div>
          <el-table stripe v-loading="loading" :data="tableData" class="my-table" style="width: 100%">
                <el-table-column label="数据来源">
                  <template slot-scope="scope">
                    <span size="small" v-for="(item,index) in scope.row.shareSourceVOList" :key="index">
                      {{index == scope.row.shareSourceVOList.length - 1 ? item.name : item.name + ','}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="共享数据" >
                  <template slot-scope="scope">
                    <span size="small" v-for="(item,index) in scope.row.shareModuleVOList" :key="index">
                      {{index == scope.row.shareModuleVOList.length - 1 ? item.name : item.name + ','}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="共享范围">
                  <template slot-scope="scope">
                    <span size="small" v-for="(item,index) in scope.row.shareTargetVOList" :key="index">
                      {{index == scope.row.shareTargetVOList.length - 1 ? item.name : item.name + ','}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="共享权限" width="100px">
                  <template slot-scope="scope">
                      <span class="font_cont" v-if="scope.row.permissionType==1">只读</span>
                      <span class="font_cont" v-else>读写</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" >
                  <template slot-scope="scope">
                    <el-switch :disabled="!isShowFunc('shareStatus')" @change="handleMonitore(scope.$index, scope.row)"  v-model="scope.row.status"></el-switch>&nbsp;{{scope.row.status? '启用' : '停用'}}
                  </template>
                  <!-- <template slot-scope="scope">
                      <span class="font_cont" v-if="scope.row.status==0">停用</span>
                      <span class="font_cont" v-else>启用</span>
                    </template> -->
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <btn > -->
                      <el-button v-if="isShowFunc('shareEdit')" type="text" @click="handleEditer(scope.$index, scope.row)" size="small">编辑</el-button>
                    <!-- </btn> -->
                    <el-button v-if="isShowFunc('shareDel')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page-box">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagebox.currentIndex"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pagebox.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pagebox.total">
                </el-pagination>
              </div>
        </section>
      </el-col>
    </el-row>
   <!--导入 弹框-->
    <el-dialog  :title="DialogShareTitle" :visible.sync="DialogShareVisible" width="450px" :before-close="closeDialog">
      <el-form ref="shareform" :rules="rules" :model="shareform" label-width="130px" size="small">
        <el-form-item label="数据来源于：" prop="shareSourceList">
           <permit ref="premissionsTree" style="width:100%" :data="branchData" :user="userdata" :role="roledata"
               :multiple="true" v-model="shareform.shareSourceList" :defaultProps="defaultProps2"
              @valChange="changeSource" placeholder="请选择数据权限">
            </permit>
        </el-form-item>
        <el-form-item label="共享的数据：" prop="shareModuleList">
           <el-select style="width:100%" v-model="shareform.shareModuleList" multiple placeholder="请选择">
            <el-option v-for="item in treeData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据共享到：" prop="shareTargetList">
          <permit ref="premissionsTree" style="width:100%" :data="branchData" :user="userdata" :role="roledata"
               :multiple="true" v-model="shareform.shareTargetList"  :defaultProps="defaultProps2"
              @valChange="changeTarget" placeholder="请选择数据权限">
            </permit>
        </el-form-item>
        <el-form-item label="共享后的权限：" prop="permissionType">
          <el-radio-group v-model="shareform.permissionType">
            <el-radio :label="1">只读</el-radio>
            <el-radio :label="2">读写</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="handleShare" size="small">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { isHasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqGetTree, reqDataPermissionUser, reqGetRoleListAll, reqModuleList, reqDataPermissionList, reqDataPermissionChangeStatus, reqDataPermissionSave, reqDataPermissionUpdate, reqDataPermissionBatchRemove } from 'api/systmanager'
export default {
  created () {
    this._loadtree()
    this.onClickAllShare()
    this._loadUser()
    this._loadRole()
    this._loadbranch()
  },
  data () {
    return {
      tableData: [],
      treeData: [],
      branchData: [], // 部门数据
      userdata: [], // 用户数据
      roledata: [], // 角色数据
      permissionUser: [],
      permissionUserId: '',
      isActive: false,
      loading: false,
      DialogShareTitle: '',
      DialogShareVisible: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      sharedrange: null,
      shareform: {
        permissionType: 1,
        shareModuleList: [],
        shareTargetList: [],
        shareSourceList: []
      },
      params: {
        moduleId: null,
        sourceType: null,
        sourceId: null,
        targetType: null,
        targetId: null,
        pageIndex: 1,
        pageSize: 10
      },
      pagebox: {
        data: [],
        currentIndex: 1,
        total: 0,
        pageSize: null
      },
      defaultProps2: {
        children: 'childrenList',
        label: 'name'
      },
      rules: {
        shareSourceList: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
        shareTargetList: [{ required: true, message: '请选择共享范围', trigger: 'change' }],
        shareModuleList: [{ required: true, message: '请选择共享数据', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleSharedRange (data) {
      if (data !== null) {
        this.sharedrange = data
        this.params.targetId = data.id
        this.params.targetType = data.type
        this._loadtable()
      }
    },
    changeSource (data) {
      this.shareform.shareSourceList = data
    },
    changeTarget (data) {
      this.shareform.shareTargetList = data
    },
    handleMonitore (index, row) {
      let id = row.id
      let status = row.status ? 1 : 0
      let params = {
        id: id,
        status: status
      }
      reqDataPermissionChangeStatus(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            type: 'success',
            message: '修改监控状态成功!',
            duration: 1500
          })
          this._loadtable()
        }
      })
    },
    closeDialog () {
      this.$refs.shareform.resetFields()
      this.DialogShareVisible = false
      this.shareform.shareModuleList = []
      this.shareSourceList = []
      this.shareTargetList = []
    },
    handleEditer (index, row) {
      this.DialogShareVisible = true
      this.DialogShareTitle = '编辑共享数据规则'
      let data = Object.assign({}, row)
      let moduledata = []
      for (let mod of data.shareModuleVOList) {
        moduledata.push(mod.id)
      }
      this.$nextTick(() => {
        this.shareform = {
          id: data.id,
          permissionType: data.permissionType,
          shareModuleList: moduledata,
          shareSourceList: data.shareSourceVOList,
          shareTargetList: data.shareTargetVOList
        }
      })
    },
    handleDelete (index, row) {
      let params = {
        ids: [row.id]
      }
      this.$confirm('确定删除选择的主题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqDataPermissionBatchRemove(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1500
            })
            this._loadtable()
          }
        })
      }).catch(() => { })
    },
    handleShare () { // 确定新增分享规则
      let isPass = false
      this.$refs.shareform.validate((valid) => { if (valid) { isPass = true } })
      if (!isPass) {
        this.$message({ message: '必填选项有误，请重新填写', type: 'error' })
        return
      }
      if (!this.shareform.id) {
        let shareSourceList = []
        let shareTargetList = []
        this.shareform.shareSourceList.forEach(item => {
          shareSourceList.push({ id: item.id, type: item.type })
        })
        this.shareform.shareTargetList.forEach(item => {
          shareTargetList.push({ id: item.id, type: item.type })
        })
        let params = {
          permissionType: this.shareform.permissionType,
          shareModuleList: this.shareform.shareModuleList,
          shareSourceList: shareSourceList,
          shareTargetList: shareTargetList
        }
        reqDataPermissionSave(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              message: res.resultMessage,
              type: 'success',
              duration: 1500
            })
            this._loadtable()
            this.closeDialog()
          }
        })
      } else {
        let shareSourceList = []
        let shareTargetList = []
        this.shareform.shareSourceList.forEach(item => {
          shareSourceList.push({ id: item.id, type: item.type })
        })
        this.shareform.shareTargetList.forEach(item => {
          shareTargetList.push({ id: item.id, type: item.type })
        })
        let params = {
          id: this.shareform.id,
          permissionType: this.shareform.permissionType,
          shareModuleList: this.shareform.shareModuleList,
          shareSourceList: shareSourceList,
          shareTargetList: shareTargetList
        }
        reqDataPermissionUpdate(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              message: res.resultMessage,
              type: 'success',
              duration: 1500
            })
            this._loadtable()
            this.closeDialog()
          }
        })
      }
    },
    selPermissionTreeChange (data, arr, name) {
      this.shareform.shareModuleList = arr
    },
    CleanPermissionsMethod () {
      this.shareform.shareModuleList = []
    },
    onAddShare () { // 新增共享
      this.DialogShareTitle = '新增共享规则'
      this.DialogShareVisible = true
    },
    selectList (data) { // 点击筛选共享范围
      this.params.moduleId = data
      this._loadtable()
    },
    onClickAllShare () { // 点击全部数据共享
      this.isActive = true
      this.$nextTick(() => {
        this.$refs.tree.setCurrentNode([''])
      })
      this.sharedrange = null
      this.params.moduleId = null
      this._loadtable()
    },
    _loadtable () {
      this.loading = true
      reqDataPermissionList(this.params).then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK && res.data.data) {
          const data = res.data.data
          data.map(item => {
            item.status = item.status === 1
          })
          this.tableData = data
          this.pagebox.pageSize = res.data.pageSize
          this.pagebox.total = res.data.count
        }
      })
    },
    _loadbranch () {
      reqGetTree().then(res => {
        if (res.resultCode === ERR_OK) {
          let cache = this.traverseTree(res.data)
          this.branchData = cache
        }
      })
    },
    traverseTree (node) {
      let nodes = []
      if (node !== null) {
        node.type = 2
        nodes.push(node)
        let childrens = node.children
        for (let i = 0; i < childrens.length; i++) {
          childrens[i].type = 2
          this.traverseTree(childrens[i])
        }
      }
      return nodes
    },
    _loadtree () {
      // let params = 'tag=' + DATA_PERMISSION_MODULE
      reqModuleList().then(res => {
        if (res.resultCode === ERR_OK) {
          // let data = res.data
          // console.log(this.deepTraversal(data))
          this.treeData = res.data
        }
      })
    },
    deepTraversal (node) {
      let nodes = []
      if (node !== null) {
        let stack = [] // 同来存放将来要访问的节点
        stack.push(node)
        while (stack.length !== 0) {
          let item = stack.pop() // 正在访问的节点
          nodes.push(item)
          let childrens = item.children
          for (let i = childrens.length - 1; i >= 0; i--) { // 将现在访问点的节点的子节点存入stack，供将来访问
            stack.push(childrens[i])
          }
        }
      }
      return nodes
    },
    _loadRole () {
      reqGetRoleListAll({}).then(res => {
        if (res.resultCode === ERR_OK && res.data) {
          let data = res.data
          data.map(item => {
            item.type = 1
          })
          this.roledata = data
        }
      })
    },
    _loadUser () { // 获取负责人
      // let params = 'tag=' + USER
      reqDataPermissionUser().then(res => {
        if (res.resultCode === ERR_OK) {
          let data = res.data
          data.map(item => {
            item.type = 0
          })
          this.userdata = res.data
        }
      })
    },
    checkBoxSelect (selectList) { // 用户勾选checkBox触发
      let arr = []
      let requirement = []
      // console.info(selectList)
      selectList.forEach((item, index) => {
        arr.push(item.quotaDetailId)
        requirement.push(item.requirement)
      })
      this.ids = arr
    },
    handleNodeClick (data, node) {
      this.params.targetType = null
      this.params.targetId = null
      this.sharedrange = null
      this.params.moduleId = data.id
      this._loadtable()
      this.isActive = false
    },
    handleSizeChange (val) { // 改变显示条数
      this.params.pageIndex = 1
      this.params.pageSize = val
      this._loadtable()
    },
    handleCurrentChange (val) { // 切换页面
      this.params.pageIndex = val
      this._loadtable()
    },
    isShowFunc (func) { // 查看是否有功能权限
//      return isHasPermission(func)
      return true
    }
  }
}
</script>

<style lang="scss">
.evaresult{
  .left-box {
  min-height: 65vh;
  overflow: hidden;
  border-right: 1px solid #e8e8e8;
  .result_list {
    .item {
      cursor: pointer;
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      font-size: 14px;
      color: #333;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    .icon-jingshi{
      color: #ee2c32
    }

    .item.active {
      color: #078ce7;
      background-color: #e6f7ff;
      border-right: 3px solid #1890ff;
    }
  }
}
.right-box {
  padding: 0 15px;
  .result_info {
    .info_title {
      font-size: 20px;
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      border-bottom: 1px solid #ccc;
    }
    .emptyshow{
      min-height: 500px;
      text-align: center;
      padding-top: 110px;
      .img_box{
        width: 251px;
        height: 210px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
        .txt{
          color: #999999;
          font-size: 16px;
        }
      }
    }
    .icon-jujue{
      color: #ee2c32
    }
    .icon-xiaodagou{
      color: #12ae40
    }
    .result_base {
      .base_title {
        font-size: 14px;
        color: #333;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .info_item {
        color: #666;
        font-size: 14px;
        .txt {
          color: #333;
        }
      }
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
    }
    .chart {
      padding: 20px 0;
      .chart_title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #333;
      }
    }
  }
}
}
</style>
