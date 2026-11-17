'use strict';

const sharp = require('sharp');

async function bufferToSticker(buffer, type) {
  try {
    let pipeline = sharp(buffer, { failOn: 'none', animated: type === 'video' || type === 'gif' });

    if (type === 'video' || type === 'gif') {
      // Para video/gif, tomar el primer frame o convertir
      pipeline = pipeline.extract({ left: 0, top: 0, width: 512, height: 512 }); // simplificado
    }

    const webp = await pipeline
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 80 })
      .toBuffer();

    return webp;
  } catch (err) {
    throw new Error(`No se pudo convertir a sticker: ${err.message}`);
  }
}

module.exports = { bufferToSticker };
