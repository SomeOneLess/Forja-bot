'use strict';

const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  adivina: async ({ sock, jid, msg }) => {
    const secretos = [
      'un personaje de película', 'un objeto de la cocina', 'un lugar famoso',
      'una posición sexual', 'un fetiche', 'una marca de cerveza',
      'un actor porno', 'un lugar para tener sexo'
    ];
    const categoria = pick(secretos);
    await reply(sock, jid, {
      text: `❓ *Adivinanza*\n\nEstoy pensando en *${categoria}*.\n\nHagan preguntas de sí/no.`
    }, msg);
  }
};
