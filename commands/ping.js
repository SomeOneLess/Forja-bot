'use strict';

const { reply } = require('../helpers/messages');

module.exports = {
  ping: async ({ sock, jid, msg }) => {
    const start = Date.now();
    const sent = await reply(sock, jid, { text: '🏓 Pong. Calculando...' }, msg);
    const ms = Date.now() - start;
    await sock.sendMessage(jid, {
      text: `🏓 Pong. Delay: *${ms} ms*`,
      edit: sent.key
    });
  }
};
