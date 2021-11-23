<template>
  <div class="layout">
    <div class="left" :style="{ width: leftMentOption ? '65px' : '200px' , background:currenthemeColor}">
      <Sidar :leftMentOption="leftMentOption" :currenthemeColor="currenthemeColor"></Sidar>
    </div>
    <div class="right" :style="{width: leftMentOption ? '999999px' : '0px' ,}">
      <div class="top" :style="{background:currenthemeColor}">
        <div class="icon" style="color: #fff;" @click="leftMentOption = !leftMentOption">
          <el-icon size="20" v-show="leftMentOption"><Fold /></el-icon>
          <el-icon size="20" v-show="!leftMentOption"><Expand /></el-icon>
        </div>
        <div class="menu">
          <Navbar
            :getColorNames="getColorNames"
            :currenthemeColor="currenthemeColor"
          ></Navbar>
        </div>
      </div>
      <div class="bottom">
          <!-- <div class="bottom-top">{{a.a}}>{{a.b}}</div> -->
          <div class="bottom-top">{{a.b}}</div>
          <router-view></router-view>
          <div style="margin-top:15px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, watchEffect ,onBeforeMount } from 'vue'
// 导入图标

import { getOne } from '@/api/admin'
import { Fold, Expand } from '@element-plus/icons'
import Sidar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import { useStore } from 'vuex'
import { useRouter,useRoute } from 'vue-router'
export default {
  components: {
    Fold,
    Expand,
    Sidar,
    Navbar,
  },
  setup() {
    let $store = useStore()
    let $router = useRouter()
    let $route = useRoute()
  
    const menuData = reactive({
      activeIndex1: '1',
      //   是否折叠
      leftMentOption: false,
      title:'',
      a:{}
    })
      watchEffect(()=>{
        if($route.matched.length>=2){
            menuData.a.a = $route.matched[0].meta.name
              menuData.a.b = $route.matched[1].meta.name
              menuData.title = $route.meta.name
        }
    })
    // 计算属性
    let getColorNames = computed(() => {
      return $store.getters['theme/getColorName']
    })
    // 从全局状态里获取当前主题色
    let currenthemeColor = computed(() => {
        return $store.state.theme.currenthemeColor
    })
    // console.log(currenthemeColor, 'saveCurrectColor')
    // 生命周期
     onBeforeMount(async()=>{
        // 获取个人信息
        let loginId = localStorage.getItem('loginId')
        let data = await getOne({loginId})
        // 存进vuex
        $store.dispatch('user/setAdmin',data)
    })
    return {
      ...toRefs(menuData),
      getColorNames,
      currenthemeColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  background:#eee ;
  .left {
    background: #414141;
    transform: all 0.5s;
    overflow: hidden;
    // .logo{
    //     height: 60px;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     div{
    //         color: #fff;
    //         font-size: 18px;
    //         border: 1px solid #eee;
    //         padding: 4px 10px;
    //         border-radius: 4px;
    //         // 不收缩
    //         flex-shrink: 0;
    //     }
    // }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #545c64;
      height: 60px;
      position:relative
      .icon {
        padding-left: 10px;
        color: #fff;
      }
      .menu {
        width: 550px;
        position: absolute;
        right: -14%;
      }
    }

    .bottom {
      flex: 1;
      overflow-y: auto;
      .bottom-top{
        height: 50px;
        margin: 0 16px;
        line-height: 50px;
      }
    }
  }
}
</style>