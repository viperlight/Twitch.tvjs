'use strict';

const EventEmitter = require('events');
const { Constants, Events } = require('../../utils/Constants');
const MessageHandlers = require('../handlers/Message.js');
const Utils = require('../../utils/Utils.js');
const ws = require('ws');

/**
 * @extends {EventEmitter}
 */
class ClientWebSocket extends EventEmitter {
  constructor(client) {
    super();

    /**
     * The client 
     * @type {?Client}
     */
    this.client = client;

    /**
     * The WebSocket connection
     * @type {?WebSocket}
     */
    this.socket = null;

    /**
     * @type {boolean}
     */
    this.reconnect = false;

    /**
     * @type {?string}
     */
    this.reason = null;

    /**
     * @type {?setTimeout}
     */
    this.pingTimeout = null;
  }

  /**
   * Connects to twitch server
   * <info>login to twitch wss,
   * more info found here {@link https://dev.twitch.tv/docs/irc/guide#connecting-to-twitch-irc}</info>
   * @param {connectionOptions} ops identify data
   * @returns {void}
   */
  connect(ops) {
    try {
      this.socket = new ws(Constants.GATWAY(443));

      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this, ops);
      this.socket.onclose = this.handleClose.bind(this, ops);
      this.socket.onopen = this.handleOpening.bind(this, ops);
    } catch (error) {
      return error;
    }
  }

  handleOpening(ops) {
    if (this.socket == null || this.socket.readyState !== 1) return;
    const user = ops.username || `justinfan${Math.floor((Math.random()*80000)+1000)}`;
    this.socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    // identify client
    this.socket.send(`PASS ${ops.password}`);
    this.socket.send(`NICK ${user}`);
  } 

  handleClose(ops) {
    this.client.emit(Events.CLIENT_DISCONNECT);

    if (this.client.reconnect) {
      this.client.emit(Events.CLIENT_RECONNECTING);
      setTimeout(() => { this.connect(ops); }, 2000);
    }
    this.socket = null;
  }

  handleError(ops) {
    this.client.emit(Events.CLIENT_DISCONNECT);

    if (this.client.reconnect) {
      this.client.emit(Events.CLIENT_RECONNECTING);
      setTimeout(() => { this.connect(ops); }, 2000);
    }
    this.socket = null;
  }

  handleMessage(event) {
    const pockets = event.data.split('\r\n');
    pockets.forEach(pocket => {
      this.client.emit(Events.RAW, pocket);
      MessageHandlers(Utils.unpack(pocket), this);
    });
  }
}

module.exports = ClientWebSocket;
