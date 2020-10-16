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
  console.log('Ready');
  // console.log(client.user);
  // console.log(client.user.color);
  // console.log(client.channels.map(f => f.name));
  // setTimeout(() => {
  //   console.log(client.channels.find(f => f.name == channels[0]));
  // }, 2000);
  // client.channels.map(f => f).forEach(ch => console.log(ch));
});

client.on('joinRoom', () => {
  // console.log(client.channels.find(f => f.name == channels[0]));
});

// client.on('raw', (data) => {
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

client.login(user, pass);
