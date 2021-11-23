<template>
  <div class="container">
    <!-- 搜索qu -->
    <div class="search">
      <el-button size="mini" type="primary" @click="handleAdd()"
        >添加</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 100%" border>
       <!-- <el-table-column type="expand">
        <template #default="props">
          <p>State: {{ props.row.state }}</p>
          <p>City: {{ props.row.city }}</p>
          <p>Address: {{ props.row.address }}</p>
          <p>Zip: {{ props.row.zip }}</p>
        </template>
      </el-table-column> -->
      <el-table-column prop="roleId" label="角色编号" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleName" label="操作" width="180">
        <template #default="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉去 -->
    <defaultDialog
      v-model:value="isAccountDialog"
      :title="accountDialogTitle"
      @sure="sureAccountDialog"
      width="30%"
    >
      <template v-slot:dialog-info>
        <div>
          <el-form label-position="right" label-width="60px">
            <el-form-item label-width="70px" label="角色名称">
              <el-input v-model="formData.roleName"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </defaultDialog>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { list, add, updata, deltel } from '@/api/role'
export default {
  setup() {
    const data = reactive({
      tableData: [],
      isAccountDialog: false,
      accountDialogTitle: '添加角色',
      formData: {
        roleName: '',
      },
    })
    // 获取列表
    async function tableList() {
      const r = await list()
      data.tableData = r
    }
    // 点击添加
    let handleAdd = () => {
      data.isAccountDialog = true
      data.accountDialogTitle = '添加角色'
      data.formData.roleName = ''
    }
    // 点击编辑
    let handleEdit = (i, row) => {
      data.isAccountDialog = true
      data.accountDialogTitle = '编辑角色'
      data.formData = { ...row }
    }
    // 点击删除
    let handleDelete = async (row) => {
      let { roleId } = row
      let res = await deltel({ roleId })
      if (res) {
        tableList()
      }
    }

    // 点击确定
    let sureAccountDialog = async () => {
      if (data.accountDialogTitle == '添加角色') {
        let res = await add(data.formData)
        if (res) tableList()
      } else {
        let res = await updata(data.formData)
        if (res) {
          tableList()
        }
      }

      data.isAccountDialog = false
    }
    tableList()
    return {
      ...toRefs(data),
      handleAdd,
      handleEdit,
      handleDelete,
      sureAccountDialog,
    }
  },
}
</script>

<style lang="scss" scoped>
.item {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 10px 0;
  // border-top: 1px solid red;
  span {
    width: 70px;
    text-align: right;
  }
  div {
    flex: 1;
  }
}
</style>