const db = require('../db/index')
const moment = require('moment')

/**
 * 查询任务所在项目ID
 * 
 * @param {Number} tid
 */
exports.getTaskProjectID = (tid) => {
    return new Promise((resolve, reject) => {
        // 检查用户是否在任务所在组中
        const sql = `
            SELECT
                p_id
            FROM
                \`task\`
            WHERE
                id = ?
        `;
        db.query(sql, tid, (err, results) => {
            if (err) return reject('任务不存在')
            resolve(results[0].p_id)
        });
    })
}

