<template>
  <div class="dept-box base-box evaresult">
    <el-tabs v-model="editableTabsValue" >
      <el-tab-pane label="基础数据权限" name="1">
        <base-data></base-data>
      </el-tab-pane>
      <el-tab-pane label="数据权限共享" name="2">
        <data-share></data-share>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseData from 'components/System/BaseData'
import DataShare from 'components/System/DataShare'
export default {
  components: {
    BaseData,
    DataShare
  },
  data () {
    return {
      editableTabsValue: '1'
    }
  }
}
</script>
