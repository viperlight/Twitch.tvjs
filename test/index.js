const { pass, user } = require('./auth');
const karin = require('../src');
const client = new karin.Client({
  channels: []
});

client.login({
  password: pass,
  username: user
});

