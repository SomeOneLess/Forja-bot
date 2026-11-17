'use strict';

const { VERDADES, RETOS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  vr: async ({ sock, jid, msg }) => {
    const tipo = Math.random() < 0.5 ? 'verdad' : 'reto';
    if (tipo === 'verdad') {
      await reply(sock, jid, { text: `🫣 *VERDAD*\n${pick(VERDADES)}` }, msg);
    } else {
      await reply(sock, jid, { text: `🔥 *RETO*\n${pick(RETOS)}` }, msg);
    }
  }
};
