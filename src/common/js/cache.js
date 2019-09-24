// 用户菜单拥有的功能权限
export const saveCacheFuncList = list => {
  sessionStorage.setItem('funcs', JSON.stringify(list))
}
export const getCacheFuncList = () => {
  let list = JSON.parse(sessionStorage.getItem('funcs')) || []
  return list
}
// 储存当前编辑的列表对象
export const SAFE_OBJ_EDIT = 'safe_obj_eidt'
export const DAILY_OBJ_EDIT = 'daily_obj_eidt'
export const PROBLEM_OBJ_EIDT = 'problem_obj_eidt'
export const PROJECT_OBJ_EIDT = 'project_obj_eidt'
export const REPOSITORY_OBJ_EIDT = 'repository_obj_eidt'
export const INSTITUTION_OBJ_EIDT = 'institution_obj_eidt'
export const DEMAND_OBJ_EIDT = 'demand_obj_eidt'

// 储存当前模块页码
export const SAFE_PAGE = 'safe_page'
export const EDUCATION_PAGE = 'education_page'
export const PROBLEM_PAGE = 'problem_page'
export const PROJECT_PAGE = 'project_page'
export const REPOSITORY_PAGE = 'repository_page'
export const INSTITUTION_PAGE = 'institution_page'
export const DEMAND_PAGE = 'demand_page'

export const saveSessionCacheFun = (name, obj) => { // 存到seccessStorage
  sessionStorage.setItem(name, JSON.stringify(obj))
}

export const getSessionCacheFun = (name, nullType = {}) => { // 从seccessStorage中取值
  return JSON.parse(sessionStorage.getItem(name)) || nullType
}

// 存储当前页码
export const setCurPageData = (key, value = {}) => {
  if (typeof value === 'string') {
    sessionStorage.setItem(key, value)
  } else {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}
// 获取当前显示页数
export const getCurPageData = (key = {}) => {
  const str = sessionStorage.getItem(key)
  if (typeof str === 'string') {
    try {
      return JSON.parse(str)
    } catch (e) {
      return str
    }
  }
  return false
}
