'use strict';

const { reply } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  id: async ({ sock, jid, msg }) => {
    const tipo = isGroupJid(jid) ? 'Grupo' : 'Chat';
    await reply(sock, jid, {
      text: `🆔 *${tipo} ID:*\n\`${jid}\``
    }, msg);
  },
  gid: async (ctx) => module.exports.id(ctx)
};
