<template>
  <div class="container">
       <!-- 搜索qu -->
    <div class="search">
      <span>顾客姓名:</span>
      <div style='width:200px'>
         <el-input size='mini' v-model="searchDate.guestName" placeholder="请输入顾客姓名"></el-input>
      </div>
      <span>结账状态:</span>
      <el-select
        size="mini"
        v-model="searchDate.resideStateId"
        placeholder="Select"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="success" @click="initTableData">查询</el-button>
      <el-button size="mini" type="primary" @click="handleAdd"
        >添加用户</el-button
      >
    </div>
     <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 100%" border>
      <el-table-column prop="guestName" label="姓名" width="70" />
      <el-table-column prop="identityId" label="身份证" width="160" />
      <el-table-column prop="phone" label="手机号" width="100" />   
      <el-table-column prop="roomId" label="房间号" width="60" />
      <el-table-column prop="room.roomType.roomTypeName" label="房间类型" width="80" />
      <el-table-column prop="resideDate" label="入住日期" width="150" />
      <el-table-column prop="leaveDate" label="离开日期" width="150" />
      <el-table-column prop="deposit" label="押金" width="80" />
     <el-table-column prop="totalMoney" label="消费金额" width="80" />
     <el-table-column prop="" label="结账状态" width="100">
       <template #default='scope'>
          <el-tag v-if="scope.row.resideState.resideStateId == 2" size='mini' type="success">{{scope.row.resideState.resideStateName}}</el-tag>
          <el-tag v-if="scope.row.resideState.resideStateId == 1" size='mini' type="danger">{{scope.row.resideState.resideStateName}}</el-tag>
       </template>
      </el-table-column>
      <el-table-column prop="" label="操作" >
        <template #default="scope">
          <div style="display:flex">
            <el-button size="mini" :disabled="scope.row.resideState.resideStateId == 2" type="warning" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" v-if="scope.row.resideState.resideStateId == 2" type="danger" @click="handleDelete(scope.row)"
              >删除</el-button
            >
              <el-button size="mini" v-if="scope.row.resideState.resideStateId == 1"  type="success" @click="handleJiezhang(scope.row)"
              >结账</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
      <!-- 分页 -->
    <div class="pagination">
       <pages v-model:pageItem="pageItem" @pageChange="initTableData"></pages>
    </div>
    <!-- 弹出框 -->
     <defaultDialog
       v-model:value="isAccountDialog"
         :title="accountDialogTitle"
         @sure="sureAccountDialog"
         width="40%">
          <template v-slot:dialog-info>
              <el-form label-position="right" label-width="60px">
              <el-form-item label-width="70px" label="顾客姓名">
                <el-input v-model="formData.guestName"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" label="身份证号">
                <el-input v-model="formData.identityId"></el-input>
              </el-form-item>
               <el-form-item label-width="70px" label="电话">
                <el-input v-model="formData.phone"></el-input>
              </el-form-item>
               <el-form-item label-width="70px" label="房间类型">
                  <el-select
                    size="mini"
                    v-model="formData.roomTypeId"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in roomTypeList"
                      :key="item.roomTypeId"
                      :label="item.roomTypeName"
                      :value="item.roomTypeId"
                    >
                    </el-option>
                  </el-select>
              </el-form-item>
               <el-form-item label-width="70px" label="房间号">
                 <el-select
                    size="mini"
                    v-model="formData.roomId"
                    placeholder="请选择房间"
                  >
                    <el-option
                      v-for="item in roomList"
                      :key="item.roomId"
                      :label="item.roomId"
                      :value="item.roomId"
                    >
                    </el-option>
                  </el-select>
              </el-form-item>
               <el-form-item label-width="70px" label="入住日期">
                 <el-date-picker v-model="formData.resideDate" type="datetime" placeholder="请选择日期" />
              </el-form-item>
               <el-form-item label-width="70px" label="押金">
                <el-input v-model.number="formData.deposit"></el-input>
              </el-form-item>
               <el-form-item label-width="70px" label="入住人数">
                <el-input v-model.number="formData.guestNum"></el-input>
              </el-form-item>
            </el-form>
          </template>
      </defaultDialog>
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect ,getCurrentInstance, watch,nextTick } from 'vue'
import {$msg_e} from '@/components/msg'
import {list,add,update,deltel,checkout} from '@/api/guest'
// 结账状态
import {list as resideStateList } from '@/api/resideState'
// 房间类型
import { list as getRoomList } from '@/api/roomtype'
// 操作房间的
import { list as roomList } from '@/api/room'
export default {
  setup() {
    const state = reactive({
      isAccountDialog: false,
      accountDialogTitle: '',
      tableData: [],
      searchDate: {
        guestName:'',
        resideStateId:0
      },
      pageItem: {},
      formData: {
        roomId:'请选择房间',
        roomTypeId:0,
        // 顾客编号
        guestId:0
      },
      // 结账状态数组
      resideStateList:[],
      // 房间类型
      roomTypeList:[],
      // 房间号
      roomList:[]
    })
    // 获取全局内容
    const _this = getCurrentInstance()
    const { global } = _this.appContext.config.globalProperties
    // 监听分页
    watchEffect(() => {
      state.pageItem = global.PAGE_ITEM()
    })
    // 更新表格
    let initTableData = async (index = 1) => {
      let { pageSize, pageIndex } = state.pageItem
      pageIndex = index
      // 查询条件
      let params = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        guestName: state.searchDate.guestName,
        resideStateId: state.searchDate.resideStateId,
      }
      let { data, count } = await list(params)
      state.tableData = data
      state.pageItem.total = count
    }
    initTableData()
    // 结账状态数组
    let getresideStateList = async()=>{
        let data = await resideStateList()
        data.unshift({ resideStateId: 0, resideStateName: '请选择结账状态' })
        state.resideStateList = data
    }
    getresideStateList()
     // 加载房间类型
    let getRoomlist = async () => {
      let data = await getRoomList()
      data.unshift({ roomTypeId: 0, roomTypeName: '请选择房间类型' })
      state.roomTypeList = data
    }
    getRoomlist()
    // 加载房间的方法
    let getRoomId = async (roomTypeId,guestId=0) => {
      let {data} = await roomList({roomTypeId,roomTypeId:1,pageSize:100,guestId:state.formData.guestId})
      data.unshift({ roomId:'请选择房间' })
      state.roomList = data
    }
    // 监听roomTypeId有没有变化
     watch(()=>state.formData.roomTypeId,(val)=>{
       if(state.accountDialogTitle = '添加顾客信息'){
           state.formData.roomId = '请选择房间'
       }
       if(val > 0){
           getRoomId(val)
       }else{
          state.roomList = []
       }
     })
    // 新增
    let handleAdd =()=>{
        state.isAccountDialog = true
        state.accountDialogTitle = '添加顾客信息'
        state.formData ={
           roomId:'请选择房间',
           roomTypeId:0,
           guestId:0
        }
    }
    // 点击结账
    let handleJiezhang = async(row)=>{
        let {guestId} = row
        await checkout({guestId})
        initTableData()
    }
    // 点击修改
    let handleEdit =(row)=>{
        state.isAccountDialog = true
        console.log(row, '')
        state.formData = {...row}
        state.formData.roomTypeId = row.room.roomTypeId
          nextTick(()=>{
           state.accountDialogTitle = '修改顾客信息'
           state.formData.roomId = row.room.roomId
          })
    }
    // 点击删除
    let handleDelete = async(row)=>{
        let {guestId} = row
        await deltel({guestId})
        initTableData()
    } 
    // 点击确定
    let sureAccountDialog= async()=>{
      if(state.formData.roomId == '请选择房间'){
        return $msg_e('请选择房间')
      }
      if(state.accountDialogTitle == '添加顾客信息'){
           await add(state.formData)
      }else if(state.accountDialogTitle =='修改顾客信息'){
          await update(state.formData)
      }
      state.isAccountDialog = false
      initTableData()
    }
   
    return {
      ...toRefs(state),
      initTableData,
      handleAdd,
      handleJiezhang,
      handleEdit,
      handleDelete,
      sureAccountDialog
    }
  },
}
</script>

<style lang="scss" scoped>
.search{
  margin-bottom: 20px;
}
</style>