'use strict';

const { YONUNCA } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  yonunca: async ({ sock, jid, msg }) => {
    await reply(sock, jid, {
      text: `🍷 *YO NUNCA...*\n\n${pick(YONUNCA)}\n\nLos que sí lo hicieron, reaccionen o se anoten.`
    }, msg);
  }
};
