<template>
  <div class="container">
    <div class="tree-title flex">
      <p class="resource-name">菜单名称</p>
      <p class="resource-path">资源URL</p>
      <p class="resource-handle">操作</p>
    </div>
    <div class="tree-no-data" v-if="resourceTree.length == 0">暂无数据</div>
    <!-- 资源树 -->
    <el-tree
      v-else
      class="tree-container"
      :data="resourceTree"
      node-key="id"
      default-expand-all
      draggable
      :allow-drop="allowDrop"
      @node-drag-end="upDateResource"
    >
      <template #default="{ data }">
        <div class="tree-node">
          <p class="resource-name">{{ data.resourceName }}</p>
          <p class="resource-path">{{ data.router }}</p>
           <div class='resource-handle' @click.stop=''>
                    <el-button type="primary" plain size='mini' @click.stop='editResourceDialog(data)'>编辑菜单名称</el-button>
            </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { menusList } from '@/api/menus'

export default {
  setup() {
    // 获取全局内容
    const _this = getCurrentInstance()
    const { global, utils } = _this.appContext.config.globalProperties
    const state = reactive({
      resourceTree: [],
    })
    // 处理侧边栏数据
    let getMenusList = async () => {
      let res = await menusList()
      state.resourceTree = res.data
     state.resourceTree = utils.resourceChange(
        res.data,
        'resourceId',
        'resourceParentId'
      )
      console.log(state.resourceTree, 'resourceTree')
    }
    getMenusList()

    let editResourceDialog = (val) => {}
    let allowDrop = (val) => {}
    let upDateResource = (val) => {}
    return {
      ...toRefs(state),
      editResourceDialog,
      allowDrop,
      upDateResource,
    }
  },
}
</script>

<style lang="scss" scoped>

// 表头
.tree-title .resource-name {
  padding-left: 23.5px;
}
// 树
.resource-id {
  width: 50px;
  border-right: 1px solid #dcdfe6;
  cursor: auto;
}
.resource-name {
  flex-grow: 1;
  text-align: left;
  border-right: 1px solid #dcdfe6;
}
.resource-path {
  width: 250px;
  flex-shrink: 0;
  border-right: 1px solid #dcdfe6;
  cursor: auto;
}
.resource-handle {
  width: 200px;
  flex-shrink: 0;
  cursor: auto;
}

</style>