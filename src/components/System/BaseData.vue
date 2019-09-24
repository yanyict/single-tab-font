<template>
  <div>
    <div>
      <el-button v-if="isHasPermission('modSave')" @click="handleAdd" size="small" icon="el-icon-plus" type="primary">新增</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
        <el-table-column label="数据类型" prop="name">
        </el-table-column>
        <el-table-column label="权限" prop="permissionType">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.permissionType" @change="itemChange(scope.$index)">
              <el-radio :disabled="!isHasPermission('modType')" :label="0">私有</el-radio>
              <el-radio :disabled="!isHasPermission('modType')" :label="1">公开只读</el-radio>
              <el-radio :disabled="!isHasPermission('modType')" :label="2">公开读写</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <btn > -->
              <el-button v-if="isHasPermission('modEdit')" type="text" size="small" @click="handleEditer(scope.$index, scope.row)">编辑</el-button>
            <!-- </btn> -->
            <el-button v-if="isHasPermission('modDelete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
      <el-dialog :title="Dialogtitle" :visible.sync="DialogModule" width="520px" class="change-pwd-dialog" :before-close="CloseModule">
      <div class="content">
        <el-form :model="formmodule" :rules="modRules" label-width="90px" ref="formModule" size="small">
          <el-form-item label="名称：" prop="name">
              <el-input size="small" v-model="formmodule.name" placeholder="请输入数据类型名称"></el-input>
          </el-form-item>
          <el-form-item label="主表名：" prop="mainTableName">
              <el-input size="small" v-model="formmodule.mainTableName" placeholder="请输入主表名"></el-input>
          </el-form-item>
          <el-form-item label="权限类型：" prop="permissionType">
              <el-radio-group v-model="formmodule.permissionType">
                <el-radio :label="0">私有</el-radio>
                <el-radio :label="1">公开只读</el-radio>
                <el-radio :label="2">公开读写</el-radio>
              </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button  size="small" @click="CloseModule">取消</el-button>
        <el-button  size="small" @click="handleAddModule" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isHasPermission } from 'common/js/utils'
import { ERR_OK } from 'api/config'
import { reqModuleList, reqModuleSave, reqModuleUpdate, reqModuleDelete, reqModuleType } from 'api/systmanager'
// import Btn from 'components/Btn'
export default {
  // components: {
  //   Btn
  // },
  created () {
    this._loadData()
  },
  data () {
    return {
      formmodule: {
        name: '',
        permissionType: 0,
        mainTableName: ''
      },
      modRules: {
        name: [
          { required: true, message: '请输入数据类型名称', trigger: 'blur' },
          { min: 3, max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ],
        mainTableName: [
          { required: true, message: '请输入字典类别', trigger: 'blur' },
          { min: 3, max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ]
      },
      Dialogtitle: '',
      tableData: [],
      currentIndex: 1,
      loading: false,
      DialogModule: false
      // params: {
      //   keyWord: '',
      //   pageIndex: 1,
      //   pageSize: 10
      // },
      // total: 0
    }
  },
  methods: {
    itemChange (index) { // 修改类型权限
      let data = this.tableData[index]
      console.log(data)
      let params = {
        id: data.id,
        permissionType: data.permissionType
      }
      reqModuleType(params).then(res => {
        console.log(res)
        if (res.resultCode === ERR_OK) {
          this.$message({
            type: 'success',
            message: res.resultMessage,
            duration: 1500
          })
        }
      })
    },
    handleAdd () {
      this.DialogModule = true
      this.Dialogtitle = '新增数据类型'
    },
    _loadData () {
      reqModuleList().then(res => {
        if (res.resultCode === ERR_OK) {
          this.tableData = res.data
        }
      })
    },
    CloseModule () {
      this.DialogModule = false
      this.$refs.formModule.resetFields()
    },
    handleAddModule () {
      this.$refs.formModule.validate((valid) => {
        if (valid) {
          if (!this.formmodule.id) {
            reqModuleSave(this.formmodule).then(res => {
              if (res.resultCode === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '新增数据类型成功!',
                  duration: 1500
                })
                this.DialogModule = false
                this._loadData()
              }
            })
          } else {
            reqModuleUpdate(this.formmodule).then(res => {
              if (res.resultCode === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '修改数据类型成功!',
                  duration: 1500
                })
                this.DialogModule = false
                this._loadData()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleEditer (index, item) {
      this.Dialogtitle = '编辑数字类型'
      let data = Object.assign({}, item)
      console.log(data)
      this.DialogModule = true
      this.$nextTick(() => {
        this.formmodule = {
          name: data.name,
          mainTableName: data.mainTableName,
          permissionType: data.permissionType,
          id: data.id
        }
      })
    },
    handleDelete (index, item) { // 删除字典
      this.$confirm('此操作将永久删除该数据类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: []
        }
        params.ids.push(item.id)
        reqModuleDelete(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: res.resultMessage,
              duration: 1500
            })
            this._loadData()
          }
        })
      })
    },
    isHasPermission
    // handleSizeChange (val) { // 改变显示条数
    //   this.params.pageIndex = 1
    //   this.params.pageSize = val
    //   this._loadData()
    // },
    // handleCurrentChange (val) { // 切换页面
    //   this.params.pageIndex = val
    //   this._loadData()
    // }
  }
}
</script>

<style scoped>

</style>
