// connect to mysql
require('dotenv').config();
const mysql = require('mysql2');

// setup connection info using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hawalibnan',
  port: process.env.DB_PORT || 3306
});

// try to connect
db.connect((err) => {
  if (err) {
    console.log('db connection error:', err);
    return;
  }
  console.log('db connected');
});

// export so other files can use it
module.exports = db;
