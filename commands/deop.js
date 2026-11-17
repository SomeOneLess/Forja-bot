'use strict';

const { reply, isGroupAdmin, getQuotedKey } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  deop: async ({ sock, jid, msg, sender, isFromMe }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
      await reply(sock, jid, { text: 'Solo los administradores pueden usar este comando.' }, msg);
      return;
    }
    const quotedKey = getQuotedKey(msg);
    const target = quotedKey?.participant;
    if (!target) {
      await reply(sock, jid, { text: 'Citá a alguien para usar este comando.' }, msg);
      return;
    }
    try {
      await sock.groupParticipantsUpdate(jid, [target], 'demote');
      await reply(sock, jid, { text: `⬇️ @${target.split('@')[0]} ya no es admin.`, mentions: [target] }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ No pude cambiar el rol: ${err.message}` }, msg);
    }
  }
};
