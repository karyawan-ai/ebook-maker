import { promises as fs } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
// html-to-docx adalah CommonJS; default import lewat esModuleInterop.
import HTMLtoDOCX from 'html-to-docx';
import { REPO_ROOT, loadBook, listBookSlugs, type LoadedBook } from './lib.js';

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function titlePage(meta: LoadedBook['meta']): string {
  const parts = [
    `<h1 style="text-align:center;font-size:32pt;margin-top:180px;">${escapeHtml(meta.title)}</h1>`,
  ];
  if (meta.subtitle) {
    parts.push(
      `<p style="text-align:center;font-size:18pt;color:#555;">${escapeHtml(meta.subtitle)}</p>`,
    );
  }
  if (meta.author) {
    parts.push(
      `<p style="text-align:center;font-size:14pt;margin-top:120px;">${escapeHtml(meta.author)}</p>`,
    );
  }
  return parts.join('\n');
}

async function buildHtml(book: LoadedBook): Promise<string> {
  const sections: string[] = [titlePage(book.meta)];

  for (const file of book.chapterFiles) {
    let md: string;
    try {
      md = await fs.readFile(file, 'utf8');
    } catch {
      throw new Error(`File bab tidak ditemukan: ${path.relative(REPO_ROOT, file)}`);
    }
    const html = await marked.parse(md);
    // page-break-before bikin tiap bab mulai di halaman baru.
    sections.push(
      `<div style="page-break-before:always;"></div>\n${html}`,
    );
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${sections.join('\n')}</body></html>`;
}

async function build(slug: string): Promise<string> {
  const book = await loadBook(slug);
  const html = await buildHtml(book);

  const footer = `<p style="text-align:center;font-size:9pt;color:#999;">${escapeHtml(book.meta.title)}</p>`;

  const buffer: Buffer = await HTMLtoDOCX(html, footer, {
    title: book.meta.title,
    creator: book.meta.author || 'ebook-maker',
    lang: book.meta.language || 'id',
    font: 'Georgia',
    fontSize: 24, // half-points -> 12pt
    pageNumber: true,
    footer: true,
    margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  });

  const outDir = path.join(book.dir, 'dist');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.docx`);
  await fs.writeFile(outPath, buffer);
  return outPath;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    const slugs = await listBookSlugs();
    console.error('Pakai: npm run build -- <slug>\n');
    if (slugs.length) {
      console.error('Ebook yang tersedia:');
      for (const s of slugs) console.error(`  - ${s}`);
    } else {
      console.error('Belum ada ebook. Bikin dulu: npm run new -- "Judul Ebook"');
    }
    process.exit(1);
  }

  try {
    const outPath = await build(slug);
    console.log(`✓ Ebook dibuat: ${path.relative(REPO_ROOT, outPath)}`);
  } catch (err) {
    console.error(`✗ Gagal build "${slug}":`);
    console.error('  ' + (err as Error).message);
    process.exit(1);
  }
}

main();
