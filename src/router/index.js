import { createRouter, createWebHashHistory } from 'vue-router'
// 定义路由信息
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  // 首页
  {
    path: '/index',
    name: 'index',
    redirect:'/home',
    meta:{name:'首页',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/home',
        name: 'home',
        component:()=>import('@/views/Home/home'),
        meta:{name:'首页',hidden:true}
      },
      {
        path: '/email',
        name: 'email',
        component:()=>import('@/views/Home/email'),
        meta:{name:'邮箱',hidden:true},
      },
      {
        path: '/message',
        name: 'message',
        component:()=>import('@/views/Home/message'),
        meta:{name:'消息',hidden:true},
      },
    ]
  },
  {
    path: '/geren',
    name: 'geren',
    meta:{name:'管理员',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/mine',
        name: 'mine',
        meta:{name:'个人中心',hidden:true},
        component:()=>import('@/views/Mine/mine'),
      },
      {
        path: '/resetPwd',
        name: 'resetPwd',
        meta:{name:'修改密码',hidden:true},
        component:()=>import('@/views/Mine/resetPwd'),
        
      }
    ]
  },
  {
    path: '/RoomType',
    name: 'RoomType',
    meta:{name:'客房管理',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/roomType',
        name: 'roomType',
        meta:{name:'类型管理',hidden:true},
        component:()=>import('@/views/roomType/roomType'),
      },
      {
        path: '/room',
        name: 'room',
        meta:{name:'客房管理',hidden:true},
        component:()=>import('@/views/roomType/room'),
      },
    ]
  },
  {
    path: '/Guset',
    name: 'Guset',
    meta:{name:'顾客管理',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/guest',
        name: 'guest',
        meta:{name:'顾客管理',hidden:true},
        component:()=>import('@/views/guest'),
      },
    ]
  },
  {
    path: '/Role',
    name: 'Role',
    meta:{name:'账户管理',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/role',
        name: 'role',
        meta:{name:'角色管理',hidden:true},
        component:()=>import('@/views/role/role'),
      },
      {
        path: '/admin',
        name: 'admin',
        meta:{name:'账号管理',hidden:true},
        component:()=>import('@/views/role/admin'),
      }
    ]
  },
  {
    path: '/Rbac',
    name: 'Rbac',
    meta:{name:'权限管理',hidden:true},
    component:()=>import('@/layout/index'),
    children:[
      {
        path: '/rbac',
        name: 'rbac',
        meta:{name:'权限列表',hidden:true},
        component:()=>import('@/views/rbac/rbac.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component:()=>import('@/views/login')
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue')

  },
  { path: '/:pathMatch(.*)/', redirect: '/404', hidden: true }
]

// 创建一个路由器对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
import utils from '@/utils/utils1'
import {$msg_e,$msg_s,$confirm} from '@/components/msg'
//导入nprogress
import Nprogress from 'nprogress'
//导入nprogress样式
import 'nprogress/nprogress.css'
// 定义路由导航前置守卫
const whiteRoutes = ['/login', '/menusList']
router.beforeEach(async(to,from,next) =>{
  Nprogress.start()
  const isWhiteRoutes = whiteRoutes.some(item => to.path.includes(item))
  if(utils.checkEmpty(isWhiteRoutes)){
    const token = sessionStorage.getItem('token')
    if(token && typeof (token) != 'undefined'){
      next()
      NProgress.done()
    }else{
      await $confirm('token不存在,请重新登录')
      sessionStorage.clear()
      localStorage.clear()
      next({ name: 'login' })
      NProgress.done()
    }

  }else{
    next()
    NProgress.done()
  }
  // next()
})
// 定义路由导航后置守卫
router.afterEach((to,from) =>{
  Nprogress.done()

})

export default router
