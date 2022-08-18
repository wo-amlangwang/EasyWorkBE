const db = require('../db/index')
const moment = require('moment')

/**
 * 检查用户是否在相应项目组中
 * 
 * @param {Number} uid 
 * @param {Number} pid 
 */
exports.checkInProject = (uid, pid) => {
    return new Promise((resolve, reject) => {
        // 查询在项目组中是否存在该用户
        sql = `
            SELECT
                COUNT(a.id) AS cnt
            FROM
                \`project_user_rel\` AS a
            WHERE
                a.m_id = ? AND
                a.p_id = ?`;
        db.query(sql, [uid, pid], (err, results) => {
            if (err) reject(err)
            if (results[0].cnt !== 1) reject('用户非项目组成员')
            resolve('ok')
        })
    })
}

/**
 * 检查用户权限
 */