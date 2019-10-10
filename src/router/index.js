import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('views/Login') // 登录页
const Main = () => import('views/Home') // 父组件

/** 系统管理 */
const UserManager = () => import('views/systmagpager/UserManager') // 用户管理
const DepartmentManager = () => import('views/systmagpager/DepartmentManager') // 部门管理
const RoleManager = () => import('views/systmagpager/RoleManager') // 角色管理
const PermissionConfig = () => import('views/systmagpager/PermissionConfig') // 角色管理 / 权限管理
const RolePermission = () => import('views/systmagpager/RolePermission') // 角色管理 / 权限管理
const MenuManager = () => import('views/systmagpager/MenuManager') // 菜单管理
const UrlManager = () => import('views/systmagpager/UrlManager') // URL管理
const FunManager = () => import('views/systmagpager/FunManager') // 功能管理
const NewMenuManager = () => import('views/systmagpager/NewMenuManager') // 新菜单管理
const InterfaceManeger = () => import('views/systmagpager/InterfaceManager') // 接口管理
const DataDictionary = () => import('views/systmagpager/DataDictionary') // 接口管理
const DataPermission = () => import('views/systmagpager/DataPermission') // 数据权限
const DocumentStore = () => import('views/docmagpager/DocumentStore') // 档案管理
const DocumentLend = () => import('views/docmagpager/DocumentLend') // 文档借阅管理
const DocumentWarn = () => import('views/docmagpager/DocumentWarn') // 到期提醒
const DocumentType = () => import('views/docmagpager/DocumentType') // 档案类别
const LendRecord = () => import('views/docmagpager/LendRecord') // 文档记录管理

const Home = () => import('views/homepager/Home') // 父组件
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      isMenu: false
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      isNode: true,
      isMenu: true,
      icons: '',
      children: [
        {path: 'kq/home', meta: { name: '首页' }, component: DocumentLend},
        {path: 'sys/usermanager', meta: { name: '人员管理' }, component: UserManager},
        {path: 'sys/departmentmanager', meta: { name: '项目管理' }, component: DepartmentManager},
        {path: 'sys/rolemanager', meta: { name: '角色管理' }, component: RoleManager},
        {path: 'sys/datadictionary', meta: { name: '数据字典' }, component: DataDictionary},
        {path: 'sys/datapermission', meta: { name: '数据权限' }, component: DataPermission},
        {path: 'sys/rolemanager/permissionconfg', meta: { name: '权限配置' }, component: PermissionConfig},
        {path: 'sys/rolemanager/rolepermission', meta: { name: '权限配置' }, component: RolePermission},
        {path: 'sys/menumanager', meta: { name: '菜单管理' }, component: MenuManager},
        {path: 'sys/urlmanager', meta: { name: 'URL管理' }, component: UrlManager},
        {path: 'sys/funmanager', meta: { name: '功能管理' }, component: FunManager},
        {path: 'sys/newmenumanager', meta: { name: '菜单管理' }, component: NewMenuManager},
        {path: 'sys/interfacemanager', meta: { name: '接口管理' }, component: InterfaceManeger},
        {path: 'document/documentstore', meta: { name: '档案管理' }, component: DocumentStore},
        {path: 'document/documentlend', meta: { name: '文档借阅管理' }, component: DocumentLend},
        {path: 'document/documentwarn', meta: { name: '到期提醒' }, component: DocumentWarn},
        {path: 'document/documenttype', meta: { name: '数据字典' }, component: DocumentType},
        {path: 'document/lendrecord', meta: { name: '文档记录管理' }, component: LendRecord},
        // {path: 'kq/safetymanagemer', meta: { name: '安全管理' }, component: SafeManeger},
      ]
    }
  ]
})
