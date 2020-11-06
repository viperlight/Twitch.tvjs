/* eslint-disable no-console */
const { pass, user, channels } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: channels
});

client.on('chat', async (message) => {
  if (message.self) return;
  await message.author.timeout();
});

client.login(user, pass);
