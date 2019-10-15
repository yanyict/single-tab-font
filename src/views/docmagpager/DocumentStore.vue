<template>
  <div class="base-box role-manager-box">
    <el-dialog
      title="确认删除"
      :visible.sync="dialogVisible"
      width="12%"
      :before-close="handleClose">
      <!--<span slot="footer" class="dialog-footer">-->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      <!--</span>-->
    </el-dialog>
    <div class="header">
      <div>
        文档类型：
        <el-select v-model="selectType4Add" @change="selectType4AddChange" placeholder="请选择" style="width: 150px;">
          <el-option v-for="item in type4AddOptions" :key="item.type" :value="item.type" :label="item.name"></el-option>
        </el-select>
      </div>
      <div>
        条形码：
        <el-input maxlength="20" style="width: 100px;" size="small" v-model.trim="barCode4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        文件名：
        <el-input maxlength="20" style="width: 100px;" size="small" v-model.trim="name4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        全宗号：
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="archiveNumber4Add"
                  placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        自
        <el-date-picker style="width: 150px;"
                        v-model="startTime4Add"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
        起至
        <el-date-picker style="width: 150px;"
                        v-model="endTime4Add"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div>
        本盒共
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="volume4Add" placeholder="请输入内容">
        </el-input>
        <span v-if="type4Add==1">卷</span>
        <span v-if="type4Add==2">册</span>
      </div>
      <div>
        共
        <el-input :disabled="type4Add===1?false:true" maxlength="50" style="width: 100px;" size="small"
                  v-model.trim="share4Add" placeholder="请输入内容">
        </el-input>
        份
      </div>
    </div>
    <div class="header">
      <div>
        位置：
        <el-input maxlength="50" style="width: 300px;" size="small" v-model.trim="position4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        保管期限：
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="storeLimit4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        年份：
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="year4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        第
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="volumeNumber4Add" placeholder="请输入内容">
        </el-input>
        <span v-if="type4Add==1">卷</span>
        <span v-if="type4Add==2">盒</span>
      </div>
      <div>
        凭证号：
        <el-input :disabled="type4Add===2?false:true" maxlength="50" style="width: 100px;" size="small"
                  v-model.trim="startCertificate4Add" placeholder="请输入内容">
        </el-input>
        至
        <el-input :disabled="type4Add===2?false:true" maxlength="50" style="width: 100px;" size="small"
                  v-model.trim="endCertificate4Add" placeholder="请输入内容">
        </el-input>
      </div>
      <el-button style="float:right" size="small" @click="createBarCode" icon="el-icon-plus" type="primary">生成条形码
      </el-button>
      <el-button style="float:right" size="small" @click="saveDocument" icon="el-icon-plus" type="primary">添加
      </el-button>
      <el-button style="float:right" size="small" @click="cleanSave" icon="el-icon-plus" type="primary">清空</el-button>
    </div>
    <div class="header">
      <div>
        条形码：
        <el-input maxlength="20" @keyup.enter.native="handleIconSearchClick" style="width: 100px;" size="small"
                  v-model.trim="barCode"
                  placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        全宗号：
        <el-input maxlength="20" style="width: 100px;" size="small" v-model.trim="archiveNumber" placeholder="请输入内容">
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
        年份：
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="previousYear" placeholder="请输入内容">
        </el-input>
        到
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="latterYear" placeholder="请输入内容">
        </el-input>
      </div>
      <div>
        第
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="previousVolumeNumber"
                  placeholder="请输入内容">
        </el-input>
        到
        <el-input maxlength="50" style="width: 100px;" size="small" v-model.trim="latterVolumeNumber"
                  placeholder="请输入内容">
        </el-input>
        卷(盒)
      </div>
      <div v-if="false">
        起始入库时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousInTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div v-if="false">
        截止入库时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterInTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div v-if="false">
        起始出库时间：
        <el-date-picker style="width: 150px;"
                        v-model="previousOutTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div v-if="false">
        截止出库时间：
        <el-date-picker style="width: 150px;"
                        v-model="latterOutTime"
                        type="date"
                        placeholder="日期">
        </el-date-picker>
      </div>
      <div v-if="false">
        状态：
        <el-select v-model="selectState" @change="selectStateChange" placeholder="请选择" style="width: 100px;">
          <el-option v-for="item in stateOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <el-button size="small" @click="handleIconSearchClick" icon="el-icon-plus" type="primary">搜索</el-button>
      <el-button size="small" @click="cleanSearch" icon="el-icon-plus" type="primary">清空</el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column label="全宗号">
        <template slot-scope="scope">
          <span>{{ scope.row.archiveNumber}}</span>
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
      <el-table-column label="年份">
        <template slot-scope="scope">
          <span>{{ scope.row.year}}</span>
        </template>
      </el-table-column>
      <el-table-column label="第几卷(盒)">
        <template slot-scope="scope">
          <span>{{ scope.row.volumeNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="保管期限">
        <template slot-scope="scope">
          <span>{{ scope.row.storeLimit}}</span>
        </template>
      </el-table-column>
      <el-table-column label="凭证号">
        <template slot-scope="scope">
          <span>{{ scope.row.startCertificate}}</span><span v-if="scope.row.startCertificate != null">至</span><span>{{ scope.row.endCertificate}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="入库状态">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.state | stateName}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="档案类别">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="入库时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.inTime | formatDate}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="出库时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.outTime | formatDate}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state != 0" @click="outStore(scope.row.id)">删除</el-button>
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
  import {documentList, documentSave, documentOutStore, getBarCode, documentTypeAll} from 'api/systmanager'
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
        startTime4Add: '',
        endTime4Add: '',
        dialogVisible: false,
        deleteConfirm: false,
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
//        type4AddOptions: [{type: 1, name: "证书"}],
        type4AddOptions: [],
        selectType4Add: '',
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
      this.getDocumentType();
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
      },
      typeName (type) {
        if (1 == type) return "会计档案"
        else return "会计凭证"
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
        this.params.previousYear = this.previousYear;
        this.params.latterYear = this.latterYear;
        this.params.previousVolumeNumber = this.previousVolumeNumber;
        this.params.latterVolumeNumber = this.latterVolumeNumber;
        this.params.archiveNumber = this.archiveNumber;
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
      selectType4AddChange(value) {
        this.type4Add = value;
      },
      dialogConfirm() {
        this.dialogVisible = false;
        documentOutStore(this.params).then(res => {
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
      outStore(val) {
        this.dialogVisible = true;
        this.params.id = val;
      },
      getDocumentType() {
        documentTypeAll().then(res => {
          if (res.resultCode === ERR_OK) {
            this.type4AddOptions = res.data;
            this.selectType4Add = res.data[1].name;
            this.type4Add = res.data[1].type;
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
        this.params.archiveNumber4Add = this.archiveNumber4Add;
        this.params.startTime4Add = this.startTime4Add;
        this.params.endTime4Add = this.endTime4Add;
        this.params.volume4Add = this.volume4Add;
        this.params.share4Add = this.share4Add;
        this.params.storeLimit4Add = this.storeLimit4Add;
        this.params.year4Add = this.year4Add;
        this.params.volumeNumber4Add = this.volumeNumber4Add;
        this.params.startCertificate4Add = this.startCertificate4Add;
        this.params.endCertificate4Add = this.endCertificate4Add;
        this.params.type4Add = this.type4Add;
        documentSave(this.params).then(res => {
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
        this.name4Add = "";
        this.barCode4Add = "";
        this.position4Add = "";
        this.archiveNumber4Add = "";
        this.startTime4Add = "";
        this.endTime4Add = "";
        this.volume4Add = "";
        this.share4Add = "";
        this.storeLimit4Add = "";
        this.year4Add = "";
        this.volumeNumber4Add = "";
        this.startCertificate4Add = "";
        this.endCertificate4Add = "";
        this.type4Add = "";
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
        this.previousYear = "";
        this.latterYear = "";
        this.previousVolumeNumber = "";
        this.latterVolumeNumber = "";
        this.archiveNumber = "";
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
