'use usrict';

// Import Twitch.tvjs module
const Twitch = require('twitch.tvjs');

// Create an instance of a Twitch client
// Pass in all channel this client will be in
const client = new Twitch.Client({
  channels: ['CHANNEL_NAME'],
});

/**
 * Ready event will be emited when the client
 * information is reseved. There for client channels might be empty 
 */
client.on('ready', () => {
  console.log(`Ready as ${client.user.username}`);
});

// Chat is on every chat message of a channel
client.on('chat', (msg) => {
  // Return message if its from CLient
  if (msg.self) return;

  // Only reply if message content equals "!ping"
  if (msg.content === '!ping') {
    // message channel "Pong!"
    msg.channel.send('Pong!');
  }
});

// Login to twitch
client.login('<username>', 'oauth:<password>');
