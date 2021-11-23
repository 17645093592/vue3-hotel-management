<template>
  <div class="container">
    <div class="box">
      <el-image
        style="width: 200px; height: 300px"
        :src="
          global.UPDATA_UPLOAD +
          ($store.state.user.admin.photo || 'admin_default.jpg')
        "
        fit="cover"
      ></el-image>
      <div>
        <p>账号:{{ $store.state.user.admin.loginId }}</p>
        <p>姓名:{{ $store.state.user.admin.name }}</p>
        <p>电话:{{ $store.state.user.admin.phone }}</p>
        <p>角色:{{ $store.state.user.admin.role.roleName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.box{
    display: flex;
    align-content: center;
    div{
        margin-left: 30px;
        p{
            margin-top: 30px;
        }
    }
}
</style>