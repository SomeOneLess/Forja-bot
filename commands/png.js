'use strict';

const sharp = require('sharp');
const { reply, downloadMedia } = require('../helpers/messages');

module.exports = {
  png: async ({ sock, jid, msg }) => {
    try {
      const { buffer, type } = await downloadMedia(sock, msg);
      if (type !== 'sticker') {
        await reply(sock, jid, { text: 'Respondé a un sticker con .png' }, msg);
        return;
      }
      const png = await sharp(buffer).png().toBuffer();
      await reply(sock, jid, { image: png, caption: 'Convertido a PNG' }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ ${err.message}` }, msg);
    }
  }
};
