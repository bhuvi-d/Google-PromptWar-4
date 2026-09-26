import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const publicDir = resolve('public');
mkdirSync(publicDir, { recursive: true });
copyFileSync(
  resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs'),
  resolve(publicDir, 'pdf.worker.min.mjs'),
);
