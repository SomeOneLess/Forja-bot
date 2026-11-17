'use strict';

const path = require('path');
const fs = require('fs');

const PREFIX = '.';
const BOT_NAME = 'ForjaBot';
const MAX_DOWNLOAD_BYTES = 12 * 1024 * 1024;
const DATA_DIR = __dirname;
const SETTINGS_FILE = path.join(DATA_DIR, 'forjabot-ajustes.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'forjabot-actividad.json');
const CACHE_DIR = path.join(DATA_DIR, 'cache');

// Destino de los reenvíos discretos y separadores (puede ser tu chat o un grupo)
// Cambialo por el JID del grupo solitario (ej: 120363xxxxxxxx@g.us)
const DESTINO = '120363431629478311@g.us';

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

module.exports = {
  PREFIX,
  BOT_NAME,
  MAX_DOWNLOAD_BYTES,
  DATA_DIR,
  SETTINGS_FILE,
  ACTIVITY_FILE,
  CACHE_DIR,
  DESTINO
};