import Mock from 'mockjs';

Mock.setup({
    timeout:500,
});

// 随机生成数据
const {roleList} = Mock.mock({
    "roleList|2-10":[{
        'roleId|+1':1,
        'roleName':'@ctitle(4,6)'
    }]
})
// 定义一个接口,拦截指定的请求
Mock.mock('/list' , 'get' ,(options) =>{
    console.log('tag', '')
    return roleList
})

// 随机生成数据
const {menus} = Mock.mock({
    "menus":[{
        'background': null,
        'resourceId':17,
        'resourceName':'首页',
        'perms': "",
        'resourceParentId':0,
        'children':[],
        'router': "/home",
        'resourceUrl': "shouye",
        'resourceType': 1,
        'seq':1
    },
    {
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 1,
        'resourceName': "账户管理",
        'resourceParentId': 0,
        'resourceType': 1,
        'resourceUrl': "weibiaoti5",
        'router': "/Role",
        'seq': 30
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 2,
        'resourceName': "角色管理",
        'resourceParentId': 1,
        'resourceType': 1,
        'resourceUrl': "Role/role",
        'router': "/role",
        'seq': 31
    },
    {
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 3,
        'resourceName': "账号管理",
        'resourceParentId': 1,
        'resourceType': 1,
        'resourceUrl': "Role/admin",
        'router': "/admin",
        'seq': 32
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 4,
        'resourceName': "客房管理",
        'resourceParentId': 0,
        'resourceType': 1,
        'resourceUrl': "kefang",
        'router': "/RoomType",
        'seq': 33
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 5,
        'resourceName': "类型管理",
        'resourceParentId': 4,
        'resourceType': 1,
        'resourceUrl': "RoomType/roomType",
        'router': "/roomType",
        'seq': 34
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 6,
        'resourceName': "客房管理",
        'resourceParentId': 4,
        'resourceType': 1,
        'resourceUrl': "RoomType/room",
        'router': "/room",
        'seq': 35
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 7,
        'resourceName': "顾客管理",
        'resourceParentId': 0,
        'resourceType': 1,
        'resourceUrl': "tubiao_gukeguanli",
        'router': "/Guset",
        'seq': 36
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 8,
        'resourceName': "顾客管理",
        'resourceParentId': 7,
        'resourceType': 1,
        'resourceUrl': "Guset/guset",
        'router': "/guest",
        'seq': 37
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 9,
        'resourceName': "权限管理",
        'resourceParentId': 0,
        'resourceType': 1,
        'resourceUrl': "authority",
        'router': "/Rbac",
        'seq': 38
    },{
        'background': null,
        'children': [],
        'perms': "",
        'resourceId': 10,
        'resourceName': "权限列表",
        'resourceParentId': 9,
        'resourceType': 1,
        'resourceUrl': "Rbac/rbac",
        'router': "/rbac",
        'seq': 39
    }
    ]
})

Mock.mock("/menusList",'post',(options)=>{
    return menus
})

export default Mock