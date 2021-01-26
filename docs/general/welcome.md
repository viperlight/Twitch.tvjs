<div>
  <h1>Twitch.tvjs</h1>
  <a href="https://nodei.co/npm/discord.js/"><img src="https://nodei.co/npm/discord.js.png?downloads=true&stars=true" alt="NPM info" /></a>
</div>

# Welcome!

Wecome to Twitch.tvjs v1.1.3 documentation.

# Install
**Node v12 required**
```
$ npm install twitch.tvjs 
```

# Exampale
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