const mysql = require('mysql2/promise'); // mysql2(promise) 모듈 사용

const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: 'dlwlgns123',
    database: 'JIHUN'
});

module.exports = pool;
