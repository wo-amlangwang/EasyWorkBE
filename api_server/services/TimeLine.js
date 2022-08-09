const db = require('../db/index')
const moment = require('moment')

/**
 * 添加时间线记录
 * 
 * @param {Number} tid 任务id
 * @param {String} content 内容
 * @param {Number} type 类型，1为操作，2为评论
 * @param {Number} user 用户ID
 */
exports.newRecord = (tid, content, type, user) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO time_line set ?`
        const data = {
            tid: tid,
            content: content,
            type: type,
            create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            create_user: user
        }
        db.query(sql, data, (err, results) => {
            if (err) return reject(err)
            resolve(results)
        });
    })
}
