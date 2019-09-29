<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <div>
        条形码：
        <el-input @keyup.enter.native="handleIconSearchClick" style="width: 100px;" size="small"
                  v-model.trim="barCode"
                  placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        文件名：
        <el-input style="width: 100px;" size="small" v-model.trim="name" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        借阅人：
        <el-input style="width: 100px;" size="small" v-model.trim="renderTemp" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        起始借出时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousLendTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        截止借出时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterLendTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        起始归还时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousReturnTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        截止归还时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterReturnTime"
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
      <el-button style="float:right" size="small" @click="handleIconSearchClick" icon="el-icon-plus" type="primary">搜索</el-button>
      <el-button style="float:right" size="small" @click="cleanSearch" icon="el-icon-plus" type="primary">清空</el-button>
    </div>
    <el-table
      :data="tableData"
    >
      <el-table-column width="80%" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="条形码">
        <template slot-scope="scope">
          <span>{{scope.row.barCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <span>{{ scope.row.position}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80%" label="借阅状态">
        <template slot-scope="scope">
          <span>{{scope.row.state | stateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅时间">
        <template slot-scope="scope">
          <span>{{scope.row.lendTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还期限">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 2">{{scope.row.returnTime | formatDate}}</span>
          <div v-if="scope.row.state == 1">
            <el-input-number style="width: 110px;"
                             size="small"
                             type="number"
                             @change="deadlineChange($event, scope.row)"
                             v-model.number="scope.row.deadline"
                             :min="1" :max="999"
                             oninput="if(value.length>3)value=value.slice(0,3)"
                             placeholder="期限"></el-input-number>
            &nbsp天
          </div>
        </template>
      </el-table-column>
      <el-table-column label="借阅人">
        <template slot-scope="scope">
          <el-input style="width: 100px;"
                    size="small"
                    v-model.number="scope.row.render"
                    v-bind:disabled="scope.row.state == 2"
                    oninput="if(value.length>4)value=value.slice(0,5)"
                    placeholder="借阅人姓名"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state == 1"
                     @click="lendDocument(scope.row.id, scope.row.deadline, scope.row.render, scope.row.barCode, scope.row.name)">
            借出
          </el-button>
          <el-button v-if="scope.row.state == 2"
                     @click="returnDocument(scope.row.id, scope.row.render, scope.row.barCode, scope.row.name)">
            归还
          </el-button>
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
  </div>
</template>
<script>
  import {formatDate, isHasPermission} from 'common/js/utils'
  import {ERR_OK} from 'api/config'
  import {documentList, documentLend, documentReturn} from 'api/systmanager'
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
        previousLendTime: '',
        latterLendTime: '',
        previousReturnTime: '',
        latterReturnTime: '',
        stateOptions: [{
          value: '2',
          label: '已借出'
        }, {
          value: '1',
          label: '未借出'
        }, {
          value: '-2',
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
        if (0 == state) return "出库";
        if (1 == state) return "未借出";
        if (2 == state) return "已借出";
      }
    },
    computed: {
      ...
        mapGetters([
          'user'
        ])
    },
    watch: {},
    methods: {
//      configManager (row) {
//        this.$router.push({ path: '/sys/rolemanager/rolepermission', query: { id: row.id, name: row.name } })
//      },
      _loadData(name = '文档') { // 加载列表
        this.loading = true;
        this.params.name = this.name;
        this.params.position = this.position;
        this.params.state = this.searchState;
        this.params.render = this.renderTemp;
        this.params.previousLendTime = this.previousLendTime;
        this.params.latterLendTime = this.latterLendTime;
        this.params.previousReturnTime = this.previousReturnTime;
        this.params.latterReturnTime = this.latterReturnTime;
        documentList(this.params).then(res => {
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
      selectStateChange(value) {
        this.searchState = value;
      },
      deadlineChange(obj1, obj2) {
//        if (obj2.deadline > 10) {
//            obj2.deadline = 10;
//        }
      },
      lendDocument(id, deadline, render, barCode, name) {
        if (null == deadline || "" == deadline) {
          this.$message({
            type: 'error',
            message: '期限不能为空!',
            duration: 1500
          });
          return;
        }
        if (0 > deadline) {
          this.$message({
            type: 'error',
            message: '期限小于0!',
            duration: 1500
          });
          return;
        }
        if (null == deadline || "" == deadline || null == render || "" == render) {
          this.$message({
            type: 'error',
            message: '借阅人不能为空!',
            duration: 1500
          });
          return;
        }
        this.params.id = id;
        this.params.deadline = deadline;
        this.params.render = render;
        this.params.barCode = barCode;
        this.params.name = name;
        documentLend(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this._loadData();
          }
        })
      },
      returnDocument(id, render, barCode, name) {
        this.params.id = id;
        this.params.render = render;
        this.params.barCode = barCode;
        this.params.name = name;
        documentReturn(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this._loadData();
          }
        })
      },
      handleEditer(index, row) { // 编辑
        this.itemData = JSON.parse(JSON.stringify(row));
        row.show = !row.show
      },
      handleDelete(index, row) { // 删除
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
      handleCancel(index, row) { // 取消
        if (!row.id) {
          this.tableData.splice(index, 1)
        }
        Object(row, this.itemData);
        row.show = false
      },
      handleSave(index, row) { // 保存
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
      handleIconSearchClick() {
        this.params.pageIndex = 1;
        this.params.barCode = this.barCode;
        this._loadData()
      },
      cleanSearch() {
        this.params.pageIndex = 1;
        this.params.barCode = "";
        this.name = "";
        this.barCode = "";
        this.position = "";
        this.renderTemp = "";
        this.previousLendTime = "";
        this.latterLendTime = "";
        this.previousReturnTime = "";
        this.latterReturnTime = "";
        this.searchState = -2;
        this._loadData()
      },
      handleSizeChange(val) { // 改变显示条数
        this.params.pageIndex = 1;
        this.params.pageSize = val;
        this._loadData()
      },
      handleCurrentChange(val) { // 切换页面
        this.params.pageIndex = val;
        this._loadData()
      },
//      isShowFunc (func) { // 查看是否有功能权限
//        return isHasPermission(func)
//      }
    }
  }
</script>
