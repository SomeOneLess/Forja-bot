'use strict';

const { reply } = require('../helpers/messages');
const { parseDuration, randomInt } = require('../utils');

const reminderTimers = new Map();

module.exports = {
  tmr: async ({ sock, jid, msg, args }) => {
    const ms = parseDuration(args);
    if (!ms) {
      await reply(sock, jid, { text: 'Uso: .tmr 30s (también m/h/d, máx 7 días)' }, msg);
      return;
    }
    const timerId = `${jid}:${Date.now()}:${randomInt(100000)}`;
    const timer = setTimeout(() => {
      reminderTimers.delete(timerId);
      sock.sendMessage(jid, { text: `⏰ ¡Terminó el temporizador de ${args}!` }).catch(console.error);
    }, ms);
    reminderTimers.set(timerId, timer);
    await reply(sock, jid, { text: `⏱️ Temporizador iniciado: ${args}.` }, msg);
  }
};
