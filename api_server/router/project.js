const express = require('express')
const router = express.Router()

// 挂载路由

// 导入项目路由处理函数对应的模块
const project_handler = require('../router_handler/project')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { create_schema, addmember_schema, delete_project_schema, get_project_schema, update_project_schema } = require('../schema/project')

// 创建新项目的路由
router.post('/create', expressJoi(create_schema), project_handler.createProject)
// 获取项目列表数据的路由
router.get('/projectlist', project_handler.getProjectList)
// 添加项目成员的路由
router.post('/addmember', expressJoi(addmember_schema), project_handler.addMember)
// 根据 项目ID 删除项目的路由
router.post('/deleteproject', expressJoi(delete_project_schema), project_handler.deleteProjectById)
// 根据 项目ID 查询项目基本信息的路由
router.post('/getproject', expressJoi(get_project_schema), project_handler.getProjectById)
// 根据 项目ID 修改项目基本信息的路由
router.post('/updateproject', expressJoi(update_project_schema), project_handler.updateProjectById)

// 根据 项目名（唯一性）查询项目成员的路由
router.post('/projectmemberlist', expressJoi(get_project_schema), project_handler.getProjectMemberList)
// 根据 项目名（唯一性）查询项目任务的路由
router.post('/projecttasklist', expressJoi(get_project_schema), project_handler.getProjectTaskList)


module.exports = router
