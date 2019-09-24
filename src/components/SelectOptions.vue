<template>
  <div class="select-options-box">
    <el-row>
      <el-col :span="7">
        <el-select v-model="leftModel" :placeholder="leftPlaceholder" @change="leftHandleChange">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      </el-col>
      <el-col :span="12" class="left-10">
        <el-select v-model="rightModel" :placeholder="rightPlaceholder" @change="rightHandleChange">
          <el-option
            v-for="item in rightOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.url }}</span>
            </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="left-10">
        <span>
          <i class="iconfont icon-zengjia" v-if="isShowAddBtn" @click="addOption"></i>
          <i class="iconfont icon-jianshao danger" @click="delOption"></i>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SelectOptions',
  props: {
    leftPlaceholder: {
      type: String,
      default: '资源分类'
    },
    rightPlaceholder: {
      type: String,
      default: '操作资源'
    },
    index: {
      type: Number,
      default: 0
    },
    restore: {
      type: Object,
      default: function () {
        return {
          id: '',
          name: ''
        }
      }
    },
    isShowAddBtn: {
      type: Boolean,
      default: false
    },
    keyName: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      leftModel: '',
      selectedLeftItem: {},
      selectedRightItem: {},
      rightModel: '',
      rightOptions: []
    }
  },
  watch: {
    restore () {
      this.leftModel = this.restore[this.keyName].id
      this.leftHandleChange(this.restore[this.keyName].id)
      this.rightModel = this.restore.id
    }
  },
  mounted () {
    setTimeout(() => { // 初始化原有数据
      this.leftModel = this.restore[this.keyName].id
      this.leftHandleChange(this.restore[this.keyName].id)
      this.rightModel = this.restore.id
    }, 20)
  },
  methods: {
    leftHandleChange (data) {
      let index = this.options.findIndex(item => {
        return item.id === data
      })
      this.rightOptions = index > -1 ? this.options[index].interfaceListVOs : []
      this.selectedLeftItem = index > -1 ? this.options[index] : {}
    },
    rightHandleChange (data) {
      let index = this.rightOptions.findIndex(item => {
        return item.id === data
      })
      this.selectedRightItem = index > -1 ? this.rightOptions[index] : {}
      this.selectedRightItem[this.keyName] = this.selectedLeftItem
      this.$emit('change', this.selectedRightItem, this.index)
    },
    addOption () { // 增加
      this.$emit('addOption')
    },
    delOption () {
      this.$emit('delOption', this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-options-box {
  padding-bottom: 10px;
  .left-10 {
    padding-left: 10px;
  }
}
</style>
