'use strict';

const sharp = require('sharp');
const { reply, downloadMedia } = require('../helpers/messages');
const { splitOptions } = require('../utils');

module.exports = {
  meme: async ({ sock, jid, msg, args }) => {
    try {
      const { buffer } = await downloadMedia(sock, msg);
      const parts = splitOptions(args);
      if (parts.length < 1) {
        await reply(sock, jid, { text: 'Uso: respondé a una imagen con .meme ARRIBA | ABAJO' }, msg);
        return;
      }

      const top = (parts[0] || '').slice(0, 35).toUpperCase();
      const bottom = (parts[1] || '').slice(0, 35).toUpperCase();

      const escapeXml = (t) =>
        String(t)
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/"/g, '"');

      const base = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize(800, 800, { fit: 'cover' })
        .png()
        .toBuffer();

      const svgText = `
        <svg width="800" height="800">
          <style>
            .t { font-family: Arial, Helvetica, sans-serif; font-size: 48px; font-weight: bold; fill: white; stroke: black; stroke-width: 8px; paint-order: stroke; }
          </style>
          ${top ? `<text x="400" y="60" text-anchor="middle" class="t">${escapeXml(top)}</text>` : ''}
          ${bottom ? `<text x="400" y="760" text-anchor="middle" class="t">${escapeXml(bottom)}</text>` : ''}
        </svg>`;

      const overlay = await sharp(Buffer.from(svgText)).png().toBuffer();

      const out = await sharp(base)
        .composite([{ input: overlay }])
        .jpeg({ quality: 90 })
        .toBuffer();

      await reply(sock, jid, { image: out }, msg);
    } catch (err) {
      console.error('Error meme:', err);
      await reply(sock, jid, { text: `⚠️ No pude generar el meme: ${err.message}` }, msg);
    }
  }
};
