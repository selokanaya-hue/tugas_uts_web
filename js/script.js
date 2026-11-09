"use strict";
/* ===== Helper umum ===== */
const $ = (s, r = document) => r.querySelector(s);
const rp = n => "Rp " + Number(n).toLocaleString("id-ID");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ambil = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const semuaUser = () => dataUser.concat(ambil("userBaru", []));
const semuaBuku = () => dataKatalogBuku.concat(ambil("stokBaru", [])).map(b => ({ ...b }));
const semuaTrx = () => dataTransaksi.concat(ambil("pesananBaru", []));

/* Modal / pop-up dibuat lewat DOM */
function modal(judul, isi, lebar) {
  tutup();
  const bg = document.createElement("div");
  bg.className = "modal-bg"; bg.id = "modal";
  bg.innerHTML = `<div class="modal${lebar ? " wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="mj">
    <h2 id="mj">${judul}</h2><div id="mi">${isi}</div>
    <p style="text-align:right"><button type="button" class="btn alt" id="mt">Tutup</button></p></div>`;
  document.body.appendChild(bg);
  $("#mt", bg).onclick = tutup;
  bg.onclick = e => { if (e.target === bg) tutup(); };
  ($("input", bg) || $("#mt", bg)).focus();
  return bg;
}
function tutup() { const m = $("#modal"); if (m) m.remove(); }
document.addEventListener("keydown", e => { if (e.key === "Escape") tutup(); });

/* Validasi: tandai field + tampilkan pesan error di bawahnya */
function cek(el, ok, pesan) {
  el.classList.toggle("err", !ok);
  let m = el.nextElementSibling;
  if (!m || !m.classList.contains("msg")) { m = document.createElement("small"); m.className = "msg"; el.after(m); }
  m.textContent = ok ? "" : pesan;
  return ok;
}

function tabel(kolom, baris) {
  return `<div class="scroll"><table><thead><tr>${kolom.map(k => `<th>${k}</th>`).join("")}</tr></thead><tbody>${
    baris.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

/* ===== 1. Login ===== */
function initLogin() {
  const f = $("#formLogin");
  f.onsubmit = e => {
    e.preventDefault();
    const em = f.email.value.trim().toLowerCase();
    const a = cek(f.email, emailOk(em), "Format email tidak valid");
    const b = cek(f.password, f.password.value.length >= 6, "Password minimal 6 karakter");
    if (!a || !b) return;
    const u = semuaUser().find(x => x.email === em && x.password === f.password.value);
    if (!u) { modal("Login gagal", "<p>Email/password yang Anda masukkan salah.</p>"); return; }
    sessionStorage.setItem("sesi", JSON.stringify({ nama: u.nama, email: u.email }));
    location.href = "dashboard.html";
  };

  $("#btnLupa").onclick = () => {
    const m = modal("Lupa password", `<form id="fLupa" novalidate><label for="em">Email terdaftar</label>
      <input id="em" name="em" type="email" autocomplete="email"><p><button class="btn">Kirim tautan reset</button></p></form>`);
    $("#fLupa", m).onsubmit = e => {
      e.preventDefault();
      const i = e.target.em, v = i.value.trim().toLowerCase();
      if (!cek(i, emailOk(v), "Format email tidak valid")) return;
      if (!cek(i, semuaUser().some(u => u.email === v), "Email belum terdaftar")) return;
      $("#mi", m).innerHTML = `<p>Tautan reset password dikirim ke <b>${esc(v)}</b> (simulasi).</p>`;
    };
  };

  $("#btnDaftar").onclick = () => {
    const m = modal("Daftar akun", `<form id="fDaftar" novalidate>
      <label for="dn">Nama lengkap</label><input id="dn" name="nama">
      <label for="de">Email</label><input id="de" name="email" type="email">
      <label for="dp">Password</label><input id="dp" name="pw" type="password" autocomplete="new-password">
      <label for="dq">Ulangi password</label><input id="dq" name="pw2" type="password" autocomplete="new-password">
      <p><button class="btn">Buat akun</button></p></form>`);
    $("#fDaftar", m).onsubmit = e => {
      e.preventDefault();
      const f2 = e.target, em = f2.email.value.trim().toLowerCase();
      const ok = [
        cek(f2.nama, f2.nama.value.trim().length >= 3, "Nama minimal 3 karakter"),
        cek(f2.email, emailOk(em) && !semuaUser().some(u => u.email === em), "Email tidak valid atau sudah terdaftar"),
        cek(f2.pw, f2.pw.value.length >= 6, "Password minimal 6 karakter"),
        cek(f2.pw2, f2.pw2.value === f2.pw.value, "Password tidak sama")
      ];
      if (ok.includes(false)) return;
      simpan("userBaru", ambil("userBaru", []).concat({ nama: f2.nama.value.trim(), email: em, password: f2.pw.value }));
      $("#mi", m).innerHTML = `<p>Akun <b>${esc(em)}</b> berhasil dibuat. Silakan login.</p>`;
    };
  };
}

/* ===== 2. Dashboard ===== */
function salam() {
  const j = new Date().getHours();
  return j < 11 ? "Selamat pagi" : j < 15 ? "Selamat siang" : j < 18 ? "Selamat sore" : "Selamat malam";
}
function initDashboard(user) {
  $("#salam").textContent = `${salam()}, ${user.nama}!`;
  $("#jam").textContent = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
  $("#btnHistory").onclick = () => modal("History Transaksi",
    tabel(["ID", "Tanggal", "Item", "Total", "Status"], semuaTrx().map(x => [x.id, x.tanggal, x.item, rp(x.total), x.status])), true);
  $("#btnLaporan").onclick = () => {
    const t = semuaTrx(), total = t.reduce((a, x) => a + x.total, 0), per = {};
    t.forEach(x => per[x.status] = (per[x.status] || 0) + 1);
    modal("Laporan Pemesanan", `<p>Jumlah pesanan: <b>${t.length}</b><br>Total nilai: <b>${rp(total)}</b><br>
      Rata-rata per pesanan: <b>${rp(Math.round(total / (t.length || 1)))}</b></p>` +
      tabel(["Status", "Jumlah pesanan"], Object.entries(per)), true);
  };
}

/* ===== 3. Stok / Katalog ===== */
function barisBuku(b) {
  const tr = document.createElement("tr");
  const c = document.createElement("td"), d = document.createElement("div");
  d.className = "cover"; d.textContent = b.judul[0];
  if (b.gambar) { const img = new Image(); img.alt = ""; img.onerror = () => img.remove(); img.src = b.gambar; d.appendChild(img); }
  c.appendChild(d); tr.appendChild(c);
  [b.kode, b.judul, b.kategori, rp(b.harga), b.stok].forEach((v, i) => {
    const t = document.createElement("td"); t.textContent = v;
    if (i === 4 && b.stok < 10) t.className = "low";
    tr.appendChild(t);
  });
  return tr;
}
function initStok() {
  const data = semuaBuku(), tb = $("#isiStok"), f = $("#formStok"), cari = $("#cari");
  function render() {
    tb.replaceChildren();
    const q = cari.value.toLowerCase();
    const hasil = data.filter(b => (b.judul + b.kode + b.kategori).toLowerCase().includes(q));
    hasil.forEach(b => tb.appendChild(barisBuku(b)));
    $("#ringkas").textContent = hasil.length ? `${hasil.length} judul, total stok ${hasil.reduce((a, b) => a + b.stok, 0)}` : "Tidak ada buku yang cocok dengan pencarian.";
  }
  f.onsubmit = e => {
    e.preventDefault();
    const kode = f.kode.value.trim().toUpperCase(), judul = f.judul.value.trim(), kat = f.kategori.value.trim();
    const harga = Number(f.harga.value), stok = Number(f.stok.value);
    const ok = [
      cek(f.kode, /^BK-\d{3}$/.test(kode) && !data.some(b => b.kode === kode), "Format BK-001 dan belum dipakai"),
      cek(f.judul, judul.length >= 3, "Judul minimal 3 karakter"),
      cek(f.kategori, kat.length >= 3, "Isi kategori"),
      cek(f.harga, harga > 0, "Harga harus lebih dari 0"),
      cek(f.stok, f.stok.value !== "" && Number.isInteger(stok) && stok >= 0, "Stok bilangan bulat 0 atau lebih")
    ];
    if (ok.includes(false)) return;
    const b = { kode, judul, kategori: kat, harga, stok, gambar: "" };
    data.push(b); simpan("stokBaru", ambil("stokBaru", []).concat(b));
    cari.value = ""; render(); f.reset();
    tb.lastElementChild.classList.add("baru");
    modal("Stok ditambahkan", `<p><b>${esc(judul)}</b> masuk ke katalog (baris disorot kuning).</p>`);
  };
  cari.oninput = render; render();
}

/* ===== 4. Checkout ===== */
function initCheckout() {
  const katalog = semuaBuku(), sel = $("#pilihBuku"), tb = $("#isiKeranjang"), f = $("#formPesan");
  katalog.forEach(b => sel.add(new Option(`${b.judul} - ${rp(b.harga)} (stok ${b.stok})`, b.kode)));
  let keranjang = JSON.parse(sessionStorage.getItem("keranjang") || "[]"), sub = 0;
  const simpanK = () => sessionStorage.setItem("keranjang", JSON.stringify(keranjang));
  const ongkir = () => (+f.ekspedisi.selectedOptions[0].dataset.ongkir || 0) + (f.paket.value === "Express" ? 10000 : 0);
  function ringkas() {
    $("#subtotal").textContent = rp(sub); $("#ongkir").textContent = rp(ongkir()); $("#total").textContent = rp(sub + ongkir());
  }
  function gambar() {
    tb.replaceChildren(); sub = 0;
    keranjang.forEach((it, i) => {
      const b = katalog.find(x => x.kode === it.kode), s = b.harga * it.qty; sub += s;
      const tr = tb.insertRow();
      tr.insertCell().textContent = b.judul;
      tr.insertCell().textContent = rp(b.harga);
      const q = document.createElement("input");
      q.type = "number"; q.min = 1; q.max = b.stok; q.value = it.qty; q.setAttribute("aria-label", "Jumlah " + b.judul);
      q.onchange = () => {
        const v = parseInt(q.value);
        if (!(v >= 1 && v <= b.stok)) { modal("Jumlah tidak valid", `<p>Jumlah harus 1 sampai ${b.stok}.</p>`); q.value = it.qty; return; }
        it.qty = v; simpanK(); gambar();
      };
      tr.insertCell().appendChild(q);
      tr.insertCell().textContent = rp(s);
      const h = document.createElement("button");
      h.type = "button"; h.className = "btn del"; h.textContent = "Hapus";
      h.onclick = () => { keranjang.splice(i, 1); simpanK(); gambar(); };
      tr.insertCell().appendChild(h);
    });
    $("#kosong").hidden = keranjang.length > 0;
    ringkas();
  }
  $("#btnTambah").onclick = () => {
    const qty = $("#qty"), b = katalog.find(x => x.kode === sel.value), n = parseInt(qty.value);
    const ok = [cek(sel, !!b, "Pilih buku terlebih dahulu"), cek(qty, n >= 1, "Jumlah minimal 1")];
    if (ok.includes(false)) return;
    const ada = keranjang.find(x => x.kode === b.kode), jml = (ada ? ada.qty : 0) + n;
    if (jml > b.stok) { modal("Stok tidak cukup", `<p>Stok <b>${esc(b.judul)}</b> hanya ${b.stok}.</p>`); return; }
    if (ada) ada.qty = jml; else keranjang.push({ kode: b.kode, qty: n });
    simpanK(); gambar();
  };
  f.ekspedisi.onchange = f.paket.onchange = ringkas;
  f.onsubmit = e => {
    e.preventDefault();
    const v = n => f[n].value.trim();
    const ok = [
      cek(f.nama, v("nama").length >= 3, "Nama minimal 3 karakter"),
      cek(f.email, emailOk(v("email")), "Format email tidak valid"),
      cek(f.telepon, /^08\d{8,11}$/.test(v("telepon")), "Diawali 08, total 10-13 digit"),
      cek(f.alamat, v("alamat").length >= 10, "Alamat minimal 10 karakter"),
      cek(f.ekspedisi, !!f.ekspedisi.value, "Pilih ekspedisi"),
      cek(f.bayar, !!f.bayar.value, "Pilih metode pembayaran")
    ];
    if (ok.includes(false)) return;
    if (!keranjang.length) { modal("Keranjang kosong", "<p>Tambahkan minimal satu buku sebelum memesan.</p>"); return; }
    const noDO = "DO" + Date.now().toString().slice(-8), tot = sub + ongkir(), p = ambil("pesananBaru", []);
    p.push({
      id: noDO, nama: v("nama"), tanggal: new Date().toISOString().slice(0, 10),
      item: keranjang.map(i => katalog.find(x => x.kode === i.kode).judul + " x" + i.qty).join(", "),
      total: tot, status: "Diproses", ekspedisi: f.ekspedisi.value, paket: f.paket.value
    });
    simpan("pesananBaru", p);
    modal("Pesanan berhasil", `<p>Terima kasih, ${esc(v("nama"))}.</p><p>Nomor Delivery Order: <b>${noDO}</b></p>
      <p>Total ${rp(tot)} via ${esc(f.bayar.value)}.</p><p><a href="tracking.html">Lacak pesanan ini</a></p>`);
    keranjang = []; simpanK(); f.reset(); gambar();
  };
  gambar();
}

/* ===== 5. Tracking ===== */
const LANGKAH = ["Pesanan diproses", "Dikemas", "Dalam perjalanan", "Diterima"];
function initTracking() {
  const hasil = $("#hasil");
  $("#formCari").onsubmit = e => {
    e.preventDefault();
    const inp = $("#noDO"), v = inp.value.trim().toUpperCase();
    if (!cek(inp, v.length >= 5, "Masukkan nomor Delivery Order (minimal 5 karakter)")) return;
    const baru = ambil("pesananBaru", []).map(p => ({ noDO: p.id, nama: p.nama, status: 0, ekspedisi: p.ekspedisi, tanggal: p.tanggal, paket: p.paket, total: p.total }));
    const d = dataTracking.concat(baru).find(x => x.noDO === v);
    if (!d) { hasil.hidden = true; modal("Data tidak ditemukan", `<p>Nomor DO <b>${esc(v)}</b> tidak terdaftar.</p>`); return; }
    const pct = d.status / (LANGKAH.length - 1) * 100;
    hasil.innerHTML = `<h2>${esc(d.noDO)}</h2><p>Pemesan: <b>${esc(d.nama)}</b></p><p>Status: <b>${LANGKAH[d.status]}</b></p>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:0"></i></div>
      <ol class="steps">${LANGKAH.map((l, i) => `<li class="${i <= d.status ? "done" : ""}">${l}</li>`).join("")}</ol>
      <table><tr><th>Ekspedisi</th><td>${esc(d.ekspedisi)}</td></tr><tr><th>Tanggal kirim</th><td>${esc(d.tanggal)}</td></tr>
      <tr><th>Jenis paket</th><td>${esc(d.paket)}</td></tr><tr><th>Total pembayaran</th><td>${rp(d.total)}</td></tr></table>`;
    hasil.hidden = false;
    requestAnimationFrame(() => { $(".bar i", hasil).style.width = pct + "%"; });
  };
}

/* ===== Router sederhana + guard login ===== */
(function () {
  const halaman = document.body.dataset.page;
  const user = JSON.parse(sessionStorage.getItem("sesi") || "null");
  if (halaman !== "login" && !user) { location.replace("index.html"); return; }
  const lo = $("#logout");
  if (lo) lo.onclick = () => { sessionStorage.removeItem("sesi"); location.href = "index.html"; };
  ({ login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking }[halaman])(user);
})();
