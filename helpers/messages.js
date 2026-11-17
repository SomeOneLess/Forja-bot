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
    message.stickerMessage?.contextInfo,
    message.buttonsResponseMessage?.contextInfo,
    message.listResponseMessage?.contextInfo,
    message.templateButtonReplyMessage?.contextInfo
  ];
  return candidates.find(c => c?.quotedMessage) || null;
}

function getQuotedMessage(msg) {
  const context = findContextInfo(msg.message);
  if (!context?.quotedMessage) return null;

  // Intentar determinar si el citado es fromMe
  const participant = context.participant || msg.key.participant || msg.key.remoteJid;
  const isQuotedFromMe = participant === msg.key.remoteJid || 
                         (msg.key.fromMe && !context.participant);

  return {
    key: {
      remoteJid: msg.key.remoteJid,
      id: context.stanzaId,
      participant: participant,
      fromMe: isQuotedFromMe
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
  const unwrapped = extractMessageContent(content) || content;
  return !!(
    unwrapped?.viewOnceMessage ||
    unwrapped?.viewOnceMessageV2 ||
    unwrapped?.viewOnceMessageV2Extension ||
    unwrapped?.imageMessage?.viewOnce ||
    unwrapped?.videoMessage?.viewOnce
  );
}

async function downloadViewOnceMedia(quotedOrContent, sock) {
  const fakeMsg = quotedOrContent.message
    ? quotedOrContent
    : { message: quotedOrContent, key: {} };

  try {
    const buffer = await downloadMediaMessage(
      fakeMsg,
      'buffer',
      {},
      {
        logger: { level: 'silent', child: () => ({ level: 'silent' }) },
        reuploadRequest: sock.updateMediaMessage
      }
    );
    const type = getMediaType(fakeMsg);
    return { buffer, type };
  } catch (err) {
    console.error('[downloadViewOnce] fallo:', err.message);
    throw err;
  }
}

async function downloadMedia(sock, msg) {
  const quoted = getQuotedMessage(msg);
  const target = quoted || msg;

  const buffer = await downloadMediaMessage(
    target,
    'buffer',
    {},
    {
      logger: { level: 'silent', child: () => ({ level: 'silent' }) },
      reuploadRequest: sock.updateMediaMessage
    }
  );

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
