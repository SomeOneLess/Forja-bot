'use strict';

const {
  downloadMediaMessage,
  downloadContentFromMessage,
  getContentType,
  extractMessageContent,
  normalizeMessageContent
} = require('@whiskeysockets/baileys');

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
      participant: context.participant,
      fromMe: false
    },
    message: context.quotedMessage
  };
}

function deepUnwrap(content) {
  if (!content) return content;
  let current = extractMessageContent(content) || content;
  for (let i = 0; i < 6; i++) {
    const next =
      current?.viewOnceMessage?.message ||
      current?.viewOnceMessageV2?.message ||
      current?.viewOnceMessageV2Extension?.message ||
      current?.ephemeralMessage?.message ||
      current?.documentWithCaptionMessage?.message ||
      current?.editedMessage?.message ||
      current?.associatedChildMessage?.message;
    if (!next || next === current) break;
    current = next;
  }
  return current;
}

function getMediaType(contentOrMsg) {
  const content = contentOrMsg?.message ? contentOrMsg.message : contentOrMsg;
  const unwrapped = deepUnwrap(content);
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
  const raw = extractMessageContent(content) || content;
  return !!(
    raw?.viewOnceMessage ||
    raw?.viewOnceMessageV2 ||
    raw?.viewOnceMessageV2Extension ||
    raw?.imageMessage?.viewOnce ||
    raw?.videoMessage?.viewOnce ||
    contentOrMsg?.key?.isViewOnce
  );
}

function getInnerMedia(content) {
  const unwrapped = deepUnwrap(content);
  if (!unwrapped) return null;
  if (unwrapped.imageMessage) return { media: unwrapped.imageMessage, type: 'image' };
  if (unwrapped.videoMessage) return { media: unwrapped.videoMessage, type: 'video' };
  if (unwrapped.audioMessage) return { media: unwrapped.audioMessage, type: 'audio' };
  if (unwrapped.stickerMessage) return { media: unwrapped.stickerMessage, type: 'sticker' };
  if (unwrapped.documentMessage) return { media: unwrapped.documentMessage, type: 'document' };
  return null;
}

async function safeDownloadMediaMessage(sock, message, context = '') {
  const logger = { level: 'silent', child() { return this; } };
  const opts = {
    logger,
    reuploadRequest: sock.updateMediaMessage
  };

  try {
    const buffer = await downloadMediaMessage(message, 'buffer', {}, opts);
    if (buffer?.length) return buffer;
  } catch (err) {
    console.warn(`[download] buffer falló ${context}: ${err.message}`);
  }

  // Fallback stream mode (más fiable en algunos casos, especialmente audio/VO)
  try {
    const stream = await downloadMediaMessage(message, 'stream', {}, opts);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    if (buffer?.length) return buffer;
  } catch (err) {
    console.warn(`[download] stream falló ${context}: ${err.message}`);
  }

  throw new Error('No se pudo descargar la media');
}

async function downloadViewOnceMedia(source, sock) {
  // Preferir el mensaje original si tiene key + message (viene del cache o del upsert)
  const hasOriginal = source?.key && source?.message;
  const content = hasOriginal ? source.message : (source?.message || source);
  const key = hasOriginal ? source.key : (source?.key || { remoteJid: '', id: '', fromMe: false });

  const inner = getInnerMedia(content);
  if (!inner) throw new Error('No se encontró media interna en VO');

  // 1) Intento con el mensaje tal cual (Baileys normaliza internamente)
  if (hasOriginal) {
    try {
      const buffer = await safeDownloadMediaMessage(sock, source, 'VO-original');
      if (buffer?.length) return { buffer, type: inner.type };
    } catch (err) {
      console.warn(`[vo] original falló: ${err.message}`);
    }
  }

  // 2) Intento con contenido normalizado
  const unwrapped = deepUnwrap(content);
  const normalized = normalizeMessageContent(content) || unwrapped;
  const fakeMsg = { key, message: normalized };

  try {
    const buffer = await safeDownloadMediaMessage(sock, fakeMsg, 'VO-normalized');
    if (buffer?.length) return { buffer, type: inner.type };
  } catch (err1) {
    console.warn(`[vo] normalized falló: ${err1.message}`);
  }

  // 3) updateMediaMessage + reintento
  try {
    if (typeof sock.updateMediaMessage === 'function' && hasOriginal) {
      await sock.updateMediaMessage(source);
      const buffer = await safeDownloadMediaMessage(sock, source, 'VO-after-update');
      if (buffer?.length) return { buffer, type: inner.type };
    }
  } catch (err2) {
    console.warn(`[vo] update falló: ${err2.message}`);
  }

  // 4) downloadContentFromMessage directo si hay campos
  if (inner.media && (inner.media.mediaKey || inner.media.directPath || inner.media.url)) {
    try {
      const stream = await downloadContentFromMessage(inner.media, inner.type);
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      if (buffer.length) return { buffer, type: inner.type };
    } catch (err3) {
      console.warn(`[vo] contentFromMessage falló: ${err3.message}`);
    }
  }

  throw new Error('No valid media URL or directPath present in message');
}

async function downloadMedia(sock, msg) {
  const quoted = getQuotedMessage(msg);
  const target = quoted || msg;
  const content = target.message || msg.message;

  const unwrapped = deepUnwrap(content);
  const inner = getInnerMedia(content);
  const type = getMediaType(target) || inner?.type || null;

  if (!inner && !type) {
    throw new Error('No se encontró media para descargar');
  }

  const normalized = normalizeMessageContent(content) || unwrapped;
  const fakeMsg = {
    key: target.key || msg.key,
    message: normalized
  };

  try {
    const buffer = await safeDownloadMediaMessage(sock, fakeMsg, 'media');
    return { buffer, type: type || inner?.type };
  } catch (err) {
    // Fallback final con contentFromMessage
    if (inner?.media && (inner.media.mediaKey || inner.media.directPath || inner.media.url)) {
      try {
        const stream = await downloadContentFromMessage(inner.media, inner.type);
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        if (buffer.length) return { buffer, type: inner.type };
      } catch {}
    }
    throw err;
  }
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
  const message = msg.message || {};
  const contexts = [
    message.extendedTextMessage?.contextInfo,
    message.imageMessage?.contextInfo,
    message.videoMessage?.contextInfo
  ].filter(Boolean);
  const context = contexts.find(c => c.participant);
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
