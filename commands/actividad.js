'use strict';

const { ACTIVITY_FILE } = require('../config');
const { reply } = require('../helpers/messages');
const { readJson, isGroupJid } = require('../utils');

module.exports = {
  actividad: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    try {
      const data = readJson(ACTIVITY_FILE, {});
      const groupData = data[jid] || {};
      const sorted = Object.entries(groupData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      if (!sorted.length) {
        await reply(sock, jid, { text: 'Todavía no hay datos de actividad en este grupo.' }, msg);
        return;
      }

      const lines = sorted.map(([user, count], i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        return `${medal} @${user.split('@')[0]} — *${count}* mensajes`;
      });

      await reply(sock, jid, {
        text: `📊 *Top 10 actividad del grupo*\n\n${lines.join('\n')}`,
        mentions: sorted.map(([user]) => user)
      }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ Error al leer actividad: ${err.message}` }, msg);
    }
  },
  top: async (ctx) => module.exports.actividad(ctx)
};
