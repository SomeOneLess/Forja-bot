'use strict';

const { reply, isGroupAdmin } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  silencio: async ({ sock, jid, msg, args, sender, isFromMe }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
      await reply(sock, jid, { text: 'Solo los administradores pueden usar este comando.' }, msg);
      return;
    }
    if (!['on', 'off'].includes((args || '').toLowerCase())) {
      await reply(sock, jid, { text: 'Uso: .silencio on (solo admins hablan) o .silencio off' }, msg);
      return;
    }
    try {
      if (args.toLowerCase() === 'on') {
        await sock.groupSettingUpdate(jid, 'announcement');
        await reply(sock, jid, { text: '🔇 *Grupo silenciado*\nSolo los administradores pueden enviar mensajes.' }, msg);
      } else {
        await sock.groupSettingUpdate(jid, 'not_announcement');
        await reply(sock, jid, { text: '🔊 *Grupo abierto*\nTodos los miembros pueden enviar mensajes.' }, msg);
      }
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ No pude cambiar el ajuste: ${err.message}\nAsegurate de que el bot sea admin.` }, msg);
    }
  }
};
