<!-- 自定义组件 下拉菜单包含tree -->
<template>
  <el-select ref="sele" @focus="focus" @clear='valClean'  v-model="selVal" :placeholder="placeholder">
    <el-input size="mini" class="select-tree-input" v-model="filter_text" placeholder="请输入内容"></el-input>
    <el-tree node-key="id" @check="check" :default-expanded-keys="expandedKeysArr"
      :show-checkbox="showCheckbox" :check-strictly="checkStrictly" id="mytree" ref="selectTree" @node-click="nodeClick"
      class="filter-tree" :data="data" :props="defaultProps" :filter-node-method="filterMethod">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <span v-if="data.count && showBadge" class="badge">{{data.count}}</span>
        </span>
      </span>
    </el-tree>
    <el-option id="option" value=" " style="display:none"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    singleCheckId: {
      type: [Number, String],
      default: ''
    },
    checkDataId: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    data: Array,
    value: [String, Array],
    showBadge: {
      type: Boolean,
      default: false
    },
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
    },
    checkStrictly: { // 取消树结构父子关联
      type: Boolean,
      default: false
    },
    selectedChange: Function, // 改变时的回调
    cleanMethod: Function // 清除回调
  },
  data () {
    return {
      selVal: this.value,
      filter_text: '',
      treeData: null
    }
  },
  computed: {
    expandedKeysArr () {
      let arr = []
      if (this.checkDataId.length) {
        return this.checkDataId
      }
      if (!this.singleCheckId) {
        if (this.data.length) {
          arr.push(this.data[0].id)
          return arr
        } else {
          return []
        }
      }
      arr.push(this.singleCheckId)
      return arr
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    value: function (val) {
      this.selVal = val
    },
    selVal: function (val) {
      this.$emit('valChange', val)
    },
    filter_text: function (val) {
      this.$refs.selectTree.filter(val)
    }
  },
  methods: {
    clean () {
      this.selVal = ''
    },
    focus () { // 下拉框获取焦点回调方法
      if (this.showCheckbox) {
        this.$refs.selectTree.setCheckedKeys(this.checkDataId)
      }
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
      // console.info(node)
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
