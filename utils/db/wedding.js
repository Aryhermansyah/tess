const { pool } = require('../../config/database');

// Fungsi untuk data inti pernikahan
// -----------------------------
async function getWeddingCore() {
  try {
    const [rows] = await pool.query('SELECT * FROM wedding_core ORDER BY id DESC LIMIT 1');
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting wedding core data:', error);
    throw error;
  }
}

async function saveWeddingCore(data) {
  try {
    const { bride_name, groom_name, wedding_date, wedding_time, venue_name, venue_address, venue_maps_link } = data;
    
    const [result] = await pool.query(
      'INSERT INTO wedding_core (bride_name, groom_name, wedding_date, wedding_time, venue_name, venue_address, venue_maps_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bride_name, groom_name, wedding_date, wedding_time, venue_name, venue_address, venue_maps_link]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error saving wedding core data:', error);
    throw error;
  }
}

async function updateWeddingCore(id, data) {
  try {
    const { bride_name, groom_name, wedding_date, wedding_time, venue_name, venue_address, venue_maps_link } = data;
    
    await pool.query(
      'UPDATE wedding_core SET bride_name = ?, groom_name = ?, wedding_date = ?, wedding_time = ?, venue_name = ?, venue_address = ?, venue_maps_link = ? WHERE id = ?',
      [bride_name, groom_name, wedding_date, wedding_time, venue_name, venue_address, venue_maps_link, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Error updating wedding core data:', error);
    throw error;
  }
}

// Fungsi untuk jadwal acara
// -----------------------------
async function getWeddingSchedules() {
  try {
    const [rows] = await pool.query('SELECT * FROM wedding_schedule ORDER BY date, start_time');
    return rows;
  } catch (error) {
    console.error('Error getting wedding schedules:', error);
    throw error;
  }
}

async function saveWeddingSchedule(data) {
  try {
    const { title, date, start_time, end_time, description, location } = data;
    
    const [result] = await pool.query(
      'INSERT INTO wedding_schedule (title, date, start_time, end_time, description, location) VALUES (?, ?, ?, ?, ?, ?)',
      [title, date, start_time, end_time, description, location]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error saving wedding schedule:', error);
    throw error;
  }
}

async function updateWeddingSchedule(id, data) {
  try {
    const { title, date, start_time, end_time, description, location } = data;
    
    await pool.query(
      'UPDATE wedding_schedule SET title = ?, date = ?, start_time = ?, end_time = ?, description = ?, location = ? WHERE id = ?',
      [title, date, start_time, end_time, description, location, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Error updating wedding schedule:', error);
    throw error;
  }
}

async function deleteWeddingSchedule(id) {
  try {
    await pool.query('DELETE FROM wedding_schedule WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting wedding schedule:', error);
    throw error;
  }
}

// Fungsi untuk panitia
// -----------------------------
async function getWeddingCommittee() {
  try {
    const [rows] = await pool.query('SELECT * FROM wedding_committee ORDER BY id');
    return rows;
  } catch (error) {
    console.error('Error getting wedding committee:', error);
    throw error;
  }
}

async function saveWeddingCommitteeMember(data) {
  try {
    const { name, role, phone, email, image_path } = data;
    
    const [result] = await pool.query(
      'INSERT INTO wedding_committee (name, role, phone, email, image_path) VALUES (?, ?, ?, ?, ?)',
      [name, role, phone, email, image_path]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error saving wedding committee member:', error);
    throw error;
  }
}

async function updateWeddingCommitteeMember(id, data) {
  try {
    const { name, role, phone, email, image_path } = data;
    
    await pool.query(
      'UPDATE wedding_committee SET name = ?, role = ?, phone = ?, email = ?, image_path = ? WHERE id = ?',
      [name, role, phone, email, image_path, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Error updating wedding committee member:', error);
    throw error;
  }
}

async function deleteWeddingCommitteeMember(id) {
  try {
    await pool.query('DELETE FROM wedding_committee WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting wedding committee member:', error);
    throw error;
  }
}

// Ekspor semua fungsi
module.exports = {
  // Core
  getWeddingCore,
  saveWeddingCore,
  updateWeddingCore,
  
  // Schedule
  getWeddingSchedules,
  saveWeddingSchedule,
  updateWeddingSchedule,
  deleteWeddingSchedule,
  
  // Committee
  getWeddingCommittee,
  saveWeddingCommitteeMember,
  updateWeddingCommitteeMember,
  deleteWeddingCommitteeMember,
  
  // Fungsi lain bisa ditambahkan sesuai kebutuhan
}; 