<template>
    <div class="container resetPwd"> 
        <div class="box">
                <el-form label-position="right" label-width="60px">
                <el-form-item  label-width="70px" label="原始密码">
                <el-input v-model="formData.oldLoginPwd"></el-input>
            </el-form-item>
            <el-form-item  label-width="70px" label="最新密码">
                <el-input v-model="formData.newLoginPwd"></el-input>
            </el-form-item>
                <el-form-item  label-width="70px" label="确认密码">
                <el-input v-model="formData.newLoginPwd2"></el-input>
            </el-form-item>
            </el-form>
            <div class="btn">
                 <el-button type="primary" @click="editForm">确定</el-button>
                 <el-button @click="clear">取消</el-button>
            </div>
           </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import {$msg_e} from '@/components/msg'
import {resetPwd} from '@/api/admin'
import {useStore} from 'vuex'
export default {
    setup () {
        let $store = useStore()
        const state = reactive({
            formData:{}
        })
        let editForm = async() =>{
             if(!state.formData.oldLoginPwd){
                return $msg_e('请输入原始密码')
            }else if(!state.formData.newLoginPwd){
                return $msg_e('请输入最新密码')
            } else if(state.formData.newLoginPwd != state.formData.newLoginPwd2){
                return $msg_e('两次密码输入不一致')
            }
            let id = $store.state.user.admin.id
            let {oldLoginPwd,newLoginPwd,newLoginPwd2} = state.formData
            await resetPwd({id,oldLoginPwd,newLoginPwd,newLoginPwd2})
            state.formData = {}
        }
        let clear = () =>{
            state.formData = {}
        }
        return {
            ...toRefs(state),
            editForm,
            clear
        }
    }
}
</script>

<style lang="scss" scoped>
.resetPwd{
    display: flex;
    // justify-content: center;
    // align-items: center;
}
.box{
    width: 400px;
    div{

    }
}
</style>