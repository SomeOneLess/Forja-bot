'use strict';

const QRCode = require('qrcode');
const { reply } = require('../helpers/messages');

module.exports = {
  qr: async ({ sock, jid, msg, args }) => {
    if (!args) {
      await reply(sock, jid, { text: 'Uso: .qr texto o enlace' }, msg);
      return;
    }
    const qrBuffer = await QRCode.toBuffer(args.slice(0, 1500), {
      type: 'png', width: 700, margin: 2, errorCorrectionLevel: 'M'
    });
    await reply(sock, jid, {
      image: qrBuffer,
      caption: '📱 Código QR generado por ForjaBot.'
    }, msg);
  }
};
