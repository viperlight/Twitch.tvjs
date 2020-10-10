const { pass, user } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: ['xa_puppet']
});

client.on('ready', () => {
  console.log('Ready');
});

client.on('raw_message', (data) => {
  console.log(data.command);
});

client.on('chat', (message) => console.log(message));

client.login({
  password: pass,
  username: user
});
