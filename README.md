# AssetTrack PWA

Aplikasi Progressive Web App untuk pengelolaan data aset tetap. Dibuat menggunakan React JS, Vite, Axios, LocalStorage, Web App Manifest, dan Service Worker.

## Fitur
- Tiga halaman: Dashboard, Data Aset, dan Profil.
- CRUD data aset: tambah, lihat, ubah, hapus.
- Pencarian data aset.
- Penyimpanan LocalStorage agar data tetap ada setelah browser ditutup.
- Service Worker untuk caching dan penggunaan offline.
- Web App Manifest untuk instalasi aplikasi.
- Contoh pengujian komunikasi API menggunakan Axios.

## Menjalankan di komputer
Pastikan Node.js sudah terpasang.

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite.

## Menguji PWA
Service Worker dan instalasi PWA membutuhkan HTTPS atau localhost. Jalankan `npm run build` lalu `npm run preview`, atau deploy ke Vercel. Buka Chrome/Edge, lalu gunakan menu Install App jika tersedia. Setelah aplikasi pernah dibuka saat online, uji mode offline melalui DevTools > Network > Offline atau putuskan koneksi internet.

Catatan: Google Fonts dan tombol uji API memerlukan internet. Antarmuka, navigasi, dan data aset lokal tetap dapat digunakan offline setelah shell aplikasi tersimpan di cache.

## Deploy ke Vercel
1. Ekstrak folder proyek.
2. Upload/push seluruh isi folder ke repository GitHub.
3. Login ke https://vercel.com lalu pilih Add New > Project.
4. Import repository GitHub tersebut.
5. Framework Preset: Vite. Build Command: `npm run build`. Output Directory: `dist`.
6. Klik Deploy dan tunggu sampai selesai.
7. Buka URL hasil deployment untuk menguji aplikasi.

## Identitas
Nama: Hanif Arifandi Zulfikar  
NIM: 21120124140154  
Kelompok: isi sesuai kelompok praktikum.
