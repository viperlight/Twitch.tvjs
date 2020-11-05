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
  CLIENT_ROOMJOIN: 'joinRoom',
  CLIENT_ROOMLEAVE: 'leaveRoom',
  VIEWER_BAN: 'viewerBan'
};

exports.Events_Resolvers = {
  MESSAGE_DUPLICATE_ERROR: '__MESSAGE+DUPLICATE',
  VIEWER_BAN_ERROR: '__VIEWER_BAN+ERROR',
  VIEWER_BAN_SUCCESS: '__VIEWER_BAN+SUCCESS'
};

/**
 * The modes in which a twitch channel is in
 * * 1, Any one can chat
 * * 2, Only followers can chat
 * * 3, Only followers can chat after the time set
 */
exports.ChatTypes = {
  ANYONE: 'any',
  FOLLOWERSONLY: 'followers',
  AFTERTIME: 'followerWait',
};

exports.REGEX = {
  AUTHFORMAT: /^oauth:([a-zA-Z0-9]*)$/,
};
