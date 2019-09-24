<template>
  <el-row class="container">
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <el-row class="logo-box">
            <i class="wj-logo"></i> <span v-show="!collapsed">E-Pricer</span>
          </el-row>
        <el-menu default-active="0" router :collapse="collapsed" unique-opened background-color="#001529"
            text-color="#8c8c8c" active-text-color="#fff" @select="handleSelect">
          <template v-for="(item,index) in menus">
            <el-submenu v-if="item.showMenu && item.hasChild" :index="index+''" :key="index" >
              <template slot="title">
                <i :class="['iconfont', item.icon]"></i>
                <span slot="title">&nbsp;{{item.name}}</span>
              </template>
              <el-menu-item v-for="term in item.sonMenuVOs" v-if="term.showMenu" :key="term.id" :index="term.url"
                            :class="$route.path===term.url || $route.isSubChildren === true?'is-active':'is-not-active'" @click.native="_loadMenuFunc(term)">
                <i :class="['iconfont', term.icon]"></i>
                <span slot="title" style="padding-left:20px">&nbsp;{{term.name}}</span>
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
          <div class="topbar-account topbar-btn">
            <el-dropdown style="padding-right:50px;" trigger="click">
              <span class="el-dropdown-link userinfo-inner">
                {{user.account}}
                <i style="padding-left:5px" class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="drop-menu">
                <el-dropdown-item divided @click.native="changePasswords">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
          <div class="footer">
            <span>由厦门融达信提供技术支持&copy;2018</span>
          </div>
        </el-col>
        <!-- 底部标识 -->
      </section>
    </el-col>
    <el-dialog title="修改密码" :visible.sync="dialogChangePwd" width="520px" class="change-pwd-dialog">
      <div class="content">
        <el-form :model="passwords" label-width="80px" ref="passwords" >
          <el-form-item label="原密码" prop="oldpwd">
            <el-input v-model="passwords.oldpwd" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpwd">
              <el-input v-model="passwords.newpwd" placeholder="请输入至少6个字符"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="againpwd">
              <el-input v-model="passwords.againpwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button  @click="dialogChangePwd = false">取消</el-button>
        <el-button  type="primary">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { reqGetBaseMenus, reqGetBaseFuncs } from 'api/login'
import { ERR_OK } from 'api/config'
import { saveCacheFuncList } from 'common/js/cache'
import { keepAliveArr } from 'common/js/config'
import { mapGetters } from 'vuex'

export default {
  name: 'Main',
  data () {
    return {
      menus: [],
      collapsed: false,
      keepAlive: keepAliveArr,
      dialogChangePwd: false,
      passwords: {
        oldpwd: '',
        newpwd: '',
        againpwd: ''
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
      this.$refs.section.style.left = this.$refs.section.style.left === '65px' ? '210px' : '65px'
    },
    logout () {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {

      })
    },
    changePasswords () {
      this.dialogChangePwd = true
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
        this.$refs.section.style.left = '250px'
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
    overflow: hidden;
    overflow-y: auto;
    background: #136cae;
    display: block;
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
      width: 250px;
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
    left: 250px;
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
<style lang="scss" scope>
