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
     * The client that instantiated this
     * @type {?Client}
     */
    this.client = client;

    /**
     * The WebSocket connection
     * @type {?WebSocket}
     */
    this.socket = null;

    /**
     * Whether or not to reconnect the client if gets disconnected 
     * @type {boolean}
     */
    this.reconnect = this.client.reconnect || false;

    /**
     * The reason for the error/disconnect
     * @type {?string}
     */
    this.reason = null;

    /**
     * @type {?setTimeout}
     * @private
     */
    this.pingTimeout = null;

    /**
     * The time the client hase tryed connecting
     * @type {number}
     */
    this.trys = 0;

    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     * @private
     */
    Object.defineProperty(this, 'ratelimit', {
      value: {
        queue: [],
        total: 120,
        remaining: 120,
        time: 60e3,
        timer: null,
      },
    });
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
      this.trys += 1;
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
    this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    // identify client
    this.send(`PASS ${ops.password}`);
    this.send(`NICK ${user}`);
  } 

  handleClose() {
    this.client.emit(Events.CLIENT_DISCONNECT);
  }

  handleError(error, ops) {
    try {
      this.socket.close();
    } catch(e) {}// eslint-disable-line no-empty
    this.client.emit(Events.CLIENT_DISCONNECT);

    if (this.client.reconnect && this.trys < 20) {
      this.client.emit(Events.CLIENT_RECONNECTING);
      setTimeout(() => { this.connect(ops); }, 2000);
    }
    if (this.trys > 20) {
      this.client.emit(Events.ERROR, error);
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

  /**
   * send a command to the server
   * @param {string} command - server command
   * @param {boolean} important - if this command should be added first in queue
   */
  send(command, important = false) {
    this.ratelimit.queue[important ? 'unshift' : 'push'](command);
    this.process();
  }

  /**
   * Send data to twitch websoket server
   * @param {string} command - server command
   * @private
   */
  _send(command) {
    if (this.socket == null || this.socket.readyState !== 1) return;
    this.socket.send(command);
  }

  /**
   * Process the queue
   * @returns {void}
   * @private
   */
  process() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.timer = setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.process();
      }, this.ratelimit.time);
    }
    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();
      if (!item) return;
      this._send(item);
      this.ratelimit.remaining--;
    }
  }
}

module.exports = ClientWebSocket;
