'use strict';

const { reply } = require('../helpers/messages');

module.exports = {
  tr: async ({ sock, jid, msg, args }) => {
    if (!args) {
      await reply(sock, jid, { text: 'Uso: .tr texto a traducir' }, msg);
      return;
    }
    try {
      const q = encodeURIComponent(args.slice(0, 500));
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=es|en`);
      const data = await res.json();
      const translated = data?.responseData?.translatedText || 'No se pudo traducir.';
      await reply(sock, jid, { text: `🌐 *Traducción:*\n${translated}` }, msg);
    } catch {
      await reply(sock, jid, { text: '⚠️ Error al traducir.' }, msg);
    }
  }
};
