# Twitch.tvjs

Interface with the twitch api

# Install
* require [node v12+](https://nodejs.org/)

```
npm install twitch.tvjs
```

**[Documentation](https://test845a.gitbook.io/twitch-tvjs/)**

# Example usage

```js
const twitch = require('twitch.tvjs');
const client = new twitch.Client({
  channels: ['channel1', 'channel2'],
});

client.on('ready', () => {
  console.log(`${client.user.username} Ready`);
});

client.on('chat', (message) => {
  if (message.self) return;
  if (message.content === 'hello') {
    message.channel.send('hello there :)');
  }
});

client.login('<username>', 'oauth:<password>');
```

