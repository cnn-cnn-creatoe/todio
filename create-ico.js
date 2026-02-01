import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 24, 32, 48, 64, 128, 256];

async function computeTrimRect(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = info.channels;

  let minX = w, minY = h, maxX = -1, maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * channels;
      const alpha = data[idx + 3];
      if (alpha !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Fully transparent or already tight
  if (maxX < minX || maxY < minY) return null;
  if (minX === 0 && minY === 0 && maxX === w - 1 && maxY === h - 1) return null;

  return {
    left: minX,
    top: minY,
    width: (maxX - minX) + 1,
    height: (maxY - minY) + 1,
  };
}

async function createIco() {
  const inputPath = path.join(__dirname, 'build', 'icon.png');
  const outputPath = path.join(__dirname, 'build', 'icon.ico');
  
  const trimRect = await computeTrimRect(inputPath);
  const base = trimRect ? sharp(inputPath).extract(trimRect) : sharp(inputPath);

  // Create resized PNG buffers
  const pngs = await Promise.all(
    sizes.map(size => 
      base
        .clone()
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  
  // Create ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(sizes.length, 4); // Number of images
  
  // Create directory entries
  const dirEntries = [];
  let dataOffset = 6 + (16 * sizes.length);
  
  for (let i = 0; i < sizes.length; i++) {
    const entry = Buffer.alloc(16);
    const size = sizes[i] >= 256 ? 0 : sizes[i];
    entry.writeUInt8(size, 0); // Width
    entry.writeUInt8(size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngs[i].length, 8); // Image size
    entry.writeUInt32LE(dataOffset, 12); // Offset
    dirEntries.push(entry);
    dataOffset += pngs[i].length;
  }
  
  // Combine all buffers
  const ico = Buffer.concat([header, ...dirEntries, ...pngs]);
  fs.writeFileSync(outputPath, ico);
  
  console.log('Created icon.ico with sizes:', sizes.join(', '));
}

createIco().catch(console.error);
