'use strict';

const { BOT_NAME } = require('../config');
const { reply } = require('../helpers/messages');

const HELP = `🤖 *${BOT_NAME} — comandos*

🖼️ *MULTIMEDIA*
• .s — imagen/video a sticker
• .png — sticker citado a PNG
• .meme ARRIBA | ABAJO
• .rotar [90|180|270]
• .flip · .invertir
• .pixelar · .blur
• .rs — reenvía la foto citada
• .voz texto — convierte texto a nota de voz

🎲 *JUEGOS Y DIVERSIÓN*
• .dado [caras] · .moneda · .b8 pregunta
• .vote pregunta | A | B
• .verdad · .reto · .vr
• .yonunca
• .ship
• .retogrupal
• .mpq título | @p1 @p2
• .quien
• .categoria · .ranking · .dilema
• .mimica · .adivina · .cuento · .ruleta
• .estado

🧰 *UTILIDADES*
• .qr texto · .password [largo]
• .tmr 30s
• .hora · .ping · .clima ciudad
• .tr texto
• .actividad

👥 *GRUPOS*
• .admins · .todos
• .bot on/off — solo el dueño puede usar comandos
• .me on/off — solo el dueño puede hablar
• .mute on/off @persona — mutear individualmente (.mute list)
• .id — muestra el JID del chat/grupo actual
• .silencio on/off — solo admins hablan
• .op · .deop (citar)
`;

module.exports = {
  ayuda: async ({ sock, jid, msg }) => {
    await reply(sock, jid, { text: HELP }, msg);
  },
  help: async ({ sock, jid, msg }) => {
    await reply(sock, jid, { text: HELP }, msg);
  }
};
