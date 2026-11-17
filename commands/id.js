'use strict';

const { reply } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  id: async ({ sock, jid, msg }) => {
    const tipo = isGroupJid(jid) ? 'Grupo' : 'Chat';
    await reply(sock, jid, {
      text: `🆔 *${tipo} ID:*\n\`${jid}\`\n\nCopiá este JID y ponelo en config.js como DESTINO si querés que los reenvíos vayan acá.`
    }, msg);
  },
  gid: async (ctx) => module.exports.id(ctx)
};
