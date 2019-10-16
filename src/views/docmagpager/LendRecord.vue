<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <el-row>
        <el-col :span="22">
          <el-form :inline="true" size="small">
            <el-form-item label="条形码：">
              <el-input maxlength="20" @keyup.enter.native="handleIconSearchClick" style="width: 200px;" size="small" v-model.trim="barCode" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="全宗号：">
              <el-input maxlength="20" style="width: 200px;" size="small" v-model.trim="archiveNumber" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="文件名：">
              <el-input maxlength="20" style="width: 200px;" size="small" v-model.trim="name" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="借阅人：">
              <el-input maxlength="20" style="width: 150px;" size="small" v-model.trim="renderTemp" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="年份：">
              <el-input maxlength="50" style="width: 150px;" size="small" v-model.trim="previousYear" placeholder="请输入内容">
              </el-input>
              到
              <el-input maxlength="50" style="width: 150px;" size="small" v-model.trim="latterYear" placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item>
              第
              <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="previousVolumeNumber"
                        placeholder="请输入内容">
              </el-input>
              到
              <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="latterVolumeNumber"
                        placeholder="请输入内容">
              </el-input>
              卷(盒)
            </el-form-item>
            <el-form-item label="起始时间：">
              <el-date-picker style="width: 150px;"
                              v-model="previousTime"
                              type="date"
                              placeholder="日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止时间：">
              <el-date-picker style="width: 150px;"
                        v-model="latterTime"
                        type="date"
                        placeholder="日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="动作：">
              <el-select v-model="selectState" @change="selectStateChange" placeholder="请选择" style="width: 100px;">
                <el-option v-for="item in stateOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          

          </el-form>
        </el-col>
        <el-col :span="2">
          <el-form :inline="true" size="small" style="text-align: right;">
            <el-form-item>
              <el-button size="small" @click="handleIconSearchClick" icon="el-icon-plus" type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="cleanSearch" icon="el-icon-plus" type="primary">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData">
      <el-table-column width="80%" label="全宗号">
        <template slot-scope="scope">
          <span>{{scope.row.archiveNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="条形码">
        <template slot-scope="scope">
          <span>{{scope.row.barCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80%" label="文件名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column><el-table-column width="80%"  label="年份">
      <template slot-scope="scope">
        <span>{{scope.row.year}}</span>
      </template>
    </el-table-column>
      <el-table-column width="100%"  label="第几卷(盒)">
        <template slot-scope="scope">
          <span>{{ scope.row.volumeNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="凭证号">
        <template slot-scope="scope">
          <span>{{ scope.row.startCertificate}}</span><span v-if="scope.row.startCertificate != null">至</span><span>{{ scope.row.endCertificate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="档案类别">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80%" label="动作">
        <template slot-scope="scope">
          <span>{{scope.row.state | stateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.time | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅人">
        <template slot-scope="scope">
          <span>{{scope.row.render}}</span>
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
  import {lendRecordList} from 'api/systmanager'
  import Btn from 'components/Btn'
  import {mapGetters} from 'vuex'

  export default {
    name: 'LendRecordManager',
    components: {
      Btn
    },
    data () {
      return {
        tableData: [],
        itemData: {},
        barCode: '',
        previousTime: '',
        latterTime: '',
        stateOptions: [{
          value: '3',
          label: '归还'
        }, {
          value: '2',
          label: '借出'
        }, {
          value: '1',
          label: '入库'
        }, {
          value: '0',
          label: '出库'
        }, {
          value: '-1',
          label: '全部'
        }],
        selectState: '-1',
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
        if (0 == state) return "出库";
        if (1 == state) return "入库";
        if (2 == state) return "借出";
        if (3 == state) return "归还";
      },
      typeName (type) {
        if (1 == type) return "会计档案"
        else return "会计凭证"
      }
    },
    computed: {
      ...
        mapGetters([
          'user'
        ])
    },
    watch: {
    },
    methods: {
//      configManager (row) {
//        this.$router.push({ path: '/sys/rolemanager/rolepermission', query: { id: row.id, name: row.name } })
//      },
      _loadData(name = '文档')
      { // 加载列表
        this.loading = true;
        this.params.name = this.name;
        this.params.barCode = this.barCode;
        this.params.state = this.searchState;
        this.params.render = this.renderTemp;
        this.params.previousTime = this.previousTime;
        this.params.latterTime = this.latterTime;
        this.params.previousYear = this.previousYear;
        this.params.latterYear = this.latterYear;
        this.params.previousVolumeNumber = this.previousVolumeNumber;
        this.params.latterVolumeNumber = this.latterVolumeNumber;
        this.params.archiveNumber = this.archiveNumber;
        lendRecordList(this.params).then(res => {
          this.barCode = "";
          this.loading = false;
          if (res.resultCode === ERR_OK && res.data.data) {
            let tableData = res.data.data;
            let No = (res.data.pageIndex - 1) * res.data.pageSize;
            tableData.map(item => {
              item.show = false;
              item.delViewVisible = false;
              item.No = ++No;
            });
            this.tableData = tableData;
            this.pageSize = res.data.pageSize;
            this.total = res.data.count
          }
        })
      },
      selectStateChange(value)
      {
        this.searchState = value;
      },
      returnDocument(id)
      {
        this.params.id = id;
        documentReturn(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this._loadData();
          }
        })
      },
      handleEditer(index, row)
      { // 编辑
        this.itemData = JSON.parse(JSON.stringify(row));
        row.show = !row.show
      },
      handleDelete(index, row)
      { // 删除
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
      handleCancel(index, row)
      { // 取消
        if (!row.id) {
          this.tableData.splice(index, 1)
        }
        Object(row, this.itemData);
        row.show = false
      },
      handleIconSearchClick()
      {
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this._loadData()
      },
      cleanSearch()
      {
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this.name = "";
        this.barCode = "";
        this.renderTemp = "";
        this.previousTime = "";
        this.latterTime = "";
        this.previousYear = "";
        this.latterYear = "";
        this.previousVolumeNumber = "";
        this.latterVolumeNumber = "";
        this.archiveNumber = "";
        this.searchState = -1;
        this.selectState = "全部";
        this._loadData()
      },
      handleSizeChange(val)
      { // 改变显示条数
        this.params.pageIndex = 1;
        this.currentIndex = 1;
        this.params.pageSize = val;
        this._loadData()
      },
      handleCurrentChange(val)
      { // 切换页面
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
