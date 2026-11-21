export const MAX_BYTES = 4 * 1024 * 1024;
export const modes = ['compress', 'thumbnail', 'grayscale'];
export async function readImage(stream) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream || []) {
    size += chunk.length;
    if (size > MAX_BYTES) throw new RangeError('Image exceeds 4 MiB.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, size);
}
