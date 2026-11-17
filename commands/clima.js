'use strict';

const { reply } = require('../helpers/messages');

module.exports = {
  clima: async ({ sock, jid, msg, args }) => {
    if (!args) {
      await reply(sock, jid, { text: 'Uso: .clima Buenos Aires' }, msg);
      return;
    }
    try {
      const q = encodeURIComponent(args.slice(0, 80));
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=es&format=json`);
      const geo = await geoRes.json();
      const place = geo?.results?.[0];
      if (!place) {
        await reply(sock, jid, { text: 'No encontré esa ciudad.' }, msg);
        return;
      }
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const w = await wRes.json();
      const c = w.current;
      await reply(sock, jid, {
        text:
          `🌤️ *${place.name}${place.admin1 ? ', ' + place.admin1 : ''}*\n` +
          `Temp: ${c.temperature_2m}°C\n` +
          `Humedad: ${c.relative_humidity_2m}%\n` +
          `Viento: ${c.wind_speed_10m} km/h`
      }, msg);
    } catch {
      await reply(sock, jid, { text: '⚠️ No pude consultar el clima ahora.' }, msg);
    }
  }
};
