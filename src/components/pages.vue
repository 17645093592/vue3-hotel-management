<template>
  <div class="page-item flex-center-between">
    <slot name="page-left">
      <div v-if="!isLeft"></div>
    </slot>
    <el-pagination
      :layout="layout"
      :page-sizes="sizeList"
      :pager-count="5"
      :total="pageItem.total"
      :current-page="pageItem.pageIndex"
      :page-size="pageItem.pageSize"
      @current-change="setPageNum"
      @size-change="setPageSize"
    >
    </el-pagination>
    <slot name="page-right">
      <div v-if="isLeft"></div>
    </slot>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'

export default {
  name: 'pages',
  emits: ['pageChange'],
  props: {
    pageItem: {
      type: Object,
      required: true,
    },
    layout: {
      type: String,
      default: 'prev,pager,next,total,sizes,jumper',
    },
    isLeft: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const state = reactive({
      sizeList: global.SIZE_LIST,
    })
    // 设置页码
    let setPageNum = (Index) => {
      console.log(Index, '')
      props.pageItem.pageIndex = Index
      pageHandler()
    }
    // 设置每页条数
    let setPageSize = (Size) => {
      props.pageItem.pageSize = Size
      pageHandler()
    }
    // 修改props里的传值必须用computed包裹一下
    // const pageItem = computed({
    //   get: () => props.pageItem,
    //   set: (value) => context.emit('update:pageItem', props.pageItem),
    // })
    // 更新pageItem，返回change方法
    let pageHandler = () => {
      context.emit('pageChange', props.pageItem.pageIndex)
    }
    return {
      ...toRefs(state),
      setPageNum,
      setPageSize,
      pageHandler,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>