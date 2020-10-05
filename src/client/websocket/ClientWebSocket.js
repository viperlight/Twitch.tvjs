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
     * @type {WebSocket}
     */
    this.socket = null;

    /**
     * @type {boolean}
     */
    this.reconnect = false;

    /**
     * @type {string}
     */
    this.reason = null;
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

      this.socket.onopen = this.handleOpening.bind(this, ops);
      this.socket.onclose = this.handleClose.bind(this, ops);
      this.socket.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  handleOpening(ops) {
    if (this.socket == null || this.socket.readyState !== 1) return;
    this.socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    // identify client
    this.socket.send(`PASS ${ops.password}`);
    this.socket.send(`NICK ${ops.username}`);

    this.client.emit(Events.CLIENT_READY);
  } 

  handleClose(ops) {
    this.client.emit(Events.CLIENT_DISCONNECT);

    if (this.client.reconnect) {
      this.client.emit(Events.CLIENT_RECONNECTING);
      setTimeout(() => { this.connect(ops); }, 2000);
    }
    this.socket = null;
  }

  handleMessage(event) {
    console.log(Math.random());
    const pockets = event.data.slice('\r\n');
    MessageHandlers(Utils.msg(pockets), this);
  }
}

module.exports = ClientWebSocket;
