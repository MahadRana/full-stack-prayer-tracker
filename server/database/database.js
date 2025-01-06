const mysql = require('mysql2')

const pool = mysql.createPool({
    host: process.env.DB,
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

module.exports = pool