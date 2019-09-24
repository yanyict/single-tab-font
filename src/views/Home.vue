<template>
  <el-row class="container">
    <head-nav v-on:changePasswords="changePasswords"></head-nav>
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!-- <el-row class="logo-box">
            <i class="wj-logo"></i> <span v-show="!collapsed">等级保护系统</span>
        </el-row> -->
        <el-menu default-active="0" router :collapse="collapsed" unique-opened background-color="#136cae"
            text-color="#fff" active-text-color="#fff" @select="handleSelect">
          <template v-for="(item,index) in menus">
            <el-submenu v-if="item.showMenu && item.hasChild" :index="index+''" :key="index" >
              <template slot="title">
                <i :class="['iconfont', item.icon]"></i>
                <span slot="title">&nbsp;{{item.name}}</span>
              </template>
              <el-menu-item v-for="term in item.sonMenuVOs" v-if="term.showMenu" :key="term.id" :index="term.url"
                            :class="$route.path===term.url || $route.isSubChildren === true?'is-active':'is-not-active'" @click.native="_loadMenuFunc(term)">
                <i :class="['iconfont', term.icon]"></i>
                <span slot="title" style="padding-left:15px">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.showMenu" :index="item.url" :class="isActiveItem(item)?'is-active':''"
                          :key="index" @click.native="_loadMenuFunc(item)">
              <i :class="['iconfont', item.icon]"></i>
              <span slot="title">&nbsp;{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <!--右侧-->
      <section class="content-container" ref="section" id="mainContent">
        <!--头部-->
        <el-col :span="24" class="topbar-wrap">
          <div class="topbar-title">
            <!--展开折叠开关-->
            <div style="margin-left: 24px" @click.prevent="collapse">
              <i class="iconfont icon-menu-fold" style="font-size:18px;" v-if="collapsed"></i>
              <i class="iconfont icon-menu-unfold" style="font-size:18px;" v-if="!collapsed"></i>
            </div>
          </div>
          <breadcrumb/>
        </el-col>
        <!-- 主內容展示 -->
        <el-col :span="24" class="content-wrapper">
          <section class="content-wrapper-main">
            <transition name="fade" mode="out-in">
              <keep-alive :include="keepAlive">
                <router-view></router-view>
              </keep-alive>
            </transition>
          </section>
          <!-- <div class="footer">
            <span>由厦门融达信提供技术支持&copy;2018</span>
          </div> -->
        </el-col>
        <!-- 底部标识 -->
      </section>
    </el-col>
    <el-dialog title="修改密码" :visible.sync="dialogChangePwd" width="520px" class="change-pwd-dialog">
      <div class="content">
        <el-form :model="passwords" :rules="passRules" label-width="100px" ref="passwords" size="small">
          <el-form-item label="原密码：" prop="oldpwd">
            <el-input v-model="passwords.oldpwd" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newpwd">
              <el-input v-model="passwords.newpwd" placeholder="请输入至少8个字符 字母数字下划线组合"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="againpwd">
              <el-input v-model="passwords.againpwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button size="small" @click="dialogChangePwd = false">取消</el-button>
        <el-button size="small" @click="handleRest" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import HeadNav from './headNav.vue'
import Breadcrumb from '@/components/Breadcrumb'
import { reqGetBaseMenus, reqUpdatePass, reqGetBaseFuncs } from 'api/login'
import { ERR_OK } from 'api/config'
import { saveCacheFuncList } from 'common/js/cache'
import { ispasswordRegexp } from 'common/js/validate'
import { keepAliveArr } from 'common/js/config'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    HeadNav,
    Breadcrumb
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      }
      if (!(value.length <= 8 && value.length > 30)) {
        return callback(new Error('密码长度需要8-30个字符'))
      }
      if (!ispasswordRegexp.test(value)) {
        return callback(new Error('密码须由数字、字母、字符密码组合'))
      }
      this.$refs.passwords.validateField('againpwd')
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwords.newpwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      menus: [],
      collapsed: false,
      keepAlive: keepAliveArr,
      dialogChangePwd: false,
      passwords: {
        oldpwd: '',
        newpwd: '',
        againpwd: '',
        id: ''
      },
      passRules: {
        oldpwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newpwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        againpwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    getMenus () { // 获取用户菜单
      reqGetBaseMenus().then(res => {
        if (res.resultCode === ERR_OK) {
          this.menus = res.data
        }
      })
    },
    _loadMenuFunc (item) {
      let params = 'menuId=' + item.id
      reqGetBaseFuncs(params).then(res => {
        if (res.resultCode === ERR_OK) {
          saveCacheFuncList(res.data)
        }
      })
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleOpen () {
      // console.log('handleopen');
    },
    handleClose () {
      // console.log('handleclose');
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
      this.$refs.section.style.left = this.$refs.section.style.left === '65px' ? '180px' : '65px'
    },
    logout () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {

      })
    },
    changePasswords (data) {
      console.log(data)
      this.passwords.id = data
      this.dialogChangePwd = true
    },
    handleRest () {
      if (this.passwords.newpwd !== this.passwords.againpwd) {
        this.$message.error('新密码与确认密码不一致')
      } else {
        let params = {
          oldpass: this.passwords.oldpwd,
          newpass: this.passwords.againpwd
        }
        reqUpdatePass(params).then(res => {
          this.dialogChangePwd = false
          if (res.resultCode === ERR_OK) {
            this.$message({
              message: res.resultMessage,
              type: 'success',
              duration: 1500
            })
          }
        })
      }
    },
    isActiveItem (item) { // 高亮左侧导航栏
      return item.url.indexOf(this.$route.path) > -1 ? 1 : 0
    }
  },
  mounted () {
    this.getMenus()
    // 监听窗口改变，当宽度小于768是隐藏侧边栏
    window.addEventListener('resize', () => {
      let width = document.body.clientWidth
      if (width <= 1024) {
        this.collapsed = true
        this.$refs.section.style.left = '65px'
      } else {
        this.collapsed = false
        this.$refs.section.style.left = '180px'
      }
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  .main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  aside {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    min-width: 50px;
    background: #136cae;
    display: block;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    box-shadow: 2px 0 6px rgba(21, 54, 85, 0.35);
    z-index: 1;
    &::-webkit-scrollbar {
      display: none;
    }

    .el-menu {
      width: 180px;
      height: auto;
      border-radius: 0px;
      background-color: #136cae;
      border-right-width: 0px;
      // padding: 16px 0;
    }

    .is-not-active {
      color: #8c8c8c;
      background: #10679f !important;
    }
    .is-active {
      background-color: #dbe9f3 !important;
      color: #0c8ee7 !important;
    }
    .el-submenu .el-menu-item {
      min-width: 80px;
    }
    .el-menu--collapse {
      width: 65px;
    }

    .el-menu .el-menu-item,
    .el-submenu .el-submenu__title {
      height: 40px !important;
      line-height: 40px !important;
      // margin-top: 4px;
      // margin-bottom: 8px;
    }
    .el-menu-item:hover,
    .el-submenu .el-menu-item:hover,
    {
      background-color: #dbe9f3 !important;
      i{
        color: #0c8ee7
      }
      span {
        color: #0c8ee7;
      }
    }
    .el-submenu__title:hover {
      background-color: #136cae !important;
      span {
        color: #fff;
      }
    }
  }

  .menu-toggle {
    background: #4a5064;
    text-align: center;
    color: white;
    height: 26px;
    line-height: 30px;
  }

  .content-container {
    background: #dbe9f3;
    position: absolute;
    left: 180px;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow-y: auto;
    transition: left 0.3s ease-in-out;
    height: 100%;

    .topbar-wrap {
      margin: 0;
      padding: 0px;
      height: 40px;
      line-height: 40px;
      background: #fff;
      -webkit-box-shadow: 1px 4px rgba(0, 21, 41, 0.08);
      box-shadow: 1px 4px rgba(0, 21, 41, 0.08);

      .topbar-btn {
        color: #fff;
      }
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
      }
      .topbar-logos {
        float: left;
        width: 180px;
        line-height: 26px;
        text-align: center;
        background: #002140;
      }
      .topbar-logo img,
      .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        padding-left: 10px;
      }
    }
    .content-wrapper {
      position: relative;
      height: auto !important;
      min-height: -moz-calc(100% - 64px);
      min-height: -webkit-calc(100% - 64px);
      min-height: calc(100% - 64px);
      background-color: #dbe9f3;
      box-sizing: border-box;
      .footer {
        position: absolute;
        bottom: 70px;
        width: 100%;
        text-align: center;
        span {
          color: #aaabab;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style lang="scss" >
.drop-menu{
  // left: 1446px !important;
  // top: 56px !important;
  // margin-top: 5px !important;
  // padding: 1px !important;
  li:first-child{
    border-top: 0px;
    margin-top: 0px !important;
  }
}
.el-menu-item, .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
}
</style>
