import axios from './request'
import {
  BASE_URL
} from './config'

// 登录
export const reqLogin = params => {
  return axios.post(`${BASE_URL}/user/login.jhtml`, params).then(res => res.data)
}
// 修改密码
export const reqUpdatePass = params => {
  return axios.post(`${BASE_URL}/user/updatePass.jhtml`, params).then(res => res.data)
}
// 获取用户菜单
export const reqGetMenus = () => {
  return axios.post(`${BASE_URL}/auth/getMenus.jhtml`).then(res => res.data)
}
// 获取用户菜单
export const reqGetBaseMenus = () => {
  return axios.post(`${BASE_URL}/auth/getBaseMenus.jhtml`).then(res => res.data)
}
// 获取某个菜单对应的所有功能
export const reqGetBaseFuncs = params => {
  return axios.post(`${BASE_URL}/auth/getBaseFuncs.jhtml`, params).then(res => res.data)
}
