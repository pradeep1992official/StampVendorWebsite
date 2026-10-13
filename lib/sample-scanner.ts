import { createConnection } from 'node:net';
import { ApiInputError } from '@/lib/api-input';

// File signatures supplement extension/MIME checks; ClamAV is still required.
export function validateSampleBytes(bytes: Buffer, type: string) {
  const valid = type === 'application/pdf' ? bytes.subarray(0, 5).toString() === '%PDF-'
    : type === 'image/jpeg' ? bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : type === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && validDocx(bytes);
  if (!valid) throw new ApiInputError('A sample does not match its file type. Upload a valid PDF, DOCX, JPG or PNG.');
}
function validDocx(bytes: Buffer): boolean {
  // Read ZIP central directory only: no extraction, bounded entries/uncompressed size, no macros/encryption.
  if (bytes.length < 22 || bytes.readUInt32LE(0) !== 0x04034b50) return false;
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (bytes.readUInt32LE(i) === 0x06054b50 && i + 22 + bytes.readUInt16LE(i + 20) === bytes.length) { end = i; break; }
  }
  if (end < 0 || bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) return false;
  const count = bytes.readUInt16LE(end + 10);
  let offset = bytes.readUInt32LE(end + 16), total = 0;
  if (!count || count > 1000 || count !== bytes.readUInt16LE(end + 8)) return false;
  const names = new Set<string>();
  for (let i = 0; i < count; i++) {
    if (offset + 46 > end || bytes.readUInt32LE(offset) !== 0x02014b50 || (bytes.readUInt16LE(offset + 8) & 1)) return false;
    total += bytes.readUInt32LE(offset + 24);
    const length = bytes.readUInt16LE(offset + 28), extra = bytes.readUInt16LE(offset + 30), comment = bytes.readUInt16LE(offset + 32);
    if (offset + 46 + length + extra + comment > end || total > 50 * 1024 * 1024) return false;
    const name = bytes.subarray(offset + 46, offset + 46 + length).toString('utf8');
    if (name.includes('..') || name.startsWith('/') || name.includes('\\') || /vbaProject|\.exe$|\.dll$/i.test(name)) return false;
    names.add(name); offset += 46 + length + extra + comment;
  }
  return names.has('[Content_Types].xml') && names.has('word/document.xml');
}
export async function scanSample(bytes: Buffer): Promise<void> {
  const host = process.env.CLAMAV_HOST;
  const port = Number(process.env.CLAMAV_PORT || 3310);
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535) throw new ApiInputError('Sample verification is temporarily unavailable. Your upload is saved; please retry submission later.', 503);
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host, port });
    let response = '', done = false;
    const finish = (error?: Error) => { if (done) return; done = true; clearTimeout(deadline); socket.destroy(); if (error) reject(error); else resolve(); };
    const unavailable = () => new ApiInputError('Sample verification is temporarily unavailable. Please retry later.', 503);
    const deadline = setTimeout(() => finish(unavailable()), 30_000);
    socket.on('error', () => finish(unavailable()));
    socket.on('end', () => { if (!done) finish(unavailable()); });
    socket.on('data', (chunk) => {
      response += chunk.toString();
      if (response.length > 4096) return finish(unavailable());
      if (!response.includes('\0') && !response.includes('\n')) return;
      if (/^stream: OK[\0\r\n]*$/.test(response)) finish();
      else if (/ FOUND[\0\r\n]*$/.test(response)) finish(new ApiInputError('A sample failed the security scan. Remove it and submit a clean sample.', 400));
      else finish(unavailable());
    });
    socket.on('connect', () => {
      socket.write('zINSTREAM\0');
      for (let offset = 0; offset < bytes.length; offset += 64 * 1024) {
        const chunk = bytes.subarray(offset, offset + 64 * 1024), header = Buffer.alloc(4);
        header.writeUInt32BE(chunk.length); socket.write(header); socket.write(chunk);
      }
      socket.write(Buffer.alloc(4));
    });
  });
}
