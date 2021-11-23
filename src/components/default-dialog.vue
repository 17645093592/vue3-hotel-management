<template>
  <div class="defaultDialog">
    <el-dialog
      width="600px"
      top="10vh"
      :title="title"
      :model-value="value"
      :before-close="close"
    >
      <slot name="dialog-info"></slot>
      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent ,computed} from 'vue'

export default defineComponent({
  name: 'defaultDialog',
  emits: ['sure','close'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
      let value = computed({
        get: () => props.value,
        set: (value) =>{
          context.emit('update:value', value)
        },
      })
    let close = () => {
      value.value = !value.value
    }
    let sure = () => {
      context.emit('sure')
    }
    return {
      close,
      sure,
      value
    }
  },
})
</script>

<style lang="scss" scoped>
</style>