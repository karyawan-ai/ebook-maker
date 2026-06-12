---
name: ebook
description: Menulis ebook lengkap secara interaktif lalu meng-compile-nya menjadi file .docx. Gunakan saat user ingin membuat ebook, buku, panduan, atau dokumen panjang berbab — dari ide/topik sampai file Word siap pakai. Memandu dari penggalian ide, outline, penulisan bab demi bab, sampai build .docx.
---

# Skill: Membuat Ebook (output .docx)

Skill ini memandu pembuatan ebook dari nol sampai file `.docx`. Alur kerjanya:
**gali ide → outline → tulis per bab → build .docx**. Tiap bab disimpan sebagai
file Markdown, lalu di-compile jadi satu dokumen Word oleh tooling di repo ini.

Ini skill **orkestrator**. Untuk tiap tahap ada skill khusus yang lebih fokus dan
bisa dipanggil sendiri-sendiri (lewat `/<nama>`):

| Tahap | Skill | Fungsi |
|---|---|---|
| 1 | `judul-buku` | Judul + subjudul persuasif format transformasi |
| 2 | `deskripsi-buku` | Deskripsi/blurb yang menjual (`description.md`) |
| 3 | `bab-buku` | Daftar bab (menanyakan **berapa bab**) → file `chapters/` |
| 4 | `sub-bab` | Pecah tiap bab jadi sub-bab (heading `##`) |
| 5 | `isi-sub-bab` | Tulis isi penuh tiap sub-bab |

Saat menjalankan ebook end-to-end, ikuti urutan tahap di atas; rincian tiap tahap
ada di skill masing-masing.

Struktur tiap ebook ada di `books/<slug>/`:

```
books/<slug>/
├── book.json          metadata: title, subtitle, author, language, chapters[]
├── outline.md         kerangka ebook (referensi saat menulis)
├── chapters/          satu file .md per bab, urut menurut nama (01-, 02-, ...)
│   ├── 01-....md
│   └── 02-....md
└── dist/<slug>.docx   hasil build (otomatis dibuat)
```

## Langkah kerja

### 1. Gali kebutuhan
Sebelum menulis, pastikan tahu hal-hal ini. Tanyakan yang belum jelas (maks 2-3
pertanyaan sekaligus, jangan bertubi-tubi):
- **Topik & sudut pandang** — tentang apa, apa yang membuatnya beda.
- **Pembaca sasaran** — pemula/menengah/ahli; latar belakang mereka.
- **Tujuan** — pembaca bisa apa setelah selesai membaca.
- **Nada & gaya** — formal, santai, naratif, teknis, dsb.
- **Bahasa** — Indonesia/Inggris/lainnya.
- **Panjang** — perkiraan jumlah bab dan target kata per bab.

### 2. Buat outline
Susun daftar bab dengan ringkasan tiap bab (1-2 kalimat) plus poin-poin kunci.
**Tunjukkan outline ke user dan minta persetujuan/revisi sebelum menulis isi.**
Jangan lanjut menulis bab sampai outline disetujui.

### 3. Scaffold folder ebook
Buat strukturnya. Cara tercepat:

```bash
npm run new -- "Judul Ebook"
```

Itu membuat `books/<slug>/` dengan `book.json`, `outline.md`, dan satu contoh bab.
Lalu **edit `book.json`** (isi `subtitle`, `author`, `language`) dan tulis ulang
`outline.md` sesuai hasil langkah 2. Boleh juga membuat file-file ini langsung
tanpa script jika lebih praktis.

### 4. Tulis bab demi bab
Tulis tiap bab sebagai file Markdown di `chapters/`, diberi nomor urut:
`01-pendahuluan.md`, `02-....md`, dst. Aturan:
- Tiap file mulai dengan `# Judul Bab` (heading level 1) — ini jadi judul bab di .docx.
- Pakai `##`/`###` untuk subjudul, plus list, **tebal**, *miring*, blockquote, tabel.
- Tulis isi yang **substantif dan utuh**, bukan placeholder. Jaga konsistensi nada,
  istilah, dan sudut pandang antarbab. Rujuk `outline.md` agar tetap on-track.
- Untuk ebook panjang, tulis beberapa bab, lalu cek kembali ke user untuk umpan balik
  sebelum lanjut — jangan menulis 15 bab sekaligus tanpa checkpoint.

Kalau memakai urutan eksplisit, daftarkan nama file di `book.json` → `chapters`.
Kalau dikosongkan, urutan diambil otomatis dari nama file (numeric sort).

### 5. Build ke .docx

```bash
npm run build -- <slug>
```

Hasilnya di `books/<slug>/dist/<slug>.docx`. Sampaikan path-nya ke user.
Kalau ada error, baca pesannya — biasanya soal `book.json` tidak valid atau folder
`chapters/` kosong.

## Tips kualitas
- Halaman judul dibuat otomatis dari `title`/`subtitle`/`author` di `book.json`.
- Tiap bab otomatis mulai di halaman baru; nomor halaman ada di footer.
- Untuk daftar isi (TOC) yang bisa di-update di Word: heading sudah pakai style Word,
  jadi user bisa Insert → Table of Contents. (Belum dibuat otomatis.)
- Konsistensi terminologi penting di buku panjang — pertahankan istilah yang sama.

## Perintah cepat
- `npm run new -- "Judul"` — scaffold ebook baru
- `npm run list` — daftar ebook di repo
- `npm run build -- <slug>` — compile jadi .docx
