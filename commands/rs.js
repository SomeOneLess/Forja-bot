'use strict';

const { reply, downloadMedia } = require('../helpers/messages');

module.exports = {
  rs: async ({ sock, jid, msg }) => {
    try {
      const { buffer, type } = await downloadMedia(sock, msg);
      if (type !== 'image') {
        await reply(sock, jid, { text: 'Respondé a una *foto* con este comando.' }, msg);
        return;
      }
      await reply(sock, jid, { image: buffer }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ No pude reenviar la foto: ${err.message}` }, msg);
    }
  }
};
