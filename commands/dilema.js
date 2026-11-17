'use strict';

const { DILEMAS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  dilema: async ({ sock, jid, msg }) => {
    await reply(sock, jid, {
      text: `⚖️ *DILEMA*\n${pick(DILEMAS)}\n\n¿Qué elegirían y por qué?`
    }, msg);
  }
};
