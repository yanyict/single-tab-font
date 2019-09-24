<template>
  <div class="dept-box base-box">
    <div style="margin-bottom:10px;">
      <el-button v-if="isShowFunc('saveDictionary')" icon="el-icon-plus" size="small" @click="onAddDictionary" type="primary">新增</el-button>
      <!-- <el-button  size="small" icon="el-icon-upload2">导出</el-button> -->
    </div>
    <div class="item_box" v-for="(item,index) in itemsBox" :key="index">
      <div class="position">
        <btn v-if="isShowFunc('editDictionary')"><el-button type="text" size="small" @click="handleEdit(index,item)">编辑</el-button></btn>
        <el-button v-if="isShowFunc('removeDictionary')" type="text" size="small" @click="handleDelete(index,item)">删除</el-button>
      </div>
      <header class="title" style="padding-bottom:15px;">{{item.name}}</header>
      <div style="padding-bottom:15px;">
        <el-tag style="margin-right:10px" v-for="tag in item.childrenList" :key="tag.id"  closable :disable-transitions='true'
         @close="handleClose(index,tag)">{{tag.name}}</el-tag>
        <el-button v-if="isShowFunc('saveDictionary')"  :plain="true" class="button-new-tag" size="small" @click="onAddMark(index, item)">+ 新增值</el-button>
      </div>
      <div>
          <btn><span class="iconfont icon-icon--"></span> {{item.category}}</btn> <span class="iconfont icon-describe"></span> {{item.comment}}
      </div>
    </div>
    <el-dialog :title="dictionarytitle" :visible.sync="dialogDictionary" width="520px" class="change-pwd-dialog" :before-close="closeDialog">
      <div class="content">
        <el-form :model="dictionary" :rules="dicRules" label-width="80px" ref="formdiction" size="small">
          <el-form-item label="名称：" prop="name">
              <el-input size="small" v-model="dictionary.name" placeholder="请输入字典类型名称"></el-input>
          </el-form-item>
          <el-form-item label="类别：" prop="category">
              <el-input size="small" v-model="dictionary.category" placeholder="请输入标签"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="comment">
              <el-input type="textarea" rows="3" size="small" resize="none" maxlength="120" v-model="dictionary.comment" placeholder="请输入描述信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button  size="small" @click="closeDialog">取消</el-button>
        <el-button  size="small" @click="handleAddDictionary" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增值" :visible.sync="dialogDictionaryChildren" width="520px" class="change-pwd-dialog">
      <div class="content">
        <el-form :model="children" :rules="dicchilRules" label-width="80px" ref="dicChild" size="small">
          <el-form-item label="名称：" prop="name">
              <el-input size="small" v-model="children.name" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button  size="small" @click="dialogDictionaryChildren = false">取消</el-button>
        <el-button  size="small" @click="handleAddDictionaryChildren" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isHasPermission } from 'common/js/utils'
// import { passwordValidate } from 'common/js/validate'
import { ERR_OK } from 'api/config'
import { reqDictionaryList, reqBatchRemove, reqDictionaryUpdate, reqDictionarySave, reqDictionarysaveChildren } from 'api/systmanager'
import Btn from 'components/Btn'
export default {
  components: {
    Btn
  },
  created () {
    this._loadData()
  },
  data () {
    return {
      dialogDictionary: false,
      dialogDictionaryChildren: false,
      dictionarytitle: '',
      dicRules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { min: 3, max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入字典类别', trigger: 'blur' },
          { min: 3, max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ],
        comment: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      dicchilRules: {
        name: [
          { required: true, message: '请输入新增值名称', trigger: 'blur' },
          { min: 3, max: 120, message: '长度在 3 到 120 个字符', trigger: 'blur' }
        ]
      },
      dictionary: {
        name: '',
        category: '',
        comment: ''
      },
      children: {
        parentId: '',
        name: ''
      },
      itemsBox: []
    }
  },
  methods: {
    _loadData () {
      reqDictionaryList().then(res => {
        if (res.resultCode === ERR_OK) {
          this.itemsBox = res.data
        }
      })
    },
    onAddDictionary () { // 点击新增
      this.dialogDictionary = true
      this.dictionarytitle = '新增数字字典'
    },
    closeDialog () {
      this.dialogDictionary = false
      this.$refs.formdiction.resetFields()
    },
    handleClose (index, tag) { // 删除标签
      if (this.isShowFunc('removeDictionary')) {
        this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: []
          }
          params.ids.push(tag.id)
          reqBatchRemove(params).then(res => {
            if (res.resultCode === ERR_OK) {
              this.$message({
                type: 'success',
                message: '删除类型成功!',
                duration: 1500
              })
              this._loadData()
            }
          })
        })
      } else {
        this.$message.error('您没有权限进行删除')
      }
      // this.itemsBox[index].splice(this.tags.indexOf(tag), 1)
    },
    handleEdit (index, item) { // 编辑字典
      this.dictionarytitle = '编辑数字字典'
      let data = Object.assign({}, item)
      this.dialogDictionary = true
      this.$nextTick(() => {
        this.dictionary = {
          name: data.name,
          category: data.category,
          comment: data.comment,
          id: data.id
        }
      })
    },
    handleDelete (index, item) { // 删除字典
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: []
        }
        params.ids.push(item.id)
        reqBatchRemove(params).then(res => {
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
    handleAddDictionary () { // 确认新增数据字典
      this.$refs.formdiction.validate((valid) => {
        if (valid) {
          if (!this.dictionary.id) {
            reqDictionarySave(this.dictionary).then(res => {
              if (res.resultCode === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '新增字典成功!',
                  duration: 1500
                })
                this.dialogDictionary = false
                this._loadData()
              }
            })
          } else {
            reqDictionaryUpdate(this.dictionary).then(res => {
              if (res.resultCode === ERR_OK) {
                this.$message({
                  type: 'success',
                  message: '修改字典成功!',
                  duration: 1500
                })
                this.dialogDictionary = false
                this._loadData()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    onAddMark (index, item) { // 新增值
      this.dialogDictionaryChildren = true
      this.children.parentId = item.id
      this.children.name = ''
    },
    handleAddDictionaryChildren () { // 新增值
      this.$refs.dicChild.validate((valid) => {
        if (valid) {
          reqDictionarysaveChildren(this.children).then(res => {
            if (res.resultCode === ERR_OK) {
              this.$message({
                type: 'success',
                message: '新增值成功!',
                duration: 1500
              })
              this.dialogDictionaryChildren = false
              this._loadData()
            }
          })
        } else {
          return false
        }
      })
    },
    isShowFunc (func) { // 查看是否有功能权限
      return isHasPermission(func)
    }
  }
}
</script>

<style scoped lang='scss'>
.item_box {
  position: relative;
  padding: 15px 10px;
  border-bottom: 1px solid #ccc;
  .title {
    font-size: 16px;
    color: #000;
  }
  .position {
    position: absolute;
    right: 15px;
    top: 15px;
  }
}
.item_box .iconfont {
  font-size: 16px;
}
</style>
