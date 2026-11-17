'use strict';

const { SHIP_FRASES } = require('../content');
const { reply, getMentions } = require('../helpers/messages');
const { pick, randomInt, shuffle, isGroupJid } = require('../utils');

module.exports = {
  ship: async ({ sock, jid, msg }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    try {
      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants.filter(p => p.id && !p.id.includes(sock.user?.id?.split(':')[0]));

      let p1, p2;
      const mentions = getMentions(msg);

      if (mentions.length >= 2) {
        p1 = mentions[0];
        p2 = mentions[1];
      } else if (mentions.length === 1) {
        p1 = mentions[0];
        const others = participants.filter(p => p.id !== p1);
        p2 = pick(others)?.id;
      } else {
        const shuffled = shuffle(participants);
        p1 = shuffled[0]?.id;
        p2 = shuffled[1]?.id;
      }

      if (!p1 || !p2) {
        await reply(sock, jid, { text: 'No encontré suficientes personas para shipear.' }, msg);
        return;
      }

      const percent = randomInt(101);
      const frase = pick(SHIP_FRASES);
      let emoji = '💔';
      if (percent >= 80) emoji = '🔥💘';
      else if (percent >= 60) emoji = '❤️';
      else if (percent >= 40) emoji = '💛';
      else if (percent >= 20) emoji = '💙';

      await reply(sock, jid, {
        text: `${emoji} *SHIP*\n\n@${p1.split('@')[0]}  +  @${p2.split('@')[0]}\n\nCompatibilidad: *${percent}%*\n\n_${frase}_`,
        mentions: [p1, p2]
      }, msg);
    } catch (err) {
      await reply(sock, jid, { text: `⚠️ No pude shipear: ${err.message}` }, msg);
    }
  }
};
