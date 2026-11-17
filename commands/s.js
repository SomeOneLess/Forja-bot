'use strict';

const { reply, downloadMedia } = require('../helpers/messages');
const { bufferToSticker } = require('../helpers/media');

module.exports = {
  sticker: async ({ sock, jid, msg }) => {
    try {
      const { buffer, type } = await downloadMedia(sock, msg);
      const stickerBuffer = await bufferToSticker(buffer, type);
      await reply(sock, jid, { sticker: stickerBuffer }, msg);
    } catch (err) {
      console.error('Error sticker:', err);
      await reply(sock, jid, {
        text: `⚠️ No pude crear el sticker: ${err.message}\n\nRespondé a una imagen, video, GIF o nota de video con .s`
      }, msg);
    }
  },
  s: async (ctx) => module.exports.sticker(ctx),
  stiker: async (ctx) => module.exports.sticker(ctx)
};
