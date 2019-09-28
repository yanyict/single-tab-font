<!-- 部门管理 -->
<template>
  <div class="dept-box base-box">
    <div class="header dept-header">
      <h4 class="dept-title"></h4>
      <el-input suffix-icon="el-icon-search" clearable v-model="filterDeptText" size="small" style="width: 200px;" placeholder="请输入部门名称">
      </el-input>
    </div>
    <div class="header-box">
      <span>部门层级</span><span>负责人</span> <span>电话</span><span>备注</span> <span>操作</span>
    </div>
    <div class="dept-tree" v-loading="loading">
      <el-tree filter :filter-node-method="filterNode" :props="prop"  :default-expanded-keys="expandArry" ref="tree" :data="data" node-key="id"
        :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <template v-if="data.isEdit === true">
            <div>
              <el-col>
                <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入部门名称" v-model="data.name"
                  :maxlength="50" clearable></el-input>
                  <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入负责人" v-model="data.head"
                  :maxlength="50" clearable></el-input>
                  <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入电话" v-model="data.telephone"
                  :maxlength="11" clearable></el-input>
                  <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入备注" v-model="data.comment"
                  :maxlength="50" clearable></el-input>
                <i v-show="data.rule" style="color: #f00">{{data.ruleText}}</i>
                <el-button type="text" size="mini" @click="saveNode(node ,data)">保存</el-button>
                <div class="my-line"></div>
                <el-button type="text" size="mini" @click="cancelNode(node, data)">取消</el-button>
              </el-col>
            </div>
          </template>
          <template v-else>
            <tempalte v-if="data.toReName">
              <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入部门名称" v-model="data.name"
                clearable></el-input>
              <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入负责人" v-model="data.head"
            clearable></el-input>
              <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入电话" v-model="data.telephone"
            clearable></el-input>
            <el-input  style="width: 200px; margin-right: 5px" size="mini" placeholder="请输入备注" v-model="data.comment"
            clearable></el-input>
              <i v-show="data.rule" style="color: #f00">{{data.ruleText}}</i>
              <el-button type="text" size="mini" @click="saveNodeName(data)">保存</el-button>
              <div class="my-line"></div>
              <el-button type="text" size="mini" @click="cancelReName(data)">取消</el-button>
            </tempalte>
            <template v-else>
              <span style="text-align:left;float: left;">
                <i v-bind:class="classObject(data)"></i>
                <span class="txt-hidden">{{ data.name }}</span>
              </span>
              <span class="txt-hidden" style="position:absolute;text-align:center;left:25%;width:100px">{{data.head}}</span>
              <span class="txt-hidden" style="position:absolute;text-align:center;left:48%;width:100px">{{data.telephone}}</span>
              <span class="txt-hidden" style="position:absolute;text-align:center;left:61%;width:300px">{{data.comment}}</span>
              <span>
                <template>
                   <btn>
                    <el-button type="text" size="mini" @click="() => updateName(data)" v-if="isShowFunc('deptRename')">编辑</el-button>
                  </btn>
                  <el-dropdown trigger="click">
                    <el-button type="text" size="small" class="el-dropdown-link">
                      更多 <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button v-if="isShowFunc('deptAdd')" type="text" size="mini" @click="() => append(node,data)">新增子级</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                         <btn  v-if="data.lev > 1 && isShowFunc('deptMove')">
                            <el-button type="text" size="mini" @click="() => move(data)">移动</el-button>
                         </btn>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button v-if="data.lev > 1 && isShowFunc('deptDel')" type="text" size="mini" @click="() => deleteNode(node, data)">删除</el-button>
                      </el-dropdown-item>
                      <!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                      <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- <div class="my-line" v-if="data.lev > 1"></div> -->
              </template>
              </span>
            </template>
          </template>
        </div>
      </el-tree>
    </div>
    <!-- 弹窗模块 -->
    <div>
      <el-dialog :close-on-click-modal="false" :title="treeToName" :visible.sync="movedialogTableVisible" width="520px">
        <div class="content">
          <el-input class="content-top" placeholder="输入关键字进行搜索" v-model="levTreeText">
          </el-input>
          <div class="content-midden">
            <el-tree @node-click="windowTreeNodeClick" :filter-node-method="filterNode" ref="levTree" :props="prop" :data="data">
            </el-tree>
          </div>
        </div>
        <div class="footer">
          <el-button size="mini" @click="movedialogTableVisible = false">取消</el-button>
          <el-button size="mini" @click="confirmMove()" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isHasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqDeptRootTree, reqDeptChildrenTree, reqCheckTreeName, reqAddNodeTree, reqDelteNode, reqReNameDept, reqNodeMove, reqGetTree } from 'api/systmanager'
import Btn from 'components/Btn'
let id = 5000
export default {
  name: 'DepartmentManager',
  components: {
    Btn
  },
  data () {
    return {
      filterDeptText: '',
      parentNode: {},
      moveNode: {},
      toMoveNode: {},
      toTreeName: '',
      firstMoveTreeName: '',
      itemData: {},
      levTreeText: '',
      expandArry: [],
      movedialogTableVisible: false,
      openNodeId: '',
      data: [],
      cache: [],
      prop: {
        label: 'name',
        isLeaf: 'isLeaf'
      },
      levData: [],
      loading: false
    }
  },
  created () {
    this.getCacheTree()
  },
  computed: {
    treeToName () {
      let lastName = this.toTreeName === '' ? '' : this.toTreeName + ' 部门下吗?'
      return '将 ' + this.firstMoveTreeName + ' 移动到 ' + lastName
    }
  },
  watch: {
    levTreeText (val) {
      this.$refs.levTree.filter(val)
    },
    filterDeptText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    getCacheTree () {
      this.loading = true
      reqGetTree().then(res => {
        this.loading = false
        if (res.resultCode === ERR_OK) {
          let cache = []
          cache.push(res.data)
          this.data = cache
        }
      })
    },
    confirmMove () { // 部门 确定移动
      this.movedialogTableVisible = false
      let params = 'id=' + this.moveNode.id + '&parentId=' + this.toMoveNode.id
      reqNodeMove(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            duration: 1500,
            message: '操作成功！',
            type: 'success'
          })
        }
        this.getCacheTree()
        this.movedialogTableVisible = false
        this.moveNode = {}
        this.toMoveNode = {}
      })
    },
    windowTreeNodeClick (nodeData, parentNode) {
      this.parentNode = parentNode
      this.toMoveNode = JSON.parse(JSON.stringify(nodeData))
      this.toTreeName = nodeData.name
    },
    deleteNode (node, data) { // 删除节点
      this.$confirm('永久删除 ' + data.name + '? 无法恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        reqDelteNode(data.id).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: '删除成功！',
              duration: 1500
            })
            this.$refs.tree.remove(node)
          }
        })
      }).catch(() => { })
    },
    change (data) { // 改变监听
      if (data.name === this.itemData.name) {
        return
      }
      if (data.rule === undefined || data.rule === null) {
        this.$set(data, 'rule', false)
        this.$set(data, 'ruleText', false)
      }
      if (data.name.length > 20) { // 判断长度
        data.rule = true
        data.ruleText = '长度不能超过20'
        return
      }
      // 判断是否重复
      let params = {}
      params.lev = data.lev
      params.name = data.name
      reqCheckTreeName(params).then(res => {
        if (res.resultCode === ERR_OK) {
          data.rule = !res.data
          if (!res.data) { // 重复
            data.ruleText = '名称重复 '
          }
        }
      })
    },
    levMoveClick (data) {
    },
    filterNode (value, data) { // 移动弹窗中的过滤函数
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        reqDeptRootTree().then(res => {
          if (res.resultCode === ERR_OK) {
            this.cache = res.data
            let item = { id: this.cache.id, lev: this.cache.lev, name: this.cache.name, isLeaf: false }
            return resolve([item])
          }
        })
      } else if (node.level === 1) {
        return resolve(this.cache.children)
      } else {
        reqDeptChildrenTree(node.data.id).then(res => {
          if (res.resultCode === ERR_OK) {
            resolve(res.data.children)
          }
        })
      }
    },
    updateName (data) { // 重命名
      this.itemData = JSON.parse(JSON.stringify(data))
      if (data.toReName === undefined) {
        this.$set(data, 'toReName', true)
      } else {
        data.toReName = !data.toReName
      }
    },
    cancelReName (data) { // 取消重命名
      data.name = this.itemData.name
      data.toReName = !data.toReName
    },
    append (node, data) { // 新增子级
      let newNode = {
        id: '',
        name: '',
        lev: '',
        head: '',
        telephone: '',
        comment: '',
        parentId: '',
        isEdit: true,
        isLeaf: true,
        children: [],
        rule: false,
        ruleText: ''
      }
      newNode.id = id++
      newNode.lev = node.data.lev + 1
      newNode.parentId = node.data.id
      if (node.childNodes.length === 0) {
        node.data.isLeaf = false
        this.$refs.tree.append(newNode, node)
      } else {
        this.$refs.tree.insertBefore(newNode, node.childNodes[0])
      }
      this.expandArry.push(node.data.id)
      this.$refs.tree.setCurrentKey(node.data.id)
    },
    saveNodeName (data) { // 部门重命名
      let phoneRegexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (data.rule) {
        return
      }
      if (!phoneRegexp.test(data.telephone)) {
        return this.$message.error('手机号填写有误')
      }
      let params = 'id=' + data.id + '&name=' + data.name + '&head=' + data.head + '&telephone=' + data.telephone + '&comment=' + data.comment
      reqReNameDept(params).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            duration: 1500,
            type: 'success',
            message: '修改成功！'
          })
          data.toReName = false
        }
      })
    },
    saveNode (node, data) { // 保存子级
      // 手机号码正则
      let phoneRegexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (data.rule) {
        return
      }
      if (!phoneRegexp.test(data.telephone)) {
        return this.$message.error('手机号填写有误')
      }
      let params = 'name=' + data.name + '&parentId=' + data.parentId + '&head=' + data.head + '&telephone=' + data.telephone + '&comment=' + data.comment
      reqAddNodeTree(params).then(resData => {
        if (resData.resultCode === ERR_OK) {
          this.$message({
            type: 'success',
            message: '新增成功！',
            duration: 1500
          })
          node.data.id = resData.data.id
          data.isEdit = false
        }
      })
    },
    cancelNode (node, data) { // 取消新增子级子级
      this.$refs.tree.remove(data)
      let iNode = this.$refs.tree.getNode(data.parentId)
      if (iNode.childNodes.length === 0) {
        iNode.data.isLeaf = true
      }
    },
    classObject: function (itemNode) {
      if (itemNode.children.length > 0) {
        return 'tree-folder'
      } else {
        return 'tree-file'
      }
    },
    move (itemdata) { // 点击移动
      this.firstMoveTreeName = itemdata.name
      this.moveNode = JSON.parse(JSON.stringify(itemdata))
      if (this.levData === null) {
        this.levData = this.data
      }
      this.movedialogTableVisible = true
    },
    isShowFunc (func) { // 查看是否有功能权限
//      return isHasPermission(func)
      return true
    }
  }
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.dept-box {
  .dept-title {
    font-weight: bold;
    font-size: $font-size-large;
  }
  .header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 4px 70px  4px 54px;
    color: $color-text-d;
    background: $color-highlight-background;
    border-radius: 5px;
    border-bottom: 1px solid $color-border;
  }
  .dept-tree {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }

    .el-tree-node__content {
      height: 50px;
      padding-left: 50px;
      padding-right: 10px;
    }
    .dept-tree .el-tree-node__content {
      border-bottom: 1px solid $color-border;
    }
  }
  .content-midden {
    height: 400px;
    overflow: auto;
  }
}
</style>
