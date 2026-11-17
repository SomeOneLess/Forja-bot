'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { reply } = require('../helpers/messages');

const execFileAsync = promisify(execFile);

module.exports = {
  voz: async ({ sock, jid, msg, args }) => {
    if (!args) {
      await reply(sock, jid, { text: 'Uso: .voz texto que quieras que diga' }, msg);
      return;
    }

    const tmpDir = os.tmpdir();
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const mp3Path = path.join(tmpDir, `tts-${id}.mp3`);
    const oggPath = path.join(tmpDir, `tts-${id}.ogg`);

    try {
      const texto = args.slice(0, 180);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(texto)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
          'Accept': '*/*'
        }
      });

      if (!res.ok) throw new Error(`Google TTS respondió ${res.status}`);

      const mp3Buffer = Buffer.from(await res.arrayBuffer());
      if (!mp3Buffer.length || mp3Buffer.length < 500) {
        throw new Error('El audio descargado está vacío o es inválido');
      }

      fs.writeFileSync(mp3Path, mp3Buffer);

      await execFileAsync('ffmpeg', [
        '-y', '-i', mp3Path, '-vn', '-c:a', 'libopus', '-b:a', '64k',
        '-ac', '1', '-ar', '48000', '-application', 'voip',
        '-avoid_negative_ts', 'make_zero', oggPath
      ], { timeout: 20000 });

      const oggBuffer = fs.readFileSync(oggPath);
      if (!oggBuffer.length) throw new Error('La conversión a OGG falló');

      await reply(sock, jid, {
        audio: oggBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, msg);
    } catch (err) {
      console.error('Error TTS:', err);
      await reply(sock, jid, { text: `⚠️ No pude generar la voz: ${err.message}` }, msg);
    } finally {
      for (const p of [mp3Path, oggPath]) {
        try { fs.unlinkSync(p); } catch {}
      }
    }
  }
};
