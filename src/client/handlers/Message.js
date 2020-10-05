'use strict';

/**
 * 
 * @param {message} message message data 
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function (message, WebSocket) {
  if (message === null) return;

  const channel = message.params[0] || null;
  const content = message.params[1] || null;
  const message_id = message.tags['msg-id'] || null;

  if (message.prefix === null) {
    switch (message.command) {
    case 'PING': {
      if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) {
        WebSocket.socket.send('PONG');
      }
      break;
    }
    
    default:
      console.error(`Could not parse message with no prefix:\n${JSON.stringify(message, null, 4)}`);
      break;
    }
  } else if (message.prefix === 'tmi.twitch.tv') {
    switch (message.command) {
    case '002':
    case '003':
    case '004':
    case '375':
    case '376':
    case 'cap':
      break;
    case '001': {
      WebSocket.client.user = {
        username: message.params[0],
      };
      break;
    }

    case 'NOTICE': {
      switch (message_id) {
      default:{
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
          console.warn(`Could not parse NOTICE from tmi.twitch.tv:\n${JSON.stringify(message, null, 4)}`);
        }
        break;
      }
      }
      break;
    }
    
    default:
      break;
    }
  }
};
