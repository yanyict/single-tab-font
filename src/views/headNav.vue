<template>
  <header class="head-nav" id='header_container'>
        <el-row>
            <el-col :span="15" class='logo-container'>
              <el-row class="logo-box">
                <i class="wj-logo"></i>
                <!-- <span>等级保护综合管理平台</span> -->
              </el-row>
            </el-col>
            <div class="topbar-account topbar-btn" style="padding-right:50px;">
              <div class="bor_bag">
                <el-dropdown  trigger="click" style="padding-right: 5px;">
                  <span class="userinfo-inner">
                    <i style="padding-right:3px" class="iconfont icon-yonghu"></i>
                    {{user.account}}
                    <i  class="el-icon-caret-bottom"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="drop-menu" >
                    <el-dropdown-item divided @click.native="$emit('changePasswords', user.id)">修改密码</el-dropdown-item>
                    <!-- <el-dropdown-item divided ></el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
                <span class="userinfo-inner" style="border-left:1px solid" @click="logout"><i class="iconfont icon-exit"></i> 退出</span>
              </div>
          </div>
        </el-row>
</header>
</template>

<script>
import { keepAliveArr } from 'common/js/config'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      keepAlive: keepAliveArr
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    logout () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped lang='scss'>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
  color: #fff;
  background: #136cae;
  .logout {
    vertical-align: middle;
    cursor: pointer;
  }
  .logo-box {
    box-sizing: border-box;
    align-items: center;
    height: 60px;
    line-height: 60px;
    padding-left: 16px;
    span {
      vertical-align: middle;
      color: #fff;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-family: Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 600;
    }
  }
  .topbar-account {
    float: right;
    padding-right: 12px;
    line-height: 60px;
    height: 60px;
    .userinfo-inner {
      cursor: pointer;
      padding-left: 10px;
      color: #fff;
    }
    .bor_bag {
      margin-top: 13px;
      height: 34px;
      line-height: 34px;
      padding: 0 20px 0 8px;
      background: #4289be;
      width: auto;
      border-top-left-radius: 27px;
      border-bottom-left-radius: 27px;
      border-top-right-radius: 27px;
      border-bottom-right-radius: 27px
    }
  }
  .topbar-btn {
    color: #fff;
  }
  .wj-logo {
    background: url("../assets/img/logoD.png") no-repeat;
    display: inline-block;
    background-size: cover;
    background-size: 100% auto;
    vertical-align: top;
    width: 480px;
    margin-top: 4px;
    height: 60px;
  }
}
</style>
