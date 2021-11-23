import {$get,$post} from '@/utils/request'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'
import axios from 'axios'
// 列表
export let menusList = async (params) =>{
        const data = axios.post('/menusList',params)
        return data 
}