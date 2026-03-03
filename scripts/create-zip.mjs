import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../out');
const zipPath = '/tmp/trustedskills-deploy.zip';

const output = createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${zipPath} (${archive.pointer()} bytes)`);
});

archive.on('error', (err) => {
  console.error('Archive error:', err);
  process.exit(1);
});

archive.pipe(output);
archive.directory(outDir, false);
await archive.finalize();
