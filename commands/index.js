'use strict';

const fs = require('fs');
const path = require('path');

const commands = {};

const dir = __dirname;
for (const file of fs.readdirSync(dir)) {
  if (file === 'index.js' || !file.endsWith('.js')) continue;
  try {
    const mod = require(path.join(dir, file));
    if (mod && typeof mod === 'object') {
      Object.assign(commands, mod);
    }
  } catch (err) {
    console.error(`Error cargando comando ${file}:`, err.message);
  }
}

module.exports = commands;
