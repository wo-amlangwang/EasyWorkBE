const express = require('express')
const router = express.Router()

// 挂载路由

// 导入任务路由处理函数对应的模块
const task_handler = require('../router_handler/task')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { create_schema, delete_task_schema, type_task_schema, priority_task_schema, status_task_schema,
    updatetype_task_schema, comment_schema, updatepriority_task_schema, updatestatus_task_schema, get_task_schema, update_task_schema, time_line_task_schema } = require('../schema/task')

// 创建新任务的路由
router.post('/create', expressJoi(create_schema), task_handler.createTask)
// 删除任务的路由
router.post('/deletetask', expressJoi(delete_task_schema), task_handler.deleteTaskById)

// 获取单一项目任务列表 按类型查询
router.post('/tasktypelist/:type', expressJoi(type_task_schema), task_handler.getTaskListByType)
// 获取单一项目任务列表 按优先级查询
router.post('/taskprioritylist/:priority', expressJoi(priority_task_schema), task_handler.getTaskListByPriority)
// 获取单一项目任务列表 按玩程度查询
router.post('/taskstatuslist/:status', expressJoi(status_task_schema), task_handler.getTaskListByStatus)

// 拖动修改任务类型
router.post('/updatetasktype/:type', expressJoi(updatetype_task_schema), task_handler.updateTaskByType)
// 拖动修改任务优先级
router.post('/updatetaskpriority/:priority', expressJoi(updatepriority_task_schema), task_handler.updateTaskByPriority)
// 拖动修改任务完成度
router.post('/updatetaskstatus/:status', expressJoi(updatestatus_task_schema), task_handler.updateTaskByStatus)

// 根据 任务 id 查询任务基本信息的路由
router.post('/gettask', expressJoi(get_task_schema), task_handler.getTaskById)
// 根据 任务 id 修改任务基本信息的路由（创建人）
router.post('/updatetask', expressJoi(update_task_schema), task_handler.updateTaskById)

// 评论
router.post('/comment', expressJoi(comment_schema), task_handler.comment)
// 获取
router.get('/timeline/:id', expressJoi(time_line_task_schema), task_handler.time_line)
module.exports = router
