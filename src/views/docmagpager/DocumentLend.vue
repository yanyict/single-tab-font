<template>
  <div class="base-box role-manager-box">
    <div class="header">
      <div>
        条形码：
        <el-input style="width: 200px;" size="small" v-model.trim="barCode" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        文件名：
        <el-input style="width: 200px;" size="small" v-model.trim="name" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        位置：
        <el-input style="width: 200px;" size="small" v-model.trim="position" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        <el-select v-model="selectState" @change="selectStateChange" placeholder="请选择">
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
      <el-table-column label="借阅状态">
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
            <el-input style="width: 100px;" size="small"
                      v-model.number="scope.row.deadline"
                      type="number"
                      oninput="if(value.length>3)value=value.slice(0,3)"
                      placeholder="请输入期限"></el-input>
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
          <el-button v-if="scope.row.state == 1" @click="lendDocument(scope.row.id, scope.row.deadline, scope.row.render)">借出</el-button>
          <el-button v-if="scope.row.state == 2" @click="returnDocument(scope.row.id)">归还
          </el-button>
        </template>
      </el-table-column></el-table>
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
        searchContent: '',
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
    watch: {
//      searchContent () {
//        let timer
//        if (timer) { // 优化搜索请求
//          clearTimeout(timer)
//        }
//        timer = setTimeout(() => {
//          this.handleIconSearchClick()
//        }, 500)
//      }
    },
    methods: {
//      configManager (row) {
//        this.$router.push({ path: '/sys/rolemanager/rolepermission', query: { id: row.id, name: row.name } })
//      },
      _loadData(name = '文档') { // 加载列表
        this.loading = true;
        documentList(this.params).then(res => {
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
      lendDocument(id, deadline, render) {
        this.params.id = id;
        if (null == deadline || "" == deadline || null == render || "" == render) {
            return;
        }
        this.params.deadline = deadline;
        this.params.render = render;
        documentLend(this.params).then(res => {
          if (res.resultCode === ERR_OK) {
            this._loadData();
          }
        })
      },
      returnDocument(id) {
        this.params.id = id;
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
        this.params.name = this.name;
        this.params.barCode = this.barCode;
        this.params.position = this.position;
        this.params.state = this.searchState;
        this.params.pageIndex = 1;
        this._loadData()
      },
      cleanSearch() {
        this.params.pageIndex = 1;
        this.params.name = "";
        this.params.barCode = "";
        this.params.position = "";
        this.params.state = -2;
        this.name = "";
        this.barCode = "";
        this.position = "";
        this.searchState=-2;
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
