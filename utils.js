'use strict';

const fs = require('fs');
const { ACTIVITY_FILE } = require('./config');

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function pick(arr) {
  return arr[randomInt(arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function splitOptions(text) {
  return String(text || '').split('|').map(s => s.trim()).filter(Boolean);
}

function parseDuration(input) {
  const m = String(input).trim().match(/^(\d+)(s|m|h|d)$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const factor = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2].toLowerCase()];
  const ms = n * factor;
  return n > 0 && ms <= 7 * 86400000 ? ms : null;
}

function isGroupJid(jid) {
  return typeof jid === 'string' && jid.endsWith('@g.us');
}

function trackActivity(jid, sender) {
  if (!isGroupJid(jid) || !sender) return;
  const data = readJson(ACTIVITY_FILE, {});
  data[jid] ||= {};
  data[jid][sender] = (data[jid][sender] || 0) + 1;
  writeJson(ACTIVITY_FILE, data);
}

function isExpectedMediaError(err) {
  const msg = String(err?.message || err || '');
  return (
    msg.includes('No valid media URL') ||
    msg.includes('directPath') ||
    msg.includes('mediaKey') ||
    msg.includes('not found') ||
    msg.includes('empty')
  );
}

module.exports = {
  readJson,
  writeJson,
  randomInt,
  pick,
  shuffle,
  splitOptions,
  parseDuration,
  isGroupJid,
  trackActivity,
  isExpectedMediaError
};