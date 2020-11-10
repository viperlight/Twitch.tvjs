/* eslint-disable no-console */
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
  // for (let i = 0; i < 10; i++) {
  //   console.log(i);
  //   client.channels.get(channels[0]).send(Math.random()).then(m => {
  //     console.log(m.content)
  //   });
  // }
  // console.log(client.user.color);
  // console.log(client.channels.map(f => f.name));
  // setTimeout(() => {
  //   console.log(client.channels.find(f => f.name == channels[0]));
  // }, 2000);
  // client.channels.map(f => f).forEach(ch => console.log(ch));
});

client.on('warn', console.log);
// client.on('raw', console.log);

client.on('joinRoom', () => {
  // console.log(client.channels.find(f => f.name == channels[0]));
  // client.channels.find(f => f.name == channels[0]).leave();
});

client.on('leaveRoom', (room) => {
  console.log(room.name);
  console.log(client.channels);
});

// client.on('raw_message', (data) => {
//   console.log(data.command);
// });

client.on('chat', (message) => {
  if (message.self) return;
  console.log(client.channels);
  console.log(client.viewers);
  // message.channel.send({
  //   content: 'something cool: ',
  // }).then(m => {
  //   console.log(m);
  // });
  // message.channel.leave();
});

client.login(user, pass);
