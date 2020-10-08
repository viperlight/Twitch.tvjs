'use strict';

const EventEmitter = require('events');
const Utils = require('../utils/Utils.js');
const ClientWebSocket = require('./websocket/ClientWebSocket.js');

/**
 * Main key point for twitch api
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  constructor(options = {}) {
    super(options);

    /**
     * client options
     * @type {?clientOptions}
     */
    this.options = options;

    /**
     * whether or not to reconnect the client if gets disconnected 
     * @type {boolean}
     */
    this.reconnect = this.options.reconnect || false;

    /**
     * @type {string[]}
     */
    this.channels = this.options.channels || [];

    /**
     * User that the client is logged in as
     * @type {?string}
     */
    this.username = null;

    /**
     * @private
     */
    this.ws = new ClientWebSocket(this);

    /**
     * whether or not the client is ready
     * @type {boolean}
     * @public
     */
    this.ready = false;

    /**
     * The time the client was ready at
     * @type {number}
     * @public
     */
    this.readyAt = null;
  }
  
  /**
   * Connects to twitch server
   * @param {connectionOptions} ops identify data
   * @returns {void}
   */
  login(ops) {
    if (typeof ops !== 'object' || !ops) throw new Error('INVALID_IDENTIFICATION');
    if (typeof ops.password !== 'string' || !ops.password && 
      typeof ops.username !== 'string' || !ops.username) throw new Error('INVALID_IDENTIFICATION-DATA');
    try {
      this.ws.connect(ops);
    } catch (err) {
      console.log(err);
    }
  }

  join(channel) {
    if (!channel || typeof channel !== 'string') 
      throw new Error('INVALID_CHANNEL_TYPE');
    channel = Utils.properChannel(channel);
  }
}

module.exports = Client;
