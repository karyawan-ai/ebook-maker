import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BOOKS_DIR, REPO_ROOT, slugify, type BookMeta } from './lib.js';

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const title = process.argv.slice(2).join(' ').trim();
  if (!title) {
    console.error('Pakai: npm run new -- "Judul Ebook Kamu"');
    process.exit(1);
  }

  const slug = slugify(title);
  const dir = path.join(BOOKS_DIR, slug);
  if (await exists(dir)) {
    console.error(`✗ Folder books/${slug}/ sudah ada. Pilih judul lain atau edit yang sudah ada.`);
    process.exit(1);
  }

  const chaptersDir = path.join(dir, 'chapters');
  await fs.mkdir(chaptersDir, { recursive: true });

  const meta: BookMeta = {
    title,
    subtitle: '',
    author: '',
    language: 'id',
    chapters: [],
  };
  await fs.writeFile(path.join(dir, 'book.json'), JSON.stringify(meta, null, 2) + '\n');

  const outline = `# ${title}

> Outline ebook. Isi/atur ulang sesuai kebutuhan, lalu tulis tiap bab sebagai file di folder chapters/.

## Bab 1: Judul Bab Pertama
- Poin utama
- Poin pendukung

## Bab 2: Judul Bab Kedua
- ...
`;
  await fs.writeFile(path.join(dir, 'outline.md'), outline);

  const sample = `# Bab 1: Judul Bab Pertama

Tulis isi bab di sini menggunakan Markdown biasa.

## Subjudul

Paragraf, **tebal**, *miring*, dan daftar:

- Poin satu
- Poin dua
`;
  await fs.writeFile(path.join(chaptersDir, '01-pendahuluan.md'), sample);

  console.log(`✓ Ebook baru dibuat di books/${slug}/`);
  console.log(`  - ${path.relative(REPO_ROOT, path.join(dir, 'book.json'))}  (metadata: judul, penulis, urutan bab)`);
  console.log(`  - ${path.relative(REPO_ROOT, path.join(dir, 'outline.md'))}  (kerangka)`);
  console.log(`  - chapters/01-pendahuluan.md  (contoh bab)`);
  console.log(`\nBuild jadi .docx: npm run build -- ${slug}`);
}

main();
