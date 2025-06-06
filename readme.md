# Proyek Kloning Antarmuka YouTube (Mine Web)

Selamat datang di Proyek Mine Web! Ini adalah sebuah proyek frontend yang bertujuan untuk membuat ulang (kloning) antarmuka pengguna dari platform video populer seperti YouTube, dengan fokus pada desain yang modern, responsif, dan interaktif. Proyek ini dibangun dari nol menggunakan teknologi web dasar: HTML5, CSS3, dan JavaScript (Vanilla JS), tanpa menggunakan framework eksternal.

Proyek ini mencakup halaman utama dengan grid video yang dinamis dan halaman pemutar video kustom yang kaya akan fitur.

![Contoh Tampilan Proyek](https://via.placeholder.com/800x450/2c3e50/ffffff?text=Screenshot+Proyek+Anda+di+Sini)
*(Ganti gambar di atas dengan screenshot proyek Anda)*

---

## ✨ Fitur-Fitur Utama

### Halaman Utama (`mine.html`)
- **Tata Letak Responsif:** Desain *mobile-first* yang beradaptasi dengan mulus dari layar ponsel, tablet, hingga desktop.
- **Navigasi Ganda:** Menggunakan **Navigasi Bawah** untuk mobile dan **Sidebar Navigasi** (yang bisa diciutkan) untuk desktop.
- **Konten Dinamis:** Daftar video dimuat secara dinamis dari file `videos.json`, membuat konten mudah dikelola.
- **Skeleton Loader:** Menampilkan animasi kerangka konten yang elegan saat data sedang dimuat untuk pengalaman pengguna yang lebih baik.
- **Animasi Entri:** Item video muncul dengan animasi halus.
- **Pencarian Real-Time:** Fungsi pencarian yang memfilter video secara langsung saat pengguna mengetik, dengan teknik *debouncing* untuk optimasi performa.
- **UI yang Interaktif:** Mode pencarian yang sinematik dan status aktif pada menu yang diklik.

### Halaman Player (`player.html`)
- **Pemutar Video Kustom Penuh:** Menggunakan **YouTube Iframe Player API** untuk kontrol penuh atas pemutaran video, dengan menyembunyikan kontrol default YouTube.
- **Kontrol Kustom Lengkap:**
    - Play/Pause.
    - Progress Bar yang bisa di-klik untuk *seeking*.
    - Kontrol Volume (tombol mute & slider).
    - Tampilan Waktu (waktu saat ini / durasi total).
    - Tombol Mode Teater.
    - Tombol Layar Penuh (Fullscreen).
- **Interaksi Canggih:**
    - **Kontrol Keyboard:** Kontrol player menggunakan keyboard (Spasi, F, M, Tombol Panah).
    - **Resume Playback:** Menyimpan progres tontonan di `localStorage` dan melanjutkannya secara otomatis.
    - **Double-Tap to Seek:** Ketuk dua kali di sisi kiri/kanan video untuk mundur/maju 10 detik di perangkat sentuh.
- **Fitur Tambahan:**
    - **Menu Setelan:** Placeholder untuk mengubah kualitas dan kecepatan video.
    - **Deskripsi yang Bisa Diperluas:** Kotak deskripsi yang bisa diciutkan.
    - **Simulasi Komentar & Like/Dislike:** Interaksi UI untuk memberikan komentar dan like/dislike.
    - **Rekomendasi & Daftar Episode:** Tata letak dua kolom di desktop untuk menampilkan rekomendasi dan daftar episode.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Menggunakan tag semantik seperti `<main>`, `<section>`, `<aside>`, dan `<nav>`.
- **CSS3:**
    - Variabel CSS (`:root`) untuk tema yang mudah dikelola.
    - **Flexbox** dan **CSS Grid** untuk tata letak yang kompleks dan responsif.
    - **Media Queries** untuk desain adaptif.
    - **Keyframe Animations & Transitions** untuk interaksi yang halus.
- **JavaScript (ES6+):**
    - **Vanilla JS** (tanpa library/framework).
    - **Fetch API** untuk memuat data JSON secara asinkron (`async/await`).
    * **DOM Manipulation** untuk membuat UI dinamis.
    * **YouTube Iframe Player API** untuk mengontrol pemutar video.
    * **`localStorage`** untuk menyimpan state (progres tontonan).

---

## 🚀 Cara Menjalankan Proyek

1.  Pastikan semua file (`mine.html`, `player.html`, `mine.css`, `player.css`, `mine.js`, `player.js`, `videos.json`) berada dalam satu folder yang sama.
2.  **PENTING:** Proyek ini menggunakan `fetch` API untuk memuat `videos.json`. Karena kebijakan keamanan browser (CORS), Anda tidak bisa membukanya dengan klik dua kali pada file HTML (`file:///...`). Anda **harus** menjalankannya melalui server lokal.
3.  **Cara Termudah:**
    - Buka folder proyek Anda di editor kode seperti **Visual Studio Code**.
    - Pasang ekstensi bernama **"Live Server"**.
    - Setelah terpasang, klik kanan pada file `mine.html` dan pilih **"Open with Live Server"**.
    - Browser akan otomatis terbuka dengan alamat seperti `http://127.0.0.1:5500/mine.html` dan semuanya akan berjalan dengan baik.

---

Build with ♥️ by Gemini,GPT, Copilot Prompt and Edited with 💭 by Sky
