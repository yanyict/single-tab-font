import { getCacheFuncList } from './cache'
import { isPhotoRegexp } from './validate'

/**
 * 请求用户权限函数
 *
 * @export
 * @param {*} funRuleData 用户权限数组
 * @param {*} tag 用户权限某权限字段
 * @returns
 */
export function hasPermission (funRuleData, tag) {
  let isShow = false
  for (let index = 0; index < funRuleData.length; index++) {
    if (funRuleData[index].tag === tag) {
      isShow = true
      break
    }
  }
  return isShow
}

export function isHasPermission (tag) {
  let isShow = false
  let funcsData = getCacheFuncList()
  for (let index = 0; index < funcsData.length; index++) {
    if (funcsData[index].tag === tag) {
      isShow = true
      break
    }
  }
  return isShow
}

/**
 * 时间戳转时间显示
 *
 * @export
 * @param {*} date 时间戳
 * @param {*} fmt 转换时间格式
 * @returns
 */
export function formatDate (date, fmt) { // 时间转化
  if (!date) return ''
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 转成标准时间
 *
 * @export
 * @param {*} data 时间
 * @returns
 */
export function parseDate (data) {
  if (!data) return ''
  var t = Date.parse(data.toString())
  if (!isNaN(t)) {
    return new Date(Date.parse(data.toString().replace(/-/g, '/')))
  } else {
    return '' // 无则返回null
  }
}

/**
 * 查找数组中某个元素坐在位置
 * @param {*} list 数组
 * @param {*} id 某元素id
 */
export function findIndex (list, id) {
  return list.findIndex(item => {
    return item === id
  })
}

/**
 * 百分比
 * @param {*} num 所占数
 * @param {*} total 总数
 */
export function getPercent (num, total) {
  if (!num || !total) {
    return 0
  }
  let result = (num / total * 100).toFixed(2)
  return parseFloat(result)
}

/**
 * 百分比
 * @param {*} num 所占数
 * @param {*} total 总数
 */
export function getNumDecimal (total) {
  if (!total) {
    return 0
  }
  let result = (total * 100).toFixed(2)
  return parseFloat(result)
}

/** 打乱数组 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
 * 随机打乱数组
 * @export
 * @param {*} arr 数组
 * @returns
 */
export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

const [TODAY, YESTERDAY, WEEK, MONTH, THREEMONTH, HALFYEAR, YEAR] = ['today', 'yesterday', 'week', 'month', 'threeMonth', 'halfYear', 'year']
export function transformDate (val) {
  let resultDate = ''
  switch (val) {
    case TODAY:
      resultDate = formatDate(new Date(), 'yyyy-MM-dd')
      break
    case YESTERDAY:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 1)), 'yyyy-MM-dd')
      break
    case WEEK:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 7)), 'yyyy-MM-dd')
      break
    case MONTH:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 30)), 'yyyy-MM-dd')
      break
    case THREEMONTH:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 90)), 'yyyy-MM-dd')
      break
    case HALFYEAR:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 180)), 'yyyy-MM-dd')
      break
    case YEAR:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 365)), 'yyyy-MM-dd')
      break
    default:
      resultDate = formatDate(new Date(), 'yyyy-MM-dd')
  }
  return resultDate
}
/**
 * 封装下载txt
 */
function openDownloadDialog (url, saveName) {
  fetch(url).then(res => res.blob().then(blob => {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    const filename = saveName
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }))
}
/**
 * 附件下载
 *
 * @export
 * @param {*} url 附件地址
 * @param {string} [name='attachment'] 附件名称，默认名称 attachment
 */
export function downlaodAttachment (url, name = 'attachment') {
  const index = url.lastIndexOf('.')
  const fileType = url.substr(index + 1)
  if (isPhotoRegexp.test(url)) {
    downloadIamge(url, name)
  } else if (fileType === 'txt') { // 判断是否是txt
    openDownloadDialog(url, name)
  } else {
    window.open(url, '_self')
  }
}

function downloadIamge (imgSrc, name) {
  let image = new Image()
  image.setAttribute('crossOrigin', 'anonymous') // 解决跨域 Canvas 污染问题
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据

    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = name // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgSrc
}
