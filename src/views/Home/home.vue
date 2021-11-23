<template>
  <div class="container">
    <div class="home">
      <div class="box" ref="box1">
        <box1 :RenTypeList="box1List"></box1>
      </div>
      <!-- <div class="box" ref="box2"></div>
      <div class="box" ref="box3"></div>
      <div class="box" ref="box4"></div> -->
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs, ref } from 'vue'
import { totalTypePrice } from '@/api/home'
import box1 from './echarts/box1'
export default {
  components: {
    box1,
  },
  setup() {
    const state = reactive({
      box1List: [],
    })
    let gettotalTypePrice = async () => {
      let res = await totalTypePrice()
      state.box1List = res
    }

    gettotalTypePrice()
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  margin-top: 40px;
}
.box {
  width: 100%;
  height: 400px;
  // border: 1px solid #ddd;
  margin-top: 10px;
}
</style>