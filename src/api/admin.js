//定义操作管理员的API函数--围绕后台实现增删改查

import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 导入md5
import md5 from 'js-md5'
// 登录方法
export let Login = async (params) =>{
   params.loginPwd = md5(md5(params.loginPwd).split('').reverse().join(''))
   return await $get('Admin/Login',params)
}
// 获取个人信息
export let getOne = async (params) =>{
   return await $get('Admin/GetOne',params)
}
// 修改密码
export let resetPwd = async (params) =>{
   params.oldLoginPwd = md5(md5(params.oldLoginPwd).split('').reverse().join(''))
   params.newLoginPwd = md5(md5(params.newLoginPwd).split('').reverse().join(''))
   let {success,message} = await $post('Admin/ResetPwd',params)
   if(success){
      $msg_s(message)
   }else{
      $msg_e(message)
   }
   return success
}
// 定义一个登录方法
export let loginAuto = async ()=>{
   let loginId = localStorage.getItem('loginId')
   let loginPwd = localStorage.getItem('loginPwd')
   if(loginId && loginPwd){
      let params = {
         loginId,
         loginPwd
      }
      let {success,token} =  await $get('Admin/Login',params)
      if(success){
         sessionStorage.setItem('token',token)
         return true
      }else{
         return false
      }
   }else{
      return false
   }
   
}

// 查询账户信息
export let list = async(params) =>{
   let res = await $get('Admin/List',params)
   return res
}

// 添加账户信息
export let add = async(params) =>{
   params.loginPwd = md5(md5(params.loginPwd).split('').reverse().join(''))
   let {success,message} = await $post('Admin/Add',params)
   if(success){
      $msg_s(message)
   }else{
      $msg_e(message)
   }
   return success
}

// 修改账户信息
export let update = async(params) =>{
   let {success,message} = await $post('Admin/Update',params)
   if(success){
      $msg_s(message)
   }else{
      $msg_e(message)
   }
   return success
}
// 删除一条信息
export let deltel = async (params) =>{
   await $confirm('是否确定删除')
   console.log(params, '')
   const {success,message} = await $post('Admin/Delete',params)
   if(success){
       $msg_s(message)
   }else{
        $msg_e(message)
   }
return success
}