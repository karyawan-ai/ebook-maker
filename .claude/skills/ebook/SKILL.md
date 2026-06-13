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
| 6 | `karyawan_ai` (MCP) | Generate cover image + ilustrasi per bab (opsional) |

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
- **Gambar** — tanyakan dua hal ini secara eksplisit:
  1. *"Apakah ingin cover image dibuatkan otomatis berdasarkan judul dan tema buku?"*
  2. *"Apakah ingin ilustrasi pembuka dibuatkan untuk tiap bab?"*

### 2. Buat outline
Susun daftar bab dengan ringkasan tiap bab (1-2 kalimat) plus poin-poin kunci.
**Tunjukkan outline ke user dan minta persetujuan/revisi sebelum menulis isi.**
Jangan lanjut menulis bab sampai outline disetujui.

### 3. Generate gambar (jika user minta)

Gunakan MCP `karyawan_ai` — tool `karyawan_gen_run`. Jika user tidak tahu mau
model apa, gunakan default **Imagen 4 Fast** (`google/imagen-4.0-fast-generate-001`).
Tampilkan pilihan model berikut ke user jika mereka ingin pilih sendiri:

| Model | Slug | Harga | Kapan pakai |
|---|---|---|---|
| Imagen 4 Fast | `google/imagen-4.0-fast-generate-001` | $0.048/gambar | Draft cepat, hemat |
| Imagen 4 | `google/imagen-4.0-generate-001` | $0.096/gambar | Kualitas standar (default) |
| Imagen 4 Ultra | `google/imagen-4.0-ultra-generate-001` | $0.144/gambar | Kualitas tertinggi |
| Flux Pro 1.1 | `bfl/flux-pro-1.1` | $0.096/gambar | Detail artistik tinggi |
| Recraft v4 | `recraft/recraft-v4` | $0.096/gambar | Gaya grafis/vektor bersih |

**Cover ebook** (jika user setuju):
1. Buat prompt deskriptif: sertakan tema buku, nuansa/mood, gaya visual (misal:
   *"professional book cover, [tema], minimalist design, [warna dominan], high quality"*).
2. Jalankan `karyawan_gen_run` dengan `aspectRatio: "3:4"`.
3. Simpan URL hasil ke `book.json` → field `"coverImage": "<url>"`.
   Cover otomatis muncul di halaman judul .docx saat build.

**Ilustrasi per bab** (jika user setuju):
1. Untuk tiap bab, buat prompt dari judul bab + 1-2 poin isi utamanya.
2. Jalankan `karyawan_gen_run` dengan `aspectRatio: "16:9"`.
3. Sisipkan di baris pertama file `.md` bab tersebut:
   ```
   ![Ilustrasi bab](URL_GAMBAR)
   ```
   Gambar otomatis masuk ke .docx saat build.

> Catatan: "Gemini" tidak tersedia sebagai model image generation di karyawan_ai.
> Model Google yang tersedia adalah Imagen 4 (kualitas setara, dari Google DeepMind).

### 4. Scaffold folder ebook
Buat strukturnya. Cara tercepat:

```bash
npm run new -- "Judul Ebook"
```

Itu membuat `books/<slug>/` dengan `book.json`, `outline.md`, dan satu contoh bab.
Lalu **edit `book.json`** (isi `subtitle`, `author`, `language`) dan tulis ulang
`outline.md` sesuai hasil langkah 2. Boleh juga membuat file-file ini langsung
tanpa script jika lebih praktis.

### 5. Tulis bab demi bab
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

### 6. Build ke .docx

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
