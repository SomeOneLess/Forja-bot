'use strict';

const { PREFIX, SETTINGS_FILE, DESTINO } = require('../config');
const {
  getText,
  getQuotedMessage,
  getMediaType,
  isViewOnceContent,
  downloadViewOnceMedia,
  downloadMedia,
  isGroupAdmin
} = require('../helpers/messages');
const {
  isGroupJid,
  trackActivity,
  isExpectedMediaError,
  readJson,
  writeJson
} = require('../utils');
const commands = require('../commands');

// Estado compartido
const processedViewOnce = new Set();

function jidBase(jid) {
  return String(jid || '').split('@')[0];
}

function isMuted(mutedList, sender) {
  if (!Array.isArray(mutedList)) return false;
  const base = jidBase(sender);
  return mutedList.some(id => jidBase(id) === base);
}

function buildMediaPayload(type, buffer) {
  switch (type) {
    case 'image':
      return { image: buffer };
    case 'video':
      return { video: buffer };
    case 'audio':
      return { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: false };
    case 'sticker':
      return { sticker: buffer };
    case 'document':
      return { document: buffer, mimetype: 'application/octet-stream', fileName: 'archivo' };
    default:
      return null;
  }
}

async function tryForwardMedia(sock, buffer, type, contextLog) {
  const payload = buildMediaPayload(type, buffer);
  if (!payload || !buffer?.length) {
    console.warn(`[discreto] payload vacío o tipo no soportado | ${contextLog}`);
    return false;
  }
  await sock.sendMessage(DESTINO, payload);
  console.log(`[discreto] reenviado OK | ${contextLog}`);
  return true;
}

async function handleMessages(sock, { messages }) {
  for (const msg of messages) {
    try {
      if (!msg.message) continue;

      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const text = getText(msg);
      const body = text;
      const msgId = `${msg.key.remoteJid}:${msg.key.id}`;
      const isFromMe = msg.key.fromMe;

      // Contar actividad
      if (isGroupJid(jid) && !isFromMe) {
        trackActivity(jid, sender);
      }

      // ========== VIEW-ONCE AUTOMÁTICO ==========
      if (!isFromMe && isViewOnceContent(msg.message) && !processedViewOnce.has(msgId)) {
        const type = getMediaType(msg.message) || 'unknown';
        console.log(`[view-once auto] detectado tipo=${type} de=${sender}`);
        if (type === 'image' || type === 'video' || type === 'unknown') {
          try {
            const { buffer, type: mediaType } = await downloadViewOnceMedia(msg.message, sock);
            const finalType = mediaType || type;
            if (await tryForwardMedia(sock, buffer, finalType, `view-once auto tipo=${finalType} de=${sender}`)) {
              processedViewOnce.add(msgId);
            }
          } catch (err) {
            if (!isExpectedMediaError(err)) {
              console.error(`[view-once auto] ERROR de=${sender} | ${err.message}`);
            }
          }
        }
      }

      // ========== COMANDO DISCRETO (citar multimedia) ==========
      // Funciona para vos (isFromMe) y para otros
      if (!body.startsWith(PREFIX)) {
        const quoted = getQuotedMessage(msg);
        if (quoted) {
          const quotedType = getMediaType(quoted);
          const isViewOnce = isViewOnceContent(quoted);
          const supported = ['image', 'video', 'audio', 'sticker', 'document'];

          console.log(`[discreto] cita detectada | isFromMe=${isFromMe} | tipo=${quotedType} | viewOnce=${isViewOnce} | jid=${jid}`);

          if (supported.includes(quotedType)) {
            try {
              let buffer, type;
              if (isViewOnce) {
                ({ buffer, type } = await downloadViewOnceMedia(quoted, sock));
              } else {
                ({ buffer, type } = await downloadMedia(sock, msg));
              }
              const finalType = type || quotedType;
              await tryForwardMedia(
                sock,
                buffer,
                finalType,
                `tipo=${finalType} viewOnce=${isViewOnce} citadoPor=${isFromMe ? 'yo' : sender} jid=${jid}`
              );
            } catch (err) {
              if (!isExpectedMediaError(err)) {
                console.error(`[discreto] ERROR | tipo=${quotedType} isFromMe=${isFromMe} | ${err.message}`);
              } else {
                console.log(`[discreto] error esperado | tipo=${quotedType}`);
              }
            }
            continue;
          }
        }
      }

      // ========== MODOS DE SILENCIO (botOnly + mute individual) ==========
      if (isGroupJid(jid) && !isFromMe) {
        const settings = readJson(SETTINGS_FILE, {});
        const g = settings[jid] || {};
        const mutedList = Array.isArray(g.muted) ? g.muted : [];
        if (g.meOnly || isMuted(mutedList, sender)) {
          try {
            await sock.sendMessage(jid, { delete: msg.key });
            console.log(`[silencio] eliminado de ${sender} en ${jid} (meOnly=${!!g.meOnly} muted=${isMuted(mutedList, sender)})`);
          } catch (err) {
            console.error(`[silencio] no pude eliminar: ${err.message}`);
          }
          continue;
        }
      }

      if (!body.startsWith(PREFIX)) continue;

      // Chequeo de permisos para comandos
      if (isGroupJid(jid) && !isFromMe) {
        const settings = readJson(SETTINGS_FILE, {});
        const g = settings[jid] || {};
        const commandPeek = body.slice(1).split(/\s+/)[0].toLowerCase();

        // .bot on → ignora comandos de otros (no afecta discreto)
        if (g.botCommandsOnly && !['bot', 'me', 'mute', 'ayuda', 'help', 'id'].includes(commandPeek)) {
          continue;
        }
      }

      const match = body.match(/^\.(\S+)(?:\s+([\s\S]*))?$/);
      if (!match) continue;

      const command = match[1].toLowerCase();
      const args = (match[2] || '').trim();

      console.log(`→ comando: .${command} | de: ${isFromMe ? 'yo' : sender} | jid=${jid}`);

      const handler = commands[command];
      if (handler) {
        await handler({
          sock,
          jid,
          msg,
          args,
          sender,
          isFromMe,
          command
        });
      }
    } catch (err) {
      console.error('Error procesando mensaje:', err);
      try {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `⚠️ No pude completar el comando: ${err.message || 'error inesperado'}`
        }, { quoted: msg });
      } catch {}
    }
  }
}

module.exports = { handleMessages };
