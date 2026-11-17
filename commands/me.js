'use strict';

const { SETTINGS_FILE } = require('../config');
const { reply, isGroupAdmin } = require('../helpers/messages');
const { readJson, writeJson, isGroupJid } = require('../utils');

module.exports = {
  me: async ({ sock, jid, msg, args, sender, isFromMe }) => {
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
      await reply(sock, jid, { text: 'Uso: .me on (solo yo puedo hablar) o .me off' }, msg);
      return;
    }

    const settings = readJson(SETTINGS_FILE, {});
    settings[jid] ||= {};
    settings[jid].meOnly = mode === 'on';
    writeJson(SETTINGS_FILE, settings);

    await reply(sock, jid, {
      text: settings[jid].meOnly
        ? '🔇 *Modo me activado*\nSolo el dueño del bot puede enviar mensajes en este grupo.'
        : '🔊 *Modo me desactivado*\nTodos pueden enviar mensajes.'
    }, msg);
  }
};
