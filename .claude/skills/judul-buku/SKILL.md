---
name: judul-buku
description: Membuat judul buku/ebook yang persuasif dengan format "transformasi" — menggambarkan perpindahan pembaca dari kondisi sekarang (masalah/before) ke kondisi yang diinginkan (hasil/after). Gunakan saat user ingin brainstorm, membuat, atau memilih judul dan subjudul buku yang menjual.
---

# Skill: Judul Buku Persuasif (format Transformasi)

Tujuan: menghasilkan judul yang menjanjikan **transformasi** — memindahkan pembaca
dari titik A (kondisi/masalah sekarang) ke titik B (hasil yang diinginkan). Judul
transformasi terasa personal, spesifik, dan menjual karena pembaca melihat dirinya
di dalamnya.

## 1. Gali bahan (tanya kalau belum jelas, maks 3 pertanyaan)
- **Siapa pembaca** — sebut jelas (mis. "karyawan yang ingin punya bisnis sampingan").
- **Kondisi BEFORE** — rasa sakit / masalah / frustrasi mereka sekarang.
- **Kondisi AFTER** — hasil/identitas baru yang mereka impikan.
- **Waktu / usaha** — seberapa cepat atau mudah (mis. "30 hari", "tanpa modal besar").
- **Mekanisme unik** — apa yang bikin pendekatan buku ini beda.

## 2. Pola judul transformasi (kombinasikan / variasikan)
- **Dari [Before] Menjadi [After]** — "Dari Karyawan Jadi Bos untuk Diri Sendiri"
- **Cara [After] Tanpa [Pengorbanan]** — "Cara Fasih Bahasa Inggris Tanpa Kursus Mahal"
- **[Hasil] dalam [Waktu]** — "Sehat & Bugar dalam 90 Hari"
- **Berhenti [Before], Mulai [After]** — "Berhenti Menunda, Mulai Bertindak"
- **Rahasia/Cetak Biru [After] untuk [Pembaca]** — "Cetak Biru Cuan untuk Pemula"
- **[Angka] Langkah dari [Before] ke [After]** — "7 Langkah dari Bingung Jadi Berani Investasi"

Prinsip: **spesifik mengalahkan umum**, **manfaat mengalahkan fitur**, hindari klise
kosong ("Sukses Luar Biasa"), pakai kata kerja & hasil yang konkret.

## 3. Sajikan & pilih
- Beri **7-10 kandidat** dengan sudut yang berbeda-beda (kecepatan, identitas baru,
  menghilangkan rasa sakit, status, dll).
- Untuk tiap kandidat kuat, tambahkan **subjudul** yang memperjelas mekanisme/benefit.
  Contoh: *"Dari Nol Jadi Penulis"* — sub: *"Panduan praktis menerbitkan buku pertamamu dalam 6 bulan."*
- Diskusikan dengan user, lalu finalisasi 1 judul + 1 subjudul.

## 4. Simpan
Tulis hasil final ke `books/<slug>/book.json`:
```json
{ "title": "Judul Final", "subtitle": "Subjudul Final" }
```
Kalau ebook belum dibuat, scaffold dulu: `npm run new -- "Judul Final"`, lalu rapikan `book.json`.

Lanjutan pipeline: [deskripsi-buku] → [bab-buku] → [sub-bab] → [isi-sub-bab].
