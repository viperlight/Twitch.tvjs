'use strict';

exports.Constants = {
  GATWAY: (port = 8080) => `wss://irc-ws.chat.twitch.tv:${port}`,  
};


exports.Events = {
  CLIENT_READY: 'ready',
  CLIENT_RECONNECTING: 'connecting',
  CLIENT_DISCONNECT: 'disconnected'
};
