# ebook-maker

Repo ini adalah template Claude Code untuk menulis **ebook** lalu meng-compile-nya
menjadi file **.docx**. Saat user ingin membuat ebook/buku/panduan, gunakan skill
**`ebook`** (`.claude/skills/ebook/SKILL.md`) yang memandu seluruh alurnya.

## Skill yang tersedia
- **`ebook`** — orkestrator end-to-end (gali ide → outline → tulis → build).
- **`judul-buku`** — judul + subjudul persuasif format transformasi.
- **`deskripsi-buku`** — deskripsi/blurb pemasaran (`description.md`).
- **`bab-buku`** — susun daftar bab; **wajib tanya user mau berapa bab**.
- **`sub-bab`** — pecah satu bab jadi sub-bab (heading `##` di file bab).
- **`isi-sub-bab`** — tulis isi penuh satu sub-bab.

Tiap skill bisa dipanggil sendiri (`/<nama>`) atau dirangkai berurutan untuk
membuat ebook utuh.

## Cara kerja singkat
- Tiap ebook hidup di `books/<slug>/`: `book.json` (metadata) + `chapters/*.md` (isi per bab).
- Tooling Node/TypeScript (`src/`, dijalankan via `tsx`) meng-compile Markdown → `.docx`.
- Output di `books/<slug>/dist/<slug>.docx`.

## Perintah
- `npm install` — pasang dependency (sekali di awal).
- `npm run new -- "Judul Ebook"` — scaffold ebook baru.
- `npm run list` — daftar ebook yang ada.
- `npm run build -- <slug>` — compile ebook jadi `.docx`.

## Konvensi menulis
- Satu file `.md` = satu bab, diberi nomor urut (`01-`, `02-`, ...) di `chapters/`.
- Tiap bab diawali `# Judul Bab`. Subjudul pakai `##`/`###`.
- Tulis isi yang utuh dan substantif, bukan placeholder. Jaga konsistensi nada & istilah antarbab.
- Selalu tunjukkan outline ke user dan minta persetujuan sebelum menulis isi bab.
