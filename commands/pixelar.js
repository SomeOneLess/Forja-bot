'use strict';

const sharp = require('sharp');
const { reply, downloadMedia } = require('../helpers/messages');

module.exports = {
  pixelar: async ({ sock, jid, msg }) => {
    try {
      const { buffer } = await downloadMedia(sock, msg);
      const meta = await sharp(buffer, { failOn: 'none' }).rotate().metadata();
      const w = meta.width || 512;
      const h = meta.height || 512;
      const factor = 16;
      const small = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .resize(Math.max(1, Math.floor(w / factor)), Math.max(1, Math.floor(h / factor)), { kernel: 'nearest' })
        .toBuffer();
      const out = await sharp(small)
        .resize(w, h, { kernel: 'nearest' })
        .png()
        .toBuffer();
      await reply(sock, jid, { image: out }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ ${err.message}` }, msg);
    }
  }
};
