'use strict';

const { RETOS_GRUPALES } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  retogrupal: async ({ sock, jid, msg }) => {
    await reply(sock, jid, {
      text: `🔥 *RETO GRUPAL*\n\n${pick(RETOS_GRUPALES)}\n\n¿Se animan o se rajan?`
    }, msg);
  }
};
