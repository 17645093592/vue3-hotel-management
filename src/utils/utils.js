import { createApp} from 'vue'
import App from '../App.vue'
import router from '@/router'
import global from './global.js'
const Vue = createApp(App)


// export let getStorage = async (key) =>{
//     params.loginPwd = md5(md5(params.loginPwd).split('').reverse().join(''))
//     return await $get('Admin/Login',params)
//  }



export default class utils {
  // -------------------------------通用工具---------------------------------------
  /**
   * 保存缓存
   * @param {String} *key 缓存的key
   * @param {String|Array|Object|Number} *value 缓存的值
   *
   */
  static setStorage(key, value) {
    if (this.checkEmpty(key)) return
    if (this.checkEmpty(value)) value = ''
    // 数组/对象类型保存时，需要转json
    window[global.STORAGE].setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    )
  }

  /**
   * 读取缓存
   * @param {String} *key 缓存的key
   *
   */
  static getStorage(key) {
    if (this.checkEmpty(key)) return ''
    const value = window[global.STORAGE].getItem(key)
    if (this.checkEmpty(value)) return ''
    if (this.checkJSON(value)) return JSON.parse(value)
  }

  /**
   * 删除缓存
   * @param {String} *key 缓存的key
   *
   */
  static removeStorage(key) {
    if (this.checkEmpty(key)) return
    window[global.STORAGE].removeItem(key)
  }

  /**
   * 清空缓存
   *
   */
  static emptyStorage() {
    window[global.STORAGE].clear()
  }

  /**
   * 打开loading
   *
   */
  static showLoading() {
    global.LOADING = Vue.prototype.$loading(global.LOADING_INFO)
  }

  /**
   * 关闭loading
   *
   */
  static hideLoading() {
    if (global.LOADING) global.LOADING.close()
  }

  /**
   * 打印带颜色
   * @param {String} *msg 打印的内容
   * @param {String} color 打印的颜色 默认为红色，加粗
   *
   */
  static log(msg, color = 'red') {
    console.log('%c' + msg, 'color:' + color + ';font-weight:bold;')
  }

  /**
   * 查找map中指定item
   * @param {Object} *map 待遍历的map
   * @param {String} *key 指定Key
   * @param {String} *value 指定Value
   *
   */
  static getMapItem(map, key, value) {
    return map.find(item => item[key] === value)
  }

  /**
   * 深度复制对象
   * @param {Object} *obj 待复制的对象
   * @param {Boolean} isDeep 是否需要递归 默认false
   *
   */
  static cloneObj(obj = {}, isDeep = false) {
    // 默认直接序列化 返序列化
    if (!isDeep) return JSON.parse(JSON.stringify(obj))
    // 需要深层复制 递归
    let newObj = {}
    if (obj instanceof Array) newObj = []
    for (const key in obj) {
      const val = obj[key]
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val
    }
    return newObj
  }

  // 判断2个对象是否相同
  static _diff(a, b) {
    if (typeof a !== typeof b) return false
    if (typeof a === 'object') {
      for (const i in a) {
        if (typeof b[i] === 'undefined') return false
        if (!this._diff(a[i], b[i])) return false
      }
      return true
    } else {
      return a === b
    }
  }

  /**
   * 删除数组指定元素
   * @param {Array} *arr 数组
   * @param {Object|String} removeEle 被删除的指定元素
   *
   */
  static removeArray(arr, removeEle) {
    for (let i = arr.length - 1; i > -1; i--) {
      if (this._diff(arr[i], removeEle)) {
        arr.splice(i, 1)
        break
      }
    }
  }

  /**
   * 获取对象的键、值 ---- ftp上传后用
   * @param {Object} *obj 待操作对象
   * @param {String} *type 获取键/值 key/value
   * @param {Number} index 获取键/值的索引 默认 0
   *
   */
  static getObjParam(obj, type, index = 0) {
    if (type != 'key' && type != 'value') return ''
    return type == 'key'
      ? Object.keys(obj)[index]
      : obj[Object.keys(obj)[index]]
  }

  // ------------------------------验证信息-------------------------------------
  /**
   * 判断值是否为空
   * 如果是0，返回false
   * 如果是空对象{}，返回true
   * 如果是空数组[]，返回true
   * 如果是空字符串/null/undefined，返回true
   *
   */
  static checkEmpty(value) {
    // 数字0 返回false
    if (value === 0) return
    // 验证对象类型
    if (this.isObject(value)) return JSON.stringify(value) == '{}'
    // 验证数组类型
    if (this.isArray(value)) return value.length == 0
    // 验证字符串类型/null/undefined
    if (typeof value === 'string') value = value.trim()
    if (!value || value == 'null' || value == 'undefined') return true
  }

  // 是否全部为中文---字符串'不全为中文'返回ture
  static checkAllCn(str = '') {
    const reg = /^[\u4E00-\u9FA5]+$/
    if (!reg.test(str)) return true
  }

  // 是否有中文---字符串'有中文'返回ture
  static checkCn(str = '') {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
    if (!reg.test(str)) return true
  }

  // 是否全部为数字+英文---字符串'不全为数组+英文'返回true
  static checkEn(str = '') {
    const reg = /^[0-9a-zA-Z]+$/
    if (!reg.test(str)) return true
  }

  // 验证是否只能输入数字
  static checkNum(num) {
    const reg = /^[0-9]+$/
    if (!reg.test(num)) return true
  }

  // 手机号是否正确---'手机号不正确'返回true
  static checkPhone(str = '') {
    const reg = /^(1[3-9][0-9])[0-9]{8}$/
    if (!reg.test(str)) return true
  }

  // 密码是否正确---'密码不正确'返回true
  static checkPassword(str = '') {
    const reg = /^[a-zA-Z]\w{5,17}$/
    if (!reg.test(str)) return true
  }

  // 座机号是否正确---'座机号不正确'返回true
  static checkTel(str = '') {
    const re = /^(0[0-9]{2,3}[-])?([2-9][0-9]{6,7})+([-][0-9]{1,4})?$/
    if (!re.test(str)) return true
  }

  // 邮箱是否正确---'邮箱不正确'返回true
  static checkEmail(str = '') {
    const reg = new RegExp(
      '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
    )
    if (!reg.test(str)) return true
  }

  // 网站是否正确---'网站不正确'返回true
  static checkWeb(str = '') {
    const reg = new RegExp(
      '^([hH][tT]{2}[pP]://|[hH][tT]{2}[pP][sS]://|www.)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$'
    )
    if (!reg.test(str)) return true
  }

  // 只能输入浮点数并保存小数
  static checkFloatNumber(floatNum, point) {
    // 清除'数字'和'.'以外的字符
    let newNum = floatNum.replace(/[^\d.]/g, '')
    // 验证第一个字符是数字而不是.
    newNum = newNum.replace(/^\./g, '')
    // 只保留第一个. 清除多余的'.'
    newNum = newNum.replace(/\.{2,}/g, '.')
    newNum = newNum
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // 保留n位小数
    if (newNum.includes('.')) {
      return (
        floatNum != newNum.substring(0, newNum.indexOf('.') + Number(point) + 1)
      )
    }
    return floatNum != newNum
  }

  // 是否为JSON格式----'是JSON'返回true
  static checkJSON(str) {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  // 身份证是否正确---'身份证不正确'返回true
  static checkIDcard(card = '') {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!reg.test(card)) return true
    // 身份证生日是否合法 ---转换成日期，如果能转换为日期并且'日'相同，生日合法
    if (
      // eslint-disable-next-line no-undef
      new Date(birthday).getDate() != birthday.substring(birthday.length - 2)
    ) {
      return true
    }
  }

  // 获取身份证中的生日---传入通过验证的身份证号
  static getBirthday(card) {
    // 15位的身份证需要加一个'19'
    const birthday =
      card.length == 18 ? card.substr(6, 8) : '19' + card.substr(6, 6)
    // 返回格式'yyyy-mm-dd'
    return birthday.replace(/(.{4})(.{2})/, '$1-$2-')
  }

  // 获取文件类型
  static getType(name) {
    if (this.checkEmpty(name)) return ''
    let type = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    if (type == 'docx') type = 'doc'
    if (type == 'xlsx') type = 'xls'
    if (type == 'rar') type = 'zip'
    if (type == 'jpg' || type == 'png' || type == 'jpeg') type = 'image'
    return type
  }

  // -----------------------------------验证类型---------------------------------------
  // 验证是否为数组
  static isArray(obj) {
    return Object.prototype.toString.call(obj).includes('Array')
  }

  // 验证是否为对象
  static isObject(obj) {
    return Object.prototype.toString.call(obj).includes('Object')
  }

  // -----------------------------------数据转换---------------------------------------
  /**
   * 文件大小转 K M
   * @param {Number} *文件大小 必填
   * @return {String} 返回 '30M'/'125K'/'246B'
   *
   */
  static toSize(size = 0) {
    const NUM = 1024
    if (this.checkEmpty(size)) return ''
    if (size < NUM) return size + 'B'
    if (size < Math.pow(NUM, 2)) return (size / NUM).toFixed(2) + 'K'
    if (size < Math.pow(NUM, 3)) {
      return (size / Math.pow(NUM, 2)).toFixed(2) + 'M'
    }
  }

  /**
   * 字符串截取多少位后+...
   * @param {String} *str待截取文字 必填
   * @param {Number} *num截取数量 必填
   * @return {String} 返回 '我是一段文字...'
   *
   */
  static toWord(str = '', num = '') {
    if (this.checkEmpty(str) || this.checkEmpty(num)) return ''
    return str.length > num ? str.substr(0, num) + '...' : str
  }

  /**
   * 数字转金额(加千分符)
   * @param {Number|String} *num数字 必填
   * @return {String} 默认返回 '3,000.12'
   *
   */
  static toMoney(num = 0) {
    num = (num * 1).toFixed(2) || 0
    // 先提取整数部分
    return num.toString().replace(/\d+/, function (n) {
      // 对整数部分添加分隔符
      return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return $1 + ','
      })
    })
  }

  /**
   * 金额转成大写
   * @param {Number|String} *num数字 必填
   * @return {String} 默认返回 '叁千元整'
   *
   */
  static toCN(num = 0) {
    if (num == 0) return ''
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(num)) return '数据非法'
    var unit = '千百拾亿千百拾万千百拾元角分'
    var str = ''
    num += '00'
    var p = num.indexOf('.')
    if (p >= 0) num = num.substring(0, p) + num.substr(p + 1, 2)
    unit = unit.substr(unit.length - num.length)
    for (var i = 0; i < num.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(num.charAt(i)) + unit.charAt(i)
    }
    return str
      .replace(/零(千|百|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整')
  }

  /**
   * 拼接url
   * @param {String} *url 当前url 必填
   * @return {Object} 需要拼接的data 默认为{}
   *
   */
  static toUrl(url, data = {}) {
    // 拼接页面参数
    if (Object.keys(data).length != 0) {
      url += '?'
      for (const key in data) {
        url += `${key}=${data[key]}&`
      }
      url = url.substr(0, url.length - 1)
    }
    return url
  }

  /**
   * 数字 + 0
   * @param {Number|String} *num数字 必填
   * @param {Number} n添加位数 默认为2位---'02'
   * @return {String} 默认返回 '02'/'10'
   *
   */
  static add0(num = 0, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
    // es6 padStart
    // return num.toString().padStart(n,'0');
  }

  /**
   * 时间戳转日期
   * @param {Number} *timestamp时间戳 必填
   * @param {String} symbol日期分隔符 默认为'-'
   * @return {String} 默认返回'yyyy-mm-dd'格式
   *
   */
  static dateChange(timestamp = '', symbol = '-') {
    if (!timestamp) return ''
    const oDate = new Date(timestamp)
    const year = oDate.getFullYear()
    const month = this.add0(oDate.getMonth() + 1)
    const day = this.add0(oDate.getDate())
    return year + symbol + month + symbol + day
  }

  /**
   * 地区码表转中文
   * @param {String|Number} *code地区码 必填
   * @param {Number} num层级 默认3层 （省 市 区）
   *
   */
  static areaChange(code, num = 3) {
    const areaJson = this.returnCode('areaJson')
    if (!code || (num != 1 && num != 2 && num != 3)) return '中国'
    // 省市区中文
    let province, city, area
    // 市区数组
    let cityArr = []
    let areaArr = []
    // 循环查找 省
    for (const val of areaJson) {
      if (code.substr(0, 2) + '0000' == val.areaCode) {
        cityArr = val.children
        province = val.areaName
        break
      }
    }
    if (num == 1) return province
    const cityCode = code.substr(0, 4) + '00'
    const specialCityCode = code.substr(0, 4) + 'XX'
    // 循环查找 市
    for (const val of cityArr) {
      if (val.areaCode == cityCode || val.areaCode == specialCityCode) {
        areaArr = val.children
        city = val.areaName == '市辖区' ? '' : val.areaName
        break
      }
    }
    if (num == 2) return province + city
    // 循环查找 区
    for (const val of areaArr) {
      if (code == val.areaCode) {
        area = val.areaName
        return province + '/' + city + (city ? '/' : '') + area
      }
    }
  }

  /**
   * 码表code转中文
   * @param {String} *code码 必填
   * @param {String} *key码表的key 必填
   * @param {String} jsonName码表的种类(codeJson/postJson) 默认为codeJson
   * @return {String} 返回值 如果有值返回码表中文/'未找到' 没有对应码表就报错
   *
   */
  static codeChange(code, key, jsonName = 'codeJson') {
    if (this.checkEmpty(code) || this.checkEmpty(key)) return ''
    const codeList = this.returnCode(jsonName)[key]
    // 循环查找码表的中文
    if (!this.checkEmpty(codeList)) {
      for (const val of codeList) {
        if (val.value == code) return val.label
      }
      return '未找到'
    }
    Vue.prototype.$message.error(`码表${key}出错了`)
  }

  /**
   * 获取指定码表---基本选择框组件用
   * @param {String} *jsonNamejsonName码表的种类(codeJson/postJson) 必填
   * @param {String} key码表的key 不传就返回整个码表
   * @return {String} 返回值 返回指定码表
   *
   */
  static getCode(jsonName, key = '') {
    if (this.checkEmpty(jsonName)) return []
    if (this.checkEmpty(key)) return this.returnCode(jsonName)
    const codeList = this.returnCode(jsonName)[key]
    if (!this.checkEmpty(codeList)) return codeList
    Vue.prototype.$message.error(`码表${key}出错了`)
    return []
  }

  /**
   * 获取本地缓存的码表
   *
   */
  static returnCode(jsonName) {
    const codeJson = this.getStorage(jsonName) || {}
    // 没有缓存就重新登录
    if (this.checkEmpty(codeJson)) {
      this.goIndex()
    }
    return codeJson
  }

  /**
   * 跳转到index页
   *
   */
  static goIndex() {
    router.push({ name: global.INDEX_PAGE })
  }

  /**
   * 跳转到login页
   *
   */
  static goLogin() {
    router.push({ name: global.LOGIN_PAGE })
  }

  /**
   * 确认弹框
   * @param {String} *msg 确认信息 必填
   * @param {Function} *cb 确认成功的回调 必填
   *
   */
  static confirm(msg, cb) {
    Vue.prototype
      .$confirm(msg, global.PRODUCT, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        cb()
      })
      .catch(() => {})
  }

  /**
   * 资源列表 '一维列表' 转 '树'
   * @param {Array} *list 一维列表 必填
   * @return {Array} 整理好的资源树
   *
   */
  static resourceChange(list, id, pid) {
    const resourceTree = []
    if (!this.isArray(list) || !id || !pid) return resourceTree
    const map = {}
    const newList = this.cloneObj(list)
    newList.forEach(item => {
      map[item[id]] = item
    })
    newList.forEach(item => {
      const parent = map[item[pid]]
      if (!parent) {
        resourceTree.push(item)
      } else {
        if (!parent.children) parent.children = []
        parent.children.push(item)
      }
    })
    return resourceTree
  }
}
/**
 * 函数防抖--在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * 用途---resize调整屏幕、滚动条、input模糊搜索等
 * @example window.onresize = debounce(this.getHeight， 300);
 * @param {Function} *func 待执行函数，必填
 * @param {Number} wait 等待时间，默认200ms
 *
 */
export function debounce(func, wait = 200) {
  let timer
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, wait)
  }
}
/**
 * 函数节流--规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 * 用途---表单btn mousedown等
 * @param {Function} *func 待执行函数，必填
 * @param {Number} wait 等待时间，默认200ms
 *
 */
export function throttle(func, wait = 200) {
  let time = 0
  return function () {
    const now = new Date().getTime()
    if (now - time > wait) {
      func.apply(this, arguments)
      time = now
    }
  }
}
