const mysql = require('mysql')
const conf = require('../config')

const db = mysql.createPool({
  host: conf.database.host,
  user: conf.database.user,
  password: conf.database.password,
  database: conf.database.database,
})

module.exports = db
