import axios from './request'
import {
  BASE_URL
} from './config'

/* 用户管理模块接口 */
export const reqGetFunPeofession = params => { // 获取用户特有的功能
  return axios.post(`${BASE_URL}/auth/getFuncs.jhtml?page=` + params).then(res => res.data)
}

/* 用户管理模块接口 */
export const reqUserList = params => { // 获取用户列表
  return axios.post(`${BASE_URL}/user/list.jhtml`, params).then(res => res.data)
}
export const reqAddUser = params => { // 新增角色
  return axios.post(`${BASE_URL}/user/create.jhtml`, params).then(res => res.data)
}
export const reqDelUser = params => { // 删除角色
  return axios.post(`${BASE_URL}/user/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateUser = params => { // 更新角色
  return axios.post(`${BASE_URL}/user/update.jhtml`, params).then(res => res.data)
}
export const reqGetRoleListAll = params => { // 获取角色菜单
  return axios.post(`${BASE_URL}/role/listAll.jhtml`, params).then(res => res.data)
}
export const reqRestPass = params => { // 重置密码
  return axios.post(`${BASE_URL}/user/resetPasswordOthers.jhtml`, params).then(res => res.data)
}
export const reqChangeStatus = params => { // 改变账号状态
  return axios.post(`${BASE_URL}/user/changeStatus.jhtml?` + params).then(res => res.data)
}

/* 部门模块接口 */
export const reqDeptRootTree = params => { // 获取部门前两层树
  return axios.post(`${BASE_URL}/dept/getDeptTree.jhtml`, params).then(res => res.data)
}
export const reqDeptChildrenTree = params => { // 通过根节点获取其节点下得所有子节点
  return axios.post(`${BASE_URL}/dept/getDpChildreTree.jhtml?id=` + params).then(res => res.data)
}
export const reqDeptParentByLev = params => { // 根据级别获取该级别的所有节点
  return axios.post(`${BASE_URL}/dept/getParentTree.jhtml?lev=` + params).then(res => res.data)
}
export const reqAddNodeTree = params => { // 新增树
  return axios.post(`${BASE_URL}/dept/create.jhtml?` + params).then(res => res.data)
}
export const reqCheckTreeName = params => { // 检查新增节点名称是否重复
  return axios.post(`${BASE_URL}/dept/checkSameNode.jhtml?`, params).then(res => res.data)
}
export const reqDelteNode = params => { // 删除节点
  return axios.post(`${BASE_URL}/dept/delete.jhtml?id=` + params).then(res => res.data)
}
export const reqReNameDept = params => { // 部门重命名
  return axios.post(`${BASE_URL}/dept/rename.jhtml?` + params).then(res => res.data)
}
export const reqNodeMove = params => { // 节点移动、
  return axios.post(`${BASE_URL}/dept/move.jhtml?` + params).then(res => res.data)
}
export const reqFilterListDeptByName = params => { // 部门模糊查询
  return axios.post(`${BASE_URL}/dept/listDeptFilterName.jhtml?deptName=` + params).then(res => res.data)
}
export const reqGetTree = params => { // 获取整个树
  return axios.post(`${BASE_URL}/dept/getCacheTree.jhtml`).then(res => res.data)
}

/* 角色管理模块接口 */
export const reqRoleList = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/role/list.jhtml`, params).then(res => res.data)
}
export const reqAddRole = params => { // 新增角色
  return axios.post(`${BASE_URL}/role/create.jhtml`, params).then(res => res.data)
}
export const reqDelRole = params => { // 删除角色
  return axios.post(`${BASE_URL}/role/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateRole = params => { // 更新角色
  return axios.post(`${BASE_URL}/role/update.jhtml`, params).then(res => res.data)
}
export const reqAuthPermission = params => { // 获取角色权限
  return axios.post(`${BASE_URL}/auth/get.jhtml`, params).then(res => res.data)
}
export const reqAuthPermissionSave = params => { // 保存角色权限
  return axios.post(`${BASE_URL}/auth/save.jhtml`, params).then(res => res.data)
}

/* 菜单管理模块接口 */
export const reqMenuList = params => { // 获取菜单列表
  return axios.post(`${BASE_URL}/menu/list.jhtml`, params).then(res => res.data)
}
export const reqAddMenu = params => { // 新增菜单
  return axios.post(`${BASE_URL}/menu/create.jhtml`, params).then(res => res.data)
}
export const reqDelMenu = params => { // 删除菜单
  return axios.post(`${BASE_URL}/menu/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateMenu = params => { // 更新菜单
  return axios.post(`${BASE_URL}/menu/update.jhtml`, params).then(res => res.data)
}

/* RUL管理模块接口 */
export const reqUrlList = params => { // 获取URL列表
  return axios.post(`${BASE_URL}/url/list.jhtml`, params).then(res => res.data)
}
export const reqUrlListAll = params => { // 获取所有URL列表
  return axios.post(`${BASE_URL}/url/listAll.jhtml`, params).then(res => res.data)
}
export const reqAddUrl = params => { // 新增URL
  return axios.post(`${BASE_URL}/url/create.jhtml`, params).then(res => res.data)
}
export const reqDelUrl = params => { // 删除URL
  return axios.post(`${BASE_URL}/url/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateUrl = params => { // 更新URL
  return axios.post(`${BASE_URL}/url/update.jhtml`, params).then(res => res.data)
}

/* 功能管理模块接口 */
export const reqFuncList = params => { // 获取功能列表
  return axios.post(`${BASE_URL}/func/list.jhtml`, params).then(res => res.data)
}
export const reqFuncListAll = params => { // 获取所有功能列表
  return axios.post(`${BASE_URL}/func/listAll.jhtml`, params).then(res => res.data)
}
export const reqAddFunc = params => { // 新增功能
  return axios.post(`${BASE_URL}/func/create.jhtml`, params).then(res => res.data)
}
export const reqDelFunc = params => { // 删除功能
  return axios.post(`${BASE_URL}/func/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateFunc = params => { // 更新功能
  return axios.post(`${BASE_URL}/func/update.jhtml`, params).then(res => res.data)
}

/* 菜单管理模块接口 */
export const reqBaseMenuList = params => { // 菜单管理接口V2 / 菜单列表
  return axios.post(`${BASE_URL}/base/menu/list.jhtml`, params).then(res => res.data)
}
export const reqAddBaseMenu = params => { // 菜单管理接口V2 / 新增菜单
  return axios.post(`${BASE_URL}/base/menu/create.jhtml`, params).then(res => res.data)
}
export const reqDelBaseMenu = params => { // 菜单管理接口V2 / 删除菜单
  return axios.post(`${BASE_URL}/base/menu/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateBaseMenu = params => { // 菜单管理接口V2 / 更新菜单
  return axios.post(`${BASE_URL}/base/menu/update.jhtml`, params).then(res => res.data)
}
export const reqBaseFuncList = params => { // 功能管理模块V2 / 功能列表
  return axios.post(`${BASE_URL}/base/func/list.jhtml`, params).then(res => res.data)
}
export const reqAddBaseFunc = params => { // 功能管理模块V2 / 创建功能
  return axios.post(`${BASE_URL}/base/func/create.jhtml`, params).then(res => res.data)
}
export const reqDelBaseFunc = params => { // 功能管理模块V2 / 删除功能
  return axios.post(`${BASE_URL}/base/func/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateBaseFunc = params => { // 功能管理模块V2 / 编辑功能
  return axios.post(`${BASE_URL}/base/func/update.jhtml`, params).then(res => res.data)
}
export const reqCopyBaseFunc = params => { // 功能管理模块V2 / 复制功能
  return axios.post(`${BASE_URL}/base/func/copy.jhtml`, params).then(res => res.data)
}
export const reqGetInterfaceList = params => { // 功能管理模块V2 / 编辑功能时获取接口列表
  return axios.post(`${BASE_URL}/base/func/getInterfaceList.jhtml`, params).then(res => res.data)
}

/* 接口管理模块接口 */
export const reqInterfaceTree = params => { // 接口管理模块V2 / 获取接口树
  return axios.post(`${BASE_URL}/base/interface/getInterfaceTree.jhtml`, params).then(res => res.data)
}
export const reqInterfaceList = params => { // 接口管理模块V2 / 关键字搜索列表接口
  return axios.post(`${BASE_URL}/base/interface/list.jhtml`, params).then(res => res.data)
}
export const reqAddInterface = params => { // 接口管理模块V2 / 新增接口
  return axios.post(`${BASE_URL}/base/interface/create.jhtml`, params).then(res => res.data)
}
export const reqDelInterface = params => { // 接口管理模块V2 / 删除接口
  return axios.post(`${BASE_URL}/base/interface/delete.jhtml`, params).then(res => res.data)
}
export const reqUpdateInterface = params => { // 接口管理模块V2 / 修改接口
  return axios.post(`${BASE_URL}/base/interface/update.jhtml`, params).then(res => res.data)
}
export const reqRenameInterface = params => { // 接口管理模块V2 / 接口重命名
  return axios.post(`${BASE_URL}/base/interface/rename.jhtml`, params).then(res => res.data)
}

/* 新角色权限管理模块接口 */
export const reqAuthBaseSave = params => { // 角色管理 / 保存角色权限
  return axios.post(`${BASE_URL}/auth/baseSave.jhtml`, params).then(res => res.data)
}
export const reqAuthGetBaseMenus = params => { // 角色管理 / 获取用户的菜单权限
  return axios.post(`${BASE_URL}/auth/getBaseMenus.jhtml`, params).then(res => res.data)
}
export const reqAuthUser = params => { // 获取当前用户的所有权限
  return axios.post(`${BASE_URL}/auth/getUserAuth.jhtml`, params).then(res => res.data)
}
export const reqAuthGetBaseFuncs = params => { // 角色管理 / 获取某个菜单对应的所有功能
  return axios.post(`${BASE_URL}/auth/getBaseFuncs.jhtml`, params).then(res => res.data)
}

/* 数据字典 */
export const reqDictionaryList = params => { // 获取数据字典(非系统内置)
  return axios.get(`${BASE_URL}/dictionary/listWithChildren.jhtml`, params).then(res => res.data)
}
export const reqDictionaryListTag = params => { // 获取数据字典
  return axios.post(`${BASE_URL}/dictionary/listByTag.jhtml?` + params).then(res => res.data)
}
export const reqDictionarySave = params => { // 新增数据字典
  return axios.post(`${BASE_URL}/dictionary/save.jhtml`, params).then(res => res.data)
}
export const reqDictionarysaveChildren = params => { // 新增字类型
  return axios.post(`${BASE_URL}/dictionary/children/save.jhtml`, params).then(res => res.data)
}
export const reqDictionaryUpdate = params => { // 修改数据字典
  return axios.post(`${BASE_URL}/dictionary/update.jhtml`, params).then(res => res.data)
}
export const reqBatchRemove = params => { // 删除数据字典
  return axios.delete(`${BASE_URL}/dictionary/batchRemove.jhtml`, {data: params}).then(res => res.data)
}
export const reqSaveChildren = params => { // 新增子节点
  return axios.post(`${BASE_URL}/dictionary/saveChildren.jhtml`, params).then(res => res.data)
}
export const reqUpdateChildren = params => { // 修改子节点
  return axios.post(`${BASE_URL}/dictionary/updateChildren.jhtml`, params).then(res => res.data)
}

/* 数据权限 */
export const reqModuleList = params => { // 模块列表
  return axios.get(`${BASE_URL}/dataPermission/module/list.jhtml`, params).then(res => res.data)
}
export const reqModuleSave = params => { // 模块新增
  return axios.post(`${BASE_URL}/dataPermission/module/save.jhtml`, params).then(res => res.data)
}
export const reqModuleUpdate = params => { // 模块修改
  return axios.post(`${BASE_URL}/dataPermission/module/update.jhtml`, params).then(res => res.data)
}
export const reqModuleDelete = params => { // 模块删除
  return axios.post(`${BASE_URL}/dataPermission/module/batchRemove.jhtml`, params).then(res => res.data)
}
export const reqModuleType = params => { // 模块权限类型
  return axios.post(`${BASE_URL}/dataPermission/module/updatePermissionType.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionList = params => { // 分页获取数据权限共享列表
  return axios.post(`${BASE_URL}/dataPermission/share/list.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionSave = params => { // 新增数据权限共享
  return axios.post(`${BASE_URL}/dataPermission/share/save.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionUpdate = params => { // 修改数据权限共享
  return axios.post(`${BASE_URL}/dataPermission/share/update.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionBatchRemove = params => { // 删除数据权限共享
  return axios.post(`${BASE_URL}/dataPermission/share/batchRemove.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionChangeStatus = params => { // 修改状态
  return axios.post(`${BASE_URL}/dataPermission/share/updateStatus.jhtml`, params).then(res => res.data)
}
export const reqDataPermissionUser = params => { // 获取共享来源/目标的用户列表
  return axios.get(`${BASE_URL}/dataPermission/share/listUser.jhtml`, params).then(res => res.data)
}

/* 文档管理模块接口 */
export const documentList = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/document/list.jhtml`, params).then(res => res.data)
}
export const documentSave = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/document/save.jhtml`, params).then(res => res.data)
}
export const documentOutStore = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/document/outStore.jhtml`, params).then(res => res.data)
}
export const documentLend = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/document/documentLend.jhtml`, params).then(res => res.data)
}
export const documentReturn = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/document/documentReturn.jhtml`, params).then(res => res.data)
}
export const lendRecordList = params => { // 获取角色列表
  return axios.post(`${BASE_URL}/lendReocrd/list.jhtml`, params).then(res => res.data)
}
