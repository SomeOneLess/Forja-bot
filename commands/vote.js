'use strict';

const { reply } = require('../helpers/messages');
const { splitOptions } = require('../utils');

module.exports = {
  vote: async ({ sock, jid, msg, args }) => {
    const parts = splitOptions(args);
    if (parts.length < 3) {
      await reply(sock, jid, { text: 'Uso: .vote ¿Qué hacemos? | Opción A | Opción B' }, msg);
      return;
    }
    const question = parts.shift();
    try {
      await sock.sendMessage(jid, {
        poll: {
          name: question,
          values: parts.slice(0, 12),
          selectableCount: 1
        }
      }, { quoted: msg });
    } catch {
      await reply(sock, jid, { text: 'No pude crear la encuesta.' }, msg);
    }
  }
};
