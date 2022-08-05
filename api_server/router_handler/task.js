// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
const moment = require('moment')

// 注册新项目的处理函数
exports.createTask = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义 SQL 语句，查询任务名是否被占用
    const sqlStr = 'select * from task where task_name=? and project_name=?'
    db.query(sqlStr, [info.task_name, info.project_name], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断任务名是否被占用
        if (results.length > 0) {
            return res.cc('任务名被占用，请更换其他任务名！')
        }
        // 定义插入新任务的 SQL 语句
        const sql = 'insert into task set ?'
        var create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, {
            task_name: info.task_name, task_details: info.task_details, project_name: info.project_name,
            type: info.type, create_user: req.user.username, update_user: req.user.username, priority: info.priority,
            create_time: create_time, update_time: create_time, deadline: info.deadline, assignee: info.assignee,
            task_comment: info.task_comment
        }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('创建任务失败，请稍后再试！')
            // 创建任务成功
            res.cc('创建成功！', 0)
        })
    })
}

// 根据 任务名 删除任务的处理函数(仅任务创建人可删除)
exports.deleteTaskByName = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义标记删除的 SQL 语句
    const sql = 'select * from task where task_name=? and project_name=? and create_user=?'
    // 调用 db.query() 执行 SQL 语句 判断当前用户是否是任务创建人
    db.query(sql, [info.task_name, info.project_name, req.user.username], (err, results) => {
        if (err) return res.cc(err)
        // 判断查找行数是否为 1
        if (results.length !== 1) return res.cc('当前用户不是该用户创建人！')
        var update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // 定义标记删除的 SQL 语句
        const sql2 = `update task set deleted=1, update_user=?, update_time=? where task_name=? and project_name=? and create_user=?`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql2, [req.user.username, update_time, info.task_name, info.project_name, req.user.username], (err, results) => {
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('删除任务失败！')
            res.cc('删除任务成功！', 0)
        })
    })
}

// 获取单一项目任务列表的处理函数（按类型）
exports.getTaskListByType = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询单一项目列表数据的 SQL 语句
    const sql = `select * from task where project_name=? and deleted = 0 and type=? order by update_time desc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info.project_name, req.params.type], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取单一项目列表数据（按类型）成功！',
            data: results,
        })
    })
}

// 获取单一项目任务列表的处理函数（按优先级）
exports.getTaskListByPriority = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询单一项目列表数据的 SQL 语句
    const sql = `select * from task where project_name=? and deleted = 0 and priority=? order by update_time desc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info.project_name, req.params.priority], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取单一项目列表数据（按优先级）成功！',
            data: results,
        })
    })
}

// 获取单一项目任务列表的处理函数（按完成度）
exports.getTaskListByStatus = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询单一项目列表数据的 SQL 语句
    const sql = `select * from task where project_name=? and deleted = 0 and status=? order by update_time desc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info.project_name, req.params.status], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取单一项目列表数据（按完成度）成功！',
            data: results,
        })
    })
}

// 拖动修改任务类型
exports.updateTaskByType = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    var update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 定义查询单一项目列表数据的 SQL 语句
    const sql = 'update task set type=?, update_user=?, update_time=? where task_name=? and project_name=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.params.type, req.user.username, update_time, info.task_name, info.project_name], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '拖动修改任务类型成功！',
            data: results,
        })
    })
}

// 拖动修改任务优先级
exports.updateTaskByPriority = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    var update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 定义查询单一项目列表数据的 SQL 语句
    const sql = 'update task set priority=?, update_user=?, update_time=? where task_name=? and project_name=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.params.priority, req.user.username, update_time, info.task_name, info.project_name], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '拖动修改任务优先级成功！',
            data: results,
        })
    })
}

// 拖动修改任务完成度
exports.updateTaskByStatus = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    var update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // 定义查询单一项目列表数据的 SQL 语句
    const sql = 'update task set status=?, update_user=?, update_time=? where task_name=? and project_name=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.params.status, req.user.username, update_time, info.task_name, info.project_name], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '拖动修改任务完成度成功！',
            data: results,
        })
    })
}


// 根据 任务 id 查询任务基本信息的处理函数
exports.getTaskById = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const info = req.body

    // 定义更新的 SQL 语句
    const sql = `select * from task where id=? and deleted = 0`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('查询任务失败！')
        res.send({
            status: 0,
            message: '查询任务成功！',
            data: results,
        })
        // res.cc('查询任务成功！', 0)
    })
}

// 根据 任务 id 修改任务基本信息的处理函数
exports.updateTaskById = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const info = req.body

    // 定义 SQL 语句，查询任务名是否被占用
    const sqlStr = 'select * from task where task_name=? and project_name=?'
    db.query(sqlStr, [info.task_name, info.project_name], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断项目名是否被占用
        if (results.length > 1) {
            return res.cc('任务名被占用，请更换其他任务名！')
        }

        var update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // 定义更新的 SQL 语句
        const sql = `update task set task_name=?, task_details=?, type=?, update_user=?, priority=?, update_time=?,
         deadline=?, assignee=?, status=?, task_comment=? where id=?`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, [info.task_name, info.task_details, info.type, req.user.username, info.priority, update_time,
        info.deadline, info.assignee, info.status, info.task_comment, req.body.id], (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('更新任务失败！')
            res.cc('更新任务成功！', 0)
        })
    })
}