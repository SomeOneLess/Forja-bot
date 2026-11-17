'use strict';

const { CATEGORIAS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  categoria: async ({ sock, jid, msg }) => {
    const cat = pick(CATEGORIAS);
    const letra = pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    await reply(sock, jid, {
      text: `📝 *Categoría:* ${cat}\n🔤 *Letra:* ${letra}\n\nEmpieza quien quiera. Pierde quien tarda demasiado o repite.`
    }, msg);
  }
};
