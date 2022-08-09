// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户信息的 SQL 语句
  const sql = `select id, username, nickname, email, user_pic from users where id=?`
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.auth.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询的结果可能为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 定义待执行的 SQL 语句
  const sql = `update users set ? where id=?`
  // 调用 db.query() 执行 SQL 语句并传递参数
  db.query(sql, [req.body, req.auth.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
    // 成功
    res.cc('更新用户信息成功！', 0)
  })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  // 接收表单的数据
  const userinfo = req.body

  // 根据 id 查询用户的信息
  const sql = `select * from users where id=?`
  // 执行根据 id 查询用户的信息的 SQL 语句
  db.query(sql, req.auth.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 判断结果是否存在
    if (results.length !== 1) return res.cc('用户不存在！')

    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.oldPwd, results[0].password)
    if (!compareResult) return res.cc('旧密码错误！')

    // 定义更新密码的 SQL 语句
    const sql = `update users set password=? where id=?`
    // 对新密码进行加密处理
    const newPwd = bcrypt.hashSync(userinfo.newPwd, 10)
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [newPwd, req.auth.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 判断影响的行数
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      // 成功
      res.cc('更新密码成功', 0)
    })
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // 1. 定义更新头像的 SQL 语句
  const sql = `update users set user_pic=? where id=?`
  // 2. 调用 db.query() 执行 SQL 语句
  db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 影响的行数是否等于 1
    if (results.affectedRows !== 1) return res.cc('更换头像失败！')
    // 成功
    res.cc('更换头像成功！', 0)
  })
}

// 根据用户名LIKE查找返回用户ID和用户名头像的处理函数
exports.getLikeUser = (req, res) => {
  // 接收表单的数据
  const info = req.body

  // 定义查询用户信息的 SQL 语句
  const sql = "select id, username from users where username LIKE ? AND id != ?"
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, ['%' + info.likename + '%', req.auth.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results,
    })
  })
}
