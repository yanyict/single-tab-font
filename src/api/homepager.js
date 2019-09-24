import axios from './request'
import {
  BASE_URL
} from './config'

/* 首页模块 */
export const reqStats = params => { // 获取基本统计信息
  return axios.post(`${BASE_URL}/index/stats.jhtml`, params).then(res => res.data)
}
export const reqStatsProjectCost = params => { // 获取项目金额统计信息
  return axios.post(`${BASE_URL}/index/statsProjectCost.jhtml`, params).then(res => res.data)
}
export const reqStatsProblem = params => { // 获取系统未解决问题统计信息
  return axios.post(`${BASE_URL}/index/statsProblem.jhtml`, params).then(res => res.data)
}
export const reqStatsEquipment = params => { // 获取资产类型统计信息
  return axios.post(`${BASE_URL}/index/statsEquipment.jhtml?` + params).then(res => res.data)
}
