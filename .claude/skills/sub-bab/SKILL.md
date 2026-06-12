---
name: sub-bab
description: Memecah satu bab buku menjadi sub-bab (struktur bagian dalam bab) yang mengalir logis. Sub-bab ditulis sebagai heading "##" di dalam file bab. Gunakan saat user ingin membuat sub-bab, bagian, atau kerangka detail dari sebuah bab.
---

# Skill: Bikin Sub-Bab

Tujuan: memecah satu bab menjadi beberapa **sub-bab** yang mengalir runtut, sehingga
isi bab mudah ditulis dan mudah diikuti pembaca.

## 1. Pilih bab & pahami tujuannya
Tentukan bab mana yang sedang dikerjakan (mis. `chapters/03-....md`). Ingat kembali
**tujuan bab** itu dari daftar bab: pembaca harus bisa/paham apa setelah bab ini.

## 2. Susun sub-bab
- Pecah bab jadi **3-6 sub-bab** (sesuaikan dengan bobot materi). Boleh tanya user
  kalau ingin jumlah tertentu, kalau tidak, tentukan yang paling pas untuk materinya.
- Tiap sub-bab adalah satu gagasan/langkah utuh, urut dari pengantar → inti → penerapan.
- Pola yang baik dalam satu bab: buka (kenapa penting) → konsep/langkah → contoh/praktik
  → ringkasan atau jembatan ke bab berikutnya.

## 3. Untuk tiap sub-bab tuliskan
- **Judul sub-bab** (heading `##`).
- **Ringkasan poin** singkat: sub-bab ini membahas apa (jadi panduan saat mengisi).

## 4. Tulis ke file bab
Tambahkan sub-bab sebagai heading `##` di dalam file bab terkait, di bawah judul `#`.
Contoh `chapters/03-membangun-kebiasaan.md`:
```markdown
# Membangun Kebiasaan yang Bertahan

## Kenapa Kebiasaan Lama Selalu Kembali
> Ringkasan: jebakan motivasi vs sistem.

## Aturan 1% Setiap Hari
> Ringkasan: kekuatan perbaikan kecil yang konsisten.

## Merancang Lingkungan Pemicu
> Ringkasan: mengubah lingkungan agar kebiasaan baik jadi default.
```
Isi tiap sub-bab (paragraf lengkap) ditulis di tahap berikutnya dengan [isi-sub-bab].
Tunjukkan kerangka sub-bab ke user untuk persetujuan sebelum mengisi.

Posisi pipeline: [judul-buku] → [deskripsi-buku] → [bab-buku] → **sub-bab** → [isi-sub-bab].
