'use strict';

const { ESTADOS } = require('../content');
const { reply, getMentions } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  estado: async ({ sock, jid, msg, sender }) => {
    const estado = pick(ESTADOS);
    const target = getMentions(msg)[0] || sender;
    await reply(sock, jid, {
      text: `🌡️ *Estado actual de @${target.split('@')[0]}:*\n\n→ ${estado}`,
      mentions: [target]
    }, msg);
  }
};
