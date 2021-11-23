<template>
  <div class="Navbar">
    <div class="menus">
      <ul>
        <li class="theme">
          <i
            ><el-icon><baseball /></el-icon>
          </i>
          <span>主题颜色选择:</span>
          <el-color-picker
            v-model="color"
            @change="activeColor"
            style="vertical-align: middle; margin-left: 5px"
          />
        </li>
        <li class='arrowDown'>
          <el-icon><avatar /></el-icon>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ $store.state.user.admin.name }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu >
                <el-dropdown-item @click="$router.push('/mine')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/resetPwd')">修改密码</el-dropdown-item>
                <el-dropdown-item @click="exit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>
    </div>

    <div></div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch } from 'vue'
// 导入stort
import {
  Baseball,
  Collection,
  ChatLineRound,
  Message,
  Avatar,
  ArrowDown,
} from '@element-plus/icons'
import { $msg_e, $msg_s, $confirm } from '@/components/msg'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  props: ['getColorNames', 'currenthemeColor'],
  components: {
    Baseball,
    Collection,
    ChatLineRound,
    Message,
    Avatar,
    ArrowDown,
  },
  setup(props) {
    let $store = useStore()
    let $router = useRouter()
    const state = reactive({
      count: 0,
      color: props.currenthemeColor,
    })
    // 更换选择的主题
    let activeColor = () => {
      console.log(state.color, 'state.colorstate.color')
      localStorage.setItem('color', state.color)
      $store.dispatch('theme/updatedCurrenthemeColor', state.color)
    }
    
    watch(
      () => props.currenthemeColor,
      (val) => {
        console.log(val, 'val')
        if (!val) {
          state.color = props.currenthemeColor
          localStorage.setItem('color', '#2c354c')
          $store.dispatch('theme/updatedCurrenthemeColor', '#2c354c')
        }
      }
    )
    // 退出
    let exit = async () => {
      // 点击退出弹出提示框
      await $confirm('确定要退出吗')
      sessionStorage.clear()
      localStorage.clear()
      $router.push('/')
      $msg_s('退出成功')
    }

    return {
      ...toRefs(state),
      exit,
      activeColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.Navbar {
  display: flex;
  align-items: center;
}
.menus {
  display: flex;
  width: 100%;
  // flex-direction: column;
  ul {
    display: flex;
    align-items: center;
    width: 100%;
    li {
      color: #fff;
      width: 20%;
      height: 55px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
      }
      span {
        line-height: 60px;
        margin-left: 5px;
      }
    }
    .active{
      border-bottom: 2px solid #ffd04b;
      color:#ffd04b !important;
    }
    .theme {
      width: 30%;
    }
    .arrowDown{
        width:25%;
        .el-dropdown{
            color: #fff;
        }
    }
  }
}
</style>