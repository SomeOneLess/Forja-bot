'use strict';

const { SETTINGS_FILE } = require('../config');
const { reply, isGroupAdmin, getMentions } = require('../helpers/messages');
const { readJson, writeJson, isGroupJid } = require('../utils');

function jidBase(jid) {
  return String(jid || '').split('@')[0];
}

function isSameUser(a, b) {
  return jidBase(a) === jidBase(b);
}

async function toggleMute({ sock, jid, msg, args, sender, isFromMe }, enable) {
  if (!isGroupJid(jid)) {
    await reply(sock, jid, { text: 'Este comando funciona dentro de un grupo.' }, msg);
    return;
  }
  if (!(await isGroupAdmin(sock, jid, sender)) && !isFromMe) {
    await reply(sock, jid, { text: 'Solo administradores pueden mutear o desmutear.' }, msg);
    return;
  }

  // Soporte para .mute list
  if (!enable && (args || '').trim().toLowerCase() === 'list') {
    const settings = readJson(SETTINGS_FILE, {});
    const muted = settings[jid]?.muted || [];
    if (!muted.length) {
      await reply(sock, jid, { text: 'Nadie está muteado en este grupo.' }, msg);
      return;
    }
    const lines = muted.map(id => `• @${jidBase(id)}`);
    await reply(sock, jid, {
      text: `🔇 *Muteados actuales:*\n${lines.join('\n')}`,
      mentions: muted
    }, msg);
    return;
  }

  const mentions = getMentions(msg);
  if (!mentions.length) {
    await reply(sock, jid, {
      text: enable
        ? 'Tenés que mencionar a alguien.\nUso: .mute @usuario'
        : 'Tenés que mencionar a alguien.\nUso: .unmute @usuario'
    }, msg);
    return;
  }

  const target = mentions[0];
  const settings = readJson(SETTINGS_FILE, {});
  settings[jid] ||= {};
  if (!Array.isArray(settings[jid].muted)) settings[jid].muted = [];

  if (enable) {
    const already = settings[jid].muted.some(id => isSameUser(id, target));
    if (!already) {
      settings[jid].muted.push(target);
    }
    writeJson(SETTINGS_FILE, settings);
    console.log(`[mute] ON ${target} en ${jid}`);
    await reply(sock, jid, {
      text: `🔇 @${jidBase(target)} fue muteado. Sus mensajes serán eliminados.`,
      mentions: [target]
    }, msg);
  } else {
    const before = settings[jid].muted.length;
    settings[jid].muted = settings[jid].muted.filter(id => !isSameUser(id, target));
    writeJson(SETTINGS_FILE, settings);
    const removed = before > settings[jid].muted.length;
    console.log(`[mute] OFF ${target} en ${jid} | removed=${removed}`);
    await reply(sock, jid, {
      text: removed
        ? `🔊 @${jidBase(target)} ya no está muteado.`
        : `⚠️ @${jidBase(target)} no estaba muteado.`,
      mentions: [target]
    }, msg);
  }
}

module.exports = {
  mute: async (ctx) => toggleMute(ctx, true),
  unmute: async (ctx) => toggleMute(ctx, false),
  mutelist: async (ctx) => {
    ctx.args = 'list';
    return toggleMute(ctx, false);
  }
};
