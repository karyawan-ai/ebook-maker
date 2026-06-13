import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Root repo (satu level di atas src/). */
export const REPO_ROOT = path.resolve(__dirname, '..');
export const BOOKS_DIR = path.join(REPO_ROOT, 'books');

/** Metadata sebuah ebook, disimpan di books/<slug>/book.json */
export interface BookMeta {
  /** Judul ebook (wajib). */
  title: string;
  /** Subjudul opsional, tampil di halaman judul. */
  subtitle?: string;
  /** Nama penulis. */
  author?: string;
  /** Bahasa isi, mis. "id" atau "en". Hanya untuk metadata dokumen. */
  language?: string;
  /**
   * Urutan bab eksplisit (nama file di dalam folder chapters/).
   * Kalau dikosongkan, semua *.md di chapters/ dipakai urut menurut nama file.
   */
  chapters?: string[];
  /** URL gambar cover ebook (opsional). Ditampilkan di halaman judul .docx. */
  coverImage?: string;
}

export interface LoadedBook {
  slug: string;
  dir: string;
  meta: BookMeta;
  chapterFiles: string[]; // path absolut, sudah terurut
}

/** Ubah teks bebas jadi slug aman-folder: "Judul Keren!" -> "judul-keren". */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'untitled';
}

export async function listBookSlugs(): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(BOOKS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const slugs: string[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const metaPath = path.join(BOOKS_DIR, e.name, 'book.json');
    try {
      await fs.access(metaPath);
      slugs.push(e.name);
    } catch {
      /* bukan folder ebook yang valid, lewati */
    }
  }
  return slugs.sort();
}

export async function loadBook(slug: string): Promise<LoadedBook> {
  const dir = path.join(BOOKS_DIR, slug);
  const metaPath = path.join(dir, 'book.json');

  let meta: BookMeta;
  try {
    meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  } catch (err) {
    throw new Error(
      `Tidak bisa membaca ${path.relative(REPO_ROOT, metaPath)}. ` +
        `Pastikan folder books/${slug}/ ada dan punya book.json yang valid.\n  (${(err as Error).message})`,
    );
  }
  if (!meta.title) {
    throw new Error(`book.json untuk "${slug}" tidak punya field "title".`);
  }

  const chaptersDir = path.join(dir, 'chapters');
  let chapterFiles: string[];
  if (meta.chapters && meta.chapters.length > 0) {
    chapterFiles = meta.chapters.map((f) => path.join(chaptersDir, f));
  } else {
    let files: string[] = [];
    try {
      files = (await fs.readdir(chaptersDir)).filter((f) => f.endsWith('.md'));
    } catch {
      throw new Error(`Folder bab tidak ditemukan: books/${slug}/chapters/`);
    }
    chapterFiles = files
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => path.join(chaptersDir, f));
  }

  if (chapterFiles.length === 0) {
    throw new Error(`Belum ada file bab (.md) di books/${slug}/chapters/`);
  }

  return { slug, dir, meta, chapterFiles };
}
