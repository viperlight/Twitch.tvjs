'use strict';

const { Events, ChatTypes } = require('../../utils/Constants');
const Queue = require('../../utils/Queue');
const Utils = require('../../utils/Utils');
const Message = require('../../structure/Message');
const Channel = require('../../structure/Channel');
const ClientUser = require('../../structure/ClientUser');
const Viewer = require('../../structure/Viewer');
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
  message.tags.channel = channel;

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
        joinQueue.add(async () => {
          if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) {
            WebSocket.client.channels.set(Utils.properChannel(channel), new Channel(WebSocket.client, channel));
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
    // global user information
    case 'GLOBALUSERSTATE': {
      const user = new ClientUser(message.tags);

      WebSocket.client.user = user;
      WebSocket.client.readyAt = Date.now();
      WebSocket.client.ready = true;
      WebSocket.client.emit(Events.CLIENT_READY);
      break;
    }
    // channel user information
    case 'USERSTATE': {
      const statesChannel = WebSocket.client.channels.get(message.params[0]);
      if (message.tags.mod == '1') {
        statesChannel.moderators.set(message.tags['display-name'], message.tags);
      }
      break;
    }
    // Room/channel joined information
    case 'ROOMSTATE': {
      const room = WebSocket.client.channels.get(message.params[0]);
      if (message.tags['followers-only'] == '-1') {
        room.chatType = ChatTypes.ANYONE;
      } else if (message.tags['followers-only'] == '0') {
        room.chatType = ChatTypes.FOLLOWERSONLY;
      } else if (parseInt(message.tags['followers-only']) >= 1) {
        room.chatType = ChatTypes.AFTERTIME;
      }
      room.subs = message.tags['subs-only'] == '1';
      room.r9k = message.tags.r9k == '1';
      room.id = message.tags['room-id'];
      WebSocket.client.emit(Events.CLIENT_ROOMJOIN, room);
      break;
    }
    
    default:
      break;
    }
  } else if (message.prefix === 'jtv') {
    WebSocket.client.emit(Events.ERROR, 'Unhandled "jtv"');
  } else {
    switch (message.command) {
    case '366':
    case '353':
      break;

    // emited on channel leave
    case 'PART': {
      const roomData = WebSocket.client.channels.get(channel);
      WebSocket.client.emit(Events.CLIENT_ROOMLEAVE, roomData);
      WebSocket.client.channels.delete(channel);
      break;
    }

    // emited on join
    case 'JOIN': {
      if (!WebSocket.client.channels.has(Utils.properChannel(channel))) 
        WebSocket.client.channels.set(Utils.properChannel(channel), new Channel(WebSocket.client, channel));
      break;
    }
    
    // should be reseved on channel message
    case 'PRIVMSG': {
      const viewer = new Viewer(WebSocket.client, message.tags);
      const room = WebSocket.client.channels.get(message.params[0]);
      if (viewer.mod) {
        room.moderators.set(viewer.username, viewer);
      }

      // eslint-disable-next-line no-prototype-builtins
      if (message.tags.hasOwnProperty('bits')) {
        WebSocket.client.emit(
          Events.CHEER_MEESSAGE, 
          new Message(WebSocket.client, viewer, channel, content)
        );
      // regular chat message
      } else {
        WebSocket.client.emit(
          Events.CHAT_MESSAGE, 
          new Message(WebSocket.client, viewer, channel, content, false)
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
