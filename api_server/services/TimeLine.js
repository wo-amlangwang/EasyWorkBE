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

/**
 * 查询时间线记录
 * 
 * @param {Number} tid 
 */
exports.getRecord = (tid) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT
            a.\`id\` AS \`time_line_id\`,
            a.\`content\`,
            a.\`type\`,
            a.\`create_time\`,
            b.\`id\` AS \`uid\`,
            b.\`nickname\` 
        FROM
            \`time_line\` AS a,
            \`users\` AS b 
        WHERE
            a.\`create_user\` = b.\`id\` 
            AND a.\`tid\` = ?;`
        db.query(sql, tid, (err, results) => {
            if (err) return reject('任务不存在')
            results = results.map(item => {
                item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            resolve(results)
        })
    });
}