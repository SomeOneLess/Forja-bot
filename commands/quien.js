'use strict';

const { reply } = require('../helpers/messages');
const { pick, isGroupJid } = require('../utils');

module.exports = {
  quien: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    try {
      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants.filter(p => p.id);
      if (!participants.length) {
        await reply(sock, jid, { text: 'No pude obtener los miembros.' }, msg);
        return;
      }
      const elegido = pick(participants);
      await reply(sock, jid, {
        text: `🎲 Elegido al azar: @${elegido.id.split('@')[0]}`,
        mentions: [elegido.id]
      }, msg);
    } catch {
      await reply(sock, jid, { text: 'No pude elegir a alguien.' }, msg);
    }
  }
};
