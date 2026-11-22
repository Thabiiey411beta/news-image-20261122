// Entry for make.fun news-image-20261122: "Sum up 22 November's world news
// in one image". The front page (entry.png, 1024x1024, drawn in scratch
// with PIL for Sunday 22 November 2026) is copied to the output directory
// exactly as shipped, after a PNG-magic check so a corrupt file can never
// pass silently. Node 22, standard library only, no network.
//
// Run outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = new URL('./entry.png', import.meta.url);
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const DEST = join(OUT_DIR, 'entry.png');

// The output directory may not exist yet when the program is run outside
// the grader, so create it first; inside the grader /output already exists
// and this is a no-op.
mkdirSync(OUT_DIR, { recursive: true });

// PNG files start with the 8-byte signature 89 50 4E 47 0D 0A 1A 0A.
// Refuse to ship anything that is not a PNG.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const bytes = readFileSync(SRC);
if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

copyFileSync(SRC, DEST);
console.log(`wrote ${DEST} (${bytes.length} bytes)`);
