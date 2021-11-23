//定义操作房间图片的API函数--围绕后台实现增删改查

import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'
// 获取所有房间图片的方法
export let list = async (params) =>{
    return await $get('RoomImg/List',params)
 }
// 添加
export let add = async (params) =>{
    return  await $post('RoomImg/Add',params)
 }
// 修改账户信息
export let update = async(params) =>{
    let {success,message} = await $post('RoomImg/Update',params)
    if(success){
       $msg_s(message)
    }else{
       $msg_e(message)
    }
    return success
 }
 // 删除一条信息
 export let deltel = async (params) =>{
   //  await $confirm('是否确定删除')
    const {success,message} = await $post('RoomImg/Delete',params)
    if(success){
        $msg_s(message)
    }else{
         $msg_e(message)
    }
 return success
 }