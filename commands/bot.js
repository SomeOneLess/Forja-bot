'use strict';

const { SETTINGS_FILE } = require('../config');
const { reply, isGroupAdmin } = require('../helpers/messages');
const { readJson, writeJson, isGroupJid } = require('../utils');

module.exports = {
  bot: async ({ sock, jid, msg, args, sender, isFromMe }) => {
    if (!isGroupJid(jid)) {
      await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
      return;
    }
    if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
      await reply(sock, jid, { text: 'Solo administradores o el dueño del bot pueden usar este comando.' }, msg);
      return;
    }
    const mode = (args || '').toLowerCase().trim();
    if (!['on', 'off'].includes(mode)) {
      await reply(sock, jid, { text: 'Uso: .bot on (ignora comandos de otros) o .bot off' }, msg);
      return;
    }

    const settings = readJson(SETTINGS_FILE, {});
    settings[jid] ||= {};
    settings[jid].botCommandsOnly = mode === 'on';
    writeJson(SETTINGS_FILE, settings);

    await reply(sock, jid, {
      text: settings[jid].botCommandsOnly
        ? '🤖 *Modo bot activado*\nSolo el dueño del bot puede usar comandos en este grupo.'
        : '🤖 *Modo bot desactivado*\nTodos pueden usar comandos.'
    }, msg);
  }
};
