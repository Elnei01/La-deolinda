import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// Creamos un pool de conexiones para mayor eficiencia
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'deolinda_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('¡Conectado exitosamente a la base de datos MySQL! 🚀');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};