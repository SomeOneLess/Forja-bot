'use strict';

const { downloadMediaMessage, getContentType, extractMessageContent } = require('@whiskeysockets/baileys');

function getText(msg) {
  const message = msg.message || {};
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    ''
  ).trim();
}

function findContextInfo(message) {
  if (!message) return null;
  const candidates = [
    message.extendedTextMessage?.contextInfo,
    message.imageMessage?.contextInfo,
    message.videoMessage?.contextInfo,
    message.audioMessage?.contextInfo,
    message.documentMessage?.contextInfo,
    message.stickerMessage?.contextInfo
  ];
  return candidates.find(c => c && (c.quotedMessage || c.mentionedJid)) || null;
}

function getQuotedMessage(msg) {
  const message = msg.message || {};
  const contexts = [
    message.extendedTextMessage?.contextInfo,
    message.imageMessage?.contextInfo,
    message.videoMessage?.contextInfo,
    message.audioMessage?.contextInfo,
    message.documentMessage?.contextInfo,
    message.stickerMessage?.contextInfo
  ].filter(Boolean);

  const context = contexts.find(c => c.quotedMessage);
  if (!context?.quotedMessage) return null;

  return {
    key: {
      remoteJid: msg.key.remoteJid,
      id: context.stanzaId,
      participant: context.participant || undefined,
      fromMe: false
    },
    message: context.quotedMessage
  };
}

function unwrapViewOnce(content) {
  if (!content) return content;
  return (
    content.viewOnceMessage?.message ||
    content.viewOnceMessageV2?.message ||
    content.viewOnceMessageV2Extension?.message ||
    content
  );
}

function getMediaType(contentOrMsg) {
  const content = contentOrMsg?.message ? contentOrMsg.message : contentOrMsg;
  const unwrapped = unwrapViewOnce(extractMessageContent(content) || content);
  const type = getContentType(unwrapped) || '';

  if (type.includes('image')) return 'image';
  if (type.includes('video')) return 'video';
  if (type.includes('audio')) return 'audio';
  if (type.includes('sticker')) return 'sticker';
  if (type.includes('document')) return 'document';
  return null;
}

function isViewOnceContent(contentOrMsg) {
  const content = contentOrMsg?.message ? contentOrMsg.message : contentOrMsg;
  if (!content) return false;
  const extracted = extractMessageContent(content) || content;
  return !!(
    extracted?.viewOnceMessage ||
    extracted?.viewOnceMessageV2 ||
    extracted?.viewOnceMessageV2Extension ||
    extracted?.imageMessage?.viewOnce ||
    extracted?.videoMessage?.viewOnce
  );
}

async function safeDownload(waMessage, sock) {
  if (!waMessage?.message) throw new Error('Mensaje sin contenido');
  const buffer = await downloadMediaMessage(
    waMessage,
    'buffer',
    {},
    {
      logger: { level: 'silent', child() { return this; } },
      reuploadRequest: sock.updateMediaMessage
    }
  );
  if (!buffer || !buffer.length) throw new Error('Buffer vacío');
  return buffer;
}

async function downloadViewOnceMedia(source, sock) {
  // source puede ser el WAMessage completo o solo el content
  let waMsg;
  if (source.key && source.message) {
    waMsg = source;
  } else {
    // Es solo el content: hay que envolverlo
    const content = source.message || source;
    waMsg = {
      key: source.key || { remoteJid: '', id: '', fromMe: false },
      message: content
    };
  }

  // Asegurarse de que el message esté desenvuelto si es necesario
  const inner = unwrapViewOnce(extractMessageContent(waMsg.message) || waMsg.message);
  if (inner && inner !== waMsg.message) {
    waMsg = { ...waMsg, message: inner };
  }

  const buffer = await safeDownload(waMsg, sock);
  const type = getMediaType(waMsg);
  return { buffer, type };
}

async function downloadMedia(sock, msg) {
  const quoted = getQuotedMessage(msg);
  const target = quoted || msg;

  const buffer = await safeDownload(target, sock);
  const type = getMediaType(target);
  return { buffer, type };
}

async function isGroupAdmin(sock, jid, userJid) {
  try {
    const meta = await sock.groupMetadata(jid);
    const participant = meta.participants.find(p => p.id === userJid);
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
  } catch {
    return false;
  }
}

function getMentions(msg) {
  const message = msg.message || {};
  const contexts = [
    message.extendedTextMessage?.contextInfo,
    message.imageMessage?.contextInfo,
    message.videoMessage?.contextInfo,
    message.audioMessage?.contextInfo,
    message.documentMessage?.contextInfo,
    message.stickerMessage?.contextInfo
  ].filter(Boolean);

  for (const ctx of contexts) {
    if (Array.isArray(ctx.mentionedJid) && ctx.mentionedJid.length) {
      return ctx.mentionedJid;
    }
  }
  return [];
}

function getQuotedKey(msg) {
  const context = findContextInfo(msg.message);
  return context ? { participant: context.participant } : null;
}

async function reply(sock, jid, content, msg) {
  return sock.sendMessage(jid, content, { quoted: msg });
}

async function sendPrivate(sock, jid, text) {
  try {
    await sock.sendMessage(jid, { text });
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  getText,
  getQuotedMessage,
  getMediaType,
  isViewOnceContent,
  downloadViewOnceMedia,
  downloadMedia,
  isGroupAdmin,
  getMentions,
  getQuotedKey,
  reply,
  sendPrivate
};
