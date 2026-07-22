import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve(process.argv[2] || 'reference/assets/raw');
const outputDir = path.resolve(process.argv[3] || 'src/assets/products');
await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(inputDir).catch(() => []);
for (const file of files) {
  if (!/\.(png|jpe?g|webp|tiff?)$/i.test(file)) continue;
  const input = path.join(inputDir, file);
  const base = path.parse(file).name.replace(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase();
  const image = sharp(input).rotate();
  for (const size of [320, 640, 1200, 1800]) {
    await image.clone().resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(path.join(outputDir, `${base}-${size}.webp`));
  }
  await image.clone().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 58 })
    .toFile(path.join(outputDir, `${base}-1200.avif`));
}
console.log(`Normalized ${files.length} source files.`);
