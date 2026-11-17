'use strict';

const crypto = require('crypto');
const { reply } = require('../helpers/messages');

module.exports = {
  password: async ({ sock, jid, msg, args }) => {
    const length = args ? Number.parseInt(args, 10) : 16;
    if (!Number.isInteger(length) || length < 8 || length > 64) {
      await reply(sock, jid, { text: 'Longitud entre 8 y 64. Ej: .password 20' }, msg);
      return;
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-_';
    const bytes = crypto.randomBytes(length);
    const password = Array.from(bytes, b => chars[b % chars.length]).join('');
    await reply(sock, jid, {
      text: `🔐 Contraseña (${length}):\n\`${password}\`\nGuardala en un lugar seguro.`
    }, msg);
  },
  pass: async (ctx) => module.exports.password(ctx)
};
