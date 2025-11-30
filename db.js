// connect to mysql using connection pool
require('dotenv').config();
const mysql = require('mysql2');

// setup connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hawalibnan',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test pool connection
pool.getConnection((err, connection) => {
  if (err) {
    console.log('db pool connection error:', err);
    return;
  }
  console.log('db pool connected');
  connection.release();
});

// export promise-based pool so other files can use async/await
module.exports = pool.promise();
