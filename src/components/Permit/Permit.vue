<!-- 自定义组件 下拉菜单包含tree -->
<template>
  <el-select size="small" ref="sele" value-key="id" :clearable="clearable" @focus="focus" @clear='valClean'  :multiple="multiple"  v-model="selVal" :placeholder="placeholder">
      <el-tabs v-model="activeName" :stretch="true" style="margin-bottom:0" @tab-click="handleClick">
        <el-tab-pane label="用户" name="0">
          <el-option v-for="item in user"  :key="item.id" :label="item.name" :value="item"> <span style="float: left">{{ item.name }}</span> <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deptName }}</span> </el-option>
        </el-tab-pane>
        <el-tab-pane label="部门" name="2">
            <el-tree node-key="id" default-expand-all @check="check"  id="mytree" ref="selectTree" @node-click="nodeClick" class="filter-tree" :data="data" :props="defaultProps3" :filter-node-method="filterMethod">
              <el-option style="width:100%;padding:0" slot-scope="{ node, data }"  :key="data.id" :label="node.label" :value="data"><span style="float: left">{{node.label}}</span></el-option>
            </el-tree>
        </el-tab-pane>
        <el-tab-pane label="角色" name="1">
          <el-option v-for="item in role"  :key="item.id" :label="item.name" :value="item"> <span style="float: left">{{ item.name }}</span> <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deptName }}</span> </el-option>
        </el-tab-pane>
      </el-tabs>
  </el-select>
</template>

<script>
export default {
  props: {
    checkDataId: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: { // 判断是否多选
      type: Boolean,
      default: false
    },
    clearable: { // 判断是否多选
      type: Boolean,
      default: false
    },
    user: Array, // 用户数据
    data: Array, // 部门数据
    role: [Object, Array], // 角色数据
    value: [Object, Array], // 外部传入数据
    defaultProps: {
      type: Object,
      default: function () {
        return {
          label: 'name'
        }
      }
    },
    filtersNodeString: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: '0',
      selVal: this.value,
      treeData: null,
      defaultProps3: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
  },
  created () {
    // this.handleClick(0)
  },
  mounted () {
  },
  watch: {
    value: function (val) {
      this.selVal = val
    },
    selVal: function (newval, oldval) {
      this.$emit('valChange', newval)
    }
  },
  methods: {
    handleClick (index, event) {
      // this.activeName = index.toString()
    },
    clean () {
      this.selVal = ''
    },
    focus () { // 下拉框获取焦点回调方法
      this.$nextTick(() => {
        this.activeName = '0'
      })
    },
    consoleRefs () {
    },
    valClean () { // 点击清除
      this.cleanMethod()
      this.cleanCheck()
      this.selectedChange(null, [])
    },
    cleanCheckValue () { // 清空回掉
      this.value = ''
      this.cleanCheck()
    },
    cleanCheck () {
      this.$refs.selectTree.setCheckedKeys([])
    },
    check (data, node) {
      console.log(data, node)
      let arr = []
      let arrName = []
      this.selVal = ''
      // console.info(data)
      for (let i = 0; i < node.checkedNodes.length; i++) {
        arr.push(node.checkedNodes[i].id)
        arrName.push(node.checkedNodes[i].name)
        if (i === 0) {
          this.selVal += node.checkedNodes[i].name
        } else {
          this.selVal += ',' + node.checkedNodes[i].name
        }
      }
      // console.info(arr)
      this.selectedChange(data, arr, arrName) // 方法回调到父组件
    },
    filterMethod (value, data) { // 树过滤
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick (data, node) { // 点击进行选择
      console.log(data, node)
      // this.selectValue = JSON.parse(JSON.stringify(data))
      let arr = []
      let arrName = []
      if (this.showCheckbox) {
        return null
      }
      this.selVal = data.name
      this.$refs.sele.blur()
      this.selectedChange(data, arr, arrName) // 方法回调到父组件
    }
  }
}
</script>

<style lang="scss" scoped>
.select-tree-input {
  box-sizing: border-box;
  padding: 0 5px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .badge {
    display: inline-block;
    width: 20px;
    height: 16px;
    line-height: 16px;
    margin: 0 2px;
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    background-color: #f56c6c;
    border-radius: 8px;
    color: #fff;
  }
}
</style>
