'use strict';

const { RANKINGS } = require('../content');
const { reply } = require('../helpers/messages');
const { pick } = require('../utils');

module.exports = {
  ranking: async ({ sock, jid, msg }) => {
    await reply(sock, jid, {
      text: `📊 *Ranking del grupo*\n\nOrdenen de *más a menos* probable que:\n\n👉 *${pick(RANKINGS)}*\n\nVoten con replies o discutan.`
    }, msg);
  }
};
