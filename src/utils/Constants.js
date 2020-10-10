'use strict';

exports.Constants = {
  GATWAY: (port = 8080) => `wss://irc-ws.chat.twitch.tv:${port}`,  
};

exports.Events = {
  CLIENT_READY: 'ready',
  CLIENT_RECONNECTING: 'connecting',
  CLIENT_DISCONNECT: 'disconnected',
  RAW_MESSAGE: 'raw_message',
  CHAT_MESSAGE: 'chat',
  CHEER_MEESSAGE: 'cheer',
  ERROR: 'error',
  WARN: 'warn',
  RAW: 'raw',
};
