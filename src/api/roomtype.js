//定义操作管理员的API函数--围绕后台实现增删改查

import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 获取所有房间类型的方法
export let list = async () =>{
    return await $get('RoomType/List')
 }
// 添加
export let add = async (params) =>{
    let {success,message} = await $post('RoomType/Add',params)
   if(success){
      $msg_s(message)
   }else{
      $msg_e(message)
   }
   return success
 }
// 修改账户信息
export let update = async(params) =>{
    let {success,message} = await $post('RoomType/Update',params)
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
    const {success,message} = await $post('RoomType/Delete',params)
    if(success){
        $msg_s(message)
    }else{
         $msg_e(message)
    }
 return success
 }