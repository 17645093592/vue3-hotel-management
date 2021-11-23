<template>
  <div class="login_container">
    <div class="login">
      <h2>Bing酒店管理系统</h2>
        <el-form
          label-position="right"
          label-width="60px"
        >
          <el-form-item label="账号">
            <el-input v-model="loginId"></el-input>
          </el-form-item>
          <el-form-item label="密码" >
            <el-input type="password" v-model="loginPwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="记住我">
            <el-checkbox v-model="ckMe"></el-checkbox>
          </el-form-item>
        </el-form>
        <div style="margin-left: 15%;">
            <el-button @click="LoginBtn" size="mini" type="primary">登录</el-button>
            <el-button size = 'mini' >取消</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import {reactive, toRefs , getCurrentInstance,onBeforeMount} from 'vue'
// 引用提示框
import { $msg_s ,$msg_w} from '@/components/msg'
import md5 from 'js-md5'
// 调用登录接口
import { Login ,loginAuto} from '@/api/admin'
// 导入路由器
import {useRouter} from 'vue-router'

export default {
  name: 'Login',
  setup() {
    let $router = useRouter()
    const form = reactive({
            loginId:'',
            loginPwd:'',
            ckMe:false,
            aa:'11'
      })
      // 获取全局内容
      // const {proxy} = getCurrentInstance()
      const _this = getCurrentInstance()
      const {global} = _this.appContext.config.globalProperties
      // 点击登录按钮
      async function LoginBtn()  {
        form.aa = global.LOGIN_PAGE
        let {loginId,loginPwd,ckMe} = form
        let res = await Login({loginId,loginPwd})
        if(res.success){
            sessionStorage.setItem('token',res.token)
            $msg_s(res.message)
            $router.push({name:global.INDEX_PAGE})
            localStorage.setItem('loginId',loginId)
            if(ckMe){
              localStorage.setItem('loginPwd',md5(md5(loginPwd).split('').reverse().join('')))
            }
        }else{
            $msg_w(res.message)
        }
      }

       // 页面挂载之前  点击记住我之后直接跳index页面
      onBeforeMount(async ()=>{
        console.log(await loginAuto(), '')
        if(await loginAuto()){
          $router.push('/index')
        }
      })
    return {
      form,
      ...toRefs(form),
      LoginBtn,
    }
  },
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, rgb(18, 55, 80), lightblue);
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  width: 400px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-family: 'bing';
  h2 {
    margin-bottom: 20px;
    text-align: center;
      color: #fff;
  }
  .el-form .el-form-item{
    margin-bottom: 15px
  }
  .el-form /deep/ .el-form-item__label{
      color: #fff;
  }

}
</style>