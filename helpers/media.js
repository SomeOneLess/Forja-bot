'use strict';

const sharp = require('sharp');

async function bufferToSticker(buffer, type) {
  try {
    const webp = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 80 })
      .toBuffer();
    return webp;
  } catch (err) {
    throw new Error(`No se pudo convertir a sticker: ${err.message}`);
  }
}

module.exports = { bufferToSticker };
