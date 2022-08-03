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
exports.createProject = (req, res) => {
    // 获取客户端提交到服务器的信息
    const projectinfo = req.body

    // 定义 SQL 语句，查询项目名是否被占用
    const sqlStr = 'select * from project where project_name=?'
    db.query(sqlStr, projectinfo.project_name, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断项目名是否被占用
        if (results.length > 0) {
            return res.cc('项目名被占用，请更换其他项目名！')
        }

        // 定义插入新项目的 SQL 语句
        const sql = 'insert into project set ?'
        // 调用 db.query() 执行 SQL 语句
        var create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // console.log(create_time)
        db.query(sql, { project_name: projectinfo.project_name, project_details: projectinfo.project_details, create_user: req.user.username, create_time: create_time }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('创建项目失败，请稍后再试！')

            // 定义插入新项目的 SQL 语句
            const sql = 'insert into project_user_rel set ?'
            // 调用 db.query() 执行 SQL 语句
            db.query(sql, { p_name: projectinfo.project_name, members: req.user.username }, (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) return res.cc(err)
                // 判断影响行数是否为 1
                if (results.affectedRows !== 1) return res.cc('创建项目失败，请稍后再试！')
                // 创建项目成功
                res.cc('创建成功！', 0)
            })
        })
    })
}

// 获取项目列表的处理函数
exports.getProjectList = (req, res) => {
    // 定义查询项目列表数据的 SQL 语句
    const sql = `select * from project_user_rel where numbers=? and deleted = 0`
    // const sql = `select * from project_user_rel where numbers=? order by id asc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.user.username, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取项目列表数据成功！',
            data: results,
        })
    })
}

// 添加项目成员的处理函数
exports.addMember = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 1.判断添加的成员是否存在
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, info.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断用户名是否被占用
        if (results.length < 0) {
            return res.cc('该用户不存在，请重新添加其他用户！')
        }

        // 2.判断添加的成员是否已在项目中
        const sqlStr2 = 'select * from project_user_rel where p_name=? and members=?'
        db.query(sqlStr2, [info.project_name, info.member], (err, results) => {
            // 执行 SQL 语句失败
            if (err) {
                return res.cc(err)
            }
            // 判断用户名是否被占用
            if (results.length > 0) {
                return res.cc('该用户已存在项目中！')
            }

            // 3.定义添加新成员的 SQL 语句
            const sql = 'insert into project_user_rel set ?'
            // 调用 db.query() 执行 SQL 语句
            db.query(sql, { p_name: info.project_name, numbers: info.member }, (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) return res.cc(err)
                // 判断影响行数是否为 1
                if (results.affectedRows !== 1) return res.cc('添加成员失败，请稍后再试！')
                // 添加成员成功
                res.cc('添加成功！', 0)
            })
        })
    })
}

// 根据 项目名（唯一性） 删除项目的处理函数
exports.deleteProjectByName = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义标记删除的 SQL 语句
    const sql = `update project set deleted=1 where project_name=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.project_name, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除项目失败！')
        // 定义标记删除的 SQL 语句
        const sql2 = `update project_user_rel set deleted=1 where p_name=?`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql2, info.project_name, (err, results) => {
            if (err) return res.cc(err)
            // 此处不止更新一种
            // if (results.affectedRows !== 1) return res.cc('删除项目失败！')
            res.cc('删除项目成功！', 0)
        })
    })
}


// 根据 项目名（唯一性）查询项目基本信息的处理函数
exports.getProjectByName = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义根据 project_name 获取项目基本信息的 SQL 语句
    const sql = `select * from project where project_name=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.project_name, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('查询项目基本信息失败！')
        results[0].create_time = moment(results[0].create_time).format('YYYY-MM-DD HH:mm:ss')
        res.send({
            status: 0,
            message: '查询项目基本信息成功！',
            data: results[0],
        })
    })
}

// 根据 项目Id（唯一性）修改项目基本信息的处理函数
exports.updateProjectById = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义更新的 SQL 语句
    const sql = `update project set ? where id=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新项目失败！')
        res.cc('更新项目成功！', 0)
    })
}

// 获取项目成员列表的处理函数
exports.getProjectMemberList = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询项目列表数据的 SQL 语句
    const sql = `select members from project_user_rel where p_name=? and deleted = 0`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.project_name, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取项目成员列表数据成功！',
            data: results,
        })
    })
}

// 获取项目任务列表的处理函数
exports.getProjectTaskList = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询项目列表数据的 SQL 语句
    const sql = `select * from task where project_name=? and deleted = 0 order by update_time desc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.project_name, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取项目任务列表数据成功！',
            data: results,
        })
    })
}