const { pass, user } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: ['xa_puppet']
});

const testStorage = new tvjs.Storage();

testStorage.set('bar', 'foo');
testStorage.set('foo', 'bar');
console.log(testStorage.has('foo'));
console.log(testStorage.has('bar'));
console.log(testStorage.get('bar'));
console.log(testStorage.delete('bar'));
console.log(testStorage.has('bar'),);
testStorage.set('bar', 'foo');
console.log(testStorage.map((i) => i));

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
