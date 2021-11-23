<template>
  <div class="com-container">
    <div class="com-chart" id="hot_ref" ref="hot_ref"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'single-map',
  props: {
    RenTypeList: {
      type: Array,
      required: true,
    },
  },
  watch: {
    RenTypeList(val) {
      this.getData(val)
    },
  },
  data() {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的所以数据
    }
  },
  mounted() {
    // console.log(this.RenTypeList, 'RenTypeListRenTypeListRenTypeListRenTypeList')

    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始
    initChart() {
      let myCharts = echarts.getInstanceByDom(this.$refs.hot_ref)
      if (myCharts == null) {
        this.chartInstane = echarts.init(this.$refs.hot_ref)
      }
      const initOption = {
        title: {
          text: '房型累计销售额',
        },
        tooltip: {},
        xAxis:{
            data:[]
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data:[]
          },
        ],
      }
      this.chartInstane.setOption(initOption)
    },
    // 获取接口
    async getData(val) {
      //   const res = await this.$http('')

      this.updataChart(val)
    },
    // 数据
    updataChart(RenTypeList) {
      this.initChart()
      if (RenTypeList) {
          let listName = RenTypeList.map(item=>item.roomtypeName)
          let listval = RenTypeList.map(item=>item.totalMoney)
        const dataOption = {
          xAxis: {
            data: listName,
          },
          series: [
            {
              data: listval,
            },
          ],
        }
        this.chartInstane.setOption(dataOption)
      }
    },
    // 适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      const addpateOption = {}
      this.chartInstane.setOption(addpateOption)
      this.chartInstane.resize()
    },
  },
}
</script>

<style lang="scss" scoped>
.com-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.com-chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
