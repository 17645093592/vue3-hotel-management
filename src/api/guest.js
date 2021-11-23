import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 顾客列表
export let list = async (params) =>{
    const data = await $get('GuestRecord/List',params)
    return data
}

// 添加顾客
export let add = async (params) =>{
    const {success,message} = await $post('GuestRecord/Add',params)
    if(success){
        $msg_s(message)
     }else{
        $msg_e(message)
     }
     return success
}
// 修改顾客
export let update = async(params) =>{
    let {success,message} = await $post('GuestRecord/Update',params)
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
    const {success,message} = await $post('GuestRecord/Delete',params)
    if(success){
        $msg_s(message)
    }else{
         $msg_e(message)
    }
 return success
 }
 // 删除一条信息
export let checkout = async (params) =>{
    await $confirm('是否结账')
    console.log(params, '')
    const {totalMoney} = await $post('GuestRecord/Checkout',params)
    console.log(totalMoney, '')
    if(totalMoney){
        $msg_s('结账成功,需要支付'+totalMoney+'元')
    }else{
         $msg_e('结账未成功')
    }
     return totalMoney
 }