'use strict';

const { reply, isGroupAdmin } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  todos: async ({ sock, jid, msg, args, sender, isFromMe }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
      await reply(sock, jid, { text: 'Solo los administradores pueden usar este comando.' }, msg);
      return;
    }
    const meta = await sock.groupMetadata(jid);
    const ids = meta.participants.map(p => p.id).filter(Boolean);
    const textMsg = args || 'Atención.';
    await sock.sendMessage(jid, { text: textMsg, mentions: ids });
  }
};
