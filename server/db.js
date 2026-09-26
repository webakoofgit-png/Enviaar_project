import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'enviaar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to test DB connectivity
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database:', process.env.DB_NAME || 'enviaar_db');
    connection.release();
    return true;
  } catch (err) {
    console.warn('⚠️  MySQL Database Connection Warning:', err.message);
    console.warn('💡 Make sure MySQL server is running locally and enviaar_db is created.');
    return false;
  }
}

export default pool;
