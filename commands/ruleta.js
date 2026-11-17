'use strict';

const { RULETA_TAREAS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick, isGroupJid } = require('../utils');

module.exports = {
  ruleta: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona en grupos.' }, msg);
      return;
    }
    try {
      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants.filter(p => p.id);
      const elegido = pick(participants);
      await reply(sock, jid, {
        text: `🎰 *Ruleta*\n\nLe tocó a @${elegido.id.split('@')[0]}:\n\n👉 *${pick(RULETA_TAREAS)}*`,
        mentions: [elegido.id]
      }, msg);
    } catch {
      await reply(sock, jid, { text: 'No pude elegir a alguien.' }, msg);
    }
  }
};
