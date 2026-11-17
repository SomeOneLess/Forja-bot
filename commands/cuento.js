'use strict';

const { CUENTOS_INICIO } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  cuento: async ({ sock, jid, msg }) => {
    await reply(sock, jid, {
      text: `📖 *Cuento colaborativo*\n\n${pick(CUENTOS_INICIO)}\n\nCada uno agrega una línea.`
    }, msg);
  }
};
