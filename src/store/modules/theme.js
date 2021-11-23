//  主题模块
 export default {
     namespaced:true,
     state: {
        //  所有的主题色
        colors:[
            {
                name:'蓝色主题',
                color:'#101f30'
            },
            {
                name:'绿色主题',
                color:'#497568'
            },
            {
                name:'红色主题',
                color:'#481e1c'
            },
            {
                name:'黑色主题',
                color:'#000000'
            },
            {
                name:'灰色主题',
                color:'#545c64'
            }
        ],
        // 当前主题色
        currenthemeColor:localStorage.getItem('color')? localStorage.getItem('color'):'#2c354c'
    },
    getters:{
        // 返回主题色的名称数组
        getColorName(state){
            return state.colors.map(r=>r)
        },
    },
    mutations: {
        // 更新当前主题色的方法
        updatedCurrenthemeColor(state,val) {
            state.currenthemeColor = val
        },
    },
    actions: {
        // 更新当前主题色的方法
        updatedCurrenthemeColor(store,val){
            store.commit('updatedCurrenthemeColor',val)
        }
    },
   
 }