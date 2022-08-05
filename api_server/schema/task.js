// 导入定义验证规则的包
const joi = require('@hapi/joi')
const moment = require('moment')

// 定义项目名的验证规则
const name = joi.string().alphanum().min(1).max(10).required()
// const name2 = joi.string().alphanum().max(1).required()

// 定义 id, details的验证规则
const id = joi.number().integer().min(1).required()
const type = joi.number().integer().min(0).max(3).required()
const priority = joi.number().integer().min(0).max(2).required()
const status = joi.number().integer().min(0).max(2).required()
const details = joi.string().required()
const comment = joi.string().required()

// 验证规则对象 - 创建任务目
exports.create_schema = {
    body: {
        task_name: name,
        task_details: details,
        project_name: name,
        type: type,
        priority: priority,
        deadline: details,
        assignee: name,
        // assignee: name2,
        task_comment: comment
    },
}

// 验证规则对象 - 删除任务
exports.delete_task_schema = {
    body: {
        project_name: name,
        id: id
    },
}

// 验证规则对象 - 单一项目列表(按类型)
exports.type_task_schema = {
    params: {
        type: type
    },
    body: {
        project_name: name,
    },
}

// 验证规则对象 - 单一项目列表(按优先级)
exports.priority_task_schema = {
    params: {
        priority: priority
    },
    body: {
        project_name: name,
    },
}

// 验证规则对象 - 单一项目列表(按完成度)
exports.status_task_schema = {
    params: {
        status: status
    },
    body: {
        project_name: name,
    },
}

// 验证规则对象 - 拖动修改任务类型
exports.updatetype_task_schema = {
    params: {
        type: type
    },
    body: {
        project_name: name,
        task_name: name
    },
}

// 验证规则对象 - 拖动修改任务优先级
exports.updatepriority_task_schema = {
    params: {
        priority: priority
    },
    body: {
        project_name: name,
        task_name: name
    },
}

// 验证规则对象 - 拖动修改任务完成度
exports.updatestatus_task_schema = {
    params: {
        status: status
    },
    body: {
        project_name: name,
        id: id
    },
}

// 验证规则对象 - 查询任务
exports.get_task_schema = {
    body: {
        id: id,
    },
}
// 验证规则对象 - 更新任务
exports.update_task_schema = {
    body: {
        id: id,
        task_name: name,
        task_details: details,
        project_name: name,
        type: type,
        priority: priority,
        deadline: details,
        assignee: name,
        status: status,
        task_comment: comment
    },
}
