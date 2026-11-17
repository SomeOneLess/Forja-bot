'use strict';

const { RETOS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  reto: async ({ sock, jid, msg }) => {
    await reply(sock, jid, { text: `🔥 *RETO*\n${pick(RETOS)}` }, msg);
  }
};
