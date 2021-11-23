const global = {
     // 项目名
  PRODUCT: '提示',
  // 版本号
  VERSION: 'V0.1_20210712',
  // 首页路由的name
  INDEX_PAGE: 'index',
  // 登录路由的name
  LOGIN_PAGE: 'login',
  // 缓存类型
  STORAGE: 'localStorage',
  // 浏览器最小宽度
  BROWSER_MIN_WIDTH: 1200,
  // 分页设置
  SIZE_LIST: [10, 20, 30, 40],
  PAGE_ITEM() {
    return {
      total: 1,
      pageIndex: 1,
      pageSize: global.SIZE_LIST[0]
    }
  },
  BASE_URL: 'http://bingjs.com:83/', // 测试
  MOCK_URL: 'http://mockjs.com/dist/mock/', // 测试
  ADMIN_UPLOAD :'http://bingjs.com:83/Admin/UploadImg', //上传头像地址
  UPDATA_UPLOAD :'http://bingjs.com:83/upload/admin/', //更新图片地址
  ROOM_UPLOADIMG :'http://bingjs.com:83/RoomImg/UploadImg/', //上传房间照片
  ROOM_UPLOAD :'http://bingjs.com:83/upload/room/', //查看房间图片地址
}

export default global