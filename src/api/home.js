import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 顾客列表
export let totalTypePrice = async () =>{
    const data = await $get('RoomType/TotalTypePrice')
    return data
}