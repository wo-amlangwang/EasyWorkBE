// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
const moment = require('moment')

// 获取项目列表的处理函数
exports.getProjectList = (req, res) => {
    // 定义查询项目列表数据的 SQL 语句
    const sql = 'SELECT `project`.*, `users`.`nickname` as `master` FROM `project`, `project_user_rel`,`users` WHERE `project_user_rel`.`m_id` = ? AND `project_user_rel`.`deleted` = 0 AND `project`.`id` = `project_user_rel`.`p_id` AND `users`.`id` = `project_user_rel`.`m_id` ORDER BY `project`.`create_time` DESC';
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err)
        results = results.map(item => {
            item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')     
            item.update_time = moment(item.update_time).format('YYYY-MM-DD HH:mm:ss')
            item.deadline = moment(item.deadline).format('YYYY-MM-DD HH:mm:ss')
            return item;
        });
        res.send({
            status: 0,
            message: '获取项目列表数据成功！',
            data: results,
        })
    })
}

// 注册新项目的处理函数
exports.createProject = (req, res) => {
    // 获取客户端提交到服务器的信息
    const projectinfo = req.body

    // 定义 SQL 语句，查询项目名是否被占用
    const sqlStr = 'select * from project where project_name=? and create_uid=? and deleted=0'
    db.query(sqlStr, [projectinfo.project_name, req.auth.id], (err, results) => {
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
        // TODO： 移除createuser_name字段
        db.query(sql, { project_name: projectinfo.project_name, project_details: projectinfo.project_details, create_uid: req.auth.id, create_user: req.auth.username, create_time: create_time }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc('创建项目失败，请稍后再试！')
            const pid = results.insertId;
            // 定义插入新项目的 SQL 语句
            const sql = 'insert into project_user_rel set ?'
            // 调用 db.query() 执行 SQL 语句
            db.query(sql, { p_id: pid, m_id: req.auth.id }, (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) return res.cc(err)
                // 判断影响行数是否为 1
                if (results.affectedRows !== 1) return res.cc('创建项目失败，请稍后再试！')
                // 创建项目成功
                res.send({
                    status: 0,
                    id: pid
                })
            })

        })
    })
}

// 根据 项目Id（唯一性）查询项目基本信息的处理函数
exports.getProjectById = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body
    // 定义根据 项目Id 获取项目基本信息的 SQL 语句
    const sql = `select * from project where id=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('查询项目基本信息失败！')

        results[0].create_time = moment(results[0].create_time).format('YYYY-MM-DD HH:mm:ss')     
        results[0].update_time = moment(results[0].update_time).format('YYYY-MM-DD HH:mm:ss')
        results[0].deadline = moment(results[0].deadline).format('YYYY-MM-DD HH:mm:ss')

        res.send({
            status: 0,
            message: '查询项目基本信息成功！',
            data: results[0],
        })
    })
}

// 添加项目成员的处理函数
exports.addMember = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 1.判断添加的成员是否存在
    const sqlStr = 'select * from users where id=?'
    db.query(sqlStr, info.mid, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断用户是否存在
        if (results.length < 0) {
            return res.cc('该用户不存在，请重新添加其他用户！')
        }
        // 2.判断添加的成员是否已在项目中
        const sqlStr2 = 'select * from project_user_rel where p_id=? and m_id=?'
        db.query(sqlStr2, [info.pid, info.mid], (err, results) => {
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
            db.query(sql, { m_id: info.mid, p_id: info.pid }, (err, results) => {
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

// 根据 成员Id（唯一性） 删除项目成员的处理函数
exports.deleteMemberById = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义标记删除的 SQL 语句
    const sql = `select * from project where id=? and create_user=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info.pid, req.auth.username], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('当前用户不是该项目创建人，不可删除！')
        // 定义标记删除的 SQL 语句
        const sql2 = `update project_user_rel set deleted=1 where p_id=? and m_id=?`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql2, [info.pid, info.mid], (err, results) => {
            if (err) return res.cc(err)
            // 此处不止更新一种
            // if (results.affectedRows !== 1) return res.cc('删除项目失败！')
            res.cc('删除成员成功！', 0)
        })
    })
}


// 根据 项目Id（唯一性） 删除项目的处理函数
exports.deleteProjectById = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义标记删除的 SQL 语句
    const sql = `update project set deleted=1 where id=? and create_user=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [info.id, req.auth.username], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('当前用户不是该项目创建人！')
        // 定义标记删除的 SQL 语句
        const sql2 = `update project_user_rel set deleted=1 where p_id=?`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql2, info.id, (err, results) => {
            if (err) return res.cc(err)
            // 此处不止更新一种
            // if (results.affectedRows !== 1) return res.cc('删除项目失败！')
            res.cc('删除项目成功！', 0)
        })
    })
}

// 根据 项目Id（唯一性）修改项目基本信息的处理函数
exports.updateProjectById = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义 SQL 语句，查询项目名是否被占用
    const sqlStr = 'select * from project where project_name=? and create_user=? and deleted=0'
    db.query(sqlStr, [info.project_name, req.auth.username], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断项目名是否被占用
        if (results.length > 0 && results[0].id != info.id) {
            return res.cc('项目名被占用，请更换其他项目名！')
        }
        // 定义更新的 SQL 语句
        const sql = `update project set project_name=?, project_details=? where id=? and crea`
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, [info.project_name, info.project_details, info.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新项目失败！')
            res.cc('更新项目成功！', 0)
        })
    })
}

// 获取项目成员列表的处理函数
exports.getProjectMemberList = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body
    // 定义查询项目列表数据的 SQL 语句
    const sql = 'SELECT `users`.`id`, `users`.`username` FROM `users`, `project_user_rel` WHERE `project_user_rel`.`m_id` = `users`.`id` AND `project_user_rel`.`p_id` = ?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.id, (err, results) => {
        if (err) return res.cc(err)
        let members = new Array();
        results.forEach((item) => {
            members.push({
                id: item.id,
                name: item.username
            });
        });
        res.send({
            status: 0,
            message: '获取项目成员列表数据成功！',
            data: members,
        })
    })
}

// 获取项目任务列表的处理函数
exports.getProjectTaskList = (req, res) => {
    // 获取客户端提交到服务器的信息
    const info = req.body

    // 定义查询项目列表数据的 SQL 语句
    const sql = `select * from task where p_id=? and deleted = 0 order by create_time desc`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, info.id, (err, results) => {
        if (err) return res.cc(err)
        results = results.map(item => {
            item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')     
            item.update_time = moment(item.update_time).format('YYYY-MM-DD HH:mm:ss')
            item.deadline = moment(item.deadline).format('YYYY-MM-DD HH:mm:ss')
            return item;
        });
        res.send({
            status: 0,
            message: '获取项目任务列表数据成功！',
            data: results,
        })
    })
}
