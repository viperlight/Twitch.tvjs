'use strict';

const { Events } = require('../../utils/Constants');
const Queue = require('../../utils/Queue');
const Utils = require('../../utils/Utils');
const Message = require('../../structure/Message');
const Channel = require('../../structure/Channel');
const ClientUser = require('../../structure/ClientUser');
const NoticeHandlers = require('./NOTICE');

/**
 * manage message event
 * @param {message} message message data 
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function(message, WebSocket) {
  if (message === null) return;
  WebSocket.client.emit(Events.RAW_MESSAGE, message);

  const channel = message.params[0] || null;
  const content = message.params[1] || null;
  const message_id = message.tags['msg-id'] || null;

  if (message.prefix === null) {
    switch (message.command) {
    case 'PONG': {
      const currDate = new Date();
      WebSocket.client.currentLatency = (
        currDate.getTime() - WebSocket.client.latency.getTime()
      ) / 1000;

      clearTimeout(WebSocket.pingTimeout);
      break;
    }
    // send back in im still here response
    case 'PING': {
      if (WebSocket.socket !== null && WebSocket.socket.readyState === 1)
        WebSocket.socket.send('PONG');
      break;
    }
    default:
      WebSocket.client.emit(
        Events.ERROR, 
        `Could not parse message with no prefix:\n${JSON.stringify(message, null, 4)}`
      );
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
    case '001': 
      // WebSocket.client.username = message.params[0];
      break;
    
    // connections set
    case '372': {
      WebSocket.sendLoop = setInterval(() => {
        if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) 
          WebSocket.socket.send('PING');

        WebSocket.client.latency = new Date();
        WebSocket.pingTimeout = setTimeout(() => {
          if (WebSocket.socket !== null) {
            WebSocket.socket.close();
            clearInterval(WebSocket.sendLoop);
            clearTimeout(WebSocket.pingTimeout);
          }
        }, 9999);
      }, 60000);

      const joinQueue = new Queue(2000);
      const joinChannels = Utils.union(WebSocket.client.options.channels, WebSocket.client._channels);
      WebSocket.client._channels = [];

      for (let i = 0; i < joinChannels.length; i++) {
        const channel = joinChannels[i];
        WebSocket.client.channels.set(Utils.properChannel(channel), new Channel(WebSocket.client, channel));
        joinQueue.add(async () => {
          if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) {
            if (!channel || typeof channel !== 'string') 
              throw new Error('INVALID_CHANNEL_TYPE');
            // excute a join command for channel
            await WebSocket.socket.send(`JOIN ${channel}`);
          }
        });
      }

      joinQueue.run();
      break;
    }

    // notice actions
    case 'NOTICE': {
      NoticeHandlers(message, message_id, content, channel, WebSocket);
      break;
    }

    case 'GLOBALUSERSTATE': {
      console.log(message.tags);
      const user = new ClientUser(message.tags);

      WebSocket.client.user = user;
      WebSocket.client.readyAt = Date.now();
      WebSocket.client.ready = true;
      WebSocket.client.emit(Events.CLIENT_READY);
      break;
    }
    case 'USERSTATE': {
      // console.log(message);
      break;
    }
    case 'ROOMSTATE': {
      // console.log(message);
      break;
    }
    
    default:
      break;
    }
  } else if (message.prefix === 'jtv') {
    console.log('jtv event prefix');
  } else {
    switch (message.command) {
    case '366':
    case 'JOIN':
    case '353':
      break;
    
    // should be reseved on channel message
    case 'PRIVMSG': {
      // get user of message
      message.tags.username = message.prefix.split('!')[0];

      // eslint-disable-next-line no-prototype-builtins
      if (message.tags.hasOwnProperty('bits')) {
        WebSocket.client.emit(
          Events.CHEER_MEESSAGE, 
          new Message(WebSocket.client, message.tags, channel, content)
        );
      // regular chat message
      } else {
        WebSocket.client.emit(
          Events.CHAT_MESSAGE, 
          new Message(WebSocket.client, message.tags, channel, content, false)
        );
      }
      break;
    }

    default: {
      WebSocket.client.emit(
        Events.ERROR, 
        `Could not parse message:\n${JSON.stringify(message, null, 4)}`
      );
      break;
    }
    }
  }
};
