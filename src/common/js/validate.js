/* eslint-disable */
// 字母，数字，字符组合验证正则
const passwordRegexp = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,30}$/
// 字母，数字或字母数字组合正则
const numOrAlphaRegexp = /^[0-9a-zA-Z]*$/
// 纯数字正则
const numberRegexp = /^[0-9]*[0-9][0-9]*$/
// 端口验证
const portRegexp = /^\d+$/
// 手机号码正则
const phoneRegexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
// ip地址正则
const ipRegexp = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/
// 图片正则
const isInteger = /(^[1-9]\d*$)/

export const isPhotoRegexp = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/

export const ispasswordRegexp = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,30}$/
// 密码验证
export const passwordValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  console.log(value.length)
  if (!(value.length >= 8 && value.length < 30)) {
    return callback(new Error('密码长度需要8-30个字符'))
  }
  if (!passwordRegexp.test(value)) {
    return callback(new Error('密码须由数字、字母、字符密码组合'))
  }
  callback()
}
// 菜单序号验证
export const SerialValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('序号不能为空'))
  }
  // console.log(value.length)
  // if (!(value.length >= 8 && value.length < 30)) {
  //   return callback(new Error('密码长度需要8-30个字符'))
  // }
  if (!isInteger.test(value)) {
    return callback(new Error('序号只能输入正整数 不包括负整数和零'))
  }
  callback()
}
// 教师工号验证
export const teacherWorkNoValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('教师工号不能为空'))
  }
  if (value.length >= 10) {
    return callback(new Error('教师工号长度在20个字符内'))
  }
  if (!numOrAlphaRegexp.test(value)) {
    return callback(new Error('教师工号必须是字母或数字'))
  }
  callback()
}

// 课程号验证
export const numberValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!numberRegexp.test(value)) {
    return callback(new Error('序号必须是纯数字'))
  }
  if (value.length >= 5) {
    return callback(new Error('序号长度在5以内'))
  }
  callback()
}
// 端口号验证
export const portValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!portRegexp.test(value)) {
    return callback(new Error('端口必须是纯数字'))
  }
  if (value.length >= 5) {
    return callback(new Error('端口长度在5以内'))
  }
  callback()
}
// 学号验证
export const costNoValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!numberRegexp.test(value)) {
    return callback(new Error('金额必须是纯数字'))
  }
  if (value.length >= 20) {
    return callback(new Error('金额长度在10以内'))
  }
  callback()
}
// 教育培训人数验证
export const peopleValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!numberRegexp.test(value)) {
    return callback(new Error('培训人数必须纯数字'))
  }
  if (value.length >= 20) {
    return callback(new Error('人数长度在10以内'))
  }
  callback()
}
// 手机号码验证
export const phoneValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  }
  if (!phoneRegexp.test(value)) {
    return callback(new Error('手机号有误'))
  }
  callback()
}

// ip地址验证
export const ipValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('源地址不能为空'))
  }
  if (!ipRegexp.test(value)) {
    return callback(new Error('源地址有误'))
  }
  callback()
}

// 排序验证
export const orderNumValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('序号不能为空'))
  }
  
  if (!numberRegexp.test(value)) {
    return callback(new Error('序号必须是正整数'))
  }
  callback()
}