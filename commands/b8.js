'use strict';

const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  b8: async ({ sock, jid, msg, args }) => {
    if (!args) {
      await reply(sock, jid, { text: 'Ejemplo: .b8 ¿sale asado el domingo?' }, msg);
      return;
    }
    const respuestas = [
      'Sí, sin dudas.', 'Todo apunta a que sí.', 'Probablemente.',
      'No cuentes con eso.', 'Las señales dicen que no.',
      'Preguntá de nuevo más tarde.', 'No puedo asegurarlo.', 'Es mejor que no.'
    ];
    await reply(sock, jid, { text: `🎱 ${pick(respuestas)}` }, msg);
  }
};
