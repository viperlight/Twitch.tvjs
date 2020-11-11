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
  VIEWER_BAN: 'viewerBan',
  VIEWER_UNBAN: 'viewerUnban',
  VIEWER_TIMEOUT: 'viewerTimeout',
};

exports.Events_Resolvers = {
  MESSAGE_DUPLICATE_ERROR: '__MESSAGE+DUPLICATE',
  VIEWER_BAN_ERROR: '__VIEWER_BAN+ERROR',
  VIEWER_BAN_SUCCESS: '__VIEWER_BAN+SUCCESS',
  VIEWER_TIMEOUT_ERROR: '__VIEWER_TIMEOUT+ERROR',
  VIEWER_TIMEOUT_SUCCESS: '__VIEWER_TIMEOUT+SUCCESS',
  VIEWER_UNBAN_ERROR: '__VIEWER_UNBAN+ERROR',
  VIEWER_UNBAN_SUCCESS: '__VIEWER_UNBAN+SUCCESS',
  NO_PERMISSIONS: '__NO_PERMISSIONS',
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

exports.NO_PERMISSION_EMITS = [
  this.Events_Resolvers.VIEWER_BAN_ERROR,
  this.Events_Resolvers.VIEWER_TIMEOUT_ERROR,
  this.Events_Resolvers.VIEWER_UNBAN_ERROR,
  this.Events_Resolvers.NO_PERMISSIONS,
];

exports.ERRORS_MSG = {
  MUST_BE: (param, must) => `Parameter "${param}" must be ${must}`
}