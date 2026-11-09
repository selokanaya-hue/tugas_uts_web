// Data dummy (pengganti database). Dimuat sebelum script.js.
const dataUser = [
  { nama: "Kanaya", email: "mahasiswa@toko.id", password: "web12345" }
];

const dataKatalogBuku = [
  { kode: "BK-001", judul: "Dasar HTML5 dan CSS3", kategori: "Web", harga: 65000, stok: 24, gambar: "img/buku1.png" },
  { kode: "BK-002", judul: "JavaScript untuk Pemula", kategori: "Web", harga: 78000, stok: 18, gambar: "img/buku2.png" },
  { kode: "BK-003", judul: "Algoritma dan Pemrograman", kategori: "Informatika", harga: 85000, stok: 9, gambar: "img/buku3.png" },
  { kode: "BK-004", judul: "Basis Data Relasional", kategori: "Informatika", harga: 92000, stok: 14, gambar: "img/buku4.png" },
  { kode: "BK-005", judul: "Desain Antarmuka Pengguna", kategori: "Desain", harga: 70000, stok: 7, gambar: "img/buku5.png" },
  { kode: "BK-006", judul: "Jaringan Komputer Dasar", kategori: "Jaringan", harga: 88000, stok: 21, gambar: "img/buku6.png" }
];

// status: 0 diproses, 1 dikemas, 2 dalam perjalanan, 3 diterima
const dataTracking = [
  { noDO: "DO2026001", nama: "Budi Santoso", status: 3, ekspedisi: "JNE", tanggal: "2026-11-02", paket: "Reguler", total: 185000 },
  { noDO: "DO2026002", nama: "Siti Aminah", status: 2, ekspedisi: "J&T Express", tanggal: "2026-11-06", paket: "Express", total: 250000 },
  { noDO: "DO2026003", nama: "Andi Pratama", status: 1, ekspedisi: "SiCepat", tanggal: "2026-11-08", paket: "Reguler", total: 107000 }
];

const dataTransaksi = [
  { id: "DO2026001", tanggal: "2026-11-02", item: "Dasar HTML5 dan CSS3 x2, Basis Data Relasional x1", total: 185000, status: "Selesai" },
  { id: "DO2026002", tanggal: "2026-11-06", item: "JavaScript untuk Pemula x3", total: 250000, status: "Dikirim" },
  { id: "DO2026003", tanggal: "2026-11-08", item: "Algoritma dan Pemrograman x1", total: 107000, status: "Dikemas" },
  { id: "DO2026000", tanggal: "2026-10-21", item: "Jaringan Komputer Dasar x2", total: 191000, status: "Selesai" }
];
