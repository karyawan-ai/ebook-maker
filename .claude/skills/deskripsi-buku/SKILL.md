---
name: deskripsi-buku
description: Menulis deskripsi/blurb buku yang menjual — teks untuk sampul belakang atau halaman penjualan yang membuat orang ingin membaca. Gunakan saat user ingin membuat deskripsi buku, sinopsis pemasaran, atau blurb.
---

# Skill: Deskripsi Buku (Blurb yang Menjual)

Tujuan: menulis deskripsi yang membuat calon pembaca merasa *"buku ini untukku"* dan
ingin membacanya. Bukan ringkasan netral, tapi teks persuasif berbasis transformasi.

## 1. Gali bahan (pakai yang sudah ada dari judul; tanya yang kurang)
- Pembaca sasaran, kondisi BEFORE (masalah), kondisi AFTER (hasil).
- 3-5 hal konkret yang akan pembaca dapatkan/pelajari.
- Apa yang membuat buku ini berbeda / kredibilitas penulis (kalau ada).

## 2. Struktur deskripsi
Tulis mengalir, bukan kaku. Urutannya:
1. **Hook** (1-2 kalimat) — sentuh masalah/keinginan pembaca, bisa berupa pertanyaan
   atau pernyataan tajam. *"Capek kerja keras tapi tabungan jalan di tempat?"*
2. **Empati/agitasi** (2-3 kalimat) — tunjukkan kamu paham situasi mereka, perdalam sedikit.
3. **Janji transformasi** (1-2 kalimat) — perkenalkan buku sebagai jalan keluar:
   dari [before] menuju [after].
4. **Apa yang akan kamu dapatkan** — 3-5 poin bullet, tiap poin berbasis hasil.
5. **Untuk siapa buku ini** — 1 kalimat penegasan sasaran.
6. **Penutup/ajakan** (1 kalimat) — dorong untuk mulai membaca sekarang.

## 3. Prinsip
- Gunakan **"kamu"** — bicara langsung ke pembaca.
- Manfaat & hasil, bukan daftar fitur. Konkret dan spesifik.
- Singkat: idealnya 120-200 kata. Mudah dipindai.
- Nada selaras dengan isi buku & judul.

## 4. Simpan
Tulis ke `books/<slug>/description.md`. File ini untuk pemasaran (sampul belakang /
halaman jualan), terpisah dari isi buku. Sampaikan ke user dan minta revisi bila perlu.

Posisi pipeline: [judul-buku] → **deskripsi-buku** → [bab-buku] → [sub-bab] → [isi-sub-bab].
