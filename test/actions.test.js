/* eslint-disable no-console */
const { pass, user, channels } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: channels
});

const tests = [
  async (message) => await message.author.ban(),
  // (message) => message.channel.send('somthing'),
  // (message) => message.channel.send({
  //   content: 'somthing else'
  // }),
];

client.on('chat', async (message) => {
  if (message.self) return;
  for await (const test of tests) {
    setTimeout(async () => {
      console.log(await test(message));
    }, 3000);
  }
});

client.login(user, pass);
