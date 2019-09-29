<template>
  <div class="login-box">
    <div class="logo"><span></span></div>
    <div class="login">
      <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">用户登录</h3>
        <el-form-item prop="name" class="login-input">
          <el-input type="text" v-model="account.name" auto-complete="off" prefix-icon="iconfont icon-yonghu1" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="login-input">
          <el-input type="password" v-model="account.password" auto-complete="off" prefix-icon="iconfont icon-mima" placeholder="请输入密码" @keyup.enter.native="handleLogin"></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">下次自动登录</el-checkbox> -->
        <el-form-item class="login-btn" >
          <el-button type="primary" @click="handleLogin" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-footer">copyright ©2016-2018 厦门市行政服务中心管理委员会 版权所有</div>
  </div>
</template>

<script>
import { reqLogin, reqGetBaseMenus, reqGetBaseFuncs } from 'api/login'
import { saveCacheFuncList } from 'common/js/cache'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      fullscreenLoading: false,
      menus: [],
      jumpToUrl: '',
      account: {
        name: '',
        password: ''
      },
      checked: true,
      rules: {
        name: [
          { required: true, message: '请输入账号' }
          // { validator: validaePass }
        ],
        password: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    _loadMenus () {
      reqGetBaseMenus().then(res => {
        this.fullscreenLoading = false
        if (res.resultCode === ERR_OK) {
          this.menus = res.data
          if (this.menus.length) {
//            this.jumpToUrl = !this.menus[0].url ? this.menus[0].sonMenuVOs[0].url : this.menus[0].url
            this.jumpToUrl = "/document/documentlend";
            let id = !this.menus[0].url ? this.menus[0].sonMenuVOs[0].id : this.menus[0].id
            this._loadMenuFunc(id)
          } else {
            this.$message({
              type: 'error',
              message: '该用户没有权限登录'
            })
          }
        }
      })
    },
    _loadMenuFunc (id) { // 获取权限
      let params = 'menuId=' + id
      reqGetBaseFuncs(params).then(res => {
        if (res.resultCode === ERR_OK) {
          saveCacheFuncList(res.data)
          this.$router.push({ path: this.jumpToUrl })
        }
      })
    },
    /**
     * 点击登录
     */
    handleLogin () {
      let isPass = false
      this.$refs.AccountFrom.validate((valid) => {
        if (valid) {
          isPass = true
        }
      })
      if (!isPass) {
        return
      }
      this.fullscreenLoading = true
      reqLogin(this.account).then(res => {
        if (res.resultCode === ERR_OK) {
          this.$message({
            duration: 1500,
            message: '登录成功！',
            type: 'success'
          })
          this.saveUser(res.data)
          this.saveToken(res.data.token)
          this._loadMenus()
        } else {
          this.fullscreenLoading = false
        }
      })
    },
    ...mapActions([
      'saveUser',
      'saveToken'
    ])
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/styles/variable.scss";
.login-box {
  // background: url()
    // no-repeat;
  background-size: 100% 100%;
  .logo {
    height: 90px;
    line-height: 90px;
    font-size: 26px;
    color: $color-text-d;
    font-weight: bold;
    // background: $color-background;
    width: 100%;
    span {
      display: block;
      background: url("../assets/img/zanyong-logo.png") no-repeat left;
      padding-left: 65px;
      margin-left: 300px;
    }
  }
  .login {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    height: calc(100vh - 160px);
    width: 100%;
    // background: url("../assets/img/login-img.png") no-repeat;
    background-position: 20% 50%;
    position: relative;
    min-height: 404px;
    .login-input {
      width: 320px;
    }
    .login-container {
      /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -webkit-border-radius: 4px;
      border-radius: 4px;
      -moz-border-radius: 4px;
      background-clip: padding-box;
      max-width: 400px;
      padding: 30px 40px 40px 40px;
      position: absolute;
      top: 50%;
      margin-top: -163px;
      right: 18%;
      background: #dcebf7;
      border: 1px solid #eaeaea;
      box-shadow: 0px 0px 5px 0px rgba(199, 199, 199, 0.48);

      background: -ms-linear-gradient(top, #fff, #6495ed);
      /* IE 10 */
      background: -moz-linear-gradient(top, #b8c4cb, #f6f6f8);
      /*火狐*/
      background: -webkit-gradient(
        linear,
        0% 0%,
        0% 100%,
        from(#b8c4cb),
        to(#f6f6f8)
      );
      /*谷歌*/
      background: -webkit-gradient(
        linear,
        0% 0%,
        0% 100%,
        from(#fff),
        to(#6495ed)
      );
      /* Safari 4-5, Chrome 1-9*/
      background: -webkit-linear-gradient(top, #fff, #6495ed, #fff);
      /*Safari5.1 Chrome 10+*/
      background: -o-linear-gradient(top, #fff, #6495ed);
      /*Opera 11.10+*/
      .title {
        margin-top: 0px;
        margin-bottom: 20px;
        color: #505458;
        font-weight: normal;
        text-align: center;
        font-size: 18px;
      }
      .remember {
        margin: 0px 0px 22px 0px;
      }
    }
    .login-btn {
      width: 100%;
      margin-bottom: 0px !important;
      button {
        width: 100%;
      }
    }
  }
  .login-footer {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    // background: #fff;
    height: 80px;
    color: #fff;
    text-align: center;
    padding-top: 33px;
  }
  @media screen {
    .login {
      @media (max-width: 1650px) {
        background-position: 10% 50%;
      }
      @media (max-width: 1200px) {
        background-size: 50%;
        background-position: 5% 50%;
      }
      @media (max-height: 790px) {
        height: calc(100vh - 150px);
      }
    }
    .login-container {
      @media (max-width: 1650px) {
        right: 10% !important;
      }
      @media (max-width: 1200px) {
        right: 7% !important;
      }
    }
    .login-footer {
      @media (max-height: 790px) {
        height: 70px;
        padding-top: 27px;
      }
    }
    .logo {
      span {
        @media (max-width: 1650px) {
          margin-left: 140px;
        }
        @media (max-width: 1366px) {
          margin-left: 130px;
        }
        @media (max-width: 1024px) {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>
