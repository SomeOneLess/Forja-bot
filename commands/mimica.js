'use strict';

const { MIMICAS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick, isGroupJid } = require('../utils');

module.exports = {
  mimica: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona en grupos.' }, msg);
      return;
    }
    try {
      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants.filter(p => p.id);
      const elegido = pick(participants);
      await reply(sock, jid, {
        text: `🎭 *Mímica*\n\n@${elegido.id.split('@')[0]} tiene que:\n\n👉 *${pick(MIMICAS)}*\n\n(En la llamada, claro)`,
        mentions: [elegido.id]
      }, msg);
    } catch {
      await reply(sock, jid, { text: 'No pude elegir a alguien.' }, msg);
    }
  }
};
