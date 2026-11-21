import { createHash, timingSafeEqual } from 'node:crypto';
import sharp from 'sharp';
import { MAX_BYTES, modes, readImage } from '../lib/image-input.js';

const digest = value => createHash('sha256').update(value).digest();
const fail = (status, error) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
const signatures = {
  'image/jpeg': b => b[0] === 255 && b[1] === 216 && b[2] === 255,
  'image/png': b => b.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a','hex')),
  'image/webp': b => b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WEBP',
};
export default { async fetch(request) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const key = process.env.IMAGE_API_KEY;
  if (!key) return fail(503, 'Image service is not configured.');
  if (!timingSafeEqual(digest(request.headers.get('authorization') || ''), digest(`Bearer ${key}`))) return fail(401, 'Unauthorized.');
  const type = request.headers.get('content-type')?.split(';')[0].trim();
  if (!Object.hasOwn(signatures, type)) return fail(415, 'Send JPEG, PNG, or WebP bytes.');
  const mode = new URL(request.url).searchParams.get('mode') ?? 'compress';
  if (!modes.includes(mode)) return fail(400, 'Unsupported mode.');
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return fail(413, 'Image exceeds 4 MiB.');
  let input;
  try { input = await readImage(request.body); } catch (e) { return fail(e instanceof RangeError ? 413 : 400, 'Cannot read image.'); }
  if (!signatures[type](input)) return fail(415, 'Image type does not match its contents.');
  try {
    const side = mode === 'thumbnail' ? 320 : 1600;
    const pipeline = sharp(input, { limitInputPixels: 24_000_000 }).rotate().resize(side, side, { fit: 'inside', withoutEnlargement: true }).flatten({ background: '#fff' });
    if (mode === 'grayscale') pipeline.grayscale();
    const output = await pipeline.jpeg({ quality: 78 }).toBuffer();
    return new Response(output, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return fail(422, 'Invalid image or image exceeds 24 megapixels.'); }
} };
