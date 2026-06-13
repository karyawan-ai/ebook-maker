import { promises as fs } from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { marked } from 'marked';

// html-to-docx memanggil console.warning() yang tidak ada di Node.js
(console as unknown as Record<string, unknown>).warning = console.warn;

import HTMLtoDOCX from 'html-to-docx';
import { REPO_ROOT, loadBook, listBookSlugs, type LoadedBook } from './lib.js';

marked.setOptions({ gfm: true, breaks: false });

/** Download URL ke buffer, follow redirect, dengan User-Agent header. */
async function downloadBuffer(url: string, redirectCount = 0): Promise<{ buf: Buffer; ext: string } | null> {
  if (redirectCount > 5) return null;
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      timeout: 20000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ebook-maker/1.0)' },
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadBuffer(res.headers.location, redirectCount + 1).then(resolve);
        return;
      }
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        console.error(`\n  ! Dilewati (HTTP ${res.statusCode}): ${url}`);
        resolve(null); return;
      }
      const ct = (res.headers['content-type'] || 'image/jpeg').split(';')[0].trim();
      const extMap: Record<string, string> = {
        'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
        'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/bmp': '.bmp',
      };
      const ext = extMap[ct] || path.extname(url.split('?')[0]) || '.jpg';
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve({ buf: Buffer.concat(chunks), ext }));
      res.on('error', () => { resolve(null); });
    });
    req.on('error', () => { console.error(`\n  ! Koneksi gagal: ${url}`); resolve(null); });
    req.on('timeout', () => { req.destroy(); console.error(`\n  ! Timeout: ${url}`); resolve(null); });
  });
}

/**
 * Download semua gambar eksternal ke folder temp, lalu jalankan HTTP server
 * lokal sementara yang serve folder itu. html-to-docx hanya bisa embed gambar
 * dari URL http/https — local path tidak didukung oleh node-fetch di dalamnya.
 *
 * Kembalikan { html, stopServer, cleanup } — panggil keduanya setelah build.
 */
async function embedImages(html: string): Promise<{
  html: string;
  stopServer: () => void;
  cleanup: () => Promise<void>;
}> {
  const tmpDir = path.join(REPO_ROOT, '.tmp-imgs-' + Date.now());
  await fs.mkdir(tmpDir, { recursive: true });

  // Kumpulkan URL unik yang perlu di-download
  const srcRegex = /src="([^"]+)"/g;
  const urls = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = srcRegex.exec(html)) !== null) {
    const src = m[1];
    if (!src.startsWith('data:') && (src.startsWith('http://') || src.startsWith('https://'))) {
      urls.add(src);
    }
  }

  // Download ke file temp dengan nama dan ekstensi yang benar
  const urlToFilename = new Map<string, string>();
  let idx = 0;
  for (const url of urls) {
    const result = await downloadBuffer(url);
    if (result) {
      const filename = `img_${idx++}${result.ext}`;
      await fs.writeFile(path.join(tmpDir, filename), result.buf);
      urlToFilename.set(url, filename);
    }
  }

  // Buat HTTP server lokal yang serve file dari tmpDir
  const port = await new Promise<number>((resolve, reject) => {
    const server = http.createServer((req, servRes) => {
      const filename = (req.url || '/').slice(1);
      const filePath = path.join(tmpDir, filename);
      const ext = path.extname(filename).toLowerCase();
      const mimeMap: Record<string, string> = {
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
      };
      servRes.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
      createReadStream(filePath).pipe(servRes);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      resolve(addr.port);
    });
    server.on('error', reject);
    // simpan referensi untuk stop
    (embedImages as unknown as { _server: typeof server })._server = server;
  });

  // Ganti src URL dengan localhost URL; kalau gagal download → hapus tag
  const newHtml = html.replace(/<img([^>]*)src="([^"]+)"([^>]*)>/g, (_tag, before, src, after) => {
    if (src.startsWith('data:')) return _tag;
    const filename = urlToFilename.get(src);
    if (filename) return `<img${before}src="http://127.0.0.1:${port}/${filename}"${after}>`;
    return ''; // hapus tag kalau download gagal
  });

  const stopServer = () => {
    const server = (embedImages as unknown as { _server: { close: () => void } })._server;
    if (server) server.close();
  };

  const cleanup = async () => {
    try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
  };

  return { html: newHtml, stopServer, cleanup };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Ambil judul bab (baris pertama heading # ) dari isi markdown. */
function extractChapterTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Tanpa Judul';
}

/** Halaman cover dengan gambar, judul, subjudul, penulis. */
function coverPage(meta: LoadedBook['meta']): string {
  const parts: string[] = [];
  parts.push('<div style="page-break-after:always;text-align:center;">');

  if (meta.coverImage) {
    parts.push(
      `<p style="margin-top:30px;margin-bottom:20px;">
        <img src="${meta.coverImage}" style="max-width:380px;max-height:480px;border-radius:4px;" />
      </p>`,
    );
  } else {
    parts.push('<p style="margin-top:120px;"></p>');
  }

  parts.push(
    `<h1 style="font-size:28pt;font-weight:bold;margin-bottom:12px;margin-top:${meta.coverImage ? '24px' : '0'};">${escapeHtml(meta.title)}</h1>`,
  );

  if (meta.subtitle) {
    parts.push(
      `<p style="font-size:16pt;color:#555555;margin-bottom:8px;font-style:italic;">${escapeHtml(meta.subtitle)}</p>`,
    );
  }

  if (meta.author) {
    parts.push(
      `<p style="font-size:13pt;margin-top:${meta.coverImage ? '32px' : '80px'};color:#333333;">${escapeHtml(meta.author)}</p>`,
    );
  }

  parts.push('</div>');
  return parts.join('\n');
}

/** Halaman Daftar Isi. */
function tocPage(chapters: { title: string; index: number }[]): string {
  const rows = chapters
    .map(
      (ch) =>
        `<tr>
          <td style="padding:6px 0;font-size:12pt;border:none;">
            <a href="#chapter-${ch.index}" style="text-decoration:none;color:#1a1a1a;">
              <span style="font-weight:bold;color:#555555;">BAB ${ch.index}</span>&nbsp;&nbsp;${escapeHtml(ch.title)}
            </a>
          </td>
        </tr>`,
    )
    .join('\n');

  return `
<div style="page-break-after:always;">
  <h1 style="font-size:22pt;font-weight:bold;border-bottom:2px solid #333333;padding-bottom:10px;margin-bottom:24px;letter-spacing:1px;">DAFTAR ISI</h1>
  <table style="width:100%;border-collapse:collapse;border:none;">
    ${rows}
  </table>
</div>`;
}

/** Render satu bab dengan label "BAB N" di atas judul. */
async function renderChapter(
  md: string,
  index: number,
  title: string,
): Promise<string> {
  // Ganti heading pertama (# Judul) dengan versi yang sudah di-style
  const mdWithoutH1 = md.replace(/^#\s+.+$/m, '').trimStart();
  const bodyHtml = await marked.parse(mdWithoutH1);

  return `
<div id="chapter-${index}" style="page-break-before:always;">
  <p style="font-size:11pt;font-weight:bold;color:#888888;letter-spacing:3px;margin-bottom:4px;margin-top:48px;text-transform:uppercase;">BAB ${index}</p>
  <h1 style="font-size:24pt;font-weight:bold;margin-top:0;margin-bottom:32px;padding-bottom:12px;border-bottom:1px solid #dddddd;">${escapeHtml(title)}</h1>
  ${bodyHtml}
</div>`;
}

async function buildHtml(book: LoadedBook): Promise<string> {
  const sections: string[] = [];

  // 1. Cover
  sections.push(coverPage(book.meta));

  // 2. Kumpulkan judul bab untuk TOC
  const chapterMeta: { title: string; index: number; md: string }[] = [];
  for (let i = 0; i < book.chapterFiles.length; i++) {
    let md: string;
    try {
      md = await fs.readFile(book.chapterFiles[i], 'utf8');
    } catch {
      throw new Error(
        `File bab tidak ditemukan: ${path.relative(REPO_ROOT, book.chapterFiles[i])}`,
      );
    }
    chapterMeta.push({ title: extractChapterTitle(md), index: i + 1, md });
  }

  // 3. Halaman TOC
  sections.push(tocPage(chapterMeta));

  // 4. Isi tiap bab
  for (const ch of chapterMeta) {
    sections.push(await renderChapter(ch.md, ch.index, ch.title));
  }

  const css = `
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.75; color: #1a1a1a; }
    h1 { font-size: 22pt; margin-top: 28px; margin-bottom: 12px; }
    h2 { font-size: 16pt; margin-top: 24px; margin-bottom: 8px; color: #222222; }
    h3 { font-size: 13pt; margin-top: 18px; margin-bottom: 6px; color: #333333; }
    p  { margin-top: 0; margin-bottom: 12px; text-align: justify; }
    ul, ol { margin-bottom: 12px; padding-left: 24px; }
    li { margin-bottom: 4px; }
    blockquote { border-left: 4px solid #cccccc; padding: 8px 16px; margin: 16px 0; color: #555555; font-style: italic; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
    th { background-color: #f2f2f2; font-weight: bold; padding: 8px 12px; border: 1px solid #cccccc; }
    td { padding: 7px 12px; border: 1px solid #dddddd; }
    img { max-width: 100%; height: auto; margin: 12px 0; }
    code { font-family: Courier New, monospace; font-size: 10pt; background: #f5f5f5; padding: 2px 4px; }
    pre  { background: #f5f5f5; padding: 12px; border-left: 3px solid #cccccc; margin: 12px 0; overflow: auto; }
  `;

  const rawHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${sections.join('\n')}</body></html>`;
  return rawHtml;
}

async function build(slug: string): Promise<string> {
  const book = await loadBook(slug);
  const rawHtml = await buildHtml(book);

  process.stdout.write('  Mengunduh gambar...');
  const { html, stopServer, cleanup } = await embedImages(rawHtml);
  console.log(' selesai.');

  const headerHtml = `<p style="font-size:9pt;color:#999999;text-align:right;font-style:italic;">${escapeHtml(book.meta.title)}${book.meta.author ? ' — ' + escapeHtml(book.meta.author) : ''}</p>`;
  const footerHtml = `<p style="font-size:9pt;color:#999999;text-align:center;"></p>`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await HTMLtoDOCX(html, headerHtml, {
    title: book.meta.title,
    subject: book.meta.subtitle || '',
    creator: book.meta.author || 'ebook-maker',
    lang: book.meta.language || 'id',
    font: 'Georgia',
    fontSize: 24,
    pageNumber: true,
    headerType: 'default' as const,
    skipFirstHeaderFooter: true,
    footer: true,
    margins: {
      top: 1440,
      right: 1440,
      bottom: 1440,
      left: 1440,
      header: 720,
      footer: 720,
      gutter: 0,
    },
    pageSize: {
      width: 12240,
      height: 15840,
    },
    table: {
      row: { cantSplit: false },
    },
  } as HTMLtoDOCX.DocumentOptions & { header?: boolean }, footerHtml);

  const outDir = path.join(book.dir, 'dist');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.docx`);
  await fs.writeFile(outPath, result as unknown as Buffer);
  stopServer();
  await cleanup();
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
    const relPath = path.relative(REPO_ROOT, outPath);
    console.log(`✓ Ebook berhasil dibuat: ${relPath}`);
    console.log(`  Daftar Isi otomatis di halaman 2.`);
    console.log(`  Header tiap halaman: judul buku.`);
    console.log(`  Nomor halaman di footer.`);
  } catch (err) {
    console.error(`✗ Gagal build "${slug}":`);
    console.error('  ' + (err as Error).message);
    process.exit(1);
  }
}

main();
