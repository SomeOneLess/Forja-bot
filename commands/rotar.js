'use strict';

const sharp = require('sharp');
const { reply, downloadMedia } = require('../helpers/messages');

module.exports = {
  rotar: async ({ sock, jid, msg, args }) => {
    try {
      const { buffer } = await downloadMedia(sock, msg);
      const angle = args ? Number(args) : 90;
      if (![90, 180, 270].includes(angle)) {
        await reply(sock, jid, { text: 'Usá .rotar 90, 180 o 270.' }, msg);
        return;
      }
      const out = await sharp(buffer, { failOn: 'none' }).rotate().rotate(angle).png().toBuffer();
      await reply(sock, jid, { image: out }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ ${err.message}` }, msg);
    }
  }
};
