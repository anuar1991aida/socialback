// utils/save-base64-file.ts
import { promises as fs } from 'fs';
import { join } from 'path';

export async function saveBase64File(base64: string, folder: string, filename: string): Promise<string> {
  let mimeType = 'image/png'; // значение по умолчанию
  let data = base64;

  // Если строка содержит префикс "data:image/..."
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (matches) {
    mimeType = matches[1];
    data = matches[2];
  }

  const ext = mimeType.split('/')[1];
  const buffer = Buffer.from(data, 'base64');

  const dir = join(__dirname, '..', '..', 'media', folder);
  await fs.mkdir(dir, { recursive: true });

  const filePath = join(dir, `${filename}.${ext}`);
  await fs.writeFile(filePath, buffer);

  // Возвращаем публичный URL
  return `/media/${folder}/${filename}.${ext}`;
}
