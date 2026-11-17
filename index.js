'use strict';

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

const { PREFIX, BOT_NAME, SETTINGS_FILE, DESTINO } = require('./config');
const { readJson } = require('./utils');
const { handleMessages } = require('./handlers/message');

let lastSeparatorHour = -1;

function startHourlySeparator(sock) {
  setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour !== lastSeparatorHour) {
      lastSeparatorHour = hour;
      sock.sendMessage(DESTINO, { text: '-----' }).catch(err => {
        console.error('[separador] no pude enviar:', err.message);
      });
      console.log(`[separador] enviado a DESTINO (${hour}:00)`);
    }
  }, 60 * 1000);
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Windows', 'Desktop', '10.0'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    getMessage: async () => undefined
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\nEscaneá el QR con WhatsApp → Dispositivos vinculados:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log(`\n✅ ${BOT_NAME} conectado con Baileys.`);
      console.log(`Escribí ${PREFIX}ayuda en cualquier chat.\n`);
      startHourlySeparator(sock);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log('Conexión cerrada. Código:', statusCode);

      if (shouldReconnect) {
        console.log('Reconectando en 5 segundos...');
        setTimeout(() => startBot(), 5000);
      } else {
        console.log('Sesión cerrada. Borrá auth_info_baileys y volvé a escanear el QR.');
      }
    }
  });

  // Bienvenida automática
  sock.ev.on('group-participants.update', async (update) => {
    try {
      if (update.action !== 'add') return;
      const settings = readJson(SETTINGS_FILE, {});
      const welcome = settings[update.id]?.welcome;
      if (!welcome) return;
      const mentions = update.participants || [];
      const names = mentions.map(id => `@${id.split('@')[0]}`).join(' ');
      await sock.sendMessage(update.id, {
        text: `${welcome}${names ? `\n${names}` : ''}`,
        mentions
      });
    } catch (err) {
      console.error('Error bienvenida:', err.message);
    }
  });

  // Todos los mensajes pasan por el handler
  sock.ev.on('messages.upsert', (data) => handleMessages(sock, data));
}

startBot().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});