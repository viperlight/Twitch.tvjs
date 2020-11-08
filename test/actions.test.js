/* eslint-disable no-console */
const { pass, user, channels } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: channels
});

client.on('warn', console.log);

client.on('ready', () => {
  console.log('ready');
});

client.on('chat', async (message) => {
  if (message.self) return;
  // await message.channel.send('hello');
  await message.channel.unban(
    message.author.username
  );
});

client.login(user, pass);
