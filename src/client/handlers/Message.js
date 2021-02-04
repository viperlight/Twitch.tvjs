'use strict';

const { Events, ChatTypes } = require('../../utils/Constants');
const Queue = require('../../utils/Queue');
const Utils = require('../../utils/Utils');
const Message = require('../../structure/Message');
const Channel = require('../../structure/Channel');
const ClientUser = require('../../structure/ClientUser');
const Viewer = require('../../structure/Viewer');
const Whisper = require('../../structure/Whisper');
const NoticeHandlers = require('./NOTICE');

/**
 * manage message event
 * @param {GatewayMessage} message message data 
 * @param {ClientWebSocket} WebSocket Client socket inst
 */
module.exports = function(message, WebSocket) {
  if (message === null) return;

  /**
   * Emitted after raw evnts has been parsed
   * @event Client#raw_message
   * @param {GatewayMessage} message - parsed gatway message
   */
  WebSocket.client.emit(Events.RAW_MESSAGE, message);

  const channel = message.params[0] || null;
  const message_id = message.tags['msg-id'] || null;
  message.tags.channel = channel;

  // !In testing
  // Emit message for all Message type events
  ['chat', 'cheer'].forEach((event) => {
    WebSocket.client.on(event, (...data) => {
      WebSocket.client.emit(Events.MESSAGE, ...data);
    });
  });

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
        // send back a respons and marked as important
        WebSocket.send('PONG', true);
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
      break;
    
    // connections set
    case '372': {
      WebSocket.sendLoop = setInterval(() => {
        if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) 
          WebSocket.send('PING');

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
      let joinChannels = [];
      if (WebSocket.client.options.channels) {
        joinChannels = Utils.union(WebSocket.client.options.channels, WebSocket.client._channels);
      }
      WebSocket.client._channels = [];

      for (let i = 0; i < joinChannels.length; i++) {
        const channel = joinChannels[i];
        joinQueue.add(async () => {
          if (WebSocket.socket !== null && WebSocket.socket.readyState === 1) {
            WebSocket.client.channels.set(Utils.properChannel(channel), new Channel(WebSocket.client, channel));
            if (!channel || typeof channel !== 'string') 
              throw new Error('INVALID_CHANNEL_TYPE');
            // excute a join command for channel
            await WebSocket.send(`JOIN ${channel}`);
          }
        });
      }

      joinQueue.run();
      break;
    }

    // notice actions
    case 'NOTICE': {
      NoticeHandlers(message, message_id, (message.params[1] || null), channel, WebSocket);
      break;
    }
    // global user information
    case 'GLOBALUSERSTATE': {
      const user = new ClientUser(message.tags);

      WebSocket.client.user = user;
      WebSocket.client.readyAt = Date.now();
      WebSocket.client.ready = true;

      /**
       * Emitted When the clients global user is resived
       * @event Client#ready
       */
      WebSocket.client.emit(Events.CLIENT_READY);
      break;
    }
    // channel user information
    case 'USERSTATE': {
      const statesChannel = WebSocket.client.channels.get(message.params[0]);
      if (message.tags.mod == '1') {
        statesChannel.moderators.set(message.tags['display-name'], new Viewer(WebSocket.client, message.tags));
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

      /**
       * Emitted when the client joins a chnnel/room
       * @event Client#joinRoom
       * @param {Channel} room - The instinc of that joined channel/room
       */
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

    case 'WHISPER': {
      const WhisperViewer = WebSocket.client.viewers.get(message.prefix.split('!')[0]);
      const WhisperMessage = new Whisper(
        WebSocket.client, 
        message.tags,
        {
          author: (
            WhisperViewer ||
            message.prefix.split('!')[0]
          ),
          content: message.params[1],
          id: message.tags['message-id'],
          type: 'whisper',
        }, false
      );

      /**
       * Emitted when the client resives a whisper message
       * @event Client#whisper
       * @param {Whisper} message - That Whisper message
       */
      WebSocket.client.emit(Events.WHISPER, WhisperMessage);
      break;
    }

    // emited on channel start/stop hosting
    case 'HOSTTARGET': {
      const [HostingChannel, channelANDCount] = message.params;
      const [hostedChannel, count] = channelANDCount.split(' ');
      const room = WebSocket.client.channels.get(HostingChannel);
      if (hostedChannel === '-') {
        /**
         * Emitted when a channel stops hosting
         * @event Client#stopHosting
         * @param {Channel} room - The channel that has stoped hosting
         * @param {number} count - The count of viewers
         */
        WebSocket.client.emit(Events.HOSTTARGET_STOP, (room, count));
      } else {
        /**
         * Emitted when a channel starts hosting
         * @event Client#hosting
         * @param {Channel} room - The channel that has started hosting
         * @param {number} count - The count of viewers
         * @param {string} hostedChannel - Name of the channel hosted
         */
        WebSocket.client.emit(Events.HOSTTARGET_START, (room, count, hostedChannel));
      }
      break;
    }
    // emited on channel leave
    case 'PART': {
      const roomData = WebSocket.client.channels.get(channel);
      /**
       * Emitted when the client leaves a channel/room
       * @event Client#leaveRoom
       * @param {Channel} room - The channel/room that the client has left
       */
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
      let viewer;
      const room = WebSocket.client.channels.get(message.params[0]);
      if (WebSocket.client.viewers.has(message.tags['display-name'])) {
        viewer = WebSocket.client.viewers.get(message.tags['display-name']);
        viewer._patch(message.tags);
      } else {
        viewer = new Viewer(WebSocket.client, message.tags);
        WebSocket.client.viewers.set(viewer.username, viewer);
      }
      // check if viwer is a mod of message channel
      if (viewer.mod) {
        room.moderators.set(viewer.username, viewer);
      }

      // eslint-disable-next-line no-prototype-builtins
      if (message.tags.hasOwnProperty('bits')) {
        WebSocket.client.emit(
          Events.CHEER_MEESSAGE, 
          new Message(WebSocket.client, { 
            channel: message.params[0],
            content: message.params[1],
            id: message.tags.id,
            author: viewer,
            type: 'cheer',
          })
        );
      // regular chat message
      } else {
        WebSocket.client.emit(
          Events.CHAT_MESSAGE, 
          new Message(WebSocket.client, { 
            channel: message.params[0],
            content: message.params[1],
            id: message.tags.id,
            author: viewer,
            type: 'chat'
          }, false)
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

/**
 * @typedef {Object} GatewayMessage
 * @property {string} raw - Raw GatewayMessage string
 * @property {Object} tags - Data tags 
 * @property {string} prefix - GatewayMessage type
 * @property {string} command - Action command
 * @property {string[]} params - Extra data
 */ 

/**
 * Emitted on a channel/room chat message
 * @event Client#chat
 * @param {Message} message - The chat message
 */

/**
 * Emitted when a message has property bits
 * @event Client#cheer
 * @param {Message} message - The bits message
 */

/**
 * Emitted on chat or whisper 
 * @event Client#message
 * @param {Message | Whisper} message - Message reseved
 */