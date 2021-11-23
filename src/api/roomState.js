import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

// 获取所有房间类型的方法
export let list = async () =>{
    return await $get('RoomState/List')
 }
 // 获取所有房间状态的方法(没有入住信息)
export let listToUpdate = async () =>{
    return await $get('RoomState/ListToUpdate')
 }