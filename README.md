# PustakaKode: Aplikasi Web Pemesanan Buku

Tugas UTS Pemrograman Web 1
Nama: Kanaya

Aplikasi web sederhana untuk pemesanan buku pada toko online. Aplikasi ini hanya berfokus pada sisi **front-end**. Data tidak diambil dari server atau database, tetapi dari file JavaScript terpisah (`js/data.js`) yang berisi array JSON.

## Teknologi

- **HTML5**: struktur halaman semantik
- **CSS3**: tampilan (external CSS, flexbox, grid, media query)
- **JavaScript (vanilla)**: manipulasi DOM, validasi form, modal, dan interaksi
- Tidak memakai framework atau library tambahan

## Cara Menjalankan

1. Ekstrak file zip sepenuhnya ke sebuah folder (jangan membuka file dari dalam zip).
2. Buka file `index.html` di browser (Chrome, Edge, atau Firefox).
3. Login dengan akun berikut:

   | Email | Password |
   |---|---|
   | `admin@tokobuku.com` | `admin123` |

Anda juga bisa mendaftar akun baru lewat tombol **Daftar** di halaman login.

## Struktur Folder

```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- checkout.html
|-- tracking.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js
|   |-- data.js
|-- assets/
|-- img/              (sampul buku)
```

Catatan: pada soal tertulis `login.html` dan `chackout.html`. Pada proyek ini halaman login memakai `index.html` sesuai struktur folder, dan nama checkout ditulis `checkout.html`.

## Penjelasan Halaman

### 1. Login (`index.html`)
- Input email dan password dengan tombol **Login**.
- Validasi: kolom tidak boleh kosong dan email harus berformat benar.
- Jika email atau password salah, muncul alert: *"Email/password yang Anda masukkan salah"*.
- Tombol **Lupa Password** dan **Daftar** tampil sebagai modal box.
- Akun baru yang didaftarkan disimpan di `localStorage`.

### 2. Dashboard (`dashboard.html`)
- Sapaan sesuai waktu lokal: pagi, siang, sore, atau malam.
- Ringkasan: jumlah judul buku, total pesanan, dan nilai transaksi.
- Menu navigasi ke Informasi Stok/Katalog, Tracking Pengiriman, dan Buat Pesanan.
- **Laporan Pemesanan** dan **History Transaksi** tampil sebagai modal.
- Halaman ini hanya bisa dibuka setelah login. Tombol **Keluar** mengakhiri sesi.

### 3. Informasi Stok (`stok.html`)
- Menampilkan data dari variabel `dataKatalogBuku` secara dinamis lewat JavaScript DOM.
- Kolom sampul, kode, judul, penulis, harga, dan stok. Stok di bawah 10 ditandai merah.
- Kotak ringkasan: jumlah judul, total stok, dan jumlah stok menipis.
- Pencarian berdasarkan judul atau penulis.
- Form **Tambah Stok Baru** menambah baris ke tabel menggunakan `createElement` dan `appendChild`.

### 4. Pemesanan (`checkout.html`)
- Pilih buku dan jumlah, dengan pratinjau sampul.
- Keranjang yang bisa ditambah, diubah jumlahnya, dan dihapus. Total dihitung otomatis.
- Form data pemesan (nama, alamat, telepon) serta pilihan ekspedisi dan metode pembayaran.
- Setelah berhasil, muncul modal berisi **nomor Delivery Order (DO)**. Pesanan disimpan di `localStorage`.

### 5. Tracking (`tracking.html`)
- Input Nomor Delivery Order dan tombol **Cari**.
- Menampilkan nama pemesan, status pengiriman (progress bar dan daftar tahap), ekspedisi, tanggal kirim, jenis paket, dan total pembayaran.
- Nomor DO contoh: `DO-1001` (Dikirim), `DO-1002` (Terkirim), `DO-1003` (Pesanan diterima).

## Penjelasan Kode

### `js/data.js`
Berisi data dummy sebagai pengganti database:
- `dataUser`: daftar akun login.
- `dataKatalogBuku`: katalog buku (kode, judul, penulis, harga, stok, gambar).
- `tahapPengiriman`: urutan tahap status pengiriman.
- `dataPesanan`: contoh data pesanan untuk laporan, histori, dan tracking.

### `js/script.js`
Satu file dipakai semua halaman. Kode dibagi per halaman dengan atribut `data-page` pada tag `<body>`.
- **Fungsi bantu**: `modal()` untuk membuat modal dengan elemen `<dialog>`, `galat()` untuk menampilkan pesan error dan menandai input, `rp()` untuk format rupiah, serta `simpan()` dan `ambil()` untuk `localStorage`.
- **Proteksi halaman**: halaman selain login mengarahkan kembali ke login jika belum masuk (memakai `sessionStorage`).
- Bagian **login, dashboard, stok, checkout, dan tracking** masing-masing berjalan hanya pada halamannya.

### `css/style.css`
- Variabel warna di `:root`.
- Layout dengan flexbox dan grid.
- Media query agar tampil baik di layar kecil (checkout berubah menjadi satu kolom).
- Gaya untuk input error, fokus, tabel, modal, dan progress bar.

## Validasi Form

| Halaman | Aturan |
|---|---|
| Login | Kolom wajib diisi, format email benar, akun harus sesuai |
| Daftar | Nama wajib, email valid dan belum terdaftar, password minimal 6 karakter |
| Lupa Password | Email harus valid |
| Tambah Stok | Semua kolom wajib, harga dan stok lebih dari 0, kode tidak boleh kembar |
| Checkout | Keranjang tidak kosong, nama dan alamat wajib, telepon diawali `08` (10-13 digit), jumlah tidak melebihi stok |
| Tracking | Nomor DO wajib diisi dan harus ditemukan |

## Catatan dan Batasan

- Buku yang ditambahkan di halaman stok hanya tersimpan di memori, jadi hilang ketika halaman dimuat ulang.
- Stok buku tidak berkurang setelah pesanan dibuat.
- Pesanan baru selalu berstatus **Pesanan diterima**.
- Akun dan pesanan baru disimpan di `localStorage` browser, bukan di server, sehingga hanya ada di browser yang sama.
- Pengembangan selanjutnya: menghubungkan aplikasi ke database dan server, serta menyimpan stok secara permanen.
