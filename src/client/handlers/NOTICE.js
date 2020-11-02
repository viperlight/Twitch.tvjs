'use strict';

const { Events, Events_Resolvers } = require('../../utils/Constants');

/**
 * @param {message} message message data
 * @param {string} message_id message id type
 * @param {string} content message content
 * @param {string} channel event channel
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function(message, message_id, content, channel, WebSocket) {
  switch (message_id) {
  case 'msg_duplicate': {
    WebSocket.emit(Events_Resolvers.MESSAGE_DUPLICATE_ERROR, new Error(content));
    WebSocket.client.emit(Events.WARN, content);
    break;
  }

  default: {
    if (content.includes('Login unsuccessful') || content.includes('Login authentication failed')) {
      WebSocket.client.reconnect = false;
      WebSocket.reason = content;
      WebSocket.socket.close();
    } else if (content.includes('Error logging in') || content.includes('Improperly formatted auth')) {
      WebSocket.client.reconnect = false;
      WebSocket.reason = content;
      WebSocket.socket.close();
    } else if (content.includes('Invalid NICK')) {
      WebSocket.client.reconnect = false;
      WebSocket.reason = 'Invalid NICK.';
      WebSocket.socket.close();
    } else {
      WebSocket.client.emit(Events.WARN, `Could not parse NOTICE from tmi.twitch.tv:\n${JSON.stringify(message, null, 4)}`);
    }
    break;
  }
  }
};
