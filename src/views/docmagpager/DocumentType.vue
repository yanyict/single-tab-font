<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <el-row style="width:100%;">
        <el-col :span="20">
          <el-form :inline="true" size="small">
            <el-form-item label="类型编码：">
              <el-input maxlength="20" style="width: 200px;" size="small" v-model.trim="type" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="类型名称：">
              <el-input maxlength="20" style="width: 200px;" size="small" v-model.trim="name" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="saveDocumentType" icon="el-icon-plus" type="primary">保存</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="cleanSave" icon="el-icon-plus" type="primary">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData">
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型编码">
        <template slot-scope="scope">
          <span>{{ scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state != 0" @click="deleteById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatDate, isHasPermission} from 'common/js/utils'
  import {ERR_OK} from 'api/config'
  import {documentTypeList, documentTypeSave, documentTypeDelete, getBarCode} from 'api/systmanager'
  import Btn from 'components/Btn'
  import {mapGetters} from 'vuex'

  export default {
    name: 'DocumentManager',
    components: {
      Btn
    },
    data () {
      return {
        tableData: [],
        itemData: {},
        barCode: '',
        barCode4Add: '',
        previousInTime: '',
        latterInTime: '',
        previousOutTime: '',
        latterOutTime: '',
        stateOptions: [{
          value: '0',
          label: '出库'
        }, {
          value: '-2',
          label: '在库'
        }, {
          value: '-1',
          label: '全部'
        }],
        selectState: '-2',
        type4AddOptions: [{
          value: '1',
          label: '会计档案'
        }, {
          value: '2',
          label: '会计凭证'
        }],
        selectType4Add: '1',
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
        if (null != time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd')
        } else return ""
      },
      stateName (state) {
        if (0 == state) return "出库"
        else return "在库"
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    watch: {},
    methods: {
//      configManager (row) {
//        this.$router.push({ path: '/sys/rolemanager/rolepermission', query: { id: row.id, name: row.name } })
//      },
      _loadData (name = '文档') { // 加载列表
        this.loading = true;
        documentTypeList(this.params).then(res => {
          this.barCode = "";
          this.loading = false;
          if (res.resultCode === ERR_OK && res.data.data) {
            let tableData = res.data.data;
            let No = (res.data.pageIndex - 1) * res.data.pageSize;
            tableData.map(item => {
              item.show = false;
              item.delViewVisible = false;
              item.No = ++No
            });
            this.tableData = tableData;
            this.pageSize = res.data.pageSize;
            this.total = res.data.count
          }
        })
      },
      selectStateChange(value) {
        this.searchState = value;
      },
      selectType4AddChange(value) {
        this.type4Add = value;
      },
      deleteById(val) {
        this.params.id = val;
        documentTypeDelete(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            if (res.data.resultCode === ERR_OK) {
              this.$message({
                type: 'success',
                message: res.data.resultMessage,
                duration: 1500
              });
            }
            this._loadData();
          }
        })
      },
      createBarCode() {
        getBarCode(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.barCode4Add = res.data.resultMessage;
          }
        })
      },
      saveDocumentType () { // 新增
        if (null == this.name || "" == this.name) {
          this.$message({
            type: 'error',
            message: '类型名称不能为空!',
            duration: 1500
          });
          return;
        }
        if (null == this.type || "" == this.type) {
          this.$message({
            type: 'error',
            message: '类型编码不能为空!',
            duration: 1500
          });
          return;
        }
        this.params.name = this.name;
        this.params.type = this.type;
        documentTypeSave(this.params).then(res => {
          if (res.data.resultCode === ERR_OK) {
            this.$message({
              type: 'success',
              message: res.data.resultMessage,
              duration: 1500
            });
            this.cleanSave();
          }
          if (res.data.resultCode === 400) {
            this.$message({
              type: 'error',
              message: res.data.resultMessage,
              duration: 1500
            });
            this.barCode4Add = "";
          }
        })
      },
      handleEditer (index, row) { // 编辑
        this.itemData = JSON.parse(JSON.stringify(row))
        row.show = !row.show
      },
      handleDelete (index, row) { // 删除
        let params = 'id=' + row.id;
        reqDelRole(params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.tableData.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1500
            });
            this._loadData()
          }
        })
      },
      handleCancel (index, row) { // 取消
        if (!row.id) {
          this.tableData.splice(index, 1)
        }
        Object(row, this.itemData);
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
        };
        if (!row.id) {
          reqAddRole(params).then(res => {
            if (res.resultCode === ERR_OK) {
              this._loadData();
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
              row.show = false;
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
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this._loadData()
      },
      cleanSave () {
        this.name = "";
        this.type = "";
        this._loadData()
      },
      cleanSearch () {
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this.name = "";
        this.barCode = "";
        this.position = "";
        this.previousInTime = "";
        this.latterInTime = "";
        this.previousOutTime = "";
        this.latterOutTime = "";
        this.searchState = -2;
        this.selectState = "在库";
        this._loadData()
      },
      handleSizeChange (val) { // 改变显示条数
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this.params.pageSize = val;
        this._loadData()
      },
      handleCurrentChange (val) { // 切换页面
        this.params.pageIndex = val;
        this.currentIndex = val;
        this._loadData()
      },
//      isShowFunc (func) { // 查看是否有功能权限
//        return isHasPermission(func)
//      }
    }
  }
</script>
