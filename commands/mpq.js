'use strict';

const { MAS_PROBABLE } = require('../content');
const { reply, getMentions } = require('../helpers/messages');
const { pick, shuffle, isGroupJid } = require('../utils');

module.exports = {
  mpq: async ({ sock, jid, msg, args }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    try {
      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants.filter(p => p.id && !p.id.includes(sock.user?.id?.split(':')[0]));
      const mentions = getMentions(msg);

      let titulo = '';
      let elegidos = [];

      if (args.includes('|')) {
        const parts = args.split('|').map(s => s.trim());
        titulo = parts[0] || pick(MAS_PROBABLE);
        elegidos = mentions.length ? mentions : [];
      } else if (args) {
        titulo = args;
        elegidos = mentions.length ? mentions : [];
      } else {
        titulo = pick(MAS_PROBABLE);
      }

      if (elegidos.length < 2) {
        const shuffled = shuffle(participants);
        const cantidad = Math.min(5, Math.max(3, shuffled.length));
        elegidos = shuffled.slice(0, cantidad).map(p => p.id);
      }

      const lista = elegidos.map((id, i) => `${i + 1}. @${id.split('@')[0]}`).join('\n');

      await reply(sock, jid, {
        text: `🤔 *¿Quién es más probable que...?*\n\n👉 *${titulo}*\n\n${lista}\n\nReaccionen o voten.`,
        mentions: elegidos
      }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ Error: ${err.message}` }, msg);
    }
  },
  masprobableque: async (ctx) => module.exports.mpq(ctx)
};
