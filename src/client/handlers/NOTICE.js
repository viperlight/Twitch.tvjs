'use strict';

/**
 * 
 * @param {message} message message data
 * @param {string} message_id message id type
 * @param {string} content message content
 * @param {string} channel event channel
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function (message, message_id, content, channel, WebSocket) {
  console.log(message, message_id, content, channel, WebSocket);
};
