'use strict';

const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  moneda: async ({ sock, jid, msg }) => {
    await reply(sock, jid, { text: pick(['🪙 Cara', '🪙 Cruz']) }, msg);
  }
};
