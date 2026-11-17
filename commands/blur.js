'use strict';

const sharp = require('sharp');
const { reply, downloadMedia } = require('../helpers/messages');

module.exports = {
  blur: async ({ sock, jid, msg }) => {
    try {
      const { buffer } = await downloadMedia(sock, msg);
      const out = await sharp(buffer, { failOn: 'none' })
        .rotate()
        .blur(12)
        .png()
        .toBuffer();
      await reply(sock, jid, { image: out }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ ${err.message}` }, msg);
    }
  }
};
