//  登录信息模块
export default {
    namespaced:true,
    state: {
        admin:{
            name:"管理员",
            role:{}
        }
   },
   mutations: {
        setAdmin(state,val){
            state.admin = val
        }
   },
   actions: {
        setAdmin(store,val){
            store.commit('setAdmin',val)
        }
   },
  
}