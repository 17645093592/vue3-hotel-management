<template>
  <div class="container">
    <!-- 搜索qu -->
    <div class="search">
      <span>房间类型:</span>
      <el-select
        size="mini"
        v-model="searchDate.roomTypeId"
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
      <span>房间状态:</span>
      <el-select
        size="mini"
        v-model="searchDate.roomStateId"
        placeholder="Select"
      >
        <el-option
          v-for="item in roomStateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="success" @click="initTableData"
        >查询</el-button
      >
      <el-button size="mini" type="warning" @click="xlslTableList"
        >导出Excel</el-button
      >
      <el-button size="mini" type="primary" @click="handleAdd"
        >添加用户</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 100%" border>
      <el-table-column prop="roomId" label="房间号" />
      <el-table-column prop="roomType.roomTypeName" label="房间类型" />
      <el-table-column prop="roomType.roomTypePrice" label="房间价格" />
      <el-table-column prop="roomType.bedNum" label="床位数" />
      <el-table-column prop="roomState.roomStateName" label="房间状态">
        <template #default="scope">
          <el-tag
            size="mini"
            v-if="scope.row.roomState.roomStateId == '1'"
            type="success"
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
          <el-tag
            size="mini"
            v-if="scope.row.roomState.roomStateId == '2'"
            type="warning"
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
          <el-tag
            size="mini"
            v-if="scope.row.roomState.roomStateId == '3'"
            type="danger"
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template #default="scope">
          <div style="display: flex">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddPhoto(scope.row)"
              >照片</el-button
            >
            <el-button size="mini" type="warning" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div>111{{aa}}</div> -->

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
        width="40%"
      >
        <template v-slot:dialog-info>
          <el-form label-position="right" label-width="60px">
            <el-form-item label-width="70px" label="房型编号">
              <el-input v-model="formData.roomId"></el-input>
            </el-form-item>
            <el-form-item label-width="70px" label="房型类型">
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
            <el-form-item label-width="70px" label="房间状态">
              <el-select
                size="mini"
                v-model="formData.roomStateId"
                placeholder="Select"
              >
                <el-option
                  v-for="item in roomStateList2"
                  :key="item.roomStateId"
                  :label="item.roomStateName"
                  :value="item.roomStateId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="70px" label="房间描述">
              <QuillEditor
                v-if="isAccountDialog"
                v-model:content="formData.description"
                contentType="html"
                theme="snow"
                style="height: 300px"
              />
            </el-form-item>
          </el-form>
        </template>
      </defaultDialog>
    </div>
    <div>
      <defaultDialog
        v-model:value="photoDialog"
        :title="accountDialogTitle"
        @sure="sureAccountDialog"
        width="40%"
      >
        <template v-slot:dialog-info>
          <el-upload
            :action="global.ROOM_UPLOADIMG"
            list-type="picture-card"
            :file-list="ImageList"
            :limit="9"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-icon><plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible" width="40%">
            <img style="width: 100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </template>
      </defaultDialog>
    </div>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons'
import { reactive, toRefs, getCurrentInstance, watch, watchEffect } from 'vue'
import { list, add, update, deltel } from '@/api/room.js'
import { list as getRoomList } from '@/api/roomtype'
import { list as getRoomStateList, listToUpdate } from '@/api/roomState'
import { $msg_e } from '@/components/msg'
import {
  add as addRoomImg,
  list as roomImgList,
  deltel as delRoomImg,
} from '@/api/roomImg'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  components: {
    Plus,
  },
  setup() {
    const state = reactive({
      tableData: [],
      isAccountDialog: false,
      accountDialogTitle: '',
      //   弹出框
      formData: {
        roomId: '',
        description: '',
        roomTypeId: 0,
        roomStateId: 0,
      },
      //   搜索框
      searchDate: {
        //   房间类型编号
        roomTypeId: 0,
        roomStateId: 0,
        guestId: 0,
      },
      // aa:global.STORAGE,
      pageItem: {},
      //   房间类型数组
      roomTypeList: [],
      roomStateList: [],
      roomStateList2: [],
      // 照片
      photoDialog: false,
      dialogImageUrl: '',
      dialogVisible: false,
      // 指定房间的图片列表
      ImageList: [],
    })
    // 获取全局内容
    const _this = getCurrentInstance()
    const { global } = _this.appContext.config.globalProperties
    watchEffect(() => {
      state.pageItem = global.PAGE_ITEM()
    })
    // 加载房间类型
    let getRoomlist = async () => {
      let data = await getRoomList()
      data.unshift({ roomTypeId: 0, roomTypeName: '请选择房间类型' })
      state.roomTypeList = data
    }
    getRoomlist()
    // 加载房间状态(用于查询)
    let getRoomStatelist = async () => {
      let data = await getRoomStateList()
      data.unshift({ roomStateId: 0, roomStateName: '请选择房间状态' })
      state.roomStateList = data
    }
    getRoomStatelist()
    // 加载房间状态(不存在入住)(用于添加)
    let listToUpdate2 = async () => {
      let data = await listToUpdate()
      data.unshift({ roomStateId: 0, roomStateName: '请选择房间状态' })
      state.roomStateList2 = data
    }
    listToUpdate2()
    // 更新表格
    let initTableData = async (index = 1) => {
      let { pageSize, pageIndex } = state.pageItem
      pageIndex = index
      // 查询条件
      let params = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        roomTypeId: state.searchDate.roomTypeId,
        roomStateId: state.searchDate.roomStateId,
      }
      let { data, count } = await list(params)
      state.tableData = data
      state.pageItem.total = count
    }
    initTableData()

    // 添加照片弹出框
    // 定义当前房间编号
    let CurrentRoomId = 0
    let handleAddPhoto = async (row) => {
      state.photoDialog = true
      state.accountDialogTitle = '照片'
      let { roomId } = row
      CurrentRoomId = roomId
      // ImageList
      let ret = await roomImgList({ roomId })
      let imgList = ret.map((res) => {
        return {
          roomImgId: res.roomImgId,
          name: res.imgUrl,
          filename: res.imgUrl,
          url: global.ROOM_UPLOAD + res.imgUrl,
        }
      })
      state.ImageList = imgList
    }
    // 导出
    let xlslTableList = () => {
      var wopts = {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary',
      }
      var workBook = {
        SheetNames: ['Sheet1'],
        Sheets: {},
        Props: {},
      }
      var table = []
      for(var i in state.tableData){
        var params = {
          房间号: state.tableData[i].roomId,
          房间类型: state.tableData[i].roomType.roomTypeName,
          房间价格: state.tableData[i].roomType.roomTypePrice,
          床位数: state.tableData[i].roomType.bedNum,
          房间状态: state.tableData[i].roomState.roomStateName,
        }
        table[i] = params
      }
      // 1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
      // 2、将数据放入对象workBook的Sheets中等待输出
      workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(table)

      //3、XLSX.write() 开始编写Excel表格
      //4、changeData() 将数据处理成需要输出的格式
      FileSaver.saveAs(
        new Blob([changeData(XLSX.write(workBook, wopts))], {
          type: 'application/octet-stream',
        }),
        '客房管理.xlsx'
      )
    }
    let changeData = (s) => {
      //如果存在ArrayBuffer对象(es6) 最好采用该对象
      if (typeof ArrayBuffer !== 'undefined') {
        //1、创建一个字节长度为s.length的内存区域
        var buf = new ArrayBuffer(s.length)

        //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
        var view = new Uint8Array(buf)

        //3、返回指定位置的字符的Unicode编码
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      } else {
        var buf = new Array(s.length)
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
        return buf
      }
    }
    // 添加
    let handleAdd = () => {
      state.isAccountDialog = true
      state.accountDialogTitle = '添加房间类型'
      state.formData = {
        description: '',
        roomTypeId: 0,
        roomStateId: 0,
      }
      state.roomStateList2 = listToUpdate2()
    }
    // 修改
    let handleEdit = (row) => {
      state.isAccountDialog = true
      state.accountDialogTitle = '修改房间类型'
      state.formData = { ...row }
      state.formData.id = row.roomId
      state.roomStateList2 = state.roomStateList
    }
    // 删除
    let handleDelete = async (row) => {
      let { roomId } = row
      await deltel({ roomId })
      initTableData()
    }
    // 点击确定
    let sureAccountDialog = async () => {
      // if(!state.formData.roomTypeName){
      //     return $msg_e('请输入房间名称')
      // }else if(isNaN(state.formData.roomTypePrice)){
      //     return $msg_e('请输入房间价格')
      // }else if(!state.formData.bedNum){
      //     return $msg_e('请输入床位数')
      // }
      if (state.accountDialogTitle == '添加房间类型') {
        await add(state.formData)
      } else if (state.accountDialogTitle == '修改房间类型') {
        await update(state.formData)
      } else if (state.accountDialogTitle == '照片') {
        state.isAccountDialog = false
      }
      state.isAccountDialog = false
      initTableData()
    }
    // 删除图片
    let handleRemove = async (file, fileList) => {
      console.log(file, fileList)
      let { roomImgId, filename } = file
      await delRoomImg({ roomImgId, filename })
    }
    // 新增图片
    async function handleAvatarSuccess(res, file) {
      console.log(res, file, '')
      let { filename, success } = res
      if (success) {
        let params = {
          roomId: CurrentRoomId,
          imgUrl: filename,
        }
        await addRoomImg(params)
        // state.formData.dialogImageUrl = filename
      }
      //   this.imageUrl = URL.createObjectURL(file.raw)
    }
    // 图片格式
    function beforeAvatarUpload(file) {
      // 定义图片格式
      let imgType = ['image/png', 'image/jpeg', 'image/gif']
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
    let handlePictureCardPreview = (file) => {
      console.log(file, '')
      state.dialogImageUrl = file.url
      state.dialogVisible = true
    }
    // 点击照片时清空
    watch(
      () => state.photoDialog,
      (val) => {
        // console.log(val, '')
        if (val == false) {
          state.ImageList = []
        }
      }
    )
    return {
      ...toRefs(state),
      handleEdit,
      initTableData,
      handleDelete,
      handleAdd,
      sureAccountDialog,
      handleAddPhoto,
      handleRemove,
      handlePictureCardPreview,
      handleAvatarSuccess,
      beforeAvatarUpload,
      xlslTableList,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>