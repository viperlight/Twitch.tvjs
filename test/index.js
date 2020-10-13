const { pass, user, channels } = require('./auth');
const tvjs = require('../src');
const client = new tvjs.Client({
  channels: channels
});

// const testStorage = new tvjs.Storage();

// testStorage.set('bar', 'foo');
// testStorage.set('foo', 'bar');
// console.log(testStorage.has('foo'));
// console.log(testStorage.has('bar'));
// console.log(testStorage.get('bar'));
// console.log(testStorage.delete('bar'));
// console.log(testStorage.has('bar'),);
// testStorage.set('bar', 'foo');
// console.log(testStorage.map((i) => i));
// console.log(testStorage);

client.on('ready', () => {
  console.log(client.user);
  // console.log(client.user.color);
  // console.log(client.channels.map(f => f.name));
  // console.log(client.channels.find(f => f.name == '#xa_puppet'));
});

// client.on('raw_message', (data) => {
//   console.log(data);
// });

client.on('chat', (message) => {
  if (message.self) return;
  // console.log(message.author);
  // console.log(message.channel.parseName);
  message.channel.send({
    content: 'something cool: ',
  });
});

client.login({
  password: pass,
  username: user
});
