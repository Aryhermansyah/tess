const mysql = require('mysql2/promise');

// Konfigurasi koneksi database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  // Jika Anda memiliki password, masukkan di sini
  database: 'wedding_invitation_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Membuat pool koneksi
const pool = mysql.createPool(dbConfig);

// Fungsi untuk mengecek koneksi database
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database terhubung dengan sukses!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Kesalahan koneksi database:', error);
    return false;
  }
}

// Export pool koneksi dan fungsi test
module.exports = {
  pool,
  testConnection
}; 