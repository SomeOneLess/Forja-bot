'use strict';

const { reply, isGroupAdmin } = require('../helpers/messages');
const { isGroupJid } = require('../utils');

module.exports = {
  spam: async ({ sock, jid, msg, args, sender, isFromMe }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
      await reply(sock, jid, { text: 'Solo administradores pueden usar este comando.' }, msg);
      return;
    }

    const parts = (args || '').trim().split(/\s+/);
    const count = Number.parseInt(parts[0], 10);
    const text = parts.slice(1).join(' ').trim();

    if (!Number.isInteger(count) || count < 1 || count > 100 || !text) {
      await reply(sock, jid, {
        text: 'Uso: .spam 50 hola\n(mínimo 1, máximo 100)'
      }, msg);
      return;
    }

    try {
      const meta = await sock.groupMetadata(jid);
      const ids = meta.participants.map(p => p.id).filter(Boolean);

      // Primer mensaje con menciones para bypassear silencio
      await sock.sendMessage(jid, {
        text: text,
        mentions: ids
      });

      // El resto sin menciones (para no spamear notificaciones infinitas)
      for (let i = 1; i < count; i++) {
        await sock.sendMessage(jid, { text });
        // Pequeña pausa para no saturar
        if (i % 10 === 0) await new Promise(r => setTimeout(r, 300));
      }

      console.log(`[spam] ${count}x "${text}" en ${jid}`);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ Error al spamear: ${err.message}` }, msg);
    }
  }
};
