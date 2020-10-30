# Twitch.tvjs

Interface with the twitch api

# Example usage

```js
const twitch = require('twitch.tvjs');
const client = new twitch.Client({
  channels: ['channel1', 'channel2'],
});

client.on('ready', () => {
  console.log(`${client.username} Ready`);
});

client.on('chat', (message) => {
  if (message.self) return;
  if (message.content === 'hello') {
    message.channel.send('hello there :)');
  }
});

client.login('<username>', 'oauth:<password>');
```

