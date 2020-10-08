const { pass, user } = require('./auth');
const karin = require('../src');
const client = new karin.Client({
  channels: ['xa_puppet']
});

client.on('ready', () => {
  console.log(client.username);
});

client.on('raw_message', console.log);

client.login({
  password: pass,
  username: user
});
