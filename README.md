# 📖 ebook-maker

Template **Claude Code** untuk menulis ebook secara interaktif bersama Claude, lalu
meng-compile-nya menjadi file **Word (`.docx`)** yang siap pakai.

Kamu menulis dengan Markdown (atau biarkan Claude yang menulis), satu file per bab.
Tooling Node/TypeScript menggabungkan semuanya jadi satu dokumen `.docx` lengkap
dengan halaman judul, bab yang mulai di halaman baru, dan nomor halaman.

## Cara pakai (dengan Claude Code)

1. Clone repo ini dan buka di Claude Code:
   ```bash
   git clone <url-repo> && cd ebook-maker
   npm install
   ```
2. Minta Claude membuat ebook, misalnya:
   > "Buatkan ebook panduan investasi reksadana untuk pemula."

   Claude akan memakai skill **`ebook`**: menggali kebutuhan, menyusun outline,
   menulis tiap bab, lalu mem-build `.docx`.
3. File jadi ada di `books/<slug>/dist/<slug>.docx`.

## Cara pakai (manual / tanpa Claude)

```bash
npm install
npm run new -- "Judul Ebook Kamu"   # buat kerangka di books/<slug>/
# edit books/<slug>/book.json dan tulis bab di books/<slug>/chapters/*.md
npm run build -- <slug>             # compile jadi .docx
```

## Struktur sebuah ebook

```
books/<slug>/
├── book.json          metadata: title, subtitle, author, language, chapters[]
├── outline.md         kerangka ebook
├── chapters/          satu file .md per bab (urut: 01-, 02-, ...)
│   ├── 01-pendahuluan.md
│   └── 02-....md
└── dist/<slug>.docx   hasil build
```

### `book.json`

```json
{
  "title": "Judul Ebook",
  "subtitle": "Subjudul opsional",
  "author": "Nama Penulis",
  "language": "id",
  "chapters": []
}
```

- `chapters` kosong → semua `chapters/*.md` dipakai urut menurut nama file.
- `chapters` diisi (mis. `["01-intro.md", "02-dasar.md"]`) → memaksa urutan itu.

## Menulis bab

- Satu file Markdown = satu bab.
- Awali tiap file dengan `# Judul Bab`.
- Markdown yang didukung: heading, **tebal**, *miring*, list, blockquote, tabel,
  link, dan lainnya (GitHub-flavored Markdown).

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run new -- "Judul"` | Scaffold ebook baru |
| `npm run list` | Daftar semua ebook di repo |
| `npm run build -- <slug>` | Compile ebook jadi `.docx` |

## Catatan

- Butuh **Node.js 18+**.
- Halaman judul, page break per bab, dan nomor halaman dibuat otomatis.
- Untuk Daftar Isi yang bisa di-update: buka `.docx` di Word → Insert → Table of
  Contents (heading sudah memakai style Word, jadi langsung terdeteksi).

## Lisensi

MIT
# ebook-maker
