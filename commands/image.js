import { MAX_BYTES, modes, readImage } from '../lib/image-input.js';

export default {
  name: 'image', description: 'Compress, thumbnail, or grayscale a photo',
  async execute({ sock, message, args, prefix, reply }) {
    const content = message.message?.ephemeralMessage?.message || message.message;
    const photo = content?.imageMessage || content?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    const mode = args[0]?.toLowerCase() || 'compress';
    if (!photo || !modes.includes(mode) || args.length > 1) return reply(`Caption a photo or reply to one with ${prefix}image [compress|thumbnail|grayscale].`);
    if (!process.env.IMAGE_API_KEY) return reply('The bot owner needs to configure the image service.');
    if (Number(photo.fileLength) > MAX_BYTES) return reply('Please send a photo under 4 MiB.');
    try {
      const url = new URL(process.env.IMAGE_API_URL || 'https://whatsappbot-steel.vercel.app/api/image');
      if (url.protocol !== 'https:') throw new Error('HTTPS required');
      url.searchParams.set('mode', mode);
      const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
      const stream = await downloadContentFromMessage(photo, 'image', { options: { timeout: 15000 } });
      const response = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000), headers: { authorization: `Bearer ${process.env.IMAGE_API_KEY}`, 'content-type': photo.mimetype || 'image/jpeg' }, body: await readImage(stream) });
      if ([400,413,415,422].includes(response.status)) return reply('Please send a valid JPEG, PNG, or WebP under 4 MiB and 24 megapixels.');
      if (!response.ok || response.headers.get('content-type') !== 'image/jpeg') throw new Error('Service unavailable');
      const image = await readImage(response.body);
      await sock.sendMessage(message.key.remoteJid, { image, mimetype: 'image/jpeg', caption: `Image: ${mode}` }, { quoted: message });
    } catch (err) { return reply(err instanceof RangeError ? 'Please send a smaller photo.' : 'Could not process this photo. Please try again later.'); }
  },
};
