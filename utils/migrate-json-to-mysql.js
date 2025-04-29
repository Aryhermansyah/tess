/**
 * Script untuk migrasi data dari file JSON ke database MySQL
 * 
 * Cara penggunaan:
 * node utils/migrate-json-to-mysql.js
 */

const fs = require('fs');
const path = require('path');
const { pool, testConnection } = require('../config/database');
const weddingDb = require('./db/wedding');

// Direktori data JSON
const dataDir = path.join(__dirname, '..', 'assets', 'wedding_app', 'data');

// Fungsi untuk membaca file JSON
function readJsonFile(fileName) {
  try {
    const filePath = path.join(dataDir, fileName);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return null;
  }
}

// Fungsi untuk migrasi data inti pernikahan
async function migrateWeddingCore() {
  console.log('Migrasi data inti pernikahan...');
  const coreData = readJsonFile('core-data.json');
  
  if (!coreData) {
    console.log('  - Tidak ada data inti pernikahan untuk dimigrasi');
    return;
  }
  
  try {
    const data = {
      bride_name: coreData.brideName || '',
      groom_name: coreData.groomName || '',
      wedding_date: coreData.weddingDate || new Date().toISOString().split('T')[0],
      wedding_time: coreData.weddingTime || '00:00:00',
      venue_name: coreData.venueName || '',
      venue_address: coreData.venueAddress || '',
      venue_maps_link: coreData.venueMapsLink || ''
    };
    
    await weddingDb.saveWeddingCore(data);
    console.log('  - Data inti pernikahan berhasil dimigrasi');
  } catch (error) {
    console.error('  - Gagal migrasi data inti pernikahan:', error);
  }
}

// Fungsi untuk migrasi jadwal acara
async function migrateWeddingSchedule() {
  console.log('Migrasi jadwal acara...');
  const scheduleData = readJsonFile('schedule-data.json');
  
  if (!scheduleData || !scheduleData.events || !Array.isArray(scheduleData.events) || scheduleData.events.length === 0) {
    console.log('  - Tidak ada jadwal acara untuk dimigrasi');
    return;
  }
  
  try {
    let successCount = 0;
    
    for (const event of scheduleData.events) {
      const data = {
        title: event.title || 'Untitled Event',
        date: event.date || new Date().toISOString().split('T')[0],
        start_time: event.startTime || '00:00:00',
        end_time: event.endTime || null,
        description: event.description || '',
        location: event.location || ''
      };
      
      await weddingDb.saveWeddingSchedule(data);
      successCount++;
    }
    
    console.log(`  - ${successCount} jadwal acara berhasil dimigrasi`);
  } catch (error) {
    console.error('  - Gagal migrasi jadwal acara:', error);
  }
}

// Fungsi untuk migrasi panitia
async function migrateWeddingCommittee() {
  console.log('Migrasi data panitia...');
  const committeeData = readJsonFile('committee-data.json');
  
  if (!committeeData || !committeeData.members || !Array.isArray(committeeData.members) || committeeData.members.length === 0) {
    console.log('  - Tidak ada data panitia untuk dimigrasi');
    return;
  }
  
  try {
    let successCount = 0;
    
    for (const member of committeeData.members) {
      const data = {
        name: member.name || 'Unknown',
        role: member.role || 'Staff',
        phone: member.phone || '',
        email: member.email || '',
        image_path: member.imagePath || ''
      };
      
      await weddingDb.saveWeddingCommitteeMember(data);
      successCount++;
    }
    
    console.log(`  - ${successCount} anggota panitia berhasil dimigrasi`);
  } catch (error) {
    console.error('  - Gagal migrasi data panitia:', error);
  }
}

// Fungsi utama untuk menjalankan migrasi
async function runMigration() {
  console.log('=== MULAI MIGRASI DATA JSON KE MYSQL ===');
  
  // Cek koneksi database
  const connected = await testConnection();
  if (!connected) {
    console.error('Tidak dapat terhubung ke database. Migrasi dibatalkan.');
    process.exit(1);
  }
  
  // Jalankan migrasi
  await migrateWeddingCore();
  await migrateWeddingSchedule();
  await migrateWeddingCommittee();
  
  console.log('=== MIGRASI SELESAI ===');
  
  // Tutup koneksi database
  await pool.end();
}

// Jalankan migrasi
runMigration().catch(error => {
  console.error('Error saat migrasi:', error);
  process.exit(1);
}); 