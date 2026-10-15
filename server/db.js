import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let dbHost = process.env.DB_HOST || '127.0.0.1';
if (dbHost === 'localhost') {
  dbHost = '127.0.0.1';
}

const pool = mysql.createPool({
  host: dbHost,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'enviaar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Helper function to test DB connectivity
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL Database (${dbHost}):`, process.env.DB_NAME || 'enviaar_db');
    connection.release();
    return true;
  } catch (err) {
    console.warn(`⚠️  MySQL Database Connection Warning (${dbHost}):`, err.message);
    return false;
  }
}

export default pool;
