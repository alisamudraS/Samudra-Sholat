# Samudra-Sholat 🕌

Website interaktif untuk menampilkan jadwal sholat dan imsakiyah berdasarkan **lokasi pengguna** dan **tanggal yang dipilih**.  
Dibuat untuk tugas praktikum PWEB oleh Ali Samudra.

---

## ✨ Fitur Utama

- Menampilkan jadwal sholat (Subuh, Dzuhur, Ashar, Maghrib, Isya)
- Menampilkan waktu **Imsak** saat bulan Ramadan
- Input tanggal manual (date picker)
- Deteksi lokasi otomatis (geolocation)
- **Audio latar otomatis** (bisa mute/unmute)
- **Background video** estetik (khusus desktop)
- Desain responsif

---

## 📱 Catatan Versi Mobile

Setelah dilakukan pengujian di beberapa perangkat mobile, ditemukan bahwa:

- Background video menyebabkan **lag / frame drop parah**
- Beberapa HP tidak mampu menjalankan video + audio bersamaan
- Bahkan ada yang gagal load karena jaringan lambat

📌 Maka, **background video di-nonaktifkan khusus versi mobile** demi:
- Performa yang lebih ringan
- Fokus pada fitur utama: **jadwal sholat & imsakiyah**
- Memastikan **semua device bisa tetap mengakses fungsionalitas utama**

---

## 📦 Teknologi

- HTML, CSS, JavaScript
- API: [Aladhan Prayer Times](https://aladhan.com/prayer-times-api)
- Hosting: [Vercel](https://vercel.com)

---

## ⚠️ Catatan Tambahan

- Jika browser tidak memberikan izin lokasi, maka sistem akan fallback ke lokasi default: **Jakarta**
- Di HP, suara hanya akan muncul setelah pengguna melakukan interaksi (aturan browser)

---

## 👨‍💻 Dibuat oleh:
Ali Samudra  
Tugas Praktikum PWEB 2025

---

## 🔗 Live Demo:
https://samudra-sholat.vercel.app/
