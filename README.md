# Twitch.tvjs

Twitch.tvjs is a powerful node.js module that allows you to interact with the twitch very easily. 
It is an object-oriented JS librarie, making your code significantly tidier and easier to comprehend.

# Install
* require [node v12+](https://nodejs.org/)

```
$ npm install twitch.tvjs
```

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
  if (message.content === '!ping') {
    message.reply('!Pong');
  }
});

client.login('<username>', 'oauth:<auth-token>');
```

# Links

**[Documentation v1.0.4](https://test845a.gitbook.io/twitch-tvjs/)**
**[Website](https://viperlight.github.io/)** ([Code](https://github.com/viperlight/twitch-docs-website))
**[repo](https://github.com/viperlight/Twitch.tvjs/)**