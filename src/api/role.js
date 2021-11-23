import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 列表
export let list = async () =>{
    const data = await $get('Role/List')
    return data
}
// 添加
export let add = async (params) =>{
    // 验证信息
    if(!checkInput(params)){
        return false
    }
    const {success,message} = await $post('Role/Add',params)
        if(success){
            $msg_s(message)
        }else{
             $msg_e(message)
        }
    return success
}
// 编辑
export let updata = async (params) =>{
     // 验证信息
     if(!checkInput(params)){
        return false
    }
    const {success,message} = await $post('Role/Update',params)
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
     const {success,message} = await $post('Role/Delete',params)
     if(success){
         $msg_s(message)
     }else{
          $msg_e(message)
     }
 return success
}
// 验证信息方法
let checkInput = (params)=>{
    if(!params.roleName){
        $msg_e('请输入角色名称')
        return false
    }else{
        return true
    }
}