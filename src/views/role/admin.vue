<template>
  <div class="container">
    <!-- 搜索qu -->
    <div class="search">
      <span>角色:</span>
      <el-select size="mini" v-model="roleId" placeholder="Select">
        <el-option
          v-for="item in roleList"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="success" @click="initTableData">查询</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">添加用户</el-button>
      
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="loginId" label="账号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="photo" label="头像" >
        <template #default = 'scope'>
            <el-image
              style="width: 80px; height: 80px"
              :src="(scope.row.photo || 'admin_default.jpg')"
              fit="cover"
              :preview-src-list="srcList"
              ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="role.roleName" label="角色" />

      <el-table-column prop="roleName" label="操作" width="180">
        <template #default="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit( scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
        <pages v-model:pageItem="pageItem" @pageChange="initTableData"></pages>
    </div>
    <!-- 抽屉去 -->
    <div class="dialog">
          <defaultDialog
           v-model:value="isAccountDialog"
          :title="accountDialogTitle"
          @sure="sureAccountDialog"
           width="40%">
          <template v-slot:dialog-info>
            <el-form label-position="right" label-width="60px">
              <el-form-item label-width="70px" label="头像">
                  <el-upload
                        class="avatar-uploader"
                        :action="global.ADMIN_UPLOAD"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="formData.photo && accountDialogTitle == '添加用户'" :src="global.UPDATA_UPLOAD+formData.photo" class="avatar" />
                        <img v-if="formData.photo && accountDialogTitle == '编辑用户'" :src="formData.photo" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
                    </el-upload>
              </el-form-item>
                <el-form-item label-width="70px" label="账号">
                <el-input v-model="formData.loginId"></el-input>
              </el-form-item>
                <el-form-item v-if="accountDialogTitle == '添加用户'" label-width="70px" label="密码">
                <el-input v-model="formData.loginPwd"></el-input>
              </el-form-item>
                <el-form-item v-if="accountDialogTitle == '添加用户'" label-width="70px" label="确认密码">
                <el-input v-model="formData.loginPwd2"></el-input>
              </el-form-item>
                <el-form-item label-width="70px" label="姓名">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
                <el-form-item label-width="70px" label="电话">
                <el-input v-model="formData.phone"></el-input>
              </el-form-item>
                <el-form-item label-width="70px" label="角色">
                    <el-select  v-model="formData.roleId" placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                        >
                        </el-option>
                    </el-select>
              </el-form-item>
            </el-form>
          </template>
    </defaultDialog>
    </div>
  
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect ,getCurrentInstance} from 'vue'
import { list ,add ,update ,deltel} from '@/api/admin'
import { list as roleList } from '@/api/role'
import { Plus } from '@element-plus/icons'
import {$msg_e} from '@/components/msg'
export default {
     components: {
    Plus,
  },
  setup() {
    const state = reactive({
        roleList:[],
      tableData: [],
      formData:{
          roleId:0
      },
      pageItem:{},
      roleId: 0,
      accountDialogTitle: '',
      isAccountDialog: false,
      srcList:[]
    })
     // 获取全局内容
      const _this = getCurrentInstance()
      const {global} = _this.appContext.config.globalProperties
      watchEffect(()=>{
         state.pageItem = global.PAGE_ITEM()
      })
    let getRoleList = async () => {
        let data = await roleList()
        data.unshift({roleId:0,roleName:'请选择角色'})
        state.roleList = data
    }
    let initTableData = async (index=1) => {
      let {pageSize,pageIndex} = state.pageItem
      pageIndex = index
      // 查询条件
      let params = {
        roleId: state.roleId,
        pageSize: pageSize,
        pageIndex: pageIndex,
      }
      let { count, data } = await list(params)
      state.tableData = data
      state.srcList =  data.map(item =>{
        return item.photo = global.UPDATA_UPLOAD+(item.photo || 'admin_default.jpg')
      })
      state.pageItem.total = count
    }
    // 获取表格数据
    initTableData()
    // 添加账户
    let handleAdd = async () => {
         state.isAccountDialog = true
      state.accountDialogTitle = '添加用户'
      state.formData = {}
    }
    // 修改账户信息
    let handleEdit = async (row) => {
       state.isAccountDialog = true
      state.accountDialogTitle = '编辑用户'
      state.formData = row
    }
    // 删除
    let handleDelete = async (row) => {
      let {id} = row
      await deltel({id})
      initTableData()
    }
    //点击确定的时候
    let sureAccountDialog = async () => {
        if(!state.formData.loginId){
            return $msg_e('请输入账号')
        }else if(!state.formData.loginPwd && state.accountDialogTitle == '添加用户'){
            return $msg_e('请输入密码')
        }else if(!state.formData.loginPwd2  && state.accountDialogTitle == '添加用户'){
            return $msg_e('请输入确认密码密码')
        }else if(!state.formData.phone){
            return $msg_e('请输入手机号码')
        }else if(!state.formData.photo){
            return $msg_e('请选择头像')
        }else if(state.formData.roleId == 0){
            return $msg_e('请输入角色')
        }
        // state.formData.photo = global.UPDATA_UPLOAD+state.formData.photo
        if(state.accountDialogTitle == '添加用户'){
           await add(state.formData)
        }else{
          await update(state.formData)
        }
         state.isAccountDialog = false
         initTableData()
    }
   
    function handleAvatarSuccess(res, file) {
        let { filename,success} = res
        if(success){
            state.formData.photo = filename
        }
    //   this.imageUrl = URL.createObjectURL(file.raw)
    }
    function beforeAvatarUpload(file) {
        // 定义图片格式
      let imgType = ['image/png','image/jpeg','image/gif']
     //图片得格式必须指定的图片的格式
      const isJPG = imgType.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        $msg_e('请选择正确的图片格式')
      }
      if (!isLt2M) {
        $msg_e('图片大小不能超过2MB')
      }
      return isJPG && isLt2M
    }
    
    // 查看角色
    getRoleList()
    return {
      ...toRefs(state),
      handleAdd,
      handleEdit,
      handleDelete,
      sureAccountDialog,
      handleAvatarSuccess,
      beforeAvatarUpload,
      initTableData
    }
  },
}
</script>

<style lang="scss" scoped>

.dialog{
    .el-overlay{
        .el-overlay-dialog{
            .el-dialog{
                .el-dialog__body{
                    .el-form {
                        .el-form-item{
    margin-bottom: 10px !important;

                        }
                    }
                }
            }
        }
    }
   
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader-icon svg {
  margin-top: 74px; /* (178px - 28px) / 2 - 1px */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>