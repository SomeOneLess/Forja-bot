'use strict';

const { reply } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  admins: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    const meta = await sock.groupMetadata(jid);
    const admins = meta.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    const lines = admins.map(p => `• @${p.id.split('@')[0]}`);
    await reply(sock, jid, {
      text: `🛡️ *Administradores*\n${lines.join('\n') || 'No pude obtener la lista.'}`,
      mentions: admins.map(p => p.id)
    }, msg);
  }
};
