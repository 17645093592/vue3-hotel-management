<template>
  <div class="sidebar">
    <div class="logo">
      <div>{{ !leftMentOption ? 'Bing酒店管理系统' : 'Bing' }}</div>
    </div>
    <el-menu
      active-text-color="#fff"
      :background-color="currenthemeColor"
      class="side-list"
      :default-active="active"
      unique-opened
      router
      :collapse="leftMentOption"
      :collapse-transition="false"
      text-color="#8598B9"
      @select="goRouter"
    >
         <div
          v-for="(item, index) in sideList"
          :key="index"
          @mouseenter="hoverSide(index)"
          @mouseleave="hoverSide(false)"
        >
          <!-- 带二级菜单的一级导航 -->
          <el-sub-menu v-if="item.children.length" :index="item.router">
            <template #title v-if="isHover(index) || isAct(item)">
               <!-- 悬停/选中状态 -->
                <div
                  slot="title"
                  class="hover flex-center-between"
                >
                <div class="flex-center side-title-act">
                    <!-- <el-icon><Aim /></el-icon> -->
                  <!-- <el-icon>{{item.resourceUrl}}</el-icon> -->
                    <svg class="icon side-icon" aria-hidden="true">
                      <use :xlink:href="iconName(item.resourceUrl)"></use>
                    </svg>
                    <span v-if="!leftMentOption">{{ item.resourceName }}</span>
                  </div>
                </div>
            </template>
            <template #title v-else>
                  <!-- 默认状态 -->
              <div slot="title" class="flex-center-between">
                <div class="flex-center">
                  <svg class="icon side-icon" aria-hidden="true">
                    <use :xlink:href="iconName(item.resourceUrl)"></use>
                  </svg>
                  <span v-if="!leftMentOption">{{ item.resourceName }}</span>
                </div>
              </div>
            </template>
            <!-- 二级导航 -->
            <el-menu-item-group popper-class="sub-list">
              <el-menu-item
                v-for="(subItem, subIndex) in item.children"
                :key="subIndex"
                :index="subItem.router"
                ><span  style="margin-left:35px">{{ subItem.resourceName }}</span></el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <!-- 一级导航 -->
          <el-menu-item v-else :index="item.router">
            <div class="flex-center" :class="{ hover: hoverIndex == index }">
               <svg class="icon side-icon" aria-hidden="true">
                <use :xlink:href="iconName(item.resourceUrl)"></use>
              </svg>
              <span v-if="!leftMentOption">{{ item.resourceName }}</span>
            </div>
          </el-menu-item>
        </div>
    </el-menu>
  </div>
</template>

<script>
import {
  Aim,
  AddLocation,
  Briefcase,
  Cpu,
  Collection,
} from '@element-plus/icons'
import { menusList } from '@/api/menus'
import '@/mock'
import { computed, reactive, toRefs } from '@vue/reactivity'
import { onMounted, watch, watchEffect,getCurrentInstance  } from '@vue/runtime-core'
import {useRouter,useRoute} from 'vue-router'
export default {
  props: ['leftMentOption', 'currenthemeColor'],
  components: {
    Aim,
    AddLocation,
    Briefcase,
    Cpu,
    Collection,
  },
  computed:{
    // 登录信息中的侧栏list
     getResourceList() {
      return this.oldSidList
    },
      // 当前选中的路由item
    getRouteItem() {
      return (
        this.getResourceList.find(
          (item) =>
            item.router == this.active &&
            item.children.length == 0 &&
            item.resourceType == 1
        ) || {}
      )
    },
    iconName() {
      return (name) => '#icon-' + name
    },
    // 悬停一级菜单
    isHover() {
      return (index) => this.hoverIndex == index
    },
    // 选中一级菜单
    isAct() {
      // 当前选中的item可能是二级目录，二级目录比对 Pid
      return (routeItem) =>
        //  console.log(routeItem,this.getRouteItem, '111')
        // console.log(this.getRouteItem, '')
        routeItem.resourceId == this.getRouteItem.resourceId ||
        routeItem.resourceId == this.getRouteItem.resourceParentId
    }
  },
  setup() {
    let $router = useRouter()
    let $route = useRoute()
    // 获取全局内容
      const _this = getCurrentInstance()
      const {global,utils} = _this.appContext.config.globalProperties
    let state = reactive({
      sideList: [],
      oldSidList:[],
      active: '',
      hoverIndex:-1
    })
    watchEffect(()=>{
      changeRouter()
      goRouter($route.path)
    })
    // 处理侧边栏数据
    let getMenusList = async () => {
      let res = await menusList()
      state.sideList = res.data
      state.oldSidList = res.data
      state.sideList = utils.resourceChange(
        res.data,
        'resourceId',
        'resourceParentId'
      )
      state.sideList = state.sideList.filter((item) => {
        return item.resourceType == 1
      })
    }
    getMenusList()
    // 路由切换时，修改参数
    function changeRouter() {
      // 当前路由如果是'index'，跳转到侧栏首个权限
      if ($route.name == global.INDEX_PAGE) {
        // 首页权限有2级权限，跳转2级权限第一个资源
        state.active = utils.checkEmpty(state.sideList[0].children)
          ? state.sideList[0].router
          : state.sideList[0].children[0].router
       
        $router.push(state.active)
      }
    }
    function goRouter(router) {
      //  $router.push(router)
       state.active = router
    }
     // 菜单悬停
    function hoverSide(index) {
      this.hoverIndex = utils.checkEmpty(index) ? -1 : index
    }

    return {
      ...toRefs(state),
      goRouter,
      hoverSide
    }
  },
}
</script>

<style lang="scss" scoped>
.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    color: #fff;
    font-size: 18px;
    border: 1px solid #eee;
    padding: 4px 10px;
    border-radius: 4px;
    // 不收缩
    flex-shrink: 0;
  }
}

// 隐藏侧栏滚动条
.main-side::-webkit-scrollbar {
  width: 0;
}

.side-title .index-logo {
  width: 100%;
  height: 100%;
}
// 侧栏list
.side-list {
  padding-bottom: 20px;
  border-right: none;
  background: transparent;
}
.side-title-act {
  color: #fff;
}
// 侧栏图标
.side-icon {
  margin-right: 8px;
}
// 箭头
.arrow-icon {
  transition: transform 0.5s;
}
.hover .icon {
  color: #fff;
}
// 悬停/二级被选中 箭头icon翻转180deg
.hover .arrow-icon {
  transform: rotate(180deg);
}
</style>