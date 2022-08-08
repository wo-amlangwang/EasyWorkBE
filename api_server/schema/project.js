// 导入定义验证规则的包
const joi = require('@hapi/joi')

// 定义项目名的验证规则
const name = joi.string().min(1).max(10).required()

// 定义 id, details的验证规则
const id = joi.number().integer().min(1).required()
const details = joi.string().required()


// 定义验证创建项目数据的规则对象
exports.create_schema = {
    body: {
        project_name: name,
        project_details: details
    },
}

// 定义添加成员数据的规则对象
exports.addmember_schema = {
    body: {
        project_name: name,
        mid: id,
        pid: id
    },
}

// 验证规则对象 - 删除项目
exports.delete_project_schema = {
    body: {
        id: id
    },
}

// 验证规则对象 - 查询项目
exports.get_project_schema = {
    body: {
        id: id
    },
}

// 验证规则对象 - 更新项目
exports.update_project_schema = {
    body: {
        id: id,
        project_name: name,
        project_details: details
    },
}
