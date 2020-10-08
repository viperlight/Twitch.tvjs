'use strict';

const { Events } = require('../../utils/Constants');
const Queue = require('../../utils/Queue.js');
const Utils = require('../../utils/Utils.js');
const NoticeHandlers = require('./NOTICE.js');

/**
 * manage message event
 * @param {message} message message data 
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function (message, WebSocket) {
  if (message === null) return;
  WebSocket.client.emit('raw_message', message);

  const channel = message.params[0] || null;
  const content = message.params[1] || null;
  const message_id = message.tags['msg-id'] || null;

  if (message.prefix === null) {
    switch (message.command) {
    case 'PONG': break;
    // send back in im still here response
    case 'PING': {
      if (WebSocket.socket !== null && WebSocket.socket.readyState === 1)
        WebSocket.socket.send('PONG');
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
    
    // server username
    case '001': {
      WebSocket.client.username = message.params[0];
      break;
    }

    // connections set
    case '372': {
      WebSocket.sendLoop = setInterval(() => {
        if (!WebSocket.socket !== null && WebSocket.socket.readyState === 1) 
          WebSocket.socket.send('PING');

        WebSocket.pingTimeout = setTimeout(() => {
          if (WebSocket.socket !== null) {
            this.WebSocket.close();

            clearInterval(WebSocket.sendLoop);
            clearTimeout(WebSocket.pingTimeout);
          }
        }, 9999);
      }, 60000);

      const joinQueue = new Queue(2000);
      const joinChannels = Utils.union(this.opts.channels, this.channels);
      WebSocket.client.channels = [];

      for (let i = 0; i < joinChannels.length; i++) {
        const channel = joinChannels[i];
        joinQueue.add(() => {
          if (!WebSocket.socket !== null && WebSocket.socket.readyState === 1)
            WebSocket.client.join(channel);
        });
      }

      joinQueue.run();
      WebSocket.client.readyAt = Date.now();
      WebSocket.client.emit(Events.CLIENT_READY);
      break;
    }
    case 'NOTICE': {
      NoticeHandlers(message, message_id, content, channel, WebSocket);
      // switch (message_id) {
      // default: {
      //   if (content.includes('Login unsuccessful') || content.includes('Login authentication failed')) {
      //     WebSocket.client.reconnect = false;
      //     WebSocket.reason = content;
      //     WebSocket.socket.close();
      //   } else if (content.includes('Error logging in') || content.includes('Improperly formatted auth')) {
      //     WebSocket.client.reconnect = false;
      //     WebSocket.reason = content;
      //     WebSocket.socket.close();
      //   } else if (content.includes('Invalid NICK')) {
      //     WebSocket.client.reconnect = false;
      //     WebSocket.reason = 'Invalid NICK.';
      //     WebSocket.socket.close();
      //   } else {
      //     console.warn(`Could not parse NOTICE from tmi.twitch.tv:\n${JSON.stringify(message, null, 4)}`);
      //   }
      //   break;
      // }
      // }
      break;
    }
    
    default:
      break;
    }
  }
};
