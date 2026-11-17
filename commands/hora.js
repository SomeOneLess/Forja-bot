'use strict';

const { reply } = require('../helpers/messages');

module.exports = {
  hora: async ({ sock, jid, msg }) => {
    const hora = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    await reply(sock, jid, { text: `🕒 ${hora}` }, msg);
  }
};
