'use strict';

const { VERDADES } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  verdad: async ({ sock, jid, msg }) => {
    await reply(sock, jid, { text: `🫣 *VERDAD*\n${pick(VERDADES)}` }, msg);
  }
};
