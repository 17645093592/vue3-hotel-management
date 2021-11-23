// 结账状态
import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 结账状态信息
export let list = async () =>{
    const data = await $get('ResideState/List')
    return data
}