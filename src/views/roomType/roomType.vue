<template>
  <div class="container">
    <!-- 搜索qu -->
    <div class="search">
      <el-button size="mini" type="primary" @click="handleAdd"
        >添加房间类型</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table  size="mini" :data="tableData" style="width: 100%" border>
      <el-table-column prop="roomTypeId" label="类型编号" />
      <el-table-column prop="roomTypeName" label="类型名称" />
      <el-table-column prop="roomTypePrice" label="类型价格" />
      <el-table-column prop="bedNum" label="床位数" />
      <el-table-column prop="" label="操作" width="180">
        <template #default="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉去 -->
    <div class="dialog">
      <defaultDialog
       v-model:value="isAccountDialog"
         :title="accountDialogTitle"
         @sure="sureAccountDialog"
         width="40%">
        <template v-slot:dialog-info>
        <el-form label-position="right" label-width="60px">
          <el-form-item label-width="70px" label="房型名称">
            <el-input v-model="formData.roomTypeName"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" label="房型价格">
            <el-input v-model="formData.roomTypePrice"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" label="床位数">
            <el-input v-model="formData.bedNum"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" label="房型描述">
              <QuillEditor v-if="isAccountDialog"  v-model:content="formData.typeDescription" contentType='html' theme="snow"  style="height:300px" />
          </el-form-item>
        </el-form>
        </template>
      </defaultDialog>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { list, add, update, deltel } from '@/api/roomtype.js'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'

export default {
  setup() {
    const state = reactive({
      tableData: [],
      isAccountDialog: false,
      accountDialogTitle: '',
      formData: {
          roomTypeName:'',
          roomTypePrice:'',
          bedNum:'',
          typeDescription:''
      },
    })
    let initTableData = async () => {
      // 查询条件
      let data = await list()
      state.tableData = data
    }
    let handleAdd = () => {
      state.isAccountDialog = true
      state.accountDialogTitle = '添加房间类型'
      state.formData = {
          typeDescription:''
      }
    }
    let handleEdit = (row) => {
         state.isAccountDialog = true
      state.accountDialogTitle = '修改房间类型'
      state.formData = {...row}
    }
    let handleDelete = async (row) => {
        let {roomTypeId} = row
        await deltel({roomTypeId})
        initTableData()
    }
    let sureAccountDialog = async () => {
        console.log(state.formData, '')
        if(!state.formData.roomTypeName){
            return $msg_e('请输入房间名称')
        }else if(isNaN(state.formData.roomTypePrice)){
            return $msg_e('请输入房间价格')
        }else if(!state.formData.bedNum){
            return $msg_e('请输入床位数')
        }
        if(state.accountDialogTitle == '添加房间类型'){
            await add(state.formData)
        }else{
            await update(state.formData)
        }
        state.isAccountDialog = false
        initTableData()
    }
    initTableData()
    return {
      ...toRefs(state),
      handleEdit,
      handleDelete,
      handleAdd,
      sureAccountDialog,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>