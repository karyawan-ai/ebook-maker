import { listBookSlugs, loadBook } from './lib.js';

async function main() {
  const slugs = await listBookSlugs();
  if (!slugs.length) {
    console.log('Belum ada ebook. Bikin: npm run new -- "Judul Ebook"');
    return;
  }
  console.log('Ebook di repo ini:\n');
  for (const slug of slugs) {
    try {
      const book = await loadBook(slug);
      console.log(`  ${slug}`);
      console.log(`    judul : ${book.meta.title}`);
      console.log(`    bab   : ${book.chapterFiles.length}`);
    } catch (err) {
      console.log(`  ${slug}  (⚠ ${(err as Error).message})`);
    }
  }
}

main();
