<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <div>
        条形码：
        <el-input maxlength="20" style="width: 250px;" size="small" v-model.trim="barCode4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        文件名：
        <el-input maxlength="20" style="width: 250px;" size="small" v-model.trim="name4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        位置：
        <el-input maxlength="50" style="width: 850px;" size="small" v-model.trim="position4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <el-button style="float:right" size="small" @click="saveDocument" icon="el-icon-plus" type="primary">入库</el-button>
      <el-button style="float:right" size="small" @click="cleanSave" icon="el-icon-plus" type="primary">清空</el-button>
    </div>
    <div class="header">
      <div>
        条形码：
        <el-input maxlength="20" @keyup.enter.native="handleIconSearchClick" style="width: 100px;" size="small" v-model.trim="barCode"
                  placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        文件名：
        <el-input maxlength="20" style="width: 100px;" size="small" v-model.trim="name" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        位置：
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="position" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        起始入库时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousInTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        截止入库时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterInTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        起始出库时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousOutTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        截止出库时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterOutTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        状态：
        <el-select v-model="selectState" @change="selectStateChange" placeholder="请选择" style="width: 100px;">
          <el-option v-for="item in stateOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <el-button size="small" @click="handleIconSearchClick" icon="el-icon-plus" type="primary">搜索</el-button>
      <el-button size="small" @click="cleanSearch" icon="el-icon-plus" type="primary">清空</el-button>
    </div>
    <el-table
      :data="tableData"
    >
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="条形码">
        <template slot-scope="scope">
          <span>{{ scope.row.barCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <span>{{ scope.row.position}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库状态">
        <template slot-scope="scope">
          <span>{{ scope.row.state | stateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间">
        <template slot-scope="scope">
          <span>{{ scope.row.inTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库时间">
        <template slot-scope="scope">
          <span>{{ scope.row.outTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state != 0" @click="outStore(scope.row.id)">出库</el-button>
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
  import {documentList, documentSave, documentOutStore} from 'api/systmanager'
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
        this.params.name = this.name;
        this.params.barCode = this.barCode;
        this.params.position = this.position;
        this.params.state = this.searchState;
        this.params.previousInTime = this.previousInTime;
        this.params.latterInTime = this.latterInTime;
        this.params.previousOutTime = this.previousOutTime;
        this.params.latterOutTime = this.latterOutTime;
        documentList(this.params).then(res => {
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
      outStore(val) {
        this.params.id = val;
        documentOutStore(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this._loadData();
          }
        })
      },
      saveDocument () { // 新增
        if (null == this.name4Add || "" == this.name4Add) {
          this.$message({
            type: 'error',
            message: '文件名不能为空!',
            duration: 1500
          });
          return;
        }
        if (null == this.barCode4Add || "" == this.barCode4Add) {
          this.$message({
            type: 'error',
            message: '条形码不能为空!',
            duration: 1500
          });
          return;
        }
        if (null == this.position4Add || "" == this.position4Add) {
          this.$message({
            type: 'error',
            message: '位置不能为空!',
            duration: 1500
          });
          return;
        }
        this.params.name4Add = this.name4Add;
        this.params.barCode4Add = this.barCode4Add;
        this.params.position4Add = this.position4Add;
        documentSave(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this.cleanSave();
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
        this.name4Add = "";
        this.barCode4Add = "";
        this.position4Add = "";
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
