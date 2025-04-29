# Dokumentasi Database Wedding Invitation App

## Pendahuluan

Dokumen ini berisi petunjuk tentang cara menggunakan dan mengelola database MySQL untuk aplikasi undangan pernikahan.

## Persiapan Database

1. Pastikan MySQL dan phpMyAdmin sudah terinstal dan berjalan (melalui XAMPP)
2. Buat database baru dengan nama `wedding_invitation_db`
3. Impor file `wedding_db.sql` melalui phpMyAdmin

## Struktur Database

Database ini memiliki beberapa tabel utama:

1. **wedding_core**: Menyimpan data utama pernikahan (nama pengantin, tempat, tanggal, dll)
2. **wedding_schedule**: Jadwal acara pernikahan
3. **wedding_committee**: Data anggota panitia pernikahan
4. **wedding_vendors**: Data vendor yang terlibat
5. **wedding_coordinators**: Data koordinator acara
6. **wedding_moodboard**: Gambar dan konsep mood board
7. **wedding_event_summary**: Ringkasan acara
8. **wedding_guests**: Data tamu undangan

## Koneksi ke Database

Koneksi ke database diatur melalui file `config/database.js`. File ini berisi konfigurasi berikut:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  // Sesuaikan dengan password MySQL Anda
  database: 'wedding_invitation_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

Jika Anda mengubah nama database atau kredensial, pastikan untuk memperbarui file ini.

## API Database

Server mengekspos beberapa endpoint API untuk mengelola data:

### Data Inti Pernikahan
- `GET /api/db/wedding-core` - Mendapatkan data inti pernikahan
- `POST /api/db/wedding-core` - Menambahkan data inti pernikahan baru
- `PUT /api/db/wedding-core/:id` - Memperbarui data inti pernikahan

### Jadwal Acara
- `GET /api/db/wedding-schedules` - Mendapatkan semua jadwal acara
- `POST /api/db/wedding-schedules` - Menambahkan jadwal acara baru
- `PUT /api/db/wedding-schedules/:id` - Memperbarui jadwal acara
- `DELETE /api/db/wedding-schedules/:id` - Menghapus jadwal acara

### Panitia
- `GET /api/db/wedding-committee` - Mendapatkan semua anggota panitia
- `POST /api/db/wedding-committee` - Menambahkan anggota panitia baru
- `PUT /api/db/wedding-committee/:id` - Memperbarui data anggota panitia
- `DELETE /api/db/wedding-committee/:id` - Menghapus anggota panitia

## Backup dan Restore

### Cara Backup Database
1. Buka phpMyAdmin
2. Pilih database `wedding_invitation_db`
3. Klik tab "Export"
4. Pilih format "SQL"
5. Klik "Go" untuk mengunduh file backup

### Cara Restore Database
1. Buka phpMyAdmin
2. Buat database baru (jika belum ada)
3. Pilih database tersebut
4. Klik tab "Import"
5. Pilih file backup SQL yang akan diimpor
6. Klik "Go" untuk mengimpor

## Migrasi dari JSON ke MySQL

Aplikasi ini sebelumnya menggunakan penyimpanan berbasis file JSON. Endpoint API lama masih dipertahankan untuk kompatibilitas mundur, tetapi sebaiknya gunakan endpoint API database baru untuk pengembangan lebih lanjut.

## Troubleshooting

### Tidak Dapat Terhubung ke Database
1. Pastikan MySQL berjalan melalui XAMPP
2. Periksa kredensial di `config/database.js`
3. Pastikan database `wedding_invitation_db` sudah dibuat
4. Periksa log server untuk error spesifik

### Endpoint API Tidak Berfungsi
1. Periksa apakah server Express berjalan
2. Pastikan rute API didefinisikan dengan benar di `server.js`
3. Periksa koneksi database

### Cara Menguji Koneksi Database
Gunakan endpoint API khusus untuk menguji koneksi:
```
GET /api/test-db
```

Response sukses akan menunjukkan:
```json
{
  "success": true,
  "message": "Database connected successfully"
}
``` 