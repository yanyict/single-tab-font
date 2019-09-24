export const BASE_URL = process.env.API_ROOT + '/base/api' // 基础请求
export const BASE_URL2 = process.env.API_ROOT + '/base' // 基础请求
// export const BASE_URL = 'http://172.16.0.27:8080/attendance/api' // 基础请求
export const ERR_OK = 200 // 请求成功
export const ERR_USER_TOKEN = 300 // token失效

// 制度类型：regulation_type；
// 项目阶段：project_stage；
// 项目类型：project_type；
// 系统类型：project_system_type；
// 知识库分类：repository_type；
// 问题类型：problem_type；
// 故障级别：problem_level；
// 设备：equipment；
// 设备-软件：equipment_software；
// 设备-硬件：equipment_hardware；
// 设备-数据：equipment_data；
// 等保指标：target；
// 等保指标版本：target_version；
// 培训类型：train_type；
// 安全检查类型：security_check_type；
// 负责人：user
export const REGULATION_TYPE = 'regulation_type' // 制度类型

export const PROJECT_STAGE = 'project_stage' // 项目阶段

export const PROJECT_TYPE = 'project_type' // 项目类型

export const PROJECT_SYSTEM_TYPE = 'project_system_type' // 系统类型

export const PROJECT_INVITE_PURCHASE_TYPE = 'project_invite_purchase_type' // 项目-采购方式

export const REPOSITORY_TYPE = 'repository_type' // 知识库分类

export const PROBLEM_TYPE = 'problem_type' // 问题类型

export const PROBLEM_LEVEL = 'problem_level' // 故障级别

export const EQUIPMENT = 'equipment' // 设备

export const EQUIPMENT_SOFTWARE = 'equipment_software' // 设备-软件

export const EQUIPMENT_HARDWARE = 'equipment_hardware' // 设备-硬件

export const EQUIPMENT_DATA = 'equipment_data' // 设备-数据

export const TARGET = 'target' // 等保指标

export const QUOTA_VERSION = 'quota_version' // 等保指标版本

export const TRAIN_TYPE = 'train_type' // 培训类型

export const SECURITY_CHECK_TYPE = 'security_check_type' // 安全检查类型

export const EQUIPMENT_SOFTWARE_BUSINESS = 'equipment_software_business' // 安全检查类型

export const DATA_PERMISSION_MODULE = 'data_permission_module' // 安全检查类型

export const USER = 'user' // 负责人

export const DAILY_SEND_TYPE = 'daily_send_type'
