const utils = {
      // 判断是否为空
       checkEmpty(value) {
        // 数字0 返回false
        if (value === 0) return
        // 验证对象类型
        if (this.isObject(value)) return JSON.stringify(value) == '{}'
        // 验证数组类型
        if (this.isArray(value)) return value.length == 0
        // 验证字符串类型/null/undefined
        if (typeof value === 'string') value = value.trim()
        if (!value || value == 'null' || value == 'undefined') return true
      },
      // 验证是否为数组
       isArray(obj) {
        return Object.prototype.toString.call(obj).includes('Array')
      },
  
      // 验证是否为对象
       isObject(obj) {
        return Object.prototype.toString.call(obj).includes('Object')
      },
      // * 深度复制对象
       cloneObj(obj = {}, isDeep = false) {
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
      },
      // 一维数组转二维
       resourceChange(list, id, pid) {
        const resourceTree = []
        if (!this.isArray(list) || !id || !pid) return resourceTree
        const map = {}
        const newList = this.cloneObj(list)
        newList.forEach((item) => {
          map[item[id]] = item
        })
        newList.forEach((item) => {
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

export default utils