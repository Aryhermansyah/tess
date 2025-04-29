# Script untuk menjalankan server aplikasi undangan pernikahan

Write-Host "Memulai server aplikasi undangan pernikahan..." -ForegroundColor Green

# Pastikan semua modul terinstal
Write-Host "Memeriksa dan menginstal modul yang diperlukan..." -ForegroundColor Yellow
npm install

# Jalankan server
Write-Host "Menjalankan server pada port 3000..." -ForegroundColor Cyan
node server.js 