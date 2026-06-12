---
name: bab-buku
description: Menyusun daftar bab (outline tingkat bab) sebuah buku/ebook sebagai perjalanan transformasi dari kondisi awal pembaca ke hasil akhir. WAJIB menanyakan ke user mau berapa banyak bab. Gunakan saat user ingin membuat kerangka bab, daftar isi, atau struktur buku.
---

# Skill: Bikin Bab Buku (Daftar Bab)

Tujuan: menyusun daftar bab yang membentuk **alur transformasi** — tiap bab memajukan
pembaca satu langkah dari kondisi BEFORE menuju AFTER.

## 1. WAJIB: tanya jumlah bab dulu
Sebelum menyusun apa pun, **tanyakan ke user mau berapa banyak bab.**
Beri rekomendasi singkat untuk membantu memilih:
- Ebook ringkas / lead magnet: **3-5 bab**
- Ebook standar: **6-10 bab**
- Buku panduan lengkap: **10-15 bab**

Jangan lanjut sebelum jumlah bab disepakati.

## 2. Susun bab sebagai perjalanan
Petakan dari titik awal pembaca ke tujuan akhir, lalu bagi menjadi sejumlah bab itu.
Pola umum yang mengalir baik:
1. Bab pembuka — kenapa ini penting / janji transformasi / mindset.
2. Bab fondasi — dasar/konsep yang harus dipahami dulu.
3. Bab inti (beberapa) — langkah/metode utama, urut dari mudah ke lanjut.
4. Bab penerapan — praktik, contoh, mengatasi hambatan.
5. Bab penutup — konsolidasi, langkah selanjutnya, ajakan bertindak.

## 3. Untuk tiap bab, tuliskan
- **Judul bab** yang menarik (boleh berorientasi hasil, bukan sekadar topik).
- **Ringkasan 1-2 kalimat** — bab ini tentang apa.
- **Tujuan**: setelah bab ini, pembaca bisa/paham apa.

**Tunjukkan seluruh daftar bab ke user dan minta persetujuan/revisi** sebelum membuat file.

## 4. Buat file & metadata
Setelah disetujui, untuk tiap bab buat file di `books/<slug>/chapters/` dengan
penomoran urut dan heading judul:
```
chapters/01-<slug-bab>.md   →  isinya diawali  "# Judul Bab"
chapters/02-<slug-bab>.md   →  "# Judul Bab"
...
```
Isi awal cukup judul `# ...` plus ringkasan singkat sebagai komentar/blockquote;
sub-bab dan isinya ditulis di tahap berikutnya. Catat juga kerangka ke `outline.md`,
dan (opsional) daftarkan urutan eksplisit di `book.json` → `chapters`.

Lanjutan: untuk memecah tiap bab jadi sub-bab gunakan [sub-bab], lalu isi dengan [isi-sub-bab].

Posisi pipeline: [judul-buku] → [deskripsi-buku] → **bab-buku** → [sub-bab] → [isi-sub-bab].
