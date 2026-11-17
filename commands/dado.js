'use strict';

const { reply } = require('../helpers/messages');
const { randomInt } = require('../utils');

module.exports = {
  dado: async ({ sock, jid, msg, args }) => {
    const sides = Number.parseInt(args, 10) || 6;
    if (sides < 2 || sides > 100) {
      await reply(sock, jid, { text: 'Usá entre 2 y 100 caras. Ej: .dado 20' }, msg);
      return;
    }
    await reply(sock, jid, { text: `🎲 Salió ${randomInt(sides) + 1} (d${sides}).` }, msg);
  }
};
