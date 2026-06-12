---
name: isi-sub-bab
description: Menulis isi/konten lengkap sebuah sub-bab buku — paragraf utuh yang substantif, bukan placeholder. Ditulis di bawah heading "##" yang sesuai di file bab. Gunakan saat user ingin menulis, mengembangkan, atau mengisi konten sub-bab.
---

# Skill: Isi Sub-Bab (Tulis Kontennya)

Tujuan: menulis isi penuh satu sub-bab — utuh, substantif, dan enak dibaca — di bawah
heading `##` yang sudah dibuat.

## 1. Konteks dulu
- Tentukan sub-bab mana (bab + judul `##`-nya) yang sedang ditulis.
- Ingat **nada, gaya, bahasa, dan pembaca sasaran** buku agar konsisten antarbagian.
- Ingat posisinya dalam alur transformasi: sub-bab ini memajukan pembaca ke arah mana.

## 2. Tulis isinya
Per sub-bab, target umum **300-800 kata** (sesuaikan kebutuhan). Bangun dari elemen:
- **Pembuka** yang menarik — pertanyaan, fakta, atau cerita pendek yang relevan.
- **Penjelasan inti** — gagasan utama, jelas dan terstruktur.
- **Contoh konkret / analogi / studi kasus** — bikin abstrak jadi nyata.
- **Langkah actionable** — bila relevan, beri langkah/tips yang bisa langsung dipakai
  (boleh pakai list bernomor, blockquote tips, atau tabel).
- **Jembatan/penutup** — sambungkan ke sub-bab atau bab berikutnya.

## 3. Prinsip kualitas
- **Isi nyata, bukan placeholder.** Tulis seakan ini buku jadi.
- Konsisten istilah & sudut pandang dengan bagian lain.
- Variasikan panjang kalimat; pakai subjudul kecil/list bila membantu keterbacaan.
- Hindari mengulang isi sub-bab lain; tiap bagian menambah sesuatu yang baru.
- Untuk buku panjang, tulis beberapa sub-bab lalu checkpoint ke user untuk umpan balik.

## 4. Tulis ke file
Isi konten **tepat di bawah heading `##`** sub-bab terkait di file bab (mis.
`chapters/03-....md`). Jangan mentimpa sub-bab lain. Setelah satu/beberapa sub-bab
selesai, tawarkan untuk build `.docx`: `npm run build -- <slug>`.

Posisi pipeline: [judul-buku] → [deskripsi-buku] → [bab-buku] → [sub-bab] → **isi-sub-bab**.
